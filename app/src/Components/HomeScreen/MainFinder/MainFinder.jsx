import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import TuneIcon from "@mui/icons-material/Tune";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import AutocompleteTextInput from "../../../comp/AutocompleteTextInput/AutocompleteTextInput.jsx";
import axios from "./../../../axiosInstance";
import styles from "./MainFinder.module.css";

function MainFinder({ activateFinder, setFlights }) {
  const [departureTextInput, setDepartureTextInput] = useState("");
  const [arrivalTextInput, setArrivalTextInput] = useState("");
  const [departureDateInput, setDepartureDateInput] = useState(null);
  const [arrivalDateInput, setArrivaleDateInput] = useState(null);
  const [singleWayCheckbox, setSingleWayCheckbox] = useState(true);
  const [arrivalID, setArricalID] = useState(null);
  const [departureID, setDepartureID] = useState(null);
  const datePickerRefDeparture = useRef(null);
  const datePickerRefArrival = useRef(null);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("flightSearchData"));
    if (savedData) {
      console.log(savedData);
      setDepartureTextInput(savedData.departureTextInput);
      setArrivalTextInput(savedData.arrivalTextInput);
      setDepartureDateInput(new Date(savedData.departureDateInput));
      setArricalID(savedData.arrivalID);
      setDepartureID(savedData.departureID);
    }
  }, []);

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
      const response = await axios.get("/flights_with_airports", {
        params: {
          departure_airport_id: departureID,
          arrive_airport_id: arrivalID,
          data_lotu: formatDate(departureDateInput),
        },
      });

      if (response.data) {
        setFlights(response.data);
      }
    } catch (error) {
      console.error("Error fetching flights:", error);
      setFlights([]);
    } finally {
      activateFinder(true);
    }

    const dataToSave = {
      departureTextInput,
      arrivalTextInput,
      departureDateInput:
        departureDateInput ||
        new Date().currentDate.toISOString().split("T")[0],
      arrivalID,
      departureID,
    };
    localStorage.setItem("flightSearchData", JSON.stringify(dataToSave));
    // console.log(dataToSave);
  };

  const clearInputs = () => {
    setDepartureTextInput("");
    setArrivalTextInput("");
    setDepartureDateInput(null);
    setArrivaleDateInput(null);
    setDepartureID(null);
    setArricalID(null);
    activateFinder(false);
    localStorage.removeItem("flightSearchData");
  };

  return (
    <div className={styles.mainBox}>
      <div className={styles.globalInputBox}>
        {/*
        <div className={styles.checkBoxRow}>
          <input
            type="checkbox"
            id="singleWayCheckbox"
            className={styles.checkbox}
            checked={singleWayCheckbox}
            onChange={() => setSingleWayCheckbox(true)}
          />
          <label htmlFor="singleWayCheckbox" className={styles.checkboxText}>
            One direction
          </label>
          <input
            type="checkbox"
            id="twoWayCheckbox"
            className={styles.checkbox}
            checked={!singleWayCheckbox}
            onChange={() => setSingleWayCheckbox(false)}
          />
          <label htmlFor="twoWayCheckbox" className={styles.checkboxText}>
            Two direction
          </label>
        </div>
  */}
        <div className={styles.destinationInputRow}>
          <AutocompleteTextInput
            value={departureTextInput}
            onChange={setDepartureTextInput}
            placeholder="Departure airport"
            className={styles.textInput}
            setAirportID={setDepartureID}
          />
          <SwapHorizIcon className={styles.iconSwap} onClick={handleSwap} />
          <AutocompleteTextInput
            value={arrivalTextInput}
            onChange={setArrivalTextInput}
            placeholder="Arrival airport"
            className={styles.textInput}
            setAirportID={setArricalID}
          />
        </div>

        <div className={styles.datePickerBox}>
          <CalendarMonthIcon
            className={styles.icon}
            onClick={() => datePickerRefDeparture.current.setFocus(true)}
          />
          <DatePicker
            ref={datePickerRefDeparture}
            className={styles.dateInput}
            selected={departureDateInput}
            onChange={setDepartureDateInput}
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
            onChange={setArrivaleDateInput}
            dateFormat="yyyy-MM-dd"
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
            value="Search"
            onClick={getFlights}
          />
          <input
            type="button"
            className={styles.confirmButton}
            value="Clear"
            onClick={clearInputs}
          />
        </div>
        {/*
        <div>
          Filtry
          <TuneIcon />
          <select>
            <option>asd</option>
          </select>
        </div>
        */}
      </div>
    </div>
  );
}

MainFinder.propTypes = {
  activateFinder: PropTypes.func.isRequired,
  setFlights: PropTypes.func.isRequired,
};

export default MainFinder;
