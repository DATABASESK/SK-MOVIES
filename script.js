const apiUrls = {
  tamil: "https://final-rj4x.onrender.com/tamil",
  hollywood: "https://final-rj4x.onrender.com/hollywood",
  multi: "https://final-rj4x.onrender.com/multi",
  ott: "https://final-rj4x.onrender.com/TV",
};

const sectionTitle = document.getElementById("section-title");
const movieList = document.getElementById("movie-list");
const drawer = document.getElementById("drawer");
const mainContent = document.getElementById("main-content");

const toggleDrawer = () => {
  drawer.classList.toggle("open");
  mainContent.classList.toggle("drawer-open");
  if (drawer.classList.contains("open")) {
    // Close the drawer after 3 seconds
    setTimeout(() => {
      drawer.classList.remove("open");
      mainContent.classList.remove("drawer-open");
    }, 3000);
  }
};

const loadContent = async (category) => {
  try {
    const apiUrl = apiUrls[category];
    const response = await fetch(apiUrl);
    const movies = await response.json();
    sectionTitle.textContent =
      category.charAt(0).toUpperCase() + category.slice(1) + " Movies";
    displayMovies(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

const displayMovies = (movies) => {
  movieList.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.tabIndex = 0;  // Make movie card focusable
    movieCard.innerHTML = `
      <img src="${movie.uri}" alt="${movie.name}">
      <p>${movie.name}</p>
    `;
    movieCard.onclick = () => {
      // Open movie link in a new tab automatically
      window.open(movie.link, "_blank");
    };
    movieCard.onkeydown = (event) => {
      if (event.key === "Enter") {
        window.open(movie.link, "_blank");
      }
    };
    movieList.appendChild(movieCard);
  });

  // Focus the first movie card after loading the content
  if (movieList.firstChild) {
    movieList.firstChild.focus();
  }
};

// Load default category (Tamil Movies) on load
loadContent("tamil");

// Listen for the left arrow key to toggle the drawer
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    toggleDrawer();
  }
});
