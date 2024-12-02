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
let focusIndex = -1; // Index for focus (-1 when no card is focused)
let touchStartX = 0; // Starting X position of the touch
let touchEndX = 0;   // Ending X position of the touch

// Toggle drawer visibility with Arrow keys
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    drawer.classList.add("open");
    focusIndex = -1; // Reset movie focus when opening the drawer
  } else if (event.key === "ArrowRight" && drawer.classList.contains("open")) {
    drawer.classList.remove("open");
  } else if (drawer.classList.contains("open")) {
    // Drawer navigation (skip movie navigation when drawer is open)
    return;
  } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    navigateMovies(event.key); // Navigate movie cards
  } else if (event.key === "Enter" && focusIndex >= 0) {
    openMovieLink(); // Open the focused movie link
  }
});

// Add touch listeners for swipe gestures
document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener("touchend", (event) => {
  touchEndX = event.changedTouches[0].screenX;
  handleSwipeGesture();
});

// Function to handle swipe gestures
const handleSwipeGesture = () => {
  const swipeDistance = touchEndX - touchStartX;

  if (swipeDistance > 50) {
    // Swipe Right: Close drawer
    if (drawer.classList.contains("open")) {
      drawer.classList.remove("open");
    }
  } else if (swipeDistance < -50) {
    // Swipe Left: Open drawer
    if (!drawer.classList.contains("open")) {
      drawer.classList.add("open");
      focusIndex = -1; // Reset focus
    }
  }
};

// Fetch and display movies for a selected category
const loadContent = async (category) => {
  try {
    const apiUrl = apiUrls[category];
    const response = await fetch(apiUrl);
    const movies = await response.json();
    sectionTitle.textContent =
      category.charAt(0).toUpperCase() + category.slice(1) + " Movies";
    displayMovies(movies);
    drawer.classList.remove("open"); // Close the drawer automatically
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

// Render movie cards in a grid layout
const displayMovies = (movies) => {
  movieList.innerHTML = ""; // Clear previous content
  focusIndex = 0; // Reset focus index
  movies.forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.tabIndex = 0; // Make each card focusable
    movieCard.setAttribute("data-link", movie.link); // Store link for navigation
    movieCard.innerHTML = `
      <img src="${movie.uri}" alt="${movie.name}">
      <p>${movie.name}</p>
    `;
    movieCard.onclick = () => {
      window.open(movie.link, "_blank"); // Open movie link in a new tab
    };
    movieList.appendChild(movieCard);
  });
  focusMovie(focusIndex); // Set initial focus
};

// Navigate through movie cards using arrow keys
const navigateMovies = (key) => {
  const movieCards = document.querySelectorAll(".movie-card");
  if (movieCards.length === 0) return; // No movies to navigate

  const numColumns = window.innerWidth >= 600 ? 4 : 2; // Determine grid columns
  const numRows = Math.ceil(movieCards.length / numColumns);

  // Calculate the next focus index based on the arrow key
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

// Focus the movie card at the specified index
const focusMovie = (index) => {
  const movieCards = document.querySelectorAll(".movie-card");
  if (movieCards.length > 0) {
    movieCards.forEach((card) => card.blur()); // Remove focus from all cards
    if (index >= 0 && index < movieCards.length) {
      movieCards[index].focus(); // Set focus on the selected card
    }
  }
};

// Open the link of the focused movie card
const openMovieLink = () => {
  const movieCards = document.querySelectorAll(".movie-card");
  if (movieCards.length > 0 && focusIndex >= 0 && focusIndex < movieCards.length) {
    const selectedCard = movieCards[focusIndex];
    const link = selectedCard.getAttribute("data-link");
    if (link) {
      window.open(link, "_blank"); // Open the movie link in a new tab
    }
  }
};

// Load Tamil movies by default on page load
loadContent("tamil");
