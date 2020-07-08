const CONTAINER = document.querySelector('.container');
const LEVEL = document.querySelector('.info__select-level');
const COUNT = document.querySelector('.info__select-count');
const POINTS_INFO = document.querySelector('.info__points');
const RESULT = document.querySelector('.result');
const NEW_GAME = document.querySelector('.result__btn');
const RESULT_INFO = document.querySelector('.result__info');
let points = 0;
let arrayOfCardsId = [];
let stack = [];

function getRandomInt(max = 29) {
  return Math.floor(Math.random() * Math.floor(max));
}

function translate(element) {
  if (arrayOfCardsId.includes(element.id)) {
    return element.wordTranslate;
  }
  arrayOfCardsId.push(element.id);
  return element.word;
}

function drawCards(cards) {
  const concatCards = cards.concat(cards);
  concatCards.sort(() => 0.5 - Math.random());
  concatCards.forEach((element) => {
    CONTAINER.innerHTML += `
    <div class='container__card' id='${element.id}'>
      <div class="front">CARD</div>
      <div class="back">${translate(element)}</div>
    </div>
    `;
  });
}

async function getListOfWords(level = 0, count = 5) {
  const URL = `https://afternoon-falls-25894.herokuapp.com/words?group=${level}&page=${getRandomInt()}`;
  const RESPONSE = await fetch(URL);
  const DATA = await RESPONSE.json();
  CONTAINER.innerHTML = '';
  points = 0;
  POINTS_INFO.textContent = '0 points';
  arrayOfCardsId = [];
  drawCards(DATA.splice(0, count));
}

getListOfWords();

function checkGame() {
  const CARDS = document.querySelectorAll('.container__card');
  const result = [...CARDS].filter((element) => {
    if (!element.classList.contains('solve')) {
      return 1;
    }
    return 0;
  });
  if (result.length === 0) {
    RESULT.style.display = 'flex';
    RESULT_INFO.textContent = `${points} points // ${LEVEL.value} Level // ${COUNT.value} words`;
    localStorage.setItem('findPair_points', points);
  }
}

function isThisCardsEqual() {
  setTimeout(() => {
    if (stack[0].id === stack[1].id && stack[0].textContent !== stack[1].textContent) {
      stack.forEach((element) => element.classList.add('solve'));
      POINTS_INFO.textContent = `${points += 1} points`;
      checkGame();
    } else {
      stack.forEach((element) => element.classList.remove('rotate'));
    }
    stack = [];
  }, 1000);
}

CONTAINER.addEventListener('click', (event) => {
  if (event.target.closest('.container__card') && !event.target.closest('.solve') && stack.length < 2) {
    const CARD = event.target.closest('.container__card');
    CARD.classList.add('rotate');
    stack.push(CARD);
    if (stack.length === 2) {
      isThisCardsEqual();
    }
  }
});

LEVEL.addEventListener('change', () => {
  getListOfWords(LEVEL.value - 1, COUNT.value);
});

COUNT.addEventListener('change', () => {
  getListOfWords(LEVEL.value - 1, COUNT.value);
});

NEW_GAME.addEventListener('click', () => {
  getListOfWords(LEVEL.value - 1, COUNT.value);
  RESULT.style.display = 'none';
});
