import './style.css';

const app = document.querySelector('.app');

const wrapper = document.createElement('div');
wrapper.classList.add('wrapper');
app.append(wrapper);

const timer = document.createElement('div');
const scoreCounter = document.createElement('span');
const question = document.createElement('div');
const answer = document.createElement('div');
const buttonsContainer = document.createElement('div');
const card = document.createElement('div');

const apiURL = 'https://afternoon-falls-25894.herokuapp.com/';
let secondsForGame = 30;
let wordsArray = [];
let shuffleDictionary = [];
let currentWord = '';
const userLearningLevel = 1;
const groupsFromUsersLevel = Math.floor(Math.random() * userLearningLevel);
const dictionary = [];
let wordIsTrue = false;
let rightAnswers = 0;
const randomWordsPage = Math.floor(Math.random() * 20);

const showGameLoadScreen = () => {
  document.body.classList.add('loading-screen');

  const gameStartScreen = document.createElement('div');
  gameStartScreen.classList.add('game-start-screen');
  wrapper.append(gameStartScreen);

  const gameTitle = document.createElement('h2');
  gameTitle.classList.add('game-title');
  gameTitle.innerText = 'Sprint';
  gameStartScreen.append(gameTitle);

  const gameDescription = document.createElement('p');
  gameDescription.classList.add('game-description');
  gameDescription.innerText = 'Test your knowledge by answering true or false. You have 30 seconds to do this.';
  gameStartScreen.append(gameDescription);

  const gameStartButton = document.createElement('button');
  gameStartButton.classList.add('button');
  gameStartButton.classList.add('game-start-button');
  gameStartButton.innerText = 'Start';
  gameStartScreen.append(gameStartButton);
};

showGameLoadScreen();

const showGameMainScreen = () => {
  wrapper.innerHTML = '';

  card.classList.add('card');
  wrapper.append(card);

  const score = document.createElement('div');
  score.classList.add('score');
  score.innerText = 'Score: ';
  scoreCounter.classList.add('score-counter');
  scoreCounter.innerText = 0;
  score.append(scoreCounter);
  card.append(score);

  question.classList.add('question');
  card.append(question);

  answer.classList.add('answer');
  card.append(answer);

  buttonsContainer.classList.add('buttons');
  card.append(buttonsContainer);

  const buttonAgree = document.createElement('button');
  buttonAgree.classList.add('button');
  buttonAgree.classList.add('agree');
  buttonAgree.innerText = 'true';
  buttonsContainer.append(buttonAgree);

  const buttonDisagree = document.createElement('button');
  buttonDisagree.classList.add('button');
  buttonDisagree.classList.add('disagree');
  buttonDisagree.innerText = 'false';
  buttonsContainer.append(buttonDisagree);

  timer.classList.add('timer');
  timer.innerText = secondsForGame;
  card.append(timer);
};

const showGameResults = () => {
  wrapper.innerHTML = '';
  const gameResult = document.createElement('section');
  gameResult.classList.add('game-result');
  const gameResultText = document.createElement('p');

  if (localStorage.rsLangGameSprintScore) {
    const savedScore = localStorage.rsLangGameSprintScore;
    if (savedScore > rightAnswers) {
      gameResultText.innerText = `Sorry. Current score is ${rightAnswers}. You don't bit your last score ${savedScore}`;
    } else {
      gameResultText.innerText = `Congratultions! Your score is ${rightAnswers}. You bit the last saved score!`;
      localStorage.rsLangGameSprintScore = rightAnswers;
    }
  } else {
    localStorage.rsLangGameSprintScore = rightAnswers;
  }
  const resetLink = document.createElement('a');
  resetLink.classList.add('button');
  resetLink.classList.add('game-reset-button');
  resetLink.setAttribute('href', '/src');
  resetLink.innerText = 'Don\'t give up! Try again!';

  gameResult.append(gameResultText);
  gameResult.append(resetLink);
  wrapper.append(gameResult);
};

