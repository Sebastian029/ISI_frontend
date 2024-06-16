import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TopBar.module.css";
import Modal from "../Modal/Modal.jsx";
import useAuth from "../../../../hooks/useAuth.jsx";

function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (auth && auth.username) {
      setUsername("Welcome " + auth.username + "!");
    }
  }, [auth]);

  const getSelectedOption = () => {
    switch (location.pathname) {
      case "/":
        return "home";
      case "/help":
        return "help";
      case "/favourites":
        return "favourites";
      case "/reservations":
        return "reservations";
      case "/account":
        return "account";
      default:
        return "";
    }
  };

  const selectedOption = getSelectedOption();

  return (
    <>
      <div className={styles.mainBoxWrapper}>
        <div className={styles.mainBox}>
          <div className={styles.username}>{username}</div>
          <div
            className={`${styles.box} ${
              selectedOption === "home" ? styles.selected : ""
            }`}
            onClick={() => navigate("/")}
          >
            Home
          </div>
          <div
            className={`${styles.box} ${
              selectedOption === "help" ? styles.selected : ""
            }`}
            onClick={() => navigate("/help")}
          >
            Help
          </div>
          <div
            className={`${styles.box} ${
              selectedOption === "favourites" ? styles.selected : ""
            }`}
            onClick={() => navigate("/favourites")}
          >
            Favourites
          </div>
          <div
            className={`${styles.box} ${
              selectedOption === "reservations" ? styles.selected : ""
            }`}
            onClick={() => navigate("/reservations")}
          >
            My reservations
          </div>
          <div
            className={`${styles.box} ${
              selectedOption === "account" ? styles.selected : ""
            }`}
            onClick={() => navigate("/account")}
          >
            {auth ? "Account" : "Sign In"}
          </div>
          <Modal />
        </div>
      </div>
    </>
  );
}

export default TopBar;
