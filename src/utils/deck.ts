export const Suit = {
  Hearts: "H",
  Diamonds: "D",
  Clubs: "C",
  Spades: "S",
} as const;
export type Suit = (typeof Suit)[keyof typeof Suit];

export const shuffle = (cards: string[]) => {
  const shuffledDeck = [...cards];
  let currentIndex = shuffledDeck.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [shuffledDeck[currentIndex], shuffledDeck[randomIndex]] = [
      shuffledDeck[randomIndex],
      shuffledDeck[currentIndex],
    ];
  }

  return shuffledDeck;
};

export const discard = (cards: string[], toDiscard: string[]) => {
  return cards.filter((c) => !toDiscard.includes(c));
};

export const draw = (cards: string[], count: number): [string[], string[]] => {
  return [
    // Hand
    cards.slice(0, count),
    // Remaining deck
    cards.slice(count),
  ];
};
export const suit = (card: string): Suit | null => {
  const suitChar = card.slice(-1);
  switch (suitChar) {
    case Suit.Hearts:
      return Suit.Hearts;
    case Suit.Diamonds:
      return Suit.Diamonds;
    case Suit.Clubs:
      return Suit.Clubs;
    case Suit.Spades:
      return Suit.Spades;
    default:
      return null;
  }
};

export const value = (card: string): number | null => {
  const rank = card.slice(0, -1);
  if (rank === "2") return 2;
  if (rank === "3") return 3;
  if (rank === "4") return 4;
  if (rank === "5") return 5;
  if (rank === "6") return 6;
  if (rank === "7") return 7;
  if (rank === "8") return 8;
  if (rank === "9") return 9;
  if (rank === "10") return 10;
  if (rank === "J") return 11;
  if (rank === "Q") return 12;
  if (rank === "K") return 13;
  if (rank === "A") return 14;

  return null;
};
