/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
/* eslint-disable new-cap */
/* eslint-disable no-undef */
/* eslint-disable max-classes-per-file */

const CONTAINER = document.querySelector('.sound__container');
const INPUT = document.querySelector('.text__input');
const RESTART = document.querySelector('.restart');
const AUDIO = document.querySelector('.recognize');
const IMAGE = document.querySelector('.image');
const POINTS = document.querySelector('.points');
const SELECT = document.querySelector('.levels');
const INTRO = document.querySelector('.intro');
const CONTENT = document.querySelector('.content');
const TRANSLATE = document.querySelector('.translate');
const STATS = document.querySelector('.stats');
const RESULTS = document.querySelector('.results');
const BACK = document.querySelector('.content__btn-return');
const WRONG = document.querySelector('.wrong');
const CORRECT = document.querySelector('.correct');
const NEW_GAME = document.querySelector('.content__btn-new');

const RECOGNIZER = new webkitSpeechRecognition();
const GIT_URL = 'https://raw.githubusercontent.com/ITETRISI/rslang-data/master/data';
const USER_ID = '5efc5b18aae472001798c238';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZmM1YjE4YWFlNDcyMDAxNzk4YzIzOCIsImlhdCI6MTU5MzYxMTU5MSwiZXhwIjoxNTkzNjI1OTkxfQ.bTSzsCph-j5ceEF585QZ11gAYzDT1uLMVlJtRbu3KQs';
let userScore = 0;

class Words {
  constructor() {
    this.collection = [];
    this.correctWordArray = [];
    this.wrongWordArray = [];
  }

  async getListOfWords(level = 0) {
    const URL = `https://afternoon-falls-25894.herokuapp.com/words?group=${level}&page=${getRandomInt()}`;
    const RESPONSE = await fetch(URL);
    const DATA = await RESPONSE.json();
    this.collection = DATA.splice(0, DATA.length / 2);
    this.wrongWordArray = this.collection;
    this.createWords();
    GAME.drawStats();
  }

  async translateWord(word) {
    const URL = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200424T194324Z.1fc3d382b16099a7.576c0a6f5f134312f2eaec19bb60b5a666de1916&text=${word}&lang=en-ru`;
    const RESPONSE = await fetch(URL);
    const DATA = await RESPONSE.json();
    TRANSLATE.innerHTML = await DATA.text[0];
    const result = await DATA.text[0];
    return result;
  }

  wordsRecognizer() {
    RECOGNIZER.lang = 'en';
    RECOGNIZER.onresult = function (event) {
      const result = event.results[event.resultIndex];
      if (result.isFinal) {
        const word = result[0].transcript.toLowerCase();
        INPUT.value = word;
      }
    };

    RECOGNIZER.onend = function () {
      const CORRECT_WORD = GAME.isThisWordsCorrect(INPUT.value);
      if (!CORRECT_WORD) {
        RECOGNIZER.start();
      } else {
        WORDS.addUserWord(CORRECT_WORD);
      }
    };
    RECOGNIZER.start();
  }

  async addUserWord(newWord) {
    const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${USER_ID}/words/${newWord.id}`, {
      method: 'POST',
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const CONTENT = await rawResponse.json();
  }

  createWords() {
    CONTAINER.innerHTML = '';
    this.collection.forEach((element) => {
      CONTAINER.innerHTML += `<div class="sound__container-block">
      <div class="headphone-img"></div>
      <div class="word__container">
        <span>${element.word}</span>
        <span>${element.transcription}</span>
      </div>
      </div>`;
    });
  }

  playAudio(address) {
    const AUDIO = new Audio(GIT_URL + address);
    AUDIO.play();
  }
}

const WORDS = new Words();

class Game {
  isThisWordsCorrect(INPUT) {
    const correctWord = WORDS.collection.find((element) => element.word === INPUT);
    if (correctWord) {
      const wordIndex = WORDS.collection.indexOf(correctWord);
      const child = CONTAINER.children[wordIndex];
      if (!child.classList.contains('active')) {
        WORDS.correctWordArray.push(correctWord);
        WORDS.wrongWordArray = WORDS.wrongWordArray.filter((element) => element !== correctWord);
        child.classList.add('active');
        POINTS.innerHTML += '<img src="./src/image/star.svg" width="44" />';
        userScore++;
        if (userScore === 10) {
          showStats();
        }
        return correctWord;
      }
    }
    return false;
  }

