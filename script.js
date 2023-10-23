const movesElement = document.getElementById("moves-count"),
      timeValue = document.getElementById("time"),
      startButton = document.getElementById("start"),
      stopButton = document.getElementById("stop"),
      resultElement = document.getElementById("result"),
      gameContainer = document.querySelector(".game-container"),
      controlsContainer = document.querySelector(".controls-container"),
      logo = document.querySelector(".logo");

let cards, interval, firstCard = null, secondCard = null, matchedPairs = 0,
    seconds = 0, minutes = 0, movesCount = 0, winCount = 0, totalTime = 0;

const items = [
  { name: "hydrogen", image: "assets/golongan 1/hydrogen.png" },
  { name: "lithium", image: "assets/golongan 1/lithium.png" },
  { name: "sodium", image: "assets/golongan 1/sodium.png" },
  { name: "potassium", image: "assets/golongan 1/potassium.png" },
  { name: "rubidium", image: "assets/golongan 1/rubidium.png" },
  { name: "caesium", image: "assets/golongan 1/caesium.png" },
  { name: "francium", image: "assets/golongan 1/francium.png" },
];

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
    totalTime = minutes * 60 + seconds;
  } else {
    stopGame();
  }
};

const stopGame = () => {
  controlsContainer.classList.remove("hide");
  logo.style.display = "none";
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
  clearInterval(interval);
  matchedPairs = 0;
  gameContainer.innerHTML = "";
  let resultImage;
  if (totalTime <= 60) {
    resultImage = "assets/rank/s.png";
  } else if (totalTime <= 120) {
    resultImage = "assets/rank/a.png";
  } else if (totalTime <= 240) {
    resultImage = "assets/rank/b.png";
  } else {
    resultImage = "assets/rank/c.png";
  }
  resultElement.innerHTML = `
    <h2>You Got</h2>
    <img src="${resultImage}" style="max-width: 80%; height: auto;"><br><br>
    <h4>Moves: ${movesCount}</h4>
    <h4>Time: ${totalTime} Seconds</h4><br><br><br>
  `;
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

document.getElementById('toggleButton').addEventListener('click', function() {
  const cardNames = document.querySelector('.card-names');
  cardNames.classList.toggle('collapsed');
  this.classList.toggle('arrow-up');
  this.classList.toggle('arrow-down');
});