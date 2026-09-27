import { usePlayerStore } from "../store/store";

// Viser spillerens nåværende innsats og knapper for å endre den.
// Tar ikke imot props og returnerer JSX for innsatskontrollene.
export default function CurrentBet() {
  const currentBet = usePlayerStore((state) => state.currentBet);
  const setCurrentBet = usePlayerStore((state) => state.setCurrentBet);
  const currentPlayer = usePlayerStore((state) => state.currentPlayer);

  // Tar imot beløpet som skal legges til innsatsen som number.
  // Sjekker at en spiller er valgt og at spilleren har nok coins.
  // Oppdaterer currentBet i Zustand og returnerer ingen verdi.
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
