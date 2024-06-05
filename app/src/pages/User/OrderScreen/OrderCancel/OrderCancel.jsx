import { useParams } from "react-router-dom";
import TopBar from "../../HomeScreen/TopBar/TopBar.jsx";
import styles from "./OrderCancel.module.css";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate.jsx";

const OrderCancel = () => {
  const appStyles = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <>
      <TopBar />
      <div style={appStyles}>
        <div className={styles.orderData}>
          <p>Cancelled!!</p>
        </div>
      </div>
    </>
  );
};

export default OrderCancel;
