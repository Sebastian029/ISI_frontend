import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import axiosInstance from "../../axiosInstance";
import styles from "./AutocompleteTextInput.module.css";
import { Input } from "antd";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";


const AutocompleteTextInput = ({
  value,
  onChange,
  setAirportID,
  placeholder,
  style,
  ...props
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    axiosInstance
      .get("/city_airports")
      .then((response) => {
        setSuggestions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data from /city_airports:", error);
      });
  }, []);

  const handleChange = (e) => {
    const input = e.target.value;
    onChange(input);
    const filtered = suggestions.filter(
      (suggestion) =>
        suggestion.airport.toLowerCase().indexOf(input.toLowerCase()) > -1
    );
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (suggestion) => {
    onChange(suggestion.airport);
    setShowSuggestions(false);
    setAirportID(suggestion.airport_id);
  };

  const renderSuggestions = () => {
    if (showSuggestions && value) {
      if (filteredSuggestions.length) {
        return (
          <ul className={styles.suggestionsList}>
            {filteredSuggestions.map((suggestion) => (
              <li
                key={suggestion.airport_id}
                className={styles.suggestionItem}
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion.airport}
              </li>
            ))}
          </ul>
        );
      } else {
        return <div>No suggestions available</div>;
      }
    }
    return null;
  };
  const IconComponent =
    placeholder === "Departure airport" ? FlightTakeoffIcon : FlightLandIcon;

  return (
    <div ref={wrapperRef} className={styles.container} style={{ flex: 1 }}>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={styles.textInput}
        style={style}
        prefix={<IconComponent />}
        {...props}
      />
      {renderSuggestions()}
    </div>
  );
};

AutocompleteTextInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  setAirportID: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  style: PropTypes.object,
};

AutocompleteTextInput.defaultProps = {
  placeholder: "",
  style: {},
};

export default AutocompleteTextInput;
