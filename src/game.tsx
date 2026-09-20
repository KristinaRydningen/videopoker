import Header from "./components/header/header";
import { ShowFiveCards } from "./components/card/card";

export default function Game() {
  return (
    <>
      <Header />
      <main>
        <h1>Video Poker</h1>
        <ShowFiveCards />
      </main>
    </>
  );
}
