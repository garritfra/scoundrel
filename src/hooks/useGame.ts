import { useState } from "react";
import * as deckUtils from "../utils/deck";

const RANKS = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J", // Jack
  "Q", // Queen
  "K", // King
  "A", // Ace
];

const SUITS = [
  "H", // Hearts
  "D", // Diamonds
  "C", // Clubs
  "S", // Spades
];

const initialDeck = RANKS.flatMap((rank) =>
  SUITS.map((suit) => `${rank}${suit}`)
);

interface GameOptions {
  initialHealth: number;
  maxHealth: number;
}

const defaultGameOptions: GameOptions = {
  initialHealth: 20,
  maxHealth: 20,
};

const useGame = (options: GameOptions = defaultGameOptions) => {
  const [deck, setDeck] = useState(initialDeck);
  const [room, setRoom] = useState<string[]>([]);
  const [hand, setHand] = useState<string[]>([]);
  const [health, setHealth] = useState(options.initialHealth);

  function shuffle() {
    setDeck((currentDeck) => deckUtils.shuffle(currentDeck));
  }

  function discard(card: string) {
    setDeck((currentDeck) => deckUtils.discard(currentDeck, [card]));
  }

  function discardMultiple(cards: string[]) {
    setDeck((currentDeck) => deckUtils.discard(currentDeck, cards));
  }

  function initialize() {
    const redFaces = ["JH", "JD", "QH", "QD", "KH", "KD", "AH", "AD"];
    const filtered = deckUtils.discard(initialDeck, redFaces);

    const shuffled = deckUtils.shuffle(filtered);

    const [roomCards, remainingDeck] = deckUtils.draw(shuffled, 4);

    setDeck(remainingDeck);
    setRoom(roomCards);
    setHealth(options.initialHealth);
    setHand([]);
  }

  const _takeDamage = (amount: number) => {
    setHealth((currentHealth) => Math.max(currentHealth - amount, 0));
  };

  const _equipWeapon = (card: string) => {
    setHand([card]);
    const remainingRoom = room.filter((c) => c !== card);
    setRoom(remainingRoom);
  };

  const _drinkPotion = (card: string) => {
    setHealth((currentHealth) => {
      const value = deckUtils.value(card);
      if (value === null) return currentHealth;
      return Math.min(currentHealth + value, options.maxHealth);
    });
    const remainingRoom = room.filter((c) => c !== card);
    setRoom(remainingRoom);
  };

  /**
   * Monster Combat Rules:
   * - When you choose a Monster, you may fight it barehanded or with an equipped Weapon.
   * 
   * Barehanded Combat:
   * - Subtract the Monster's full value from your Health.
   * - Move the Monster to the discard deck.
   * 
   * Weapon Combat:
   * - Place the Monster face up on top of the Weapon (and any other Monsters on the Weapon).
   *   Stagger the placement so the Weapon's number remains visible.
   * - Subtract the Weapon's value from the Monster's value.
   * - Subtract any remaining value from your Health.
   *   Example: Weapon = 5, Monster = 3 → No damage (3 - 5 < 0).
   *   Example: Weapon = 5, Monster = Jack (11) → 6 damage (11 - 5 = 6).
   * 
   * Weapon Usage Restriction:
   * - After a Weapon is used on a Monster, it can only be used to slay Monsters of equal or lower value than the last Monster it defeated.
   *   Example: Weapon = 5, last Monster = Queen (12), next Monster = 6 → Weapon can be used.
   *   Example: Weapon = 5, last Monster = 6, next Monster = Queen (12) → Must fight barehanded.
   * - The Weapon is not discarded if it cannot be used; it may still be used against weaker Monsters.
   */
  const _fightMonster = (card: string) => {
    const monsterValue = deckUtils.value(card);
    if (monsterValue === null) return;

    const weaponCard = hand[0];
    const weaponValue = weaponCard ? deckUtils.value(weaponCard) : null;

    if (weaponValue === null) {
      // Fight barehanded
      _takeDamage(monsterValue ?? 0);
    } else {
      // Fight with weapon
      // According to rules: "place the monster face up on top of the weapon"
      setHand((currentHand) => [...currentHand, card]);

      const remainingMonsterValue = monsterValue - (weaponValue ?? 0);
      if (remainingMonsterValue > 0) {
        _takeDamage(remainingMonsterValue);
      }
    }

    const remainingRoom = room.filter((c) => c !== card);
    setRoom(remainingRoom);
  };

  const triggerRoomCard = (card: string) => {
    const suit = deckUtils.suit(card);

    switch (suit) {
      case deckUtils.Suit.Diamonds:
        _equipWeapon(card);
        break;
      case deckUtils.Suit.Hearts:
        _drinkPotion(card);
        break;
      case deckUtils.Suit.Clubs:
      case deckUtils.Suit.Spades:
        _fightMonster(card);
        break;
      default:
        // Invalid card suit, do nothing
        break;
    }
  };

  return {
    deck,
    hand,
    triggerRoomCard,
    shuffle,
    discard,
    discardMultiple,
    initialize,
    room,
    setRoom,
    setHand,
    health,
  };
};

export default useGame;
