# Scoundrel
**Version 1.0 • August 15th, 2011**
*A Single Player Rogue-like Card Game by Zach Gage and Kurt Bieg*

---

## Setup

**Equipment needed:**
- Standard deck of playing cards
- Paper and pen (or good memory)

**Preparation:**
1. **Remove cards:** Search through the deck and remove all Jokers, Red Face Cards, and Red Aces. Place them aside - they are not used in this game.
2. **Create the Dungeon:** Shuffle the remaining cards and place the pile face down on your left. This deck is called the **Dungeon**.
3. **Track your Health:** Write down **20** on paper - this is your starting Health.

---

## Card Types

### 🗡️ Monsters (Clubs ♣ and Spades ♠)
- **Count:** 26 cards total
- **Damage:** Equal to their ordered value
  - Number cards: Face value (2-10)
  - Jack: 11 damage
  - Queen: 12 damage
  - King: 13 damage
  - Ace: 14 damage

### ⚔️ Weapons (Diamonds ♦)
- **Count:** 9 cards total
- **Damage:** Equal to their face value
- **Binding:** When you pick up a weapon, you must equip it and discard your previous weapon

### ❤️ Health Potions (Hearts ♥)
- **Count:** 9 cards total
- **Healing:** Equal to their face value
- **Limitations:**
  - Only one potion per turn (extras are discarded)
  - Cannot exceed starting health of 20

### 🗑️ Discard Pile
- Place discarded cards anywhere you wish (recommended: to the right of the Room)
- Cards are discarded face down

---

## Game End Conditions

The game ends when either:
- Your life reaches **0**, or
- You make your way through the **entire Dungeon**

---

## Scoring

### 💀 Death (Life reaches 0)
- Find all remaining monsters in the Dungeon
- Subtract their total values from your current life
- This **negative value** is your score

### 🏆 Victory (Complete the Dungeon)
- Your score is your remaining life points
- **Special bonus:** If you finish with 20 health and your last card was a health potion, add the potion's value to your score

---

## Gameplay

### Turn Structure
**Each turn:**
1. Flip cards from the Dungeon one by one until you have **4 cards** face up in front of you (this is called a **Room**)
2. Choose to either **enter** the Room or **avoid** it
3. If entering, face **3 of the 4 cards** one at a time
4. Leave the remaining card as part of the next Room

### 🚪 Avoiding Rooms
- **How:** Scoop up all four cards and place them at the **bottom** of the Dungeon
- **Limitation:** You may **not avoid two Rooms in a row**
- You may avoid as many Rooms as you want otherwise

---

## Card Actions

### ⚔️ Choosing a Weapon
- **Must equip immediately**
- Place face up between you and the remaining Room cards
- If you had a previous weapon equipped, move it **and any monsters on it** to the discard deck

### ❤️ Choosing a Health Potion
- Add its value to your health immediately, then discard it
- **Health cap:** Cannot exceed 20 health
- **One per turn:** If you take two potions in one turn, the second is discarded with no effect

### 🗡️ Choosing a Monster
You have two options:

---

## ⚔️ Combat

### 👊 Barehanded Combat
- **Damage:** Take the monster's **full value** as damage
- **Resolution:** Move the monster to the discard deck

### 🗡️ Weapon Combat
- **Placement:** Place the monster face up **on top** of the weapon (and on top of any other monsters already on the weapon)
- **Stagger cards** so the weapon's number remains visible
- **Damage calculation:** Subtract weapon value from monster value
- **Health loss:** Take any remaining damage

**Examples:**
- Weapon 5 vs Monster 3: No damage (3 - 5 = -2, no negative damage)
- Weapon 5 vs Jack (11): Take 6 damage (11 - 5 = 6)

### 🔒 Weapon Usage Restrictions

**Important:** Once a weapon is used on a monster, it can **only** be used against monsters of **equal or lower value** than the last monster it defeated.

**Examples:**
- ✅ Weapon 5 killed Queen (12) → Can fight monster 6 (6 ≤ 12)
- ❌ Weapon 5 killed monster 6 → Cannot fight Queen (12 > 6), must fight barehanded
- ✅ The weapon is **not discarded** - it can still fight weaker monsters

### 🔄 Turn Completion
Once you have chosen 3 cards (leaving one remaining), your turn is complete. Leave the fourth card face up as part of the next Room.

---

*© 2011, Zach Gage and Kurt Bieg*