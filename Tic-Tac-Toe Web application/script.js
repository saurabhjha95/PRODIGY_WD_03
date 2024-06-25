document.addEventListener("DOMContentLoaded", () => {
  const cells = document.querySelectorAll(".cell");
  const resetButton = document.getElementById("resetButton");
  const currentPlayerDisplay = document.getElementById("currentPlayer");
  const playerModeSelect = document.getElementById("playerModeSelect");

  let currentPlayer = "X";
  let gameActive = true;
  let gameState = ["", "", "", "", "", "", "", "", ""];
  let againstAI = true;

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const handleCellPlayed = (clickedCell, clickedCellIndex) => {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
    clickedCell.innerText = currentPlayer;
  };

  const handlePlayerChange = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    currentPlayerDisplay.innerText = `Current Turn: ${currentPlayer}`;

    if (againstAI && currentPlayer === "O") {
      setTimeout(handleAIMove, 500);
    }
  };

  const handleResultValidation = () => {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
      const winCondition = winningConditions[i];
      let a = gameState[winCondition[0]];
      let b = gameState[winCondition[1]];
      let c = gameState[winCondition[2]];
      if (a === "" || b === "" || c === "") {
        continue;
      }
      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      currentPlayerDisplay.innerText = `Player ${currentPlayer} has won!`;
      gameActive = false;
      return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
      currentPlayerDisplay.innerText = `Game ended in a draw!`;
      gameActive = false;
      return;
    }

    handlePlayerChange();
  };

  const handleCellClick = (clickedCellEvent) => {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
      return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
  };

  const handleResetGame = () => {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    currentPlayerDisplay.innerText = `Current Turn: ${currentPlayer}`;
    cells.forEach((cell) => {
      cell.innerText = "";
      cell.classList.remove("x", "o");
    });

    if (againstAI && currentPlayer === "O") {
      setTimeout(handleAIMove, 500);
    }
  };

  const handleAIMove = () => {
    if (!gameActive) return;

    let availableCells = [];
    gameState.forEach((cell, index) => {
      if (cell === "") {
        availableCells.push(index);
      }
    });

    if (availableCells.length > 0) {
      const randomIndex =
        availableCells[Math.floor(Math.random() * availableCells.length)];
      const cell = document.querySelector(`.cell[data-index='${randomIndex}']`);
      handleCellPlayed(cell, randomIndex);
      handleResultValidation();
    }
  };

  const handlePlayerModeChange = () => {
    againstAI = playerModeSelect.value === "ai";
    handleResetGame();
  };

  cells.forEach((cell, index) => {
    cell.addEventListener("click", handleCellClick);
  });

  resetButton.addEventListener("click", handleResetGame);
  playerModeSelect.addEventListener("change", handlePlayerModeChange);
});
