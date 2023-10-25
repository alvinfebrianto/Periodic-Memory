const movesElement = document.getElementById("moves-count"),
      timeValue = document.getElementById("time"),
      startButton = document.getElementById("start"),
      pauseButton = document.getElementById("pause"),
      resumeButton = document.getElementById("resume"),
      stopButton = document.getElementById("stop"),
      resultElement = document.getElementById("result"),
      restartButton = document.getElementById("restart"),
      gameContainer = document.querySelector(".game-container"),
      controlsContainer = document.querySelector(".controls-container"),
      optionsButton = document.getElementById("options"),
      optionsPopup = document.getElementById("optionsPopup"),
      musicOptions = document.getElementsByName("music"),
      optionsOkButton = document.getElementById("optionsOk"),
      logo = document.querySelector(".logo");

let cards, interval, firstCard = null, secondCard = null, matchedPairs = 0,
    seconds = 0, minutes = 0, movesCount = 0, winCount = 0, totalTime = 0;

const levelOneItems = [
  { name: "hidrogen", image: "assets/golongan 1/hidrogen.png" },
  { name: "litium", image: "assets/golongan 1/litium.png" },
  { name: "natrium", image: "assets/golongan 1/natrium.png" },
  { name: "kalium", image: "assets/golongan 1/kalium.png" },
  { name: "rubidium", image: "assets/golongan 1/rubidium.png" },
  { name: "sesium", image: "assets/golongan 1/sesium.png" },
  { name: "fransium", image: "assets/golongan 1/fransium.png" },
];

const initializeGame = () => {
  resultElement.innerText = "";
  winCount = 0;
  let selectedItems = generateRandom();
  console.log(selectedItems);
  generateGameMatrix(selectedItems);
};

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
  startButton.classList.add("hide");
  restartButton.classList.remove("hide");
  stopButton.classList.add("hide");
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
    <h4>Time: ${totalTime} Seconds</h4><br><br>
  `;
};

const generateRandom = (pairCount = 7) => {
  let availableItems = [...levelOneItems];
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

musicOptions.forEach(option => {
  option.addEventListener("change", () => {
    const selectedOption = document.querySelector('input[name="music"]:checked').value;
    const audioElement = document.querySelector("audio");
    if (selectedOption === "on") {
      if (audioElement) {
        audioElement.loop = true;
        audioElement.play();
      } else {
        let audio = new Audio("assets/bg-music.mp3");
        audio.loop = true;
        audio.play();
      }
    } else if (selectedOption === "off") {
      if (audioElement) {
        audioElement.pause();
      }
    }
  });
});

const startOrRestartGame = () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  controlsContainer.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  restartButton.classList.remove("hide");
  interval = setInterval(updateTimeValue, 1000);
  movesElement.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializeGame();
};

startButton.addEventListener("click", startOrRestartGame);

restartButton.addEventListener("click", startOrRestartGame);

stopButton.addEventListener("click", () => {
  controlsContainer.classList.remove("hide");
  stopButton.classList.add("hide");
  restartButton.classList.add("hide");
  startButton.classList.remove("hide");
  gameContainer.classList.remove("paused");
  pauseButton.classList.remove("hide");
  resumeButton.classList.add("hide");
  clearInterval(interval);
  matchedPairs = 0;
  resultElement.innerHTML = "";
  gameContainer.innerHTML = "";
});

pauseButton.addEventListener("click", () => {
  clearInterval(interval);
  gameContainer.classList.add("paused");
  pauseButton.classList.add("hide");
  resumeButton.classList.remove("hide");
});

resumeButton.addEventListener("click", () => {
  interval = setInterval(updateTimeValue, 1000);
  gameContainer.classList.remove("paused");
  resumeButton.classList.add("hide");
  pauseButton.classList.remove("hide");
});

optionsButton.addEventListener("click", () => {
  optionsPopup.classList.toggle("hide");
});

optionsOkButton.addEventListener("click", () => {
  optionsPopup.classList.add("hide");
  const musicOption = document.getElementById("music").value;
});

document.getElementById('toggleButton').addEventListener('click', function() {
  const cardNames = document.querySelector('.card-names');
  cardNames.classList.toggle('collapsed');
  this.classList.toggle('arrow-up');
  this.classList.toggle('arrow-down');
});