const timerStart = () => {
  setInterval(() => {
    if (secondsForGame > 0) {
      secondsForGame -= 1;
    } else {
      card.classList.remove('card-true');
      card.classList.remove('card-false');
      showGameResults();
    }
    timer.innerText = secondsForGame;
  }, 1000);
};

const showWord = () => {
  currentWord = shuffleDictionary.pop();
  question.innerText = currentWord.word;
  answer.innerText = currentWord.wordTranslate;
  wordIsTrue = currentWord.truth;
};

const makeDictionary = () => {
  while (wordsArray.length) {
    currentWord = wordsArray.pop();
    const { word } = currentWord;
    const { wordTranslate } = currentWord;
    dictionary.push({ word, wordTranslate, truth: 'true' });
  }

  // make shuffle true/false dictionary array
  const arrayTrue = dictionary.slice(0, Math.floor(dictionary.length / 2));
  let arrayFalse = dictionary.slice(Math.floor(dictionary.length / 2));
  const tempWords = [];
  const tempTranslations = [];
  arrayFalse.forEach((item) => {
    tempWords.push(item.word);
    tempTranslations.push(item.wordTranslate);
  });
  tempTranslations.unshift(tempTranslations.pop());
  arrayFalse = [];
  for (let i = 0; i < 10; i += 1) {
    arrayFalse.push({ word: tempWords[i], wordTranslate: tempTranslations[i], truth: 'false' });
  }
  shuffleDictionary = [...arrayTrue, ...arrayFalse].sort(() => 0.5 - Math.random());

  showWord();
};

const getWords = (page, group) => {
  fetch(`${apiURL}words?page=${page}&group=${group}`)
    .then((response) => response.json())
    .then((data) => {
      wordsArray = data;
      wordsArray.sort(() => 0.5 - Math.random());
      makeDictionary();
    });
};

getWords(randomWordsPage, groupsFromUsersLevel);

app.addEventListener('click', (event) => {
  if (event.target.classList.contains('game-start-button')) {
    showGameMainScreen();
    timerStart();
  }
});

buttonsContainer.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    if (shuffleDictionary.length && secondsForGame > 0) {
      if (event.target.innerText === wordIsTrue.toString()) {
        rightAnswers += 1;
        scoreCounter.innerText = rightAnswers;
      } else {
        console.log('No! It\'s wrong answer!');
      }
      showWord();
    } else {
      console.error('Error: Time is over or no more words!');
      showGameResults();
    }
  }
});

document.addEventListener('mousedown', (event) => {
  if (event.target.classList.contains('button') && shuffleDictionary.length && secondsForGame > 0) {
    if (event.target.innerText === wordIsTrue.toString()) {
      card.classList.add('card-true');
    } else {
      card.classList.add('card-false');
    }
  }
});

document.addEventListener('mouseup', () => {
  card.classList.remove('card-true');
  card.classList.remove('card-false');
});

document.addEventListener('keydown', (event) => {
  if (shuffleDictionary.length && secondsForGame > 0) {
    if (event.code === 'ArrowLeft') {
      document.querySelector('.agree').style.opacity = 0.5;
    }
    if (event.code === 'ArrowRight') {
      document.querySelector('.disagree').style.opacity = 0.5;
    }
    if ((event.code === 'ArrowLeft').toString() === wordIsTrue) {
      card.classList.add('card-true');
    } else {
      card.classList.add('card-false');
    }
  } else {
    showGameResults();
  }
});

document.addEventListener('keyup', (event) => {
  card.classList.remove('card-true');
  card.classList.remove('card-false');
  if (shuffleDictionary.length && secondsForGame > 0) {
    document
      .querySelectorAll('button')
      .forEach((element) => {
        const el = element;
        el.style.opacity = 1;
      });

    if (shuffleDictionary.length && secondsForGame > 0) {
      if ((event.code === 'ArrowLeft').toString() === wordIsTrue) {
        rightAnswers += 1;
        scoreCounter.innerText = rightAnswers;
      } else {
        console.log('No! It\'s wrong answer!');
      }
      showWord();
    } else {
      console.error('Error: Time is over or no more words!');
    }
  }
});
