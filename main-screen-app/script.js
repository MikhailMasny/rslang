const apiURL = 'https://afternoon-falls-25894.herokuapp.com/';
let pageNumber = 1; // 1..30, 20 words per page
const path = 'https://raw.githubusercontent.com/splastiq/rslang-data/master/';

const main = document.createElement('div');
const ol = document.createElement('ol');
const app = document.querySelector('.app');
const header = document.createElement('div');
const dictionary = document.createElement('div');
const olWrapper = document.createElement('div');
const settings = document.createElement('div');
const settingsScreen = document.createElement('div');
const cardsWrapper = document.createElement('div');
const progressBar = document.createElement('div');

const audio = new Audio();
let gessedOrShowTip = false;
let mySwiper = null;
let isSwiperInit = false;
let cardNumber = 0;

let appData = JSON.parse(localStorage.getItem('RSLangAppData'));

let userLevel = 1; // 1..6
let cardsCount = 10;
let favoriteWords = [];
let deletedWords = [];
let guessedWords = [];
let unknownWords = [];
let showPictures = true;
let showTranslation = true;

if (localStorage.RSLangAppData) {
  favoriteWords = appData.favoriteWords;
  deletedWords = appData.deletedWords;
  guessedWords = appData.guessedWords;
  unknownWords = appData.unknownWords;
  showPictures = appData.showPictures;
  showTranslation = appData.showTranslation;
  userLevel = appData.userLevel;
  cardsCount = appData.cardsCount;
} else {
  userLevel = 1;
  cardsCount = 10;
  showPictures = true;
  showTranslation = true;
}

const buildSettingsScreen = () => {
  const settingsHTML = `
  <h2>Settings</h2>
  <p class="text-muted">Your own properties for customize user interface</p>
  <form class="user-controls">
      <div class="set-row">
      <label for="user-level"></label>User level</label>
      <select class="properties-user-level" name="user-level">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
      </select>
      <!--input class="properties-user-level" type="number" onClick="this.select();" name="user-level" pattern="[0-9]*" inputmode="numeric" min="1" max="6" value="1"-->
      <br></div><div class="set-row">
      <label for="cards-per-day"></label>Cards per day</label>
      <input class="properties-cards-per-day" type="number" onClick="this.select();" name="cards-per-day" pattern="[0-9]*" inputmode="numeric" min="1" max="100" value="20">
      <br></div><!--div class="set-row">
      <label for="new-words-per-day"></label>New words per day</label>
      <input class="properties-words-per-day" type="number" onClick="this.select();" name="new-words-per-day" pattern="[0-9]*" inputmode="numeric" min="1" max="100" value="10">
      <br></div-->
      <fieldset class="properties-fieldset">
      <legend>Cards properties</legend>
      <input class="properties-show-picture" type="checkbox" name="showPicture">
      <label for="showPicture">show pictures</label>
      <br>
      <input class="properties-show-translation" type="checkbox" name="show translation">
      <label for="show translation">show translation</label>
      <!--br>
      <input class="properties-show-transcription" type="checkbox" name="show transcription">
      <label for="show transcription">show transcription</label>
      <br>
      <input class="properties-show-meaning" type="checkbox" name="show meaning">
      <label for="show meaning">show meaning</label>
      <br-->
      </fieldset>
  </form>`;
  settings.classList.add('user-settings');
  settings.innerHTML = settingsHTML;
  settingsScreen.append(settings);
};

