const apiURL = 'https://afternoon-falls-25894.herokuapp.com/';
let pageNumber = 1; // 1..30, 20 words per page
let userLevel = 1; // 1..6
const path = 'https://raw.githubusercontent.com/irinainina/rslang-data/master/';

const ol = document.createElement('ol');
const app = document.querySelector('.app');
const header = document.createElement('div');
const audio = new Audio();

const formHTML = `
  <form class="user-controls">
      <label for="user-level"></label>Level:</label>
      <input type="number" onClick="this.select();" name="user-level" type="number" pattern="[0-9]*" inputmode="numeric" min="1" max="6" value="1">
      <label for="words-page"></label>Page:</label>
      <input type="number" onClick="this.select();" name="words-page" type="number" pattern="[0-9]*" inputmode="numeric" min="1" max="30" value="1">
  </form>`;

header.classList.add('header');
header.innerHTML = formHTML;
app.append(header);
app.append(ol);

const getWords = (page, group) => {
  fetch(`${apiURL}words?page=${page - 1}&group=${group - 1}`)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      data.forEach((element) => {
        const li = document.createElement('li');
        // li.dataset.word = element.word;
        li.innerHTML = `<div data-guessed="false" data-word="${element.word}" data-audio="${path + element.audio}">${element.textExample} (${element.wordTranslate})</div>
        <div class="text-muted">${element.textExampleTranslate}</div>
        <div><span class="tip">👁️</span><span class="fav">⭐</span><span class="del">🗑️</span></div>`;
        ol.append(li);
      });
    })
    .then(() => {
      document.querySelectorAll('b').forEach((element) => {
        const el = element;
        const elWidth = el.offsetWidth - 4.5; // width fix
        el.style.display = 'none';
        const parentDiv = el.parentNode;
        const span = document.createElement('input');
        span.style.width = `${elWidth}px`;
        span.classList.add('word-input');
        parentDiv.insertBefore(span, el);
      });
    });
};

getWords(pageNumber, userLevel);

ol.addEventListener('click', (event) => {
  const clickedElement = event.target;
  const parentNode = clickedElement.closest('li').children[0];
  if (clickedElement.classList.contains('tip')) {
    parentNode.querySelector('b').style.color = 'grey';
    parentNode.querySelector('b').style.display = 'inline-block';
    parentNode.querySelector('input').style.display = 'none';
    audio.setAttribute('src', parentNode.dataset.audio);
    audio.play();
  }
  if (clickedElement.classList.contains('del')) {
    clickedElement.closest('li').style.display = 'none';
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
});

ol.addEventListener('input', (event) => {
  const clickedEl = event.target;
  if (clickedEl.value.length === 0
    // || clickedElement.value.toLowerCase() !== clickedElement.nextSibling.innerText
    || clickedEl.value.toLowerCase() !== clickedEl.parentNode.dataset.word.toLowerCase()) {
    clickedEl.style.backgroundColor = 'tomato';
  } else {
    clickedEl.parentNode.dataset.guessed = 'true';
    clickedEl.parentNode.querySelector('b').style.color = 'limegreen';
    clickedEl.parentNode.querySelector('b').style.display = 'inline-block';
    clickedEl.parentNode.querySelector('input').style.display = 'none';
    audio.setAttribute('src', clickedEl.parentNode.dataset.audio);
    audio.play();
  }
});

const userControls = document.querySelector('.user-controls');
userControls.addEventListener('input', (event) => {
  ol.innerHTML = '';
  if (event.target.name === 'words-page') pageNumber = event.target.value;
  if (event.target.name === 'user-level') userLevel = event.target.value;
  getWords(pageNumber, userLevel);
});
