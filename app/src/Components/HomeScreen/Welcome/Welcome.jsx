//import { useState, useEffect } from 'react';
import styles from "./Welcome.module.css";
import ImageSlider from "../../../comp/ImageSlider/ImageSlider.jsx";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";

function Welcome() {
  return (
    <>
      <div className={styles.mainBox}>
        <div className={styles.innerBox}>
          <ImageSlider />
          <div className={styles.contentBox}>
            <p className={styles.welcomeText}>
              Check out our flight finder app
            </p>
            <p className={styles.welcomeText}>We offer</p>
            <ul>
              <li>
                <LeaderboardIcon className={styles.basicIcon} />
                Bla bla
              </li>
              <li>
                <LeaderboardIcon className={styles.basicIcon} />
                Bla bla
              </li>
              <li>
                <LeaderboardIcon className={styles.basicIcon} />
                Bla bla
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Welcome;
