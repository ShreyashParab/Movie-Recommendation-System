document.addEventListener("DOMContentLoaded", function () {
  // Function to fetch and display movie details based on URL parameter
  function fetchMovieDetails() {
    // Extract movie title from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    let movieTitle = urlParams.get("title");
    let omdbURL = `https://www.omdbapi.com/?apikey=8dcb5239&t=${encodeURIComponent(
      movieTitle
    )}`;

    //   Fetch movie details
    fetch(omdbURL)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // document.getElementsByTagName('title').innerText = `${data.Title}`
        document.getElementById('pageTitle').innerHTML = `${data.Title}`
        let genreArray = data.Genre;
        let genreData = genreArray.split(",");
        let movieDetailsOuterContainer = document.getElementById(
          "movie_details_outer_container"
        );
        movieDetailsOuterContainer.innerHTML = `
                  <div class="movie_details_container">
                      <div class="movie_poster">
                          <img src='${data.Poster}' alt="godfather">
                      </div>
                      <div class="movie_desc">
                          <div class="movie_header">
                              <div class="movie_title">
                                  ${data.Title}
                              </div>
                              <div class="movie_small_desc">
                                  <div class="genre_age_year_runtime">
                                      ${data.Genre} • ${data.Rated} • ${
          data.Year
        } • ${data.Runtime}
                                  </div>
                                  <div class="movie_btns">
                                      <div class="fav" id="fav" onclick="addToFavourites('${
                                        data.Title
                                      }', '${data.Poster}')">
                                          <img src="../static/assets/heart-line.png" title="Add to Favourites" width="30px" alt="heart">
                                      </div>
                                      <div class="watchlater" id="watchlater" onclick="addToWatchLater('${
                                        data.Title
                                      }', '${data.Poster}')">
                                          <img src="../static/assets/time-line.png" title="Add to watchlater" width="30px" alt="watchlater">
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="main_desc">
                              <div class="left_desc">
                                  <div class="rating">
                                      <b>Rating :</b> <img src="../static/assets/star-fill.png" width="30px" alt=""> ${
                                        data.imdbRating
                                      }
                                  </div>
                                  <div class="plot">
                                      <b>Plot :</b> 
                                      <p>${data.Plot}</p>
                                  </div>
                                  <div class="cast">
                                      <b>Cast : </b>
                                      <p>${data.Actors}</p>
                                  </div>
                                  <div class="crew">
                                      <div class="director">
                                          <b>Directors :</b>
                                          <p>${data.Director}</p>
                                      </div>
                                      <div class="writer">
                                          <b>Writers :</b>
                                          <p>${data.Writer}</p>
                                      </div>
                                  </div>
                              </div>
                              <div class="right_desc">
                                  <div class="genre_floater">
                                      <b>Genre :</b>
                                      <p>
                                          <span>${genreData[0]}</span>
                                          ${
                                            genreData[1]
                                              ? `<span>${genreData[1]}</span>`
                                              : ""
                                          }
                                      </p>  
                                  </div>
                                  <div class="realease_date">
                                      <b>Release Date :</b>
                                      <p>${data.Released}</p>
                                  </div>
                                  <div class="runtime">
                                      <b>Runtime :</b>
                                      <p>${data.Runtime}</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              `;

        // Add event listeners for fav and watchlater buttons
        let favBtn = document.getElementById("fav");
        let watchlaterBtn = document.getElementById("watchlater");

        checkFavouriteStatus(data.Title, favBtn);

        // Check and update the watch later button state
        checkWatchLaterStatus(data.Title, watchlaterBtn);
      })
      .catch((error) => {
        console.error("Error fetching movie details:", error);
        // Handle errors, such as displaying an error message to the user
      });
  }

  fetchMovieDetails();
});

// let favBtn = document.getElementById("fav");
// let watchlaterBtn = document.getElementById("watchlater");

// let fav = false;
// let watchlater = false;
function addToFavourites(title, poster) {
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  const movieIndex = favourites.findIndex((fav) => fav.title === title);

  if (movieIndex === -1) {
    let movie = { title, poster };
    favourites.push(movie);
    localStorage.setItem("favourites", JSON.stringify(favourites));

    Swal.fire({
      icon: 'success',
      title: 'Added to Favourites',
      text: `${title} has been added to your favourites.`,
      timer: 2000,
      showConfirmButton: true
    });

    document.getElementById("fav").innerHTML = `<img src="../static/assets/heart-fill.png" title="Remove from Favourites" width="30px" alt="heart">`;
  } else {
    favourites.splice(movieIndex, 1);
    localStorage.setItem("favourites", JSON.stringify(favourites));
    
    Swal.fire({
      icon: 'success',
      title: 'Removed from Favourites',
      text: `${title} has been removed from your favourites.`,
      timer: 2000,
      showConfirmButton: true
    });

    document.getElementById("fav").innerHTML = `<img src="../static/assets/heart-line.png" title="Add to Favourites" width="30px" alt="heart">`;
  }
}

