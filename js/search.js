/* ============================================================
   MovieHub 2026 — Smart Search with Auto-complete
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initSmartSearch();
});

function initSmartSearch() {
  const searchInputs = document.querySelectorAll('.search-input');
  searchInputs.forEach(input => {
    const wrapper = input.closest('.nav-search-wrapper') || input.closest('.search-wrapper');
    if (!wrapper) return;

    let dropdown = wrapper.querySelector('.search-dropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'search-dropdown';
      wrapper.appendChild(dropdown);
    }

    let debounceTimer = null;
    let highlightedIndex = -1;
    let currentResults = [];

    input.addEventListener('input', () => {
      const query = input.value.trim();
      clearTimeout(debounceTimer);

      if (query.length < 2) {
        dropdown.classList.remove('active');
        dropdown.innerHTML = '';
        currentResults = [];
        return;
      }

      debounceTimer = setTimeout(async () => {
        const data = await searchMulti(query);
        if (!data || !data.results) return;

        currentResults = data.results
          .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
          .slice(0, 8);

        if (currentResults.length === 0) {
          dropdown.innerHTML = `
            <div class="search-item" style="justify-content:center;color:var(--text-muted);cursor:default;">
              No results found
            </div>`;
          dropdown.classList.add('active');
          return;
        }

        highlightedIndex = -1;
        renderResults(dropdown, currentResults);
        dropdown.classList.add('active');
      }, 300);
    });

    // Keyboard nav
    input.addEventListener('keydown', (e) => {
      const items = dropdown.querySelectorAll('.search-item[data-index]');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1);
        updateHighlight(items, highlightedIndex);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, 0);
        updateHighlight(items, highlightedIndex);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && currentResults[highlightedIndex]) {
          navigateToResult(currentResults[highlightedIndex]);
        }
      } else if (e.key === 'Escape') {
        dropdown.classList.remove('active');
        input.blur();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });

    // Focus shows results
    input.addEventListener('focus', () => {
      if (currentResults.length > 0) {
        dropdown.classList.add('active');
      }
    });
  });
}

function renderResults(dropdown, results) {
  dropdown.innerHTML = results.map((item, i) => {
    const title = item.title || item.name || 'Unknown';
    const date = item.release_date || item.first_air_date || '';
    const year = date ? ` (${date.split('-')[0]})` : '';
    const type = item.media_type === 'tv' ? 'TV' : 'Movie';
    const poster = item.poster_path
      ? getImageUrl(item.poster_path, 'w92')
      : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="56" fill="%23222"%3E%3Crect width="40" height="56"/%3E%3C/svg%3E';

    return `
      <div class="search-item" data-index="${i}" data-id="${item.id}" data-type="${item.media_type}">
        <img src="${poster}" alt="${title}">
        <div class="search-item-info">
          <h4>${title}${year}</h4>
          <span>${type}</span>
        </div>
      </div>
    `;
  }).join('');

  // Click handler
  dropdown.querySelectorAll('.search-item[data-index]').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.dataset.index);
      if (results[idx]) navigateToResult(results[idx]);
    });
  });
}

function updateHighlight(items, index) {
  items.forEach(item => item.classList.remove('highlighted'));
  if (items[index]) items[index].classList.add('highlighted');
}

function navigateToResult(item) {
  const page = item.media_type === 'tv' ? 'tv-details.html' : 'movie-details.html';
  window.location.href = `${page}?id=${item.id}`;
}
