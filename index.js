const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEA_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = []
let page = 1


const datapanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const modalChange = document.querySelector('#modal-change')


datapanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(event.target.dataset.id)
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
    event.target.remove()
    console.log(event.target)
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()

  const keyword = searchInput.value.trim().toLowerCase()
  const modalName = datapanel.firstElementChild

  filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword)
  )
  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字:${keyword}沒有符合條件的電影`)
  }

  if (keyword.length === 0) page = 1

  renderPaginator(filteredMovies.length)

  if (modalName.matches('.modal-list')) {
    pageActive(0)
    renderMovieList(getMoviesByPage(1))
  } else if (modalName.matches('.modal-card')) {
    pageActive(0)
    renderMovieCard(getMoviesByPage(1))
  }

})



paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return

  page = Number(event.target.dataset.page)
  const modalName = datapanel.firstElementChild

  pageActive(page - 1)
  if (modalName.matches('.modal-list')) {
    renderMovieList(getMoviesByPage(page))
  } else if (modalName.matches('.modal-card')) {
    renderMovieCard(getMoviesByPage(page))
  }
})

modalChange.addEventListener('click', function onPanelClicked(event) {
  const modal = event.target
  if (event.target.matches('.fa-th')) {
    modalchange(modal)
    renderMovieCard(getMoviesByPage(page))
  } else if (event.target.matches('.fa-bars')) {
    modalchange(modal)
    renderMovieList(getMoviesByPage(page))
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

function renderMovieCard(data) {
  datapanel.classList.add('row-cols-1', 'row-cols-md-4', 'g-4')
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `<div class="col modal-card">
      <div class="card">
        <img
          src="${POSTER_URL + item.image}"
          class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer" data-id="${item.id}">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </div>
    </div>`
  });

  datapanel.innerHTML = rawHTML
  const favorite = document.querySelectorAll('.btn-add-favorite')
  activeFavorite(favorite)
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中!')
  }
  console.log(list)
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

function activeFavorite(data) {
  const lists = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  for (const movie of data) {
    for (const list of lists) {
      if (Number(movie.dataset.id) === list.id) {
        movie.remove()
      }
    }
  }
}



function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)

  let rawHTML = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

function renderMovieList(data) {
  datapanel.classList.remove('row-cols-1', 'row-cols-md-4', 'g-4')
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `<div class="d-grid bd-highlight modal-list" >
      <div class=" list-group row ">
        <li class="d-md-flex list-group-item list-group-item-dark text-lg-start justify-content-between" style="height: 70px">
      <div class="d-grid gap-2 d-md-flex align-items-center">
          <h5 class="mb-1 ">${item.title}</h5>
      </div>
      <div class="d-grid gap-2 d-md-flex align-items-center">
        <button class="btn btn-primary btn-show-movie " data-bs-toggle="modal" data-bs-target="#movie-modal"
          data-id="${item.id}">More</button>
        <button class="btn btn-info btn-add-favorite ${item.id}" data-id="${item.id}">+</button>
      </div>
      </li>
        </div>
      </div>`
  });

  datapanel.innerHTML = rawHTML
  const favorite = document.querySelectorAll('.btn-add-favorite')
  activeFavorite(favorite)
}

function modalchange(data) {
  const modal2 = data.parentElement
  for (let i = 0; i < modal2.children.length; i++) {
    if (modal2.children[i].matches('.btn-dark')) {
      modal2.children[i].classList.remove('btn-dark')
      modal2.children[i].classList.add('btn-outline-dark')
    }
  }
  data.classList.add('btn-dark')
  data.classList.remove('btn-outline-dark')
}

function pageActive(page) {
  for (let i = 0; i < paginator.children.length; i++) {
    paginator.children[i].classList.remove('active')
  }
  paginator.children[page].classList.add('active')
}



axios
  .get(INDEA_URL)
  .then((response) => {
    // for(const movie of response.data.results){
    //   movies.push(movie)
    // }
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieCard(getMoviesByPage(page))
    pageActive(0)
  })
  .catch((err) => console.log(err))

