/* eslint-disable func-names */
const MODAL = document.getElementById('myModal');
const BUTTON = document.getElementById('myBtn');
const SPAN = document.getElementsByClassName('close')[0];

function buttonClick() {
  MODAL.style.display = 'block';
}

function spanClick() {
  MODAL.style.display = 'none';
}

BUTTON.addEventListener('click', buttonClick);
SPAN.addEventListener('click', spanClick);

window.onclick = function (event) {
  if (event.target === MODAL) {
    MODAL.style.display = 'none';
  }
};
