import { useEffect } from "react";
import "./App.css";
import "cardsJS/cards.css";
import useGame from "./hooks/useGame";

function App() {
  const { room, hand, initialize, triggerRoomCard } = useGame();

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="play-area">
      <div className="hand hhand active-hand room-hand">
        <img className="card deck" src="cards/Red_Back.svg" />
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
      </div>
    </div>
  );
}

export default App;
