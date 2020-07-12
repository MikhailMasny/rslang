import * as constants from './constants';
import '@babel/polyfill';

const BUTTON_SIGN_IN = document.querySelector('.auth__button-signin');
const BUTTON_SIGN_UP = document.querySelector('.auth__button-signup');
const BUTTON_LOGOUT = document.querySelector('.auth__button-logout');
const INPUT_EMAIL = document.querySelector('.auth__input-email');
const INPUT_PASSWORD = document.querySelector('.auth__input-password');

function redirectToIndexPage() {
  window.location.replace(constants.HOST_PAGE_INDEX);
}

function clearInputs() {
  INPUT_EMAIL.value = '';
  INPUT_PASSWORD.value = '';
}

function checkAndSetUserInputs() {
  if (INPUT_EMAIL.value === '' || INPUT_PASSWORD.value === '') {
    alert('Enter data and try again');
    return {
      hasError: true,
      user: {},
    };
  }
  const user = {
    email: INPUT_EMAIL.value,
    password: INPUT_PASSWORD.value,
  };
  return {
    hasError: false,
    user,
  };
}

async function authRequest(user, url) {
  const result = {
    isCompleted: false,
    message: '',
  };
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      switch (response.status) {
        case 417:
          result.message = 'User with this e-mail exists';
          alert(result.message);
          break;

        case 403:
        case 404:
        case 422:
          result.message = 'Incorrect e-mail or password';
          alert(result.message);
          break;

        default:
          result.message = 'Unexpected exception';
          alert(result.message);
          break;
      }
      console.log(response);
      return result;
    }
    result.isCompleted = true;
    result.message = await response.json();
  } catch (error) {
    result.message = error;
    console.log(error);
  }
  return result;
}

async function signin() {
  const data = checkAndSetUserInputs();
  if (!data.hasError) {
    const result = await authRequest(data.user, constants.SIGN_IN);
    if (result && result.isCompleted) {
      localStorage.setItem('user_credentials', JSON.stringify(result.message));
      clearInputs();
      alert('You have successfully logged in');
      redirectToIndexPage();
    }
  }
}

async function signup() {
  const data = checkAndSetUserInputs();
  if (!data.hasError) {
    const result = await authRequest(data.user, constants.USER_CREATE);
    if (result && result.isCompleted) {
      localStorage.setItem('user_data', JSON.stringify(result.message));
      clearInputs();
      alert('You are successfully registered in the system');
      redirectToIndexPage();
    }
  }
}

function logout() {
  localStorage.removeItem('user_data');
  localStorage.removeItem('user_credentials');
  alert('You have successfully logged out');
  redirectToIndexPage();
}

function main() {
  if (BUTTON_SIGN_IN) {
    BUTTON_SIGN_IN.addEventListener('click', signin);
  }
  if (BUTTON_SIGN_UP) {
    BUTTON_SIGN_UP.addEventListener('click', signup);
  }
  if (BUTTON_LOGOUT) {
    BUTTON_LOGOUT.addEventListener('click', logout);
  }
}

document.addEventListener('DOMContentLoaded', main);
