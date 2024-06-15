const Seat = ({seat, handleTicketReservation}) => {
    const color = seat.is_bought ? "#FE5F55" : "#499167";
    const marginLeft = seat.column === 3 ? '3em' : '5px';
    const style = {
      // position: "absolute",
      // left: `${seat.column*2}em`,
      // top: `${seat.row*2}em`,
      backgroundColor: color,
      color: "white",
      // display: "flex",
      order: seat.row,
      margin: '5px',
      marginLeft: marginLeft,
      width:'3em',
      height:'3em'
    }
    
    
    return (
      <div className = 'seat' style={style} onClick={() => handleTicketReservation(seat)}>
        <p style={{marginBottom:'3px'}}>{seat.column}-{seat.row}</p>
        <p>{seat.ticket_class=="buisness" ? 'B' : 'E'}</p>
      </div>
    )
  }
  export default Seat;