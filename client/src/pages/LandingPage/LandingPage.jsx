import React from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";

const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      <div className={styles.textDiv}>
        <h2>
          Bypass the Industrial,
          <br />
          Dive into the Digital!
        </h2>

        <p>
          Before us is a golden opportunity, demanding us to take a bold step
          forward and join the new digital era.
        </p>

        <div className={styles.linkDiv}>
          <Link to="/users/register" className={styles.createAccount}>
            Create Account
          </Link>
          <Link to="/users/login" className={styles.signIn}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
