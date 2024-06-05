import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import axios from "../../../../axiosInstance";
import useAuth from "../../../../hooks/useAuth";

const ModalRegister = ({ toggleModal, setLogin }) => {
  const { setModal } = useAuth();

  const [nameRegister, setNameRegister] = useState("");
  const [lastNameRegister, setLastNameRegister] = useState("");
  const [phoneNumberRegister, setPhoneNumberRegister] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [repeatPasswordRegister, setRepeatPasswordRegister] = useState("");
  const [registerOutput, setRegisterOutput] = useState("");

  const registerAccount = () => {
    if (!nameRegister.trim()) {
      setRegisterOutput("Please enter your name.");
      return;
    }
    if (!lastNameRegister.trim()) {
      setRegisterOutput("Please enter your last name.");
      return;
    }
    if (!phoneNumberRegister.trim()) {
      setRegisterOutput("Please enter your phone number.");
      return;
    }
    const phoneRegex = /^\d{9}$/;
    if (!phoneRegex.test(phoneNumberRegister)) {
      setRegisterOutput("Please enter a valid 9-digit phone number.");
      return;
    }
    if (!emailRegister.trim()) {
      setRegisterOutput("Please enter your email.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailRegister)) {
      setRegisterOutput("Please enter a valid email address.");
      return;
    }
    if (!passwordRegister) {
      setRegisterOutput("Please enter your password.");
      return;
    }
    if (passwordRegister !== repeatPasswordRegister) {
      setRegisterOutput("Passwords do not match.");
      return;
    }

    axios
      .post("/register", {
        firstName: nameRegister,
        lastName: lastNameRegister,
        email: emailRegister,
        phoneNumber: phoneNumberRegister,
        password: passwordRegister,
      })
      .then(() => {
        setRegisterOutput("Registration successful!");
        setNameRegister("");
        setLastNameRegister("");
        setPhoneNumberRegister("");
        setEmailRegister("");
        setPasswordRegister("");
        setRepeatPasswordRegister("");
      })
      .catch((error) => {
        console.error("Registration error:", error);
        if (error.response) {
          setRegisterOutput(error.response.data.message);
        } else {
          setRegisterOutput(
            "Registration failed. Please check your internet connection."
          );
        }
      });

    {
      registerOutput ? <p>{registerOutput}</p> : <p></p>;
    }
  };

  return (
    <div className="modal-content">
      <h2>Register</h2>
      <p>
        Enter your account details
        <br />
      </p>
      <input
        type="text"
        placeholder="First name"
        className="data-field"
        value={nameRegister}
        onChange={(e) => setNameRegister(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last name"
        className="data-field"
        value={lastNameRegister}
        onChange={(e) => setLastNameRegister(e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone number"
        className="data-field"
        value={phoneNumberRegister}
        onChange={(e) => setPhoneNumberRegister(e.target.value)}
      />
      <input
        type="text"
        placeholder="Email"
        className="data-field"
        value={emailRegister}
        onChange={(e) => setEmailRegister(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="data-field"
        value={passwordRegister}
        onChange={(e) => setPasswordRegister(e.target.value)}
      />
      <input
        type="password"
        placeholder="Repeat password"
        className="data-field"
        value={repeatPasswordRegister}
        onChange={(e) => setRepeatPasswordRegister(e.target.value)}
      />
      <input
        type="button"
        value="Sign up"
        className="confirm-button"
        onClick={registerAccount}
      />
      {registerOutput ? <p>{registerOutput}</p> : <p></p>}
      <p className="register-reference" onClick={() => setLogin(true)}>
        Have an account already? <b>Sign in</b>
      </p>
      <button className="close-modal" onClick={toggleModal}>
        <CloseIcon />
      </button>
    </div>
  );
};

export default ModalRegister;
