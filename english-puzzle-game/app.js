// block
const startScreen = document.getElementsByClassName('start-screen')[0];
const gameBlock = document.getElementsByClassName('game-block')[0];

// buttons
const buttonStart = document.getElementById('startButton');
const buttonCheck = document.getElementById('checkButton');
const buttonIDK = document.getElementById('idkButton');
const buttonContinue = document.getElementById('continueButton');

// setting
const level = document.getElementById('changeLevel');
const page = document.getElementById('changePage');

// hint
const hintTitle = document.getElementById('titleHint');
const hintSound = document.getElementById('soundHint');
const hintImage = document.getElementById('imageHint');

// game functionality
const currentSentence = document.getElementById('sentenceCurrent');
const SENTENCE_LIST = [
  'sentenceOne',
  'sentenceTwo',
  'sentenceThree',
  'sentenceFour',
  'sentenceFive',
  'sentenceSix',
  'sentenceSeven',
  'sentenceEight',
  'sentenceNine',
  'sentenceTen',
];
const NUMBER_LIST = [
  'numberOne',
  'numberTwo',
  'numberThree',
  'numberFour',
  'numberFive',
  'numberSix',
  'numberSeven',
  'numberEight',
  'numberNine',
  'numberTen',
];
const PICTURE_TITLE = [
  'Джон Кольер – Леди Годива (1898)',
];
const PICTURE_URL = [
  './assets/images/background.jpg',
];
let sentenceCounter = 0;
let castling = [];
let idkResult = [];
let checkResult = [];

// other
const swithcSound = document.getElementById('soundSwitch');
const list = document.getElementsByClassName('game-block__number');

// nice

hintTitle.addEventListener('click', () => {
  // title Hint
  if (localStorage.getItem('titleHint') === 'on' || localStorage.getItem('titleHint') === null) {
    localStorage.setItem('titleHint', 'off');
    hintTitle.style.backgroundColor = 'rgba(255, 0, 0, 0.75)';
    document.getElementById('test2').classList.add('visibility-hidden');
  } else if (localStorage.getItem('titleHint') === 'off') {
    localStorage.setItem('titleHint', 'on');
    hintTitle.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
    document.getElementById('test2').classList.remove('visibility-hidden');
  }
});

hintSound.addEventListener('click', () => {
  // sound Hint
  if (localStorage.getItem('soundHint') === 'on' || localStorage.getItem('soundHint') === null) {
    localStorage.setItem('soundHint', 'off');
    hintSound.style.backgroundColor = 'rgba(255, 0, 0, 0.75)';
    document.getElementById('test').classList.add('visibility-hidden');
  } else if (localStorage.getItem('soundHint') === 'off') {
    localStorage.setItem('soundHint', 'on');
    hintSound.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
    document.getElementById('test').classList.remove('visibility-hidden');
  }
});

hintImage.addEventListener('click', () => {
  // Image Hint
  if (localStorage.getItem('imageHint') === 'on' || localStorage.getItem('imageHint') === null) {
    localStorage.setItem('imageHint', 'off');
    hintImage.style.backgroundColor = 'rgba(255, 0, 0, 0.75)';
    document.getElementsByClassName('game-block__sentence-list')[0].style.backgroundImage = 'none';
  } else if (localStorage.getItem('imageHint') === 'off') {
    localStorage.setItem('imageHint', 'on');
    hintImage.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
    document.getElementsByClassName('game-block__sentence-list')[0].style.backgroundImage = `url(${PICTURE_URL[0]})`;
  }
});

buttonStart.onclick = () => {
  startScreen.classList.add('display-none');
  gameBlock.classList.remove('display-none');
  localStorage.setItem('startScreenChecker', true);
};

function getLevel() {
  if (localStorage.getItem('gameLevel') === null) {
    localStorage.setItem('gameLevel', '1');
  } else {
    level.value = localStorage.getItem('gameLevel');
  }
}

function getPage() {
  if (localStorage.getItem('gamePage') === null) {
    localStorage.setItem('gamePage', '1');
  } else {
    page.value = localStorage.getItem('gamePage');
  }
}

function clear() {
  currentSentence.innerHTML = '';
}

