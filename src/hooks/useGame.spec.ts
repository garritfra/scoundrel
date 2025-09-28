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

  describe("enterRoom function", () => {
    test("enterRoom adds 4 cards to the room", () => {
      const { result } = renderHook(() => useGame());

      expect(result.current.room).toHaveLength(0);

      act(() => {
        result.current.enterRoom();
      });

      expect(result.current.room).toHaveLength(4);
    });

    test("enterRoom adds cards to the room if less than 4", () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.enterRoom();
      });

      expect(result.current.room).toHaveLength(4);

      act(() => {
        result.current.room.pop();
        result.current.room.pop();
      });

      expect(result.current.room).toHaveLength(2);

      act(() => {
        result.current.enterRoom();
      });

      expect(result.current.room).toHaveLength(4);
    });

    test("enterRoom does not exceed 4 cards in the room", () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.enterRoom();
      });

      expect(result.current.room).toHaveLength(4);

      act(() => {
        result.current.enterRoom();
      });

      expect(result.current.room).toHaveLength(4);
    });

    test("enterRoom with empty room draws exactly 4 cards", () => {
      const { result } = renderHook(() => useGame());
      const initialDeckLength = result.current.deck.length;

      act(() => {
        result.current.enterRoom();
      });

      expect(result.current.room).toHaveLength(4);
      expect(result.current.deck).toHaveLength(initialDeckLength - 4);
    });

    test("enterRoom with 1 card draws exactly 3 more cards", () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.setRoom(["2H"]);
      });

      const deckLengthBefore = result.current.deck.length;

      act(() => {
        result.current.enterRoom();
      });

      expect(result.current.room).toHaveLength(4);
      expect(result.current.room[0]).toBe("2H");
      expect(result.current.deck).toHaveLength(deckLengthBefore - 3);
    });

    test("enterRoom with 3 cards draws exactly 1 more card", () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.setRoom(["2H", "3H", "4H"]);
      });

      const deckLengthBefore = result.current.deck.length;

      act(() => {
        result.current.enterRoom();
      });

      expect(result.current.room).toHaveLength(4);
      expect(result.current.room.slice(0, 3)).toEqual(["2H", "3H", "4H"]);
      expect(result.current.deck).toHaveLength(deckLengthBefore - 1);
    });
  });
});
