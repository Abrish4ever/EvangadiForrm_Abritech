import React from 'react';
import styles from "./HowItWorks.module.css";

const HowItWorks = () => {
  return (
    <div className={styles.container}>
      <div className={styles.intro}>
        <h1>How to Use Evangadi Networks Q&A</h1>
        <p><span>Welcome to Evangadi Networks Q&A </span>— a community 
        where learners and professionals come together to ask questions,
        share knowledge, and grow together. Follow this simple guide to
        get started.</p>
      </div>

      <div className={styles.partition}> 
        <h2>1. Create an Account</h2>
        <p>To participate in discussions, you’ll need to sign up first.</p>
        <ol>
          <li>Click the “Sign In” button at the top-right corner of the page.</li>
          <li>Switch to the “Create a new account” tab.</li>
          <li>Fill in your Username, First Name, Last Name, Email, and Password.</li>
          <li>Click “Agree and Join” to complete your registration.</li>
          <li>Once done, you’ll see a confirmation message that your account has been created successfully.</li>
        </ol>
      </div>

      <div className={styles.partition}>
        <h2>2. Log In to Your Account</h2>
        <p>Already have an account? Here’s how to log in:</p>
        <ol>
          <li>Click “Sign In” in the top-right corner.</li>
          <li>Enter your registered Email and Password.</li>
          <li>Click “Login” to access your account and start exploring.</li>
        </ol>
      </div>

      <div className={styles.partition}>
        <h2>3. Asking a Question</h2>   
        <p>Got a question? Here’s how to share it with the community:</p>
        <ol>
          <li>After logging in, click “Ask Question” on the Home page.</li>
          <li>Enter your Title (a short summary) and Description (details about your question).</li>
          <li>Click “Post Your Question” to submit it.</li>
          <li>Your question will now appear on the Home page where other users can view and respond.</li>
        </ol>
      </div>

      <div className={styles.partition}>
        <h2>4. Viewing Questions and Answers</h2>
        <p>To explore what others are asking and sharing:</p>
        <ol>
          <li>Go to the Home page to see the latest questions.</li>
          <li>Click on any question title to view its details and answers.</li>
          <li>If there are no answers yet, you’ll see an option encouraging you to contribute one.</li>
        </ol>
      </div>

      <div className={styles.partition}>
        <h2>5. Submitting an Answer</h2>
        <p>Want to help others? Here’s how to post an answer:</p>
        <ol>
          <li>Open the question you’d like to answer.</li>
          <li>Scroll to the “Answer The Top Question” section.</li>
          <li>Type your answer in the provided text box.</li>
          <li>Click “Post Your Answer” to share it.</li>
          <li>Your answer will appear under the Community Answers section.</li>
        </ol>
      </div>

      <div className={styles.partition}>
        <h2>6. Logging Out</h2>
        <p>To safely log out from your account:</p>
        <ol>
          <li>Click the “Logout” button located in the top navigation bar.</li>
          <li>You’ll be signed out and redirected back to the login page.</li>
        </ol>
      </div>   

      <div className={styles.partition}>
        <h2>7. Support & Feedback</h2>
        <p>Need help or want to share feedback?</p>
        <ol>
          <li>Visit the “About” page to contact our support team.</li>
          <li>Use the feedback form in your profile to suggest improvements or report issues.</li>
        </ol>
      </div>

      <hr />
      <div className={styles.tip}>
        <p>💡 Tip: Stay active, help others, and be part of the Evangadi community that grows together through learning and sharing!</p>
      </div>
    </div>
  );
}

export default HowItWorks;
