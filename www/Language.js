//LANGUAGE
const Languages=document.getElementById("Languages")
const Language=document.querySelectorAll(".Language-name")
const Languagebtn=document.getElementById("Languagebtn")
let translations = {};
let currentLang = localStorage.getItem("lang") || "en";
const SelectedLang=document.getElementById("Lang-selected")

fetch("Language.json")
  .then(res => res.json())
  .then(data => {
    translations = data;
    applyLanguage(currentLang); // tekeleza lugha iliyohifadhiwa
  });


function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.querySelectorAll("[data-key]").forEach(el => {
    if (translations[lang] && translations[lang][el.dataset.key]) {
      el.textContent = translations[lang][el.dataset.key];
    }
  });
  if(SelectedLang){
SelectedLang.textContent=currentLang;
}

}

Languagebtn.addEventListener("click", () => {

  openPopup(
    "Your Language",
    `
    <button class="popup-lang" data-lang="sw">Kiswahili</button>
    <button class="popup-lang" data-lang="en">English</button>
    `
  );

  const buttons = document.querySelectorAll(".popup-lang");

  buttons.forEach(btn => {
    btn.onclick = () => {
      applyLanguage(btn.dataset.lang);
      closePopup();
    };
  });

});
