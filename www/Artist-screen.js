document.addEventListener("DOMContentLoaded",()=>{
const categoryContainer = document.getElementById("Category-names");
const Songcontainer=document.getElementById("Category-songs")
const songList = document.getElementById("song-list");
const playlistContainer = document.getElementById("playlist-container");
const searchInput = document.getElementById("search");
const All = document.getElementById("All");
  const jinaContainer=document.getElementById("jina-container")

    //  PLAYLIST CLICK 
    const artistScreen = document.getElementById("Artist-screen");
const artistList = document.getElementById("Artist-screen-list");

   
  
document.querySelectorAll(".playlist").forEach(playlist => {
  playlist.addEventListener("click", () => {

    const artist = playlist.querySelector(".playlist-name")
      .textContent.trim().toLowerCase();
     
    // Fungua screen mpya
    showScreenTop(artist)
    songList.style.display = "none";
    artistScreen.style.display = "block";
    jinaContainer.style.display="block"
    All.style.display="block"
    lastScreen="Artist-screen"

    // Weka jina
    document.getElementById("jina").textContent = artist;

    // Safisha list
    artistList.innerHTML = "";

    // Filter songs
    const songs = window.allSongs.filter(song =>
      song.artist.toLowerCase() === artist
    );

    // Onyesha songs
    songs.forEach(song => {
      artistList.appendChild(createSongButton(song));
    });

  });
});

  //CLICK
artistList.addEventListener("click",(e)=>{
  artistScreen.style.display="none"
  const btn = e.target.closest(".nyimbo")
    if(!btn)  return
     window.openSong(btn)
  lastScreen="Artist-screen"
})
  
//  ALL BUTTON 
    if (All) {
      All.addEventListener("click", () => {
   jinaContainer.style.display="none";     
        document.querySelectorAll(".nyimbo").forEach(btn => {
          btn.style.display = "";
        });
     
     hideScreenTop();
     playlistContainer.style.display = "block";
        artistScreen.style.display="none";
        songList.style.display="block"
        window.searchToggle.style.visibility="visible"

        document.querySelectorAll(".playlist").forEach(p => {
          p.classList.remove("active");
        });

        if (playlistContainer) {
          playlistContainer.style.visibility = "visible";
        }

        All.style.display = "none";

      });
    }

})