  drawStats() {
    WRONG.innerHTML = '';
    CORRECT.innerHTML = '';
    WORDS.wrongWordArray.forEach((element) => {
      this.translateWrongWords(element);
      WRONG.innerHTML += `
      <div class="wrong-word">
      <div class="headphone-img"></div>
      <span>${element.word}</span>
      <span>${element.transcription}</span>
      <span>${element.wordTranslate}</span>
      </div>`;
    });
    WORDS.correctWordArray.forEach((element) => {
      this.translateCorrectWords(element);
      CORRECT.innerHTML += `
      <div class="correct-word">
      <div class="headphone-img"></div>
      <span>${element.word}</span>
      <span>${element.transcription}</span>
      <span>${element.wordTranslate}</span>
      </div>`;
    });
  }

  async translateWrongWords(element) {
    const URL = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200424T194324Z.1fc3d382b16099a7.576c0a6f5f134312f2eaec19bb60b5a666de1916&text=${element.word}&lang=en-ru`;
    const RESPONSE = await fetch(URL);
    const DATA = await RESPONSE.json();
    element.translate = DATA.text[0];
  }

  async translateCorrectWords(element) {
    const URL = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200424T194324Z.1fc3d382b16099a7.576c0a6f5f134312f2eaec19bb60b5a666de1916&text=${element.word}&lang=en-ru`;
    const RESPONSE = await fetch(URL);
    const DATA = await RESPONSE.json();
    element.translate = DATA.text[0];
  }
}

const GAME = new Game();

WORDS.getListOfWords();

function clickWord() {
  const POSITION = [].indexOf.call(CONTAINER.children, event.target.closest('.sound__container-block'));
  WORDS.playAudio(WORDS.collection[POSITION].audio.substring(5));
  IMAGE.src = GIT_URL + WORDS.collection[POSITION].image.substring(5);
  WORDS.translateWord(WORDS.collection[POSITION].word);
}

function getRandomInt(max = 29) {
  return Math.floor(Math.random() * Math.floor(max));
}

function updateWords() {
  INPUT.style.display = 'none';
  TRANSLATE.style.display = 'block';
  CONTAINER.addEventListener('click', clickWord);
  POINTS.innerHTML = '';
  TRANSLATE.innerHTML = '';
  [...CONTAINER.children].forEach((element) => element.classList.remove('active'));
  WORDS.wrongWordArray = WORDS.collection;
  WORDS.correctWordArray = [];
  AUDIO.innerHTML = 'Speak please';
  userScore = 0;
}

function showStats() {
  CONTENT.style.display = 'none';
  RESULTS.style.display = 'flex';
  GAME.drawStats();
}

CONTAINER.addEventListener('click', clickWord);

SELECT.addEventListener('change', () => {
  WORDS.getListOfWords(SELECT.value - 1);
});

RESTART.addEventListener('click', updateWords);

NEW_GAME.addEventListener('click', () => {
  RESULTS.style.display = 'none';
  CONTENT.style.display = 'flex';
  updateWords();
  WORDS.getListOfWords();
});

AUDIO.addEventListener('click', () => {
  CONTAINER.removeEventListener('click', clickWord);
  TRANSLATE.style.display = 'none';
  INPUT.style.display = 'block';
  RECOGNIZER.abort();
  WORDS.wordsRecognizer();
  AUDIO.innerHTML = 'Press again to say a new word';
});

STATS.addEventListener('click', showStats);

document.querySelector('.intro__btn').addEventListener('click', () => {
  INTRO.style.display = 'none';
  CONTENT.style.display = 'flex';
});

BACK.addEventListener('click', () => {
  CONTENT.style.display = 'flex';
  RESULTS.style.display = 'none';
});

WRONG.addEventListener('click', () => {
  const POSITION = [].indexOf.call(WRONG.children, event.target.closest('.wrong-word'));
  WORDS.playAudio(WORDS.wrongWordArray[POSITION].audio.substring(5));
});

CORRECT.addEventListener('click', () => {
  const POSITION = [].indexOf.call(CORRECT.children, event.target.closest('.correct-word'));
  WORDS.playAudio(WORDS.correctWordArray[POSITION].audio.substring(5));
});
