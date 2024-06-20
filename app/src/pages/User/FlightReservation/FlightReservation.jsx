import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../HomeScreen/TopBar/TopBar.jsx";
import styles from "./FlightReservation.module.css";
import { useEffect, useState } from "react";
import axios from "../../../axiosInstance.js";
import Deck from "./components/Deck.jsx";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FlightIcon from "@mui/icons-material/Flight";
import { message } from "antd";

const FlightReservation = () => {
  const { flightId } = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const departureAirport = queryParams.get("departureAirport");
  const departureCity = queryParams.get("departureCity");
  const arrivalAirport = queryParams.get("arrivalAirport");
  const arrivalCity = queryParams.get("arrivalCity");
  const flightDate = queryParams.get("flightDate");
  const [tickets, setTickets] = useState([{}]);
  const [total_seats, setTotal_seatss] = useState();
  const [num_columns, setNum_columns] = useState();
  const [selectedTickets, setSelectedTickets] = useState([]);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const appStyles = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
  };

  useEffect(() => {
    const getTickets = async () => {
      try {
        const response = await axios.get("/tickets/" + flightId, {});

        //console.log("Data posted successfully:", response.data);
        if (response.data) {
          setTickets(response.data.tickets);
          setNum_columns(response.data.num_columns);
          setTotal_seatss(response.data.total_seats);
        }
      } catch (error) {
        //console.error("Error posting data: elements not found");
        messageApi.open({
          type: "error",
          content: "Tickets not found",
        });
        setTickets([]);
      }
    };

    getTickets();

    //console.log("aasd" + tickets);
  }, []);

  const handleTicketReservation = (ticket) => {
    if (ticket.is_bought) {
      return;
    }
    if (selectedTickets.includes(ticket)) {
      setSelectedTickets(
        selectedTickets.filter((selectedTicket) => selectedTicket !== ticket)
      );
      messageApi.open({
        type: "error",
        content: "The ticket has been removed from the cart.",
      });
    } else {
      setSelectedTickets([...selectedTickets, ticket]);
      messageApi.open({
        type: "success",
        content: "The ticket has been added to the cart.",
      });
    }
  };

  const formatDate = (date) => { 
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = parsedDate.getDate().toString().padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const handleConfirmation = async () => {
    try {
      //console.log(selectedTickets);
      localStorage.setItem("cart", JSON.stringify(selectedTickets));

      const flightDetails = {
        departureAirport,
        departureCity,
        arrivalAirport,
        arrivalCity,
        flightDate,
      };
      localStorage.setItem("flightDetails", JSON.stringify(flightDetails));

      // const response = await axiosPrivate.post("/ticket_buy", {
      //   tickets: selectedTickets.map(ticket => ({ ticket_id: ticket.ticket_id })),
      // });

      //console.log("Tickets bought successfully:", response.data);
      navigate("/checkout");
      setSelectedTickets([]);
    } catch (error) {
      //console.error("Error buying tickets:", error);
      messageApi.open({
        type: "error",
        content: "Something went wrong",
      });
    }
  };

  return (
    <>
      {contextHolder}
      <TopBar />
      <div style={appStyles}>
        <div className={styles.mainContainer}>
          <div className={styles.ticketsList}>
            <div className={styles.flightData}>
              <div className={styles.flightBar}>
                <div className={styles.infoBar}>
                  <b> {departureCity}</b>
                </div>
                <div className={styles.line} />
                <div>
                  <FlightIcon
                    className={styles.flightIcon}
                  />
                </div>
                <div className={styles.line} />
                <div className={styles.infoBar}>
                  <b> {arrivalCity}</b>
                </div>
              </div>
              <div className={styles.flightInfo}>
                <div className={styles.infoBar}>
                  <p>
                    <FlightTakeoffIcon
                      className={styles.icon}
                    />
                    Departure Airport: {departureAirport}
                  </p>
                </div>
                <div className={styles.infoBar}>
                  <p>
                    <FlightLandIcon
                      className={styles.icon}
                    />
                    Arrival Airport: {arrivalAirport}
                  </p>
                </div>
                <div className={styles.infoBar}>
                  <p>
                    <CalendarMonthIcon
                      className={styles.icon}
                    />
                    Flight Date: {formatDate(flightDate)}
                  </p>
                </div>
              </div>
            </div>
            <h2>Available Seats:</h2>
            <div className={styles.ticketMap}>
              <Deck
                tickets={tickets}
                num_columns={num_columns}
                total_seats={total_seats}
                handleTicketReservation={handleTicketReservation}
              />
            </div>
          </div>
          <div className={styles.reservationSummary}>
            <h2>Reservation Summary</h2>
            <ul>
              {selectedTickets.map((ticket, index) => (
                <li key={index} className={styles.selectedTicket}>
                  <p>Seat number: {ticket.column}-{ticket.row}</p> 
                  <p>Class:{" "} {ticket.ticket_class} </p>
                  <p>Price: {ticket.price}</p>
                </li>
              ))}
            </ul>
            <input
              className={styles.button}
              type="button"
              value="Confirm reservation"
              onClick={handleConfirmation}
              disabled={selectedTickets.length === 0}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FlightReservation;
