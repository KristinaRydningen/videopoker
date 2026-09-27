import { usePlayerStore } from "../store/store";

// Viser hvor mange coins currentPlayer har.
// Tar ikke imot noen props og returnerer JSX med spillerens coins.
export default function TotalCoins() {
  const currentPlayer = usePlayerStore((state) => state.currentPlayer);

  return (
    <div>
      <p>Du har {currentPlayer?.coins} coins</p>
    </div>
  );
}
