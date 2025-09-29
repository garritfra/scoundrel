import { useState } from "react";
import * as deckUtils from "../utils/deck";

const RANKS = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J", // Jack
  "Q", // Queen
  "K", // King
  "A", // Ace
];

const SUITS = [
  "H", // Hearts
  "D", // Diamonds
  "C", // Clubs
  "S", // Spades
];

const initialDeck = RANKS.flatMap((rank) =>
  SUITS.map((suit) => `${rank}${suit}`)
);

const useGame = () => {
  const [deck, setDeck] = useState(initialDeck);
  const [room, setRoom] = useState<string[]>([]);
  const [hand, setHand] = useState<string[]>([]);

  function shuffle() {
    setDeck((currentDeck) => deckUtils.shuffle(currentDeck));
  }

  function discard(card: string) {
    setDeck((currentDeck) => deckUtils.discard(currentDeck, [card]));
  }

  function discardMultiple(cards: string[]) {
    setDeck((currentDeck) => deckUtils.discard(currentDeck, cards));
  }

  function initialize() {
    const redFaces = ["JH", "JD", "QH", "QD", "KH", "KD", "AH", "AD"];
    const filtered = deckUtils.discard(initialDeck, redFaces);

    const shuffled = deckUtils.shuffle(filtered);

    const [roomCards, remainingDeck] = deckUtils.draw(shuffled, 4);

    setDeck(remainingDeck);
    setRoom(roomCards);
    setHand([]);
  }

  const _equipWeapon = (card: string) => {
    setHand([card]);
    const remaininRoom = room.filter((c) => c !== card);
    setRoom(remaininRoom);
  };

  const triggerRoomCard = (card: string) => {
    const suit = deckUtils.suit(card);

    switch (suit) {
      case deckUtils.Suit.Diamonds:
        _equipWeapon(card);
        break;
    }
  };

  return {
    deck,
    hand,
    triggerRoomCard,
    shuffle,
    discard,
    discardMultiple,
    initialize,
    room,
    setRoom,
  };
};

export default useGame;
