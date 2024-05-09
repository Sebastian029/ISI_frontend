import { useNavigate } from "react-router-dom";
import styles from "./TopBar.module.css";


function TopBar() {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.mainBox}>
        <div className={styles.box} onClick={() => navigate("/")}>
          Home
        </div>
        <div className={styles.box} onClick={() => navigate("/newflight")}> 
          New Flight
        </div>
        <div className={styles.box}>Help</div>
        <div className={styles.box} onClick={() => navigate("/admin")}> 
          Admin
        </div>
        {/* { <div className={styles.box} onClick={() => navigate("/reservations")}>
          My reservations
        </div> } */}
        {/* <div className={styles.box} onClick={() => navigate("/account")}>
          Account
        </div> */}
        {/* <Modal></Modal> */}
      </div>
    </>
  );
}

export default TopBar;
