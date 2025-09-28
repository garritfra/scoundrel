import { useState, useEffect, useRef } from "react";
import useDeck from "./useDeck";

const useGame = () => {
  const { deck, shuffle, draw, discard, discardMultiple, reset, initializeAndDraw } = useDeck();
  const [hand, setHand] = useState<string[]>([]);
  const [discarded, setDiscarded] = useState<string[]>([]);
  const [room, setRoom] = useState<string[]>([]);
  const [health, setHealth] = useState(20);

  useEffect(() => {
    console.log("Deck changed:", deck);
  }, [deck]);

  function initialize() {
    // Initialize deck, remove red faces, shuffle, and draw 4 cards in one coordinated operation
    const roomCards = initializeAndDraw();
    setRoom(roomCards);
  }

  function enterRoom() {
    // On your first and every turn, flip over cards off the top of the deck,
    // one by one, until you have 4 cards face up in front of you to make an Room.
    const cardsNeeded = 4 - room.length;
    if (cardsNeeded > 0) {
      const newCards = draw(cardsNeeded);
      setRoom(currentRoom => [...currentRoom, ...newCards]);
    }
  }

  return { deck, shuffle, initialize, room, setRoom, enterRoom };
};

export default useGame;
