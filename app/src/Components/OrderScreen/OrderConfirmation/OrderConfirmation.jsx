import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../../HomeScreen/TopBar/TopBar.jsx";
import styles from './OrderConfirmation.module.css';
import { useEffect, useState } from "react";
import axios from "../../../axiosInstance.js"; 
import useAxiosPrivate from "../../../hooks/useAxiosPrivate.jsx";

const OrderConfirmation = () => {;
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

  useEffect(()=>{

      console.log(localStorage.getItem("flightDetails"))
      setTickets(JSON.parse(localStorage.getItem("cart")));
      setFlightDetails(JSON.parse(localStorage.getItem("flightDetails")));
      console.log(tickets);

  },[]);

  const handleConfirmation = async () => {
    try {

      const response = await axiosPrivate.post("/ticket_buy", {
        tickets: tickets.map(ticket => ({ ticket_id: ticket.ticket_id })),
        paymentMethod:paymentMethod
      });

      if(response.data){
        const orderIdResponse = response.data.order_id
        
        console.log(response.data.order_id);

        if(paymentMethod=="transfer"){
          console.log("Transfer Payment");
          navigate(`/transferdetails?orderId=${response.data.order_id}&fullPrice=${response.data.full_price}`);
        }
        else if(paymentMethod=="online"){
          console.log("Online Payment");
          const payment = await axiosPrivate.post("/create-payment", {
            tickets: tickets,
            order_id:response.data.order_id,
            full_price:response.data.full_price
          });

          window.location.href = payment.data.approval_url;
          console.log(payment.data);
        }
      }
      
      // localStorage.setItem("cart",null)
      // localStorage.setItem("flightDetails",null)
      
    } catch (error) {
      console.error("Error buying tickets:", error);
    }
  };  

  return (
    <>
      <TopBar />
      <div style={appStyles}>
        <div className = {styles.orderData}>     
          <p>Departure Airport: {flightDetails && flightDetails.departureAirport}</p>
          <p>Departure City: {flightDetails && flightDetails.departureCity}</p>
          <p>Arrival Airport: {flightDetails && flightDetails.arrivalAirport}</p>
          <p>Arrival City: {flightDetails && flightDetails.arrivalCity}</p>
        </div>
        <div className={styles.mainContainer}>
          <h2>Your Cart</h2>
          {tickets.length === 0 ? (
            <p>No tickets available</p>
          ) : (
            <ul className={styles.ticketList}>
              {tickets.map((ticket, index) => (
                <li key={index} className={styles.ticket}>
                  <h3>Ticket {index + 1}</h3>
                  <ul>
                    <li>TicketId: {ticket.ticket_id}</li>
                    <li>flight_id: {ticket.flight_id}</li>
                    <li>Class: {ticket.ticket_class}</li>
                    <li>Row: {ticket.row}</li>
                    <li>Seat: {ticket.column}</li>
                    <li>Price: {ticket.price}</li>
                  </ul>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.payment}>
            <p className={styles.label}>Method of payment</p>
            <label className={styles.radio}>
              <input type="radio" name="paymentMethod" value="transfer"  onChange={() => setPaymentMethod("transfer")}/>
                Przelew
            </label>
            <label className={styles.radio}>
              <input type="radio" name="paymentMethod" value="online" onChange={() => setPaymentMethod("online")}/>
                PayPal
            </label>
          </div>
          <input 
            className={styles.button}
            type="button"
            value="Confirm reservation"
            onClick={handleConfirmation}/>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
