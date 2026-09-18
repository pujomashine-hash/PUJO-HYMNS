document.addEventListener("DOMContentLoaded",()=>{
const list= document.getElementById("New-songs-list")
const SongList= document.getElementById("song-list")
const SongDetails = document.getElementById("song-details")
const NewSeeAllBtn=document.querySelector("#New-songs .see-all")
const NewSongScreen = document.getElementById("New-songs-screen")
const menuBtn = document.getElementById("menu-btn")
const BackNewSongs= document.querySelector("#New-songs-screen #back-new-songs")
const NewSongScreenList = document.getElementById("New-songs-screen-list")

  
async function getSongs (){
  await
fetch("https://pujo-server.onrender.com/songs")
      .then(res => res.json())
      .then(data =>{
        showNewSongs(data)
        window.onlineSongs=data
      })
}
getSongs();


window.createOnlineSongs= createOnlineSongs;
 function createOnlineSongs (song){
  const onlineBtn= document.createElement("button")
     onlineBtn.className="online-btn"
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
 function showNewSongs(data){

    data.slice(0,3).forEach(song=>{
        list.appendChild(createOnlineSongs(song));
    });

    data.forEach(song=>{
        NewSongScreenList.appendChild(createOnlineSongs(song));
    });
 }

 SongList.addEventListener("click",(e)=>{
    const onlineBtn = e.target.closest(".online-btn")
   if(!onlineBtn) return
    openSong(onlineBtn);
    
  })

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

  NewSongScreen.addEventListener("click",(e)=>{
    const onlineBtn = e.target.closest(".online-btn")
   if(!onlineBtn) return
    openSong(onlineBtn);
    NewSongScreen.style.display="none"
    lastScreen= "New-songs-screen"
  })
  
  
})



