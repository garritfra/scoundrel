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

      expect(result.current.hand).toHaveLength(0);
    });
  });

  describe("triggerRoomCard function", () => {
    describe("weapon cards", () => {
      test("equips weapon when a diamond card is triggered", () => {
        const { result } = renderHook(() => useGame());

        act(() => {
          result.current.initialize();
          result.current.setRoom(["2D", "3H", "4C", "5S"]);
        });

        const diamondCard = result.current.room.find((card) =>
          card.endsWith("D")
        );
        expect(diamondCard).toBeDefined();

        if (!diamondCard) return;

        act(() => {
          result.current.triggerRoomCard(diamondCard);
        });

        expect(result.current.hand).toHaveLength(1);
        expect(result.current.hand[0]).toEqual(diamondCard);
        expect(result.current.room).not.toContain(diamondCard);
      });

      test("new card replaces existing weapon in hand", () => {
        const { result } = renderHook(() => useGame());

        act(() => {
          result.current.initialize();
          result.current.setRoom(["2D", "3D", "4C", "5S"]);
        });

        const firstDiamondCard = result.current.room.find((card) =>
          card.endsWith("D")
        );
        expect(firstDiamondCard).toBeDefined();

        if (!firstDiamondCard) return;

        act(() => {
          result.current.triggerRoomCard(firstDiamondCard);
        });

        expect(result.current.hand).toHaveLength(1);
        expect(result.current.hand[0]).toEqual(firstDiamondCard);
        expect(result.current.room).not.toContain(firstDiamondCard);

        const secondDiamondCard = result.current.room.find((card) =>
          card.endsWith("D")
        );
        expect(secondDiamondCard).toBeDefined();
        if (!secondDiamondCard) return;

        act(() => {
          result.current.triggerRoomCard(secondDiamondCard);
        });

        expect(result.current.hand).toHaveLength(1);
        expect(result.current.hand[0]).toEqual(secondDiamondCard);
        expect(result.current.room).not.toContain(secondDiamondCard);
      });
    });

    describe("potion cards", () => {
      test("drinks potion when a heart card is triggered", () => {
        const { result } = renderHook(() =>
          useGame({ initialHealth: 10, maxHealth: 20 })
        );

        act(() => {
          result.current.initialize();
          result.current.setRoom(["2H", "3D", "4C", "5S"]);
        });

        const heartCard = result.current.room.find((card) =>
          card.endsWith("H")
        );
        expect(heartCard).toBeDefined();

        if (!heartCard) return;

        act(() => {
          result.current.triggerRoomCard(heartCard);
        });

        expect(result.current.health).toBe(12); // 10 + 2 (value of 2H)
        expect(result.current.room).not.toContain(heartCard);
      });

      test("health does not exceed maxHealth when drinking potion", () => {
        const { result } = renderHook(() =>
          useGame({ initialHealth: 19, maxHealth: 20 })
        );

        act(() => {
          result.current.initialize();
          result.current.setRoom(["3H", "3D", "4C", "5S"]);
        });

        const heartCard = result.current.room.find((card) =>
          card.endsWith("H")
        );
        expect(heartCard).toBeDefined();

        if (!heartCard) return;

        act(() => {
          result.current.triggerRoomCard(heartCard);
        });

        expect(result.current.health).toBe(20); // Should not exceed maxHealth
        expect(result.current.room).not.toContain(heartCard);
      });
    });
  });
});
