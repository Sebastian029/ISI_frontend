import React, { useState, useRef, useEffect } from "react";

const AutocompleteTextInput = ({
  value,
  onChange,
  placeholder,
  style,
  ...props
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = ["Apple", "Banana", "Orange", "Pineapple", "Grapes"];
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Function to handle clicks outside of component
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on component unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleChange = (e) => {
    const input = e.target.value;
    onChange(input);

    const filtered = suggestions.filter(
      (suggestion) => suggestion.toLowerCase().indexOf(input.toLowerCase()) > -1
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
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                {suggestion}
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

// Styles
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
  backgroundColor: "lime",
};

const suggestionItemStyle = {
  padding: "10px",
  cursor: "pointer",
};

export default AutocompleteTextInput;
