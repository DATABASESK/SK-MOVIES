const drawer = document.getElementById("drawer");
const movieList = document.getElementById("movie-list");
const sectionTitle = document.getElementById("section-title");

const apiUrls = {
  tamil: "https://final-rj4x.onrender.com/tamil",
  hollywood: "https://final-rj4x.onrender.com/hollywood",
  multi: "https://final-rj4x.onrender.com/multi",
  ott: "https://final-rj4x.onrender.com/TV",
  netflix: "https://final-rj4x.onrender.com/SK",
};

let touchStartX = 0;
let touchEndX = 0;

// Open the drawer
const openDrawer = () => {
  drawer.classList.add("open");
};

// Close the drawer
const closeDrawer = () => {
  drawer.classList.remove("open");
};

// Detect swipe gestures
const handleTouchStart = (event) => {
  touchStartX = event.touches[0].clientX;
};

const handleTouchMove = (event) => {
  touchEndX = event.touches[0].clientX;
};

const handleTouchEnd = () => {
  if (touchStartX - touchEndX > 50) {
    closeDrawer(); // Swipe left to close
  } else if (touchEndX - touchStartX > 50) {
    openDrawer(); // Swipe right to open
  }
};

// Add swipe event listeners
document.addEventListener("touchstart", handleTouchStart, { passive: true });
document.addEventListener("touchmove", handleTouchMove, { passive: true });
document.addEventListener("touchend", handleTouchEnd);

// Listen for keyboard navigation
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    openDrawer();
  } else if (event.key === "ArrowRight") {
    closeDrawer();
  } else {
    handleMovieCardNavigation(event);
  }
});

// Load content from the API
const loadContent = async (category) => {
  try {
    const apiUrl = apiUrls[category];
    const response = await fetch(apiUrl);
    const movies = await response.json();
    sectionTitle.textContent =
      category.charAt(0).toUpperCase() + category.slice(1) + " Movies";
    displayMovies(movies);
    closeDrawer(); // Close drawer after selection
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

// Display movies in the grid
const displayMovies = (movies) => {
  movieList.innerHTML = "";
  movies.forEach((movie, index) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.tabIndex = index === 0 ? 0 : -1; // Only the first card is focusable by default
    movieCard.dataset.index = index; // Save index for navigation
    movieCard.dataset.row = Math.floor(index / 3); // Row number based on the index
    movieCard.dataset.column = index % 3; // Column number based on the index
    movieCard.innerHTML = `
      <img src="${movie.uri}" alt="${movie.name}">
      <p>${movie.name}</p>
    `;
    movieCard.onclick = () => {
      window.open(movie.link, "_blank"); // Open video in a new tab
    };
    movieList.appendChild(movieCard);
  });
  movieList.firstChild.focus(); // Focus the first card
};

// Navigate movie cards with arrow keys
const handleMovieCardNavigation = (event) => {
  const focusedElement = document.activeElement;
  if (!focusedElement.classList.contains("movie-card")) return;

  const cards = Array.from(document.querySelectorAll(".movie-card"));
  const currentIndex = parseInt(focusedElement.dataset.index, 10);
  const columns = 3; // Number of columns in the grid (adjust as per the grid style)

  let nextIndex = currentIndex;

  switch (event.key) {
    case "ArrowUp":
      // Move up: only if there's a card in the row above
      if (focusedElement.dataset.row > 0) {
        nextIndex = currentIndex - columns;
      }
      break;
    case "ArrowDown":
      // Move down: only if there's a card in the row below
      if (focusedElement.dataset.row < Math.floor(cards.length / columns)) {
        nextIndex = currentIndex + columns;
      }
      break;
    case "ArrowLeft":
      // Move left: only if we're not at the first column
      if (focusedElement.dataset.column > 0) {
        nextIndex = currentIndex - 1;
      }
      break;
    case "ArrowRight":
      // Move right: only if we're not at the last column
      if (focusedElement.dataset.column < columns - 1) {
        nextIndex = currentIndex + 1;
      }
      break;
    default:
      return;
  }

  // Update tabIndex and focus for next movie card
  cards[currentIndex].tabIndex = -1; // Remove focusability from current card
  cards[nextIndex].tabIndex = 0; // Add focusability to next card
  cards[nextIndex].focus(); // Move focus
};

// Load default category (Tamil Movies)
loadContent("tamil");
