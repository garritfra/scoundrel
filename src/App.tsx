import "./App.css";
import "cardsJS/cards.css";

function App() {
  return (
    <div className="play-area">
      <div className="hand hhand active-hand room-hand">
        <img className="card deck" src="cards/Red_Back.svg" />
        <img className="card" src="cards/AS.svg" />
        <img className="card" src="cards/KS.svg" />
        <img className="card" src="cards/QS.svg" />
        <img className="card" src="cards/JS.svg" />
      </div>
      <div className="hand hhand-compact weapon-hand">
        <img className="card" src="cards/AS.svg" />
        <img className="card" src="cards/KS.svg" />
        <img className="card" src="cards/QS.svg" />
        <img className="card" src="cards/JS.svg" />
      </div>
    </div>
  );
}

export default App;
