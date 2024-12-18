const apiUrls = {
  tamil: "https://final-rj4x.onrender.com/tamil",
  hollywood: "https://final-rj4x.onrender.com/hollywood",
  multi: "https://final-rj4x.onrender.com/multi",
  ott: "https://final-rj4x.onrender.com/TV",
  netflix: "https://final-rj4x.onrender.com/PRIVATE",
};

const drawer = document.getElementById("drawer");
const movieList = document.getElementById("movie-list");
const sectionTitle = document.getElementById("section-title");
const modal = document.getElementById("modal");
const moviePoster = document.getElementById("movie-poster");
const playButton = document.getElementById("play-button");
let currentMovieLink = "";

// Toggle drawer visibility with Arrow keys
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    drawer.classList.add("open");
  } else if (event.key === "ArrowRight" && drawer.classList.contains("open")) {
    drawer.classList.remove("open");
  }
});

// Fetch and display movies
const loadContent = async (category) => {
  try {
    const response = await fetch(apiUrls[category]);
    const movies = await response.json();
    sectionTitle.textContent =
      category.charAt(0).toUpperCase() + category.slice(1) + " Movies";
    displayMovies(movies);
    drawer.classList.remove("open");
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

// Display movies in grid
const displayMovies = (movies) => {
  movieList.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.innerHTML = `
      <img src="${movie.uri}" alt="${movie.name}">
      <p>${movie.name}</p>
    `;
    movieCard.onclick = () => {
      openMoviePoster(movie);
    };
    movieList.appendChild(movieCard);
  });
};

// Open movie poster with play button
const openMoviePoster = (movie) => {
  moviePoster.src = movie.uri;
  currentMovieLink = movie.link;
  playButton.href = currentMovieLink; // Set the video link to the play button
  modal.style.display = "flex";
};

// Close modal when clicking outside
modal.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Load Tamil movies by default
loadContent("tamil");
