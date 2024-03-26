import styles from "./MainFinder.module.css";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TuneIcon from "@mui/icons-material/Tune";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { useRef } from "react";

import axios from "./../../../axiosInstance";

function MainFinder({ activateFinder, setFlights }) {
  const [departureTextInput, setDepartureTextInput] = useState("");
  const [arrivalTextInput, setArrivalTextInput] = useState("");
  const [departureDateInput, setDepartureDateInput] = useState("");
  const [arrivalDateInput, setArrivaleDateInput] = useState("");
  const datePickerRefDeparture = useRef(null);
  const datePickerRefArrival = useRef(null);

  const handleSwap = () => {
    const temp = departureTextInput;
    setDepartureTextInput(arrivalTextInput);
    setArrivalTextInput(temp);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getFlights = async () => {
    try {
      console.log(departureTextInput);
      console.log(arrivalTextInput);
      console.log(formatDate(departureDateInput));
      const response = await axios.get("/flights_with_airports", {
        params: {
          departure_airport: departureTextInput,
          arrive_airport: arrivalTextInput,
          data_lotu: formatDate(departureDateInput),
        },
      });

      console.log("Data posted successfully:", response.data);
      if (response.data) {
        setFlights(response.data);
      }

      // setDepartureTextInput("");
      // setArrivalTextInput("");
      // setDepartureDateInput("");
      // setArrivaleDateInput("");
      // activateFinder(true);
    } catch (error) {
      console.error("Error posting data: elements not found");
      setFlights([]);
    } finally {
      activateFinder(true);
    }
  };

  return (
    <>
      <div className={styles.mainBox}>
        <div className={styles.checkBoxRow}>
          <div>
            <input type="checkbox"></input>
            One direction
          </div>
          <div>
            <input type="checkbox"></input>
            Two direction
          </div>
        </div>
        <div className={styles.globalInputBox}>
          <div className={styles.destinationInputRow}>
            <input
              className={styles.textInput}
              type="text"
              value={departureTextInput}
              onChange={(e) => setDepartureTextInput(e.target.value)}
              placeholder="Depature"
            />
            <SwapHorizIcon className={styles.iconSwap} onClick={handleSwap} />
            <input
              className={styles.textInput}
              type="text"
              value={arrivalTextInput}
              onChange={(e) => setArrivalTextInput(e.target.value)}
              placeholder="Arrival"
            />
          </div>

          <div>
            <div className={styles.datePickerBox}>
              <CalendarMonthIcon
                className={styles.icon}
                onClick={() => datePickerRefDeparture.current.setFocus(true)}
              />
              <DatePicker
                ref={datePickerRefDeparture}
                className={styles.dateInput}
                selected={departureDateInput}
                onChange={(date) => setDepartureDateInput(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Select departure date"
              />
              <CalendarMonthIcon
                className={styles.icon}
                onClick={() => datePickerRefArrival.current.setFocus(true)}
              />
              <DatePicker
                ref={datePickerRefArrival}
                className={styles.dateInput}
                selected={arrivalDateInput}
                onChange={(date) => setArrivaleDateInput(date)}
                dateFormat="yyyy-MM-d"
                placeholderText="Select arrival date"
              />
              <PersonIcon className={styles.icon} />
              <input type="text" placeholder="asd" className={styles.abc} />
              <input
                type="button"
                className={styles.confirmButton}
                value={"Search"}
                onClick={() => getFlights()}
              />
            </div>
            <div>
              Filtry
              <TuneIcon />
              <select>
                <option>asd</option>
              </select>
            </div>

            <input
              type="button"
              value={"Clear"}
              onClick={() => activateFinder(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
}

MainFinder.propTypes = {
  activateFinder: PropTypes.func.isRequired,
  setFlights: PropTypes.func.isRequired,
};

export default MainFinder;
