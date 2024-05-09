import { useParams } from "react-router-dom";
import TopBar from "../HomeScreen/TopBar/TopBar.jsx";
import './FlightReservation.css';
import { useEffect, useState } from "react";
import axios from "../../axiosInstance"; 
import useAxiosPrivate from "../../hooks/useAxiosPrivate.jsx";

const FlightReservation = () => {
  const { flightId } = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const departureAirport = queryParams.get('departureAirport');
  const departureCity = queryParams.get('departureCity');
  const arrivalAirport = queryParams.get('arrivalAirport');
  const arrivalCity = queryParams.get('arrivalCity');
  const flightDate = queryParams.get('flightDate');
  const [tickets, setTickets] = useState([{}]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const axiosPrivate = useAxiosPrivate();


  const appStyles = {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
  };

  useEffect(()=>{
    const getTickets = async ()=>{
      try {

        const response = await axios.get("/tickets", {
          params: {
            flightId: flightId,
          },
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

  },[]);

  const handleTicketReservation = (ticket) => {
    if (selectedTickets.includes(ticket)) {
      setSelectedTickets(selectedTickets.filter(selectedTicket => selectedTicket !== ticket));
    } else {
      setSelectedTickets([...selectedTickets, ticket]);
    }
  }


  const handleConfirmation = async () => {
    try {
      console.log(selectedTickets);
      const response = await axiosPrivate.post("/ticket_buy", {
        tickets: selectedTickets.map(ticket => ({ ticket_id: ticket.ticket_id })),
      });

      console.log("Tickets bought successfully:", response.data);
      // Clear selected tickets after successful purchase
      setSelectedTickets([]);
    } catch (error) {
      console.error("Error buying tickets:", error);
    }
  };
  
  

  return (
    <>
      <TopBar />
      <div style={appStyles}>
        <div className = "flightData">
          {/*<p>Flight id: {flightId}</p>*/}          
          <p>Departure Airport: {departureAirport}</p>
          <p>Departure City: {departureCity}</p>
          <p>Arrival Airport: {arrivalAirport}</p>
          <p>Arrival City: {arrivalCity}</p>
        </div>
        <div className="ticketsList">
          <h2>Available Tickets:</h2>
          {tickets.length === 0 ? (
            <p>No tickets available</p>
          ) : (
            <ul>
              {tickets.map((ticket, index) => (
                <li key={index}>
                  <h3>Ticket {index + 1}</h3>
                  <ul>
                    <li>TicketId: {ticket.ticket_id}</li>
                    <li>Class: {ticket.ticket_class}</li>
                    <li>Row: {ticket.row}</li>
                    <li>Seat: {ticket.column}</li>
                    <li>Price: {ticket.price}</li>
                  </ul>
                  <input
                    type="button"
                    value="Choose Flight"
                    onClick={() => handleTicketReservation(ticket)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="reservationSummary">
          <h2>Reservation Summary</h2>
          <ul>
            {selectedTickets.map((ticket, index) => (
              <li key={index}>
                {ticket.ticket_class} - {ticket.price}
              </li>
            ))}
          </ul>
          <input 
            type="button"
            value="Confirm reservation"
            onClick={handleConfirmation}
            disabled={selectedTickets.length === 0} />
        </div>
      </div>
    </>
  );
};

export default FlightReservation;
