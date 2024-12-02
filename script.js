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
let touchStartY = 0; // Starting Y position of the touch
let touchEndX = 0;   // Ending X position of the touch
let touchEndY = 0;   // Ending Y position of the touch

// Toggle drawer visibility with Arrow keys
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    drawer.classList.add("open");
    focusIndex = -1; // Reset movie focus when opening the drawer
  } else if (event.key === "ArrowRight" && drawer.classList.contains("open")) {
    drawer.classList.remove("open");
  } else if (drawer.classList.contains("open")) {
    return; // Skip movie navigation when drawer is open
  } else if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    navigateMovies(event.key);
  } else if (event.key === "Enter" && focusIndex >= 0) {
    openMovieLink();
  }
});

// Touch listeners for swipe gestures
document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
  touchStartY = event.changedTouches[0].screenY;
});

document.addEventListener("touchend", (event) => {
  touchEndX = event.changedTouches[0].screenX;
  touchEndY = event.changedTouches[0].screenY;

  // Only handle swipe gestures if horizontal movement is significant
  const horizontalSwipeDistance = Math.abs(touchEndX - touchStartX);
  const verticalSwipeDistance = Math.abs(touchEndY - touchStartY);

  if (horizontalSwipeDistance > verticalSwipeDistance && horizontalSwipeDistance > 50) {
    handleSwipeGesture();
  }
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
      openMovieInWebView(movie.link); // Open movie link in the same tab
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

// Open the movie link in WebView (iframe)
const openMovieInWebView = (movieLink) => {
  let webview = document.getElementById("movie-webview");

  // If WebView doesn't exist, create one
  if (!webview) {
    webview = document.createElement("iframe");
    webview.id = "movie-webview";  // Assign an ID to the iframe for easy reference
    webview.style.width = "100%";   // Full width
    webview.style.height = "100vh"; // Full screen height
    webview.style.border = "none"; // No border
    document.body.appendChild(webview); // Add the iframe to the body
  }

  // Set the source of the iframe to the movie link
  webview.src = movieLink;

  // Optionally, hide or disable other elements when WebView is active
  movieList.style.display = "none";  // Hide movie list, for example
  drawer.style.display = "none";     // Hide drawer if necessary

  // Add close button for exiting WebView
  let closeButton = document.getElementById("close-webview");
  if (!closeButton) {
    closeButton = document.createElement("button");
    closeButton.id = "close-webview";
    closeButton.textContent = "Close";
    closeButton.onclick = closeWebView;
    document.body.appendChild(closeButton);
  }
};

// Close the WebView and return to the movie list
const closeWebView = () => {
  const webview = document.getElementById("movie-webview");
  if (webview) {
    webview.remove(); // Remove the iframe
    movieList.style.display = "block"; // Show the movie list again
    drawer.style.display = "block";    // Show the drawer again
  }

  // Remove the close button
  const closeButton = document.getElementById("close-webview");
  if (closeButton) {
    closeButton.remove();
  }
};

// Load Tamil movies by default on page load
loadContent("tamil");
