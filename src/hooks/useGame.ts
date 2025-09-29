import { useState, useEffect } from "react";

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

  useEffect(() => {
    console.log("Deck changed:", deck);
  }, [deck]);

  function reset() {
    setDeck(initialDeck);
    setRoom([]);
  }

  function shuffle() {
    const shuffledDeck = [...deck];
    let currentIndex = deck.length;

    while (currentIndex != 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [shuffledDeck[currentIndex], shuffledDeck[randomIndex]] = [
        shuffledDeck[randomIndex],
        shuffledDeck[currentIndex],
      ];
    }

    setDeck(() => shuffledDeck);
    return shuffledDeck;
  }

  function draw(count: number) {
    const drawnCards = deck.slice(0, count);
    setDeck((currentDeck) => currentDeck.slice(count));
    return drawnCards;
  }

  function discard(card: string) {
    const filtered = deck.filter((c) => c !== card);
    setDeck(filtered);
    return filtered;
  }

  function discardMultiple(cards: string[]) {
    const filtered = deck.filter((c) => !cards.includes(c));
    setDeck(filtered);
    return filtered;
  }

  function initialize() {
    // Remove red face cards, shuffle, and draw room cards in one operation
    const redFaces = ["JH", "JD", "QH", "QD", "KH", "KD", "AH", "AD"];
    const filtered = discardMultiple(redFaces);
    setDeck(() => filtered);

    // Shuffle the filtered deck
    const shuffled = shuffle();
    setDeck(() => shuffled);

    // Draw 4 cards for room and set remaining deck
    const roomCards = shuffled.slice(0, 4);
    const remainingDeck = shuffled.slice(4);

    setDeck(remainingDeck);
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

  return {
    deck,
    shuffle,
    draw,
    discard,
    discardMultiple,
    reset,
    initialize,
    room,
    setRoom,
    enterRoom,
  };
};

export default useGame;
