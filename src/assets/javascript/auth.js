import * as constants from './constants';
import '@babel/polyfill';

const BUTTON_SIGN_IN = document.querySelector('.auth__button-signin');
const BUTTON_SIGN_UP = document.querySelector('.auth__button-signup');

const INPUT_EMAIL = document.querySelector('.auth__input-email');
const INPUT_PASSWORD = document.querySelector('.auth__input-password');

async function authRequest(user, url) {
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
          console.log('user with this e-mail exists');
          break;

        case 422:
          console.log('Incorrect e-mail or password');
          break;

        default:
          console.log('Unexpected exception');
          break;
      }
      console.log(response);
      console.log(response.status);
      console.log(response.statusText);
      return;
    }

    const result = await response.json();
    console.log('this is content', result);
  } catch (error) {
    console.log(error);
  }
}

function signin() {
  const user = {
    email: INPUT_EMAIL.value,
    password: INPUT_PASSWORD.value,
  };
  authRequest(user, constants.SIGN_IN);
}

function signup() {
  const user = {
    email: INPUT_EMAIL.value,
    password: INPUT_PASSWORD.value,
  };
  authRequest(user, constants.USER_CREATE);
}

function main() {
  if (BUTTON_SIGN_IN) {
    BUTTON_SIGN_IN.addEventListener('click', signin);
  }
  if (BUTTON_SIGN_UP) {
    BUTTON_SIGN_UP.addEventListener('click', signup);
  }
}

document.addEventListener('DOMContentLoaded', main);
