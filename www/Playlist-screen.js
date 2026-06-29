// NEW (FAVOURITES)
      const Filesystem = window.Capacitor?.Plugins?.Filesystem;
const MediaSession = window.Capacitor?.Plugins?.MediaSession;

const favBtn = document.getElementById("fav");
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];

// ❤️ FAVOURITE TOGGLE
if (favBtn) {
  favBtn.addEventListener("click", () => {
    if (!window.currentSong) return;

    const exists = favourites.some(
      song => song.title === currentSong.title
    );

    if (exists) {
      favourites = favourites.filter(
        s => s.title !== currentSong.title
      );
    } else {
      favourites.push({
  title: currentSong.title,
  artist: currentSong.artist,
  file: currentSong.file,
  lyrics: currentSong.lyrics,
  image: currentSong.image
});
    }

    localStorage.setItem(
      "favourites",
      JSON.stringify(favourites)
    );

    updateFavButton();
    renderFavourites()
    
  });
}

// UPDATE FAV BUTTON
function updateFavButton() {
  if (!window.currentSong) return;

  const exists = favourites.some(
    song => song.title === currentSong.title
  );

  favBtn.textContent = exists ? "❤️" : "♡";
}
// FAVOURITE SCREEN
const favScreen = document.getElementById("favourite");

function renderFavourites() {
  if (!favScreen) return;

  favScreen.innerHTML = "";

  if (favourites.length === 0) {
    favScreen.innerHTML = `
      <h1 class="favmessage">Your favourite Songs</h1>
      <p class="favmessage">No favourite songs yet</p>
    `;
    return;
  }

  favourites.forEach(song => {

    const btn = document.createElement("button");
    btn.className = "nyimbo";

    btn.innerHTML = `
      <div class="left-img">
        <div class="btn-image">
          <img
            src="${song.image ? song.image : 'defaul.jpg'}"
            onerror="this.src='logo.png'">
        </div>

        <div class="text-btn">
          <div class="title">${song.title}</div>
          <div class="artist">${song.artist}</div>
        </div>
      </div>

      <span class="three-dots">⋮
        <div class="dots-menu">
          <button class="share">Share</button>
        </div>
      </span>
    `;
    

    
    btn.addEventListener("click", async () => {

      const songDetails =
        document.getElementById("song-details");

      const lyrics =
        document.getElementById("lyrics");

      const audio =
        document.getElementById("audio");

      const Playing =
        document.getElementById("playing");

      window.initMediaControls(audio, play);

      window.currentSong = song;
      
     Playing.textContent =
        currentSong.title +
        " - " +
        currentSong.artist;

      console.log(currentSong);
      setTimeout(() => {
        MediaSession?.setMetadata({
  title: window.currentSong.title,
  artist: window.currentSong.artist,
  artwork: []
});
       },0);
      

      const fileName =
        song.file.split("/").pop();

      try {

        await Filesystem.stat({
          path: fileName,
          directory: "DATA"
        });

        const result =
          await Filesystem.readFile({
            path: fileName,
            directory: "DATA"
          });

        audio.src =
          "data:audio/mpeg;base64," +
          result.data;

      } catch (e) {

        audio.src = song.file;

      }

      fetch(song.lyrics)
        .then(res => res.text())
        .then(text => {
          lyrics.innerHTML =
            text.replace(/\n/g, "<br>");
        });

      // Ficha screens zote
      document
        .querySelectorAll(".screen")
        .forEach(screen => {
          screen.style.display = "none";
        });

      // Onyesha details
      songDetails.style.display = "block";

      // Ficha favourite page
      favScreen.style.display = "none";

      // Update buttons
      if (typeof updateDownloadBtn === "function") {
        updateDownloadBtn();
      }

      updateFavButton();

      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });

    favScreen.appendChild(btn);
  });
}

// INIT
renderFavourites();
