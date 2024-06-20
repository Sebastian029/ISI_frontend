import TopBar from "../../HomeScreen/TopBar/TopBar.jsx";
import styles from './OrderSuccess.module.css';
import { useEffect, useState } from "react";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FlightIcon from "@mui/icons-material/Flight";
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import { Card } from 'antd';

const OrderSuccess = () => {
  const [tickets, setTickets] = useState([{}]);
  const [flightDetails, setFlightDetails] = useState();

  useEffect(()=>{
    
      setTickets(JSON.parse(localStorage.getItem("cart")));
      setFlightDetails(JSON.parse(localStorage.getItem("flightDetails")));


  },[]);


  const formatDate = (date) => {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = parsedDate.getDate().toString().padStart(2, "0");
    return `${day}-${month}-${year}`;
  };


  return (
    <>
      <TopBar />
      <div className={styles.mainContainer}>
      <h1>Success!!</h1>
      <h2 className={styles.label}>Your Order:</h2>
        <div className = {styles.yourOrder}>         
          <div className={styles.flightData}>
            <div className={styles.flightBar}>
              <div className={styles.infoBar}>
                <b> {flightDetails && flightDetails.departureCity}</b>
              </div>
              <div className={styles.line}/>
              <div>
                <FlightIcon className={styles.flightIcon} />
              </div>
              <div className={styles.line}/>
              <div className={styles.infoBar}>
                <b> {flightDetails && flightDetails.arrivalCity}</b>
              </div>
            </div>
            <div className={styles.infoBar}>
              <p><FlightTakeoffIcon className={styles.icon} />
              Departure Airport: {flightDetails && flightDetails.departureAirport}</p>
            </div>
            <div className={styles.infoBar}>
              <p><FlightLandIcon className={styles.icon} />
              Arrival Airport: {flightDetails && flightDetails.arrivalAirport}</p>
            </div>
            <div className={styles.infoBar}>
              <p><CalendarMonthIcon className={styles.icon} />
              Flight Date: {formatDate(flightDetails && flightDetails.flightDate)}</p>
            </div>
            {tickets.length === 0 ? (
              <p>No tickets available</p>
            ) : (
              <ul className={styles.ticketList}>
                {tickets.map((ticket, index) => (
                  <li className={styles.ticketC} key={index}>
                    <Card hoverable className={styles.ticket}>
                        <div className={styles.cardContent}>
                          <div className={styles.info}>
                            <div className={styles.infoBar}><AirplaneTicketIcon className={styles.icon}/>Ticket {index + 1}</div>
                            <div className={styles.ticketInfo}>
                              <div>Class: {ticket.ticket_class}</div>
                              <div>Row: {ticket.row}</div>
                              <div>Seat: {ticket.column}</div>
                              <div>Price: {ticket.price} $</div>
                            </div>
                          </div>
                          <img 
                            className={styles.img}
                            src={ticket.ticket_class == "economy"
                              ? "https://www.travelguys.fr/wp-content/uploads/2023/06/IMG_7191-scaled.jpg"
                              : "https://upload.wikimedia.org/wikipedia/commons/7/72/Philippine_Airlines_business_class_A330-300.png"} />
                        </div>
                      </Card>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
