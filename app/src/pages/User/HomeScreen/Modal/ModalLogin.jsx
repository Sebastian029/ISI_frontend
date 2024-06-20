import PropTypes from "prop-types";

import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../../../../axiosInstance";
import useAuth from "../../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/google_logo.png";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";

const ModalLogin = ({ toggleModal, setLogin }) => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const { setModal } = useAuth();

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginOutput, setLoginOutput] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const handleKeyUp = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      handleLogin();
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    if (!emailInput && !passwordInput) {
      messageApi.open({
        type: "error",
        content: "Please fill out the email and password fields.",
      });
      return;
    }

    if (!emailInput) {
      messageApi.open({
        type: "error",
        content: "Email is required.",
      });
      return;
    }

    if (!passwordInput) {
      messageApi.open({
        type: "error",
        content: "Password Cannot be empty",
      });
      return;
    }

    if (!emailRegex.test(emailInput)) {
      messageApi.open({
        type: "error",
        content: "Invalid email format. Please try again.",
      });
      return;
    }

    axios
      .post("/login", {
        email: emailInput,
        password: passwordInput,
      })
      .then((response) => {
        const access_token = response?.data?.access_token;
        const refresh_token = response?.data?.refresh_token;
        const token_decoded = jwtDecode(access_token);
        const authData = {
          accessToken: access_token,
          refreshToken: refresh_token,
          roles: token_decoded.roles,
          username: token_decoded.name + " " + token_decoded.surname,
        };

        setLoginOutput("Login successful!");
        setEmailInput("");
        setPasswordInput("");
        setModal(false);
        setAuth(authData);
        localStorage.setItem("authData", JSON.stringify(authData));
        if (token_decoded.roles.includes("admin")) {
          navigate("/admin");
        }
      })
      .catch(() => {
        //console.error("Login error:", error);
        messageApi.open({
          type: "error",
          content: "Login failed. Please try again.",
        });
      });
  };

  const handleGoogle = () => {
    window.location.href = "http://localhost:5000/login/google";
  };

  return (
    <div className="modal-content">
      {contextHolder}
      <h2>Login</h2>
      <p>Hey, sign in to your account</p>
      <input
        type="text"
        placeholder="Email"
        className="data-field"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
        onKeyUp={handleKeyUp}
      />
      <input
        type="password"
        placeholder="Password"
        className="data-field"
        value={passwordInput}
        onChange={(e) => setPasswordInput(e.target.value)}
        onKeyUp={handleKeyUp}
      />
      <input
        type="button"
        value="Sign in"
        className="confirm-button"
        onClick={handleLogin}
      />
      {loginOutput ? <p>{loginOutput}</p> : <p></p>}
      <p>- or log in with-</p>
      <div className="googleAuth">
        <img src={logo} alt="Logo" width={180} onClick={handleGoogle} />
      </div>
      <p className="register-reference" onClick={() => setLogin(false)}>
        Don`t have an account? <b>Register now</b>
      </p>
      <button className="close-modal" onClick={toggleModal}>
        <CloseIcon />
      </button>
    </div>
  );
};
ModalLogin.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  setLogin: PropTypes.func.isRequired,
};

export default ModalLogin;
