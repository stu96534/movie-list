const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEA_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

const datapanel = document.querySelector('#data-panel')


datapanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-remove-favorite')) {
    console.log(event.target.dataset.id)
    removeFromFavorite(Number(event.target.dataset.id))
  }
})



function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios
    .get(INDEA_URL + id)
    .then((response) => {
      const data = response.data.results
      modalTitle.innerHTML = data.title
      modalDate.innerHTML = 'Release date: ' + data.release_date
      modalDescription.innerHTML = data.description
      modalImage.innerHTML = `<img
                src="${POSTER_URL + data.image}"
                alt="movie-poster" class="img-fluid">`
    })
    .catch((err) => console.log(err))
}

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `<div class="col">
      <div class="card">
        <img
          src="${POSTER_URL + item.image}"
          class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
        </div>
      </div>
    </div>`
  });

  datapanel.innerHTML = rawHTML
}

function removeFromFavorite(id) {
if(!movies || !movies.length) return

const movieIndex = movies.findIndex((movie) => movie.id === id )
if(movieIndex === -1) return

movies.splice(movieIndex, 1)

localStorage.setItem('favoriteMovies', JSON.stringify(movies))

renderMovieList(movies)
}

renderMovieList(movies)