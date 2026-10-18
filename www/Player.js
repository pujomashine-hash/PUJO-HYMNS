
document.addEventListener("DOMContentLoaded", ()=>{
  const playing = document.getElementById("playing");
const Downloadbtn = document.getElementById("download-btn");
  const play = document.getElementById("play");
  const MediaSession = window.Capacitor?.Plugins?.MediaSession;
  
function setPlayIcon(icon) {
  play.innerHTML = `
    <img class="toggle-icon"
         src="icons/${icon}.svg"
         alt="">
  `;
}
  
  // media.js
window.initMediaControls = function(audio, play) {
  const MediaSession = window.Capacitor?.Plugins?.MediaSession;

  if (!MediaSession || window.controlsInitialized) return;

  window.controlsInitialized = true;

  MediaSession.setActionHandler({ action: "play" }, async () => {
    await audio.play();
    setPlayIcon("play")
    MediaSession.setPlaybackState({
      playbackState: "playing"
    });
  });

  MediaSession.setActionHandler({ action: "pause" }, async () => {
    audio.pause();
    setPlayIcon("pause")
    MediaSession.setPlaybackState({
      playbackState: "paused"
    });
  });
};
  
const progress = document.getElementById("progress");
const audio = document.getElementById("audio");
if(audio){
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = percent + "%";
  }
});
}



//Seek when user clicks on progress bar
const progressContainer=document.getElementById("progress-container")
if(progressContainer){
progressContainer.addEventListener("click", (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;
  const percent = clickX / width;
  audio.currentTime = percent * audio.duration;
});
}
if(audio){
audio.addEventListener("error", () => {
  playing.textContent = "❌ Audio not available";
  Downloadbtn.textContent="❔"
});
}

  if (audio && play) {
  initMediaControls(audio, play);
  }

play.addEventListener("click", async () => {

  if (audio.paused) {

    await audio.play();

    MediaSession?.setPlaybackState({
      playbackState: "playing"
    });

    setPlayIcon("pause")

  } else {

    audio.pause();

    MediaSession?.setPlaybackState({
      playbackState: "paused"
    });

    setPlayIcon("play")

}
  })
  
});