function addToWatchLater(title, poster) {
  let watchlaterList = JSON.parse(localStorage.getItem("watchlater")) || [];

  // Check if the movie is already in Watch Later
  const movieIndex = watchlaterList.findIndex((movie) => movie.title === title);

  const watchlaterBtn = document.getElementById("watchlater");

  if (movieIndex === -1) {
      // Movie is not in Watch Later, add it
      let movie = { title, poster };
      watchlaterList.push(movie);
      localStorage.setItem("watchlater", JSON.stringify(watchlaterList));

      Swal.fire({
        icon: 'success',
        title: 'Added to Watchlater',
        text: `${title} has been added to watchlater.`,
        timer: 2000,
        showConfirmButton: true
      });

      // Change the button state
      watchlaterBtn.innerHTML = `<img src="../static/assets/time-fill.png" title="Remove from Watch Later" width="30px" alt="time">`;
  } else {
      // Movie is in Watch Later, remove it
      watchlaterList.splice(movieIndex, 1);
      localStorage.setItem("watchlater", JSON.stringify(watchlaterList));

      Swal.fire({
        icon: 'success',
        title: 'Removed from Favourites',
        text: `${title} has been removed from your favourites.`,
        timer: 2000,
        showConfirmButton: true
      });

      // Change the button state
      watchlaterBtn.innerHTML = `<img src="../static/assets/time-line.png" title="Add to Watch Later" width="30px" alt="time">`;
  }
}

function checkFavouriteStatus(title, favBtn) {
  let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  const movieExists = favourites.some((fav) => fav.title === title);

  if (movieExists) {
    favBtn.innerHTML = `<img src="../static/assets/heart-fill.png" title="Remove from Favourites" width="30px" alt="heart">`;
  } else {
    favBtn.innerHTML = `<img src="../static/assets/heart-line.png" title="Add to Favourites" width="30px" alt="heart">`;
  }
}

function checkWatchLaterStatus(title, watchlaterBtn) {
  let watchlaterList = JSON.parse(localStorage.getItem("watchlater")) || [];
  const movieExists = watchlaterList.some((movie) => movie.title === title);

  if (movieExists) {
    watchlaterBtn.innerHTML = `<img src="../static/assets/time-fill.png" title="Remove from Watch Later" width="30px" alt="time">`;
  } else {
    watchlaterBtn.innerHTML = `<img src="../static/assets/time-line.png" title="Add to Watch Later" width="30px" alt="time">`;
  }
}

function clearAll() {
  localStorage.removeItem('favourites');
  localStorage.removeItem('watchlater');
  loadFavourites();
  loadWatchLater();
}

function loadFavourites() {
  const favourites = JSON.parse(localStorage.getItem('favourites')) || [];
  const favouritesContainer = document.getElementById('favouritesContainer');
  favouritesContainer.innerHTML = '';

  if (favourites.length === 0) {
      const noFavouritesMessage = document.createElement('div');
      noFavouritesMessage.textContent = "You don't have any favourite movies.";
      noFavouritesMessage.className = 'empty-message';
      favouritesContainer.appendChild(noFavouritesMessage);
  } else {
      favourites.forEach(movie => {
          const movieCard = document.createElement('div');
          movieCard.className = 'favourite-movie card';
          movieCard.style.width = '15rem';

          const moviePoster = document.createElement('img');
          moviePoster.src = movie.poster;
          moviePoster.className = 'card-img-top';
          moviePoster.alt = movie.title;

          const movieTitle = document.createElement('h5');
          movieTitle.className = 'card-title';
          movieTitle.textContent = movie.title;

          movieCard.appendChild(moviePoster);
          movieCard.appendChild(movieTitle);

          movieCard.addEventListener("click", function() {
              window.location.href = `/movie_details?title=${encodeURIComponent(movie.title)}`;
          });

          favouritesContainer.appendChild(movieCard);
      });
  }
}

function loadWatchLater() {
  const watchlaterList = JSON.parse(localStorage.getItem('watchlater')) || [];
  const watchlaterContainer = document.getElementById('watchlaterContainer');
  watchlaterContainer.innerHTML = '';

  if (watchlaterList.length === 0) {
      const noWatchLaterMessage = document.createElement('div');
      noWatchLaterMessage.textContent = "You don't have any movies in Watch Later.";
      noWatchLaterMessage.className = 'empty-message';
      watchlaterContainer.appendChild(noWatchLaterMessage);
  } else {
      watchlaterList.forEach(movie => {
          const movieCard = document.createElement('div');
          movieCard.className = 'watchlater-movie card';
          movieCard.style.width = '15rem';

          const moviePoster = document.createElement('img');
          moviePoster.src = movie.poster;
          moviePoster.className = 'card-img-top';
          moviePoster.alt = movie.title;

          const movieTitle = document.createElement('h5');
          movieTitle.className = 'card-title';
          movieTitle.textContent = movie.title;

          movieCard.appendChild(moviePoster);
          movieCard.appendChild(movieTitle);

          movieCard.addEventListener("click", function() {
              window.location.href = `/movie_details?title=${encodeURIComponent(movie.title)}`;
          });

          watchlaterContainer.appendChild(movieCard);
      });
  }
}

window.onload = function () {
  loadFavourites();
  loadWatchLater();
};

window.onload = function () {
  loadFavourites();
  loadWatchLater();
};

function fetchMovie(title) {
  console.log(title);
  window.location.href = `/movie_details?title=${encodeURIComponent(title)}`;
}

const navbar = document.getElementById("navbar");
const menu = document.querySelector(".menu");
const links = document.querySelector(".links");

let flag = false;
menu.addEventListener("click", function () {
  if (window.innerWidth < 501) {
    if (!flag) {
      flag = true;
      navbar.style.backgroundColor = "black";
      links.style.display = "flex";
      links.style.height = "100vh";
      links.style.transition = "0.5s ease-in";
    } else {
      flag = false;
      navbar.style.backgroundColor = "transparent";
      links.style.display = "none";
      links.style.height = "auto";
    }
  }
});
