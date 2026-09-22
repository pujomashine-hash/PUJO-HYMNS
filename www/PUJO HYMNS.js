
document.addEventListener("DOMContentLoaded", () => {
  const sharebtn = document.getElementById("share-app");

const Filesystem = window.Capacitor?.Plugins?.Filesystem;
const searchInput = document.getElementById("search");
  const myMusicScreen = document.getElementById("my-music-screen");
const myMusicScreenList = document.getElementById("my-music-screen-list");
const seeAllBtn = document.querySelector(".see-all");
    const Top=document.getElementById("top")
const myMusicBack = document.getElementById("back-my-music");
  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");
  const overlay = document.getElementById("overlay");
  const closeBtn = document.getElementById("close-menu");
const searchToggle= document.getElementById("search-toggle")
  const notificationToggle= document.getElementById("notification-toggle")
  const songList = document.getElementById("song-list");
const MymusicList= document.getElementById("My-music-list")
const playlistContainer = document.getElementById("playlist-container");
  window.currentSong = null;

if (sharebtn) {
  sharebtn.addEventListener("click", async () => {
    try {
      await Capacitor.Plugins.Share.share({
        title: 'PUJO HYMNS',
        text: 'Install for free',
        url: 'https://www.mediafire.com/folder/eyz4rcw94hr5l/Updates'
      });
    } catch (e) {
      console.log(e);
    }
  });
}

let controlsInitialized = false;  

window.activeCategory = null;
window.lastScreen= "song-list";
window.categoryView= "names";
const All = document.getElementById("All");
if(songList)songList.style.display = "block";



  
//  LOAD SONGS 
fetch("PUJO HYMNS.json")
  .then(res => res.json())
  .then(data => {
    
    window.allSongs = data;
    
window.createSongButton=    function createSongButton(song){
      const btn = document.createElement("button");
  btn.className = "nyimbo";
  btn.dataset.file = song.file;
  btn.dataset.lyrics = song.lyrics;
  btn.dataset.image = song.image;

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
      <button class="share"> Share </button>
    </div>
  </span>
  `;
return btn;
    }
    
    data.slice(0, 5).forEach(song => {  MymusicList.appendChild(createSongButton(song));
});

   data.forEach(song=>{ 
    myMusicScreenList.appendChild(createSongButton(song));                     
})
    seeAllBtn.addEventListener("click",()=>{
    songList.style.display="none";
    myMusicScreen.style.display="block";
    Top.style.display="none"
    menuBtn.style.display="none"
});
myMusicBack.addEventListener("click",()=>{
  Top.style.display="block";
  songList.style.display="block";
    myMusicScreen.style.display="none";
  menuBtn.style.display="block"
})
    
    



    
    //  SONG CLICK 
    const songDetails = document.getElementById("song-details");
    const lyrics = document.getElementById("lyrics");
    const audio = document.getElementById("audio");
const MediaSession = window.Capacitor?.Plugins?.MediaSession;
    const play = document.getElementById("play");
    const Playing = document.getElementById("playing");
    const back = document.getElementById("back");
    const categories=document.querySelectorAll(".category")
    const favourite=document.getElementById("favourite")
// ===== MEDIA SESSION CONTROLS =====
if (MediaSession && !controlsInitialized) {
  controlsInitialized = true;

  MediaSession.setActionHandler(
    { action: "play" },
    async () => {
      await audio.play();

      play.textContent = "▶";

      MediaSession.setPlaybackState({
        playbackState: "playing"
      });
    }
  );

  MediaSession.setActionHandler(
    { action: "pause" },
    async () => {
      audio.pause();

      play.textContent = "⏯";

      MediaSession.setPlaybackState({
        playbackState: "paused"
      });
    }
  );
} 
  window.scrollPosition = 0;
    myMusicScreenList.addEventListener("click",(e)=>{
      myMusicScreen.style.display="none"
      const btn = e.target.closest(".nyimbo")
    if(!btn)  return
      openSong(btn)
      lastScreen = "my-music-screen"
    }
                                      )
   songList.addEventListener("click", async(e) => {
     const btn = e.target.closest(".nyimbo");
     if(!btn) return
 openSong(btn)
     lastScreen ="song-list"
});
    
window.openSong = async  function openSong(btn){
  
  scrollPosition = window.scrollY

  const fileName = btn.dataset.file.split("/").pop();

  // Angalia kama file ipo kwanza
  try {
    await Filesystem.stat({
      path: fileName,
      directory: "DATA"
    });
    // File ipo — soma kama base64 kisha cheza
    const result = await Filesystem.readFile({
      path: fileName,
      directory: "DATA"
    });
    audio.src = "data:audio/mpeg;base64," + result.data;
  } catch (e) {
    // File haipo — cheza online
    audio.src = btn.dataset.file;
  }

  window.currentSong = {
    title: btn.querySelector(".title").textContent,
    artist: btn.querySelector(".artist").textContent,
    file: btn.dataset.file,
    lyrics: btn.dataset.lyrics,
    image: btn.dataset.image
  };

  MediaSession?.setMetadata({
  title: window.currentSong.title,
  artist: window.currentSong.artist,
  artwork: []
});
     
  Playing.textContent = currentSong.title + " - " + currentSong.artist;
  


  fetch(btn.dataset.lyrics)
    .then(res => res.text())
    .then(text => {
      lyrics.innerHTML = text.replace(/\n/g, "<br>");
    });

  updateDownloadBtn();
  songList.style.display = "none";
  songDetails.style.display = "block";
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  updateFavButton();
 showScreenTop("The voice of praise")
}
        
    play.addEventListener("click", async () => {

  if (audio.paused) {

    await audio.play();

    MediaSession?.setPlaybackState({
      playbackState: "playing"
    });

    play.textContent = "▶";

  } else {

    audio.pause();

    MediaSession?.setPlaybackState({
      playbackState: "paused"
    });

    play.textContent = "⏯";

}
  })

    document.querySelectorAll(".three-dots").forEach(dot => {
      dot.addEventListener("click",(e)=>{
        e.stopPropagation();
      })
    })

    



//MENU
  // Fungua menu
  if (menuBtn && menu && overlay) {
    menuBtn.addEventListener("click", () => {
      menu.classList.add("active");
      overlay.classList.add("active");
    });
  }

  // Funga kwa X
  if (closeBtn && menu && overlay) {
    closeBtn.addEventListener("click", () => {
      menu.classList.remove("active");
      overlay.classList.remove("active");
    });
  }

  // Funga ukibonyeza overlay
  if (overlay && menu) {
    overlay.addEventListener("click", () => {
      menu.classList.remove("active");
      overlay.classList.remove("active");
    });
  }


 //POPUP
    window.openPopup=openPopup
    window.closePopup=closePopup
    const popupOverlay = document.getElementById("popup-overlay")  
const popup = document.getElementById("popup")
const popupHeader= document.getElementById("popup-header")
const popupTitle= document.getElementById("popup-title")
const popupClose = document.getElementById("popup-close")
const popupContent= document.getElementById("popup-content")

function openPopup(title, content ){
  popupTitle.textContent=title;
  popupContent.innerHTML=content;

  popup.classList.add("active")
  popupOverlay.classList.add("active")
}
function closePopup(){
  popup.classList.remove("active")
  popupOverlay.classList.remove("active")
}
if(popupClose && popupOverlay){
popupClose.addEventListener("click",closePopup)
popupOverlay.addEventListener("click",closePopup)
}



setTimeout (()=> {
 const Ad=document.getElementById("ad")
 if(Ad){
 Ad.style.display="none";
 }
},5000);
// HIDE AND SHOW CATEGORIES


if (window.Capacitor) {
  const { App } = Capacitor.Plugins;

  App.addListener('backButton', () => {

    if (lastScreen !== "song-list" || 
        document.getElementById("song-details").style.display === "block" || 
        activeCategory) {

      document.getElementById("back").click();
      return;
    }

    const exit = confirm("Unataka kufunga app?");
    if (exit) {
      App.exitApp();
    }

  });
}


const container = document.getElementById("playlist-container");

let timer;
  if(container){
container.addEventListener("scroll", () => {
  clearTimeout(timer);

  timer = setTimeout(() => {
    const maxScroll = container.scrollWidth - container.clientWidth;

    if (container.scrollLeft >= maxScroll - 2) {
      container.scrollLeft = 0;
    }
  }, 120);
});
}


//
})

})