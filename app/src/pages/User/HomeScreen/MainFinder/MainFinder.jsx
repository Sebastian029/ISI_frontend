import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "react-datepicker/dist/react-datepicker.css";
import AutocompleteTextInput from "../../../../comp/AutocompleteTextInput/AutocompleteTextInput.jsx";
import axios, { axiosPrivate } from "../../../../axiosInstance.js";
import styles from "./MainFinder.module.css";
import useAuth from "../../../../hooks/useAuth.jsx";
import { DatePicker } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
dayjs.extend(customParseFormat);

function MainFinder({ activateFinder, setFlights }) {
  const dateFormat = "YYYY-MM-DD";
  const [departureTextInput, setDepartureTextInput] = useState("");
  const [arrivalTextInput, setArrivalTextInput] = useState("");
  const [departureDateInput, setDepartureDateInput] = useState(null);
  const { auth } = useAuth();
  const [arrivalID, setArricalID] = useState(null);
  const [departureID, setDepartureID] = useState(null);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("flightSearchData"));

    if (savedData) {
      setDepartureTextInput(savedData.departureTextInput);
      setArrivalTextInput(savedData.arrivalTextInput);
      setDepartureDateInput(
        savedData.departureDateInput
          ? dayjs(savedData.departureDateInput, "YYYY-MM-DD")
          : null
      );

      setArricalID(savedData.arrivalID);
      setDepartureID(savedData.departureID);
    } else {
      setDepartureDateInput(null);
    }
  }, []);

  const getFlights = async () => {
    try {
      const params = {
        departure_airport_id: departureID,
        arrive_airport_id: arrivalID,
      };
      if (departureDateInput) {
        params.data_lotu = dayjs(departureDateInput, dateFormat).format(
          dateFormat
        );
      }
      console.log(params);
      console.log(auth.accessToken);
      let response;
      try {
        response = await axiosPrivate.get("/flights_with_airports_token", {
          params,
        });
      } catch (error) {
        console.log();
        try {
          response = await axios.get("/flights_with_airports", { params });
        } catch (secondError) {
          console.log("Get flights failed", secondError.message);
        }
      }

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
      departureDateInput: departureDateInput,
      arrivalID,
      departureID,
    };
    localStorage.setItem("flightSearchData", JSON.stringify(dataToSave));
  };

  const clearInputs = () => {
    setDepartureTextInput("");
    setArrivalTextInput("");
    setDepartureDateInput(null);
    setDepartureID(null);
    setArricalID(null);
    activateFinder(false);
    localStorage.removeItem("flightSearchData");
  };
  const onDateChange = (date) => {
    setDepartureDateInput(date);
  };

  return (
    <div className={styles.mainBox}>
      <div className={styles.mainGridLayout}>
        <AutocompleteTextInput
          value={departureTextInput}
          onChange={setDepartureTextInput}
          placeholder="Departure airport"
          className={styles.textInput}
          setAirportID={setDepartureID}
        />
        <DatePicker
          className={styles.dateInput}
          onChange={onDateChange}
          format={dateFormat}
          placeholderText="Departure date"
          value={departureDateInput}
        />

        <AutocompleteTextInput
          value={arrivalTextInput}
          onChange={setArrivalTextInput}
          placeholder="Arrival airport"
          className={styles.textInput}
          setAirportID={setArricalID}
        />
        <input
          type="button"
          className={styles.confirmButton}
          value="Clear"
          onClick={clearInputs}
        />
        <input
          type="button"
          className={styles.searchButton}
          value="Search"
          onClick={getFlights}
        />
      </div>
    </div>
  );
}

MainFinder.propTypes = {
  activateFinder: PropTypes.func.isRequired,
  setFlights: PropTypes.func.isRequired,
};

export default MainFinder;
