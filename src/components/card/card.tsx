import styles from "./card.module.css";

import type {
  cardRanks,
  cardSuits,
  PlayingCard,
  PokerHand,
} from "../../types/cardTypes";

const suits: cardSuits[] = ["hearts", "diamonds", "clubs", "spades"];

const ranks: cardRanks[] = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

// Lager en komplett kortstokk med alle kombinasjoner av suits og ranks.
// Tar ikke imot noen argumenter.
// Returnerer et PlayingCard-array med 52 kort.
export function MakeDeck(): PlayingCard[] {
  return suits.flatMap((suit) =>
    ranks.map((rank) => ({
      suit,
      rank,
    })),
  );
}

// Tar imot en kortstokk som PlayingCard[].
// Lager en kopi av kortstokken og blander den med Fisher-Yates-algoritmen.
// Returnerer den blandede kortstokken som PlayingCard[].
export function shuffleDeck(deck: PlayingCard[]): PlayingCard[] {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled;
}

// Tar imot fem spillekort, undersøker kombinasjonen
// og returnerer hvilken PokerHand spilleren har.
export function checkPokerHand(cards: PlayingCard[]): PokerHand {
  if (cards.length !== 5) {
    return "noWin";
  }
  // Teller hvor mange kort spilleren har av hver rank.
  const rankCounts: Partial<Record<cardRanks, number>> = {};

  cards.forEach((card) => {
    rankCounts[card.rank] = (rankCounts[card.rank] || 0) + 1;
  });

  const counts = Object.values(rankCounts);

  const isFlush = cards.every((card) => card.suit === cards[0].suit);

  const rankOrder: cardRanks[] = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];

  const rankValues = cards
    .map((card) => rankOrder.indexOf(card.rank))
    .sort((a, b) => a - b);

  const isStraight = rankValues.every((value, index) => {
    if (index === 0) {
      return true;
    }

    return value === rankValues[index - 1] + 1;
  });

  // Sjekker A-2-3-4-5, der ess brukes som det laveste kortet.
  const isLowAceStraight =
    rankValues[0] === 0 &&
    rankValues[1] === 1 &&
    rankValues[2] === 2 &&
    rankValues[3] === 3 &&
    rankValues[4] === 12;

  const royalRanks: cardRanks[] = ["10", "J", "Q", "K", "A"];

  const isRoyalFlush =
    isFlush &&
    royalRanks.every((rank) => cards.some((card) => card.rank === rank));

  if (isRoyalFlush) {
    return "royalFlush";
  }

  if ((isStraight || isLowAceStraight) && isFlush) {
    return "straightFlush";
  }

  if (counts.includes(4)) {
    return "fourOfAKind";
  }

  if (counts.includes(3) && counts.includes(2)) {
    return "fullHouse";
  }

  if (isFlush) {
    return "flush";
  }

  if (isStraight || isLowAceStraight) {
    return "straight";
  }

  if (counts.includes(3)) {
    return "threeOfAKind";
  }

  const pairs = counts.filter((count) => count === 2);

  if (pairs.length === 2) {
    return "twoPair";
  }

  const winningRanks: cardRanks[] = ["J", "Q", "K", "A"];

  const hasJacksOrBetter = winningRanks.some((rank) => rankCounts[rank] === 2);

  if (hasJacksOrBetter) {
    return "jacksOrBetter";
  }

  return "noWin";
}

// Tar imot pokerhånden, returnerer et number
// som innsatsen skal ganges med ved utbetaling.
export function getPayoutMultiplier(pokerHand: PokerHand): number {
  if (pokerHand === "royalFlush") {
    return 250;
  }

  if (pokerHand === "straightFlush") {
    return 50;
  }

  if (pokerHand === "fourOfAKind") {
    return 25;
  }

  if (pokerHand === "fullHouse") {
    return 9;
  }

  if (pokerHand === "flush") {
    return 6;
  }

  if (pokerHand === "straight") {
    return 4;
  }

  if (pokerHand === "threeOfAKind") {
    return 3;
  }

  if (pokerHand === "twoPair") {
    return 2;
  }

  if (pokerHand === "jacksOrBetter") {
    return 1;
  }

  return 0;
}

// Props til ett Card
type CardProps = {
  card?: PlayingCard;
  isHeld?: boolean;
  onHold?: () => void;
  showBack?: boolean;
};

// Tar imot kortets suit,
//returnerer symbolet som hører til suiten
function getSuitSymbol(suit: cardSuits) {
  if (suit === "hearts") {
    return "♥";
  }

  if (suit === "diamonds") {
    return "♦";
  }

  if (suit === "clubs") {
    return "♣";
  }

  return "♠";
}

// Tar imot CardProps med kortet og informasjon om hvordan det skal vises.
// Viser enten forsiden eller baksiden av kortet.
// Returnerer JSX for kortet, eller null hvis det ikke finnes et kort.
export function Card({
  card,
  isHeld = false,
  onHold,
  showBack = false,
}: CardProps) {
  if (showBack) {
    return <div className={styles.cardBack}></div>;
  }

  if (!card) {
    return null;
  }

  return (
    <button
      type="button"
      className={styles.card}
      onClick={onHold}
      aria-pressed={isHeld}
      aria-label={`${card.rank} ${card.suit}${isHeld ? ", holdt" : ""}`}
    >
      <p>
        {card.rank} {getSuitSymbol(card.suit)}
      </p>

      {isHeld && <p>HOLD</p>}
    </button>
  );
}

// Props til ShowFiveCards
type ShowFiveCardsProps = {
  cards: PlayingCard[];
  //Et array med numbers som er indexen til kortene som spilleren holder.
  heldCards: number[];
  setHeldCards: (heldCards: number[]) => void;
};

// Tar imot spillerens kort, hvilke kort som holdes og funksjonen som oppdaterer heldCards.
// Viser spillerens kort, eller fem kortbaksider hvis en runde ikke er startet.
// Returnerer JSX med kortene.
export function ShowFiveCards({
  cards,
  heldCards,
  setHeldCards,
}: ShowFiveCardsProps) {
  // Tar imot indexen til kortet spilleren velger.
  // Legger indexen til eller fjerner den fra heldCards.
  // Returnerer ingen verdi.
  function toggleHold(index: number) {
    if (heldCards.includes(index)) {
      setHeldCards(heldCards.filter((heldIndex) => heldIndex !== index));
    } else {
      setHeldCards([...heldCards, index]);
    }
  }
  //Sjekker om spilleren har kort, hvis den ikke har det så vises det frem fem kortbaksider
  if (cards.length === 0) {
    return (
      <div className={styles.playerHand}>
        {[0, 1, 2, 3, 4].map((index) => (
          <Card key={index} showBack />
        ))}
      </div>
    );
  }
  //Hvis spilleren har kort, vis frem fem kort.
  return (
    <div className={styles.playerHand}>
      {cards.map((card, index) => (
        <Card
          key={index}
          card={card}
          isHeld={heldCards.includes(index)}
          onHold={() => toggleHold(index)}
        />
      ))}
    </div>
  );
}
