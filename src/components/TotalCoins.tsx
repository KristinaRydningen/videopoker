import { usePlayerStore } from "../store/store";

export default function TotalCoins() {
  const currentPlayer = usePlayerStore((state) => state.currentPlayer);

  return (
    <div>
      <p>Du har {currentPlayer?.coins} coins</p>
    </div>
  );
}
