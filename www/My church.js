document.addEventListener("DOMContentLoaded", () => {

const list = document.getElementById("My-church-song-list");
const screenList = document.getElementById("My-church-screen-list");
const loader = document.getElementById("My-church-loader");
const churchBtn = document.getElementById("church-btn");
const MyChurchSeeAll = document.querySelector("#My-church-header .see-all")
const ChurchScreen = document.getElementById("My-church-screen")
const SongList= document.getElementById("song-list")
const menuBtn =document.getElementById("menu-btn")
const BackMyChurch=document.querySelector("#My-church-screen .back-new-songs")
  
window.getChurchSongs = getChurchSongs;

async function getChurchSongs() {

  const church = localStorage.getItem("church");

  if (!church) return;

  loader.style.display = "block";

  try {

    const res = await fetch(
      `https://pujo-server.onrender.com/songs?church=${encodeURIComponent(church)}`
    );

    const data = await res.json();

    showChurchSongs(data);

  } catch (err) {
    console.log(err);
  } finally {
    loader.style.display = "none";
  }
}

function showChurchSongs(data) {

  list.innerHTML = "";
  screenList.innerHTML = "";

  data.slice(0,3).forEach(song => {
    list.appendChild(createOnlineSongs(song));
  });

  data.forEach(song => {
    screenList.appendChild(createOnlineSongs(song));
  });

}

getChurchSongs();


if (churchBtn) {
  churchBtn.addEventListener("click", () => {

    openPopup(
      "Choose your Church",
      `
        <select id="church-select">
          <option value="">Loading churches...</option>
        </select>

        <br><br>

        <button id="save-church">Save</button>
      `
    );

    fetch("https://pujo-server.onrender.com/churches")
      .then(res => res.json())
      .then(data => {

        const select = document.getElementById("church-select");

        // Futa Loading...
        select.innerHTML = `<option value="">Choose Church</option>`;

        // Ongeza churches
        data.forEach(church => {
          select.innerHTML += `
            <option value="${church.name}">
              ${church.name}
            </option>
          `;
        });

        // Kama kuna church iliyohifadhiwa
        const savedChurch = localStorage.getItem("church");
        if (savedChurch) {
          select.value = savedChurch;
        }

      })
      .catch(err => {
        console.log(err);

        document.getElementById("church-select").innerHTML =
          `<option>Failed to load churches</option>`;
      });

    // Save
    document.addEventListener("click", function saveChurch(e) {

      if (e.target.id !== "save-church") return;

      const select = document.getElementById("church-select");

      if (!select.value) {
        alert("Please choose a church.");
        return;
      }

      localStorage.setItem("church", select.value);

     closePopup();

      // Ondoa listener ili isijirudie kila popup ikifunguliwa
      document.removeEventListener("click", saveChurch);
    });

  });
}

MyChurchSeeAll.addEventListener("click",()=>{
 SongList.style.display="none" 
 ChurchScreen.style.display="block"
  menuBtn.style.display="none"
})

BackMyChurch.addEventListener("click",()=>{
  SongList.style.display="block" 
 ChurchScreen.style.display="none"
  menuBtn.style.display="block"
})

  screenList.addEventListener("click",(e)=>{
    const onlineBtn = e.target.closest(".online-btn")
   if(!onlineBtn) return
    openSong(onlineBtn);
    ChurchScreen.style.display="none"
    lastScreen= "My-church-screen"
  })
  
  });
