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
            <p>Check out our flight finder app</p>
            <p>We offer</p>
            <ul>
              <li>
                <LeaderboardIcon />
                Bla bla
              </li>
              <li>
                <LeaderboardIcon />
                Bla bla
              </li>
              <li>
                <LeaderboardIcon />
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
