export default function PayoutTable() {
  return (
    <div>
      <h1>Slik spiller du Video Poker</h1>

      <p>
        Du starter med 100 coins. En runde starter med at du velger hvor mye du
        vil satse. Det blir delt ut fem tilfeldige kort. Du låser de kortene du
        vil beholde, og resten erstattes med nye kort. Målet er å få den beste
        pokerhånden.
      </p>

      <table>
        <thead>
          <tr>
            <th>Hånd</th>
            <th>Utbetaling</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Royal flush</td>
            <td>250 × innsats</td>
          </tr>
          <tr>
            <td>Straight flush</td>
            <td>50 × innsats</td>
          </tr>
          <tr>
            <td>Four of a kind</td>
            <td>25 × innsats</td>
          </tr>
          <tr>
            <td>Full house</td>
            <td>9 × innsats</td>
          </tr>
          <tr>
            <td>Flush</td>
            <td>6 × innsats</td>
          </tr>
          <tr>
            <td>Straight</td>
            <td>4 × innsats</td>
          </tr>
          <tr>
            <td>Three of a kind</td>
            <td>3 × innsats</td>
          </tr>
          <tr>
            <td>Two pair</td>
            <td>2 × innsats</td>
          </tr>
          <tr>
            <td>Jacks or better</td>
            <td>1 × innsats</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
