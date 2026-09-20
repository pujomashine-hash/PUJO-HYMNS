  // Screen nzima
  songs.forEach(song => {
    DownloadScreenList.appendChild(createOnlineSongs(song));
  });

  DownloadCount.textContent = songs.length;
}
  
SeeAllDownloaded.addEventListener("click",()=>{
  OpenDownloadScreen()
})

DownloadScreenList.addEventListener("click",(e)=>{
  const onlineBtn = e.target.closest(".online-btn")
   if(!onlineBtn) return
    openSong(onlineBtn);
    DownloadScreen.style.display="none"
    lastScreen= "Downloaded-screen"
})

DownloadedBack.addEventListener("click",()=>{
  SongList.style.display="block"
  DownloadScreen.style.display="none"
  menuBtn.style.display="block"
})


    loadDownloadedSongs();
  
})
