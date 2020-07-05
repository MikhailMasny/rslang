/*eslint-disable */
const savana_screensaver__exitButton = document.getElementById('savana_screensaver__exitButton');
const savana_screensaverBanner = document.getElementById('savana_screensaverBanner');
const exitButton = document.getElementById('exitButton');
const savana_screensaver = document.getElementById('savana_screensaver');
const savana_screensaverBanner__closeButton = document.getElementById('savana_screensaverBanner__closeButton');
const savana_screensaver__buttonStart = document.getElementById('savana_screensaver__buttonStart');
const savana_screensaver__mainText = document.getElementById('savana_screensaver__mainText');
const savana_screensaverWrapper = document.getElementById('savana_screensaverWrapper');
const spinner_img = document.getElementById('spinner_img');
const spinner_number = document.getElementById('spinner_number');
const savana_gameBlock = document.getElementById('savana_gameBlock');
const settings_volume = document.getElementById('settings_volume');
const Word_0 = document.getElementById('Word_0');
const Word_1 = document.getElementById('Word_1');
const Word_2 = document.getElementById('Word_2');
const Word_3 = document.getElementById('Word_3');
const savana_gameBlock__staticWords = document.getElementById('savana_gameBlock__staticWords');
const savana_gameBlock__dynamicWords = document.getElementById('savana_gameBlock__dynamicWords');
const savana_gameBlock__settingsAndLife__Life = document.getElementById('savana_gameBlock__settingsAndLife__Life');

let numberPage = 0;
localStorage.setItem('trueAnswer', 0);
let answer= 0;
let numberWord = 0;
let numberWordBad = 0;
let bgNumber = 100;
let levelGame = 0;
let gameData = {};
let  numberAnswer = 5;
localStorage.setItem('numberAnswer', numberAnswer)
let  mySoundStart = new Audio(["/src/audio/start.mp3"]);
let  falseAnswer = new Audio(["/src/audio/falseAnswer.mp3"]);
let  gameOver = new Audio(["/src/audio/gameOver.mp3"]);
let  finalGame = new Audio(["/src/audio/finGame.mp3"]);
function reversNumber(num) {
  setTimeout(() => num.innerHTML = '3', 700);
  setTimeout(() => num.innerHTML = '2', 1500);
  setTimeout(() => num.innerHTML = '1', 2200);
  setTimeout(closeSpinner, 2800);
}

function closeSpinner() {
  spinner_img.style.display = 'none';
  savana_gameBlock.style.display = 'flex'
}

savana_screensaver__exitButton.addEventListener('click', (event) => {
  savana_screensaverBanner.style.display = 'flex';
  document.body.style.backgroundColor = 'black';
  savana_screensaver.style.opacity = '0.3';
})
exitButton.addEventListener('click', (event) => {
  savana_screensaverBanner.style.display = 'none';
  document.body.style.backgroundColor = 'white';
  savana_screensaver.style.opacity = '1';
})

window.addEventListener('click', (event) => {
  if (event.target.id === 'savana_screensaver' ) {
    savana_screensaverBanner.style.display = 'none';
    document.body.style.backgroundColor = 'white';
    savana_screensaver.style.opacity = '1';
  }
})
savana_screensaverBanner__closeButton.addEventListener('click', (event) => {
    savana_screensaverBanner.style.display = 'none';
    document.body.style.backgroundColor = 'white';
    savana_screensaver.style.opacity = '1';
})

settings_volume.addEventListener('click', (event) => {
  if (localStorage.getItem('volume') == 1) {
    settings_volume.src = '/src/assets/images/volume_on.png'
    localStorage.setItem('volume', 0);
    falseAnswer.muted = false;
    gameOver.muted = false;
    finalGame.muted = false;
  } else {
    settings_volume.src = '/src/assets/images/volume_off.png'
    localStorage.setItem('volume', 1);
    falseAnswer.muted = true;
    gameOver.muted = false;
    finalGame.muted = false;
  }
})

  function apiWorlds(numberPage,levelGame,gameData,numberWord, numberAnswer,answer) {
  const url = `https://afternoon-falls-25894.herokuapp.com/words?group=${levelGame}&page=${numberPage}`;
  fetch(url)
      .then(res => res.json())
      .then(data => {
      let gameData = data;
        changeWords(gameData,numberWord);
        checkWords(gameData,numberWordBad,numberPage,levelGame,localStorage.getItem('numberAnswer'),answer);
        localStorage.setItem('level',levelGame );
        savana_screensaver__buttonStart.addEventListener('click', (event) => {
        savana_screensaverWrapper.style.display ='none';
        spinner_img.style.display = 'block';
        reversNumber(spinner_number);
        setTimeout(() =>  animations(numberPage,levelGame,gameData,numberWord,localStorage.getItem('numberAnswer'),numberWordBad,answer) , 3000);
        mySoundStart.play()
      })
      })
      .catch(err => {if (err) {
        console.log('error',err)
      }})
}
function checkWords(gameData,numberWord,numberPage,levelGame,numberAnswer,answer) {

  savana_gameBlock__staticWords.addEventListener('mouseup', (event) => {
    answer++
    if (event.target.id != 'savana_gameBlock__staticWords') {
      if (localStorage.getItem('word')  === event.target.innerHTML ) {
        localStorage.setItem('trueAnswer',answer);
        bgNumber = bgNumber+ 10;
        numberWord = numberWord +4;
        if (numberWord === 16 ) {
          numberWord = 0;
          levelGame++;
          numberPage = 0;
          apiWorlds(numberPage,levelGame,gameData,numberWord,localStorage.getItem('numberAnswer'),answer);
        } else {
          changeWords(gameData,numberWord);
        }
        if (bgNumber === 540) {
        bgNumber=535;
        finGame(true)
        }
        wordTrue('100vw',`${bgNumber}vh`,gameData);
      } else {
        numberAnswer = numberAnswer-1;
        localStorage.setItem('numberAnswer',numberAnswer)
        badAnswer(numberAnswer)
        if (numberAnswer == 0) {
          finGame(false)
        }
      }

    }

  })
}

