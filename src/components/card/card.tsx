import styles from "./card.module.css";

import type {
  cardRanks,
  cardSuits,
  PlayingCard,
  PokerHand,
} from "../../types/cardTypes";
import type React from "react";

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

// Lager en kortstokk
export function MakeDeck(): PlayingCard[] {
  return suits.flatMap((suit) =>
    ranks.map((rank) => ({
      suit,
      rank,
    })),
  );
}

// Blander kortstokken
export function shuffleDeck(deck: PlayingCard[]): PlayingCard[] {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }

  return shuffled;
}

export function checkPokerHand(cards: PlayingCard[]): PokerHand {
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

  const royalRanks: cardRanks[] = ["10", "J", "Q", "K", "A"];

  const isRoyalFlush =
    isFlush &&
    royalRanks.every((rank) => cards.some((card) => card.rank === rank));

  if (isRoyalFlush) {
    return "royalFlush";
  }

  if (isStraight && isFlush) {
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

  if (isStraight) {
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

// Props til ett Card
type CardProps = {
  card: PlayingCard;
  isHeld: boolean;
  onHold: () => void;
};

// Ett enkelt spillekort
export function Card({ card, isHeld, onHold }: CardProps) {
  return (
    <div onClick={onHold}>
      <p>
        {card.rank} of {card.suit}
      </p>

      {isHeld && <p>HOLD</p>}
    </div>
  );
}

// Props til ShowFiveCards
type ShowFiveCardsProps = {
  cards: PlayingCard[];
  heldCards: number[];
  setHeldCards: React.Dispatch<React.SetStateAction<number[]>>;
};

// Viser kortene den mottar fra Game
export function ShowFiveCards({
  cards,
  heldCards,
  setHeldCards,
}: ShowFiveCardsProps) {
  function toggleHold(index: number) {
    if (heldCards.includes(index)) {
      setHeldCards(heldCards.filter((heldIndex) => heldIndex !== index));
    } else {
      setHeldCards([...heldCards, index]);
    }
  }
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
