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



  function checkNetwork() {
  if (navigator.onLine) {
    syncData();
  } else {
    openPopup(
      "No Internet",
      "You can browse offline songs. Audio streaming requires an internet connection."
    );
  }
}

// App ikianza
checkNetwork();

// Internet ikirudi
window.addEventListener("online", () => {
  syncData();
});

// Internet ikikatika
window.addEventListener("offline", () => {
  openPopup(
    "No Internet",
    "You are now offline."
  );
});
  async function syncData() {
    try {
      checkUpdate();
      await getSongs();
    } catch (err) {
      console.error(err);
    }
  }

});