import { useState, useEffect } from "react";
import GameBoard from "./components/GameBoard";
import cardSymbols from "./data/cards";
import Confetti from "react-confetti";

function App() {
  const [cards, setCards] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);

  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [won, setWon] = useState(false);
  
  const [bestScore, setBestScore] = useState(
  localStorage.getItem("bestScore") || "-"
);

const [bestTime, setBestTime] = useState(
  localStorage.getItem("bestTime") || "-"
);

const [difficulty, setDifficulty] = useState("easy");

  // Shuffle cards
  const shuffleCards = () => {
  let pairCount = 8;

  if (difficulty === "medium") pairCount = 10;
  if (difficulty === "hard") pairCount = 12;

  const selectedCards = cardSymbols.slice(0, pairCount);

  const shuffledCards = [...selectedCards, ...selectedCards]
    .sort(() => Math.random() - 0.5)
    .map((symbol, index) => ({
      id: index,
      symbol,
      matched: false,
    }));

  setCards(shuffledCards);
  setFirstChoice(null);
  setSecondChoice(null);
  setMoves(0);
  setTime(0);
  setWon(false);
};
  // Card selection
  const handleChoice = (card) => {
  if (card === firstChoice) return;

  firstChoice
    ? setSecondChoice(card)
    : setFirstChoice(card);
};

  // Reset turn
  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  };

  // Match logic
  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);

      if (firstChoice.symbol === secondChoice.symbol) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.symbol === firstChoice.symbol
              ? { ...card, matched: true }
              : card
          )
        );

        resetTurn();
      } else {
        setTimeout(() => {
          resetTurn();
        }, 1000);
      }

      setMoves((prev) => prev + 1);
    }
  }, [firstChoice, secondChoice]);

  // Timer
  useEffect(() => {
    if (won) return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [won]);

  // Win detection
  useEffect(() => {
  if (
    cards.length > 0 &&
    cards.every((card) => card.matched)
  ) {
    setWon(true);

    const savedMoves = localStorage.getItem("bestScore");
    const savedTime = localStorage.getItem("bestTime");

    if (!savedMoves || moves < savedMoves) {
      localStorage.setItem("bestScore", moves);
      setBestScore(moves);
    }

    if (!savedTime || time < savedTime) {
      localStorage.setItem("bestTime", time);
      setBestTime(time);
    }
  }
}, [cards]);

// START GAME
useEffect(() => {
  shuffleCards();
}, []);

// CHANGE DIFFICULTY
useEffect(() => {
  shuffleCards();
}, [difficulty]);

  const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(
    secs
  ).padStart(2, "0")}`;
};

  return (
  <div className="app">
    <h1>🧠 Memory Card Game</h1>
    {won && <Confetti />}

    <div className="difficulty">
  <button
  className={difficulty === "easy" ? "active" : ""}
  onClick={() => setDifficulty("easy")}
>
  Easy
</button>

  <button onClick={() => setDifficulty("medium")}>
    Medium
  </button>

  <button onClick={() => setDifficulty("hard")}>
    Hard
  </button>
</div>

    <div className="stats">
      <p>⏱ Time: {formatTime(time)}</p>
      <p>🎯 Moves: {moves}</p>
    </div>
    <div className="best-score">
  🏆 Best Moves: {bestScore} | ⏱ Best Time: {bestTime}s
</div>

    <button onClick={shuffleCards}>
      New Game
    </button>

    {won ? (
      <div className="win-message">
        <h2>🎉 Congratulations!</h2>
        <p>You Won!</p>
        <p>Time: {formatTime(time)} seconds</p>
        <p>Moves: {moves}</p>

        <button onClick={shuffleCards}>
          Play Again
        </button>
      </div>
    ) : (
      <GameBoard
  cards={cards}
  handleChoice={handleChoice}
  firstChoice={firstChoice}
  secondChoice={secondChoice}
  disabled={disabled}
  difficulty={difficulty}
/>
    )}
  </div>
);
}

export default App;