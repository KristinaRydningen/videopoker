import Header from "./components/header/header";
import NewPlayerForm from "./components/playerform";

export function Players() {
  return (
    <>
      <Header />
      <main>
        <h1>Spillere</h1>
        <NewPlayerForm />
      </main>
    </>
  );
}
