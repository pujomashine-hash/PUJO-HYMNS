
const Themechange=document.getElementById("theme")
if(Themechange) {
const Savedtheme=localStorage.getItem("theme")
if(Savedtheme==="light"){
  document.body.classList.add("light-mode")
}
Themechange.addEventListener("click",()=>{
  document.body.classList.toggle("light-mode")

if(document.body.classList.contains("light-mode")){
  localStorage.setItem("theme","light")
}else {
  localStorage.setItem("theme","dark")
}
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