document.addEventListener("DOMContentLoaded",()=>{
const songList = document.getElementById("song-list")
const searchScreen= document.getElementById("search-screen")
window.notificationToggle= document.getElementById("notification-toggle") 
window.searchToggle= document.getElementById("search-toggle") 
const searchInput = document.getElementById("search");
const searchResults = document.getElementById("search-results");
  const menuBtn = document.getElementById("menu-btn")

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase().trim();

  searchResults.innerHTML = "";

  if (!value) {
  searchResults.innerHTML = "";
  return;
  }
 let found = false;
  window.allSongs.forEach(song => {

    if (
      song.title.toLowerCase().includes(value) ||
      song.artist.toLowerCase().includes(value)
    ) {
      searchResults.appendChild(createSongButton(song));
      found=true;
    }

  });
  window.onlineSongs.forEach(song => {
  if (
    song.title.toLowerCase().includes(value) ||
    song.artist.toLowerCase().includes(value)
  ) {
    searchResults.appendChild(createOnlineSongs(song));
    found=true;
  }
});
  if(found===false) {
    searchResults.innerHTML=`
    <div id="not-found">
     <h4>No matched results </h4>
     <p> Try another song title or artist </p>
    </div>`
  }
  
});

  
searchResults.addEventListener("click", (e) => {
  const btn = e.target.closest(".nyimbo, .online-btn");
  if (!btn) return;
   if (btn.className==="nyimbo") {
     openOfflineSong(btn)
   }else{
  openOnlineSongs(btn);
   }
  lastScreen="search-screen"
  searchScreen.style.display="none"
});
  searchToggle.addEventListener("click",()=>{
    searchScreen.style.display="block"
    songList.style.display="none"
    menuBtn.style.display="none"
  })
  notificationToggle.addEventListener("click",()=>{
  openPopup("Notice","<h5>No new notification</h5>")
  })
})