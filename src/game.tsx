import { useState } from "react";

import Header from "./components/header/header";
import { ShowFiveCards, MakeDeck, shuffleDeck } from "./components/card/card";
import { usePlayerStore } from "./store/store";
import TotalCoins from "./components/TotalCoins";
import CurrentBet from "./components/currentBet";

import type { PlayingCard } from "./types/cardTypes";

export default function Game() {
  const currentPlayer = usePlayerStore((state) => state.currentPlayer);
  const currentBet = usePlayerStore((state) => state.currentBet);
  const startRound = usePlayerStore((state) => state.startRound);

  const [cards, setCards] = useState<PlayingCard[]>([]);
  const [heldCards, setHeldCards] = useState<number[]>([]);
  const [deck, setDeck] = useState<PlayingCard[]>([]);
  const [hasDrawn, setHasDrawn] = useState(false);

  function handleStartRound() {
    if (currentBet <= 0) {
      return;
    }

    setHasDrawn(false);

    startRound();

    const newDeck = MakeDeck();
    const shuffledDeck = shuffleDeck(newDeck);

    setCards(shuffledDeck.slice(0, 5));
    setDeck(shuffledDeck.slice(5));
    setHeldCards([]);
  }

  function handleDrawCards() {
    if (hasDrawn) {
      return;
    }

    let deckIndex = 0;

    const newCards = cards.map((card, index) => {
      if (heldCards.includes(index)) {
        return card;
      }

      const newCard = deck[deckIndex];
      deckIndex++;

      return newCard;
    });

    setCards(newCards);
    setDeck(deck.slice(deckIndex));
    setHasDrawn(true);
  }

  return (
    <>
      <Header />

      <main>
        <h1>Video Poker</h1>

        <h3>Velkommen {currentPlayer?.name}!</h3>
        <ShowFiveCards
          cards={cards}
          heldCards={heldCards}
          setHeldCards={setHeldCards}
        />

        <button onClick={handleDrawCards} disabled={hasDrawn}>
          Bytt kort
        </button>

        <TotalCoins />

        <CurrentBet />

        <button onClick={handleStartRound}>Start runde</button>
      </main>
    </>
  );
}
