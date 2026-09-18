
document.addEventListener("DOMContentLoaded",()=>{
const navButtons = document.querySelectorAll(".change");
const screens = document.querySelectorAll(".screen");

const songList = document.getElementById("song-list");
const MymusicList= document.getElementById("My-music-list")
const playlistContainer = document.getElementById("playlist-container");
const Top = document.getElementById("top");
const myMusicScreen = document.getElementById("my-music-screen");
const menuBtn = document.getElementById("menu-btn");
const searchInput = document.getElementById("search");
  const back = document.getElementById("back");
const songDetails = document.getElementById("song-details");
const audio = document.getElementById("audio");
const play = document.getElementById("play");
const Songcontainer = document.getElementById("Category-songs");
  const CategoryNames = document.getElementById("Category-names");

  
if (window.playlistInitialized) return;
window.playlistInitialized = true;
  
window.activeCategory = null;
window.lastScreen= "song-list";
window.categoryView= "names";

// ===== INIT: SHOW PLAYLISTS =====
if (playlistContainer) {
  playlistContainer.style.visibility = "visible";
}

// NAVIGATION 
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    screens.forEach(screen => screen.style.display = "none")
    window.scrollPosition = 0;
    const targetId = btn.getAttribute("data-target");
    Top.style.display = "block";
    
    if (targetId === "favourite") {
      Top.style.display="block"
      window.searchToggle.style.visibility="hidden"
      menuBtn.style.display="block"
 window.notificationToggle.style.visibility="visible"
      document.querySelectorAll(".nyimbo").forEach(btn => {
        btn.style.display = "";
      });
    }
    
    if (targetId === "song-list") {
      songList.style.display="block"
      myMusicScreen.style.display="none"
      Top.style.display="block"
      menuBtn.style.display="block"
      window.searchToggle.style.visibility="visible"
 window.notificationToggle.style.visibility="visible"
      document.querySelectorAll(".nyimbo").forEach(btn => {
        btn.style.display = "";
      });
      if (playlistContainer) {
        playlistContainer.style.display = "block";
      }
      document.querySelectorAll(".playlist").forEach(p => {
        p.classList.remove("active");
      });
      document.getElementById("jina-container").style.display = "none";
    }
    
    window.lastScreen = targetId;
    
    if (targetId === "playlist-category") {

  document.getElementById(targetId).style.display = "grid";
  Top.style.display = "block";
  window.searchToggle.style.visibility="hidden"
 window.notificationToggle.style.visibility="visible"
      
if (window.initPlaylistScreen) {
    window.initPlaylistScreen();
} 

document.querySelectorAll("#Category-songs .nyimbo").forEach(btn => {
  console.log(btn.dataset.category);

  btn.style.display =
    btn.dataset.category === window.activeCategory
      ? "block"
      : "none";
});

if (targetId === "playlist-category") {

    // Kila uki-click Makundi, anza upya
    window.activeCategory = null;
    window.categoryView = "names";

    document.getElementById(targetId).style.display = "grid";
    CategoryNames.style.display = "grid";
    Songcontainer.style.display = "none";
    document.getElementById("Catjina-Container").style.display = "none";

    window.searchToggle.style.visibility = "hidden";
    window.notificationToggle.style.visibility = "visible";

}

  
} else {

  document.getElementById(targetId).style.display = "block";
  searchInput.style.visibility = "visible";

    }
})
})

// BACK
    back.addEventListener("click", () => {

  screens.forEach(screen => screen.style.display = "none");

  const last = document.getElementById(lastScreen);
  last.style.display = "block";

  songDetails.style.display = "none";

  if (categoryView === "names") {
    categoryContainer.style.display = "grid";   // categories
    Songcontainer.style.display = "none";
  } else {
    categoryContainer.style.display = "none";
    Songcontainer.style.display = "block";      // songs
  }

  requestAnimationFrame(()=> {
    window.scrollTo(0, scrollPosition);
  });

  audio.pause();
  play.textContent = "▶";
});
  
})