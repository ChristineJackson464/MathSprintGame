// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// EQUATIONS
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// TIME
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';

// SCROLL
let valueY = 0;

// REFRESH SPLASH PAGE TO BEST SCORES
function bestScoresToDOM() {
  bestScores.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}`;
  });
}

// CHECK LOCAL STORAGE FOR BEST SCORES, SET bestScoreArray
function getSavedBestScores() {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [
      { questions: 10, bestScore: finalTimeDisplay },
      { questions: 25, bestScore: finalTimeDisplay },
      { questions: 50, bestScore: finalTimeDisplay },
      { questions: 99, bestScore: finalTimeDisplay },
    ];
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}

// UPDATE BEST SCORE ARRAY
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // SELECT CORRECT BEST SCORE TO UPDATE
    if (questionAmount == score.questions) {
      // RETURN BEST SCORE AS # W/ ONE DECIMAL
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      // UPDATE IF FINAL SCORE = LESS OR REPLACING 0
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // UPDATE SPLASH PAGE
  bestScoresToDOM();
  // SAVE TO LOCAL STORAGE
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray));
}

// RESET GAME
function playAgain() {
  gamePage.addEventListener('click', startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

// SHOW SCORE PAGE
function showScorePage() {
  // SHOW PLAY AGAIN BTN AFTER 1 SEC DELAY
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// FORMAT & DISPLAY TIME IN DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: +${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  // SCROLL TO TOP, GO TO SCORE PG
  itemContainer.scrollTo({ top: 0, behavior: 'instant' });
  showScorePage();
}

// STOP TIME, PROCESS RESULTS, GO TO SCORE PG
function checkTime() {
  // console.log(timePlayed);
  if ( playerGuessArray.length == questionAmount) {
    clearInterval(timer);
    // CHECK FOR WRONG GUESS & ADD penaltyTime
    equationsArray.forEach((equation, index) => {
      if(equation.evaluated === playerGuessArray[index]) {
        // CORRECT GUESS, NO PENALTY
      } else {
        // inCORRECT GUESS, ADD PENALTY
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    console.log('time:', timePlayed, 'penalty:', penaltyTime, 'final:', finalTime);
    scoresToDOM();
  }
}

// ADD A TENTH OF SEC TO timePlayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// START TIMER WHEN GAME PAGE IS CLICKED
function startTimer() {
  // RESET TIMES
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener('click', startTimer);
}

// SCROLL, STORE USER SELECTION IN playerGuessArray
function select(guessedTrue) {
  // SCROLL 80 MORE px
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // ADD PLAYER GUESS TO ARRAY
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}

//DISPLAY GAME PAGE
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// GET RANDOM NUMBER TO A MAX PARAMETER
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount); 
  console.log('correct equations:', correctEquations); 
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations;
  // console.log('wrong equations:', wrongEquations); 
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
shuffle(equationsArray);
}

// ADD EQUATIONS TO DOM
function equationsToDOM() {
  equationsArray.forEach((equation) => {
    // ITEM
    const item = document.createElement('div');
    item.classList.add('item');
    // EQUATION TEXT
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    // APPEND
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// DYNAMICALLY ADDING CORRECT/INCORRECT EQUATIONS
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // CREATE EQUATIONS, BUILD ELEMENTS IN DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

//  DISPLAYS: 3, 2, 1, GO!...
function countdownStart () {
  countdown.textContent = "3";
  setTimeout (() => {
    countdown.textContent = "2";
  }, 1000); 
  setTimeout (() => {
    countdown.textContent = "1";
  }, 2000); 
  setTimeout (() => {
    countdown.textContent = "GO!";
  }, 3000); 
}

// NAVIGATE FR0M SPLASH PG TO COUNTDOWN PG TO GAME PG
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();
  populateGamePage();
  setTimeout(showGamePage, 4000);
}

// GET VALUE FROM SELECTED RADIO BTN
function getRadioValue() {
  let radioValue;
  radioInputs.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// FORM THAT DECIDES AMT OF Qs
function selectQuestionAmount(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  console.log('question amt:', questionAmount);
  if (questionAmount) {
    showCountdown();
  }
}

// SWITCH INPUT STYLES
startForm.addEventListener('click', () => {
  radioContainers.forEach((radioEl) => {
    // RESET/REMOVE SELECTED LABEL STYLING
    radioEl.classList.remove('selected-label');
    // ADD BACK ID RADIO INPUT CHECKED
    if (radioEl.children[1].checked) {
      radioEl.classList.add('selected-label');
    }
  });
});

// EVENT LISTENER
startForm.addEventListener('submit', selectQuestionAmount);
gamePage.addEventListener('click', startTimer);

// ON LOAD
getSavedBestScores();