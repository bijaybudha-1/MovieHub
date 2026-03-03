/* ============================================================
   MovieHub 2026 — Movies Page Logic
   ============================================================ */

let currentPage = 1;
let currentSort = 'popularity.desc';
let currentGenre = '';
let totalPages = 1;

document.addEventListener('DOMContentLoaded', async () => {
    // Load genres for filter
    const genres = await getMovieGenres();
    const genreSelect = document.getElementById('genre-filter');
    if (genres && genres.genres) {
        genres.genres.forEach(g => {
            genreSelect.innerHTML += `<option value="${g.id}">${g.name}</option>`;
        });
    }

    loadMovies();

    // Sort change
    document.getElementById('sort-select').addEventListener('change', (e) => {
        currentSort = e.target.value;
        currentPage = 1;
        loadMovies();
    });

    // Genre change
    genreSelect.addEventListener('change', (e) => {
        currentGenre = e.target.value;
        currentPage = 1;
        loadMovies();
    });

    // Search
    let searchTimer;
    document.getElementById('movie-search').addEventListener('input', (e) => {
        clearTimeout(searchTimer);
        const q = e.target.value.trim();
        searchTimer = setTimeout(async () => {
            if (q.length >= 2) {
                const data = await searchMovies(q);
                if (data && data.results) {
                    renderMovieGrid(data.results);
                    document.getElementById('pagination').innerHTML = '';
                }
            } else {
                loadMovies();
            }
        }, 400);
    });

    // Recommended
    const rec = await getTopRatedMovies();
    if (rec && rec.results) {
        document.getElementById('recommended-scroll').innerHTML =
            rec.results.slice(0, 15).map(m => buildMovieCard(m, 'movie')).join('');
    }

    initScrollReveal();
});

async function loadMovies() {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = 'block';

    const params = { page: currentPage, sort_by: currentSort };
    if (currentGenre) params.with_genres = currentGenre;

    const data = await discoverMovies(params);
    spinner.style.display = 'none';

    if (data && data.results) {
        totalPages = Math.min(data.total_pages, 20);
        renderMovieGrid(data.results);
        renderPagination();
        initScrollReveal();
    }
}

function renderMovieGrid(movies) {
    document.getElementById('movies-grid').innerHTML =
        movies.map(m => buildMovieCard(m, 'movie')).join('');
}

function renderPagination() {
    const container = document.getElementById('pagination');
    let html = '';

    if (currentPage > 1) {
        html += `<button class="pagination-btn" data-page="${currentPage - 1}"><i class="bx bx-chevron-left"></i></button>`;
    }

    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    if (start > 1) html += `<button class="pagination-btn" data-page="1">1</button>`;
    if (start > 2) html += `<span class="pagination-btn" style="border:none;cursor:default;">...</span>`;

    for (let i = start; i <= end; i++) {
        html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    if (end < totalPages - 1) html += `<span class="pagination-btn" style="border:none;cursor:default;">...</span>`;
    if (end < totalPages) html += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;

    if (currentPage < totalPages) {
        html += `<button class="pagination-btn" data-page="${currentPage + 1}"><i class="bx bx-chevron-right"></i></button>`;
    }

    container.innerHTML = html;
    container.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.dataset.page);
            loadMovies();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}
