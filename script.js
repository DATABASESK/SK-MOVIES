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
let allMovies = []; // Global variable to hold all movies for filtering

// Function to search movies based on the movie name
const searchMovies = () => {
  const query = document.getElementById("search-bar").value.toLowerCase();
  const filteredMovies = allMovies.filter(movie =>
    movie.name.toLowerCase().includes(query)
  );
  displayMovies(filteredMovies);
};

// Function to fetch and display movies for a selected category
const loadContent = async (category) => {
  try {
    const apiUrl = apiUrls[category];
    const response = await fetch(apiUrl);
    const movies = await response.json();
    sectionTitle.textContent =
      category.charAt(0).toUpperCase() + category.slice(1) + " Movies";
    
    // Store the fetched movies for future filtering
    allMovies = movies;
    
    // Reset search bar when switching categories
    document.getElementById("search-bar").value = "";
    displayMovies(movies);
    drawer.classList.remove("open"); // Close the drawer automatically
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

// Render movie cards in a grid layout based on filtered movies
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

// Function to navigate through movie cards using arrow keys
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

// Function to focus the movie card at the specified index
const focusMovie = (index) => {
  const movieCards = document.querySelectorAll(".movie-card");
  if (movieCards.length > 0) {
    movieCards.forEach((card) => card.blur()); // Remove focus from all cards
    if (index >= 0 && index < movieCards.length) {
      movieCards[index].focus(); // Set focus on the selected card
    }
  }
};

// Function to open the link of the focused movie card
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

// General Styles
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: black;
  color: white;
  overflow: hidden; /* Prevent horizontal scrolling */
  height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Drawer */
.drawer {
  width: 250px;
  background-color: #222;
  position: fixed;
  top: 0;
  left: -250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 60px;
  border-right: 1px solid #444;
  transition: left 0.3s ease;
  z-index: 1000;
}

.drawer.open {
  left: 0;
}

.drawer a {
  color: white;
  text-decoration: none;
  padding: 15px 20px;
  transition: background-color 0.3s ease;
}

.drawer a:hover {
  background-color: #444;
}

/* Search Bar */
#search-bar {
  width: 90%;
  padding: 10px;
  margin: 15px 0;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  text-align: center;
}

/* Main Content */
.main {
  margin-left: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#section-title {
  padding: 20px;
  background-color: #111;
  margin: 0;
  text-align: center;
}

/* Movie List Grid */
.movie-list {
  display: grid;
  gap: 20px;
  padding: 20px;
  overflow-y: auto; /* Enable vertical scrolling */
  max-height: calc(100vh - 60px); /* Allow scrolling within the remaining space */
}

@media (min-width: 600px) {
  .movie-list {
    grid-template-columns: repeat(4, 1fr); /* 4 images per row for larger screens */
  }
}

@media (max-width: 599px) {
  .movie-list {
    grid-template-columns: repeat(2, 1fr); /* 2 images per row for smaller screens */
  }
}

.movie-card {
  background-color: #333;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  outline: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.movie-card:focus {
  border: 2px solid #fff;
}

.movie-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
}

.movie-card p {
  margin: 10px 0 0;
  color: white;
  font-size: 14px;
  word-wrap: break-word;
    }
