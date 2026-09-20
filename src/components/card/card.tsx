//TODO: Lage en funksjon som velger ut random kort * 4
//TODO: Designe kort med grid.

import { useState } from "react";
import styles from "./card.module.css";

import type { cardRanks, cardSuits, PlayingCard } from "../../types/cardTypes";

//TODO: Lage et array med alle 52 kort.
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

//Lager en kortstokk
export function MakeDeck(): PlayingCard[] {
  return suits.flatMap((suit) =>
    ranks.map((rank) => ({
      suit,
      rank,
    })),
  );
}

//Blande kortstokken
export function shuffleDeck(deck: PlayingCard[]): PlayingCard[] {
  const shuffled = [...deck];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
}

//Vise frem fem kort av den blandede stokken
export function ShowFiveCards() {
  const [cards, setCards] = useState(() => {
    const deck = MakeDeck();
    const shuffledDeck = shuffleDeck(deck);

    return shuffledDeck.slice(0, 5);
  });

  return (
    <div>
      <h3>Dine kort</h3>
      <div className={styles.playerHand}>
        {cards.map((card, index) => (
          <div key={index}>
            {card.rank} of {card.suit}
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          const deck = MakeDeck();
          const shuffledDeck = shuffleDeck(deck);
          setCards(shuffledDeck.slice(0, 5));
        }}
      >
        Trekk kort
      </button>
    </div>
  );
}

//TODO: funksjoner for hver vinnermulighet (straight osv) som sender inn kortene på hånden som parameter
