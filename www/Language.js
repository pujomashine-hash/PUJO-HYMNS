//LANGUAGE
const Languages=document.getElementById("Languages")
const Language=document.querySelectorAll(".Language-name")
const Languagebtn=document.getElementById("Language")
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

Language.forEach(btn => {
  btn.addEventListener("click", () => {
    const lang = btn.textContent.trim().toLowerCase() === "kiswahili" ? "sw" : "en";
    applyLanguage(lang);
    Languages.style.display = "none";
  });
});
if(Languagebtn){
Languagebtn.addEventListener("click",() => {
  Languages.style.display="block";
});
}