function onLoad() {
  // start screen
  if (localStorage.getItem('startScreenChecker') === 'true') {
    startScreen.classList.add('display-none');
    gameBlock.classList.remove('display-none');
  }
  // sound
  localStorage.setItem('soundSwitch', 'off');
  if (localStorage.getItem('soundSwitch') === 'on') {
    swithcSound.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
  } else if (localStorage.getItem('soundSwitch') === 'off') {
    swithcSound.style.backgroundColor = 'rgba(255, 0, 0, 0.75)';
  }

  // title hint
  if (localStorage.getItem('titleHint') === 'on') {
    hintTitle.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
    document.getElementById('test2').classList.remove('visibility-hidden');
  } else if (localStorage.getItem('titleHint') === 'off') {
    hintTitle.style.backgroundColor = 'rgba(255, 0, 0, 0.75)';
    document.getElementById('test2').classList.add('visibility-hidden');
  }

  // sound hint
  if (localStorage.getItem('soundHint') === 'on') {
    hintSound.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
    document.getElementById('test').classList.remove('visibility-hidden');
  } else if (localStorage.getItem('soundHint') === 'off') {
    hintSound.style.backgroundColor = 'rgba(255, 0, 0, 0.75)';
    document.getElementById('test').classList.add('visibility-hidden');
  }

  // image hint
  if (localStorage.getItem('imageHint') === 'on' || localStorage.getItem('imageHint') === null) {
    hintImage.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
    document.getElementsByClassName('game-block__sentence-list')[0].style.backgroundImage = `url(${PICTURE_URL[0]})`;
  } else if (localStorage.getItem('imageHint') === 'off') {
    hintImage.style.backgroundColor = 'rgba(255, 0, 0, 0.75)';
    document.getElementsByClassName('game-block__sentence-list')[0].style.backgroundImage = 'none';
  }
}

// working progress

function replacement(elem, width) {
  castling.push(elem);
  castling.push(width);
  elem.style.backgroundColor = 'blue'; // eslint-disable-line no-param-reassign
  if (castling.length === 4) {
    const val1 = castling[0].innerText;
    const val2 = castling[2].innerText;
    const width1 = castling[1];
    const width2 = castling[3];
    castling[0].innerText = val2;
    castling[2].innerText = val1;
    castling[0].style.width = width2;
    castling[2].style.width = width1;
    castling[0].style.backgroundColor = 'rgba(0, 0, 0, 0)';
    castling[2].style.backgroundColor = 'rgba(0, 0, 0, 0)';
    castling = [];
  }
}

async function getNewSentence() {
  let wordList = [];
  const wordsList = await fetch(`https://afternoon-falls-25894.herokuapp.com/words?page=${page.value - 1}&group=${level.value - 1}`);
  const content = await wordsList.json();
  const symbolLength = content[sentenceCounter].textExample.replace('<b>', '').replace('</b>', '').split(' ').join('').length;
  wordList = content[sentenceCounter].textExample.replace('<b>', '').replace('</b>', '').split(' ');
  const result = [
    wordList,
    symbolLength,
    content[sentenceCounter].audioExample,
    content[sentenceCounter].textExampleTranslate,
  ];
  return result;
}

async function playSound() {
  if (sentenceCounter < 10) {
    const file = await getNewSentence();
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = `https://raw.githubusercontent.com/whatever14/rslang-data/master/${file[2]}`;
    audio.play();
    audio.onplay = () => {
      swithcSound.style.backgroundColor = 'green';
    };
    audio.onended = () => {
      swithcSound.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
    };
  }
}

async function getTitleHint() {
  if (sentenceCounter < 10) {
    const file = await getNewSentence();
    document.getElementById('test2').innerText = file[3]; // eslint-disable-line prefer-destructuring
  }
}

swithcSound.addEventListener('click', async () => {
  // sound switch
  if (localStorage.getItem('soundSwitch') === 'on' || localStorage.getItem('soundSwitch') === null) {
    localStorage.setItem('soundSwitch', 'off');
    swithcSound.style.backgroundColor = 'rgba(255, 0, 0, 0.75)';
  } else if (localStorage.getItem('soundSwitch') === 'off') {
    playSound();
    localStorage.setItem('soundSwitch', 'on');
    swithcSound.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
  }
});

function fillCurrentSentence(array) {
  if (sentenceCounter < 10) {
    for (let i = 0; i < array[0].length; i += 1) {
      const word = document.createElement('div');
      word.classList.add('word', 'flex-row');
      word.innerText = `${array[0][i]}`;
      word.style.width = `${(910 / array[1]) * array[0][i].length}px`;
      currentSentence.appendChild(word);
    }
  }
  if (localStorage.getItem('soundSwitch') === 'on') {
    playSound();
  }
  getTitleHint();
}

