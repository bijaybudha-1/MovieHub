/* ============================================================
   MovieHub 2026 — Ratings Page Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
    const stats = getRatingStats();
    document.getElementById('total-rated').textContent = stats.total;
    document.getElementById('avg-rating').textContent = stats.average;
    const ratings = getRatings();
    document.getElementById('highest-rating').textContent = ratings.length ? Math.max(...ratings.map(r => r.rating)) : 0;

    // Distribution
    const dist = document.getElementById('rating-distribution');
    const maxCount = Math.max(...stats.distribution, 1);
    dist.innerHTML = stats.distribution.map((count, i) => {
        const pct = (count / maxCount) * 100;
        return `<div class="rating-bar-row"><span class="rating-bar-label">${i + 1}/10</span><div class="rating-bar-track"><div class="rating-bar-fill" style="width:${pct}%"></div></div><span class="rating-bar-count">${count}</span></div>`;
    }).join('');

    renderRatingsGrid('ratings-grid');

    const rec = await getTopRatedMovies();
    if (rec && rec.results) document.getElementById('rec-scroll').innerHTML = rec.results.slice(0, 15).map(m => buildMovieCard(m)).join('');
    initScrollReveal();
});