const buildMainScreen = () => {
  const formHTML = `
  <form class="menu">
      <!--label for="user-level">Level:</label>
      <input type="number" onClick="this.select();" name="user-level" pattern="[0-9]*" inputmode="numeric" min="1" max="6" value="1">
      <label for="words-page"></label>Page:</label>
      <input type="number" onClick="this.select();" name="words-page" pattern="[0-9]*" inputmode="numeric" min="1" max="30" value="1"-->
      <!--button class="learn">Learning</--button>
      <button class="dictionary-button">Dictionary</button>
      <button class="settings">Settings</button>
  </form>`;

  const sliderArrows = `
    <div class="swiper-button-prev"></div>
    <div class="cards-counter-wrapper"><span class="current-progress-cards">0</span>/<span class="cards-per-day">${cardsCount}</span></div>
    <div class="swiper-button-next"></div>`;

  header.classList.add('header');
  header.innerHTML = '<h1>RS Lang</h1>';
  header.innerHTML += formHTML;
  app.append(header);
  main.classList.add('main');
  app.append(main);
  dictionary.classList.add('dictionary');
  main.append(dictionary);
  settingsScreen.classList.add('settings-screen');
  main.append(settingsScreen);
  olWrapper.classList.add('swiper-container');

  const sliderArrowsWrapper = document.createElement('div');
  sliderArrowsWrapper.classList.add('slider-arrows-wrapper');
  sliderArrowsWrapper.innerHTML = sliderArrows;

  progressBar.style.display = 'none';
  progressBar.classList.add('progress-bar');
  const progressBarIndicator = document.createElement('div');
  progressBarIndicator.classList.add('progress-bar-indicator');
  progressBar.append(progressBarIndicator);
  ol.classList.add('swiper-wrapper');
  olWrapper.append(ol);
  cardsWrapper.classList.add('cards-wrapper');
  cardsWrapper.append(olWrapper);
  cardsWrapper.append(sliderArrowsWrapper);
  cardsWrapper.append(progressBar);
  main.append(cardsWrapper);
};

buildMainScreen();
buildSettingsScreen();

const progressBarChange = (param) => {
  const newWidth = param * (100 / cardsCount);
  document.querySelector('.progress-bar-indicator').style.width = `${newWidth}%`;
};

const swiperInit = () => {
  isSwiperInit = true;
  // eslint-disable-next-line no-undef
  mySwiper = new Swiper('.swiper-container', {
    allowTouchMove: false,
  });
};

const saveResults = () => {
  appData = {
    favoriteWords,
    deletedWords,
    guessedWords,
    unknownWords,
    showPictures,
    showTranslation,
    userLevel,
    cardsCount,
  };
  localStorage.setItem('RSLangAppData', JSON.stringify(appData));
};

const checkUserSettings = () => {
  if (!showPictures) {
    document.querySelector('.word-image').style.display = 'none';
  } else {
    document.querySelector('.word-image').style.display = 'block';
    document.querySelector('.properties-show-picture').checked = true;
  }
  if (!showTranslation) {
    document.querySelector('.text-example-translate').style.display = 'none';
  } else {
    document.querySelector('.text-example-translate').style.display = 'block';
    document.querySelector('.properties-show-translation').checked = true;
  }
  document.querySelector('.properties-user-level').value = userLevel;
  document.querySelector('.properties-cards-per-day').value = cardsCount;
};
// cardsWrapper.style.opacity = '0';
const getWords = (page, group) => {
  fetch(`${apiURL}words?page=${page - 1}&group=${group - 1}`)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((element) => {
        if (!deletedWords.includes(element.id)) {
          const li = document.createElement('li');
          li.classList.add('swiper-slide');
          li.innerHTML = `
          <div class="word-info">
            <div class="word-image"><img src="${path + element.image}"></div>
            <div class="text-example" data-guessed="false" data-audioexample="${path + element.audioExample}" data-wordid="${element.id}" data-word="${element.word}" data-audio="${path + element.audio}">${element.textExample}</div>
            <div class="word-translation">${element.wordTranslate}</div>
            <div class="text-example-translate text-muted">${element.textExampleTranslate}</div>
            <!--div class="text-example-meaning text-muted">${element.textMeaning}</div-->
            <div class="card-buttons">
              <span class="tip">don't know</span><span class="fav">difficult</span><span class="del">delete</span>
            </div>
          </div>`;
          ol.append(li);
        }
      });
    })
    .then(() => {
      document.querySelectorAll('b').forEach((element) => {
        if (!element.classList.contains('isChange')) {
          element.classList.add('isChange');
          const el = element;
          const elWidth = el.offsetWidth - 4.5; // width fix
          el.style.display = 'none';
          const parentDiv = el.parentNode;
          const span = document.createElement('input');
          span.style.width = `${elWidth}px`;
          span.classList.add('word-input');
          parentDiv.insertBefore(span, el);
          cardsWrapper.style.opacity = '1';
        }
      });
      if (!isSwiperInit) swiperInit();

      mySwiper.update();

      if (document.querySelectorAll('.swiper-slide').length < 2) {
        pageNumber += 1;
        getWords(pageNumber, userLevel);
      }

      checkUserSettings();

      progressBarChange(cardNumber);
      progressBar.style.display = 'block';
    });
};
console.log(userLevel);
getWords(pageNumber, userLevel);

