import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../HomeScreen/TopBar/TopBar.jsx";
import styles from "./FlightReservation.module.css";
import { useEffect, useState } from "react";
import axios from "../../../axiosInstance.js";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate.jsx";

const FlightReservation = () => {
  const { flightId } = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const departureAirport = queryParams.get("departureAirport");
  const departureCity = queryParams.get("departureCity");
  const arrivalAirport = queryParams.get("arrivalAirport");
  const arrivalCity = queryParams.get("arrivalCity");
  const flightDate = queryParams.get("flightDate");
  const [tickets, setTickets] = useState([{}]);
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
          // params: {
          //   flightId: flightId,
          // },
        });

        console.log("Data posted successfully:", response.data);
        if (response.data) {
          setTickets(response.data);
        }
      } catch (error) {
        console.error("Error posting data: elements not found");
        setTickets([]);
      }
    };

    getTickets();
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

  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5;
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = tickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`${styles.page} ${i === currentPage ? styles.active : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
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
        <div className={styles.flightData}>
          {/*<p>Flight id: {flightId}</p>*/}
          <p>Departure Airport: {departureAirport}</p>
          <p>Departure City: {departureCity}</p>
          <p>Arrival Airport: {arrivalAirport}</p>
          <p>Arrival City: {arrivalCity}</p>
        </div>
        <div className={styles.mainContainer}>
          <div className={styles.ticketsList}>
            <h2>Available Tickets:</h2>
            {currentTickets.length === 0 ? (
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
