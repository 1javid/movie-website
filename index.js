$(document).ready(function () {

    $('#searchForm').on('submit', (e) => {
        let searchedText = $('#searchText').val();
        findMoviesByTitle(searchedText);
        e.preventDefault();
    });
    $('#ageForm').on('submit', (e) => {
        let selectedRate = $("#wtwAge").val();
        findMovieByRating(selectedRate);
        e.preventDefault();
    })
    $('#movieForm').on('submit', (e) => {
        let selectedMovieType = $("#wtwMovie").val();
        if (selectedMovieType == 'popular')
            getPopularMovies();
        else if (selectedMovieType == 'topRated')
            getTopRatedMovies();
        else if (selectedMovieType == 'trending')
            getTrendingMovies();
        e.preventDefault();
    })

    function findMoviesByTitle(input) {
        $(".movie").remove();
        axios.get('https://api.themoviedb.org/3/search/movie?api_key=fce6281d9d40ad70409d4863f9cf2286&query=' + input)
            .then((response) => {
                let movieList = response.data.results;
                console.log(movieList);
                let result = '';
                for (let i = 0; i < movieList.length; i++) {
                    result +=
                        `<div class="col-md-3 movie" id="movie-${i}">
                            <img src="https://image.tmdb.org/t/p/w500/${movieList[i].poster_path}" style="height: 250px; width: 180px">
                            <!-- Button trigger modal -->
                            <button type="button" class="btn btn-primary detail-button" onmousedown="findMovieDetailsById('${movieList[i].id}', '${i}')">
                                Movie Detail
                            </button>
                        </div>`
                    $("#movieList").html(result);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
})

function findMovieDetailsById(id, index) {
    $(`#movieModal${index}`).remove();
    console.log(id + " " + index);
    axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=fce6281d9d40ad70409d4863f9cf2286`)
        .then((response) => {
            console.log(response);
            let movie = response.data;
            let genres = '';
            for (let i = 0; i < movie.genres.length; i++) {
                if (i != movie.genres.length - 1)
                    genres += movie.genres[i].name + ", ";
                else
                    genres += movie.genres[i].name;
            }
            $(`#movie-${index}`)
                .append(`
                <!-- Modal -->
                <div class="modal fade modal-dialog-scrollable" id="movieModal${index}" tabindex="-1"
                    aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${movie.original_title}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body" id="modalBody${index}">
                                    <strong>Overview</strong><div>${movie.overview}</div>
                                    <hr>
                                    <strong>Genres</strong><div>${genres}</div></li>
                                    <hr>
                                    <strong>Released</strong><div>${movie.release_date.replaceAll('-', '/')}</div>
                            </div>
                        </div>
                    </div>
                </div> `);
            findMovieCredits(id, index);
            findMovieReviews(id, index);
            let detailButton = document.getElementsByClassName('detail-button')[index];
            detailButton.setAttribute("data-bs-toggle", "modal");
            detailButton.setAttribute("data-bs-target", `#movieModal${index}`);
        })
        .catch((err) => {
            console.log(err);
        })
}

function findMovieCredits(id, index) {
    axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=fce6281d9d40ad70409d4863f9cf2286`)
        .then((response) => {
            let cast = response.data.cast;
            let actors = '';
            for (let i = 0; i < 10; i++) {
                actors += `<span>${cast[i].name}</span>`;
            }
            $(`#modalBody${index}`).append(`<hr><strong>Actors</strong><div class="actors">${actors} etc.</div>`);
        })
        .catch((err) => {
            console.log(err);
        })
}

