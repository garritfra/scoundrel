import { useEffect } from "react";
import "./App.css";
import "cardsJS/cards.css";
import useGame from "./hooks/useGame";
import "@mantine/core/styles.css";
import { MantineProvider, Text, Tooltip } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import * as deckUtils from "./utils/deck";

function App() {
  const {
    deck,
    room,
    hand,
    initialize,
    triggerRoomCard,
    health,
    canEnterNewRoom,
    enterRoom,
    calculateDamage,
  } = useGame();

  const colorScheme = useColorScheme();

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _handleEnterRoom = () => {
    if (canEnterNewRoom) {
      enterRoom();
    }
  };

  const _roomTooltipLabel = (card: string) => {
    const suit = deckUtils.suit(card);

    switch (suit) {
      case deckUtils.Suit.Diamonds:
        return (
          <>
            <Text fw={700}>Equip Weapon</Text>
            <Text c="blue">+{deckUtils.value(card)} Attack</Text>
          </>
        );
      case deckUtils.Suit.Hearts:
        return (
          <>
            <Text fw={700}>Drink Potion</Text>
            <Text c="green">+{deckUtils.value(card)} Health</Text>
          </>
        );
      case deckUtils.Suit.Clubs:
      case deckUtils.Suit.Spades:
        return (
          <>
            <Text fw={700}>Fight Monster</Text>
            <Text c="red">-{calculateDamage(card)} Health</Text>
          </>
        );
      default:
        return "Unknown Card";
    }
  };

  const _deckTooltipLabel = () => {
    if (canEnterNewRoom) {
      return <Text fw={700}>Enter Room</Text>;
    } else {
      return (
        <>
          <Text fw={700}>Enter Room</Text>
          <Text>Room must contain one or less cards</Text>
        </>
      );
    }
  };

  return (
    <MantineProvider forceColorScheme={colorScheme}>
      <div className="play-area">
        <p>
          Health: {health} <br />
          Remaining Deck Cards: {deck.length}
        </p>
        <div className="hand hhand active-hand room-hand">
          <Tooltip label={_deckTooltipLabel()}>
            <div className="deck-container">
              <img
                className={`card ${canEnterNewRoom ? "" : "inactive"}`}
                src="cards/Red_Back.svg"
                onClick={_handleEnterRoom}
              />
            </div>
          </Tooltip>
          {room.map((card) => (
            <Tooltip key={card} label={_roomTooltipLabel(card)}>
              <img
                key={card}
                className="card"
                src={`cards/${card}.svg`}
                onClick={() => triggerRoomCard(card)}
              />
            </Tooltip>
          ))}
        </div>
        <div className="hand hhand-compact weapon-hand">
          {hand.map((card) => (
            <img key={card} className="card" src={`cards/${card}.svg`} />
          ))}
          <img className="card hidden" src={`cards/Red_Back.svg`} />
        </div>
      </div>
    </MantineProvider>
  );
}

export default App;
