import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Player } from "../types/cardTypes";

type PlayerStore = {
  allPlayers: Player[];
  currentPlayer: Player | null;
  currentBet: number;

  addPlayer: (name: string) => void;
  selectPlayer: (player: Player) => void;
  setCurrentBet: (bet: number) => void;
  startRound: () => void;
};

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      allPlayers: [],
      currentPlayer: null,
      currentBet: 0,

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

      selectPlayer: (player) =>
        set({
          currentPlayer: player,
        }),

      setCurrentBet: (bet) =>
        set({
          currentBet: bet,
        }),

      startRound: () =>
        set((state) => {
          if (!state.currentPlayer || state.currentBet <= 0) {
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
    }),
    {
      name: "players",
    },
  ),
);
