import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TopBar.module.css";
import Modal from "../Modal/Modal.jsx";
import useAuth from "../../../hooks/useAuth.jsx";

function TopBar() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (auth && auth.username) {
      setUsername("Welcome " + auth.username + "!");
    }
  }, [auth]);

  return (
    <>
      <div className={styles.mainBox}>
        <div className={styles.username}>{username}</div>
        <div className={styles.box} onClick={() => navigate("/")}>
          Home
        </div>
        <div className={styles.box}>Help</div>
        <div className={styles.box}>Favourites</div>
        <div className={styles.box} onClick={() => navigate("/reservations")}>
          My reservations
        </div>
        <div className={styles.box} onClick={() => navigate("/account")}>
          {auth ? "Account" : "Login"}
        </div>
        <Modal></Modal>
      </div>
    </>
  );
}

export default TopBar;
