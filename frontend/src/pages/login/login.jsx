import styles from "./login.module.css";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

function LoginPage() {
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  function handleInputChange(e) {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (submitting) return;

    setError(null);
    setSubmitting(true);

    try {
      await login(
        formData.loginId,
        formData.password
      );

      console.log("Login successful");

      navigate("/");
    } catch (error) {
      setError(
        error.message || "Unable to connect to the server."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.loginPage}>
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      <div className={styles.loginForm}>
        <div className={styles.loginHeading}>
          <h1>Login</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="loginId"
              className={styles.formLabel}
            >
              Login ID:
            </label>

            <input
              type="text"
              id="loginId"
              name="loginId"
              value={formData.loginId}
              onChange={handleInputChange}
              className={styles.formInput}
              placeholder="Enter Login ID"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className={styles.formLabel}
            >
              Password:
            </label>

            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={styles.formInput}
              placeholder="Enter Password"
              required
            />
          </div>

          <div>
            Don't have an account?

            <Link
              to="/register"
              className={styles.registerLink}
            >
              {" "}
              Register here.
            </Link>
          </div>

          <button
            type="submit"
            className={styles.formButton}
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;