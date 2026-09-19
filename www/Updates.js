document.addEventListener("DOMContentLoaded", () => {

  const Network = window.Capacitor?.Plugins?.Network;
  window.checkUpdate= checkUpdate


  //initial update check
function checkUpdate() {
  const currentVersion = "1.0.4";  document.getElementById("Version").textContent=`Version `+ currentVersion 

  fetch("https://raw.githubusercontent.com/pujomashine-hash/PUJO-HYMNS/main/Version.json")
    .then(res => res.json())
    .then(data => {

      if (data.version !== currentVersion) {
        if (confirm("The new version is available do yo want to install it?(Kuna update mpya Unataka kupakua?)")) {
          window.location.href = data.url;
        }
      } 

    })
    .catch(() => {
    });
}
checkUpdate();


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
    } else {
      openPopup(
        "No Internet",
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
    if (isOffline) {
      closePopup();
      syncData();
      isOffline = false;
    }
  } else {
    if (!isOffline) {
      isOffline = true;
      openPopup(
        "No Internet",
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