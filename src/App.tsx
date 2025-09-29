import { useEffect } from "react";
import "./App.css";
import "cardsJS/cards.css";
import useGame from "./hooks/useGame";

function App() {
  const {
    deck,
    room,
    hand,
    initialize,
    triggerRoomCard,
    health,
    canEnterNewRoom,
    enterRoom,
  } = useGame();

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _handleEnterRoom = () => {
    if (canEnterNewRoom) {
      enterRoom();
    }
  };

  return (
    <div className="play-area">
      <h1>Health: {health}</h1>
      <p>Remaining Deck Cards: {deck.length}</p>
      <div className="hand hhand active-hand room-hand">
        <img
          className={`card deck ${canEnterNewRoom ? "" : "inactive"}`}
          src="cards/Red_Back.svg"
          onClick={_handleEnterRoom}
        />
        {room.map((card) => (
          <img
            key={card}
            className="card"
            src={`cards/${card}.svg`}
            onClick={() => triggerRoomCard(card)}
          />
        ))}
      </div>
      <div className="hand hhand-compact weapon-hand">
        {hand.map((card) => (
          <img key={card} className="card" src={`cards/${card}.svg`} />
        ))}
        <img className="card hidden" src={`cards/Red_Back.svg`} />
      </div>
    </div>
  );
}

export default App;
