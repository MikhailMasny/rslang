const apiURL = 'https://afternoon-falls-25894.herokuapp.com/';
let pageNumber = 1; // 1..30, 20 words per page
const userLevel = 1; // 1..6
const path = 'https://raw.githubusercontent.com/splastiq/rslang-data/master/';

const main = document.createElement('div');
const ol = document.createElement('ol');
const app = document.querySelector('.app');
const header = document.createElement('div');
const dictionary = document.createElement('div');
const olWrapper = document.createElement('div');
const settings = document.createElement('div');
const settingsScreen = document.createElement('div');

const audio = new Audio();
let gessedOrShowTip = false;
let mySwiper = null;
let isSwiperInit = false;

let appData = JSON.parse(localStorage.getItem('RSLangAppData'));

let favoriteWords = [];
let deletedWords = [];
let guessedWords = [];
let unknownWords = [];
let userSettings = {
  showPictures: true,
  showTranslation: true,
};

if (localStorage.RSLangAppData) {
  favoriteWords = appData.favoriteWords;
  deletedWords = appData.deletedWords;
  guessedWords = appData.guessedWords;
  unknownWords = appData.unknownWords;
  userSettings = appData.userSettings;
}

const buildSettingsScreen = () => {
  const settingsHTML = `
  <h2>Settings</h2>
  <p class="text-muted">Your own properties for customize user interface</p>
  <form class="user-controls">
      <div class="set-row">
      <label for="user-level"></label>User level</label>
      <input type="number" onClick="this.select();" name="user-level" pattern="[0-9]*" inputmode="numeric" min="1" max="6" value="1">
      <br></div><div class="set-row">
      <label for="cards-per-day"></label>Cards per day</label>
      <input type="number" onClick="this.select();" name="cards-per-day" pattern="[0-9]*" inputmode="numeric" min="1" max="100" value="20">
      <br></div><div class="set-row">
      <label for="new-words-per-day"></label>New words per day</label>
      <input type="number" onClick="this.select();" name="new-words-per-day" pattern="[0-9]*" inputmode="numeric" min="1" max="100" value="10">
      <br></div>
      <fieldset class="properties-fieldset">
      <legend>Cards properties</legend>
      <input class="properties-show-picture" type="checkbox" name="showPicture" checked>
      <label for="showPicture">show pictures</label>
      <br>
      <input type="checkbox" name="show translation" checked>
      <label for="show translation">show translation</label>
      <br>
      <input type="checkbox" name="show transcription">
      <label for="show transcription">show transcription</label>
      <br>
      <input type="checkbox" name="show meaning">
      <label for="show meaning">show meaning</label>
      <br>
      </fieldset>
      <button class="saveSettings">Save</button>
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
      <button class="learn">Learning</button>
      <button class="dictionary-button">Dictionary</button>
      <button class="settings">Settings</button>
  </form>`;

  const sliderArrows = `
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>`;

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
  ol.classList.add('swiper-wrapper');
  olWrapper.append(ol);
  main.append(olWrapper);
  main.append(sliderArrowsWrapper);
};

buildMainScreen();
buildSettingsScreen();

const swiperInit = () => {
  isSwiperInit = true;
  // eslint-disable-next-line no-undef
  mySwiper = new Swiper('.swiper-container', {
    allowTouchMove: false,
    // navigation: {
    //   nextEl: '.swiper-button-next',
    //   prevEl: '.swiper-button-prev',
    // },
  });
};

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
            <div class="card-buttons"><span class="tip">👁️</span><span class="fav">⭐</span><span class="del">🗑️</span></div>
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
        }
      });
      if (!isSwiperInit) swiperInit();
      mySwiper.update();
    });
};

getWords(pageNumber, userLevel);

const saveResults = () => {
  appData = {
    favoriteWords,
    deletedWords,
    guessedWords,
    unknownWords,
    userSettings,
  };
  localStorage.setItem('RSLangAppData', JSON.stringify(appData));
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

const userSettingsScreen = document.querySelector('.user-settings');
userSettingsScreen.addEventListener('input', () => {
  console.log('useer-controls');
  if (!document.querySelector('.properties-show-picture').checked) {
    document.querySelector('.word-image').style.display = 'none';
  } else {
    document.querySelector('.word-image').style.display = 'block';
  }
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

// async function getWordsfromID(wordID) {
//   try {
//     const response = await fetch(`${apiURL}words/${wordID}`);
//     const data = await response.json();
//     return data;
//   } catch (err) {
//     console.log(err);
//   }
// }

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
      <h3>Difficult<span class="difficult-count">${unknownWords.length}</h3>
      <ul>
      </ul>
    </div>
    <div class="deleted">
      <h3>Deleted<span class="deleted-count">${deletedWords.length}</h3>
      <ul>
      </ul>
    </div>
    <div class="favorite">
      <h3>Favorite<span class="favorite-count">${favoriteWords.length}</h3>
      <ul>
      </ul>
    </div>
  </div>`;
  dictionary.innerHTML = dictionaryHTML;
  accordeon();

  // const buttonDelete = document.createElement('div');
  // buttonDelete.classList.add('button-delete');
  // buttonDelete.innerText = '🗑️';

  const learnedUl = document.querySelector('.learned ul');
  guessedWords.forEach((item) => {
    const learnedLi = document.createElement('li');
    learnedLi.classList.add('learned-word');
    learnedLi.dataset.id = item;
    learnedLi.innerText = `${getWordsfromID(item, learnedLi)}`;
    // learnedLi.append(buttonDelete);
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
    // buildSettingsScreen();
    document.querySelector('.swiper-container').style.display = 'none';
    document.querySelector('.slider-arrows-wrapper').style.display = 'none';
    document.querySelector('.settings-screen').style.display = 'block';
    document.querySelector('.dictionary').style.display = 'none';
  }
  if (event.target.classList.contains('dictionary-button')) {
    buildDictionaryScreen();
    document.querySelector('.swiper-container').style.display = 'none';
    document.querySelector('.slider-arrows-wrapper').style.display = 'none';
    document.querySelector('.settings-screen').style.display = 'none';
    document.querySelector('.dictionary').style.display = 'block';
  }
  if (event.target.classList.contains('learn')) {
    buildSettingsScreen();
    document.querySelector('.swiper-container').style.display = 'block';
    document.querySelector('.slider-arrows-wrapper').style.display = 'block';
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

document.querySelector('.slider-arrows-wrapper').addEventListener('click', (event) => {
  mySwiper.on('reachEnd', () => {
    pageNumber += 1;
    getWords(pageNumber, userLevel);
  });
  if (event.target.classList.contains('swiper-button-next') && gessedOrShowTip) {
    mySwiper.slideNext();
  }
  if (event.target.classList.contains('swiper-button-prev')) {
    mySwiper.slidePrev();
  }
  gessedOrShowTip = false;
  document.querySelector('.swiper-button-next').classList.add('swiper-button-disabled');
});

document.querySelector('.swiper-button-next').classList.add('swiper-button-disabled');
