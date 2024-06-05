import TopBar from "../../HomeScreen/TopBar/TopBar.jsx";
import styles from './OrderSuccess.module.css';
import { useEffect, useState } from "react";

const OrderSuccess = () => {
  const [tickets, setTickets] = useState([{}]);
  const [flightDetails, setFlightDetails] = useState();


  const appStyles = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
  };

  useEffect(()=>{
    
      setTickets(JSON.parse(localStorage.getItem("cart")));
      setFlightDetails(JSON.parse(localStorage.getItem("flightDetails")));


  },[]);

  return (
    <>
      <TopBar />
      <div style={appStyles}>
        <div className = {styles.orderData}>         
          <p>Success!!</p>
        </div>
        <div className={styles.ticketsList}>
          <h2>Your Order</h2>
          <p>Departure Airport: {flightDetails && flightDetails.departureAirport}</p>
          <p>Departure City: {flightDetails && flightDetails.departureCity}</p>
          <p>Arrival Airport: {flightDetails && flightDetails.arrivalAirport}</p>
          <p>Arrival City: {flightDetails && flightDetails.arrivalCity}</p>
          {tickets.length === 0 ? (
            <p>No tickets available</p>
          ) : (
            <ul className={styles.ticketList}>
              {tickets.map((ticket, index) => (
                <li className={styles.ticket} key={index}>
                  <h3>Ticket {index + 1}</h3>
                  <ul className={styles.ticketData}>
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
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
