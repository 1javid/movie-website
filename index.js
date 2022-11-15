$(document).ready(function () {

    $('#searchForm').on('submit', (e) => {
        let searchedText = $('#searchText').val();
        findMoviesByTitle(searchedText);
        e.preventDefault();
    });
    $('#wtwForm').on('submit', (e) => {
        wtwSearch();
        e.preventDefault();
    })

    let movieList;

    function findMoviesByTitle(input) {
        axios.get('http://www.omdbapi.com/?apikey=7ac5c54' + '&s=' + input)
            .then((response) => {
                movieList = response.data.Search;
                let result = '';
                for (let i = 0; i < movieList.length; i++) {
                    result +=
                        `<div class="col-lg-4" class="movie" id="movie-${i}" style="margin: 20px 0 20px 0">
                            <img src="${movieList[i].Poster}" style="height: 400px">
                            <h5>${movieList[i].Title}</h5>
                            <!-- Button trigger modal -->
                            <button type="button" class="btn btn-primary detail-button" onmousedown="findMovieDetailsById('${movieList[i].imdbID}', '${i}')">
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
    console.log(id + " " + index);
    axios.get('http://www.omdbapi.com/?apikey=7ac5c54' + '&i=' + id)
        .then((response) => {
            console.log(response);
            let movie = response.data;
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
                                <h2>${movie.Title}</h2>
                                <ul class="list-group">
                                    <li class="list-group-item"><strong>Genre: </strong>${movie.Genre}</li>
                                    <li class="list-group-item"><strong>Released: </strong>${movie.Released}</li>
                                    <li class="list-group-item"><strong>Rated: </strong>${movie.Rated}</li>
                                    <li class="list-group-item"><strong>IMDB Rating: </strong>${movie.imdbRating}</li>
                                    <li class="list-group-item"><strong>Director: </strong>${movie.Director}</li>
                                    <li class="list-group-item"><strong>Writer: </strong>${movie.Writer}</li>
                                    <li class="list-group-item"><strong>Actors: </strong>${movie.Actors}</li>
                                </ul>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div> `);
            let detailButton = document.getElementsByClassName('detail-button')[index];
            console.log(document.getElementsByClassName('detail-button')[index]);
            console.log(detailButton.parentElement);
            detailButton.setAttribute("data-bs-toggle", "modal");
            detailButton.setAttribute("data-bs-target", `#movieModal${index}`);
        })
        .catch((err) => {
            console.log(err);
        })
}



const wtw = document.getElementById("wtwAge");
wtw.addEventListener('change', (event) => {
    let ageRating = event.target.value;
    findMovieByRating(ageRating);
})