import './style.css';

const LINK_STATISTIC = document.querySelector('.nav__page-statistics');
const BUTTON_SIGN_IN = document.querySelector('.nav__page-signin');
const BUTTON_SIGN_UP = document.querySelector('.nav__page-signup');
const BUTTON_LOGOUT = document.querySelector('.nav__page-logout');

function showNavElements() {
  const userCredential = localStorage.getItem('user_credentials');
  if (userCredential) {
    BUTTON_SIGN_IN.classList.add('nav__element-hidden');
    BUTTON_SIGN_UP.classList.add('nav__element-hidden');
    LINK_STATISTIC.classList.remove('nav__element-hidden');
    BUTTON_LOGOUT.classList.remove('nav__element-hidden');
  }
}

function main() {
  showNavElements();
}

document.addEventListener('DOMContentLoaded', main);
