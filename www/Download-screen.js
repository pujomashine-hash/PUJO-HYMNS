document.addEventListener("DOMContentLoaded",()=>{

const Downloadbtn = document.getElementById("Download");
const DownloadList = document.getElementById("Downloaded-songs-list");
const DownloadScreenList = document.getElementById("Download-screen-list");
const DownloadCount = document.getElementById("Download-count");
const SongList = document.getElementById("song-list")
const SeeAllDownloaded= document.querySelector("#Downloaded-songs-header .see-all")
const DownloadScreen = document.getElementById("Downloaded-screen")
const menuBtn = document.getElementById("menu-btn")
const DownloadedBack=document.querySelector
  ("#Download-screen-header .back-new-songs")
  const Filesystem = window.Capacitor?.Plugins?.Filesystem;

window.loadDownloadedSongs = loadDownloadedSongs;
window.updateDownloadBtn=updateDownloadBtn;

  
  
async function updateDownloadBtn() {
  if (!currentSong) return;

  const fileName = currentSong.file.split("/").pop();

  try {
    await Filesystem.stat({
      path: fileName,
      directory: "DATA"
    });

    Downloadbtn.textContent = "✔";

  } catch (e) {
    Downloadbtn.textContent = "📥";
  }
}


async function downloadfile(url) {
  try {
    const fileName = currentSong.file.split("/").pop();
    Downloadbtn.textContent = "⏳";

    // Chunked download haisimami hata data ikiwa polepole
    const response = await fetch(url);
    if (!response.ok) throw new Error("Download failed");

    const chunks = [];
    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    // Unganisha chunks zote
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const fullArray = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      fullArray.set(chunk, offset);
      offset += chunk.length;
    }

    // Badilisha kuwa base64
    let binary = "";
const chunkSize = 8192;
for (let i = 0; i < fullArray.length; i += chunkSize) {
  binary += String.fromCharCode(...fullArray.subarray(i, i + chunkSize));
}
const base64 = btoa(binary);

    await Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: "DATA",
      recursive: true
    });

    // Hifadhi taarifa za wimbo
let downloadedSongs =
  JSON.parse(localStorage.getItem("downloadedSongs")) || [];

// Epuka duplicate
const exists = downloadedSongs.some(song => song.file === currentSong.file);

if (!exists) {
  downloadedSongs.unshift({
    title: currentSong.title,
    artist: currentSong.artist,
    image: currentSong.image,
    lyrics: currentSong.lyrics,
    file: currentSong.file
  });

  localStorage.setItem(
    "downloadedSongs",
    JSON.stringify(downloadedSongs)
  );
}
    loadDownloadedSongs();

    Downloadbtn.textContent = "✔";

  } catch (error) {
    Downloadbtn.textContent = "📥";
    openPopup(`<div class="popup-title">
    <span class="popup-logo-btn"></span>
    <p>Notice</p>
  </div>`,
             `<p>1.Midi/piano sounds are not allowed to download you can still download all other recordings and audio from choirs</p> <br>
             <p>2.By consider the notice(1) above Check the network and try again`);
    
  }
  
}

  function toBase64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

function fromBase64(base64) {
  return decodeURIComponent(escape(atob(base64)));
}
  

  async function saveSongMetadata() {
  try {
    const fileName = currentSong.file.split("/").pop();
    const jsonName = fileName.replace(".mp3", ".json");

    const lyricsText = await fetch(
      `https://pujo-server.onrender.com/songs/${currentSong.id}/lyrics`
    ).then(r => r.text());

    currentSong.lyrics = lyricsText;

    const metadata = JSON.stringify({
      id: currentSong.id,
      title: currentSong.title,
      artist: currentSong.artist,
      image: currentSong.image,
      lyrics: currentSong.lyrics,
      file: fileName
    });

    await Filesystem.writeFile({
  path: jsonName,
  data: toBase64(metadata),
  directory: "DATA",
  recursive: true
});
    
  } catch (e) {
    alert(e.message);
  }
}

