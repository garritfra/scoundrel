import { describe, expect, test } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useGame from "./useGame";

describe("useGame", () => {
  describe("initial deck", () => {
    test("initial deck length", () => {
      const { result } = renderHook(() => useGame());
      const { deck } = result.current;
      expect(deck).toHaveLength(52);
    });
  });

  describe("initialize function", () => {
    test("initialize sets up the game", () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initialize();
      });

      const newDeck = result.current.deck;

      expect(newDeck).toHaveLength(40); // 52 - 12 removed cards
      expect(newDeck).not.toContain("JH");
      expect(newDeck).not.toContain("JD");
      expect(newDeck).not.toContain("QH");
      expect(newDeck).not.toContain("QD");
      expect(newDeck).not.toContain("KH");
      expect(newDeck).not.toContain("KD");
      expect(newDeck).not.toContain("AH");
      expect(newDeck).not.toContain("AD");

      expect(result.current.room).toHaveLength(4);
    });
  });
});
