const moves = document.getElementById("moves-count"),
      timeValue = document.getElementById("time"),
      startButton = document.getElementById("start"),
      stopButton = document.getElementById("stop"),
      gameContainer = document.querySelector(".game-container"),
      result = document.getElementById("result"),
      controls = document.querySelector(".controls-container");

let cards, interval, firstCard = false, secondCard = false, matchedPairs = 0;

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
  moves.innerHTML = `<span>Moves: </span>${movesCount}`;
};

const timeGenerator = () => {
  if (matchedPairs < cards.length / 2) {
    (seconds += 1) >= 60 && (minutes += 1, seconds = 0);
    let e = seconds < 10 ? `0${seconds}` : seconds,
      t = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time: </span>${t}:${e}`;
  } else {
    stopGame();
  }
};

const stopGame = () => {
  controls.classList.remove("hide");
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
  clearInterval(interval);
  result.innerHTML = `<h2>You Won</h2><h4>Moves: ${movesCount}</h4><br><br><br>`;
  matchedPairs = 0;
  gameContainer.innerHTML = "";
};

const generateRandom = (e = 7) => {
  let t = [...items], s = [];
  e = e * e / 2;
  for (let a = 0; a < e; a++) {
    let n = Math.floor(Math.random() * t.length);
    s.push(t[n], t[n]);
    t.splice(n, 1);
  }
  return s.sort(() => Math.random() - 0.5);
};

const matrixGenerator = (e, t = 4) => {
  gameContainer.innerHTML = "";

  const rowCount = [4, 4, 4, 2];
  let cardIndex = 0;

  for (let row = 0; row < rowCount.length; row++) {
    for (let col = 0; col < rowCount[row]; col++) {
      gameContainer.innerHTML += `
        <div class="card-container" data-card-value="${e[cardIndex].name}">
          <div class="card-before">?</div>
          <div class="card-after">
            <img src="${e[cardIndex].image}" class="image"/>
          </div>
        </div>
      `;
      cardIndex++;
    }
  }

  gameContainer.style.gridTemplateColumns = `repeat(${t}, auto)`;
  cards = document.querySelectorAll(".card-container");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      if (card.classList.contains("matched") || firstCard) {
        if (!card.classList.contains("matched") && !secondCard && card !== firstCard) {
          card.classList.add("flipped");
          secondCard = card;
          let s = firstCard.getAttribute("data-card-value");
          let a = secondCard.getAttribute("data-card-value");

          if (s === a) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard = false;
            secondCard = false;
            matchedPairs += 1;

            if (matchedPairs === e.length / 2) {
              clearInterval(interval);
            }
          } else {
            setTimeout(() => {
              firstCard.classList.remove("flipped");
              secondCard.classList.remove("flipped");
              firstCard = false;
              secondCard = false;
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
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  interval = setInterval(timeGenerator, 1000);
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

stopButton.addEventListener("click", () => {
  controls.classList.remove("hide");
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
  clearInterval(interval);
  result.innerHTML = "";
  matchedPairs = 0;
  gameContainer.innerHTML = "";
});

const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};