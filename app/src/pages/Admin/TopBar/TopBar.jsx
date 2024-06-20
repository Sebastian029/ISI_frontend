import { useNavigate } from "react-router-dom";
import styles from "./TopBar.module.css";
import useAuth from "../../../hooks/useAuth";

function TopBar() {
  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const handleLogout = () => {
    console.log("logout");
    localStorage.setItem("authData", null);
    setAuth(null);
    navigate("/");
  };

  return (
    <>
      <div className={styles.mainBox}>
        <div className={styles.box} onClick={() => navigate("/admin")}>
          Admin
        </div>
        <div className={styles.box} onClick={() => navigate("/newflight")}>
          New Flight
        </div>
        <div className={styles.box} onClick={() => navigate("/paymentadmin")}>
          Payment
        </div>
        <div className={styles.box} onClick={() => navigate("/privileges")}>
          Privilages
        </div>
        <div className={styles.box} onClick={() => navigate("/role")}>
          Role
        </div>
        <div className={styles.box} onClick={() => handleLogout()}>
          Logout
        </div>
      </div>
    </>
  );
}

export default TopBar;
