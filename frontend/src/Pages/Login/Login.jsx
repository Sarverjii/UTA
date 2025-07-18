import React, { useState } from "react";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import { toast } from "sonner"; // Import toast from sonner
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/user.slice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State to manage the active login type (Player, Coach, Academy, District)
  const [loginType, setLoginType] = useState("Player"); // Default to Player login

  // State for form data
  const [loginForm, setLoginForm] = useState({
    identifier: "", // Can be email or phone number
    password: "",
  });

  // State for loading status to disable button during API call
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles changes to form input fields.
   * Updates the loginForm state.
   * @param {Object} e - The event object from the input change.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles the login button click.
   * Integrates the API call for user login.
   */
  const handleLogin = async () => {
    // Basic client-side validation
    if (!loginForm.identifier || !loginForm.password) {
      toast.warning("Please enter both your email/phone and password.");
      return;
    }

    setIsLoading(true); // Start loading state

    // Define your backend login endpoint using the environment variable
    const LOGIN_API_ENDPOINT = `${
      import.meta.env.VITE_APP_BACKEND_URL
    }/api/member/login`;

    const loginPromise = axios.post(
      LOGIN_API_ENDPOINT,
      {
        type: loginType, // Send the selected login type
        identifier: loginForm.identifier,
        password: loginForm.password,
      },
      {
        withCredentials: true, // Important: Allows sending and receiving cookies (for JWT token)
      }
    );

    toast.promise(loginPromise, {
      loading: "Logging in...",
      success: (res) => {
        // On successful login, you might want to:
        // 1. Store user data in global state (e.g., Context API, Redux)
        // 2. Redirect the user to the dashboard
        const newUser = { ...res.data.user, type: loginType };
        dispatch(setUser(newUser));
        navigate("/"); // Redirect to dashboard on success
        // You can also clear the form here if needed:
        // setLoginForm({ identifier: "", password: "" });
        return res.data.message || `${loginType} logged in successfully!`;
      },
      error: (err) => {
        console.error("Login error:", err);
        // Extract error message from backend response if available
        const errorMessage =
          err.response?.data?.message ||
          "Login failed. Please check your credentials.";
        return errorMessage;
      },
      finally: () => {
        setIsLoading(false); // Stop loading regardless of success or failure
      },
    });
  };

  return (
    <div className={styles.rootContainer}>
      <div className={styles.layoutContainer}>
        <div className={styles.mainContentWrapper}>
          <div className={styles.contentContainer}>
            <h2 className={styles.loginTitle}>Login to Your Account</h2>

            {/* Login Type Selection Buttons */}
            <div className={styles.typeButtonsContainer}>
              <button
                className={`${styles.typeButton} ${
                  loginType === "Player" ? styles.activeTypeButton : ""
                }`}
                onClick={() => setLoginType("Player")}
                disabled={isLoading} // Disable buttons during loading
              >
                Player Login
              </button>
              <button
                className={`${styles.typeButton} ${
                  loginType === "Coach" ? styles.activeTypeButton : ""
                }`}
                onClick={() => setLoginType("Coach")}
                disabled={isLoading}
              >
                Coach Login
              </button>
              <button
                className={`${styles.typeButton} ${
                  loginType === "Academy" ? styles.activeTypeButton : ""
                }`}
                onClick={() => setLoginType("Academy")}
                disabled={isLoading}
              >
                Academy Login
              </button>
              <button
                className={`${styles.typeButton} ${
                  loginType === "District" ? styles.activeTypeButton : ""
                }`}
                onClick={() => setLoginType("District")}
                disabled={isLoading}
              >
                District Login
              </button>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formField}>
                <p className={styles.fieldLabel}>Email or Phone Number</p>
                <input
                  name="identifier"
                  placeholder="Enter your email or phone number"
                  className={styles.formInput}
                  type="text"
                  value={loginForm.identifier}
                  onChange={handleChange}
                  disabled={isLoading} // Disable input during loading
                />
              </label>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formField}>
                <p className={styles.fieldLabel}>Password</p>
                <input
                  name="password"
                  placeholder="Enter your password"
                  className={styles.formInput}
                  type="password"
                  value={loginForm.password}
                  onChange={handleChange}
                  disabled={isLoading} // Disable input during loading
                />
              </label>
            </div>
            <div className={styles.submitButtonContainer}>
              <button
                className={styles.submitButton}
                onClick={handleLogin}
                disabled={isLoading} // Disable submit button during loading
              >
                <span className={styles.submitButtonText}>
                  {isLoading ? "Logging in..." : "Login"}
                </span>
              </button>
            </div>
            <p className={styles.forgotPasswordText}>Forgot Password?</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
