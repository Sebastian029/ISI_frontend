const Seat = ({seat, handleTicketReservation}) => {
    const color = seat.is_bought ? "#FE5F55" : "#499167";
    const style = {
      position: "absolute",
      left: `${seat.column*2}em`,
      top: `${seat.row*2}em`,
      backgroundColor: color,
      color: "white"
    }
    
    
    return (
      <div className = 'seat' style={style} onClick={() => handleTicketReservation(seat)}>
        <p>{seat.column}-{seat.row}</p>
      </div>
    )
  }
  export default Seat;