

document.addEventListener("DOMContentLoaded", () => {
  const sharebtn = document.getElementById("share-app");


const Filesystem = window.Capacitor?.Plugins?.Filesystem;
const searchInput = document.getElementById("search");

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


const navButtons = document.querySelectorAll(".change");
const screens = document.querySelectorAll(".screen");

const songList = document.getElementById("song-list");
const playlistContainer = document.getElementById("playlist-container");
window.activeCategory = null;
window.lastScreen= "song-list";
window.categoryView= "names";
const All = document.getElementById("All");
if(songList)songList.style.display = "block";
//initial update check
function checkUpdate() {
  const currentVersion = "1.0.3";

  fetch("https://raw.githubusercontent.com/pujomashine-hash/PUJO-HYMNS/main/Version.json")
    .then(res => res.json())
    .then(data => {

      if (data.version !== currentVersion) {
        if (confirm("The new version is available do yo want to install it?(Kuna update mpya Unataka kupakua?)")) {
          window.location.href = data.url;
        }
      } 

    })
    .catch(() => {
    });
}
checkUpdate();




// ===== INIT: SHOW PLAYLISTS =====
if (playlistContainer) {
  playlistContainer.style.visibility = "visible";
}

// NAVIGATION 
navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    screens.forEach(screen => screen.style.display = "none");
    const targetId = btn.getAttribute("data-target");
    
    if (targetId === "favourite") {
      document.querySelectorAll(".nyimbo").forEach(btn => {
        btn.style.display = "";
      });
    }
    
    if (targetId === "song-list") {
      searchInput.style.visibility = "visible";
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
    
    lastScreen = targetId;
    
    if (targetId === "playlist-category") {
      document.getElementById(targetId).style.display = "grid";
      searchInput.style.visibility = "hidden";
      
      if (window.initPlaylistScreen) {
        window.initPlaylistScreen();   // ✅ Sasa ipo NDANI, inaitwa kila click
      }

      const Songcontainer = document.getElementById("Category-songs");
      const CategoryNames = document.getElementById("Category-names");

      if (!activeCategory) {
        CategoryNames.style.display = "grid";
        Songcontainer.style.display = "none";
        document.getElementById("Catjina-Container").style.display = "none";
      } else {
        CategoryNames.style.display = "none";
        Songcontainer.style.display = "block";
        document.querySelectorAll("#Category-songs .nyimbo").forEach(btn => {
          btn.style.display = btn.dataset.Category === activeCategory ? "block" : "none";
        });
      }
    } else {
      document.getElementById(targetId).style.display = "block";
      searchInput.style.visibility = "visible";
    }
  });
});

//  LOAD SONGS 
fetch("PUJO HYMNS.json")
  .then(res => res.json())
  .then(data => {
    
    window.allSongs = data;
    
    data.forEach(song => {
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

  songList.appendChild(btn);
});
    // PLAYLIST SYSTEM 
const categoryContainer = document.getElementById("Category-names");
const Songcontainer=document.getElementById("Category-songs")

    //  PLAYLIST CLICK 
    document.querySelectorAll(".playlist").forEach(playlist => {

      playlist.addEventListener("click", () => {
        searchInput.style.visibility="hidden";
        const artist = playlist.querySelector(".playlist-name").textContent.trim().toLowerCase();

        document.querySelectorAll(".playlist").forEach(p => p.classList.remove("active"));
        playlist.classList.add("active");

        document.querySelectorAll(".nyimbo").forEach(btn => {
          const songArtist = btn.querySelector(".artist").textContent.toLowerCase();

    document.getElementById("jina-container").style.display='block';
          if (songArtist === artist) {
            btn.style.display = "";
          } else {
            btn.style.display = "none";
          }
        });

 document.getElementById("jina").textContent=artist;
        if (playlistContainer) {
          playlistContainer.style.display = "none";
        }


        if (All) {
          All.style.display = "block";
        }

      });

    });

    //  ALL BUTTON 
    if (All) {
      All.addEventListener("click", () => {
   document.getElementById("jina-container").style.display="none";     
        document.querySelectorAll(".nyimbo").forEach(btn => {
          btn.style.display = "";
        });

     searchInput.style.visibility="visible";
     playlistContainer.style.display = "block";

        document.querySelectorAll(".playlist").forEach(p => {
          p.classList.remove("active");
        });

        if (playlistContainer) {
          playlistContainer.style.visibility = "visible";
        }

        All.style.display = "none";

      });
    }

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
window.initMediaControls = function (audio, play) {
  const MediaSession = window.Capacitor?.Plugins?.MediaSession;

  if (!MediaSession || window.controlsInitialized) return;

  window.controlsInitialized = true;

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
};
    window.initMediaControls(audio, play);
    
  window.scrollPosition = 0;
   songList.addEventListener("click", async(e) => {
  const btn = e.target.closest(".nyimbo");
  if (!btn) return;
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
});
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

});
    document.querySelectorAll(".three-dots").forEach(dot => {
      dot.addEventListener("click",(e)=>{
        e.stopPropagation();
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





//  MENU 
const menubtn = document.getElementById("menu-btn");
const menucontent = document.getElementById("menu");
const Aboutbtn=document.getElementById("About")
if(Aboutbtn){
Aboutbtn.addEventListener("click",()=>{
  window.location.href="https://pujomashine-hash.github.io/PUJO-HYMNS/About.html"
});
}
if (menubtn) {
  menubtn.addEventListener("click", function() {
    menucontent.style.display =
      menucontent.style.display === "block" ? "none" : "block";
  });
}

  document.addEventListener("click", function(e) {

  if (!menubtn || !menucontent) return;

  if (!menubtn.contains(e.target) && !menucontent.contains(e.target)) {
    menucontent.style.display = "none";
  }

});


    



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



});



});