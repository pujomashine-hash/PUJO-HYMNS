document.addEventListener("DOMContentLoaded", () => {
  
  window.initPlaylistScreen = function () {

    const CategoryNames = document.getElementById("Category-names");
    const CategorySongs = document.getElementById("Category-songs");
    const Jina = document.getElementById("Catjina");
    const Exitbtn = document.getElementById("Exit");
    
    function buildCategorySongs() {
  if (CategorySongs.querySelector(".nyimbo")) return; // tayari zipo
  if (!window.allSongs) {
    setTimeout(buildCategorySongs, 200); // jaribu tena baada ya 200ms
    return;
  }

  window.allSongs.forEach(song => {
    const btn = document.createElement("button");
    btn.className = "nyimbo";
    btn.dataset.file = song.file;
    btn.dataset.lyrics = song.lyrics;
    btn.dataset.Category = song.Category;
    btn.dataset.image = song.image;

    btn.innerHTML = `
      <div class="left-img">
        <div class="btn-image">
          <img src="${song.image ? song.image : 'defaul.jpg'}" onerror="this.src='logo.png'">
        </div>
        <div class="text-btn">
          <div class="title">${song.title}</div>
          <div class="artist">${song.artist}</div>
        </div>
      </div>
      <span class="three-dots">⋮
        <div class="dots-menu">
          <button class="share"> Share </button>
        </div>
      </span>
    `;

    btn.style.display = "none";
    btn.addEventListener("click", async () => {
  const songDetails = document.getElementById("song-details");
  const lyrics = document.getElementById("lyrics");
  const audio = document.getElementById("audio");
  const Playing = document.getElementById("playing");
  const Filesystem = window.Capacitor?.Plugins?.Filesystem;

  window.currentSong = {
    title: song.title,
    artist: song.artist,
    file: song.file,
    lyrics: song.lyrics,
    image: song.image
  };

      
  const fileName = song.file.split("/").pop();

  try {
    await Filesystem.stat({ path: fileName, directory: "DATA" });
    const result = await Filesystem.readFile({ path: fileName, directory: "DATA" });
    audio.src = "data:audio/mpeg;base64," + result.data;
  } catch (e) {
    audio.src = song.file;
  }

      
  Playing.textContent = window.currentSong.title + " - " + window.currentSong.artist;

      setTimeout(() => {
        MediaSession?.setMetadata({
  title: window.currentSong.title,
  artist: window.currentSong.artist,
  artwork: []
});
 },0);

      
  fetch(song.lyrics)
    .then(res => res.text())
    .then(text => {
      lyrics.innerHTML = text.replace(/\n/g, "<br>");
    });

  if (window.updateDownloadBtn) window.updateDownloadBtn();
  if (window.updateFavButton) window.updateFavButton();

  document.querySelectorAll(".screen").forEach(s => s.style.display = "none");
  songDetails.style.display = "block";
});
    CategorySongs.appendChild(btn);
  });
}

buildCategorySongs();

    
    // CATEGORY CLICK
    document.querySelectorAll(".Category").forEach(Cat => {
      Cat.addEventListener("click", () => {
        const Category = Cat.id;
        window.activeCategory = Category;

        document.querySelectorAll("#Category-songs .nyimbo").forEach(btn => {
          btn.style.display = btn.dataset.Category === Category ? "block" : "none";
        });

        Jina.textContent = Cat.textContent;
        CategorySongs.style.display = "block";
        window.categoryView = "songs";
        CategoryNames.style.display = "none";
        document.getElementById("Catjina-Container").style.display = "block";
      });
    });

    // EXIT BUTTON
    if (Exitbtn) {
      Exitbtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();

        window.activeCategory = null;
        window.categoryView = "names";

        CategoryNames.style.display = "grid";
        CategorySongs.style.display = "none";
        document.getElementById("Catjina-Container").style.display = "none";
      });
    }

  };
  

});