function animations(numberPage,levelGame,gameData,numberWord,numberAnswer,numberWordBad,answer) {
  let start = Date.now();
  let timer = setInterval(function() {
    let timePassed = Date.now() - start;
    savana_gameBlock__dynamicWords.style.transform = `translate(0px, ${timePassed / 10 + '%'})`
    if (timePassed > 3000 || savana_gameBlock__dynamicWords.innerHTML === `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|`) clearInterval(timer) & finanim(numberPage,levelGame,gameData,numberWord,numberAnswer,numberWordBad,answer) ;
    function finanim() {
      if (savana_gameBlock__dynamicWords.style.transform  > 'translate(0px, 300%)') {
        setTimeout(() =>  animations(numberPage,levelGame,gameData,numberWord,numberAnswer,numberWordBad,answer) , 1000);
        const locBadAns = localStorage.setItem('numberAnswer',Number(localStorage.getItem('numberAnswer'))-1);
        badAnswer(localStorage.getItem('numberAnswer'))
        if (Number(localStorage.getItem('numberAnswer')) == 0) {
          finGame(false)
        }
      }
    }
  },
  );
}
function badAnswer(numberAnswer) {
  savana_gameBlock__settingsAndLife__Life.children[numberAnswer].src = '/src/assets/images/heart_0.png';
  falseAnswer.play()
}

function wordTrue(up,bg,gameData) {
  savana_gameBlock__dynamicWords.innerHTML= `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|`;
  setTimeout(() => savana_gameBlock__dynamicWords.style.transform = `translate(0px, ${up})` , 100);
  setTimeout(() => savana_gameBlock__dynamicWords.style.display = 'none' , 1000);
  setTimeout(() => savana_gameBlock__dynamicWords.style.transform = 'translate(0px, 0vw)', 2000);
  setTimeout(() => savana_gameBlock__dynamicWords.style.display = 'flex' , 2000);
  savana_screensaver.style.backgroundPositionY = `${bg}`;
  setTimeout(() => animations(numberPage,levelGame,gameData,numberWord,numberAnswer,numberWordBad,answer) , 2000);
}

function changeWords(gameD,numberWordBad) {
  setTimeout(() => Word_0.innerHTML = gameD[numberWordBad].word, 500);
  setTimeout(() => Word_1.innerHTML = gameD[numberWordBad+1].word, 500);
  setTimeout(() => Word_2.innerHTML = gameD[numberWordBad+2].word, 500);
  setTimeout(() => Word_3.innerHTML = gameD[numberWordBad+3].word, 500);
  setTimeout(() => randomInteger(numberWordBad,numberWordBad +3,gameD), 600);

}

function randomInteger(min, max,gameData) {
  let rand = min + Math.random() * (max + 1 - min);
  Math.floor(rand);
  savana_gameBlock__dynamicWords.innerHTML = gameData[Math.floor(rand)].wordTranslate;
  localStorage.setItem('word', gameData[Math.floor(rand)].word);
}

function finGame(info) {
  if ( info === true) {
    savana_gameBlock.style.display = 'none';
    let imgFin = document.createElement('img');
    imgFin.className = "imgFin";
    savana_screensaver.append(imgFin);
    imgFin.src = '/src/assets/images/win.png'
    finalGame.play()
    setTimeout(() => location.href=location.href , 2000);

  } else {
    savana_gameBlock.style.display = 'none';
    let imgFin = document.createElement('img');
    imgFin.className = "imgFin";
    savana_screensaver.append(imgFin);
    imgFin.src = '/src/assets/images/game_over.png'
    gameOver.play()
    setTimeout(() => location.href=location.href , 2000);

  }

}

apiWorlds(numberPage,levelGame,gameData,numberWord,numberAnswer,numberWordBad,answer);
