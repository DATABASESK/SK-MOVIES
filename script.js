const apiUrls = {
  tamil: "https://final-rj4x.onrender.com/tamil",
  hollywood: "https://final-rj4x.onrender.com/hollywood",
  multi: "https://final-rj4x.onrender.com/multi",
  ott: "https://final-rj4x.onrender.com/TV",
  netflix: "https://final-rj4x.onrender.com/SK",
};

const drawer = document.getElementById("drawer");
const movieList = document.getElementById("movie-list");
const sectionTitle = document.getElementById("section-title");
let focusIndex = 0; // Keep track of the focused movie

/* Toggle Drawer on Left Key */
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    drawer.classList.add("open");
  } else if (event.key === "ArrowRight" && drawer.classList.contains("open")) {
    drawer.classList.remove("open");
  } else if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
    navigateMovies(event.key); // Handle movie navigation
  } else if (event.key === "Enter") {
    openMovieLink(); // Open movie link on Enter key
  }
});

/* Fetch and Display Movies */
const loadContent = async (category) => {
  try {
    const apiUrl = apiUrls[category];
    const response = await fetch(apiUrl);
    const movies = await response.json();
    sectionTitle.textContent =
      category.charAt(0).toUpperCase() + category.slice(1) + " Movies";
    displayMovies(movies);
    drawer.classList.remove("open"); // Automatically close drawer after selection
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

/* Display Movies in Grid */
const displayMovies = (movies) => {
  movieList.innerHTML = ""; // Clear previous content
  focusIndex = 0; // Reset focus index
  movies.forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.tabIndex = 0; // Make it focusable
    movieCard.setAttribute("data-link", movie.link); // Store link for navigation
    movieCard.innerHTML = `
      <img src="${movie.uri}" alt="${movie.name}">
      <p>${movie.name}</p>
    `;
    movieCard.onclick = () => {
      window.open(movie.link, "_blank"); // Open link in a new tab
    };
    movieList.appendChild(movieCard);
  });
  focusMovie(focusIndex); // Set initial focus
};

/* Handle Navigation with Arrow Keys */
const navigateMovies = (key) => {
  const movieCards = document.querySelectorAll(".movie-card");
  if (movieCards.length === 0) return; // No movies to navigate

  const numColumns = window.innerWidth >= 600 ? 4 : 2; // Determine grid columns
  const numRows = Math.ceil(movieCards.length / numColumns);

  // Calculate next focus index based on key press
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

/* Set Focus to the Selected Movie */
const focusMovie = (index) => {
  const movieCards = document.querySelectorAll(".movie-card");
  if (movieCards.length > 0) {
    movieCards.forEach((card) => card.blur()); // Remove focus from all cards
    movieCards[index].focus(); // Focus the selected card
  }
};

/* Open Movie Link on Enter Key */
const openMovieLink = () => {
  const movieCards = document.querySelectorAll(".movie-card");
  if (movieCards.length > 0 && focusIndex < movieCards.length) {
    const selectedCard = movieCards[focusIndex];
    const link = selectedCard.getAttribute("data-link");
    if (link) {
      window.open(link, "_blank"); // Open the link in a new tab
    }
  }
};

/* Load Default Content */
loadContent("tamil");
