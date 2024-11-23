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
};

const loadContent = async (category) => {
  try {
    const apiUrl = apiUrls[category];
    const response = await fetch(apiUrl);
    const movies = await response.json();
    sectionTitle.textContent =
      category.charAt(0).toUpperCase() + category.slice(1) + " Movies";
    displayMovies(movies);
    toggleDrawer(); // Close the drawer after selection
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

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
      // Open movie link in a new tab automatically
      window.open(movie.link, "_blank");
    };
    movieList.appendChild(movieCard);
  });
};

// Load default category (Tamil Movies) on load
loadContent("tamil");
