import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import axiosInstance from "../axiosInstance";


const AutocompleteTextInput = ({
  value,
  onChange,
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
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const renderSuggestions = () => {
    if (showSuggestions && value) {
      if (filteredSuggestions.length) {
        return (
          <ul style={suggestionsListStyle}>
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                style={suggestionItemStyle}
                onClick={() => handleSelectSuggestion(suggestion.airport)}
              >
                {suggestion.airport}
              </li>
            ))}
          </ul>
        );
      } else {
        return <div></div>;
      }
    }
    return null;
  };

  return (
    <div style={{ ...containerStyle, flex: 1 }}>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        style={{ ...textInputStyle, ...style }}
        {...props}
      />
      {renderSuggestions()}
    </div>
  );
};

AutocompleteTextInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  style: PropTypes.object,
};

AutocompleteTextInput.defaultProps = {
  placeholder: "",
  style: {},
};

const containerStyle = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
};

const textInputStyle = {
  flex: 1,
  border: "0px",
  borderRadius: "5px",
  padding: "10px",
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: "20px",
};

const suggestionsListStyle = {
  listStyle: "none",
  padding: "0",
  margin: "5px 0",
  borderRadius: "4px",
  position: "absolute",
  top: "100%",
  left: 0,
  zIndex: 999,
  backgroundColor: "lightgray",
  maxHeight: "50vh",
  overflowY: "auto",
  fontFamily: "Lato",
};

const suggestionItemStyle = {
  padding: "8px",
  cursor: "pointer",
  fontSize: 18,
  borderBottom: "2px solid orange",
};

export default AutocompleteTextInput;