const loadNextOPageOfWords = () => {
  mySwiper.on('reachEnd', () => {
    pageNumber += 1;
    getWords(pageNumber, userLevel);
  });
};

ol.addEventListener('click', (event) => {
  const clickedElement = event.target;
  const parentNode = clickedElement.closest('li').children[0];
  const currentWord = parentNode.children[1].dataset.wordid;
  if (clickedElement.classList.contains('tip')) {
    if (!unknownWords.includes(currentWord)) {
      unknownWords.push(currentWord);
    }
    gessedOrShowTip = true;
    document.querySelector('.swiper-button-next').classList.remove('swiper-button-disabled');
    parentNode.querySelector('b').style.color = 'grey';
    parentNode.querySelector('b').style.display = 'inline-block';
    parentNode.querySelector('input').style.display = 'none';
    audio.setAttribute('src', parentNode.children[1].dataset.audio);
    audio.play();
  }
  // if (clickedElement.classList.contains('text-example')) {
  //   console.log(parentNode.children[1].dataset.audioexample);
  //   audio.setAttribute('src', parentNode.children[1].dataset.audioexample);
  //   audio.play();
  // }
  if (clickedElement.classList.contains('fav')) {
    const shure4Favorites = window.confirm('Add to favorites?');
    if (!favoriteWords.includes(currentWord) && shure4Favorites) {
      favoriteWords.push(currentWord);
    }
  }
  if (clickedElement.classList.contains('del')) {
    const shure4Delete = window.confirm('Are you shure for delete word?');
    if (!deletedWords.includes(currentWord) && shure4Delete) {
      deletedWords.push(currentWord);
      clickedElement.closest('li').style.display = 'none';
    }
  }
  if (clickedElement.tagName === 'B' && clickedElement.dataset.guessed === 'false') {
    parentNode.querySelector('b').style.display = 'none';
    parentNode.querySelector('input').style.display = 'inline-block';
    parentNode.querySelector('input').value = '';
    parentNode.querySelector('input').select();
  }
  if (clickedElement.tagName === 'INPUT') {
    parentNode.querySelector('input').select();
  }
  if (clickedElement.classList.contains('tip')
    || clickedElement.classList.contains('fav')
    || clickedElement.classList.contains('del')) {
    saveResults();
  }
});

ol.addEventListener('input', (event) => {
  const clickedEl = event.target;
  const parentNode = clickedEl.closest('li').children[0];
  const currentWord = parentNode.children[1].dataset.wordid;
  if (clickedEl.value.length === 0
    // || clickedElement.value.toLowerCase() !== clickedElement.nextSibling.innerText
    || clickedEl.value.toLowerCase() !== clickedEl.parentNode.dataset.word.toLowerCase()) {
    clickedEl.style.backgroundColor = 'tomato';
    gessedOrShowTip = false;
    document.querySelector('.swiper-button-next').classList.add('swiper-button-disabled');
  } else {
    if (!guessedWords.includes(currentWord)) {
      guessedWords.push(currentWord);
    }
    gessedOrShowTip = true;
    document.querySelector('.swiper-button-next').classList.remove('swiper-button-disabled');
    clickedEl.parentNode.dataset.guessed = 'true';
    clickedEl.parentNode.querySelector('b').style.color = 'limegreen';
    clickedEl.parentNode.querySelector('b').style.display = 'inline-block';
    clickedEl.parentNode.querySelector('input').style.display = 'none';
    audio.setAttribute('src', clickedEl.parentNode.dataset.audio);
    audio.play();
    saveResults();
  }
});

const startNewLearning = () => {
  window.location.reload(false);
};

const userControls = document.querySelector('.user-controls');
userControls.addEventListener('change', (event) => {
  if (!document.querySelector('.properties-show-picture').checked) {
    showPictures = false;
    document.querySelector('.word-image').style.display = 'none';
  } else {
    showPictures = true;
    document.querySelector('.word-image').style.display = 'block';
  }
  if (!document.querySelector('.properties-show-translation').checked) {
    showTranslation = false;
    document.querySelector('.text-example-translate').style.display = 'none';
  } else {
    showTranslation = true;
    document.querySelector('.text-example-translate').style.display = 'block';
  }
  if (event.target.classList.contains('properties-user-level')) {
    userLevel = parseInt(document.querySelector('.properties-user-level').value, 10);
    startNewLearning();
  }
  if (event.target.classList.contains('properties-cards-per-day')) {
    cardsCount = parseInt(document.querySelector('.properties-cards-per-day').value, 10);
    startNewLearning();
  }
  saveResults();
  checkUserSettings();
});

