import Seat from "./Seat";
import styles from "../FlightReservation.module.css"

const Deck = ({tickets, num_columns, total_seats, handleTicketReservation}) => {
  const width = num_columns+2;
  const length = Math.ceil(total_seats / width);
  const deckWidth = (width + 3) * 3.2;
  const deckWidthM = (width + 3) * 2;
  
 
  // console.log("a"+tickets);
  // console.log("c"+tickets.tickets);
  // console.log("w"+width);
  // console.log("l"+length);


  return (
    <div 
      id="deck" 
      className={styles.deck} 
      style={
        { 
          "--deck-width": `${deckWidth}em`,
          "--deck-widthM": `${deckWidthM}em`,

        }
      }>
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