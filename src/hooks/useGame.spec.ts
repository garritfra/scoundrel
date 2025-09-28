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
    });
  });
});