const accordeon = () => {
  const dictionaryGrid = document.querySelector('.dictionary-grid');
  dictionaryGrid.addEventListener('click', (event) => {
    if (event.target.tagName === 'H3') {
      event.target.classList.toggle('active');
      const panel = event.target.nextElementSibling;
      if (panel.style.display === 'block') {
        panel.style.display = 'none';
      } else {
        panel.style.display = 'block';
      }
    }
  });
};

const getWordsfromID = (wordID, trgt) => {
  const target = trgt;
  fetch(`${apiURL}words/${wordID}`)
    .then((response) => response.json())
    .then((data) => {
      target.innerHTML += `${data.word} ${data.transcription} - ${data.wordTranslate} <span class="dict-item-buttons"><!--span class="dict-word-sound">🎵</span--> <span class="dict-word-del">🗑️</span></span>`;
    });
  return '';
};

const buildDictionaryScreen = () => {
  const dictionaryHTML = `
  <div class="dictionary-grid">
    <h2>Dictionary</h2>
    <p class="text-muted">Tip: Click item to remove.<br>
    Learned - words that you guessed right<br>
    Favorite - words that you marked with star<br>
    Difficult - words that you spied<br>
    Deleted - words that you removed, this words won't show again in main app</p>
    <div class="learned">
      <h3>Learned<span class="learned-count">${guessedWords.length}</h3>
      <ul>
      </ul>
    </div>
    <div class="difficult">
      <h3>Don't know<span class="difficult-count">${unknownWords.length}</h3>
      <ul>
      </ul>
    </div>
    <div class="deleted">
      <h3>Deleted<span class="deleted-count">${deletedWords.length}</h3>
      <ul>
      </ul>
    </div>
    <div class="favorite">
      <h3>Difficult<span class="favorite-count">${favoriteWords.length}</h3>
      <ul>
      </ul>
    </div>
  </div>`;
  dictionary.innerHTML = dictionaryHTML;
  accordeon();

  const learnedUl = document.querySelector('.learned ul');
  guessedWords.forEach((item) => {
    const learnedLi = document.createElement('li');
    learnedLi.classList.add('learned-word');
    learnedLi.dataset.id = item;
    learnedLi.innerText = `${getWordsfromID(item, learnedLi)}`;
    learnedUl.append(learnedLi);
  });

  const difficultUl = document.querySelector('.difficult ul');
  unknownWords.forEach((item) => {
    const difficultLi = document.createElement('li');
    difficultLi.classList.add('difficult-word');
    difficultLi.dataset.id = item;
    difficultLi.innerText = `${getWordsfromID(item, difficultLi)}`;
    difficultUl.append(difficultLi);
  });

  const deletedUl = document.querySelector('.deleted ul');
  deletedWords.forEach((item) => {
    const deletedLi = document.createElement('li');
    deletedLi.classList.add('deleted-word');
    deletedLi.dataset.id = item;
    deletedLi.innerText = `${getWordsfromID(item, deletedLi)}`;
    deletedUl.append(deletedLi);
  });

  const favoriteUl = document.querySelector('.favorite ul');
  favoriteWords.forEach((item) => {
    const favoriteLi = document.createElement('li');
    favoriteLi.classList.add('favorite-word');
    favoriteLi.dataset.id = item;
    favoriteLi.innerText = `${getWordsfromID(item, favoriteLi)}`;
    favoriteUl.append(favoriteLi);
  });
};

document.querySelector('.menu').addEventListener('click', (event) => {
  event.preventDefault();
  if (event.target.classList.contains('settings')) {
    document.querySelector('.cards-wrapper').style.display = 'none';
    document.querySelector('.settings-screen').style.display = 'block';
    document.querySelector('.dictionary').style.display = 'none';
  }
  if (event.target.classList.contains('dictionary-button')) {
    buildDictionaryScreen();
    document.querySelector('.cards-wrapper').style.display = 'none';
    document.querySelector('.settings-screen').style.display = 'none';
    document.querySelector('.dictionary').style.display = 'block';
  }
  if (event.target.classList.contains('learn')) {
    document.querySelector('.cards-wrapper').style.display = 'block';
    document.querySelector('.settings-screen').style.display = 'none';
    document.querySelector('.dictionary').style.display = 'none';
  }
});

