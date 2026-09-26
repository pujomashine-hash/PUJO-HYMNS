
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
const songDetails= document.getElementById("song-details");
const audio = document.getElementById("audio");
const play = document.getElementById("play");
const Songcontainer = document.getElementById("Category-songs");
  const CategoryNames = document.getElementById("Category-names");
const screenTop = document.getElementById("screen-top")
const screenTitle= document.getElementById("screen-title")
window.showScreenTop=showScreenTop
window.hideScreenTop=hideScreenTop
  
if (window.playlistInitialized) return;
window.playlistInitialized = true;
  
window.activeCategory = null;
window.lastScreen= "song-list";
window.categoryView= "names";

// ===== INIT: SHOW PLAYLISTS =====
if (playlistContainer) {
  playlistContainer.style.visibility = "visible";
}

  function showScreenTop(title){
    Top.style.display = "none";
    screenTop.style.display = "flex";
    screenTitle.textContent = title;
}

function hideScreenTop(){
    screenTop.style.display = "none";
    Top.style.display = "block";
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
      showScreenTop("favourite")
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
      hideScreenTop()
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
    showScreenTop("Makundi")
    document.getElementById(targetId).style.display = "grid";
    CategoryNames.style.display = "grid";
    Songcontainer.style.display = "none";
    document.getElementById("Catjina-Container").style.display = "none";
}

  
} else {

  document.getElementById(targetId).style.display = "block";
  searchInput.style.visibility = "visible";

    }
})
})
  
   back.addEventListener("click", () => {

    // Simamisha audio
    audio.pause();
    play.textContent = "▶";

    // Ficha screens zote
    screens.forEach(screen => {
        screen.style.display = "none";
    });

    // Ficha player
    songDetails.style.display = "none";

    // Onyesha screen ya mwisho
    const last = document.getElementById(window.lastScreen);
    if (last) last.style.display = "block";

    // Header ya juu
    switch (window.lastScreen) {

        case "song-list":
            hideScreenTop();
            break;

        case "playlist-category":
            showScreenTop("Makundi");

            if (window.categoryView === "names") {
                CategoryNames.style.display = "grid";
                Songcontainer.style.display = "none";
            } else {
                CategoryNames.style.display = "none";
                Songcontainer.style.display = "block";
            }
            break;

        case "favourite":
            showScreenTop("Favourite");
            break;

        case"Artist-screen":
            showScreenTop("The voice of praise")
            break;
        
        default:
            hideScreenTop();
    }

    // Rudisha scroll
    requestAnimationFrame(() => {
        window.scrollTo(0, window.scrollPosition || 0);
    });

}); 
  
});