function getWordEventListener(array) {
  const collectedSentence = [];
  Array.from(document.getElementsByClassName('word')).forEach((element) => {
    element.addEventListener('click', () => {
      const word = document.createElement('div');
      word.classList.remove('word');
      word.classList.add('word-guess', 'flex-row', 'background-none');
      word.innerText = element.innerText;
      word.style.width = `${(910 / array[1]) * element.innerText.length}px`;
      word.addEventListener('click', () => {
        replacement(word, word.style.width);
      });
      if (word.innerText !== '') {
        document.getElementById(SENTENCE_LIST[sentenceCounter]).appendChild(word);
        collectedSentence.push(word.innerText);
      }
      if (collectedSentence.join(' ').length === array[0].join(' ').length) {
        buttonCheck.innerText = 'Check';
      }
      element.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // eslint-disable-line no-param-reassign
      element.innerText = ''; // eslint-disable-line no-param-reassign
      element.removeEventListener('click', null);
      element.classList.add('border-none');
    });
  });
}

function getNewLine() {
  if (sentenceCounter < 10) {
    document.getElementById(SENTENCE_LIST[sentenceCounter]).style.background = 'none';
    document.getElementById(NUMBER_LIST[sentenceCounter]).classList.remove('visibility-hidden');
  } else if (sentenceCounter === 10) {
    buttonCheck.innerText = 'Results';
    buttonIDK.innerText = 'Show picture';
  }
}