dictionary.addEventListener('click', (event) => {
  const learnedCount = document.querySelector('.learned-count');
  const difficultCount = document.querySelector('.difficult-count');
  const deletedCount = document.querySelector('.deleted-count');
  const favoriteCount = document.querySelector('.favorite-count');
  const clickedWord = event.target.parentNode.parentNode;
  if (clickedWord.classList.contains('learned-word')) {
    const indexOfWordId = guessedWords.indexOf(clickedWord.dataset.id);
    guessedWords.splice(indexOfWordId, 1);
    clickedWord.style.display = 'none';
    learnedCount.innerText = guessedWords.length;
    saveResults();
  }
  if (clickedWord.classList.contains('difficult-word')) {
    const indexOfWordId = unknownWords.indexOf(clickedWord.dataset.id);
    unknownWords.splice(indexOfWordId, 1);
    clickedWord.style.display = 'none';
    difficultCount.innerText = unknownWords.length;
    saveResults();
  }
  if (clickedWord.classList.contains('deleted-word')) {
    const indexOfWordId = deletedWords.indexOf(clickedWord.dataset.id);
    deletedWords.splice(indexOfWordId, 1);
    clickedWord.style.display = 'none';
    deletedCount.innerText = deletedWords.length;
    saveResults();
  }
  if (clickedWord.classList.contains('favorite-word')) {
    const indexOfWordId = favoriteWords.indexOf(clickedWord.dataset.id);
    favoriteWords.splice(indexOfWordId, 1);
    clickedWord.style.display = 'none';
    favoriteCount.innerText = favoriteWords.length;
    saveResults();
  }
});

const arrowsClicked = (event) => {
  loadNextOPageOfWords();
  if (event.target.classList.contains('swiper-button-next') && gessedOrShowTip) {
    mySwiper.slideNext();
    cardNumber += 1;
    document.querySelector('.current-progress-cards').innerText = cardNumber;
    progressBarChange(cardNumber);
    document.querySelector('.swiper-button-prev').classList.remove('swiper-button-disabled');
  }
  if (event.target.classList.contains('swiper-button-prev')) {
    mySwiper.slidePrev();
  }
  gessedOrShowTip = false;
  document.querySelector('.swiper-button-next').classList.add('swiper-button-disabled');

  if (cardNumber === cardsCount) {
    cardsWrapper.innerHTML = `
    <div class="modal-finish">
      <div>Your daily card limit is over! If you want to train again, do it!</div>
      <div><button class="start-new-game-button">Play again</button></div>
    </div>
    `;
    document.querySelector('.start-new-game-button').addEventListener('click', () => {
      startNewLearning();
    });
  }
};

document.querySelector('.slider-arrows-wrapper').addEventListener('click', (event) => {
  arrowsClicked(event);
});

document.querySelector('.swiper-button-next').classList.add('swiper-button-disabled');
document.querySelector('.swiper-button-prev').classList.add('swiper-button-disabled');

const hamburger = document.querySelector('.hamburger');
const navigation = document.querySelector('.navigation');
const overlay = document.querySelector('.overlay');

let isActive = false;
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('hamburger')) {
    if (!isActive) {
      isActive = true;
      navigation.classList.add('navigation_show');
      hamburger.classList.add('hamburger_active');
      hamburger.innerText = '✕';
      overlay.style.display = 'block';
    } else {
      isActive = false;
      navigation.classList.remove('navigation_show');
      hamburger.classList.remove('hamburger_active');
      hamburger.innerText = 'MENU';
      overlay.style.display = 'none';
    }
  }

  if (isActive && (event.target.classList.contains('menu__item') || event.target.classList.contains('overlay'))) {
    isActive = false;
    navigation.classList.remove('navigation_show');
    hamburger.classList.remove('hamburger_active');
    hamburger.innerText = 'MENU';
    overlay.style.display = 'none';
  }
});

const nav = document.querySelector('nav ul');
const menuItems = document.querySelectorAll('.menu__item');
nav.addEventListener('click', (event) => {
  if (event.target.classList.contains('menu__item')) {
    menuItems.forEach((item) => item.classList.remove('menu__item_active'));
    event.target.classList.add('menu__item_active');
  }
});
