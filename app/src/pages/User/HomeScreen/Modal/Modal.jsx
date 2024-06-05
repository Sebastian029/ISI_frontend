import React, { useState } from "react";
import "./Modal.css";
import ModalLogin from "./ModalLogin";
import ModalRegister from "./ModalRegister";
import useAuth from "../../../../hooks/useAuth";

export default function Modal() {
  const { modal, setModal } = useAuth();
  const [login, setLogin] = useState(true);

  const toggleModal = () => {
    setModal(false);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <>
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>

          {login ? (
            <ModalLogin toggleModal={toggleModal} setLogin={setLogin} />
          ) : (
            <ModalRegister toggleModal={toggleModal} setLogin={setLogin} />
          )}
        </div>
      )}
    </>
  );
}
