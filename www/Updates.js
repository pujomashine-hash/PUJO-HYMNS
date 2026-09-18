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

    // Browser
    if (!Network) {
      if (navigator.onLine) {
        syncData();
      } else {
        openPopup(
          "No Internet",
          "You can browse offline songs. Audio streaming requires an internet connection."
        );
      }
      return;
    }

    // Android (Capacitor)
    const status = await Network.getStatus();

    if (status.connected) {
      syncData();
    } else {
      openPopup(
        "No Internet",
        "You can browse offline songs. Audio streaming requires an internet connection."
      );
    }
  }

  if (Network) {
    Network.addListener("networkStatusChange", ({ connected }) => {
      if (connected) {
        syncData();
      } else {
        openPopup(
          "No Internet",
          "You are now offline."
        );
      }
    });
  } else {
    // Browser listeners
    window.addEventListener("online", syncData);

    window.addEventListener("offline", () => {
      openPopup(
        "No Internet",
        "You are now offline."
      );
    });
  }

  checkNetwork();

  async function syncData() {
    try {
      checkUpdate();
      await getSongs();
    } catch (err) {
      console.error(err);
    }
  }

});