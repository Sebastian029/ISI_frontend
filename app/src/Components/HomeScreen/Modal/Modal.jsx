import React, { useState } from "react";
import "./Modal.css";

export default function Modal() {
  const [modal, setModal] = useState(false);
  const [login, setLogin] = useState(true);

  const toggleModal = () => {
    setModal(!modal);
  };

  if(modal) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  return (
    <>
      <div onClick={toggleModal} className="btn-modal">
        Account
      </div>

      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>

          {login &&( <div className="modal-content">

              <h2>Login</h2>

              Email
              <input type="text" placeholder="Login"></input>

              Password
              <input type="password" placeholder="Password"></input>

              <input type="button" value="Login"></input>

              <button className="close-modal" onClick={toggleModal}>
                CLOSE
              </button>
              </div>)}

              {!login &&( <div className="modal-content">

              <h2>Register</h2>

              Email
              <input type="text" placeholder="Login"></input>

              Password
              <input type="password" placeholder="Password"></input>

              <input type="button" value="Login"></input>

              <button className="close-modal" onClick={toggleModal}>
                CLOSE
              </button>
              </div>)}   
                    
        </div>
      )}


    
    </>
  );
}