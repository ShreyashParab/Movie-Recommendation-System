document.addEventListener("DOMContentLoaded", function () {
  function fetchTop10PopularMovies() {
    let popularMovie = document.getElementById("popular_movies");
    popularMovie.innerHTML = ``;
    fetch("/top_10_popular_movies")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // data.reverse();
        data.forEach((movie) => {
          let card = document.createElement("div");
          card.classList.add("card", "col");
          card.id = "movieDesc";
          card.style.width = "15rem";
          card.setAttribute("data-title", movie.title);
          // card.style.height = '300px'

          let poster = document.createElement("img");
          poster.classList.add("card-img-top");
          poster.src = movie.poster;
          poster.alt = movie.title;

          let title = document.createElement("h5");
          title.classList.add("card-title");
          title.textContent = movie.title;

          card.appendChild(poster);
          card.appendChild(title);

          card.addEventListener("click", function () {
            // Redirect to movie details page with movie title as URL parameter
            window.location.href = `/movie_details?title=${encodeURIComponent(
              movie.title
            )}`;
            // console.log(movie.title)
            // fetchMovieDetails(movie.title)
          });
          // card.appendChild(cardBody);
          popularMovie.appendChild(card);
        });
      })
      .catch((error) => {
        console.error("Error fetching top 10 movies:", error);
      });
  }

  fetchTop10PopularMovies();

  fetch("/api/top_movies")
    .then((response) => response.json())
    .then((data) => populateMovies(data))
    .catch((error) => console.error("Error fetching top movies:", error));

    const genres = ["Action", "Adventure",  "Comedy", "Crime", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Science Fiction", "Thriller"];
    const genreList = document.getElementById('genreList');

    genres.forEach(genre => {
      const genreItem = document.createElement('li');
      genreItem.className = 'list-group-item';
      genreItem.textContent = genre;
      genreItem.addEventListener('click', function () {
         document.getElementById('popular').style.display = 'none'
         document.getElementById('moviesContainer').style.display = 'grid'
         document.getElementById('genre_header').innerHTML = `Top ${genre} Movies`

          fetch(`/api/top_movies_by_genre/${genre}`)
              .then(response => response.json())
              .then(data => populateMovies(data))
              .catch(error => console.error(`Error fetching top movies for genre ${genre}:`, error));
      });
      genreList.appendChild(genreItem);
    });

    function populateMovies(movies) {
      const moviesContainer = document.getElementById('moviesContainer');
      moviesContainer.innerHTML = '';
      movies.forEach(movie => {
        console.log(movie.genre)
          const movieCard = `
                  <div class="card mb-4" style="width:15rem;" onclick="goToMovieDetail('${movie.title}')">
                      <img src="${movie.poster}" class="card-img-top" alt="${movie.title}">
                      <div class="card-body">
                          <h5 class="card-title">${movie.title}</h5>
                      </div>
                  </div>`;
                  
                  moviesContainer.innerHTML += movieCard;
      });
    }

  });
  function goToMovieDetail(title){
    window.location.href = `/movie_details?title=${encodeURIComponent(title)}`;
  }
