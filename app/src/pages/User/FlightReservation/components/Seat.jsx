const Seat = ({seat, handleTicketReservation}) => {
    const color = seat.is_bought ? "#FE5F55" : "#499167";
    const pointer = seat.is_bought ? 'default' : 'pointer'
    const marginLeft = seat.column === 3 ? '3em' : '5px';
    const style = {
      // position: "absolute",
      // left: `${seat.column*2}em`,
      // top: `${seat.row*2}em`,
      backgroundColor: color,
      color: "white",
      display: "flex",
      flexDirection: 'column',
      order: seat.row,
      margin: '5px',
      marginLeft: marginLeft,
      width:'3em',
      height:'3em',
      borderRadius:'10px',
      alignItems: 'center',
      justifyItems:'center',
      padding: '1%',
      cursor: pointer,
    }
    
    
    return (
      <div className = 'seat' style={style} onClick={() => handleTicketReservation(seat)}>
        <div style={{marginBottom:'3px'}}>{seat.column}-{seat.row}</div>
        <div>{seat.ticket_class=="business" ? 'B' : 'E'}</div>
      </div>
    )
  }
  export default Seat;