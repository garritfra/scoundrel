import { describe, test, expect } from "vitest";

import * as deckUtils from "./deck";

describe("deck utilities", () => {
  describe("shuffle", () => {
    test("shuffles the deck deterministically", () => {
      const originalDeck = [
        "2H",
        "3H",
        "4H",
        "5H",
        "6H",
        "7H",
        "8H",
        "9H",
        "10H",
        "JH",
        "QH",
        "KH",
        "AH",
      ];

      // Mock Math.random to return a predictable sequence
      const randomValues = [
        0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05, 0.01, 0.99, 0.88,
      ];
      let callCount = 0;
      const originalRandom = Math.random;
      Math.random = () => randomValues[callCount++ % randomValues.length];

      const shuffledDeck = deckUtils.shuffle(originalDeck);

      // Restore Math.random
      Math.random = originalRandom;

      expect(shuffledDeck).toHaveLength(originalDeck.length);

      for (const card of originalDeck) {
        expect(shuffledDeck).toContain(card);
      }

      expect(shuffledDeck).not.toEqual(originalDeck);
    });
  });

  describe("discard", () => {
    test("discards specified cards from the deck", () => {
      const originalDeck = ["2H", "JH", "QH", "KH", "AH"];
      const toDiscard = ["JH", "QH", "KH"];
      const newDeck = deckUtils.discard(originalDeck, toDiscard);

      expect(newDeck).toHaveLength(originalDeck.length - toDiscard.length);
      toDiscard.forEach((card) => {
        expect(newDeck).not.toContain(card);
      });
      // Ensure other cards remain
      expect(newDeck[0]).toEqual("2H");
      expect(newDeck[1]).toEqual("AH");
    });
  });

  describe("draw", () => {
    test("draws a card from the top of the deck", () => {
      const originalDeck = ["2H", "3H", "4H", "5H", "6H"];
      const [hand, remainingDeck] = deckUtils.draw(originalDeck, 2);

      expect(hand).toHaveLength(2);
      expect(hand).toEqual(["2H", "3H"]);
      expect(remainingDeck).toHaveLength(3);
      expect(remainingDeck).toEqual(["4H", "5H", "6H"]);
    });

    test("drawing more cards than available returns all cards", () => {
      const originalDeck = ["2H", "3H"];
      const [hand, remainingDeck] = deckUtils.draw(originalDeck, 5);

      expect(hand).toHaveLength(2);
      expect(hand).toEqual(["2H", "3H"]);
      expect(remainingDeck).toHaveLength(0);
      expect(remainingDeck).toEqual([]);
    });

    test("drawing zero cards returns empty hand and full deck", () => {
      const originalDeck = ["2H", "3H", "4H"];
      const [hand, remainingDeck] = deckUtils.draw(originalDeck, 0);

      expect(hand).toHaveLength(0);
      expect(hand).toEqual([]);
      expect(remainingDeck).toHaveLength(3);
      expect(remainingDeck).toEqual(originalDeck);
    });
  });

  describe("suit", () => {
    test("returns correct suit for valid cards", () => {
      expect(deckUtils.suit("2H")).toBe(deckUtils.Suit.Hearts);
      expect(deckUtils.suit("10D")).toBe(deckUtils.Suit.Diamonds);
      expect(deckUtils.suit("KS")).toBe(deckUtils.Suit.Spades);
      expect(deckUtils.suit("AC")).toBe(deckUtils.Suit.Clubs);
    });

    test("returns null for invalid cards", () => {
      expect(deckUtils.suit("2X")).toBeNull();
      expect(deckUtils.suit("10")).toBeNull();
      expect(deckUtils.suit("")).toBeNull();
      expect(deckUtils.suit("Joker")).toBeNull();
    });
  });
});