function findMovieReviews(id, index) {
    axios.get(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=fce6281d9d40ad70409d4863f9cf2286`)
        .then((response) => {
            let review = response.data.results;
            let author, content, date, result = '';
            for (let i = 0; i < 3; i++) {
                author = review[i].author;
                content = review[i].content;
                date = (review[i].created_at);
                date = date.substr(0, 19).replace('T', ' at ');
                date = date.replaceAll('-', '/');

                if ((author && content && date) != "null")
                    result += `<div id="review-${index}"><h6 style="margin-top: 10px">${author} - ${date}</h6><p style="text-align:start" id="content-${i}">${content}</p><hr></div>`
            }
            $(`#modalBody${index}`).append(`<hr><strong>Reviews</strong><div class="reviews">${result}</div>`);
        })
}

function findMovieByRating(rating) {
    $(".movie").remove();
    console.log(rating);
    axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=fce6281d9d40ad70409d4863f9cf2286&certification_country=US&certification=${rating}`)
        .then((response) => {
            let movieList = response.data.results;
            console.log(movieList);
            let result = '';
            for (let i = 0; i < movieList.length; i++) {
                result +=
                    `<div class="col-md-3 movie" id="movie-${i}">
                            <img src="https://image.tmdb.org/t/p/w500/${movieList[i].poster_path}" style="height: 250px; width: 180px;">
                            <!-- Button trigger modal -->
                            <button type="button" class="btn btn-primary detail-button" onmousedown="findMovieDetailsById('${movieList[i].id}', '${i}')">
                                Movie Detail
                            </button>
                        </div>`
                $("#movieList").html(result);
            }
        })
        .catch((err) => {
            console.log(err);
        })
}

function getPopularMovies() {
    $(".movie").remove();
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=fce6281d9d40ad70409d4863f9cf2286&language=en-US&page=1`)
        .then((response) => {
            let movieList = response.data.results;
            console.log(movieList);
            let result = '';
            for (let i = 0; i < movieList.length; i++) {
                result +=
                    `<div class="col-md-3 movie" id="movie-${i}">
                            <img src="https://image.tmdb.org/t/p/w500/${movieList[i].poster_path}" style="height: 250px; width: 180px">
                            <!-- Button trigger modal -->
                            <button type="button" class="btn btn-primary detail-button" onmousedown="findMovieDetailsById('${movieList[i].id}', '${i}')">
                                Movie Detail
                            </button>
                        </div>`
                $("#movieList").html(result);
            }
        }).catch((err) => {
            console.log(err);
        })
}

function getTopRatedMovies() {
    $(".movie").remove();
    axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=fce6281d9d40ad70409d4863f9cf2286&language=en-US&page=1`)
        .then((response) => {
            let movieList = response.data.results;
            console.log(movieList);
            let result = '';
            for (let i = 0; i < movieList.length; i++) {
                result +=
                    `<div class="col-md-3 movie" id="movie-${i}">
                            <img src="https://image.tmdb.org/t/p/w500/${movieList[i].poster_path}" style="height: 250px; width: 180px">
                            <!-- Button trigger modal -->
                            <button type="button" class="btn btn-primary detail-button" onmousedown="findMovieDetailsById('${movieList[i].id}', '${i}')">
                                Movie Detail
                            </button>
                        </div>`
                $("#movieList").html(result);
            }
        }).catch((err) => {
            console.log(err);
        })
}

function getTrendingMovies() {
    $(".movie").remove();
    axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=fce6281d9d40ad70409d4863f9cf2286`)
        .then((response) => {
            let movieList = response.data.results;
            console.log(movieList);
            let result = '';
            for (let i = 0; i < movieList.length; i++) {
                result +=
                    `<div class="col-md-3 movie" id="movie-${i}">
                            <img src="https://image.tmdb.org/t/p/w500/${movieList[i].poster_path}" style="height: 250px; width: 180px">
                            <!-- Button trigger modal -->
                            <button type="button" class="btn btn-primary detail-button" onmousedown="findMovieDetailsById('${movieList[i].id}', '${i}')">
                                Movie Detail
                            </button>
                        </div>`
                $("#movieList").html(result);
            }
        }).catch((err) => {
            console.log(err);
        })
}