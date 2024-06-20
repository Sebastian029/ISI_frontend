import React, { useState } from "react";

const Seat = ({ seat, handleTicketReservation }) => {
  const [hovered, setHovered] = useState(false);

  const baseColor = seat.is_bought ? "#FE5F55" : "#499167";
  const pointer = seat.is_bought ? "default" : "pointer";
  const marginLeft = seat.column === 3 ? "3em" : "5px";

  const color = hovered && !seat.is_bought ? "#6BB379" : baseColor;

  const style = {
    // position: "absolute",
    // left: `${seat.column*2}em`,
    // top: `${seat.row*2}em`,
    backgroundColor: color,
    color: "white",
    display: "flex",
    flexDirection: "column",
    order: seat.row,
    margin: "5px",
    marginLeft: marginLeft,
    width: "3em",
    height: "3em",
    borderRadius: "10px",
    alignItems: "center",
    justifyItems: "center",
    padding: "1%",
    cursor: pointer,
    transition: "background-color 0.3s",
  };

  return (
    <div
      className="seat"
      style={style}
      onClick={() => handleTicketReservation(seat)}
      onMouseEnter={() => setHovered(true)} // Set hovered state to true on mouse enter
      onMouseLeave={() => setHovered(false)} // Set hovered state to false on mouse leave
    >
      <div style={{ marginBottom: "3px" }}>
        {seat.column}-{seat.row}
      </div>
      <div>{seat.ticket_class === "business" ? "B" : "E"}</div>
    </div>
  );
};

export default Seat;
