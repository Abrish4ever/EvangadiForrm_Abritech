<div className={styles.leftWrapper}>
  <div className={styles.formContainer}>
    <h1>Login</h1>
    <form onSubmit={handleSubmit}>
      <div className={styles.inputGroup}>
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}
      {successMessage && <div className={styles.success}>{successMessage}</div>}

      <h3 className={styles.forgot__password}>
        <Link to="/forget-password">Forgot your password?</Link>
      </h3>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? (
          <>
            <ClipLoader size={20} color="#36d7b7" />
            Logging in...
          </>
        ) : (
          "Log in"
        )}
      </button>
    </form>

    <h3 className={styles.registerLink}>
      Don't have an account?{" "}
      <Link
        className={styles["text-pr"]}
        style={{ color: "orange" }}
        to="/users/register"
      >
        Sign up
      </Link>
    </h3>
  </div>
</div>;
