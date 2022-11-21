$(document).ready(function () {

    $('#searchForm').on('submit', (e) => {
        let searchedText = $('#searchText').val();
        findMoviesByTitle(searchedText);
        e.preventDefault();
    });
    $('#wtwForm').on('submit', (e) => {
        let selectedRate = $("#wtwAge").val();
        findMovieByRating(selectedRate);
        e.preventDefault();
    })
    $('#popularMoviesForm').on('submit', (e) => {
        getPopularMovies();
        e.preventDefault();
    })

    function findMoviesByTitle(input) {
        axios.get('https://api.themoviedb.org/3/search/movie?api_key=fce6281d9d40ad70409d4863f9cf2286&query=' + input)
            .then((response) => {
                let movieList = response.data.results;
                console.log(movieList);
                let result = '';
                for (let i = 0; i < movieList.length; i++) {
                    result +=
                        `<div class="col-lg-4" class="movie" id="movie-${i}" style="margin: 20px 0 20px 0">
                            <img src="https://image.tmdb.org/t/p/w500/${movieList[i].poster_path}" style="height: 400px">
                            <h5>${movieList[i].original_title}</h5>
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
                                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <h2>${movie.original_title}</h2>
                                <ul class="list-group" id="list${index}">
                                    <li class="list-group-item"><strong>Overview: </strong><div>${movie.overview}</div></li>
                                    <li class="list-group-item"><strong>Genres: </strong><div>${genres}</div></li>
                                    <li class="list-group-item"><strong>Released: </strong><div>${movie.release_date}</div></li>
                                </ul>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
            $(`#list${index}`).append(`<li class="list-group-item"><strong>Actors:</strong><div class="actors">${actors} etc.</div></li>`);
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
                if ((author && content && date) != "null")
                    result += `<div id="review-${index}"><h6 style="margin-top: 10px">${author} - ${date}</h6><p style="text-align:start" id="content-${i}">${content}</p><hr></div>`
            }
            $(`#list${index}`).append(`<li class="list-group-item"><strong>Reviews:</strong><div class="reviews">${result}</div></li>`);
        })
}



function findMovieByRating(rating) {
    console.log(rating);
    axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=fce6281d9d40ad70409d4863f9cf2286&certification_country=US&certification=${rating}`)
        .then((response) => {
            let movieList = response.data.results;
            console.log(movieList);
            let result = '';
            for (let i = 0; i < movieList.length; i++) {
                result +=
                    `<div class="col-lg-4" class="movie" id="movie-${i}" style="margin: 20px 0 20px 0">
                            <img src="https://image.tmdb.org/t/p/w500/${movieList[i].poster_path}" style="height: 400px">
                            <h5>${movieList[i].original_title}</h5>
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
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=fce6281d9d40ad70409d4863f9cf2286&language=en-US&page=1`)
        .then((response) => {
            let movieList = response.data.results;
            console.log(movieList);
            let result = '';
            for (let i = 0; i < movieList.length; i++) {
                result +=
                    `<div class="col-lg-4" class="movie" id="movie-${i}" style="margin: 20px 0 20px 0">
                            <img src="https://image.tmdb.org/t/p/w500/${movieList[i].poster_path}" style="height: 400px">
                            <h5>${movieList[i].original_title}</h5>
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

//add read more/show less for actors list and review comment
//add more sorting
//add pages (not 20 movies only)
//add css