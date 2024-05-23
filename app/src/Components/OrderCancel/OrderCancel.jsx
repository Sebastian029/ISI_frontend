import { useParams } from "react-router-dom";
import TopBar from "../HomeScreen/TopBar/TopBar.jsx";
import './OrderConfirmation.css';
import { useEffect, useState } from "react";
import axios from "../../axiosInstance.js"; 
import useAxiosPrivate from "../../hooks/useAxiosPrivate.jsx";

const OrderCancel = () => {
  const { flightId } = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const departureAirport = queryParams.get('departureAirport');
  const departureCity = queryParams.get('departureCity');
  const arrivalAirport = queryParams.get('arrivalAirport');
  const arrivalCity = queryParams.get('arrivalCity');
  const flightDate = queryParams.get('flightDate');
  const [orderId, setOrderId] = useState();
  const [tickets, setTickets] = useState([{}]);
  const [flightDetails, setFlightDetails] = useState();
  const [paymentMethod, setPaymentMethod] = useState("");
  const axiosPrivate = useAxiosPrivate();


  const appStyles = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
  };

  useEffect(()=>{
    // const getTickets = async ()=>{
    //   try {

    //     const response = await axios.get("/tickets/" + flightId, {
    //       // params: {
    //       //   flightId: flightId,
    //       // },
    //     });

    //     console.log("Data posted successfully:", response.data);
    //     if (response.data) {
    //       setTickets(response.data);
    //     }
    //   } catch (error) {
    //     console.error("Error posting data: elements not found");
    //     setTickets([]);
    //   }
    // };

    // getTickets();
    console.log(localStorage.getItem("flightDetails"))
    setTickets(JSON.parse(localStorage.getItem("cart")));
    setFlightDetails(JSON.parse(localStorage.getItem("flightDetails")));
    console.log(tickets);

  },[]);

  

  return (
    <>
      <TopBar />
      <div style={appStyles}>
        <div className = "flightData">
          {/*<p>Flight id: {flightId}</p>*/}          
          <p>Cancelled!!</p>
        </div>
      </div>
    </>
  );
};

export default OrderCancel;
