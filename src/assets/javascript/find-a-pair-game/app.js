const BUTTON = document.querySelector('.link');

BUTTON.addEventListener('click', () => {
  if (localStorage.getItem('user_credentials')) {
    window.location.href = '/find-a-pair-game/game.html';
  } else {
    window.location.href = '/signin.html';
  }
});
