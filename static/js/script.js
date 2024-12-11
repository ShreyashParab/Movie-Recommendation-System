document.addEventListener("DOMContentLoaded", function () {

  function fetchTop10Movies() {
    let trendingMovie = document.getElementById("trending_movies");
    trendingMovie.innerHTML = ``
    fetch("/top_10_movies")
      .then((response) => response.json())
      .then((data) => {
        data.reverse()
        data.forEach((movie) => {
          let card = document.createElement("div");
          card.classList.add("card", "col");
          card.id = 'movieDesc'
          card.style.width = "15rem";
          card.setAttribute('data-title', movie.title)
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

          card.addEventListener("click", function() {
            // Redirect to movie details page with movie title as URL parameter
            window.location.href = `/movie_details?title=${encodeURIComponent(movie.title)}`;
            // console.log(movie.title)
            // fetchMovieDetails(movie.title)
          });
          // card.appendChild(cardBody);
          trendingMovie.appendChild(card);
        });
      })
      .catch((error) => {
        console.error("Error fetching top 10 movies:", error);
      });
  }
  // Fetch and display the top 10 movies on page load
  fetchTop10Movies();


  // Function to fetch and display the movie of the day
  function fetchMovieOfTheDay() {
    fetch("/random_movie")
      .then((response) => response.json())
      .then((data) => {
        let randomMovieDiv = document.getElementById("random-movie");
        let card = document.createElement("div");
        card.classList.add("card", "col");
        card.id = 'movieOfTheDay'
        card.style.width = "15rem";
        // card.style.height = '300px'

        let poster = document.createElement("img");
        poster.classList.add("card-img-top");
        poster.src = data.poster;
        poster.alt = data.title;

        let cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        let title = document.createElement("h5");
        title.classList.add("card-title");
        title.textContent = data.title;

        cardBody.appendChild(title);
        card.appendChild(poster);
        card.appendChild(cardBody);

        card.addEventListener("click", function() {
          // Redirect to movie details page with movie title as URL parameter
          window.location.href = `/movie_details?title=${encodeURIComponent(data.title)}`;
        });

        randomMovieDiv.appendChild(card);
      })
      .catch((error) => {
        console.error("Error:", error);
        let randomMovieDiv = document.getElementById("random-movie");
        randomMovieDiv.innerHTML = `<p>An error occurred. Please try again later.</p>`;
      });
  }

  // Initial fetch and display of movie of the day
  fetchMovieOfTheDay();

  // Event listener for genre button click
  document
    .getElementById("genre-button")
    .addEventListener("click", function () {
      let genre = document.getElementById("genre-select").value;
      // console.log(genre)
      fetch(`/random_movie_by_genre?genre=${encodeURIComponent(genre)}`)
        .then((response) => response.json())
        .then((data) => {
          // console.log(data.title)
          // console.log(data.poster)
          let randomMovieDiv = document.getElementById("random-movie");
          if (data.error) {
            randomMovieDiv.innerHTML = `<p>${data.error}</p>`;
          } else {
            // document.getElementById('movieOfTheDay').style.display = 'none'
            randomMovieDiv.innerHTML = ''
            let card = document.createElement("div");
            card.classList.add("card", "col");
            card.style.width = "15rem";
            // card.style.height = '300px'

            let poster = document.createElement("img");
            poster.classList.add("card-img-top");
            poster.src = data.poster;
            poster.alt = data.title;

            let cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            let title = document.createElement("h5");
            title.classList.add("card-title");
            title.textContent = data.title;

            cardBody.appendChild(title);
            card.appendChild(poster);
            card.appendChild(cardBody);

            card.addEventListener("click", function() {
              // Redirect to movie details page with movie title as URL parameter
              window.location.href = `/movie_details?title=${encodeURIComponent(data.title)}`;
            });

            randomMovieDiv.appendChild(card);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          let randomMovieDiv = document.getElementById("random-movie");
          randomMovieDiv.innerHTML = `<p>An error occurred. Please try again later.</p>`;
        });
    });

  // Existing code for fetching movie recommendations
  document
    .getElementById("recommendation-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      let movieInput = document.getElementById("movie");
      let movie = movieInput.value.trim(); // Trim whitespace from input
      if (movie === "") {
        // Provide feedback for empty input
        alert("Please enter a movie title.");
        return;
      }
      fetch(`/recommends?movie=${encodeURIComponent(movie)}`)
        .then((response) => response.json())
        .then((data) => {
          let recommendationsDiv = document.getElementById("recommendations");
          document.getElementById("trending").style.display = "none";
          recommendationsDiv.style.display = "grid";
          recommendationsDiv.innerHTML = ""; // Clear previous recommendations

          if (data.error) {
            // Display error message if there's an error
            recommendationsDiv.innerHTML = `<p>${data.error}</p>`;
          } else {
            // Display recommendations
            data.forEach((movie) => {
              let card = document.createElement("div");
              card.classList.add("card", "col");
              card.style.width = "15rem";
              // card.style.height = '300px'

              let poster = document.createElement("img");
              poster.classList.add("card-img-top");
              poster.src = movie.poster;
              poster.alt = movie.title;

              // let cardBody = document.createElement("div");
              // cardBody.classList.add("card-body");

              let title = document.createElement("h5");
              title.classList.add("card-title");
              title.textContent = movie.title;

              // cardBody.appendChild(title);
              card.appendChild(poster);
              card.appendChild(title);

              card.addEventListener("click", function() {
                // Redirect to movie details page with movie title as URL parameter
                window.location.href = `/movie_details?title=${encodeURIComponent(movie.title)}`;
              });
              // card.appendChild(cardBody);
              recommendationsDiv.appendChild(card);
            });
          }

          movieInput.value = ""; // Clear input field
        })
        .catch((error) => {
          console.error("Error:", error);
          // Display a generic error message
          let recommendationsDiv = document.getElementById("recommendations");
          recommendationsDiv.innerHTML = `<p>An error occurred. Please try again later.</p>`;
        });
    });

  document.getElementById("movie").addEventListener("input", function () {
    let query = this.value.trim();

    if (query.length > 0) {
      fetch(`/autocomplete?query=${encodeURIComponent(query)}`)
        .then((response) => response.json())
        .then((data) => {
          let suggestionsDiv = document.getElementById("suggestions");
          suggestionsDiv.innerHTML = ""; // Clear previous suggestions

          if (data.length > 0) {
            let list = document.createElement("ul");
            data.forEach((title) => {
              let listItem = document.createElement("li");
              listItem.textContent = title;
              listItem.addEventListener("click", function () {
                document.getElementById("movie").value = title;
                suggestionsDiv.innerHTML = ""; // Clear suggestions
              });
              list.appendChild(listItem);
            });
            suggestionsDiv.appendChild(list);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      document.getElementById("suggestions").innerHTML = ""; // Clear suggestions
    }
  });

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
});
