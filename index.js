const searchForm = document.querySelector("#search-form");
const searchFormInput = searchForm.querySelector("input"); // <=> document.querySelector("#search-form input");
const info = document.querySelector(".info");

// The speech recognition interface lives on the browser’s window object
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition; // if none exists -> undefined

if (SpeechRecognition) {
  console.log("Your Browser supports speech Recognition");

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  // recognition.lang = "en-US";

  searchForm.insertAdjacentHTML(
    "beforeend",
    '<button type="button"><i class="fas fa-microphone"></i></button>'
  );
  searchFormInput.style.paddingRight = "50px";

  const micBtn = searchForm.querySelector("button");
  const micIcon = micBtn.firstElementChild;

  micBtn.addEventListener("click", micBtnClick);
  function micBtnClick() {
    if (micIcon.classList.contains("fa-microphone")) {
      // Start Voice Recognition
      recognition.start(); // First time you have to allow access to mic!
    } else {
      recognition.stop();
    }
  }

  recognition.addEventListener("start", startSpeechRecognition); // <=> recognition.onstart = function() {...}
  function startSpeechRecognition() {
    micIcon.classList.remove("fa-microphone");
    micIcon.classList.add("fa-microphone-slash");
    searchFormInput.focus();
    console.log("Voice activated, SPEAK");
  }

  recognition.addEventListener("end", endSpeechRecognition); // <=> recognition.onend = function() {...}
  function endSpeechRecognition() {
    micIcon.classList.remove("fa-microphone-slash");
    micIcon.classList.add("fa-microphone");
    searchFormInput.focus();
    console.log("Speech recognition service disconnected");
  }

  recognition.addEventListener("result", resultOfSpeechRecognition); // <=> recognition.onresult = function(event) {...} - Fires when you stop talking
  function resultOfSpeechRecognition(event) {
    const current = event.resultIndex;
    const transcript = event.results[current][0].transcript;

    if (transcript.toLowerCase().trim() === "stop recording") {
      recognition.stop();
    } else if (!searchFormInput.value) {
      searchFormInput.value = transcript;
    } else {
      if (transcript.toLowerCase().trim() === "go") {
        searchForm.submit();
      } else if (transcript.toLowerCase().trim() === "reset input") {
        searchFormInput.value = "";
      } else {
        searchFormInput.value = transcript;
      }
    }
    // searchFormInput.value = transcript;
    // searchFormInput.focus();
    // setTimeout(() => {
    //   searchForm.submit();
    // }, 500);
  }

  info.textContent = 'Voice Commands: "stop recording", "reset input", "go"';
} else {
  console.log("Your Browser does not support speech Recognition");
  info.textContent = "Your Browser does not support Speech Recognition";
}
//controls songs
const song = [
  "bensound-adventure.mp3",
  "bensound-buddy.mp3",
  "bensound-funnysong.mp3",
  "bensound-hey.mp3",
  "bensound-memories.mp3",
  "bensound-pianomoment.mp3",
  "bensound-retrosoul.mp3",
  "bensound-ukulele.mp3",
];

const creatSongList = () => {
  const list = document.createElement("ul");

  for (let i = 0; i < song.length; i++) {
    var item = document.createElement("li");
    item.appendChild(document.createTextNode(song[i]));
    list.appendChild(item);
  }
  return list;
};
document.getElementById("songList").appendChild(creatSongList());
// function addSong() {
//   const listSong = document.createElement("ul");
//   var namesong = document.getElementById("uploadedFile");
//   var list = document.createElement("li");
//   list.setAttribute("id", namesong.value);
//   list.appendChild(document.createTextNode(namesong.value));
//   listSong.appendChild(list);
// }
songList.onclick = (e) => {
  //console.log(e);
  const clickedItem = e.target;
  const source = document.getElementById("source");
  source.src = "songs/" + clickedItem.innerText;
  //console.log(clickedItem.innerText);
  document.getElementById("Currentlyplaying").innerText = "Song playing: ";
  document.getElementById("currentSong").innerText = clickedItem.innerText;
  player.load();
  player.play();
};
const playAudio = () => {
  if (player.readyState) {
    player.play();
  }
};
const pauseAudio = () => {
  player.pause();
};
const slider = document.getElementById("volumeSlider");
slider.oninput = (e) => {
  const volume = e.target.value;
  player.volume = volume;
  //console.log(volume);
};
const updatePro = () => {
  if (player.currentTime > 0) {
    const proBar = document.getElementById("pro");
    proBar.value = (player.currentTime / player.duration) * 100;
  }
};
