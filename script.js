const movesElement = document.getElementById("moves-count"),
      timeValue = document.getElementById("time"),
      startButton = document.getElementById("start"),
      stopButton = document.getElementById("stop"),
      gameContainer = document.querySelector(".game-container"),
      resultElement = document.getElementById("result"),
      controlsContainer = document.querySelector(".controls-container");

let cards, interval, firstCard = null, secondCard = null, matchedPairs = 0;

const items = [
  { name: "hydrogen", image: "assets/golongan_1/g1H.png" },
  { name: "lithium", image: "assets/golongan_1/g1Li.png" },
  { name: "sodium", image: "assets/golongan_1/g1Na.png" },
  { name: "potassium", image: "assets/golongan_1/g1K.png" },
  { name: "rubidium", image: "assets/golongan_1/g1Rb.png" },
  { name: "caesium", image: "assets/golongan_1/g1Cs.png" },
  { name: "francium", image: "assets/golongan_1/g1Fr.png" },
];

let seconds = 0, minutes = 0, movesCount = 0, winCount = 0;

const movesCounter = () => {
  movesCount += 1;
  movesElement.innerHTML = `<span>Moves: </span>${movesCount}`;
};

const updateTimeValue = () => {
  if (matchedPairs < cards.length / 2) {
    (seconds += 1) >= 60 && (minutes += 1, seconds = 0);
    let secondsString = seconds < 10 ? `0${seconds}` : seconds;
    let minutesString = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time: </span>${minutesString}:${secondsString}`;
  } else {
    stopGame();
  }
};

const stopGame = () => {
  controlsContainer.classList.remove("hide");
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
  clearInterval(interval);
  matchedPairs = 0;
  gameContainer.innerHTML = "";
  const timeString = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  resultElement.innerHTML = `<h2>You Won</h2><h4>Moves: ${movesCount}</h4><h4>Time: ${timeString}</h4><br><br><br>`;
};


const generateRandom = (pairCount = 7) => {
  let availableItems = [...items];
  let selectedItems = [];
  pairCount = pairCount * pairCount / 2;

  for (let i = 0; i < pairCount; i++) {
    let randomIndex = Math.floor(Math.random() * availableItems.length);
    let selectedItem = availableItems[randomIndex];
    selectedItems.push(selectedItem, selectedItem);
    availableItems.splice(randomIndex, 1);
  }

  return selectedItems.sort(() => Math.random() - 0.5);
};

const generateGameMatrix = (selectedItems, rows = 4) => {
  gameContainer.innerHTML = "";

  const rowCount = [4, 4, 4, 2];
  let cardIndex = 0;

  for (let row = 0; row < rowCount.length; row++) {
    for (let col = 0; col < rowCount[row]; col++) {
      gameContainer.innerHTML += `
        <div class="card-container" data-card-value="${selectedItems[cardIndex].name}">
          <div class="card-before">?</div>
          <div class="card-after">
            <img src="${selectedItems[cardIndex].image}" class="image"/>
          </div>
        </div>
      `;
      cardIndex++;
    }
  }

  const columns = rows;
  gameContainer.style.gridTemplateColumns = `repeat(${columns}, auto)`;

  cards = document.querySelectorAll(".card-container");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      if (card.classList.contains("matched") || firstCard) {
        if (!card.classList.contains("matched") && !secondCard && card !== firstCard) {
          card.classList.add("flipped");
          secondCard = card;
          let firstCardValue = firstCard.getAttribute("data-card-value");
          let secondCardValue = secondCard.getAttribute("data-card-value");

          if (firstCardValue === secondCardValue) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard = null;
            secondCard = null;
            matchedPairs += 1;

            if (matchedPairs === selectedItems.length / 2) {
              clearInterval(interval);
            }
          } else {
            setTimeout(() => {
              firstCard.classList.remove("flipped");
              secondCard.classList.remove("flipped");
              firstCard = null;
              secondCard = null;
            }, 1000);
          }

          movesCounter();
        }
      } else {
        card.classList.add("flipped");
        firstCard = card;
      }
    });
  });
};

startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  controlsContainer.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  interval = setInterval(updateTimeValue, 1000);
  movesElement.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializeGame();
});

stopButton.addEventListener("click", () => {
  controlsContainer.classList.remove("hide");
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
  clearInterval(interval);
  matchedPairs = 0;
  resultElement.innerHTML = "";
  gameContainer.innerHTML = "";
});

const initializeGame = () => {
  resultElement.innerText = "";
  winCount = 0;
  let selectedItems = generateRandom();
  console.log(selectedItems);
  generateGameMatrix(selectedItems);
};