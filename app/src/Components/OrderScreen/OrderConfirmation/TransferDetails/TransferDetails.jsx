import TopBar from "../../../HomeScreen/TopBar/TopBar.jsx";
import styles from './TransferDetails.module.css';
const TransferDetails = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const order_id = queryParams.get('orderId');
  const full_price = queryParams.get('fullPrice');


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
        <div className = {styles.orderData}>      
          <p>Transfer title: {order_id}</p>
          <p>Transfer ammount: {full_price}</p>
          <p>Full name: John Doe</p>
          <p>Phone number: 2251222172</p>
          <p>E-mail: dominikjaroszek@business.example.com</p>
        </div>
      </div>
    </>
  );
};

export default TransferDetails;
