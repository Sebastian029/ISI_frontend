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
import AutocompleteTextInput from "../../../comp/AutocompleteTextInput";

import axios from "./../../../axiosInstance";

function MainFinder({ activateFinder, setFlights }) {
  const [departureTextInput, setDepartureTextInput] = useState("");
  const [arrivalTextInput, setArrivalTextInput] = useState("");
  const [departureDateInput, setDepartureDateInput] = useState("");
  const [arrivalDateInput, setArrivaleDateInput] = useState("");
  const [singleWayCheckbox, setSingleWayCheckbox] = useState(true);
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
      console.log(departureTextInput.split(": ")[1]);
      console.log(arrivalTextInput.split(": ")[1]);
      console.log(formatDate(departureDateInput));
      const response = await axios.get("/flights_with_airports", {
        params: {
          departure_airport: departureTextInput.split(": ")[1],
          arrive_airport: arrivalTextInput.split(": ")[1],
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
  const clearInputs = () => {
    setDepartureTextInput("");
    setArrivalTextInput("");
    setDepartureDateInput("");
    setArrivaleDateInput("");
    setDepartureDateInput("");
    activateFinder(false);
  };

  return (
    <>
      <div className={styles.mainBox}>
        <div className={styles.globalInputBox}>
          <div className={styles.checkBoxRow}>
            <input
              type="checkbox"
              id="singleWayCheckbox"
              className={styles.checkbox}
              checked={singleWayCheckbox === true}
              onChange={() => setSingleWayCheckbox(true)}
            />
            <label htmlFor="singleWayCheckbox" className={styles.checkboxText}>
              One direction
            </label>
            <input
              type="checkbox"
              id="twoWayCheckbox"
              className={styles.checkbox}
              checked={singleWayCheckbox === false}
              onChange={() => setSingleWayCheckbox(false)}
            />
            <label htmlFor="twoWayCheckbox" className={styles.checkboxText}>
              Two direction
            </label>
          </div>

          <div className={styles.destinationInputRow}>
            <AutocompleteTextInput
              value={departureTextInput}
              onChange={setDepartureTextInput}
              placeholder="Departure airport"
              className={styles.textInput}
            />
            <SwapHorizIcon className={styles.iconSwap} onClick={handleSwap} />
            <AutocompleteTextInput
              value={arrivalTextInput}
              onChange={setArrivalTextInput}
              placeholder="Arrival airport"
              className={styles.textInput}
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
                placeholderText="Departure date"
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
                placeholderText="Arrival date"
              />
              <PersonIcon className={styles.icon} />
              <input
                type="text"
                placeholder="People number"
                className={styles.personInput}
              />
              <input
                type="button"
                className={styles.confirmButton}
                value={"Search"}
                onClick={() => getFlights()}
              />

              <input
                type="button"
                className={styles.confirmButton}
                value={"Clear"}
                onClick={() => clearInputs()}
              />
            </div>

            <div>
              Filtry
              <TuneIcon />
              <select>
                <option>asd</option>
              </select>
            </div>
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
