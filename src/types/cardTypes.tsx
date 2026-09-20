export type cardSuits = "hearts" | "diamonds" | "clubs" | "spades";

export type cardRanks =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";

export type PlayingCard = {
  suit: cardSuits;
  rank: cardRanks;
};

export type Player = {
  id: string;
  name: string;
  coins: number;
};

export type PokerHand =
  | "royalFlush"
  | "straightFlush"
  | "fourOfAKind"
  | "fullHouse"
  | "flush"
  | "straight"
  | "threeOfAKind"
  | "twoPair"
  | "pair"
  | "highCard";
