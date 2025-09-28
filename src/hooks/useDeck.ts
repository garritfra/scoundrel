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

const initialDeck = RANKS.flatMap((rank) => SUITS.map((suit) => `${rank}${suit}`));

const useDeck = () => {
  const [deck, setDeck] = useState(initialDeck);

  function reset() {
    setDeck(initialDeck);
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
    setDeck(currentDeck => currentDeck.slice(count));
    return drawnCards;
  }

  function discard(card: string) {
    setDeck(deck.filter((c) => c !== card));
  }

  function discardMultiple(cards: string[]) {
    setDeck((currentDeck) => currentDeck.filter((c) => !cards.includes(c)));
  }

  function initializeAndDraw() {
    const redFaces = ["JH", "JD", "QH", "QD", "KH", "KD", "AH", "AD"];
    const filtered = initialDeck.filter(card => !redFaces.includes(card));

    // Shuffle the filtered deck
    const shuffled = [...filtered];
    let currentIndex = filtered.length;
    while (currentIndex != 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
    }

    // Draw 4 cards and update deck
    const drawnCards = shuffled.slice(0, 4);
    const remainingDeck = shuffled.slice(4);
    setDeck(remainingDeck);

    return drawnCards;
  }

  return { deck, shuffle, draw, discard, discardMultiple, reset, initializeAndDraw };
};

export default useDeck;
