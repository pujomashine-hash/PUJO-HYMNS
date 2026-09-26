document.addEventListener("DOMContentLoaded", () => {
  
  window.initPlaylistScreen = function () {

    const CategoryNames = document.getElementById("Category-names");
    const CategorySongs = document.getElementById("Category-songs");
    const Jina = document.getElementById("Catjina");
    const Exitbtn = document.getElementById("Exit");
    window.categoryScroll = 0;
    
  function buildCategorySongs() {

  if (!window.allSongs || !window.onlineSongs) {
    setTimeout(buildCategorySongs, 200);
    return;
  }

  

  // OFFLINE
  window.allSongs.forEach(song => {

    const btn = createSongButton(song);

    btn.dataset.Category = song.Category;
    btn.style.display = "none";

    CategorySongs.appendChild(btn);

  });

  // ONLINE
  window.onlineSongs.forEach(song => {

    const btn = createOnlineSongs(song);

    btn.dataset.Category = song.Category;
    btn.style.display = "none";

    CategorySongs.appendChild(btn);

  });

  }
buildCategorySongs();

    document.querySelectorAll(".Category").forEach(cat => {

  cat.addEventListener("click", () => {

    const category = cat.id;

    CategorySongs.querySelectorAll(".nyimbo, .online-btn")
      .forEach(btn => {

        btn.style.display =
          btn.dataset.Category === category
            ? "block"
            : "none";

      });

    Jina.textContent = cat.textContent;

    CategoryNames.style.display = "none";
    CategorySongs.style.display = "block";

    document.getElementById("Catjina-Container").style.display = "block";

    window.activeCategory = category;

  });

});
    
    // CATEGORY CLICK
    CategorySongs.addEventListener("click", (e) => {

  if (e.target.closest(".share") || e.target.closest(".three-dots")) {
    return;
  }
window.categoryScroll=CategorySongs.scrollTop;
      
  // ONLINE
  const onlineBtn = e.target.closest(".online-btn");
  if (onlineBtn) {

    openOnlineSongs(onlineBtn);

    document.querySelectorAll(".screen")
      .forEach(s => s.style.display = "none");

    document.getElementById("song-details").style.display = "block";

    lastScreen = "playlist-category";

    return;
  }

  // OFFLINE
  const offlineBtn = e.target.closest(".nyimbo");
  if (offlineBtn) {

    openOfflineSong(offlineBtn);

    document.querySelectorAll(".screen")
      .forEach(s => s.style.display = "none");

    document.getElementById("song-details").style.display = "block";

    lastScreen = "playlist-category";

  }

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