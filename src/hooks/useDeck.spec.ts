import { describe, expect, test } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useDeck from "./useDeck";

describe("useDeck", () => {
  describe("initial deck", () => {
    test("initial deck length", () => {
      const { result } = renderHook(() => useDeck());
      const { deck } = result.current;
      expect(deck).toHaveLength(52);
    });

    describe("shuffle function", () => {
      test("shuffle changes deck order", () => {
        const { result } = renderHook(() => useDeck());

        const initialDeck = [...result.current.deck];

        act(() => {
          result.current.shuffle();
        });

        const shuffledDeck = result.current.deck;

        expect(shuffledDeck).not.toEqual(initialDeck);
        expect(shuffledDeck).toHaveLength(52);
      });
    });

    describe("draw function", () => {
      test("draw removes cards from deck", () => {
        const { result } = renderHook(() => useDeck());

        const initialDeck = [...result.current.deck];

        let drawnCards: string[] = [];
        act(() => {
          drawnCards = result.current.draw(5);
        });

        const newDeck = result.current.deck;

        expect(drawnCards).toHaveLength(5);
        expect(newDeck).toHaveLength(47);
        expect(newDeck).not.toEqual(initialDeck);
        expect(newDeck).toEqual(initialDeck.slice(5));
      });
    });

    describe("discard function", () => {
      test("discard removes specific card from deck", () => {
        const { result } = renderHook(() => useDeck());

        const initialDeck = [...result.current.deck];
        const cardToDiscard = initialDeck[10];

        act(() => {
          result.current.discard(cardToDiscard);
        });

        const newDeck = result.current.deck;

        expect(newDeck).toHaveLength(51);
        expect(newDeck).not.toContain(cardToDiscard);
        expect(newDeck).toEqual(
          initialDeck.filter((card) => card !== cardToDiscard)
        );
      });
    });
  });
});
