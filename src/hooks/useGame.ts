import { useState } from "react";
import useDeck from "./useDeck";

const useGame = () => {
  const { deck, shuffle, draw, discard, reset } = useDeck();
  const [hand, setHand] = useState<string[]>([]);
  const [discarded, setDiscarded] = useState<string[]>([]);
  const [room, setRoom] = useState<string[]>([]);
  const [health, setHealth] = useState(20);

  const initialize = () => {
    // Start with a standard 52-card deck.
    reset();

    // Search through the deck and remove all Jokers, Red Face Cards and Red Aces.
    const redFaces = ["JH", "JD", "QH", "QD", "KH", "KD", "AH", "AD"];
    for (const card of redFaces) {
      discard(card);
    }

    // Shuffle the remaining cards and place the pile face down on your left.
    shuffle();

    // Clear the room and draw 4 cards
    enterRoom();
  };

  const enterRoom = () => {
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
  };

  return { deck, shuffle, initialize, room, setRoom, enterRoom };
};

export default useGame;
