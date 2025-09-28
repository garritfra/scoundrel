import { useState } from "react";
import useDeck from "./useDeck";

const useGame = () => {
  const { deck, shuffle, draw, discard } = useDeck();
  const [hand, setHand] = useState<string[]>([]);
  const [discarded, setDiscarded] = useState<string[]>([]);
  const [room, setRoom] = useState<string[]>([]);
  const [health, setHealth] = useState(20);

  const initialize = () => {
    // Search through the deck and remove all Jokers, Red Face Cards and Red Aces.
    const redFaces = ["JH", "JD", "QH", "QD", "KH", "KD", "AH", "AD"];
    for (const card of redFaces) {
      discard(card);
    }

    // Shuffle the remaining cards and place the pile face down on your left.
    shuffle();

    // Draw 4 cards off the top of the deck and place them face up in front of you to make an Room.
    enterRoom();
  };

  const enterRoom = () => {
    // On your first and every turn, flip over cards off the top of the deck,
    // one by one, until you have 4 cards face up in front of you to make an Room.
    const newRoom = draw(4 - room.length);
    setRoom((currentRoom) => [...currentRoom, ...newRoom]);
  };

  return { deck, shuffle, initialize, room, enterRoom };
};

export default useGame;
