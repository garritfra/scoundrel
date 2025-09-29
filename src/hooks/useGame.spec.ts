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

    describe("monster cards", () => {
      test("fights monster when a club or spade card is triggered", () => {
        const { result } = renderHook(() =>
          useGame({ initialHealth: 20, maxHealth: 20 })
        );

        act(() => {
          result.current.initialize();
          result.current.setRoom(["5C", "3D", "4H", "5S"]);
          result.current.setHand(["6D"]); // Weapon with value 6
        });

        const clubCard = result.current.room.find((card) => card.endsWith("C"));
        expect(clubCard).toBeDefined();

        if (!clubCard) return;

        act(() => {
          result.current.triggerRoomCard(clubCard);
        });

        // Monster value is 5, weapon value is 6, so no health loss
        expect(result.current.health).toBe(20);
        expect(result.current.hand).toHaveLength(2); // Weapon + defeated monster
        expect(result.current.room).not.toContain(clubCard);
      });

      test("loses health when fighting a stronger monster without a weapon", () => {
        const { result } = renderHook(() =>
          useGame({ initialHealth: 20, maxHealth: 20 })
        );

        act(() => {
          result.current.initialize();
          result.current.setRoom(["7S", "3D", "4H", "5C"]);
          result.current.setHand([]); // No weapon
        });

        const spadeCard = result.current.room.find((card) => card.endsWith("S"));
        expect(spadeCard).toBeDefined();

        if (!spadeCard) return;

        act(() => {
          result.current.triggerRoomCard(spadeCard);
        });

        // Monster value is 7, no weapon, so health should decrease by 7
        expect(result.current.health).toBe(13);
        expect(result.current.hand).toHaveLength(0); // Still no weapon
        expect(result.current.room).not.toContain(spadeCard);
      });

      test("loses health when fighting a stronger monster with a weaker weapon", () => {
        const { result } = renderHook(() =>
          useGame({ initialHealth: 20, maxHealth: 20 })
        );

        act(() => {
          result.current.initialize();
          result.current.setRoom(["9C", "3D", "4H", "5S"]);
          result.current.setHand(["6D"]); // Weapon with value 6
        });

        const clubCard = result.current.room.find((card) => card.endsWith("C"));
        expect(clubCard).toBeDefined();

        if (!clubCard) return;

        act(() => {
          result.current.triggerRoomCard(clubCard);
        });

        // Monster value is 9, weapon value is 6, so health should decrease by 3
        expect(result.current.health).toBe(17);
        expect(result.current.hand).toHaveLength(2); // Weapon + defeated monster
        expect(result.current.room).not.toContain(clubCard);
      });

      test("defeats monster when weapon value equals monster value", () => {
        const { result } = renderHook(() =>
          useGame({ initialHealth: 20, maxHealth: 20 })
        );

        act(() => {
          result.current.initialize();
          result.current.setRoom(["8S", "3D", "4H", "5C"]);
          result.current.setHand(["8D"]); // Weapon with value 8
        });

        const spadeCard = result.current.room.find((card) => card.endsWith("S"));
        expect(spadeCard).toBeDefined();

        if (!spadeCard) return;

        act(() => {
          result.current.triggerRoomCard(spadeCard);
        });

        // Monster value is 8, weapon value is 8, so no health loss
        expect(result.current.health).toBe(20);
        expect(result.current.hand).toHaveLength(2); // Weapon + defeated monster
        expect(result.current.room).not.toContain(spadeCard);
      });

      test("health does not go below zero when fighting a monster", () => {
        const { result } = renderHook(() =>
          useGame({ initialHealth: 5, maxHealth: 20 })
        );

        act(() => {
          result.current.initialize();
          result.current.setRoom(["10S", "3D", "4H", "5C"]);
          result.current.setHand([]); // No weapon
        });

        const spadeCard = result.current.room.find((card) => card.endsWith("S"));
        expect(spadeCard).toBeDefined();

        if (!spadeCard) return;

        act(() => {
          result.current.triggerRoomCard(spadeCard);
        });

        // Monster value is 10, no weapon, so health should drop to 0 but not below
        expect(result.current.health).toBe(0);
        expect(result.current.hand).toHaveLength(0); // Still no weapon
        expect(result.current.room).not.toContain(spadeCard);
      });
    });
  });

  describe("enterRoom function", () => {
    test("enters a new room when allowed", () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initialize();
      });

      const initialRoom = result.current.room;

      act(() => {
        result.current.setRoom(["2H"]); // Set room to 1 card to allow entering new room
      });

      act(() => {
        result.current.enterRoom();
      });

      const newRoom = result.current.room;
      const newDeck = result.current.deck;

      expect(newRoom).toHaveLength(4);
      expect(newDeck).toHaveLength(37); // 52 - 12 removed - 3 drawn for new room

      // Ensure the new room is different from the initial room
      expect(newRoom).not.toEqual(initialRoom);
    });

    test("does not enter a new room when not allowed", () => {
      const { result } = renderHook(() => useGame());

      act(() => {
        result.current.initialize();
      });

      // Manually set room to have more than 1 card to block entering a new room
      act(() => {
        result.current.setRoom(["2H", "3H", "4H", "5H"]);
      });

      const initialRoom = result.current.room;
      const initialDeck = result.current.deck;

      act(() => {
        result.current.enterRoom();
      });

      const newRoom = result.current.room;
      const newDeck = result.current.deck;

      // Room and deck should remain unchanged
      expect(newRoom).toEqual(initialRoom);
      expect(newDeck).toEqual(initialDeck);
    });
  });
});
