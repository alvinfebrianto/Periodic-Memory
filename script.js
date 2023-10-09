const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

// tambah untuk pasangan kartu yang cocok 
let matchedPairs = 0;

const items = [
  { name: "hydrogen", image: "assets/golongan_1/g1H.png" },
  { name: "lithium", image: "assets/golongan_1/g1Li.png" },
  { name: "sodium", image: "assets/golongan_1/g1Na.png" },
  { name: "potassium", image: "assets/golongan_1/g1K.png" },
  { name: "rubidium", image: "assets/golongan_1/g1Rb.png" },
  { name: "caesium", image: "assets/golongan_1/g1Cs.png" },
  { name: "francium", image: "assets/golongan_1/g1Fr.png" },
];

//Inisialisasi waktu awal
let seconds = 0,
    minutes = 0;
//Inisialisasi jumlah gerakan
let movesCount = 0,
    winCount = 0;

//Fungsi untuk mengupdate waktu
const timeGenerator = () => {
  if (matchedPairs < cardValues.length / 2) {
    seconds += 1;
    if (seconds >= 60) {
      minutes += 1;
      seconds = 0;
    }
    //Format waktu
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
  }
};

//Fungsi untuk menghitung gerakan
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves: </span>${movesCount}`;
};

//Fungsi untuk menampilkan kartu pasangan yang cocok
function showSuccessNotification() {
  if ("Notification" in window) {
    //Periksa apakah browser mendukung Notification API
    if (Notification.permission === "granted") {
      //Izin notifikasi sudah diberikan
      new Notification("Congratulations", {
        body: "You've matched all the cards!",
      });
    } else if (Notification.permission !== "denied") {
      //Minta izin notifikasi jika belum diberikan atau ditolak
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          new Notification("Congratulations", {
            body: "You've matched all the cards!",
          });
        }
      });
    }
  } else {
    // Browser tidak mendukung Notification API
    alert("Congratulations, you've matched all the cards!");
  }
}

//Pilih objek acak dari item array
const generateRandom = (size = 4) => {
  let tempArray = [...items];
  let cardValues = [];
  size = (size * size) / 2;

  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  cardValues.sort(() => Math.random() - 0.5);

  for (let i = 0; i < size * size; i++) {
    if (cardValues[i]) {
      gameContainer.innerHTML += `
        <div class="card-container" data-card-value="${cardValues[i].name}">
          <div class="card-before">?</div>
          <div class="card-after">
            <img src="${cardValues[i].image}" class="image"/>
          </div>
        </div>
      `;
    }
  }
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("matched") && !firstCard) {
        card.classList.add("flipped");
        firstCard = card;
      } else if (!card.classList.contains("matched") && !secondCard && card !== firstCard) {
        card.classList.add("flipped");
        secondCard = card;
        const firstCardValue = firstCard.getAttribute("data-card-value");
        const secondCardValue = secondCard.getAttribute("data-card-value");

        if (firstCardValue === secondCardValue) {
          firstCard.classList.add("matched");
          secondCard.classList.add("matched");
          firstCard = false;
          secondCard = false;
          matchedPairs++;

          if (matchedPairs === cardValues.length / 2) {
            showSuccessNotification();
            clearInterval(interval); // Hentikan timer saat permainan selesai
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
    });
  });
};

//Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //Kontrol dan tombol
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //Mulai timer
  interval = setInterval(timeGenerator, 1000);
  //Gerakan awal
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

//Stop game
stopButton.addEventListener("click", () => {
  controls.classList.remove("hide");
  stopButton.classList.add("hide");
  startButton.classList.remove("hide");
  clearInterval(interval);
  result.innerHTML = "";
  matchedPairs = 0;
  gameContainer.innerHTML = "";
});

//Inisialisasi values
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};