async function downloadOnlineFile() {
  try {
    Downloadbtn.textContent = "⏳";

    const fileName = currentSong.file.split("/").pop();

    const response = await fetch(
      `https://pujo-server.onrender.com/songs/${currentSong.id}/download`
    );

    if (!response.ok) {
      throw new Error("Download failed");
    }

    const reader = response.body.getReader();

const chunks = [];

while (true) {
  const { done, value } = await reader.read();

  if (done) break;

  chunks.push(value);
}

    // Unganisha chunks zote
const totalLength = chunks.reduce(
  (sum, chunk) => sum + chunk.length,
  0
);

const fullArray = new Uint8Array(totalLength);

let offset = 0;

for (const chunk of chunks) {
  fullArray.set(chunk, offset);
  offset += chunk.length;
}

let binary = "";
const chunkSize = 8192;

for (let i = 0; i < fullArray.length; i += chunkSize) {
  binary += String.fromCharCode(
    ...fullArray.subarray(i, i + chunkSize)
  );
}

const base64 = btoa(binary);
await Filesystem.writeFile({
  path: fileName,
  data: base64,
  directory: "DATA",
  recursive: true
});
await saveSongMetadata();

    Downloadbtn.textContent = "✔";
await loadDownloadedSongs();

  } catch (e) {
    console.log(e);
    Downloadbtn.textContent = "📥";
  }
}
  
function convertToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

if(Downloadbtn){
Downloadbtn.addEventListener("click", () => {
  if (!currentSong) {
    alert("❌ Chagua wimbo kwanza");
    return;
  }

  const fileUrl = currentSong.file;

  if (!fileUrl) {
    openPopup(`<div class="popup-title">
    <span class="popup-logo-btn"></span>
    <p>Notice</p>
  </div>`,
             "😭😭Currently there is no audio file for this song Yo can browse only the song's lyrics.Thank you.")
    return;
  }

  if (currentSong.id) {
    downloadOnlineFile();
} else {
    downloadfile(fileUrl);
  }
});
}

function OpenDownloadScreen (){
  SongList.style.display="none"
  DownloadScreen.style.display="block" 
  loadDownloadedSongs();
  menuBtn.style.display="none"
}




async function loadDownloadedSongs() {
  try{

  DownloadList.innerHTML = "";
DownloadScreenList.innerHTML = "";
  const songs = [];

  // 1. Soma za localStorage
  const localSongs =
    JSON.parse(localStorage.getItem("downloadedSongs")) || [];

  songs.push(...localSongs);

  // 2. Soma za Filesystem
  const result = await Filesystem.readdir({
    directory: "DATA",
    path: ""
  });
   
    
  for (const file of result.files) {
  if (!file.name.endsWith(".json")) continue;

  try {

    const json = await Filesystem.readFile({
      directory: "DATA",
      path: file.name
    });

    const text = fromBase64(json.data);
const song = JSON.parse(text);
    songs.push(song);

  } catch (e) {
    continue;
  }
}
    
if (songs.length === 0) {
  DownloadList.innerHTML = "<p>No Downloaded songs</p>";
  DownloadScreenList.innerHTML = "<p>No Downloaded songs</p>";
  DownloadCount.textContent = "0";
  return;
}

  // Home (onyesha 3 tu)
  songs.slice(-3).reverse().forEach(song => {
  const btn = song.id
    ? createOnlineSongs(song)
    : createSongButton(song);

  DownloadList.appendChild(btn);
});
    
  // Screen nzima
  songs.forEach(song => {
  const btn = song.id
    ? createOnlineSongs(song)
    : createSongButton(song);

  DownloadScreenList.appendChild(btn);
});
    
  DownloadCount.textContent = songs.length;
} catch (e){
    console.log(e.message)
}
}
  
SeeAllDownloaded.addEventListener("click",()=>{
  OpenDownloadScreen()
})

DownloadList.addEventListener("click", (e) => {
   lastScreen="song-list"
  const onlineBtn = e.target.closest(".online-btn");
  if (onlineBtn) {
    openOnlineSongs(onlineBtn);
    return;
  }

  const offlineBtn = e.target.closest(".nyimbo");
  if (offlineBtn) {
    openOfflineSong(offlineBtn);
  }
});

DownloadScreenList.addEventListener("click", (e) => {
  DownloadScreen.style.display="none"
  lastScreen="Downloaded-screen"
  const onlineBtn = e.target.closest(".online-btn");
  if (onlineBtn) {
    openOnlineSongs(onlineBtn);
    return;
  }

  const offlineBtn = e.target.closest(".nyimbo");
  if (offlineBtn) {
    openOfflineSong(offlineBtn);
  }
});
  
DownloadedBack.addEventListener("click",()=>{
  SongList.style.display="block"
  DownloadScreen.style.display="none"
  menuBtn.style.display="block"
  lastScreen="song-list"
})




const Downloadedbtn= document.getElementById("Downloaded-btn").addEventListener("click",()=>{
OpenDownloadScreen();
  })

  
})


