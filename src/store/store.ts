import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Player, PlayingCard, PokerHand } from "../types/cardTypes";

//Beskriver all state og alle actions som finnes i Zustand-storen
type PlayerStore = {
  allPlayers: Player[];
  currentPlayer: Player | null;
  currentBet: number;

  cards: PlayingCard[];
  deck: PlayingCard[];
  discardedCards: PlayingCard[];
  heldCards: number[];
  hasDrawn: boolean;
  pokerHand: PokerHand | null;

  addPlayer: (name: string) => void;
  selectPlayer: (player: Player) => void;
  setCurrentBet: (bet: number) => void;
  startRound: () => void;
  addWinnings: (amount: number) => void;

  setCards: (cards: PlayingCard[]) => void;
  setDeck: (deck: PlayingCard[]) => void;
  setDiscardedCards: (cards: PlayingCard[]) => void;
  setHeldCards: (heldCards: number[]) => void;
  setHasDrawn: (hasDrawn: boolean) => void;
  setPokerHand: (pokerHand: PokerHand | null) => void;
};

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      allPlayers: [],
      currentPlayer: null,
      currentBet: 0,

      cards: [],
      deck: [],
      discardedCards: [],
      heldCards: [],
      hasDrawn: false,
      pokerHand: null,

      // Actions som tar imot nye verdier og
      // oppdaterer tilhørende state i Zustand.
      setCards: (cards) =>
        set({
          cards: cards,
        }),

      setDeck: (deck) =>
        set({
          deck: deck,
        }),

      setDiscardedCards: (cards) =>
        set({
          discardedCards: cards,
        }),

      setHeldCards: (heldCards) =>
        set({
          heldCards: heldCards,
        }),

      setHasDrawn: (hasDrawn) =>
        set({
          hasDrawn: hasDrawn,
        }),

      setPokerHand: (pokerHand) =>
        set({
          pokerHand: pokerHand,
        }),

      //Tar imot spillerens navn som string og lager en ny spiller
      //med unik id og 100 coins. Oppdaterer allPlayers og returnerer
      //ingen verdi.
      addPlayer: (name) =>
        set((state) => ({
          allPlayers: [
            ...state.allPlayers,
            {
              id: crypto.randomUUID(),
              name: name,
              coins: 100,
            },
          ],
        })),

      // Tar imot en Player og setter denne spilleren som currentPlayer.
      // Returnerer ingen verdi.
      selectPlayer: (player) =>
        set({
          currentPlayer: player,
        }),

      // Tar imot innsatsen som number og oppdaterer currentBet.
      // Returnerer ingen verdi.
      setCurrentBet: (bet) =>
        set({
          currentBet: bet,
        }),

      // Starter økonomidelen av en ny runde og tar ikke imot argumenter.
      // Trekker currentBet fra currentPlayer og oppdaterer samme spiller i allPlayers.
      // Returnerer ingen verdi.
      startRound: () =>
        set((state) => {
          if (
            !state.currentPlayer ||
            state.currentBet <= 0 ||
            state.currentBet > state.currentPlayer.coins
          ) {
            return state;
          }

          const newCoins = state.currentPlayer.coins - state.currentBet;

          return {
            currentPlayer: {
              ...state.currentPlayer,
              coins: newCoins,
            },

            allPlayers: state.allPlayers.map((player) =>
              player.id === state.currentPlayer?.id
                ? { ...player, coins: newCoins }
                : player,
            ),
          };
        }),

      //Tar imot gevinstbeløpet som number
      // legger det til currentPlayer og oppdaterer samme spiller i allPlayers
      //returnerer ingen verdi
      addWinnings: (amount) =>
        set((state) => {
          if (!state.currentPlayer) {
            return state;
          }

          const newCoins = state.currentPlayer.coins + amount;

          return {
            currentPlayer: {
              ...state.currentPlayer,
              coins: newCoins,
            },

            allPlayers: state.allPlayers.map((player) =>
              player.id === state.currentPlayer?.id
                ? { ...player, coins: newCoins }
                : player,
            ),
          };
        }),
    }),
    // Navnet brukes som nøkkel i localStorage.
    // Persist lagrer Zustand-state i localStorage slik at den overlever refresh.
    {
      name: "players",
    },
  ),
);