async function getCheck() {
  buttonIDK.addEventListener('click', async () => {
    const collectedSentence = [];
    let createdDOM = [];
    if (sentenceCounter < 10) {
      createdDOM = Array.from(document.getElementById(SENTENCE_LIST[sentenceCounter]).children);
    }
    createdDOM.forEach((element) => {
      collectedSentence.push(element.innerText);
    });
    if (buttonIDK.innerText === "I don't know") {
      let testArray = await getNewSentence();
      idkResult.push(testArray[0].join(' '));
      // console.log(`test ///////${idkResult}`);
      document.getElementById(SENTENCE_LIST[sentenceCounter]).innerHTML = '';
      for (let i = 0; i < testArray[0].length; i += 1) {
        const word = document.createElement('div');
        word.classList.remove('word');
        word.classList.add('word-guess', 'flex-row', 'background-none');
        word.innerText = `${testArray[0][i]}`;
        word.style.width = `${(910 / testArray[1]) * testArray[0][i].length}px`;
        document.getElementById(SENTENCE_LIST[sentenceCounter]).appendChild(word);
      }
      for (let j = 0; j < testArray[0].length; j += 1) {
        Array.from(document.getElementById(SENTENCE_LIST[sentenceCounter]).children)[j].style.backgroundColor = 'rgba(0, 0, 0, 0)';
      }
      sentenceCounter += 1;
      testArray = await getNewSentence();
      clear();
      fillCurrentSentence(testArray);
      getWordEventListener(testArray);
      getNewLine();
    } else if (buttonIDK.innerText === 'Show picture') {
      Array.from(document.getElementsByClassName('word-guess')).forEach((element) => {
        element.innerText = ''; // eslint-disable-line no-param-reassign
        element.classList.add('border-none');
      });
      currentSentence.classList.add('title-text');
      currentSentence.innerText = PICTURE_TITLE[0]; // eslint-disable-line prefer-destructuring
      document.getElementById('test').classList.add('visibility-hidden');
      document.getElementById('test2').classList.add('visibility-hidden');
      Array.from(document.getElementsByClassName('game-block__number-list'))[0].classList.add('visibility-hidden');
      buttonIDK.innerText = 'Continue';
      sentenceCounter = 0;
    } else if (buttonIDK.innerText === 'Continue') {
      buttonIDK.innerText = "I don't know";
      localStorage.setItem('gamePage', Number(page.value) + 1);
      currentSentence.classList.remove('title-text');
      currentSentence.innerText = '';
      Array.from(document.getElementsByClassName('game-block__number-list'))[0].classList.remove('visibility-hidden');
      document.getElementById('test').classList.remove('visibility-hidden');
      document.getElementById('test2').classList.remove('visibility-hidden');
      for (let i = 9; i > 0; i -= 1) {
        document.getElementById(SENTENCE_LIST[i]).style.backgroundColor = 'rgba(128, 128, 128, 1)';
        document.getElementById(NUMBER_LIST[i]).classList.add('visibility-hidden');
      }
      sentenceCounter = 0;
      idkResult = [];
      checkResult = [];
      getLevel();
      getPage();
      const testArray = await getNewSentence();
      fillCurrentSentence(testArray);
      getWordEventListener(testArray);
    }
  });

  buttonCheck.addEventListener('click', async () => {
    const collectedSentence = [];
    let createdDOM = [];
    if (sentenceCounter < 10) {
      createdDOM = Array.from(document.getElementById(SENTENCE_LIST[sentenceCounter]).children);
    }
    createdDOM.forEach((element) => {
      collectedSentence.push(element.innerText);
    });
    if (buttonCheck.innerText === 'Check') {
      let testArray = await getNewSentence();
      if (testArray[0].join(' ') === collectedSentence.join(' ')) {
        checkResult.push(testArray[0].join(' '));
        // console.log(`CHECK ///////${checkResult}`);
        for (let j = 0; j < testArray[0].length; j += 1) {
          createdDOM[j].style.backgroundColor = 'rgba(0, 0, 0, 0)';
        }
        sentenceCounter += 1;
        testArray = await getNewSentence();
        clear();
        fillCurrentSentence(testArray);
        getWordEventListener(testArray);
        getNewLine();
      } else if (testArray[0].join(' ') !== collectedSentence.join(' ')) {
        for (let j = 0; j < testArray[0].length; j += 1) {
          if (createdDOM[j].innerText === testArray[0][j]) {
            createdDOM[j].style.backgroundColor = 'green';
          } else {
            createdDOM[j].style.backgroundColor = 'red';
          }
        }
      }
    } else if (buttonCheck.innerText === 'Results') {
      Array.from(document.getElementsByClassName('game-block'))[0].classList.add('display-none');
      Array.from(document.getElementsByClassName('result-block'))[0].classList.remove('display-none');
      Array.from(document.getElementsByClassName('result-block__picture'))[0].style.backgroundImage = `url(${PICTURE_URL[0]})`;
      Array.from(document.getElementsByClassName('result-block__title'))[0].innerText = PICTURE_TITLE[0]; // eslint-disable-line prefer-destructuring
      document.getElementById('idkNumber').innerText = idkResult.length;
      document.getElementById('checkNumber').innerText = checkResult.length;
      for (let i = 0; i < idkResult.length; i += 1) {
        const word = document.createElement('p');
        word.innerText = `${i + 1}) ${idkResult[i]}`;
        word.classList.add('font-size');
        document.getElementById('idkBlock').appendChild(word);
      }
      for (let i = 0; i < checkResult.length; i += 1) {
        const word = document.createElement('p');
        word.innerText = `${i + 1}) ${checkResult[i]}`;
        word.classList.add('font-size');
        document.getElementById('checkBlock').appendChild(word);
      }
      idkResult = [];
      checkResult = [];
    }
  });

  buttonContinue.addEventListener('click', async () => {
    Array.from(document.getElementsByClassName('game-block'))[0].classList.remove('display-none');
    Array.from(document.getElementsByClassName('result-block'))[0].classList.add('display-none');
    buttonIDK.innerText = "I don't know";
    localStorage.setItem('gamePage', Number(page.value) + 1);
    currentSentence.classList.remove('title-text');
    currentSentence.innerText = '';
    Array.from(document.getElementsByClassName('game-block__number-list'))[0].classList.remove('visibility-hidden');
    document.getElementById('test').classList.remove('visibility-hidden');
    document.getElementById('test2').classList.remove('visibility-hidden');
    for (let i = 9; i > 0; i -= 1) {
      document.getElementById(SENTENCE_LIST[i]).style.backgroundColor = 'rgba(128, 128, 128, 1)';
      document.getElementById(NUMBER_LIST[i]).classList.add('visibility-hidden');
      document.getElementById(SENTENCE_LIST[i]).innerHTML = '';
    }
    for (let i = 0; i < 10; i += 1) {
      document.getElementById(SENTENCE_LIST[i]).innerHTML = '';
    }
    document.getElementById('idkBlock').innerHTML = '';
    document.getElementById('checkBlock').innerHTML = '';
    sentenceCounter = 0;
    idkResult = [];
    checkResult = [];
    getLevel();
    getPage();
    const testArray = await getNewSentence();
    fillCurrentSentence(testArray);
    getWordEventListener(testArray);
  });
}

async function getWords() {
  const testArray = await getNewSentence();
  fillCurrentSentence(testArray);
  getWordEventListener(testArray);
  getNewLine();
  getCheck();
}

level.onchange = async () => {
  localStorage.setItem('gameLevel', level.value);
  clear();
  const testArray = await getNewSentence();
  fillCurrentSentence(testArray);
  getWordEventListener(testArray);
  document.getElementById(SENTENCE_LIST[sentenceCounter]).innerHTML = '';
};

page.onchange = async () => {
  localStorage.setItem('gamePage', page.value);
  clear();
  const testArray = await getNewSentence();
  fillCurrentSentence(testArray);
  getWordEventListener(testArray);
  document.getElementById(SENTENCE_LIST[sentenceCounter]).innerHTML = '';
};

window.onload = () => {
  onLoad();
  getLevel();
  getPage();
  getWords();
};

for (let i = 9; i > 5; i -= 1) {
  list[i].classList.add('visibility-hidden');
}

document.getElementById('test').onclick = () => {
  if (localStorage.getItem('soundSwitch') === 'on') {
    playSound();
  }
};
