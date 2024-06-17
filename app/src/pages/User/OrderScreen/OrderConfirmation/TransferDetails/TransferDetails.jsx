import TopBar from "../../../HomeScreen/TopBar/TopBar.jsx";
import styles from './TransferDetails.module.css';
import { Card } from 'antd';

const TransferDetails = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const order_id = queryParams.get('orderId');
  const full_price = queryParams.get('fullPrice');


  return (
    <>
      <TopBar />
      <div className={styles.mainContainer}>
        <Card hoverable title={<div className={styles.title}>Bank transfer details</div>} className = {styles.orderData}>      
          <p>Full name: John Doe</p>
          {/* <p>Phone number: 2251222172</p> */}
          {/* <p>E-mail: dominikjaroszek@business.example.com</p> */}
          <p>Transfer title: Order identification number{order_id}Imię nazwisko</p>
          <p>Transfer ammount: {full_price}$</p>
        </Card>
      </div>
    </>
  );
};

export default TransferDetails;
