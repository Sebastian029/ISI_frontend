import Deck from './components/Deck';
function Map(seatMap) {
  return (
    <div className="App">
      {seatMap.data[0].decks.map((deck, i) => (
        <Deck deck={deck} key={i} />
      ))}
    </div>
  );
}
export default Map;