import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../../HomeScreen/TopBar/TopBar.jsx";
import './TransferDetails.css';
import { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate.jsx";

const TransferDetails = () => {
  const { flightId } = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const order_id = queryParams.get('orderId');
  const full_price = queryParams.get('fullPrice');
  const arrivalAirport = queryParams.get('arrivalAirport');
  const arrivalCity = queryParams.get('arrivalCity');
  const flightDate = queryParams.get('flightDate');
  const [orderId, setOrderId] = useState();
  const [tickets, setTickets] = useState([{}]);
  const [flightDetails, setFlightDetails] = useState();
  const [paymentMethod, setPaymentMethod] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();


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
        <div className = "flightData">
          {/*<p>Flight id: {flightId}</p>*/}          
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
