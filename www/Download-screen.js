const Downloadbtn = document.getElementById("Download");

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
    alert("❌ No audio source");
    return;
  }

  downloadfile(fileUrl);
});
}

const Downloadedbtn= document.getElementById("Downloaded-btn").addEventListener("click",()=>{
  openPopup("Notice",
    "<p>Downloaded hymns will appear here</p>"        )
})

