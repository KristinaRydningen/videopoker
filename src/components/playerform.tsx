import { usePlayerStore } from "../store/store";

export default function NewPlayerForm() {
  const allPlayers = usePlayerStore((state) => state.allPlayers);
  const addPlayer = usePlayerStore((state) => state.addPlayer);

  function addNewPlayer(formData: FormData) {
    const newPlayer = formData.get("newplayer") as string;

    addPlayer(newPlayer);
  }

  return (
    <>
      <form action={addNewPlayer}>
        <label htmlFor="newplayer">Ny spiller</label>
        <input type="text" name="newplayer" id="newplayer" />
        <button>Registrer ny spiller</button>
      </form>

      {allPlayers.map((player) => (
        <li key={player.id}>
          {player.name}, {player.coins} coins
          <button>Velg spiller</button>
        </li>
      ))}
    </>
  );
}
