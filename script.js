const apiUrls = {
  tamil: "https://final-rj4x.onrender.com/tamil",
  hollywood: "https://final-rj4x.onrender.com/hollywood",
  multi: "https://final-rj4x.onrender.com/multi",
  ott: "https://final-rj4x.onrender.com/TV",
  netflix: "https://final-rj4x.onrender.com/SK",
};

const sectionTitle = document.getElementById("section-title");
const movieList = document.getElementById("movie-list");
const videoPlayer = document.getElementById("video-player");
const videoFrame = document.getElementById("video-frame");
const drawer = document.getElementById("drawer");

let drawerOpen = false;

// Toggle drawer visibility when the left key is pressed
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    toggleDrawer();
  }
});

// Function to toggle drawer
const toggleDrawer = () => {
  drawerOpen = !drawerOpen;
  drawer.classList.toggle("open", drawerOpen);
};

// Function to load content based on the selected drawer item
const loadContent = async (category) => {
  try {
    const apiUrl = apiUrls[category];
    const response = await fetch(apiUrl);
    const movies = await response.json();
    sectionTitle.textContent =
      category.charAt(0).toUpperCase() + category.slice(1) + " Movies";
    displayMovies(movies);
    drawer.classList.remove("open");
    drawerOpen = false; // Automatically close the drawer
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

// Function to display movies in the grid
const displayMovies = (movies) => {
  movieList.innerHTML = "";
  movieList.style.display = "grid"; // Ensure grid is shown
  videoPlayer.style.display = "none"; // Hide the video player if visible
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.innerHTML = `
      <img src="${movie.uri}" alt="${movie.name}">
      <p>${movie.name}</p>
    `;
    movieCard.onclick = () => playVideo(movie.link);
    movieList.appendChild(movieCard);
  });
};

// Function to play the video
const playVideo = (videoLink) => {
  videoFrame.src = videoLink;
  movieList.style.display = "none";
  videoPlayer.style.display = "flex";
};

// Function to close the video player
const closeVideo = () => {
  videoFrame.src = "";
  videoPlayer.style.display = "none";
  movieList.style.display = "grid";
};

// Load default category (Tamil Movies) on load
loadContent("tamil");
