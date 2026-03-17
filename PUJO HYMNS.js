       
const songbtns=document.querySelectorAll(".nyimbo")
const songlist=document.getElementById("song-list")
const songdetails=document.getElementById("song-details")
const lyrics=document.getElementById("lyrics")
const play=document.getElementById("play")
const pause=document.getElementById("pause")
const back=document.getElementById("back")
const audio=document.getElementById("audio")

songbtns.forEach(btn => {
    btn.addEventListener("click",()=> {
        const lyricsFile=btn.dataset.lyrics;
        const filekey=btn.dataset.file;

        fetch(lyricsFile)
            .then(res => res.text())
            .then(data => {
                lyrics.innerHTML=data.replace(/\n/g,"<br>");
            });                                    //hii ni kwa lylics
        fetch("PUJO HYMNS.json")
         .then(res => res.json())
         .then(data => {
           audio.src=data[filekey]; //hii ni kwa audio
         });
      songlist.style.display="none";
      songdetails.style.display="block";
    });
});
back.addEventListener("click", function() {
    songlist.style.display="block";
    songdetails.style.display="none";
    audio.pause();
});
play.addEventListener("click",function() {
    audio.play();
});
pause.addEventListener('click',function() {
    audio.pause();
});
    //SIMPLE SEARCH BARx
const searchInput = document.getElementById("search");
const songs = document.querySelectorAll(".nyimbo");
searchInput.addEventListener("keyup", function () {
  const searchValue = searchInput.value.toLowerCase();
 songs.forEach(function (song) {
   const title = song.textContent.toLowerCase();
      if (title.includes(searchValue)) {
      song.style.display = "";
    } else {
      song.style.display = "none";
    }
  });
});
    //NAVIGATION BAR
  const Buttons=document.querySelectorAll(".change")
  const screens=document.querySelectorAll(".screen")
   Buttons.forEach(Btn => {
     Btn.addEventListener('click',()=> {
       Buttons.forEach(B => B.classList.remove('active'))
       Btn.classList.add('active')
  screens.forEach(screen => screen.style.display="none");
  const targetId= Btn.getAttribute("data-target")
  document.getElementById(targetId).style.display="block";
     });
   });
     
   