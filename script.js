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

// Listen for keyboard arrows
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    openDrawer();
  } else if (event.key === "ArrowRight") {
    closeDrawer();
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

// Display movies in the horizontal scrollable container
const displayMovies = (movies) => {
  movieList.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.tabIndex = 0; // Enable focus for keyboard navigation
    movieCard.innerHTML = `
      <img src="${movie.uri}" alt="${movie.name}">
      <p>${movie.name}</p>
    `;
    movieCard.onclick = () => {
      window.open(movie.link, "_blank"); // Open video in a new tab
    };
    movieList.appendChild(movieCard);
  });
};

// Load default category (Tamil Movies)
loadContent("tamil");
