import { useNavigate } from "react-router-dom";
import styles from "./Content.module.css";
import PropTypes from "prop-types";


//import axiosInstance from '../../axiosInstance';

function Content({ flights }) {
  const navigate=useNavigate();

  const handleFlightSelection = (flight) => {
    const { departure_airport, departure_city, arrival_airport, arrival_city } = flight;
    navigate(`flightReservation/${flight.flight_id}?departureAirport=${departure_airport}&departureCity=${departure_city}&arrivalAirport=${arrival_airport}&arrivalCity=${arrival_city}`);
  };

  return (
    <>
      <div className={styles.mainBox}>
        {flights.length === 0 ? (
          <p>No flights available.</p>
        ) : (
          flights.map((flight, index) => (
            <div key={index}>
              <h3>Flight {index + 1}</h3>
              <ul>
                <li>Departure Airport: {flight.departure_airport}</li>
                <li>Departure City: {flight.departure_city}</li>
                <li>Arrival Airport: {flight.arrival_airport}</li>
                <li>Arrival City: {flight.arrival_city}</li>
                <li>Available Seats: {flight.available_seats}</li>
                <li>Distance: {flight.distance} km</li>
                <li>Flight_id: {flight.flight_id}</li>
              </ul>
              <input
                type="button"
                value="Chose flight"
                onClick={() => handleFlightSelection(flight)}
              />
            </div>
          ))
        )}
      </div>
    </>
  );
}

Content.propTypes = {
  flights: PropTypes.arrayOf(
    PropTypes.shape({
      arrival_airport: PropTypes.string.isRequired,
      arrival_city: PropTypes.string.isRequired,
      available_seats: PropTypes.number.isRequired,
      departure_airport: PropTypes.string.isRequired,
      departure_city: PropTypes.string.isRequired,
      distance: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Content;
