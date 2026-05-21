document.addEventListener("DOMContentLoaded", () => {

  // =====================
  // SETUP & VARIABLES
  // =====================
  const Filesystem = window.Capacitor?.Plugins?.Filesystem;
  const Dir = "DATA"; // Private storage directory

  const sharebtn = document.getElementById("share-app");
  const navButtons = document.querySelectorAll(".change");
  const screens = document.querySelectorAll(".screen");
  const songList = document.getElementById("song-list");
  const playlistContainer = document.getElementById("playlist-container");
  const All = document.getElementById("All");
  const favBtn = document.getElementById("fav");
  const searchInput = document.getElementById("search");
  const menubtn = document.getElementById("menu-btn");
  const menucontent = document.getElementById("menu");
  const progress = document.getElementById("progress");
  const audio = document.getElementById("audio");
  const progressContainer = document.getElementById("progress-container");
  const Downloadbtn = document.getElementById("Download");
  const Themechange = document.getElementById("theme");
  const Fontchanger = document.getElementById("Font-changer");
  const Languagebtn = document.getElementById("Language");
  const Languages = document.getElementById("Languages");
  const Exitbtn = document.getElementById("Exit");
  const CategoryNames = document.getElementById("Category-names");
  const CategorySongs = document.getElementById("Category-songs");
  const container = document.getElementById("playlist-container");

  let activeCategory = null;
  let lastScreen = "song-list";
  let categoryView = "names";
  let currentSong = null;
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  let scrollPosition = 0;

  // =====================
  // INITIAL SETUP
  // =====================
  if (songList) songList.style.display = "block";
  if (playlistContainer) playlistContainer.style.visibility = "visible";

  // =====================
  // UPDATE CHECK
  // =====================
  function checkUpdate() {
    const currentVersion = "1.0.2";
    fetch("https://raw.githubusercontent.com/pujomashine-hash/PUJO-HYMNS/main/Version.json")
      .then(res => res.json())
      .then(data => {
        if (data.version !== currentVersion) {
          if (confirm("The new version is available do you want to install it? (Kuna update mpya Unataka kupakua?)")) {
            window.location.href = data.url;
          }
        }
      })
      .catch(() => {});
  }
  checkUpdate();

  // =====================
  // SHARE BUTTON
  // =====================
  if (sharebtn) {
    sharebtn.addEventListener("click", async () => {
      try {
        await Capacitor.Plugins.Share.share({
          title: 'PUJO HYMNS',
          text: 'Install for free',
          url: 'https://www.mediafire.com/folder/eyz4rcw94hr5l/Updates'
        });
      } catch (e) {
        console.log(e);
      }
    });
  }

  // =====================
  // THEME
  // =====================
  if (Themechange) {
    const Savedtheme = localStorage.getItem("theme");
    if (Savedtheme === "light") {
      document.body.classList.add("light-mode");
    }
    Themechange.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
    });
  }

  // =====================
  // FONT CHANGER
  // =====================
  if (Fontchanger) {
    Fontchanger.addEventListener("click", () => {
      document.body.style.fontSize = document.body.style.fontSize === "20px" ? "25px" : "20px";
    });
  }

  // =====================
  // LANGUAGE
  // =====================
  if (Languagebtn && Languages) {
    Languagebtn.addEventListener("click", () => {
      Languages.style.display = "block";
    });
  }

  // =====================
  // NAVIGATION
  // =====================
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      navButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      screens.forEach(screen => screen.style.display = "none");
      const targetId = btn.getAttribute("data-target");

      if (targetId === "favourite") {
        document.querySelectorAll(".nyimbo").forEach(b => b.style.display = "");
      }

      if (targetId === "song-list") {
        if (searchInput) searchInput.style.visibility = "visible";
        document.querySelectorAll(".nyimbo").forEach(b => b.style.display = "");
        if (playlistContainer) playlistContainer.style.display = "block";
        document.querySelectorAll(".playlist").forEach(p => p.classList.remove("active"));
        const jinaContainer = document.getElementById("jina-container");
        if (jinaContainer) jinaContainer.style.display = "none";
      }

      lastScreen = targetId;

      if (targetId === "playlist-category") {
        document.getElementById(targetId).style.display = "grid";
        if (searchInput) searchInput.style.visibility = "hidden";
      } else {
        document.getElementById(targetId).style.display = "block";
        if (searchInput) searchInput.style.visibility = "visible";
      }

      if (targetId === "playlist-category") {
        const Songcontainer = document.getElementById("Category-songs");
        const CatNames = document.getElementById("Category-names");

        if (!activeCategory) {
          CatNames.style.display = "grid";
          Songcontainer.style.display = "none";
          document.getElementById("Catjina-Container").style.display = "none";
        } else {
          CatNames.style.display = "none";
          Songcontainer.style.display = "block";
          document.querySelectorAll("#Category-songs .nyimbo").forEach(b => {
            b.style.display = b.dataset.Category === activeCategory ? "block" : "none";
          });
        }
      }
    });
  });

  // =====================
  // SEARCH
  // =====================
  if (searchInput) {
    searchInput.addEventListener("keyup", () => {
      const searchValue = searchInput.value.toLowerCase();
      document.querySelectorAll(".nyimbo").forEach(btn => {
        const title = btn.querySelector(".title")?.textContent.toLowerCase() || "";
        const artist = btn.querySelector(".artist")?.textContent.toLowerCase() || "";
        btn.style.display = (title.includes(searchValue) || artist.includes(searchValue)) ? "" : "none";
      });
    });
  }

  // =====================
  // MENU
  // =====================
  if (menubtn && menucontent) {
    menubtn.addEventListener("click", () => {
      menucontent.style.display = menucontent.style.display === "block" ? "none" : "block";
    });
  }

  document.addEventListener("click", (e) => {
    if (!menubtn || !menucontent) return;
    if (!menubtn.contains(e.target) && !menucontent.contains(e.target)) {
      menucontent.style.display = "none";
    }
  });

  // =====================
  // PROGRESS BAR
  // =====================
  if (audio) {
    audio.addEventListener("timeupdate", () => {
      if (audio.duration && progress) {
        progress.style.width = ((audio.currentTime / audio.duration) * 100) + "%";
      }
    });

    audio.addEventListener("error", () => {
      const playing = document.getElementById("playing");
      if (playing) playing.textContent = "❌ Audio not available";
    });
  }

  if (progressContainer && audio) {
    progressContainer.addEventListener("click", (e) => {
      const rect = progressContainer.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audio.currentTime = percent * audio.duration;
    });
  }

  // =====================
  // AD HIDE
  // =====================
  setTimeout(() => {
    const Ad = document.getElementById("ad");
    if (Ad) Ad.style.display = "none";
  }, 5000);

  // =====================
  // PLAYLIST SCROLL LOOP
  // =====================
  if (container) {
    let timer;
    container.addEventListener("scroll", () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 2) {
          container.scrollLeft = 0;
        }
      }, 120);
    });
  }

  // =====================
  // BACK BUTTON (ANDROID)
  // =====================
  if (window.Capacitor) {
    const { App } = Capacitor.Plugins;
    App.addListener('backButton', () => {
      const songDetails = document.getElementById("song-details");
      if (lastScreen !== "song-list" ||
        (songDetails && songDetails.style.display === "block") ||
        activeCategory) {
        document.getElementById("back")?.click();
        return;
      }
      if (confirm("Unataka kufunga app?")) {
        App.exitApp();
      }
    });
  }

  // =====================
  // DOWNLOAD FUNCTIONS
  // =====================

  // Base64 converter — inatoa prefix "data:audio/...;base64,"
  function convertToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]); // ✅ prefix imetolewa
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Angalia kama file ipo kwenye private storage
  async function updateDownloadBtn() {
    if (!currentSong || !Downloadbtn || !Filesystem) return;
    const fileName = currentSong.file.split("/").pop();
    try {
      await Filesystem.stat({ path: fileName, directory: Dir });
      Downloadbtn.textContent = "✔"; // file ipo
    } catch (e) {
      Downloadbtn.textContent = "⬇"; // file haipo
    }
  }

  // Download MP3 kutoka URL → private storage
  async function downloadfile(url) {
    if (!Filesystem) {
      alert("❌ Filesystem plugin haipatikani");
      return;
    }
    try {
      const fileName = currentSong.file.split("/").pop();
      Downloadbtn.textContent = "⏳";

      const response = await fetch(url);
      if (!response.ok) throw new Error("Download imeshindwa");

      const blob = await response.blob();
      const base64 = await convertToBase64(blob);

      await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Dir,
        recursive: true // ✅ tengeneza folder kama haipo
      });

      Downloadbtn.textContent = "✔";
    } catch (error) {
      Downloadbtn.textContent = "⬇";
      alert("❌ Error: " + error.message);
    }
  }

  // Download button click
  if (Downloadbtn) {
    Downloadbtn.addEventListener("click", () => {
      if (!currentSong) {
        alert("❌ Chagua wimbo kwanza");
        return;
      }
      const fileUrl = currentSong.file;
      if (!fileUrl) {
        alert("❌ Hakuna chanzo cha audio");
        return;
      }
      downloadfile(fileUrl);
    });
  }

  // =====================
  // FAVOURITES
  // =====================
  function updateFavButton() {
    if (!currentSong || !favBtn) return;
    const exists = favourites.some(song => song.title === currentSong.title);
    favBtn.textContent = exists ? "❤️" : "♡";
  }

  function renderFavourites() {
    const favScreen = document.getElementById("favourite");
    if (!favScreen) return;

    favScreen.innerHTML = "";

    if (favourites.length === 0) {
      favScreen.innerHTML = `
        <h1 class="favmessage">Your favourite Songs</h1>
        <p class="favmessage">No favourite songs yet</p>
      `;
      return;
    }

    favourites.forEach(song => {
      const btn = document.createElement("button");
      btn.className = "nyimbo";
      btn.dataset.image = song.image || "";
      btn.innerHTML = `
        <div class="left-img">
          <div class="btn-image">
            <img src="${song.image ? song.image : 'defaul.jpg'}" onerror="this.src='logo.png'">
          </div>
          <div class="text-btn">
            <div class="title">${song.title}</div>
            <div class="artist">${song.artist}</div>
          </div>
        </div>
        <span class="three-dots">⋮
          <div class="dots-menu">
            <button class="share">Share</button>
          </div>
        </span>
      `;

      btn.addEventListener("click", () => {
        const songDetails = document.getElementById("song-details");
        const lyrics = document.getElementById("lyrics");
        const Playing = document.getElementById("playing");

        currentSong = song;
        if (Playing) Playing.textContent = currentSong.title + " - " + currentSong.artist;

        fetch(song.lyrics)
          .then(res => res.text())
          .then(text => {
            if (lyrics) lyrics.innerHTML = text.replace(/\n/g, "<br>");
          });

        audio.src = song.file;

        if (songList) songList.style.display = "none";
        if (songDetails) songDetails.style.display = "block";
        favScreen.style.display = "none";

        updateFavButton();
        updateDownloadBtn();
      });

      favScreen.appendChild(btn);
    });
  }

  if (favBtn) {
    favBtn.addEventListener("click", () => {
      if (!currentSong) return;
      const exists = favourites.some(song => song.title === currentSong.title);
      favourites = exists
        ? favourites.filter(s => s.title !== currentSong.title)
        : [...favourites, currentSong];
      localStorage.setItem("favourites", JSON.stringify(favourites));
      updateFavButton();
      renderFavourites();
    });
  }

  renderFavourites();

  // =====================
  // EXIT CATEGORY BUTTON
  // =====================
  if (Exitbtn) {
    Exitbtn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      activeCategory = null;
      categoryView = "names";
      if (CategoryNames) CategoryNames.style.display = "grid";
      if (CategorySongs) CategorySongs.style.display = "none";
      const catJina = document.getElementById("Catjina-Container");
      if (catJina) catJina.style.display = "none";
    });
  }

  // =====================
  // LOAD SONGS FROM JSON
  // =====================
  fetch("PUJO HYMNS.json")
    .then(res => res.json())
    .then(data => {

      const categoryContainer = document.getElementById("Category-names");
      const Songcontainer = document.getElementById("Category-songs");
      let playlistButtons = [];

      // Tengeneza buttons za category
      data.forEach(song => {
        const btn = document.createElement("button");
        btn.dataset.file = song.file;
        btn.dataset.lyrics = song.lyrics;
        btn.dataset.Category = song.Category;
        btn.className = "nyimbo";
        btn.innerHTML = `
          <div class="left-img">
            <div class="btn-image">
              <img src="${song.image ? song.image : 'defaul.jpg'}" onerror="this.src='logo.png'">
            </div>
            <div class="text-btn">
              <div class="title">${song.title}</div>
              <div class="artist">${song.artist}</div>
            </div>
          </div>
          <span class="three-dots">⋮
            <div class="dots-menu">
              <button class="share">Share</button>
            </div>
          </span>
        `;
        btn.style.display = "none";
        playlistButtons.push(btn);
        if (Songcontainer) Songcontainer.appendChild(btn);
      });

      // Category click
      document.querySelectorAll(".Category").forEach(Cat => {
        Cat.addEventListener("click", () => {
          const Category = Cat.id;
          activeCategory = Category;

          playlistButtons.forEach(btn => {
            btn.style.display = btn.dataset.Category === Category ? "block" : "none";
          });

          const CatJina = document.getElementById("Catjina");
          if (CatJina) CatJina.textContent = Cat.textContent;
          if (Songcontainer) Songcontainer.style.display = "block";
          categoryView = "songs";
          if (categoryContainer) categoryContainer.style.display = "none";
          const catJinaContainer = document.getElementById("Catjina-Container");
          if (catJinaContainer) catJinaContainer.style.display = "block";
        });
      });

      // Category song click — kufungua wimbo
      playlistButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          lastScreen = "playlist-category";
          const songDetails = document.getElementById("song-details");
          const lyrics = document.getElementById("lyrics");
          const Playing = document.getElementById("playing");

          currentSong = {
            title: btn.querySelector(".title").textContent,
            artist: btn.querySelector(".artist").textContent,
            file: btn.dataset.file,
            lyrics: btn.dataset.lyrics
          };

          if (Playing) Playing.textContent = currentSong.title + " - " + currentSong.artist;

          fetch(currentSong.lyrics)
            .then(res => res.text())
            .then(text => {
              if (lyrics) lyrics.innerHTML = text.replace(/\n/g, "<br>");
            });

          // Jaribu local file kwanza, kisha online
          playAudio(currentSong.file);

          if (Songcontainer) Songcontainer.style.display = "none";
          if (songDetails) songDetails.display = "block";
          if (categoryContainer) categoryContainer.style.display = "none";

          updateFavButton();
          updateDownloadBtn();
        });
      });

      // Tengeneza song list buttons
      data.forEach(song => {
        const btn = document.createElement("button");
        btn.className = "nyimbo";
        btn.dataset.file = song.file;
        btn.dataset.lyrics = song.lyrics;
        btn.dataset.image = song.image || "";

        btn.innerHTML = `
          <div class="left-img">
            <div class="btn-image">
              <img src="${song.image ? song.image : 'defaul.jpg'}" onerror="this.src='logo.png'">
            </div>
            <div class="text-btn">
              <div class="title">${song.title}</div>
              <div class="artist">${song.artist}</div>
            </div>
          </div>
          <span class="three-dots">⋮
            <div class="dots-menu">
              <button class="share">Share</button>
            </div>
          </span>
        `;

        if (songList) songList.appendChild(btn);
      });

      // Playlist filter click
      document.querySelectorAll(".playlist").forEach(playlist => {
        playlist.addEventListener("click", () => {
          if (searchInput) searchInput.style.visibility = "hidden";
          const artist = playlist.querySelector(".playlist-name").textContent.trim().toLowerCase();

          document.querySelectorAll(".playlist").forEach(p => p.classList.remove("active"));
          playlist.classList.add("active");

          document.querySelectorAll(".nyimbo").forEach(btn => {
            const songArtist = btn.querySelector(".artist")?.textContent.toLowerCase() || "";
            btn.style.display = songArtist === artist ? "" : "none";
          });

          const jinaContainer = document.getElementById("jina-container");
          const jina = document.getElementById("jina");
          if (jinaContainer) jinaContainer.style.display = "block";
          if (jina) jina.textContent = artist;
          if (playlistContainer) playlistContainer.style.display = "none";
          if (All) All.style.display = "block";
        });
      });

      // All button
      if (All) {
        All.addEventListener("click", () => {
          const jinaContainer = document.getElementById("jina-container");
          if (jinaContainer) jinaContainer.style.display = "none";
          document.querySelectorAll(".nyimbo").forEach(btn => btn.style.display = "");
          if (searchInput) searchInput.style.visibility = "visible";
          if (playlistContainer) {
            playlistContainer.style.display = "block";
            playlistContainer.style.visibility = "visible";
          }
          document.querySelectorAll(".playlist").forEach(p => p.classList.remove("active"));
          All.style.display = "none";
        });
      }

      // Song list click — kufungua wimbo
      const songDetails = document.getElementById("song-details");
      const lyrics = document.getElementById("lyrics");
      const play = document.getElementById("play");
      const Playing = document.getElementById("playing");
      const back = document.getElementById("back");

      if (songList) {
        songList.addEventListener("click", async (e) => {
          const btn = e.target.closest(".nyimbo");
          if (!btn) return;

          scrollPosition = window.scrollY;

          currentSong = {
            title: btn.querySelector(".title").textContent,
            artist: btn.querySelector(".artist").textContent,
            file: btn.dataset.file,
            lyrics: btn.dataset.lyrics,
            image: btn.dataset.image || ""
          };

          if (Playing) Playing.textContent = currentSong.title + " - " + currentSong.artist;

          fetch(btn.dataset.lyrics)
            .then(res => res.text())
            .then(text => {
              if (lyrics) lyrics.innerHTML = text.replace(/\n/g, "<br>");
            });

          // ✅ Jaribu local file kwanza, kisha fallback online
          await playAudio(currentSong.file);

          updateDownloadBtn();
          updateFavButton();

          songList.style.display = "none";
          if (songDetails) songDetails.style.display = "block";

          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
        });
      }

      // Play/pause
      if (play && audio) {
        play.addEventListener("click", () => {
          if (audio.paused) {
            audio.play();
            play.textContent = "▶";
          } else {
            audio.pause();
            play.textContent = "⏯";
          }
        });
      }

      // Three dots menu stop propagation
      document.querySelectorAll(".three-dots").forEach(dot => {
        dot.addEventListener("click", (e) => e.stopPropagation());
      });

      // Back button
      if (back) {
        back.addEventListener("click", () => {
          screens.forEach(screen => screen.style.display = "none");

          const last = document.getElementById(lastScreen);
          if (last) last.style.display = "block";
          if (songDetails) songDetails.style.display = "none";

          if (categoryView === "names") {
            if (categoryContainer) categoryContainer.style.display = "grid";
            if (Songcontainer) Songcontainer.style.display = "none";
          } else {
            if (categoryContainer) categoryContainer.style.display = "none";
            if (Songcontainer) Songcontainer.style.display = "block";
          }

          requestAnimationFrame(() => window.scrollTo(0, scrollPosition));

          if (audio) {
            audio.pause();
            if (play) play.textContent = "▶";
          }
        });
      }

    })
    .catch(err => console.error("Imeshindwa kupakia nyimbo:", err));

  // =====================
  // PLAY AUDIO (Local → Online fallback)
  // =====================
  async function playAudio(fileUrl) {
    if (!audio) return;

    const fileName = fileUrl.split("/").pop();

    // Jaribu kutumia local file kwanza
    if (Filesystem) {
      try {
        const result = await Filesystem.getUri({
          path: fileName,
          directory: Dir
        });
        audio.src = result.uri; // ✅ local file
        return;
      } catch (e) {
        // file haipo locally — tumia online
      }
    }

    audio.src = fileUrl; // 🌐 fallback online
  }

});

