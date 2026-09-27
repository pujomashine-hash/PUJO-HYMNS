document.addEventListener("DOMContentLoaded", () => {

  const favBtn = document.getElementById("fav");
  const favScreen = document.getElementById("favourite");

  let favourites =
    JSON.parse(localStorage.getItem("favourites")) || [];
  // ===============================
  // ADD / REMOVE FAVOURITE
  // ==============================
  if (favBtn) {
    favBtn.addEventListener("click", () => {

      if (!window.currentSong) return;

      const exists = favourites.some(
        song => song.title === currentSong.title
      );

      if (exists) {

        favourites = favourites.filter(
          song => song.title !== currentSong.title
        );

      } else {

        favourites.push({
          id: currentSong.id || null,
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
      renderFavourites();

    });
  }

  // ===============================
  // UPDATE HEART BUTTON
  // ===============================
  function updateFavButton() {

    if (!window.currentSong) return;

    const exists = favourites.some(
      song => song.title === currentSong.title
    );

    favBtn.textContent = exists ? "❤️" : "♡";
  }

  window.updateFavButton = updateFavButton;

  // ===============================
  // RENDER FAVOURITES
  // ===============================
 window.renderFavourites= function renderFavourites() {

    favScreen.innerHTML = "";

    if (favourites.length === 0) {

      favScreen.innerHTML = `
        <h1 class="favmessage">Your favourite Songs</h1>
        <p class="favmessage">No favourite songs yet</p>
      `;

      return;
    }

    favourites.forEach(song => {

      let btn;

      if (song.id) {

        // Online song
        btn = createOnlineSongs(song);

      } else {

        // Offline song
        btn = createSongButton(song);

      }

      favScreen.appendChild(btn);

    });

  }

  // ===============================
  // CLICK EVENTS
  // ===============================
  favScreen.addEventListener("click", (e) => {

    // Share menu isiguse song
    if (
      e.target.closest(".share") ||
      e.target.closest(".three-dots")
    ) {
      return;
    }

    // Online
    const onlineBtn = e.target.closest(".online-btn");

    if (onlineBtn) {

      openOnlineSongs(onlineBtn);

      document.querySelectorAll(".screen")
        .forEach(screen => {
          screen.style.display = "none";
        });

      document.getElementById("song-details").style.display = "block";
      favScreen.style.display = "none";

      lastScreen = "favourite";

      return;
    }

    // Offline
    const offlineBtn = e.target.closest(".nyimbo");

    if (offlineBtn) {

      openOfflineSong(offlineBtn);

      document.querySelectorAll(".screen")
        .forEach(screen => {
          screen.style.display = "none";
        });

      document.getElementById("song-details").style.display = "block";
      favScreen.style.display = "none";

      lastScreen = "favourite";
    }

  });

  // ===============================
  renderFavourites()
  // ===============================

});