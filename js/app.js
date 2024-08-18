"use strict";

import * as elements from "./elements.js";
import state from "./state.js";

const toggleMenu = function () {
  elements.container.classList.toggle("active");
};

const toggleSearch = function () {
  elements.inpSearch.classList.toggle("hidden");
  elements.inpSearch.value = "";

  if (!elements.inpSearch.classList.contains("hidden"))
    elements.inpSearch.focus();
};

const formatTime = function (time) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);

  return `${minutes}:${String(seconds).padStart(2, 0)}`;
};

const handleShuffleBtn = function () {
  state.shuffle = !state.shuffle;

  elements.btnShuffle.classList.toggle("active");
};

const handleCurrFavBtn = function (e) {
  const songID = +elements.infoWrapper.dataset.id;

  checkFavorite(songID);

  e.target.classList.toggle("active");

  updatePlaylist();
  saveToLocalStorage();
};

const updatePlaylist = function (songs = state.songs) {
  elements.containerPlaylist.innerHTML = "";

  const markup = songs
    .map((song, i) => {
      const { id, title, artist, imgSrc, src } = song;
      const songForDuration = new Audio(`../data/${src}`);
      const isFavorite = state.favorites.includes(id);

      songForDuration.addEventListener("loadedmetadata", () => {
        const songDuration = songForDuration.duration;

        state.songs[i].duration = songDuration;
      });

      return `
      <div class="song" data-id="${id}">
      <div class="cover">
          <img src="data/${
            imgSrc ? imgSrc : `default.jpg`
          }" class="img-cover" />
      </div>
      <div class="title">
      <h6>${artist}: ${title}</h6>
      </div>
      <div>
      <i class="fas fa-heart ${isFavorite ? "favorite" : ""} icon-favorite"></i>
      </div>
      </div>
      `;
    })
    .join("");

  elements.containerPlaylist.insertAdjacentHTML("beforeend", markup);
};

const loadSong = function (songId) {
  elements.infoWrapper.innerHTML = "";

  const targetSong = state.songs.find((song) => song.id === songId);

  if (!targetSong) return;

  const { title, artist } = targetSong;

  const element = `
  <h2>${title}</h2>
  <h3>${artist}</h3>
  `;

  state.audio.src = `../data/${targetSong.src}`;

  state.favorites.includes(songId)
    ? elements.currFavorite.classList.add("active")
    : elements.currFavorite.classList.remove("active");

  elements.titleCurrSong.textContent = targetSong.title;
  elements.imgCover.style.backgroundImage = `url(./data/${
    targetSong.imgSrc ? targetSong.imgSrc : `default.jpg`
  })`;
  elements.infoWrapper.dataset.id = targetSong.id;
  elements.infoWrapper.insertAdjacentHTML("afterbegin", element);
};

const pauseMusic = function () {
  state.playing = false;
  state.audio.pause();
  setBtnToPlay();
};

const playMusic = function () {
  state.playing = true;
  state.audio.play();
  setBtnToPause();
};

const playPauseMusic = function () {
  state.playing ? pauseMusic() : playMusic();
};

const setBtnToPause = function () {
  elements.btnPlay.forEach((btn) => (btn.classList = "fas fa-pause btn-play"));
};

const setBtnToPlay = function () {
  elements.btnPlay.forEach((btn) => (btn.classList = "fas fa-play btn-play"));
};

const changeMusic = function (action) {
  const { currentSong } = state;

  if (state.shuffle) {
    shuffleSongs();
    loadSong(state.currentSong);
    playMusic();

    return;
  }

  if (action === "next") {
    currentSong < state.songs.length - 1
      ? state.currentSong++
      : (state.currentSong = 0);
  }

  if (action === "prev") {
    currentSong === 0
      ? (state.currentSong = state.songs.length - 1)
      : state.currentSong--;
  }

  loadSong(state.currentSong);
  playMusic();
  setBtnToPause();
  saveToLocalStorage();
};

