function searchMovies() {
    const query = document.getElementById('search-input').value;
    const genre = document.getElementById('genre-select').value;
    fetch(`/search?title=${query}&genre=${genre}`)
        .then(response => response.json())
        .then(data => {
            const movieList = document.getElementById('movie-list');
            movieList.innerHTML = '';
            if (data.Search) {
                data.Search.forEach(movie => {
                    const movieItem = document.createElement('div');
                    movieItem.classList.add('movie-item');
                    movieItem.innerHTML = `
                        <img src="${movie.Poster}" alt="Poster">
                        <h3>${movie.Title} (${movie.Year})</h3>
                        <div class="details"></div>
                    `;
                    movieItem.addEventListener('click', () => showDetails(movie, movie.imdbID));
                    movieList.appendChild(movieItem);
                });
            } else {
                movieList.innerHTML = '<p>No results found.</p>';
            }
        });
}

function showDetails(movie, imdbID) {
    fetch(`/details?imdbID=${imdbID}`)
        .then(response => response.json())
        .then(data => {
            const details = `
                <span class="close-button">&times;</span>
                <h2>${movie.Title} (${movie.Year})</h2>
                <p>${data.Plot}</p>
                <p><strong>Director:</strong> ${data.Director}</p>
                <p><strong>Actors:</strong> ${data.Actors}</p>
                <p><strong>Genre:</strong> ${data.Genre}</p>
                <p><strong>Rating:</strong> ${data.imdbRating}</p>
            `;
            const dialogBox = document.createElement('div');
            dialogBox.classList.add('dialog-box');
            dialogBox.innerHTML = `<div class="dialog-content">${details}</div>`;
            document.body.appendChild(dialogBox);
            dialogBox.style.display = 'block';
            const closeButton = dialogBox.querySelector('.close-button');
            closeButton.addEventListener('click', () => {
                dialogBox.style.display = 'none';
                document.body.removeChild(dialogBox);
            });
        });
}

function hideDetails(movieItem) {
    const details = movieItem.querySelector('.details');
    details.style.display = 'none';
    details.innerHTML = '';
}
