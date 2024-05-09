import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import axios from "./../../../axiosInstance";
import TopBar from "../TopBar/TopBar";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import styles from "./NewFlight.module.css";

function NewFlight({ activateFinder }) {
  const [departureTextInput, setDepartureTextInput] = useState("");
  const [arrivalTextInput, setArrivalTextInput] = useState("");
  const [departureDateInput, setDepartureDateInput] = useState(null);
  const [arrivalDateInput, setArrivalDateInput] = useState(null);
  const [plane, setPlaneTextInput] = useState("");
  const [distance, setDistanceTextInput] = useState("");
  const [airline, setAirlineTextInput] = useState("");
  const [travelTime, setTravelTimeTextInput] = useState("");
  const datePickerRefDeparture = useRef(null);
  const datePickerRefArrival = useRef(null);
  const axiosPrivate = useAxiosPrivate();

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

  const saveFlightData = async () => {
    try {
      console.log(departureTextInput);
      const data = {
        departure_airport: departureTextInput,
        arrive_airport: arrivalTextInput,
        travel_time: travelTime,
        distance: distance,
        plane_name: plane,
        airline_name: airline,
        data_lotu: formatDate(departureDateInput)
      };
  
      const response = await axiosPrivate.post('/flight_register', data);
      console.log(response.data);
    } catch (error) {
      console.error('Error registering flight:', error);
    }
  };

  const clearInputs = () => {
    setDepartureTextInput("");
    setArrivalTextInput("");
    setDepartureDateInput(null);
    setArrivalDateInput(null);
    setPlaneTextInput("");
    setDistanceTextInput("");
    setAirlineTextInput("");
    setTravelTimeTextInput("");
  };

  return (
    <>
      <TopBar />
      <div className={styles.mainBox}>
        <div className={styles.globalInputBox}>
          <div className={styles.destinationInputRow}>
            <input
              className={styles.textInput}
              type="text"
              value={departureTextInput}
              onChange={(e) => setDepartureTextInput(e.target.value)}
              placeholder="Departure"
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
                placeholderText="Departure date"
              />
              <input
                type="text"
                value={distance}
                onChange={(e) => setDistanceTextInput(e.target.value)}
                placeholder="Distance"
                className={styles.personInput}
              />
              <input
                type="text"
                value={travelTime}
                onChange={(e) => setTravelTimeTextInput(e.target.value)}
                placeholder="Travel Time"
                className={styles.personInput}
              />
              <input
                type="text"
                value={plane}
                onChange={(e) => setPlaneTextInput(e.target.value)}
                placeholder="Plane"
                className={styles.personInput}
              />
              <input
                type="text"
                value={airline}
                onChange={(e) => setAirlineTextInput(e.target.value)}
                placeholder="Airline"
                className={styles.personInput}
              />
            </div>
            <input
              type="button"
              className={styles.confirmButton}
              value={"Add"}
              onClick={() => saveFlightData()} 
            />
            <input
              type="button"
              className={styles.confirmButton}
              value={"Clear"}
              onClick={() => clearInputs()}
            />
          </div>
        </div>
      </div>
    </>
  );
}

NewFlight.propTypes = {
  activateFinder: PropTypes.func.isRequired,
};

export default NewFlight;
