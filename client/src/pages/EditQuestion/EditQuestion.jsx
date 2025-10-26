import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import styles from "./EditQuestion.module.css";
import { QuestionContext } from "../../context/QuestionProvider";
import { UserContext } from "../../context/UserProvider";
import DOMPurify from "dompurify";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import axiosInstance from "../../API/axios";

const EditQuestion = () => {
  const { question_id } = useParams();
  const navigate = useNavigate();
  const [user] = useContext(UserContext);
  const { questions, setQuestions } = useContext(QuestionContext);
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const quillRef = useRef(null);
  const quillInstance = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const question = questions.find((q) => q.question_id == question_id);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        let questionData;

        if (!question) {
          const response = await axiosInstance.get(`/question/${question_id}`);

          questionData = response.data;
          setQuestions((prev) => [...prev, questionData]);
        } else {
          questionData = question;
        }

        const sanitizedContent = DOMPurify.sanitize(
          questionData.question_description || ""
        );

        setEditorContent(sanitizedContent);
        setOriginalContent(sanitizedContent);
        reset({
          title: questionData.title,
          tag: questionData.tag || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load question data.");
        setLoading(false);
      }
    };

    if (token) {
      fetchQuestion();
    }
  }, [question, question_id, token, reset, setQuestions]);

  useEffect(() => {
    if (quillRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link"],
            ["clean"],
          ],
        },
      });

      quillInstance.current.root.innerHTML = editorContent;
      quillInstance.current.on("text-change", () => {
        setEditorContent(
          DOMPurify.sanitize(quillInstance.current.root.innerHTML)
        );
      });
    }
  }, [editorContent]);

  const onSubmit = async (data) => {
    if (!editorContent.trim()) {
      setError("Question description cannot be empty");
      return;
    }

    try {
      const updatedQuestion = {
        title: data.title,
        question_description: editorContent,
        tag: data.tag || "",
      };

      await axiosInstance.put(`/question/${question_id}`, updatedQuestion);

      // Update local state
      setQuestions((prev) =>
        prev.map((q) =>
          q.question_id == question_id ? { ...q, ...updatedQuestion } : q
        )
      );

      navigate(`/questions/${question_id}`);
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update question. Please try again.");
    }
  };

  const handleDiscard = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading question...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Edit Your Question</h2>
        <p>Make changes to your question below</p>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Question Title
          </label>
          <input
            id="title"
            type="text"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 10,
                message: "Title should be at least 10 characters long",
              },
            })}
            className={styles.input}
            placeholder="Enter a clear and descriptive title..."
          />
          {errors.title && (
            <p className={styles.errorText}>{errors.title.message}</p>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Question Preview</label>
          <div
            className={styles.previewBox}
            dangerouslySetInnerHTML={{ __html: editorContent }}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Edit Question Description</label>
          <div ref={quillRef} className={styles.quillEditor}></div>
          <small className={styles.helpText}>
            Describe your problem in detail. Include what you tried and what you
            expected to happen.
          </small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="tag" className={styles.label}>
            Tags (Optional)
          </label>
          <input
            id="tag"
            type="text"
            {...register("tag")}
            className={styles.input}
            placeholder="e.g., javascript, react, nodejs"
          />
          <small className={styles.helpText}>
            Add tags to help others find your question (comma-separated)
          </small>
        </div>

        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
          <button
            type="button"
            className={styles.discardButton}
            onClick={handleDiscard}
          >
            Discard Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditQuestion;
