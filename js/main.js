updateFav()
// condition that achieve if we are in index.html page
if (document.getElementById("movies")) {
    // getMovvies();
    searchMovie("movies")
    prevNext()
  const mov = new MutationObserver(() => {
    moreDetail();
    addToFav();
  });
  mov.observe(document.getElementById("movies"), { childList: true });
}

// check if localStorage is not set, if is not then create it
if (localStorage.getItem('myfavorite') != null) {
    // condition that achieve if we are in favorite.html page
    if (document.getElementById("favorite")) {
        getFavorite();
        searchMovie("favorite")
      const mov = new MutationObserver(() => {
        moreDetail();
        removeFav();
        addToFav();
      });
      mov.observe(document.getElementById("favorite"), { childList: true });
    }
    updateFav()
}
// call function getMovies when click on page logo
// document.getElementById('#logo').onclick = getMovvies()

// get favorite movies
// get id of movie from localStorage and then get information of it with api
function getFavorite() {
  let mymovies = localStorage.getItem("myfavorite").split(",");
  if (mymovies[0] == "") mymovies.shift()
  for (let i = 0; i < mymovies.length; i++) {
    fetch(
      `https://api.themoviedb.org/3/movie/${mymovies[i]}?api_key=4e1ba29d0bd265e3f3eb30d63b771b12`
    )
      .then((res) => res.json())
      .then((data) => {
        document.querySelector("#favorite").innerHTML += `
            <div class="col-2 px-1">
                <div class="card border-0 " style="height: 278px;">
                    <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="" class="card-img-top w-100 h-100" >
                    <div class="card-img-overlay d-flex flex-column justify-content-end">
                        <h5 class="text-white text-capitalize card-title text-center h6">${data.original_title}</h5>
                                <div class="more">
                                    <input type="hidden" value="${data.id}">
                                    <button class="bg-dark text-white py-2 px-3 text-capitalize mx-auto d-inline-block more-detail" data-bs-toggle="modal" data-bs-target="#movie-info">more detail</button>
                                    <button class="bg-dark py-2 px-2 mt-2 del-favorite">
                                        <i class="fa-solid fa-heart-circle-minus text-light fa-xl"></i>
                                    </button>
                                </div>
                    </div>
                </div>
            </div>
            `;
      });
  }
}

// function get movies and set them to dom
function getMovvies(s = 1350, e = 1400) {
    document.getElementById("movies").innerHTML = ""
  for (let i = s; i < e; i++) {
    fetch(
      `https://api.themoviedb.org/3/movie/${i}?api_key=4e1ba29d0bd265e3f3eb30d63b771b12`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.imdb_id && data.poster_path) {
          document.getElementById("movies").innerHTML += ` 
                <div class="col-2 px-1 ">
                <div class="card border-0 " style="height: 278px;">
                <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="" class="card-img-top w-100 h-100" >
                <img src="img/bgtransparent.png" class="position-absolute w-100 h-100" alt="">
                <div class="card-img-overlay d-flex flex-column justify-content-end">
                <h5 class="text-white text-capitalize card-title text-center h6">${data.original_title}</h5>
                <div class="more">
                <input type="hidden" value="${data.id}">
                                <button class="bg-dark text-white py-2 px-3 text-capitalize mx-auto d-inline-block more-detail" data-bs-toggle="modal" data-bs-target="#movie-info">more detail</button>
                                <button class="bg-dark py-2 px-2 mt-2 add-to-favorite">
                                    <i class="fa-solid fa-heart-circle-plus text-light fa-xl"></i>
                                </button>
                            </div>
                        </div>
                </div>
            </div>`;
        }
      });
  }
}
// function show more detail about movie
function moreDetail() {
  document.querySelectorAll(".more-detail").forEach((el) => {
    el.addEventListener("click", () => {
      console.log(el.previousElementSibling);
      fetch(
        `https://api.themoviedb.org/3/movie/${el.previousElementSibling.value}?api_key=4e1ba29d0bd265e3f3eb30d63b771b12`
      )
        .then((res) => res.json())
        .then((data) => {
          document.querySelector("#movie-info .mv-name").innerHTML =
            data.original_title;
          document.querySelector("#movie-info .mv-desc").innerHTML =
            data.overview;
          document.querySelector(
            "#movie-info .mv-poster"
          ).parentElement.href = `https://www.imdb.com/title/${data.imdb_id}/`;
          document.querySelector("#movie-info .mv-poster").src =
            data.poster_path;
          document.querySelector("#movie-info .mv-poster").src =
            "https://image.tmdb.org/t/p/w500" + data.poster_path;

          for (let i = 0; i < data.genres.length; i++) {
            document.querySelector(
              "#movie-info .mv-genre"
            ).innerHTML += `<li class="bg-dark text-white p-2 d-inline-block rounded me-2 mb-2">${data.genres[i].name}</li>`;
          }
          //    rate
          document.querySelector("#movie-info .mv-rate").innerHTML = `${data.vote_average} <i class="fa-solid fa-star fa-sm"></i>`
        });
    });
  });
}
// function add movie to favorite list (localStorage)
function addToFav() {
  document.querySelectorAll(".add-to-favorite").forEach((el) => {
    el.addEventListener("click", () => {
    
      let fav = localStorage.getItem("myfavorite").split(",");
      if (
        fav.indexOf(el.previousElementSibling.previousElementSibling.value) ==
        -1
      ) {
        fav.push(el.previousElementSibling.previousElementSibling.value);
        localStorage.setItem("myfavorite", fav);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Added Successfully",
          showConfirmButton: false,
          timer: 1500,
          customClass: {
            iconColor: "#fff",
          },
        });
        updateFav()
      } else {
        Swal.fire({
          title: "This Movie Is already In Favorite List",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
      }
    });
  });
}
function removeFav() {
  let myFav = localStorage.getItem("myfavorite").split(",");
  if (myFav[0] == "") myFav.shift();
  document.querySelectorAll("#favorite .del-favorite").forEach((el) => {
    el.addEventListener("click", () => {
        // console.log(el.parentElement.parentElement.parentElement.parentElement)
        myFav.splice(myFav.indexOf(el.previousElementSibling.previousElementSibling.value), 1)
        el.parentElement.parentElement.parentElement.parentElement.remove()
        localStorage.setItem('myfavorite', myFav)
        updateFav()
    });
  });
}

