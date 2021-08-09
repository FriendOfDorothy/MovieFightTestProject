let autoCompleteConfig = {
    renderOption(movie) {
        if (movie.Poster == "N/A") {
            movie.Poster = "";
        }
        return `
        <img src="${movie.Poster}" /><br>
        ${movie.Title}
        (${movie.Year})
        `;
    },
    /* function that changes the input value to the new selected value */
    inputValue(movie) {
        return movie.Title;
    },
    /* axios request */
    async fetchData(input) {
        const response = await axios.get("http://www.omdbapi.com", {
            params: {
                apikey: "d6a0c345",
                s: input,
            },
        });
        let result = response.data;
        if (result.Error) return [];
        return result.Search;
    },
};

createAutoComplete({
    ...autoCompleteConfig,
    /* root */
    root: document.querySelector("#left-autocomplete"),
    /* On option select - references a callback function */
    onOptionSelect(movie) {
        const tutorial = document.querySelector("#tutorial");
        tutorial.classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#left-summary"), "left");
    },
});
createAutoComplete({
    ...autoCompleteConfig,
    /* root */
    root: document.querySelector("#right-autocomplete"),
    /* On option select - references a callback function */
    onOptionSelect(movie) {
        const tutorial = document.querySelector("#tutorial");
        tutorial.classList.add("is-hidden");
        onMovieSelect(movie, document.querySelector("#right-summary"), "right");
    },
});

let leftMovie;
let rightMovie;

const onMovieSelect = async(movie, summaryElement, side) => {
    const response = await axios.get("http://www.omdbapi.com", {
        params: {
            apikey: "d6a0c345",
            i: movie.imdbID,
        },
    });

    const runComparison = () => {
        const leftSideStats = document.querySelectorAll(
            "#left-summary .notification"
        );
        const rightSideStats = document.querySelectorAll(
            "#right-summary .notification"
        );
        leftSideStats.forEach((leftStat, index) => {
            const rightStat = rightSideStats[index];

            const leftSideValue = parseInt(leftStat.dataset.value);
            const rightSideValue = parseInt(rightStat.dataset.value);

            if (rightSideValue > leftSideValue) {
                leftStat.classList.remove("is-primary");
                leftStat.classList.add("is-warning");
            } else {
                rightStat.classList.remove("is-primary");
                rightStat.classList.add("is-warning");
            }
        });
    };

    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === "left") {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const movieTemplate = (movieDetails) => {
    const dollars = movieDetails.BoxOffice.replace(/\$/g, "").replace(/,/g, "");
    const boxOffice = parseInt(dollars);
    const metaScore = parseInt(movieDetails.Metascore);
    const imdbRating = parseFloat(movieDetails.imdbRating);
    const imdbVotesWithoutCommas = movieDetails.imdbVotes.replace(/,/g, "");
    const imdbVotes = parseInt(imdbVotesWithoutCommas);
    let count = 0;
    const awards = movieDetails.Awards.split(" ").forEach((word) => {
        const value = parseInt(word);
        if (isNaN(value)) {
            return;
        } else {
            count += value;
        }
    });
    console.log(
        `${boxOffice}, ${metaScore}, ${imdbRating}, ${imdbVotes}, ${count}`
    );

    return `
    <article class="media>
    <figure class="media-left">
    <p class="poster-image">
    <img src="${movieDetails.Poster}"/>
    </p>
    </figure>
    <div class="media-content">
    <div class="content">
    <h1>${movieDetails.Title}</h1>
    <h4>${movieDetails.Genre}</h4>
    <p>${movieDetails.Plot}</p>
    </div>
    </div>
    </article>
    <article data-value=${count} class="notification is-primary">
    <p class="title">${movieDetails.Awards}</p>
    <p class="subtitle">Awards</p>
    </article>
    <article data-value="${boxOffice}" class="notification is-primary">
    <p class="title">${movieDetails.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
    </article>
    <article data-value="${metaScore}" class="notification is-primary">
    <p class="title">${movieDetails.Metascore}</p>
    <p class="subtitle">Metascore</p>
    </article>
    <article data-value="${imdbRating}" class="notification is-primary">
    <p class="title">${movieDetails.imdbRating}</p>
    <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value="${imdbVotes}" class="notification is-primary">
    <p class="title">${movieDetails.imdbVotes}</p>
    <p class="subtitle">IMDB Votes</p>
    </article>
    `;
};