document.addEventListener("DOMContentLoaded",()=>{
//const //Themechange=document.getElementById("theme")
//if(Themechange) {
//const Savedtheme=localStorage.getItem("theme")
//if(Savedtheme==="light"){
//  document.body.classList.add("light-mode")
//}
//Themechange.addEventListener("click",()=>{
//  document.body.classList.toggle("light-mode")

//if(document.body.classList.contains("light-mode")){
//  localStorage.setItem("theme","light")
//}else {
//  localStorage.setItem("theme","dark")
//}
//});
//}
const Themechange = document.getElementById("theme");

function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
  }

  localStorage.setItem("theme", theme);
}

// Load theme iliyohifadhiwa
applyTheme(localStorage.getItem("theme") || "dark");

if (Themechange) {
  Themechange.addEventListener("click", () => {
    openPopup(
      "Choose Theme",
      `
      <button class="popup-theme" data-theme="light">☀️ Light Theme</button>
      <br><br>
      <button class="popup-theme" data-theme="dark">🌙 Dark Theme</button>
      `
    );

    document.querySelectorAll(".popup-theme").forEach(btn => {
      btn.addEventListener("click", () => {
        applyTheme(btn.dataset.theme);
        closePopup();
      });
    });
  });
}

const Fontchanger=document.getElementById("Font-changer")
   if(Fontchanger){
   Fontchanger.addEventListener("click", () => {
     if(document.body.style.fontSize === "20px"){
       document.body.style.fontSize = "25px";
     } else {
  document.body.style.fontSize = "20px";
     }
});
}
//SETTINGS
const Settingsbtn = document.getElementById("Settings").addEventListener("click",()=>{
  openPopup("Personalise",
        `<p> Settings will appear here`
     )
})
const Rateapp= document.getElementById("Rate-app").addEventListener("click",()=>{
  window.location.href=("https://apkpure.com/p/com.pujo.hymns")
})
const aboutBtn= document.getElementById("about-btn").addEventListener("click",()=>{
 window.location.href=("https://pujomashine-hash.github.io/PUJO-HYMNS/About.html") 
}) 
  document.getElementById("Contact").addEventListener("click",()=>{
     openPopup("For any issue",
       `<p>Phone:0753802516</p> <br><p>Whatsapp:+225753802516<br>
<p> E-mail:Paulsudi30@gmail.com</p>` 
)                                             
  })
})
