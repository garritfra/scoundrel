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