const handleClickSong = function (e) {
  const targetEl = e.target.closest(".song");

  if (!targetEl || e.target.closest(".icon-favorite")) return;

  const songID = +targetEl.dataset.id;

  state.currentSong = songID;
  loadSong(songID);
  playMusic();
  toggleMenu();
  setBtnToPause();
  saveToLocalStorage();
};

const checkFavorite = function (songID) {
  !state.favorites.includes(+songID)
    ? state.favorites.push(+songID)
    : state.favorites.splice(state.favorites.indexOf(+songID), 1);

  updatePlaylist();
  saveToLocalStorage();
};

const handleFavoriteBtn = function (e) {
  const targetBtn = e.target.closest(".icon-favorite");

  if (!targetBtn) return;

  const parentSong = targetBtn.closest(".song");
  const songID = +parentSong.dataset.id;

  checkFavorite(songID);
};

const handleRepeatBtn = function () {
  if (!state.repeat) return (state.repeat = 1);

  if (state.repeat === 1) return (state.repeat = 2);

  if (state.repeat === 2) return (state.repeat = 0);

  !state.repeat
    ? elements.btnRepeat.classList.remove("active")
    : elements.btnRepeat.classList.add("active");
};

const shuffleSongs = function () {
  state.currentSong = Math.floor(Math.random() * state.songs.length);
};

const repeatSong = function () {
  switch (state.repeat) {
    case 1:
      loadSong(state.currentSong);
      playMusic();
      break;
    case 2:
      changeMusic("next");
      break;
    default:
      if (state.currentSong === state.songs.length - 1) {
        pauseMusic();
      } else {
        changeMusic("next");
        playMusic();
      }
  }
};

const musicProgress = function () {
  let { duration, currentTime } = state.audio;

  !duration ? (duration = 0) : duration;
  !currentTime ? (currentTime = 0) : currentTime;

  elements.durationTimeEl.textContent = formatTime(duration);
  elements.currTimeEl.textContent = formatTime(currentTime);

  let progressPercentage = (currentTime / duration) * 100;

  elements.progressDot.style.left = `${progressPercentage}%`;
};

const setProgress = function (e) {
  let width = this.clientWidth;
  let clickX = e.offsetX;
  let duration = state.audio.duration;

  state.audio.currentTime = (clickX / width) * duration;
};

const saveToLocalStorage = function () {
  localStorage.clear();

  localStorage.setItem("savedOperation", JSON.stringify(state));
};

const loadLocalStorage = function () {
  const data = localStorage.getItem("savedOperation");

  if (!data) return;

  const { currentSong, favorites } = JSON.parse(data);

  state.favorites = [...favorites];
  state.currentSong = currentSong;
};

const searchSong = function () {
  const query = elements.inpSearch.value;

  const filteredSongs = state.songs.filter((song) =>
    song.artist.toLocaleLowerCase().includes(query)
      ? song
      : song.title.toLowerCase().includes(query)
  );

  updatePlaylist(filteredSongs);
};

const init = function () {
  loadLocalStorage();
  updatePlaylist();
  loadSong(state.currentSong);
};

init();

elements.btnMenu.addEventListener("click", toggleMenu);

elements.btnSearch.addEventListener("click", toggleSearch);

elements.btnPlay.forEach((btn) =>
  btn.addEventListener("click", playPauseMusic)
);

window.addEventListener("keydown", (e) => e.key === " " && playPauseMusic());

elements.btnNext.forEach((btn) =>
  btn.addEventListener("click", () => changeMusic("next"))
);

elements.btnPrev.forEach((btn) =>
  btn.addEventListener("click", () => changeMusic("prev"))
);

elements.containerPlaylist.addEventListener("click", (e) => {
  handleFavoriteBtn(e);

  handleClickSong(e);
});

elements.currFavorite.addEventListener("click", (e) => handleCurrFavBtn(e));

elements.btnShuffle.addEventListener("click", handleShuffleBtn);

elements.btnRepeat.addEventListener("click", handleRepeatBtn);

state.audio.addEventListener("ended", repeatSong);

state.audio.addEventListener("timeupdate", musicProgress);

elements.progressBar.addEventListener("click", setProgress);

elements.inpSearch.addEventListener("change", searchSong);
