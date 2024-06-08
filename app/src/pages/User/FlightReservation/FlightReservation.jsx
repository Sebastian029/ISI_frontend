import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../HomeScreen/TopBar/TopBar.jsx";
import styles from "./FlightReservation.module.css";
import { useEffect, useState } from "react";
import axios from "../../../axiosInstance.js";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate.jsx";
import Deck from "./components/Deck.jsx";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

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
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const appStyles = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
  };

  useEffect(() => {
    const getTickets = async () => {
      try {
        const response = await axios.get("/tickets/" + flightId, {
          
        });

        console.log("Data posted successfully:", response.data);
        if (response.data) {
          setTickets(response.data.tickets);
          setNum_columns(response.data.num_columns);
          setTotal_seatss(response.data.total_seats);
        }
      } catch (error) {
        console.error("Error posting data: elements not found");
        setTickets([]);
      }
    };

    getTickets();

    console.log("aasd"+tickets);
  }, []);

  const handleTicketReservation = (ticket) => {
    if (selectedTickets.includes(ticket)) {
      setSelectedTickets(
        selectedTickets.filter((selectedTicket) => selectedTicket !== ticket)
      );
    } else {
      setSelectedTickets([...selectedTickets, ticket]);
    }
  };

  const formatDate = (date) => {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = parsedDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };


  const handleConfirmation = async () => {
    try {
      console.log(selectedTickets);
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
      console.error("Error buying tickets:", error);
    }
  };

  return (
    <>
      <TopBar />
      <div style={appStyles}>
      <div className = {styles.flightData}>
          {/*<p>Flight id: {flightId}</p>*/}
          <div>
            <p>Departure <FlightTakeoffIcon style={styles.flightIcon} /></p>
            <p>{departureCity} : {departureAirport}</p>
          </div>
          <div>
            <p>Date: <CalendarMonthIcon style={styles.flightIcon} /></p>
             {formatDate(flightDate)}
          </div>
          <div>
            <p>Arrival <FlightLandIcon style={styles.flightIcon} /></p>
            <p>{arrivalCity} : {arrivalAirport}</p>
          </div>
        </div>
        <div className={styles.mainContainer}>
          <div className={styles.ticketsList}>
            <h2>Available Tickets:</h2>
            {/* {currentTickets.length === 0 ? (
              <p>No tickets available</p>
            ) : (
              <ul className={styles.mainList}>
                {currentTickets.map((ticket, index) => (
                  <li key={index} className={styles.Ticket}>
                    <h3>Ticket {index + 1}</h3>
                    <ul>
                      <li>TicketId: {ticket.ticket_id}</li>
                      <li>Class: {ticket.ticket_class}</li>
                      <li>Row: {ticket.row}</li>
                      <li>Seat: {ticket.column}</li>
                      <li>Price: {ticket.price}</li>
                    </ul>
                    <input
                      className={styles.button}
                      type="button"
                      value="Choose Flight"
                      onClick={() => handleTicketReservation(ticket)}
                    />
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.pagination}>
              <button
                className={styles.page}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {renderPageNumbers()}
              <button
                className={styles.page}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div> */}
            <div className={styles.ticketMap}>
              <Deck tickets={tickets} num_columns={num_columns} total_seats={total_seats} handleTicketReservation={handleTicketReservation} />
            </div>
          </div>
          <div className={styles.reservationSummary}>
            <h2>Reservation Summary</h2>
            <ul>
              {selectedTickets.map((ticket, index) => (
                <li key={index}>
                  {ticket.ticket_class} - {ticket.price}
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
