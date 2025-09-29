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
