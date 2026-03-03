/* ============================================================
   MovieHub 2026 — Movie Details Page Logic
   ============================================================ */

const movieId = new URLSearchParams(window.location.search).get('id');
if (!movieId) window.location.href = 'movies.html';

document.addEventListener('DOMContentLoaded', async () => {
    // Fetch all data
    const [movie, credits, videos, reviews, similar] = await Promise.all([
        getMovieDetails(movieId),
        getMovieCredits(movieId),
        getMovieVideos(movieId),
        getMovieReviews(movieId),
        getSimilarMovies(movieId)
    ]);

    if (!movie) { document.getElementById('detail-content').innerHTML = '<p>Movie not found.</p>'; return; }

    // Update page title
    document.title = `MovieHub — ${movie.title}`;

    // 1. Hero
    const bg = document.getElementById('detail-bg');
    bg.style.backgroundImage = `url(${getBackdropUrl(movie.backdrop_path)})`;

    const hours = Math.floor((movie.runtime || 0) / 60);
    const mins = (movie.runtime || 0) % 60;
    const runtime = movie.runtime ? `${hours}h ${mins}m` : 'N/A';
    const rating = (movie.vote_average || 0).toFixed(1);

    document.getElementById('detail-content').innerHTML = `
        <div class="detail-poster reveal-left">
          <img src="${getImageUrl(movie.poster_path)}" alt="${movie.title}">
        </div>
        <div class="detail-info reveal-right">
          <h1 class="detail-title">${movie.title}</h1>
          ${movie.tagline ? `<p class="detail-tagline">"${movie.tagline}"</p>` : ''}
          <div class="detail-meta">
            <span class="detail-meta-item" style="color:${getRatingColor(movie.vote_average)};font-weight:600;"><i class="bx bxs-star"></i> ${rating}</span>
            <span class="detail-meta-item"><i class="bx bx-calendar"></i> ${movie.release_date || 'TBA'}</span>
            <span class="detail-meta-item"><i class="bx bx-time"></i> ${runtime}</span>
            <span class="detail-meta-item"><i class="bx bx-globe"></i> ${movie.spoken_languages?.[0]?.english_name || 'N/A'}</span>
          </div>
          <div class="detail-genre-tags">
            ${(movie.genres || []).map(g => `<span class="genre-tag">${g.name}</span>`).join('')}
          </div>
          <h3 class="detail-overview-title">Overview</h3>
          <p class="detail-overview">${movie.overview || 'No overview available.'}</p>
          <div class="detail-actions">
            <button class="btn btn-primary btn-lg" id="play-trailer-btn"><i class="bx bx-play"></i> Play Trailer</button>
            <button class="btn btn-outline btn-lg action-watchlist" data-id="${movie.id}" data-title="${movie.title}" data-poster="${getImageUrl(movie.poster_path)}" onclick="if(!requireAuth())return;"><i class="bx bx-bookmark"></i> Watchlist</button>
            <button class="btn btn-ghost btn-lg action-favorite" data-id="${movie.id}" data-title="${movie.title}" data-poster="${getImageUrl(movie.poster_path)}" onclick="if(!requireAuth())return;"><i class="bx bx-heart"></i> Favorite</button>
          </div>
        </div>
      `;

    // 2. Info Grid
    document.getElementById('info-grid').innerHTML = `
        <div class="info-card reveal delay-1"><p class="info-card-label">Status</p><p class="info-card-value">${movie.status || 'N/A'}</p></div>
        <div class="info-card reveal delay-2"><p class="info-card-label">Budget</p><p class="info-card-value">${movie.budget ? '$' + movie.budget.toLocaleString() : 'N/A'}</p></div>
        <div class="info-card reveal delay-3"><p class="info-card-label">Revenue</p><p class="info-card-value">${movie.revenue ? '$' + movie.revenue.toLocaleString() : 'N/A'}</p></div>
        <div class="info-card reveal delay-4"><p class="info-card-label">Vote Count</p><p class="info-card-value">${(movie.vote_count || 0).toLocaleString()}</p></div>
        <div class="info-card reveal delay-5"><p class="info-card-label">Popularity</p><p class="info-card-value">${(movie.popularity || 0).toFixed(0)}</p></div>
      `;

    // 3. Cast
    if (credits && credits.cast) {
        document.getElementById('cast-scroll').innerHTML = credits.cast.slice(0, 20).map(c => `
          <div class="cast-card reveal">
            <img src="${getImageUrl(c.profile_path, 'w185', c.name)}" alt="${c.name}" loading="lazy" onerror="handlePersonImageError(this)">
            <h4>${c.name}</h4>
            <p>${c.character || 'N/A'}</p>
          </div>
        `).join('');
        initCastAutoScroll();
    }

    // 4. Trailers
    if (videos && videos.results) {
        const trailers = videos.results.filter(v => v.site === 'YouTube');
        document.getElementById('trailers-container').innerHTML = trailers.length ?
            trailers.slice(0, 4).map(v => `
            <div class="info-card reveal" style="cursor:pointer;padding:0;overflow:hidden;" onclick="openTrailerModal('${v.key}')">
              <img src="https://img.youtube.com/vi/${v.key}/hqdefault.jpg" alt="${v.name}" style="width:100%;aspect-ratio:16/9;object-fit:cover;">
              <div style="padding:var(--space-md);display:flex;align-items:center;gap:var(--space-sm);">
                <i class="bx bx-play-circle" style="font-size:1.3rem;color:var(--primary);"></i>
                <span style="font-size:var(--fs-sm);font-weight:500;">${v.name}</span>
              </div>
            </div>
          `).join('') :
            '<p style="color:var(--text-muted);font-size:var(--fs-sm);">No trailers available.</p>';

        // Play trailer button
        const playBtn = document.getElementById('play-trailer-btn');
        if (playBtn && trailers.length > 0) {
            playBtn.addEventListener('click', () => openTrailerModal(trailers[0].key));
        } else if (playBtn) {
            playBtn.addEventListener('click', () => showToast('No trailer available', 'info'));
        }
    }

    // 5. Reviews
    createStarRating('user-rating-widget', movie.id, movie.title, getImageUrl(movie.poster_path));

    if (reviews && reviews.results) {
        document.getElementById('reviews-grid').innerHTML = reviews.results.length ?
            reviews.results.slice(0, 4).map(r => `
            <div class="review-card reveal">
              <div class="review-card-header">
                <img src="${r.author_details?.avatar_path ? getImageUrl(r.author_details.avatar_path, 'w45') : `https://ui-avatars.com/api/?name=${encodeURIComponent(r.author)}&background=333&color=fff`}" alt="${r.author}" class="review-avatar">
                <div class="review-author"><h4>${r.author}</h4><span>${r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</span></div>
              </div>
              ${r.author_details?.rating ? `<div class="review-stars">${'<i class="bx bxs-star"></i>'.repeat(Math.round(r.author_details.rating / 2))}${'<i class="bx bx-star empty"></i>'.repeat(5 - Math.round(r.author_details.rating / 2))}</div>` : ''}
              <p class="review-text">${r.content.substring(0, 300)}${r.content.length > 300 ? '...' : ''}</p>
            </div>
          `).join('') :
            '<p style="color:var(--text-muted);font-size:var(--fs-sm);">No reviews yet.</p>';
    }

    // 6. Similar
    if (similar && similar.results) {
        document.getElementById('similar-scroll').innerHTML =
            similar.results.slice(0, 15).map(m => buildMovieCard(m, 'movie')).join('');
    }

    initScrollReveal();
});

function initCastAutoScroll() {
    const container = document.getElementById('cast-scroll');
    if (!container) return;

    let scrollAmount = 0;
    const scrollStep = 220; // card width + gap
    const delay = 3000;

    setInterval(() => {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            container.scrollBy({ left: scrollStep, behavior: 'smooth' });
        }
    }, delay);
}
