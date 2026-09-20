import { usePlayerStore } from "../store/store";

export default function CurrentBet() {
  const currentBet = usePlayerStore((state) => state.currentBet);
  const setCurrentBet = usePlayerStore((state) => state.setCurrentBet);
  const currentPlayer = usePlayerStore((state) => state.currentPlayer);

  function addBet(amount: number) {
    if (!currentPlayer) {
      return;
    }

    if (currentBet + amount <= currentPlayer.coins) {
      setCurrentBet(currentBet + amount);
    }
  }

  return (
    <div>
      <p>Du satser {currentBet} coins</p>

      <button onClick={() => addBet(1)}>+1</button>
      <button onClick={() => addBet(5)}>+5</button>
      <button onClick={() => addBet(10)}>+10</button>

      <button onClick={() => setCurrentBet(0)}>Nullstill innsats</button>
    </div>
  );
}
