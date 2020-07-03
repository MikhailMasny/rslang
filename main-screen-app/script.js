const apiURL = 'https://afternoon-falls-25894.herokuapp.com/';
let pageNumber = 1; // 1..30, 20 words per page
let userLevel = 1; // 1..6

const ol = document.createElement('ol');
const app = document.querySelector('.app');
const header = document.createElement('div');

const formHTML = `
  <form class="user-controls">
      <label for="user-level"></label>User level:</label>
      <input type="number" name="user-level" min="1" max="6" value="1">
      <label for="words-page"></label>Page of words:</label>
      <input type="number" name="words-page" min="1" max="30" value="1">
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
        li.innerHTML = `${element.textExample} (${element.wordTranslate}) 
        <div class="text-muted">${element.textExampleTranslate}</div>`;
        ol.append(li);
      });
    })
    .then(() => {
      document.querySelectorAll('b').forEach((element) => {
        const el = element;
        const elWidth = el.offsetWidth;
        el.style.display = 'none';
        el.style.color = 'limegreen';
        const parentDiv = el.parentNode;
        const span = document.createElement('input');
        span.style.width = `${elWidth}px`;
        span.classList.add('word-input');
        parentDiv.insertBefore(span, el);
      });
    });
};

getWords(pageNumber, userLevel);

ol.addEventListener('input', (event) => {
  const clickedElement = event.target;
  if (clickedElement.value.length === 0
    || clickedElement.value !== clickedElement.nextSibling.innerText) {
    clickedElement.style.backgroundColor = 'tomato';
  } else {
    clickedElement.parentNode.querySelector('b').style.display = 'inline';
    clickedElement.parentNode.querySelector('input').style.display = 'none';
  }
});

const userControls = document.querySelector('.user-controls');
userControls.addEventListener('input', (event) => {
  ol.innerHTML = '';
  if (event.target.name === 'words-page') pageNumber = event.target.value;
  if (event.target.name === 'user-level') userLevel = event.target.value;
  getWords(pageNumber, userLevel);
});
