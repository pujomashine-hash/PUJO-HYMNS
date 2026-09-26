document.addEventListener("DOMContentLoaded",()=>{
const list= document.getElementById("New-songs-list")
const SongList= document.getElementById("song-list")
const SongDetails = document.getElementById("song-details")
const NewSeeAllBtn=document.querySelector("#New-songs .see-all")
const NewSongScreen = document.getElementById("New-songs-screen")
const menuBtn = document.getElementById("menu-btn")
const BackNewSongs= document.querySelector("#New-songs-screen .back-new-songs")
const NewSongScreenList = document.getElementById("New-songs-screen-list")
  const audio = document.getElementById("audio");
const lyrics = document.getElementById("lyrics");
const Playing = document.getElementById("playing");
const MediaSession = window.Capacitor?.Plugins?.MediaSession;
const Filesystem = window.Capacitor?.Plugins?.Filesystem;
window.getSongs=getSongs
window.openOnlineSongs = openOnlineSongs
  
async function getSongs (){
const loader = document.querySelector("#New-songs-loader")
  loader.style.display="block"
  
  await
fetch("https://pujo-server.onrender.com/songs")
      .then(res => res.json())
      .then(data =>{
        showNewSongs(data)
        window.onlineSongs=data
      })
    .catch((e)=>{
  console.log(e)
    })
    
  .finally(()=>{
    loader.style.display="none";
  })
}

window.createOnlineSongs= createOnlineSongs;
 function createOnlineSongs (song){
  const onlineBtn= document.createElement("button")
     onlineBtn.className="online-btn"
   onlineBtn.dataset.id = song._id
   onlineBtn.dataset.file = song.file;
onlineBtn.dataset.lyrics = song.lyrics;
onlineBtn.dataset.image = song.image;
onlineBtn.dataset.title = song.title;
onlineBtn.dataset.artist = song.artist;

  onlineBtn.innerHTML=`
  <div class="left-img">
    <div class="btn-image">
      <img
      src="${song.image ? song.image : 'default.jpg'}"
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
  return onlineBtn;
}
getSongs()

function renderLyrics(text) {
  const container = document.getElementById("lyrics");
  container.innerHTML = "";

  const sections = parseLyrics(text);

  sections.forEach(section => {
    const div = document.createElement("div");

    switch (section.type) {

      case "TITLE":
        div.className = "lyrics-title";
        div.textContent = section.content;
        break;

      case "AUTHOR":
        div.className = "author";
        div.textContent = section.content;
        break;

      case "VERSE":
        div.className = "lyrics-verse";
        div.innerHTML = section.content.replace(/\n/g, "<br>");
        break;

      case "CHORUS":
        div.className = "lyrics-chorus";
        div.innerHTML = section.content.replace(/\n/g, "<br>");
        break;

      case "BRIDGE":
        div.className = "lyrics-bridge";
        div.innerHTML = section.content.replace(/\n/g, "<br>");
        break;
    }

    container.appendChild(div);
  });
}
  


  function parseLyrics(text) {
  const regex = /\[(\w+)\]([\s\S]*?)\[\/\1\]/g;
  const sections = [];

  let match;

  while ((match = regex.exec(text)) !== null) {
    sections.push({
      type: match[1],
      content: match[2].trim()
    });
  }

  return sections;
}

  
async  function openOnlineSongs(btn){
  
  scrollPosition = window.scrollY

  window.currentSong = {
    id:btn.dataset.id,
    title: btn.querySelector(".title").textContent,
    artist: btn.querySelector(".artist").textContent,
    file: btn.dataset.file,
    lyrics: btn.dataset.lyrics,
    image: btn.dataset.image
  };
  const fileName = btn.dataset.file.split("/").pop();

  // Angalia kama file ipo kwanza
  try {
  const result = await Filesystem.readFile({
    path: fileName,
    directory: "DATA"
  });

  audio.src = "data:audio/mpeg;base64," + result.data;

} catch (e) {

  audio.src = `https://pujo-server.onrender.com/songs/${btn.dataset.id}/audio`;
}


  MediaSession?.setMetadata({
  title: window.currentSong.title,
  artist: window.currentSong.artist,
  artwork: []
});
     
  Playing.textContent = currentSong.title + " - " + currentSong.artist;
  



  fetch(`https://pujo-server.onrender.com/songs/${btn.dataset.id}/lyrics`)
  .then(res => {
      if (!res.ok) throw new Error("Lyrics not found");
      return res.text();
  })
  .then(renderLyrics)
  .catch(() => {
      lyrics.innerHTML = "<p>Loading lyrics....</p>";
  });

  updateDownloadBtn();
  SongList.style.display = "none";
  SongDetails.style.display = "block";
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  updateFavButton();
 showScreenTop("The voice of praise")
}
        
    

    document.querySelectorAll(".three-dots").forEach(dot => {
      dot.addEventListener("click",(e)=>{
        e.stopPropagation();
      })
    })

    
  
 function showNewSongs(data) {

    list.innerHTML = "";
    NewSongScreenList.innerHTML = "";

    data.slice(0,3).forEach(song => {
        list.appendChild(createOnlineSongs(song));
    });

    data.forEach(song => {
        NewSongScreenList.appendChild(createOnlineSongs(song));
    });
 }
 SongList.addEventListener("click", (e) => {

  if (e.target.closest(".share") || e.target.closest(".three-dots")) {
    return;
  }

  const onlineBtn = e.target.closest(".online-btn");
  if (!onlineBtn) return;

  openOnlineSongs(onlineBtn);
});

  NewSeeAllBtn.addEventListener("click",()=>{
    SongList.style.display="none"
    NewSongScreen.style.display="block";   
    menuBtn.style.display="none"
    
    
  })
  BackNewSongs.addEventListener("click",()=>{
    SongList.style.display="block"
    NewSongScreen.style.display="none"
    menuBtn.style.display="block"
  })

  NewSongScreen.addEventListener("click", (e) => {

  if (e.target.closest(".share") || e.target.closest(".three-dots")) {
    return;
  }

  const onlineBtn = e.target.closest(".online-btn");
  if (!onlineBtn) return;

  openOnlineSongs(onlineBtn);
});
  
})