function updateFav() {
    if (localStorage.getItem('myfavorite') != null) {
        let myFav = localStorage.getItem('myfavorite').split(',')
        if (myFav[0] == '') myFav.shift()
        if (myFav.length == 0) document.querySelector('#my-favorite-num').innerHTML = ""
        else { 
            document.querySelector('#my-favorite-num').innerHTML = myFav.length
            document.querySelector('#my-favorite-num').parentElement.classList.add('fa-shake')
            setTimeout(() => {
                document.querySelector('#my-favorite-num').parentElement.classList.remove('fa-shake')
            },1000)
        
        }

    } else {
        localStorage.setItem('myfavorite', [])
        document.querySelector('#my-favorite-num').innerHTML = ""
    }
}

function searchMovie(container) {
    document.getElementById('search').addEventListener('click', e => {
        e.preventDefault()
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=4e1ba29d0bd265e3f3eb30d63b771b12&query=${document.getElementById('search-input').value}`).then(res => res.json()).then(data => {
            document.getElementById(container).innerHTML = ""
            let result = data.results
            for (let i = 0; i < result.length; i++) {
                if (result[i].poster_path) {
                    document.getElementById(container).innerHTML += ` 
                    <div class="col-2 px-1 ">
                    <div class="card border-0 " style="height: 278px;">
                    <img src="https://image.tmdb.org/t/p/w500${result[i].poster_path}" alt="" class="card-img-top w-100 h-100" >
                    <img src="img/bgtransparent.png" class="position-absolute w-100 h-100" alt="">
                    <div class="card-img-overlay d-flex flex-column justify-content-end">
                    <h5 class="text-white text-capitalize card-title text-center h6">${result[i].original_title}</h5>
                    <div class="more">
                    <input type="hidden" value="${result[i].id}">
                                    <button class="bg-dark text-white py-2 px-3 text-capitalize mx-auto d-inline-block more-detail" data-bs-toggle="modal" data-bs-target="#movie-info">more detail</button>
                                    <button class="bg-dark py-2 px-2 mt-2 add-to-favorite">
                                        <i class="fa-solid fa-heart-circle-plus text-light fa-xl"></i>
                                    </button>
                                </div>
                            </div>
                    </div>
                </div>`;
                }
            }
        })
    })
}

function prevNext() {
    let s = 1350
    let end = 1400
    getMovvies(s, end)
    // previous
    document.querySelector('#prev-next .Previous').addEventListener('click', e => {
        if (s > 0) {
            e.preventDefault()
            s -= 50
            end -= 50
            getMovvies(s, end)

            console.log(s, end)
        }
    })
    // next
    document.querySelector('#prev-next .Next').addEventListener('click', e => {
        e.preventDefault()
        s += 50
        end += 50
        getMovvies(s, end)
        console.log(s, end)

    })
}
