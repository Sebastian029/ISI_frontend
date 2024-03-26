import { useState } from "react";
import "./Modal.css";
import GoogleIcon from "@mui/icons-material/Google";
import CloseIcon from "@mui/icons-material/Close";

export default function Modal() {
  const [modal, setModal] = useState(false);
  const [login, setLogin] = useState(true);

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const [nameRegister, setNameRegister] = useState("");
  const [lastNameRegister, setLastNameRegister] = useState("");
  const [phoneNumberRegister, setPhoneNumberRegister] = useState("");
  const [emailRegister, setEmailRegister] = useState("");
  const [passwordRegister, setPasswordRegister] = useState("");
  const [repeatPasswordRegister, setRepearPasswordRegister] = useState("");
  const [registerOutput, setRegisterOutput] = useState("");
  const toggleModal = () => {
    setModal(!modal);
  };

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
      .then((response) => {
        setRegisterOutput("Registration successful!");
      })
      .catch((error) => {
        console.error("Registration error:", error);
        setRegisterOutput("Registration failed. Please try again.");
      });

    {
      registerOutput ? <p>{registerOutput}</p> : <p></p>;
    }

    setNameRegister("");
    setLastNameRegister("");
    setPhoneNumberRegister("");
    setEmailRegister("");
    setPasswordRegister("");
    setRepeatPasswordRegister("");
    setRegisterOutput("");
  };
  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <>
      <div onClick={toggleModal} className="btn-modal">
        Account
      </div>

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>

          {login && (
            <div className="modal-content">
              <h2>Login</h2>

              <p>
                Hey, enter your details to get <br /> sign in to your account
              </p>

              <input
                type="text"
                placeholder="Email"
                className="data-field"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="data-field"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />

              <input type="button" value="Sign in" className="confirm-button" />

              <p>- or log in with-</p>
              <div className="google-auth">
                <GoogleIcon />
                Google
              </div>

              <p className="register-reference" onClick={() => setLogin(false)}>
                Don`t have an account? <b>Register now</b>
              </p>

              <button className="close-modal" onClick={toggleModal}>
                <CloseIcon />
              </button>
            </div>
          )}

          {!login && (
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
                onChange={(e) => setRepearPasswordRegister(e.target.value)}
              />
              <input
                type="button"
                value="Sign up"
                className="confirm-button"
                onClick={() => registerAccount()}
              />
              {registerOutput ? <p>{registerOutput}</p> : <p></p>}
              <p className="register-reference" onClick={() => setLogin(true)}>
                Have an account already? <b>Sign in</b>
              </p>
              <button className="close-modal" onClick={toggleModal}>
                <CloseIcon />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
