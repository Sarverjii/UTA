import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import styles from "./Nissan_Login.module.css";

const Nissan_Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    whatsappNumber: "",
    dob: "",
  });

  const loginHandler = async (e) => {
    e.preventDefault();
    if (!login.whatsappNumber || !login.dob) {
      return toast.error(
        "Please enter your WhatsApp number and date of birth."
      );
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/player/login`,
        login,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate(`/nissan/login/${res.data.data.id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Incorrect Credentials");
      console.log(error);
    }
  };

  return (
    <div className={styles.loginPage}>
      <header className={styles.header}>
        <div className={styles.headerLogoGroup}>
          <div className={styles.logoIcon}>
            <img src="/logo.png" alt="UTA LOGO" />
            <h2 className={styles.headerTitle}>
              Uttranchal Tennis Association
            </h2>
          </div>
        </div>
        <div className={styles.headerNavActions}>
          <div className={styles.headerButtons}>
            <Link to="/Nissan" className={styles.backButton}>
              <span className={styles.buttonText}>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className={styles.loginContainer}>
        <form className={styles.loginForm} onSubmit={loginHandler}>
          <h2 className={styles.formTitle}>Player Login</h2>
          <p className={styles.formSubtitle}>
            Access your player dashboard to manage your events.
          </p>

          <div className={styles.inputGroup}>
            <label htmlFor="whatsappNumber" className={styles.label}>
              WhatsApp Number
            </label>
            <input
              type="tel"
              id="whatsappNumber"
              className={styles.input}
              placeholder="Enter your WhatsApp number"
              value={login.whatsappNumber}
              onChange={(e) =>
                setLogin({ ...login, whatsappNumber: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="dob" className={styles.label}>
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              className={styles.input}
              value={login.dob}
              onChange={(e) => setLogin({ ...login, dob: e.target.value })}
              required
            />
          </div>

          <button type="submit" className={styles.loginButton}>
            Login
          </button>

          <p className={styles.registerPrompt}>
            Don't have an account?{" "}
            <Link to="/nissan/register" className={styles.registerLink}>
              Register here
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Nissan_Login;
