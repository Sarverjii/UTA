import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState({
    whatsappNumber: "",
    dob: "",
  });

  const loginHandler = async () => {
    try {
      console.log(login);
      const res = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/player/login`,
        login,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate(`/login/${res.data.data.id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Incorrect Credentials");
      console.log(error);
    }
  };

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.headerLogoGroup}>
          <div className={styles.logoIcon}>
            <img src="/logo.png" alt="UTA LOGO" />
          </div>
        </div>
        <h2 className={styles.headerTitle}>Uttranchal Tennis Association</h2>
        <Link to={"/"}>Back to Home</Link>
      </header>

      <h2>Player Login</h2>
      <label htmlFor="number"></label>
      <input
        type="tel"
        name="number"
        id="number"
        onChange={(e) => setLogin({ ...login, whatsappNumber: e.target.value })}
      />
      <label htmlFor="dob">Enter your Date of Birth</label>
      <input
        type="date"
        name="dob"
        id="dob"
        onChange={(e) => setLogin({ ...login, dob: e.target.value })}
      />
      <button onClick={loginHandler}>Login</button>
    </div>
  );
};

export default Login;
