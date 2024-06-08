import Seat from "./Seat";

const Deck = ({tickets, num_columns, total_seats, handleTicketReservation}) => {
  const width = num_columns;
  const length = Math.ceil(total_seats / width);
 
  console.log("a"+tickets);
  console.log("c"+tickets.tickets);
  console.log("w"+width);
  console.log("l"+length);


  return (
    <div id="deck" style={{width:`${width*2.2}em`, height:`${length*2.1}em`}}>
      {tickets.map((seat, i) =>
            <Seat
                seat = {seat} 
                handleTicketReservation={handleTicketReservation}
                key={i}
            />
        )}
    </div>
  )
}
  export default Deck;