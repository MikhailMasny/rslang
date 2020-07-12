import * as constants from './constants';

const RESULT_FIND_A_PAIR = document.querySelector('.score__result-find');
const RESULT_SAVANA = document.querySelector('.score__result-savana');
const RESULT_AUDIO_CALL = document.querySelector('.score__result-audio');
const RESULT_SPRINT = document.querySelector('.score__result-sprint');
const RESULT_SPEAK_IT = document.querySelector('.score__result-speak');
const RESULT_MAIN_APP_UNKNOWN = document.querySelector('.score__result-unknown');
const RESULT_MAIN_APP_GUESS = document.querySelector('.score__result-guess');
const RESULT_MAIN_APP_FAVORITE = document.querySelector('.score__result-favorite');
const RESULT_MAIN_APP_DELETE = document.querySelector('.score__result-delete');

function checkAccessToPage() {
  const userCredential = localStorage.getItem('user_credentials');
  if (!userCredential) {
    alert('To interact with this page you must sign in..');
    window.location.replace(constants.HOST_PAGE_INDEX);
  }
}

function setScore(object, storage) {
  const element = object;
  const score = localStorage.getItem(storage);
  if (score) {
    element.innerHTML = score;
  }
}

function setScoreByProperty(object, property) {
  const element = object;
  const score = JSON.parse(localStorage.getItem('RSLangAppData'));
  console.log(score);
  if (score) {
    switch (property) {
      case 'unknown':
        element.innerHTML = score.unknownWords.length;
        break;
      case 'guess':
        element.innerHTML = score.guessedWords.length;
        break;
      case 'favorite':
        element.innerHTML = score.favoriteWords.length;
        break;
      case 'delete':
        console.log(score.deletedWords.length);
        element.innerHTML = score.deletedWords.length;
        break;
      default:
        break;
    }
  }
}

function setAdditionalScore() {
  setScore(RESULT_FIND_A_PAIR, 'findPair_points');
  setScore(RESULT_SAVANA, 'Savana_numberAnswer');
  setScore(RESULT_AUDIO_CALL, 'listenGuessRecentScore');
  setScore(RESULT_SPRINT, 'rsLangGameSprintScore');
  setScore(RESULT_SPEAK_IT, 'speakIt_points');
}

function setMainScore() {
  setScoreByProperty(RESULT_MAIN_APP_UNKNOWN, 'unknown');
  setScoreByProperty(RESULT_MAIN_APP_GUESS, 'guess');
  setScoreByProperty(RESULT_MAIN_APP_FAVORITE, 'favorite');
  setScoreByProperty(RESULT_MAIN_APP_DELETE, 'delete');
}

function main() {
  checkAccessToPage();
  setAdditionalScore();
  setMainScore();
}

document.addEventListener('DOMContentLoaded', main);
