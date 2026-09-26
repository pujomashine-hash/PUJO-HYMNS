document.addEventListener("DOMContentLoaded", () => {
  const MyChurch = document.getElementById("My-church")
  const NewSongs = document.getElementById("New-songs")
  const Network = window.Capacitor?.Plugins?.Network;
  window.checkUpdate= checkUpdate


  //initial update check
function checkUpdate() {
  const currentVersion = "1.0.4";  document.getElementById("Version").textContent=`Version `+ currentVersion 

  fetch("https://raw.githubusercontent.com/pujomashine-hash/PUJO-HYMNS/main/Version.json")
    .then(res => res.json())
    .then(data => {

      if (data.version !== currentVersion) {
       openPopup(`<div class="popup-title">
    <span class="popup-logo-btn"></span>
    <p>Update</p>
  </div>`,
        `<div>
          <p data-key="update-message" class="update-message">The new version of PUJO Hymns available click the button below to install it</p>
          <button id="update-btn" data-key="update-btn">Update</button>
        </div>`)
      } 
  const UpdateBtn = document.getElementById("update-btn")
    UpdateBtn.addEventListener("click",()=>{
      window.location.href=data.url
    })
      
    })
    .catch(() => {
    });
}
  checkUpdate();


function toggleOnlineSections(show) {
  MyChurch.style.display = show ? "block" : "none";
  NewSongs.style.display = show ? "block" : "none";
}
  
async function checkNetwork() {
  // Kama plugin haipo, usifanye chochote
  if (!Network) {
    console.warn("Network plugin not found");
    return;
  }

  try {
    const status = await Network.getStatus();

    if (status.connected) {
      syncData();
      toggleOnlineSections(true)
    } else {
      toggleOnlineSections(false)
      openPopup(`<div class="popup-title">
    <span class="popup-logo-btn"></span>
    <p>No internet</p>
  </div>`,
        "You can browse offline songs. Audio streaming requires an internet connection."
      );
    
    }
  } catch (err) {
    console.error(err);
  }
}

// App ikianza
checkNetwork();

// Sikiliza mabadiliko ya network
let isOffline = false;

Network.addListener("networkStatusChange", ({ connected }) => {

  if (connected) {
    toggleOnlineSections(true)
    if (isOffline) {
      closePopup();
      syncData();
      isOffline = false;
    }
  } else {
    toggleOnlineSections(false)
    if (!isOffline) {
      isOffline = true;
      openPopup(`<div class="popup-title">
    <span class="popup-logo-btn"></span>
    <p>No internet</p>
  </div>`,
        "You can browse offline songs. Audio streaming requires an internet connection."
      );
    }
  }

});

let syncing = false;

async function syncData() {
  if (syncing) return;

  syncing = true;

  try {
    checkUpdate();
    await getSongs();
    getChurchSongs();
  } finally {
    syncing = false;
  }
}
});