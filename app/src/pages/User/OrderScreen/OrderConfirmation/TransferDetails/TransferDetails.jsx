import { useEffect, useState } from "react";
import TopBar from "../../../HomeScreen/TopBar/TopBar.jsx";
import styles from './TransferDetails.module.css';
import { Card } from 'antd';

const TransferDetails = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const order_id = queryParams.get('orderId');
  const full_price = queryParams.get('fullPrice');
  const [ userData, setUserData ] = useState({});

  useEffect(() => {
    const authData = localStorage.getItem('authData');
    setUserData(JSON.parse(authData));
  }, []);

  return (
    <>
      <TopBar />
      <div className={styles.mainContainer}>
        <Card hoverable title={<div className={styles.title}>Bank transfer details</div>} className = {styles.orderData}>      
          <p><b>Full name: John Doe</b></p>
          <p>Account number: 61 1090 1014 0000 0712 1981 2876</p>
          <p>Transfer title: Order identification number {order_id} {userData.username}</p>
          <p>Transfer ammount: {full_price}$</p>
        </Card>
      </div>
    </>
  );
};

export default TransferDetails;
