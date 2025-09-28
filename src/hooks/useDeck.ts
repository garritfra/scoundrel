import { useState } from "react";

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

const useDeck = () => {
  const [deck, setDeck] = useState(
    RANKS.flatMap((rank) => SUITS.map((suit) => `${rank}${suit}`))
  );

  function reset() {
    setDeck(RANKS.flatMap((rank) => SUITS.map((suit) => `${rank}${suit}`)));
  }

  function shuffle() {
    setDeck((currentDeck) => {
      const shuffledDeck = [...currentDeck];
      let currentIndex = currentDeck.length;

      while (currentIndex != 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [shuffledDeck[currentIndex], shuffledDeck[randomIndex]] = [
          shuffledDeck[randomIndex],
          shuffledDeck[currentIndex],
        ];
      }

      return shuffledDeck;
    });
  }

  function draw(count: number) {
    const drawnCards = deck.slice(0, count);
    setDeck((currentDeck) => currentDeck.slice(count));
    return drawnCards;
  }

  function discard(card: string) {
    setDeck((currentDeck) => currentDeck.filter((c) => c !== card));
  }

  return { deck, shuffle, draw, discard, reset };
};

export default useDeck;
