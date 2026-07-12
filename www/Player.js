

document.addEventListener("DOMContentLoaded", ()=>{
  
  // media.js
window.initMediaControls = function(audio, play) {
  const MediaSession = window.Capacitor?.Plugins?.MediaSession;

  if (!MediaSession || window.controlsInitialized) return;

  window.controlsInitialized = true;

  MediaSession.setActionHandler({ action: "play" }, async () => {
    await audio.play();
    play.textContent = "▶";
    MediaSession.setPlaybackState({
      playbackState: "playing"
    });
  });

  MediaSession.setActionHandler({ action: "pause" }, async () => {
    audio.pause();
    play.textContent = "⏯";
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

});