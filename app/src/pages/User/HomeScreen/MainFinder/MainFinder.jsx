import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "react-datepicker/dist/react-datepicker.css";
import AutocompleteTextInput from "../../../../comp/AutocompleteTextInput/AutocompleteTextInput.jsx";
import axios from "../../../../axiosInstance.js";
import useAxiosPrivate from "../../../../hooks/useAxiosPrivate.jsx";
import styles from "./MainFinder.module.css";
import useAuth from "../../../../hooks/useAuth.jsx";
import { DatePicker } from "antd";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { CalendarOutlined } from "@ant-design/icons";
dayjs.extend(customParseFormat);

function MainFinder({ activateFinder, setFlights }) {
  const displayDateFormat = "DD-MM-YYYY";
  const sendDateFormat = "YYYY-MM-DD";
  const [departureTextInput, setDepartureTextInput] = useState("");
  const [arrivalTextInput, setArrivalTextInput] = useState("");
  const [departureDateInput, setDepartureDateInput] = useState(null);
  const { auth } = useAuth();
  const [arrivalID, setArricalID] = useState(null);
  const [departureID, setDepartureID] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("flightSearchData"));

    if (savedData) {
      setDepartureTextInput(savedData.departureTextInput);
      setArrivalTextInput(savedData.arrivalTextInput);
      const parsedDate = savedData.departureDateInput
        ? dayjs(savedData.departureDateInput, sendDateFormat)
        : null;
      const updatedDate = parsedDate ? parsedDate.add(1, "day") : null;
      setDepartureDateInput(updatedDate);

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
        params.data_lotu = dayjs(departureDateInput).format(sendDateFormat);
      }
      console.log(params);

      let response;
      if (auth && auth.accessToken) {
        try {
          response = await axiosPrivate.get("/flights_with_airports_token", {
            params,
          });
        } catch (error) {
          console.log("Get flights with token failed", error.message);
          response = await axios.get("/flights_with_airports", { params });
        }
      } else {
        response = await axios.get("/flights_with_airports", { params });
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
          className={`${styles.dateInput} custom-date-picker`}
          suffixIcon={<CalendarOutlined className={styles.customIcon} />}
          onChange={onDateChange}
          format={displayDateFormat}
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
