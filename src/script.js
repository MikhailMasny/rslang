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
