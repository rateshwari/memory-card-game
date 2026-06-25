import Card from "./Card";
import "../styles/GameBoard.css";

function GameBoard({ cards, handleChoice, firstChoice, secondChoice, disabled }) {
  return (
    <div className="card-grid">
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          handleChoice={handleChoice}
          flipped={
            card === firstChoice ||
            card === secondChoice ||
            card.matched
          }
          disabled={disabled}
        />
      ))}
    </div>
  );
}

export default GameBoard;