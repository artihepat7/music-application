const form = document.getElementById("form");
const searchTerm = document.getElementById("search");
const resultContainer = document.getElementById("result");
const moreBtn = document.getElementById("more");

const apiUrl = `https://api.lyrics.ovh`;
async function searchSongs(term) {
  const response = await fetch(`${apiUrl}/suggest/${term}`);
  const data = await response.json();
  ShowOnDom(data);
}

//show songs and artist in dom
function ShowOnDom(data) {
  resultContainer.innerHTML = `
    <ul class='songs'>
${data.data
  .map(
    (item) =>
      `<li>
    <span>
        <strong>${item.title}</strong> - ${item.artist.name}
    </span>
    <button class="btn" data-songTitle='${item.title}' data-songArtist='${item.artist.name}'>Get Lyrics</button>
  </li>`
  )
  .join("")}

    </ul>`;

  if (data.next || data.prev) {
    //console.log(data.next);

    moreBtn.innerHTML = `
    ${
      data.prev
        ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">prev</button>`
        : ""
    }
    ${
      data.next
        ? `<button class="btn" onclick="getMoreSongs('${data.next}')">next</button>`
        : ""
    }`;
  } else {
    moreBtn.innerHTML = ``;
  }
}

//get prev and next songs
async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  ShowOnDom(data);
}

//event listeners
form.addEventListener("submit", () => {
  event.preventDefault();
  const term = searchTerm.value.trim();
  if (term) {
    searchSongs(term);
  } else {
    alert("please type in search term");
  }
});

resultContainer.addEventListener("click", () => {
  const clickedEl = event.target;
  if (clickedEl.tagName === "BUTTON") {
    const songTitle = clickedEl.getAttribute("data-songtitle");
    const songArtist = clickedEl.getAttribute("data-songartist");

    getLyrics(songTitle, songArtist);
  }
});

async function getLyrics(songTitle, songArtist) {
  const res = await fetch(`${apiUrl}/v1/${songArtist}/${songTitle}`);
  const data = await res.json();
  if (data.error) {
    resultContainer.innerHTML = data.error;
  } else {
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
    resultContainer.innerHTML = `
    <h2><strong>${songArtist}</strong> - ${songTitle}</h2>
    <span>${lyrics}</span>`;
  }
  moreBtn.innerHTML = "";
}
