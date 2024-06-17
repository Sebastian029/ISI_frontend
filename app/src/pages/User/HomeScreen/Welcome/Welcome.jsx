//import { useState, useEffect } from 'react';
import styles from "./Welcome.module.css";
import ImageSlider from "../../../../comp/ImageSlider/ImageSlider.jsx";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GridViewIcon from "@mui/icons-material/GridView";
import PaymentIcon from "@mui/icons-material/Payment";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

function Welcome() {
  return (
    <>
      <div className={styles.mainBox}>
        <div className={styles.innerBox}>
          <ImageSlider />
          <div className={styles.contentBox}>
            <p className={styles.welcomeText}>
              Your Fast Track to the Best Flights{" "}
            </p>
            <p className={styles.welcomeInfo}>
              Unlock Your Next Adventure With:
            </p>
            <ul>
              <li>
                <AttachMoneyIcon className={styles.basicIcon} />
                Best Prices Guaranteed
              </li>
              <li>
                <GridViewIcon className={styles.basicIcon} />
                User Friendly Interface
              </li>
              <li>
                <PaymentIcon className={styles.basicIcon} />
                Secure Payment Methods
              </li>
              <li>
                <SupportAgentIcon className={styles.basicIcon} />
                User Support 24/7
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Welcome;
