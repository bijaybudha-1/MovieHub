/* ============================================================
   MovieHub 2026 — TV Details Page Logic
   ============================================================ */

const showId = new URLSearchParams(window.location.search).get('id');
if (!showId) window.location.href = 'tvshows.html';

document.addEventListener('DOMContentLoaded', async () => {
    const [show, credits, videos, reviews, similar] = await Promise.all([
        getTVShowDetails(showId), getTVShowCredits(showId), getTVShowVideos(showId), getTVShowReviews(showId), getSimilarTVShows(showId)
    ]);

    if (!show) { document.getElementById('detail-content').innerHTML = '<p>Show not found.</p>'; return; }
    document.title = `MovieHub — ${show.name}`;

    document.getElementById('detail-bg').style.backgroundImage = `url(${getBackdropUrl(show.backdrop_path)})`;
    const rating = (show.vote_average || 0).toFixed(1);

    document.getElementById('detail-content').innerHTML = `
        <div class="detail-poster reveal-left"><img src="${getImageUrl(show.poster_path)}" alt="${show.name}"></div>
        <div class="detail-info reveal-right">
          <h1 class="detail-title">${show.name}</h1>
          ${show.tagline ? `<p class="detail-tagline">"${show.tagline}"</p>` : ''}
          <div class="detail-meta">
            <span class="detail-meta-item" style="color:${getRatingColor(show.vote_average)};font-weight:600;"><i class="bx bxs-star"></i> ${rating}</span>
            <span class="detail-meta-item"><i class="bx bx-calendar"></i> ${show.first_air_date || 'TBA'}</span>
            <span class="detail-meta-item"><i class="bx bx-tv"></i> ${show.number_of_seasons || '?'} Seasons</span>
            <span class="detail-meta-item"><i class="bx bx-film"></i> ${show.number_of_episodes || '?'} Episodes</span>
          </div>
          <div class="detail-genre-tags">${(show.genres || []).map(g => `<span class="genre-tag">${g.name}</span>`).join('')}</div>
          <h3 class="detail-overview-title">Overview</h3>
          <p class="detail-overview">${show.overview || 'No overview available.'}</p>
          <div class="detail-actions">
            <button class="btn btn-primary btn-lg" id="play-trailer-btn"><i class="bx bx-play"></i> Play Trailer</button>
            <button class="btn btn-outline btn-lg action-watchlist" data-id="${show.id}" data-title="${show.name}" data-poster="${getImageUrl(show.poster_path)}"><i class="bx bx-bookmark"></i> Watchlist</button>
            <button class="btn btn-ghost btn-lg action-favorite" data-id="${show.id}" data-title="${show.name}" data-poster="${getImageUrl(show.poster_path)}"><i class="bx bx-heart"></i> Favorite</button>
          </div>
        </div>
      `;

    document.getElementById('info-grid').innerHTML = `
        <div class="info-card reveal"><p class="info-card-label">Status</p><p class="info-card-value">${show.status || 'N/A'}</p></div>
        <div class="info-card reveal"><p class="info-card-label">Type</p><p class="info-card-value">${show.type || 'N/A'}</p></div>
        <div class="info-card reveal"><p class="info-card-label">Network</p><p class="info-card-value">${show.networks?.[0]?.name || 'N/A'}</p></div>
        <div class="info-card reveal"><p class="info-card-label">Popularity</p><p class="info-card-value">${(show.popularity || 0).toFixed(0)}</p></div>
        <div class="info-card reveal"><p class="info-card-label">Vote Count</p><p class="info-card-value">${(show.vote_count || 0).toLocaleString()}</p></div>
      `;

    if (credits && credits.cast) {
        document.getElementById('cast-scroll').innerHTML = credits.cast.slice(0, 20).map(c => `
          <div class="cast-card reveal"><img src="${getImageUrl(c.profile_path, 'w185', c.name)}" alt="${c.name}" loading="lazy" onerror="handlePersonImageError(this)"><h4>${c.name}</h4><p>${c.character || 'N/A'}</p></div>
        `).join('');
    }

    if (videos && videos.results) {
        const trailers = videos.results.filter(v => v.site === 'YouTube');
        document.getElementById('trailers-container').innerHTML = trailers.length ?
            trailers.slice(0, 4).map(v => `
            <div class="info-card reveal" style="cursor:pointer;padding:0;overflow:hidden;" onclick="openTrailerModal('${v.key}')">
              <img src="https://img.youtube.com/vi/${v.key}/hqdefault.jpg" alt="${v.name}" style="width:100%;aspect-ratio:16/9;object-fit:cover;">
              <div style="padding:var(--space-md);display:flex;align-items:center;gap:var(--space-sm);"><i class="bx bx-play-circle" style="font-size:1.3rem;color:var(--primary);"></i><span style="font-size:var(--fs-sm);">${v.name}</span></div>
            </div>
          `).join('') : '<p style="color:var(--text-muted);">No trailers available.</p>';

        const playBtn = document.getElementById('play-trailer-btn');
        if (playBtn && trailers.length > 0) playBtn.addEventListener('click', () => openTrailerModal(trailers[0].key));
        else if (playBtn) playBtn.addEventListener('click', () => showToast('No trailer available', 'info'));
    }

    createStarRating('user-rating-widget', show.id, show.name, getImageUrl(show.poster_path));

    if (reviews && reviews.results) {
        document.getElementById('reviews-grid').innerHTML = reviews.results.length ?
            reviews.results.slice(0, 4).map(r => `
            <div class="review-card reveal">
              <div class="review-card-header"><img src="${r.author_details?.avatar_path ? getImageUrl(r.author_details.avatar_path, 'w45') : `https://ui-avatars.com/api/?name=${encodeURIComponent(r.author)}&background=333&color=fff`}" alt="${r.author}" class="review-avatar"><div class="review-author"><h4>${r.author}</h4><span>${r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}</span></div></div>
              <p class="review-text">${r.content.substring(0, 300)}${r.content.length > 300 ? '...' : ''}</p>
            </div>
          `).join('') : '<p style="color:var(--text-muted);">No reviews yet.</p>';
    }

    if (similar && similar.results) {
        document.getElementById('similar-scroll').innerHTML = similar.results.slice(0, 15).map(m => buildMovieCard(m, 'tv')).join('');
    }

    initScrollReveal();
});
