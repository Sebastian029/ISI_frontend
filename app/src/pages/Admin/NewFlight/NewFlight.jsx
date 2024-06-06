import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FlightIcon from "@mui/icons-material/Flight";
import AirlinesIcon from "@mui/icons-material/Airlines";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
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

function NewFlight() {
  const [departureAirport, setDepartureAirport] = useState("");
  const [arrivalAirport, setArrivalAirport] = useState("");
  const [departureDateInput, setDepartureDateInput] = useState(null);
  const [arrivalDateInput, setArrivalDateInput] = useState(null);
  const [plane, setPlaneTextInput] = useState("");
  const [distance, setDistanceTextInput] = useState("");
  const [airline, setAirlineTextInput] = useState("");
  const [travelTime, setTravelTimeTextInput] = useState("");
  const [distanceError, setDistanceError] = useState("");
  const [travelTimeError, setTravelTimeError] = useState("");
  const datePickerRefDeparture = useRef(null);
  const datePickerRefArrival = useRef(null);
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
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const validateDistance = (distance) => {
    const regex = /^[0-9]*\.?[0-9]+$/;
    return regex.test(distance);
  };

  const validateTravelTime = (time) => {
    const regex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    return regex.test(time);
  };

  const saveFlightData = async () => {
    if (!validateDistance(distance)) {
      setDistanceError("Distance must be a valid float.");
      return;
    } else {
      setDistanceError("");
    }

    if (!validateTravelTime(travelTime)) {
      setTravelTimeError("Travel time must be in the format 00:00:00.");
      return;
    } else {
      setTravelTimeError("");
    }

    try {
      const data = {
        departure_airport_id: airports.find(
          (ap) => ap.airport_name === departureAirport
        )?.airport_id,
        arrive_airport_id: airports.find(
          (ap) => ap.airport_name === arrivalAirport
        )?.airport_id,
        travel_time: travelTime,
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
        <div className={styles.globalInputBox}>
          <div className={styles.destinationInputRow}>
            <FormControl
              className={`${styles.textInput} ${styles.departureInput}`}
            >
              <InputLabel id="departure-airport-select-label">
                Departure
              </InputLabel>
              <Select
                labelId="departure-airport-select-label"
                value={departureAirport}
                onChange={(e) => setDepartureAirport(e.target.value)}
                label="Departure"
              >
                {airports.map((airport) => (
                  <MenuItem
                    key={airport.airport_id}
                    value={airport.airport_name}
                  >
                    {airport.airport_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <SwapHorizIcon className={styles.iconSwap} onClick={handleSwap} />
            <FormControl
              className={`${styles.textInput} ${styles.arrivalInput}`}
            >
              <InputLabel id="arrival-airport-select-label">Arrival</InputLabel>
              <Select
                labelId="arrival-airport-select-label"
                value={arrivalAirport}
                onChange={(e) => setArrivalAirport(e.target.value)}
                label="Arrival"
              >
                {airports.map((airport) => (
                  <MenuItem
                    key={airport.airport_id}
                    value={airport.airport_name}
                  >
                    {airport.airport_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
                dateFormat="dd-MM-yyyy"
                placeholderText="Departure date"
              />
              <ArrowOutwardIcon className={styles.icon} />
              <input
                type="text"
                value={distance}
                onChange={(e) => setDistanceTextInput(e.target.value)}
                placeholder="Distance"
                className={styles.personInput}
              />
              {distanceError && (
                <div className={styles.error}>{distanceError}</div>
              )}
              <AccessTimeIcon className={styles.icon} />
              <input
                type="text"
                value={travelTime}
                onChange={(e) => setTravelTimeTextInput(e.target.value)}
                placeholder="Travel Time"
                className={styles.personInput}
              />
              {travelTimeError && (
                <div className={styles.error}>{travelTimeError}</div>
              )}
              <FlightIcon className={styles.icon} />
              <FormControl className={styles.personInput}>
                <InputLabel id="plane-select-label">Plane</InputLabel>
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
              <FormControl className={styles.personInput}>
                <InputLabel id="airline-select-label">Airline</InputLabel>
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
            <input
              type="button"
              className={styles.confirmButton}
              value={"Add"}
              onClick={() => saveFlightData()}
            />
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {success === "Success" ? "Success" : "Failure"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {success === "Success"
              ? "Flight has been successfully added!"
              : "Failed to add flight."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}



export default NewFlight;
