import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Player } from "../types/cardTypes";

type PlayerStore = {
  allPlayers: Player[];
  addPlayer: (name: string) => void;
};

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      allPlayers: [],

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
    }),
    {
      name: "players",
    },
  ),
);
//En funksjon for å legge til bet?
//Total coins
//Current bet
//
