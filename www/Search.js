
// SEARCH 
const searchInput = document.getElementById("search");

if (searchInput) {
  searchInput.addEventListener("keyup", () => {
    const searchValue = searchInput.value.toLowerCase();

    document.querySelectorAll(".nyimbo").forEach(btn => {
      const title = btn.querySelector(".title").textContent.toLowerCase();
      const artist = btn.querySelector(".artist").textContent.toLowerCase();

      if (title.includes(searchValue) || artist.includes(searchValue)) {
        btn.style.display = "";
      } else {
        btn.style.display = "none";
      }
    });
  });
}