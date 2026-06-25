import Card from "./Card";
import "../styles/GameBoard.css";

function GameBoard({
  cards,
  handleChoice,
  firstChoice,
  secondChoice,
  disabled,
  difficulty,
}) {
  const columns =
  difficulty === "hard"
    ? 6
    : difficulty === "medium"
    ? 5
    : 4;

  return (
    <div
      className="card-grid"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
        
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