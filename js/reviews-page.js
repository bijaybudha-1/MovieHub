/* ============================================================
   MovieHub 2026 — Reviews Page Logic
   ============================================================ */

let reviewRating = 0;

document.addEventListener('DOMContentLoaded', async () => {
    // Star widget for form
    const starDiv = document.getElementById('review-star-widget');
    starDiv.innerHTML = '';
    const starsWrap = document.createElement('div');
    starsWrap.style.cssText = 'display:flex;gap:6px;';
    for (let i = 1; i <= 10; i++) {
        const s = document.createElement('i');
        s.className = 'bx bx-star';
        s.style.cssText = 'font-size:1.5rem;cursor:pointer;color:var(--text-muted);transition:0.15s;';
        s.dataset.value = i;
        s.addEventListener('mouseenter', () => { highlightStars(starsWrap, i); });
        s.addEventListener('click', () => { reviewRating = i; setStarsFixed(starsWrap, i); });
        starsWrap.appendChild(s);
    }
    starsWrap.addEventListener('mouseleave', () => { setStarsFixed(starsWrap, reviewRating); });
    starDiv.appendChild(starsWrap);

    function highlightStars(w, val) { w.querySelectorAll('i').forEach(s => { const v = +s.dataset.value; s.className = v <= val ? 'bx bxs-star' : 'bx bx-star'; s.style.color = v <= val ? '#f59e0b' : 'var(--text-muted)'; }); }
    function setStarsFixed(w, val) { highlightStars(w, val); }

    // Form submit
    document.getElementById('review-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('review-title').value.trim();
        const text = document.getElementById('review-text').value.trim();
        if (!title || !text) return showToast('Please fill all fields', 'error');
        if (reviewRating === 0) return showToast('Please select a rating', 'error');

        const reviews = safeParse('moviehub_reviews');
        reviews.unshift({ title, text, rating: reviewRating, date: new Date().toISOString() });
        safeWrite('moviehub_reviews', reviews);
        showToast('Review submitted!', 'success');
        e.target.reset();
        reviewRating = 0;
        setStarsFixed(starsWrap, 0);
        renderUserReviews();
        updateStats();
    });

    renderUserReviews();
    updateStats();

    const data = await getTopRatedMovies();
    if (data && data.results) document.getElementById('top-reviewed-scroll').innerHTML = data.results.slice(0, 15).map(m => buildMovieCard(m)).join('');
    initScrollReveal();
});

function renderUserReviews() {
    const reviews = safeParse('moviehub_reviews');
    const container = document.getElementById('user-reviews');
    if (reviews.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="bx bx-edit"></i><h3>No reviews yet</h3><p>Write your first review above!</p></div>';
        return;
    }
    container.innerHTML = reviews.map((r, i) => `
        <div class="review-card reveal">
          <div class="review-card-header">
            <img src="https://ui-avatars.com/api/?name=You&background=e50914&color=fff" alt="You" class="review-avatar">
            <div class="review-author"><h4>${r.title}</h4><span>${new Date(r.date).toLocaleDateString()}</span></div>
          </div>
          <div class="review-stars">${'<i class="bx bxs-star"></i>'.repeat(Math.min(Math.round(r.rating / 2), 5))}${'<i class="bx bx-star empty"></i>'.repeat(5 - Math.min(Math.round(r.rating / 2), 5))}</div>
          <p class="review-text">${r.text}</p>
          <button class="btn btn-sm btn-outline" style="margin-top:var(--space-md);color:var(--rating-low);border-color:var(--rating-low);" onclick="deleteReview(${i})"><i class="bx bx-trash"></i> Delete</button>
        </div>
      `).join('');
}

function deleteReview(idx) {
    const reviews = safeParse('moviehub_reviews');
    reviews.splice(idx, 1);
    safeWrite('moviehub_reviews', reviews);
    showToast('Review deleted', 'success');
    renderUserReviews();
    updateStats();
    initScrollReveal();
}

function updateStats() {
    const reviews = safeParse('moviehub_reviews');
    document.getElementById('review-count').textContent = reviews.length;
    const avg = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : '0';
    document.getElementById('review-avg').textContent = avg;
}
