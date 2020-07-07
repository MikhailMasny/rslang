const BUTTON = document.querySelector('.link');

BUTTON.addEventListener('click', () => {
  if (localStorage.getItem('user_credentials')) {
    location.href = '/find-a-pair/src/html/index.html';
  } else {
    location.href = '/signin.html';
  }
});
