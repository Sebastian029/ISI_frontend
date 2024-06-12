import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { TimePicker, DatePicker, InputNumber } from "antd";
import "antd/dist/reset.css";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import FlightIcon from "@mui/icons-material/Flight";
import AirlinesIcon from "@mui/icons-material/Airlines";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import axios from "./../../../axiosInstance";
import TopBar from "../TopBar/TopBar";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import styles from "./NewFlight.module.css";
import dayjs from "dayjs";

function NewFlight() {
  const [departureAirport, setDepartureAirport] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [departureDateInput, setDepartureDateInput] = useState(null);
  const [arrivalDateInput, setArrivalDateInput] = useState(null);
  const [plane, setPlaneTextInput] = useState("");
  const [distance, setDistanceTextInput] = useState(null);
  const [airline, setAirlineTextInput] = useState("");
  const [travelTime, setTravelTime] = useState(null);
  const [distanceError, setDistanceError] = useState("");
  const [travelTimeError, setTravelTimeError] = useState("");
  const axiosPrivate = useAxiosPrivate();
  const [planes, setPlanes] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSwap = () => {
    const temp = departureAirport;
    setDepartureAirport(arrivalAirport);
    setArrivalAirport(temp);
  };

  const formatDate = (date) => {
    return dayjs(date).format("YYYY-MM-DD");
  };

  const formatTime = (time) => {
    return dayjs(time).format("HH:mm");
  };

  const validateDistance = (distance) => {
    const regex = /^[0-9]*\.?[0-9]+$/;
    return regex.test(distance);
  };

  const handleClear = () => {
    setDepartureAirport("");
    setArrivalAirport("");
    setDepartureDateInput(null);
    setArrivalDateInput(null);
    setPlaneTextInput("");
    setDistanceTextInput(null);
    setAirlineTextInput("");
    setTravelTime(null);
    setDistanceError("");
    setTravelTimeError("");
  };

  const handleTimeChange = (time) => {
    setTravelTime(time);
  };

  const saveFlightData = async () => {
    if (!validateDistance(distance)) {
      setDistanceError("Distance must be a valid float.");
      return;
    } else {
      setDistanceError("");
    }

    try {
      const data = {
        departure_airport_id: airports.find(
          (ap) => ap.airport_name === departureAirport
        )?.airport_id,
        arrive_airport_id: airports.find(
          (ap) => ap.airport_name === arrivalAirport
        )?.airport_id,
        travel_time: formatTime(travelTime),
        distance: distance,
        plane_id: planes.find((p) => p.plane_name === plane)?.plane_id,
        airline_id: airlines.find((al) => al.airline_name === airline)
          ?.airline_id,
        data_lotu: formatDate(departureDateInput),
      };

      const response = await axiosPrivate.post("/flight_register", data);
      console.log(response.data);
      setOpen(true);
      setSuccess("Success");
    } catch (error) {
      console.error("Error registering flight:", error);
      setOpen(true);
      setSuccess("Failure");
    }
  };

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const response = await axiosPrivate.get("/planes");
        setPlanes(response.data);
      } catch (error) {
        console.error("Error fetching planes:", error);
      }
    };

    const fetchAirlines = async () => {
      try {
        const response = await axiosPrivate.get("/airlines");
        setAirlines(response.data);
      } catch (error) {
        console.error("Error fetching airlines:", error);
      }
    };

    const fetchAirports = async () => {
      try {
        const response = await axiosPrivate.get("/airports");
        setAirports(response.data);
      } catch (error) {
        console.error("Error fetching airports:", error);
      }
    };

    fetchPlanes();
    fetchAirlines();
    fetchAirports();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TopBar />
      <div className={styles.mainBox}>
        <div className={`${styles.formContainer} ${styles.box}`}>
          <div className={styles.destinationInputRow}>
            <Select
              value={departureAirport}
              onChange={(e) => setDepartureAirport(e.target.value)}
            >
              {airports.map((airport) => (
                <MenuItem key={airport.airport_id} value={airport.airport_name}>
                  {airport.airport_name}
                </MenuItem>
              ))}
            </Select>

            <SwapHorizIcon className={styles.iconSwap} onClick={handleSwap} />
            <Select
              labelId="arrival-airport-select-label"
              value={arrivalAirport}
              onChange={(e) => setArrivalAirport(e.target.value)}
            >
              {airports.map((airport) => (
                <MenuItem key={airport.airport_id} value={airport.airport_name}>
                  {airport.airport_name}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div className={styles.datePickerBox}>
            <DatePicker
              className={styles.inputContainer}
              value={departureDateInput}
              onChange={setDepartureDateInput}
              format="DD-MM-YYYY"
              placeholder="Departure date"
            />
            <ArrowOutwardIcon className={styles.icon} />
            <InputNumber
              value={distance}
              onChange={(value) => setDistanceTextInput(value)}
              placeholder="Distance"
              className={styles.inputContainer}
            />
            {distanceError && (
              <div className={styles.error}>{distanceError}</div>
            )}
            <AccessTimeIcon className={styles.icon} />
            <div className={styles.inputContainer}>
              <label
                className={travelTime ? styles.inputLabelActive : ""}
                id="time-picker-label"
              >
                Travel Time
              </label>
              <TimePicker
                className={styles.timePicker}
                value={travelTime}
                onChange={handleTimeChange}
                format="HH:mm"
                placeholder="Travel Time"
              />
            </div>
            {travelTimeError && (
              <div className={styles.error}>{travelTimeError}</div>
            )}
            <FlightIcon className={styles.icon} />
            <FormControl className={styles.inputContainer}>
              <InputLabel
                className={plane ? styles.inputLabelActive : ""}
                id="plane-select-label"
              >
                Plane
              </InputLabel>
              <Select
                labelId="plane-select-label"
                value={plane}
                onChange={(e) => setPlaneTextInput(e.target.value)}
                label="Plane"
              >
                {planes.map((plane) => (
                  <MenuItem key={plane.plane_id} value={plane.plane_name}>
                    {plane.plane_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <AirlinesIcon className={styles.icon} />
            <FormControl className={styles.inputContainer}>
              <InputLabel
                className={airline ? styles.inputLabelActive : ""}
                id="airline-select-label"
              >
                Airline
              </InputLabel>
              <Select
                labelId="airline-select-label"
                value={airline}
                onChange={(e) => setAirlineTextInput(e.target.value)}
                label="Airline"
              >
                {airlines.map((airline) => (
                  <MenuItem
                    key={airline.airline_id}
                    value={airline.airline_name}
                  >
                    {airline.airline_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <input
              type="button"
              className={styles.confirmButton}
              value={"Add"}
              onClick={saveFlightData}
            />
            <input
              type="button"
              className={styles.confirmButton}
              value={"Clear"}
              onClick={handleClear}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default NewFlight;
