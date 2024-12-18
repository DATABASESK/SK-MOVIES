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
let focusIndex = -1;
let touchStartX = 0;
let touchEndX = 0;

// Toggle drawer visibility with Arrow keys
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    drawer.classList.add("open");
    focusIndex = -1;
  } else if (event.key === "ArrowRight" && drawer.classList.contains("open")) {
    drawer.classList.remove("open");
  } else if (drawer.classList.contains("open")) {
    return;
  } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    navigateMovies(event.key);
  } else if (event.key === "Enter" && focusIndex >= 0) {
    openMovieLink();
  }
});

// Touch listeners for swipe gestures
document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener("touchend", (event) => {
  touchEndX = event.changedTouches[0].screenX;
  handleSwipeGesture();
});

// Handle swipe gestures
const handleSwipeGesture = () => {
  const swipeDistance = touchEndX - touchStartX;
  if (swipeDistance > 50 && drawer.classList.contains("open")) {
    drawer.classList.remove("open");
  } else if (swipeDistance < -50 && !drawer.classList.contains("open")) {
    drawer.classList.add("open");
    focusIndex = -1;
  }
};

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
  focusIndex = 0;
  movies.forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.tabIndex = 0;
    movieCard.setAttribute("data-link", movie.link);
    movieCard.innerHTML = `
      <img src="${movie.uri}" alt="${movie.name}">
      <p>${movie.name}</p>
    `;
    movieCard.onclick = () => {
      window.open(movie.link, "_blank");
    };
    movieList.appendChild(movieCard);
  });
  focusMovie(focusIndex);
};

// Navigate movie cards
const navigateMovies = (key) => {
  const movieCards = document.querySelectorAll(".movie-card");
  if (movieCards.length === 0) return;
  const numColumns = window.innerWidth >= 600 ? 4 : 2;
  switch (key) {
    case "ArrowRight":
      focusIndex = (focusIndex + 1) % movieCards.length;
      break;
    case "ArrowLeft":
      focusIndex = (focusIndex - 1 + movieCards.length) % movieCards.length;
      break;
    case "ArrowDown":
      focusIndex = Math.min(focusIndex + numColumns, movieCards.length - 1);
      break;
    case "ArrowUp":
      focusIndex = Math.max(focusIndex - numColumns, 0);
      break;
  }
  focusMovie(focusIndex);
};

// Focus movie card
const focusMovie = (index) => {
  const movieCards = document.querySelectorAll(".movie-card");
  if (movieCards.length > 0) {
    movieCards.forEach((card) => card.blur());
    if (index >= 0 && index < movieCards.length) {
      movieCards[index].focus();
    }
  }
};

// Open movie link
const openMovieLink = () => {
  const movieCards = document.querySelectorAll(".movie-card");
  if (focusIndex >= 0 && focusIndex < movieCards.length) {
    const selectedCard = movieCards[focusIndex];
    const link = selectedCard.getAttribute("data-link");
    if (link) {
      window.open(link, "_blank");
    }
  }
};

// Load Tamil movies by default
loadContent("tamil");
