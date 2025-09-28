import { useState } from "react";
import useDeck from "./useDeck";

const useGame = () => {
  const { deck, shuffle, draw, initializeAndDraw } = useDeck();
  const [room, setRoom] = useState<string[]>([]);

  function initialize() {
    // Initialize deck, remove red faces, shuffle, and draw 4 cards in one coordinated operation
    const roomCards = initializeAndDraw();
    setRoom(roomCards);
  }

  function enterRoom() {
    // On your first and every turn, flip over cards off the top of the deck,
    // one by one, until you have 4 cards face up in front of you to make an Room.
    setRoom((currentRoom) => {
      const cardsNeeded = 4 - currentRoom.length;
      if (cardsNeeded > 0) {
        const newCards = draw(cardsNeeded);
        return [...currentRoom, ...newCards];
      }
      return currentRoom;
    });
  }

  return { deck, shuffle, initialize, room, setRoom, enterRoom };
};

export default useGame;
