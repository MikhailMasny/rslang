import './style.css';

const app = document.querySelector('.app');

const showGameLoadScreen = () => {
  document.body.classList.add('loading-screen');

  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');
  app.append(wrapper);

  const gameStartScreen = document.createElement('div');
  gameStartScreen.classList.add('game-start-screen');
  wrapper.append(gameStartScreen);

  const gameTitle = document.createElement('h2');
  gameTitle.classList.add('game-title');
  gameTitle.innerText = 'Sprint';
  gameStartScreen.append(gameTitle);

  const gameDescription = document.createElement('p');
  gameDescription.classList.add('game-description');
  gameDescription.innerText = 'Test your knowledge by answering true or false. You have 60 seconds to do this.';
  gameStartScreen.append(gameDescription);

  const gameStartButton = document.createElement('button');
  gameStartButton.classList.add('button');
  gameStartButton.classList.add('game-start-button');
  gameStartButton.innerText = 'Start';
  gameStartScreen.append(gameStartButton);
};

showGameLoadScreen();

const showGameMainScreen = () => {
  document.body.classList.remove('loading-screen');

  app.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.classList.add('wrapper');
  app.append(wrapper);

  const card = document.createElement('div');
  card.classList.add('card');
  wrapper.append(card);

  const score = document.createElement('div');
  score.classList.add('score');
  card.append(score);

  const question = document.createElement('div');
  question.classList.add('question');
  card.append(question);

  const answer = document.createElement('div');
  answer.classList.add('answer');
  card.append(answer);

  const buttonsContainer = document.createElement('div');
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

  const timer = document.createElement('div');
  timer.classList.add('timer');
  card.append(timer);
};

app.addEventListener('click', (event) => {
  if (event.target.classList.contains('game-start-button')) {
    showGameMainScreen();
  }
});
