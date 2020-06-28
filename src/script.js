import './style.css';

const statistics = document.querySelector('.nav__page-statistics');
const signin = document.querySelector('.nav__page-signin');
const signup = document.querySelector('.nav__page-signup');
const logout = document.querySelector('.nav__page-logout');

function showNavElements() {
  const userCredential = localStorage.getItem('user_credentials');
  if (userCredential) {
    signin.classList.add('nav__element-hidden');
    signup.classList.add('nav__element-hidden');
    statistics.classList.remove('nav__element-hidden');
    logout.classList.remove('nav__element-hidden');
  }
}

function main() {
  showNavElements();
}

document.addEventListener('DOMContentLoaded', main);
