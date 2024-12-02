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
let movies = []; // Store all movies for search filtering

// Fetch and display movies for a selected category
const loadContent = async (category) => {
  try {
    const apiUrl = apiUrls[category];
    const response = await fetch(apiUrl);
    movies = await response.json();
    sectionTitle.textContent =
      category.charAt(0).toUpperCase() + category.slice(1) + " Movies";
    displayMovies(movies);
    drawer.classList.remove("open"); // Close the drawer automatically
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

// Render movie cards in a grid layout
const displayMovies = (movieArray) => {
  movieList.innerHTML = ""; // Clear previous content
  movieArray.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.innerHTML = `
      <img src="${movie.uri}" alt="${movie.name}">
      <p>${movie.name}</p>
    `;
    movieCard.onclick = () => {
      window.open(movie.link, "_blank");
    };
    movieList.appendChild(movieCard);
  });
};

// Filter movies based on search input
const filterMovies = () => {
  const searchQuery = document
    .getElementById("search-bar")
    .value.toLowerCase();
  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchQuery)
  );
  displayMovies(filteredMovies);
};

// Touch swipe functionality for drawer
let startX = 0;
document.addEventListener("touchstart", (event) => {
  startX = event.touches[0].clientX;
});

document.addEventListener("touchend", (event) => {
  const endX = event.changedTouches[0].clientX;
  if (endX - startX > 100) {
    drawer.classList.add("open"); // Swipe right to open
  } else if (startX - endX > 100) {
    drawer.classList.remove("open"); // Swipe left to close
  }
});

// Load Tamil movies by default on page load
loadContent("tamil");
