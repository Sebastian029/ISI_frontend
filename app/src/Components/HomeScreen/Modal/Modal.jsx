import { useState } from "react";
import "./Modal.css";
import GoogleIcon from "@mui/icons-material/Google";
import CloseIcon from "@mui/icons-material/Close";

export default function Modal() {
  const [modal, setModal] = useState(false);
  const [login, setLogin] = useState(true);

  const [loginInput, setLoginInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const toggleModal = () => {
    setModal(!modal);
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
                {" "}
                Hey, enter your details to get <br /> sign in to your account{" "}
              </p>

              <input
                type="text"
                placeholder="Login"
                className="data-field"
                value={loginInput}
                onChange={(e) => setLoginInput(e.target.value)}
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
              Email
              <input type="text" placeholder="Login"></input>
              Password
              <input type="password" placeholder="Password"></input>
              <input type="button" value="Login"></input>
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
