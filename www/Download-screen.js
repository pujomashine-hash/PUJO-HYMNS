const Downloadbtn = document.getElementById("Download");
const DownloadList = document.getElementById("Downloaded-songs-list");
const DownloadScreenList = document.getElementById("Download-screen-list");
const DownloadCount = document.getElementById("Download-count");
const SongList = document.getElementById("song-list")
const SeeAllDownloaded= document.querySelector("#Downloaded-songs-header .see-all")
const DownloadScreen = document.getElementById("Downloaded-screen")
const menuBtn = document.getElementById("menu-btn")

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
  downloadedSongs.push({
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
    alert("❌ Error: " + error.message);
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
    openPopup("Notice",
             "😭😭Currently there is no audio file for this song Yo can browse only the song's lyrics.Thank you")
    return;
  }

  downloadfile(fileUrl);
});
}

function OpenDownloadScreen (){
  SongList.style.display="none"
  DownloadScreen.style.display="block" 
  loadDownloadedSongs();
  menuBtn.style.display="none"
}



const Downloadedbtn= document.getElementById("Downloaded-btn").addEventListener("click",()=>{
OpenDownloadScreen()
  })
function loadDownloadedSongs() {

  const songs =
    JSON.parse(localStorage.getItem("downloadedSongs")) || [];

  DownloadList.innerHTML = "";
  DownloadScreenList.innerHTML = "";

  if (songs.length === 0) {
    DownloadList.innerHTML = "<p>No Downloaded songs</p>";
    DownloadCount.textContent = "0";
    return;
  }

  // Home (onyesha 3 tu)
  songs.slice(0, 3).forEach(song => {
    DownloadList.appendChild(createOnlineSongs(song));
  });

  // Screen nzima
  songs.forEach(song => {
    DownloadScreenList.appendChild(createOnlineSongs(song));
  });

  DownloadCount.textContent = songs.length;
}
  
SeeAllDownloaded.addEventListener("click",()=>{
  OpenDownloadScreen()
})
