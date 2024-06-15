import { useNavigate } from "react-router-dom";
import styles from "./Content.module.css";
import PropTypes from "prop-types";
import Pagination from "../../../../comp/Pagination.jsx";
// import axiosInstance from '../../axiosInstance';

function Content({ flights }) {
  const navigate = useNavigate();

  const handleFlightSelection = (flight) => {
    const { departure_airport, departure_city, arrival_airport, arrival_city, data_lotu } =
      flight;
    //console.log("asd");
    navigate(
      `flightReservation/${flight.flight_id}?departureAirport=${departure_airport}&departureCity=${departure_city}&arrivalAirport=${arrival_airport}&arrivalCity=${arrival_city}&flightDate=${data_lotu}`
    );
  };

  return (
    <div className={styles.mainBox}>
      <div className={styles.flightsContent}>
        <Pagination
          key={JSON.stringify(flights)}
          flights={flights}
          itemsPerPage={2}
          handleFlightSelection={handleFlightSelection}
        />
      </div>
    </div>
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
      flight_id: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Content;
