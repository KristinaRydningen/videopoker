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

  // Starter en ny runde hvis spilleren har valgt en gyldig innsats.
  // Tar ikke imot noen argumenter og returnerer ingen verdi.
  // Trekker innsatsen, lager og stokker en ny kortstokk,
  // deler ut fem kort og nullstiller data fra forrige runde.
  function handleStartRound() {
    //Fins det en spiller?
    if (!currentPlayer) {
      return;
    }

    //Sjekke at det har blitt bettet mer enn null og at currentBet
    //ikke er større enn spillerens mynter.
    if (currentBet <= 0 || currentBet > currentPlayer.coins) {
      return;
    }

    //setHasDrawn settes til false, da kan bytt kort knappen brukes.
    setHasDrawn(false);

    //Trekker den valgte innsatsen fra spillerens coins
    startRound();

    // Kortstokk lages og legges i newDeck,
    // newDeck blandes ved bruk av funksjonen shuffleDeck og legges i consten shuffledDeck
    const newDeck = MakeDeck();
    const shuffledDeck = shuffleDeck(newDeck);

    //Legger de fem første kortene i spillerens hånd
    setCards(shuffledDeck.slice(0, 5));
    //Lagrrer resten av kortstokken i dekc
    setDeck(shuffledDeck.slice(5));
    setDiscardedCards([]);
    setHeldCards([]);
    setPokerHand(null);
  }

  // Bytter ut kortene spilleren ikke har valgt å holde.
  // Tar ikke imot noen argumenter og returnerer ingen verdi.
  // Lagrer kastede kort, oppdaterer kortstokken, finner pokerhånden
  // og beregner eventuell gevinst ut fra spillerens innsats.
  function handleDrawCards() {
    // Stopper funksjonen hvis spilleren allerede har byttet kort,
    // eller hvis en runde med fem kort ikke er startet.
    if (hasDrawn || cards.length !== 5) {
      return;
    }

    //Holder styr på hvilket kort som skal tas neste fra den resterende kortstokken
    let deckIndex = 0;

    //Går gjennom cards og legger de kastede kortene i discardedCards
    const discardedCards = cards.filter(
      //_card er for å si "jeg får denne parameteren, men den brukes ikke", her brukes bare index
      (_card, index) => !heldCards.includes(index),
    );

    // Lager spillerens nye hånd. Kort som er holdt beholdes,
    // mens de andre erstattes med kort fra deck.
    const newCards = cards.map((card, index) => {
      if (heldCards.includes(index)) {
        return card;
      }

      const newCard = deck[deckIndex];
      deckIndex++;

      return newCard;
    });

    //Spillerens hånd oppdateres til den nye (newCards) med Zustand.
    setCards(newCards);
    //Kutter ut de brukte kortene og oppdaterer Zustand med kortene som er igjen.
    setDeck(deck.slice(deckIndex));

    setDiscardedCards(discardedCards);
    //setHasDrawn settes til true slik at spilleren ikke kan bytte kort igjen og bytt kort knappen deaktivers.
    setHasDrawn(true);

    //Sjekker den nye hånden og lagrer resultetet, f.eks "fullHouse"
    const result = checkPokerHand(newCards);
    setPokerHand(result);

    //Gevinsten utregnes
    const multiplier = getPayoutMultiplier(result);
    const winnings = currentBet * multiplier;

    //Gevinsten legges til i pengepungen til spilleren
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
