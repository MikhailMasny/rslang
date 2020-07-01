const question = document.getElementById('question');
const transcription = document.getElementById('transcription');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const btn = document.querySelector('.btn');
const iconCircle = document.querySelector('.icon-circle');
const finalResult = document.querySelector('.final_result');
const questionCounterText = document.getElementById('questionCounter');
const scoreCounterText = document.getElementById('score');
let questions;
let currentQuestion;
let availableQuestions;
let score = 0;
let questionCounter = 0;
const bonus = 5;

const randomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const fetchWords = () => {
  fetch(`https://afternoon-falls-25894.herokuapp.com/words?page=${randomInteger(0, 19)}&group=${randomInteger(0, 5)}`)
    .then((res) => res.json())
    .then((loadedQuestions) => {
      console.log(loadedQuestions);
      questions = loadedQuestions;
      startGame();
    })
    .catch((err) => {
      console.error(err);
    });
};

const startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
};

const chooseVariant = (e) => {
  const selectedChoice = e.target;
  const selectedAnswer = selectedChoice.innerHTML;
  const rightAnswer = currentQuestion.wordTranslate;

  if (selectedAnswer == rightAnswer) {
    incrementScore(bonus);
    choices.forEach((choice) => {
      choice.classList.add('disable');
      question.innerHTML = currentQuestion.word;
      transcription.innerHTML = currentQuestion.transcription;
      iconCircle.classList.add('changeSize');
      choice.removeEventListener('click', chooseVariant);
    });
    selectedChoice.classList.remove('disable');
    selectedChoice.classList.add('correct');
  } else {
    choices.forEach((choice) => {
      if (choice.innerHTML === rightAnswer) {
        choice.classList.add('correct');
        iconCircle.classList.add('changeSize');
        question.innerHTML = currentQuestion.word;
        transcription.innerHTML = currentQuestion.transcription;
      } else {
        choice.classList.add('disable');
      }
      selectedChoice.classList.add('incorrect');
      selectedChoice.classList.remove('disable');
      choice.removeEventListener('click', chooseVariant);
    });
  }
  btn.innerHTML = 'Next';
  btn.removeEventListener('click', dontKnowAction);
  btn.addEventListener('click', getNewQuestion);
};

const getNewQuestion = () => {
  if (availableQuestions.length === 0) {
    localStorage.setItem('recentScore', score);
    return window.location.assign('../end/end.html');
  }
  questionCounter++;
  questionCounterText.innerText = `${questionCounter}/20`;
  scoreCounterText.innerText = `${score}/100`;
  btn.removeEventListener('click', getNewQuestion);
  btn.addEventListener('click', dontKnowAction);
  btn.innerHTML = 'Не знаю';
  iconCircle.classList.remove('changeSize');
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerHTML = '';
  transcription.innerHTML = '';
  fetchAudio();
  const varArr = [...questions];
  const rightIndexPosition = randomInteger(0, 4);
  console.log(`right answer: ${currentQuestion.wordTranslate}, position: ${rightIndexPosition + 1}`);
  choices.forEach((choice, index) => {
    if (rightIndexPosition === index) {
      const indexToSplice = varArr.findIndex((elem) => elem.wordTranslate === currentQuestion.wordTranslate);
      choice.innerHTML = varArr.splice(indexToSplice, 1)[0].wordTranslate;
    } else {
      let randomPosition = randomInteger(0, varArr.length - 1);
      const rightAnswerPosition = varArr.findIndex((elem) => elem.wordTranslate === currentQuestion.wordTranslate);
      while (randomPosition === rightAnswerPosition) {
        randomPosition = randomInteger(0, varArr.length - 1);
      }
      choice.innerHTML = varArr.splice(randomPosition, 1)[0].wordTranslate;
    }
  });
  availableQuestions.splice(questionIndex, 1);

  choices.forEach((choice) => {
    choice.classList.remove('correct');
    choice.classList.remove('incorrect');
    choice.classList.remove('disable');
    choice.addEventListener('click', chooseVariant);
  });
};

const dontKnowAction = () => {
  const rightAnswer = currentQuestion.wordTranslate;

  choices.forEach((choice) => {
    if (choice.innerHTML == rightAnswer) {
      choice.classList.add('correct');
      question.innerHTML = currentQuestion.word;
      transcription.innerHTML = currentQuestion.transcription;
    } else {
      choice.classList.add('disable');
    }
    choice.removeEventListener('click', chooseVariant);
  });
  iconCircle.classList.add('changeSize');
  btn.innerHTML = 'Next';
  btn.removeEventListener('click', dontKnowAction);
  btn.addEventListener('click', getNewQuestion);
};

const incrementScore = (num) => {
  score += num;
  scoreCounterText.innerText = `${score}/100`;
};
btn.addEventListener('click', dontKnowAction);

const fetchAudio = () => {
  fetch(`https://raw.githubusercontent.com/vonkrolock/rslang-data/master/${currentQuestion.audio}`)
    .then((audioResource) => {
      const audio = new Audio();
      audio.src = audioResource.url;
      audio.play();
    })
    .catch((error) => console.log(error));
};

iconCircle.addEventListener('click', fetchAudio);

fetchWords();
