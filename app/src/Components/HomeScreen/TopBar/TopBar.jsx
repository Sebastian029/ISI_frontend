import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TopBar.module.css";
import Modal from "../Modal/Modal.jsx";
import useAuth from "../../../hooks/useAuth.jsx";

function TopBar() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (auth) {
      setUserEmail(auth.email);
    }
    // console.log(auth);
  }, [auth]);

  return (
    <>
      <div className={styles.mainBox}>
        <div className={styles.username}>{userEmail}</div>
        <div className={styles.box} onClick={() => navigate("/")}>
          Home
        </div>
        <div className={styles.box}>Help</div>
        <div className={styles.box}>Favourites</div>
        <div className={styles.box} onClick={() => navigate("/reservations")}>
          My reservations
        </div>
        <div className={styles.box} onClick={() => navigate("/account")}>
          Account
        </div>
        <Modal></Modal>
      </div>
    </>
  );
}

export default TopBar;
