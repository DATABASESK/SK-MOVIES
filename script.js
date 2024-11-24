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

/* Toggle Drawer on Left Key */
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    drawer.classList.toggle("open");
  } else if (event.key === "ArrowRight" && drawer.classList.contains("open")) {
    drawer.classList.remove("open");
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
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.innerHTML = `
      <img src="${movie.uri}" alt="${movie.name}">
      <p>${movie.name}</p>
    `;
    movieCard.onclick = () => {
      // Open movie link in the same tab
      window.open(movie.link, "_blank");
    };
    movieList.appendChild(movieCard);
  });
};

/* Load Default Content */
loadContent("tamil");
