import Header from "./components/header/header";
import {
  ShowFiveCards,
  MakeDeck,
  shuffleDeck,
  checkPokerHand,
  getPayoutMultiplier,
} from "./components/card/card";
import { usePlayerStore } from "./store/store";
import TotalCoins from "./components/TotalCoins";
import CurrentBet from "./components/currentBet";

export default function Game() {
  const currentPlayer = usePlayerStore((state) => state.currentPlayer);
  const currentBet = usePlayerStore((state) => state.currentBet);
  const startRound = usePlayerStore((state) => state.startRound);
  const addWinnings = usePlayerStore((state) => state.addWinnings);

  const cards = usePlayerStore((state) => state.cards);
  const deck = usePlayerStore((state) => state.deck);
  const heldCards = usePlayerStore((state) => state.heldCards);
  const hasDrawn = usePlayerStore((state) => state.hasDrawn);
  const pokerHand = usePlayerStore((state) => state.pokerHand);

  const setCards = usePlayerStore((state) => state.setCards);
  const setDeck = usePlayerStore((state) => state.setDeck);
  const setDiscardedCards = usePlayerStore((state) => state.setDiscardedCards);
  const setHeldCards = usePlayerStore((state) => state.setHeldCards);
  const setHasDrawn = usePlayerStore((state) => state.setHasDrawn);
  const setPokerHand = usePlayerStore((state) => state.setPokerHand);

  // Starter en ny runde dersom spilleren har valgt en innsats.
  // Trekker innsatsen, lager og stokker en ny kortstokk,
  // deler ut fem kort og nullstiller data fra forrige runde.
  function handleStartRound() {
    if (!currentPlayer) {
      return;
    }

    if (currentBet <= 0 || currentBet > currentPlayer.coins) {
      return;
    }

    setHasDrawn(false);

    startRound();

    const newDeck = MakeDeck();
    const shuffledDeck = shuffleDeck(newDeck);

    setCards(shuffledDeck.slice(0, 5));
    setDeck(shuffledDeck.slice(5));
    setDiscardedCards([]);
    setHeldCards([]);
    setPokerHand(null);
  }

  // Bytter ut kortene spilleren ikke har valgt å holde.
  // Lagrer kastede kort, oppdaterer kortstokken, finner pokerhånden
  // og beregner eventuell gevinst ut fra spillerens innsats.
  function handleDrawCards() {
    if (hasDrawn || cards.length !== 5) {
      return;
    }

    let deckIndex = 0;

    const discardedCards = cards.filter(
      (_card, index) => !heldCards.includes(index),
    );

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
    setDiscardedCards(discardedCards);
    setHasDrawn(true);

    const result = checkPokerHand(newCards);
    setPokerHand(result);

    const multiplier = getPayoutMultiplier(result);
    const winnings = currentBet * multiplier;

    addWinnings(winnings);
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

        {pokerHand && <p>Din hånd: {pokerHand}</p>}

        <button
          onClick={handleDrawCards}
          disabled={hasDrawn || cards.length !== 5}
        >
          Bytt kort
        </button>

        <TotalCoins />

        <CurrentBet />

        <button onClick={handleStartRound}>Start runde</button>
      </main>
    </>
  );
}
