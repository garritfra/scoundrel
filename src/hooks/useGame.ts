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
  initialHealth?: number;
  maxHealth?: number;
  roomSize?: number;
}

const defaultGameOptions: GameOptions = {
  initialHealth: 20,
  maxHealth: 20,
  roomSize: 4,
};

const useGame = (options: GameOptions = defaultGameOptions) => {
  // TODO: This will fail once we introduce a different type into the options
  const _getOption = (key: keyof GameOptions) => {
    return options[key] ?? defaultGameOptions[key]!;
  };

  const [deck, setDeck] = useState(initialDeck);
  const [room, setRoom] = useState<string[]>([]);
  const [hand, setHand] = useState<string[]>([]);
  const [health, setHealth] = useState(_getOption("initialHealth"));

  const canEnterNewRoom = room.length <= 1;

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

    const [roomCards, remainingDeck] = deckUtils.draw(
      shuffled,
      _getOption("roomSize")
    );

    setDeck(remainingDeck);
    setRoom(roomCards);
    setHealth(_getOption("initialHealth"));
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
      return Math.min(currentHealth + value, _getOption("maxHealth"));
    });
    const remainingRoom = room.filter((c) => c !== card);
    setRoom(remainingRoom);
  };

  /**
    Combat
    - If you choose to fight the Monster barehanded, subtract its full value from your Health, and
    move the Monster to the discard deck.
    - If you choose to fight the Monster with your equipped Weapon, place the monster face up on
    top of the weapon (and on top of any other Monsters on the Weapon. Be sure to stagger the
    placement of the Monster so that the Weapon's number is still showing. subtract the
    Weapon's value from the Monster's value and subtract any remaining value from your health.
    For example, if your Weapon is a 5, and you place a 3 Monster on it, you take no damage. ( 3-5 < 0)
    If your Weapon is a 5 and you place a Jack Monster on it, you take 6 damage. ( 11 - 5 = 5 dmg)
    It is important to note that although you retain your weapons until they are replaced, once a
    Weapon is used on a monster, the Weapon can then only be used to slay Monsters of a lower
    value (less than equal) than the previous Monster it had slain.
    For example, if your 5 Weapon has killed a Queen Monster and you then choose a 6 Monster, you
    may use your Weapon on the 6 Monster, as 6 is less than 12.
    But, if you have used your 5 Weapon on a 6 Monster, and you then choose a Queen Monster,
    you must fight the Queen barehanded as Queen,12, is greater than 6. Despite this, the Weapon is not
    discarded, as it could still be used against Monsters weaker than a 6.
   */
  const calculateDamage = (attacker: string): number => {
    const attackerValue = deckUtils.value(attacker);

    if (attackerValue === null) return 0;

    const weaponCard = hand[0];
    const weaponValue = weaponCard ? deckUtils.value(weaponCard) : null;

    // Find last defeated monster value (if any)
    let lastMonsterValue: number | null = null;
    if (hand.length > 1) {
      // Monsters are stacked after weapon in hand
      const lastMonsterCard = hand[hand.length - 1];
      lastMonsterValue = deckUtils.value(lastMonsterCard);
    }

    let canUseWeapon = false;
    if (weaponValue !== null) {
      // Weapon stacking restriction
      if (lastMonsterValue === null || attackerValue <= lastMonsterValue) {
        canUseWeapon = true;
      }
    }

    if (canUseWeapon && weaponValue !== null) {
      // Always use weapon if allowed by stacking
      const remainingAttackerValue = attackerValue - weaponValue;
      return remainingAttackerValue > 0 ? remainingAttackerValue : 0;
    } else if (
      weaponValue !== null &&
      (lastMonsterValue === null || attackerValue <= lastMonsterValue)
    ) {
      // Weapon present but monster stronger, still use weapon
      const remainingAttackerValue = attackerValue - weaponValue;
      return remainingAttackerValue > 0 ? remainingAttackerValue : 0;
    } else {
      // Fight barehanded
      return attackerValue;
    }
  };

  // TODO: Refactor to use calculateDamage
  const _fightMonster = (card: string) => {
    const monsterValue = deckUtils.value(card);
    if (monsterValue === null) return;

    const weaponCard = hand[0];
    const weaponValue = weaponCard ? deckUtils.value(weaponCard) : null;

    // Find last defeated monster value (if any)
    let lastMonsterValue: number | null = null;
    if (hand.length > 1) {
      // Monsters are stacked after weapon in hand
      const lastMonsterCard = hand[hand.length - 1];
      lastMonsterValue = deckUtils.value(lastMonsterCard);
    }

    let canUseWeapon = false;
    if (weaponValue !== null) {
      // Weapon stacking restriction
      if (lastMonsterValue === null || monsterValue <= lastMonsterValue) {
        canUseWeapon = true;
      }
    }

    if (canUseWeapon && weaponValue !== null) {
      // Always use weapon if allowed by stacking
      const remainingMonsterValue = monsterValue - weaponValue;
      if (remainingMonsterValue > 0) {
        _takeDamage(remainingMonsterValue);
      }
      setHand([...hand, card]);
    } else if (
      weaponValue !== null &&
      (lastMonsterValue === null || monsterValue <= lastMonsterValue)
    ) {
      // Weapon present but monster stronger, still use weapon
      const remainingMonsterValue = monsterValue - weaponValue;
      _takeDamage(remainingMonsterValue);
      setHand([...hand, card]);
    } else {
      // Fight barehanded
      _takeDamage(monsterValue);
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

  const enterRoom = () => {
    if (!canEnterNewRoom) return;

    const [newRoomCards, remainingDeck] = deckUtils.draw(
      deck,
      _getOption("roomSize") - room.length
    );
    setDeck(remainingDeck);
    setRoom([...room, ...newRoomCards]);
  };

  return {
    health,
    deck,
    hand,
    room,
    canEnterNewRoom,
    triggerRoomCard,
    shuffle,
    discard,
    discardMultiple,
    initialize,
    setRoom,
    setHand,
    enterRoom,
    calculateDamage,
  };
};

export default useGame;
