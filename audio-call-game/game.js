const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const btn = document.querySelector('.btn');

let currentQuestion, availableQuestions;
let score = 0;
let questionCounter = 0;

let questions = [];

function randomInteger(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

fetch(`https://afternoon-falls-25894.herokuapp.com/words?page=${randomInteger(0, 5)}&group=${randomInteger(0, 19)}`)
.then(res=>{
  return res.json();
})
.then(loadedQuestions => {
  console.log(loadedQuestions)
  questions = loadedQuestions;
  startGame();
})
.catch(err=>{
  console.error(err);
});

const startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
}

const chooseVariant = (e) => {
  const selectedChoice = e.target;
  const selectedAnswer = selectedChoice.innerHTML;
  const rightAnswer = currentQuestion.wordTranslate;

  if (selectedAnswer == rightAnswer) {
    choices.forEach((choice) => {
      choice.classList.add('disable');
      question.innerHTML = currentQuestion.word;
      choice.removeEventListener('click', chooseVariant);
    })
    selectedChoice.classList.remove('disable');
    selectedChoice.classList.add('correct');
  } /*else {
    choices.forEach((choice) => {
      if (choice.dataset['number'] == rightAnswer) {
        choice.classList.add('correct');
      } else {
        choice.classList.add('disable');
      }
      selectedChoice.classList.add('incorrect');
      selectedChoice.classList.remove('disable');
      choice.removeEventListener('click', chooseVariant);
    })
  }*/
  btn.innerHTML = 'Next';
  btn.removeEventListener('click', dontKnowAction);
  btn.addEventListener('click', getNewQuestion);
}

const getNewQuestion = () => {
  if (availableQuestions.length === 0) {
    return window.location.assign('/end.html');
  }
  questionCounter++;

  btn.removeEventListener('click', getNewQuestion);
  btn.addEventListener('click', dontKnowAction);
  btn.innerHTML = 'Не знаю';
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerHTML = "";

 var audio = new Audio();
  audio.src = currentQuestion.audio;
  audio.controls = true;
  audio.autoplay = true;
  document.body.appendChild(audio);

  
  choices.forEach((choice) => {
    console.log(choice)
    //let random = Math.floor(Math.random() * availableQuestions.length);
    choice.innerHTML = currentQuestion.wordTranslate;
    
  });
  availableQuestions.splice(questionIndex, 1);
  
  choices.forEach((choice)=>{
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
    } else {
      choice.classList.add('disable');
    }
    choice.removeEventListener('click', chooseVariant);
  });
  
  btn.innerHTML = 'Next';
  btn.removeEventListener('click', dontKnowAction);
  btn.addEventListener('click', getNewQuestion);
}


btn.addEventListener('click', dontKnowAction);
