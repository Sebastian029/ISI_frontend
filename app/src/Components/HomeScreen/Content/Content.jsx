import styles from "./Content.module.css";
import PropTypes from "prop-types";

//import axiosInstance from '../../axiosInstance';

function Content({ flights }) {
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
                <li>Departure Airport: {flight["departure airport"]}</li>
                <li>Departure City: {flight["departure city"]}</li>
                <li>Arrival Airport: {flight["arrival airport"]}</li>
                <li>Arrival City: {flight["arrival city"]}</li>
                <li>Available Seats: {flight.available_seats}</li>
                <li>Distance: {flight.distance} km</li>
              </ul>
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
      "arrival airport": PropTypes.string.isRequired,
      "arrival city": PropTypes.string.isRequired,
      available_seats: PropTypes.number.isRequired,
      "departure airport": PropTypes.string.isRequired,
      "departure city": PropTypes.string.isRequired,
      distance: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default Content;
