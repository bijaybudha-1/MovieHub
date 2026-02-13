// Profile Page JavaScript - Tab Navigation & Card Actions

document.addEventListener("DOMContentLoaded", function () {
  // ============================================
  // TAB NAVIGATION FUNCTIONALITY
  // ============================================

  const navItems = document.querySelectorAll(".setting-nav-area li");
  const sections = {
    "Add to List": document.querySelector(".add-to-list-section"),
    "Favorite": document.querySelector(".favorite-section"),
    "Watch List": document.querySelector(".watchlist-section"),
    "Rating": document.querySelector(".user-rating-section"),
    "Setting": document.querySelector(".user-setting-section-content"),
  };

  // Hide all sections
  function hideAllSections() {
    Object.values(sections).forEach((section) => {
      if (section) {
        section.style.display = "none";
      }
    });
  }

  // Remove active class from all nav items
  function removeActiveClass() {
    navItems.forEach((item) => {
      item.classList.remove("active");
    });
  }

  // Show specific section
  function showSection(sectionName) {
    hideAllSections();
    if (sections[sectionName]) {
    const addlist = readList('moviehub_addtolist');
    const fav = readList('moviehub_favorites');
    const wl = readList('moviehub_watchlist');
    const ratings = readList('moviehub_ratings');

    function renderInto(container, items, key) {
      container.innerHTML = '';
      container.classList.add('profile-list-grid');
      if (!items || items.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'para';
        empty.textContent = 'No items yet.';
        container.appendChild(empty);
        return;
      }
      items.forEach((m) => {
        const { wrapper, favBtn, listBtn, removeBtn } = createListItem(m);

        favBtn.addEventListener('click', () => {
          const favs = readList('moviehub_favorites');
          if (!favs.find((x) => String(x.id) === String(m.id))) {
            favs.unshift(m);
            writeList('moviehub_favorites', favs);
            showToast(`Your "${m.title || m.name}" added a favorite`, 'success');
          } else showToast('Already in favorites', 'info');
          renderLists();
        });

        listBtn.addEventListener('click', () => {
          const wls = readList('moviehub_watchlist');
          if (!wls.find((x) => String(x.id) === String(m.id))) {
            wls.unshift(m);
            writeList('moviehub_watchlist', wls);
            showToast(`Added to watch list "${m.title || m.name}"`, 'success');
          } else showToast('Already in watchlist', 'info');
          renderLists();
        });

        // Profile Page JavaScript - Tab Navigation & Card Actions

        document.addEventListener("DOMContentLoaded", function () {
          // ============================================
          // TAB NAVIGATION FUNCTIONALITY
          // ============================================

          const navItems = document.querySelectorAll(".setting-nav-area li");
          const sections = {
            "Add to List": document.querySelector(".add-to-list-section"),
            "Favorite": document.querySelector(".favorite-section"),
            "Watch List": document.querySelector(".watchlist-section"),
            "Rating": document.querySelector(".user-rating-section"),
            "Setting": document.querySelector(".user-setting-section-content"),
          };

          function hideAllSections() {
            Object.values(sections).forEach((section) => {
              if (section) section.style.display = "none";
            });
          }

          function removeActiveClass() {
            navItems.forEach((item) => item.classList.remove("active"));
          }

          function showSection(sectionName) {
            hideAllSections();
            if (sections[sectionName]) sections[sectionName].style.display = "block";
          }

          // Initialize navigation
          hideAllSections();
          if (sections["Add to List"]) sections["Add to List"].style.display = "block";
          if (navItems[0]) navItems[0].classList.add("active");

          navItems.forEach((item) => {
            item.addEventListener("click", function () {
              const sectionName = this.textContent.trim();
              removeActiveClass();
              this.classList.add("active");
              showSection(sectionName);
            });
          });

          // ============================================
          // TOAST NOTIFICATION FUNCTION
          // ============================================

          function showToast(message, type = "success") {
            const existing = document.querySelector(".toast-notification");
            if (existing) existing.remove();

            const toast = document.createElement("div");
            toast.className = `toast-notification ${type}`;

            let icon = "✓";
            if (type === "error") icon = "✕";
            if (type === "info") icon = "ℹ";

            toast.innerHTML = `
              <span class="toast-notification-icon">${icon}</span>
              <span class="toast-notification-message">${message}</span>
            `;

            document.body.appendChild(toast);

            setTimeout(() => {
              toast.classList.add("hide");
              setTimeout(() => toast.remove(), 300);
            }, 3000);
          }

          // ============================================
          // LOCALSTORAGE HELPERS
          // ============================================
          function readList(key) {
            try {
              return JSON.parse(localStorage.getItem(key)) || [];
            } catch (e) {
              return [];
            }
          }

          function writeList(key, data) {
            localStorage.setItem(key, JSON.stringify(data));
          }

          // ============================================
          // CREATE LIST ITEM (used for add/fav/watch lists)
          // ============================================
          function createListItem(m) {
            const wrapper = document.createElement('div');
            wrapper.className = 'profile-list-item d-flex gap-1 p-1 mt-1';

            const img = document.createElement('img');
            img.src = m.poster_path || '../assets/images/movie-images.jpg';
            img.alt = m.title || m.name || 'Poster';
            img.style.width = '80px'; img.style.height = '120px'; img.style.objectFit = 'cover';

            const content = document.createElement('div');
            const title = document.createElement('div'); title.className = 'main-para'; title.textContent = m.title || m.name || 'Untitled';
            const date = document.createElement('div'); date.className = 'mini-para'; date.textContent = m.release_date || m.first_air_date || '';
            const btns = document.createElement('div'); btns.className = 'movie-card-btn';

            const favBtn = document.createElement('button'); favBtn.textContent = 'Favorite';
            const listBtn = document.createElement('button'); listBtn.textContent = 'Watchlist';
            const removeBtn = document.createElement('button'); removeBtn.textContent = 'Remove';

            btns.appendChild(favBtn); btns.appendChild(listBtn); btns.appendChild(removeBtn);
            content.appendChild(title); content.appendChild(date); content.appendChild(btns);

            wrapper.appendChild(img); wrapper.appendChild(content);

            return { wrapper, favBtn, listBtn, removeBtn };
          }

          // ============================================
          // RENDER LISTS
          // ============================================
          function renderLists() {
            const addToListContainer = document.querySelector('.add-to-list-content');
            const favoritesContainer = document.querySelector('.favorite-content');
            const watchlistContainer = document.querySelector('.watchlist-content');
            const ratingSection = document.querySelector('.user-rating-section');

            const addlist = readList('moviehub_addtolist');
            const fav = readList('moviehub_favorites');
            const wl = readList('moviehub_watchlist');
            const ratings = readList('moviehub_ratings');

            function renderInto(container, items, key) {
              container.innerHTML = '';
              container.classList.add('profile-list-grid');
              if (!items || items.length === 0) {
                const empty = document.createElement('div'); empty.className = 'para'; empty.textContent = 'No items yet.'; container.appendChild(empty); return;
              }
              items.forEach(m => {
                const { wrapper, favBtn, listBtn, removeBtn } = createListItem(m);

                favBtn.addEventListener('click', () => {
                  const favs = readList('moviehub_favorites');
                  if (!favs.find(x=>String(x.id)===String(m.id))) { favs.unshift(m); writeList('moviehub_favorites', favs); showToast(`Your "${m.title || m.name}" added a favorite`, 'success'); }
                  else showToast('Already in favorites','info');
                  renderLists();
                });

                listBtn.addEventListener('click', () => {
                  const wls = readList('moviehub_watchlist');
                  if (!wls.find(x=>String(x.id)===String(m.id))) { wls.unshift(m); writeList('moviehub_watchlist', wls); showToast(`Added to watch list "${m.title || m.name}"`, 'success'); }
                  else showToast('Already in watchlist','info');
                  renderLists();
                });

                removeBtn.addEventListener('click', () => {
                  let list = readList(key);
                  list = list.filter(x => String(x.id) !== String(m.id));
                  writeList(key, list);
                  showToast(`"${m.title || m.name}" removed`, 'success');
                  renderLists();
                });

                container.appendChild(wrapper);
              });
            }

            renderInto(addToListContainer, addlist, 'moviehub_addtolist');
            renderInto(favoritesContainer, fav, 'moviehub_favorites');
            renderInto(watchlistContainer, wl, 'moviehub_watchlist');

            // Ratings rendering (no fav/watch buttons)
            if (ratingSection) {
              const prev = ratingSection.querySelector('.rating-content'); if (prev) prev.remove();
              const ratingContent = document.createElement('div'); ratingContent.className = 'rating-content profile-list-grid';

              if (!ratings || ratings.length === 0) {
                const empty = document.createElement('div'); empty.className = 'para'; empty.textContent = 'No ratings yet.'; ratingContent.appendChild(empty);
              } else {
                ratings.forEach(r => {
                  const wrapper = document.createElement('div'); wrapper.className = 'profile-list-item d-flex gap-1 p-1 mt-1';
                  const img = document.createElement('img'); img.src = r.poster_path || '../assets/images/movie-images.jpg'; img.alt = r.title || r.name || 'Poster'; img.style.width='80px'; img.style.height='120px'; img.style.objectFit='cover';

                  const content = document.createElement('div');
                  const title = document.createElement('div'); title.className = 'main-para'; title.textContent = r.title || r.name || 'Untitled';
                  const ratingBadge = document.createElement('div'); ratingBadge.className = 'mini-para'; ratingBadge.textContent = `Your rating: ${r.rating || ''}/10`;

                  const btns = document.createElement('div'); btns.className = 'movie-card-btn';
                  const editBtn = document.createElement('button'); editBtn.className = 'ml-1 edit-rating-btn'; editBtn.innerHTML = '<i class="bx bx-edit"></i>';
                  const deleteBtn = document.createElement('button'); deleteBtn.textContent = 'Delete Rating';

                  btns.appendChild(editBtn); btns.appendChild(deleteBtn);
                  content.appendChild(title); content.appendChild(ratingBadge); content.appendChild(btns);
                  wrapper.appendChild(img); wrapper.appendChild(content);

                  editBtn.addEventListener('click', () => {
                    const val = prompt(`Update rating for "${r.title || r.name}" (1-10):`, r.rating || '');
                    if (val === null) return;
                    const n = Number(val);
                    if (!n || n < 1 || n > 10) return showToast('Please enter a number between 1 and 10','error');
                    const ratingsList = readList('moviehub_ratings');
                    const idx = ratingsList.findIndex(x => String(x.id) === String(r.id));
                    if (idx !== -1) { ratingsList[idx].rating = n; writeList('moviehub_ratings', ratingsList); showToast(`Updated rating for "${r.title || r.name}" to ${n}/10`, 'success'); }
                    else { ratingsList.unshift({ id: r.id, title: r.title || r.name, rating: n, poster_path: r.poster_path }); writeList('moviehub_ratings', ratingsList); showToast(`Rated "${r.title || r.name}" ${n}/10`, 'success'); }
                    renderLists();
                  });

                  deleteBtn.addEventListener('click', () => { let rl = readList('moviehub_ratings'); rl = rl.filter(x => String(x.id) !== String(r.id)); writeList('moviehub_ratings', rl); showToast(`Rating for "${r.title || r.name}" deleted`, 'success'); renderLists(); });

                  ratingContent.appendChild(wrapper);
                });
              }

              ratingSection.appendChild(ratingContent);
            }
          }

          // initial render and expose for debugging
          renderLists();
          window._renderProfileLists = renderLists;
        });
    const btns = document.createElement('div'); btns.className = 'movie-card-btn';

    const favBtn = document.createElement('button'); favBtn.textContent = 'Favorite';
    const listBtn = document.createElement('button'); listBtn.textContent = 'Watchlist';
    const removeBtn = document.createElement('button'); removeBtn.textContent = 'Remove';

    btns.appendChild(favBtn); btns.appendChild(listBtn); btns.appendChild(removeBtn);
    content.appendChild(title); content.appendChild(date); content.appendChild(btns);

    wrapper.appendChild(img); wrapper.appendChild(content);

    return { wrapper, favBtn, listBtn, removeBtn };
  }

  function renderLists() {
    const addToListContainer = document.querySelector('.add-to-list-content');
    const favoritesContainer = document.querySelector('.favorite-content');
    const watchlistContainer = document.querySelector('.watchlist-content');

    const addlist = readList('moviehub_addtolist');
    const fav = readList('moviehub_favorites');
    const wl = readList('moviehub_watchlist');

    function renderInto(container, items, key) {
      container.innerHTML = '';
      container.classList.add('profile-list-grid');
      if (!items || items.length === 0) {
        const empty = document.createElement('div'); empty.className = 'para'; empty.textContent = 'No items yet.'; container.appendChild(empty); return;
      }
      items.forEach(m => {
        const { wrapper, favBtn, listBtn, removeBtn } = createListItem(m);

        favBtn.addEventListener('click', () => {
          const favs = readList('moviehub_favorites');
          if (!favs.find(x=>String(x.id)===String(m.id))) { favs.unshift(m); writeList('moviehub_favorites', favs); showToast(`Your \"${m.title || m.name}\" added a favorite`, 'success'); }
          else showToast('Already in favorites','info');
          renderLists();
        });

        listBtn.addEventListener('click', () => {
          const wls = readList('moviehub_watchlist');
          if (!wls.find(x=>String(x.id)===String(m.id))) { wls.unshift(m); writeList('moviehub_watchlist', wls); showToast(`Added to watch list \"${m.title || m.name}\"`, 'success'); }
          else showToast('Already in watchlist','info');
          renderLists();
        });

        removeBtn.addEventListener('click', () => {
          let list = readList(key);
          list = list.filter(x => String(x.id) !== String(m.id));
          writeList(key, list);
          showToast(`"${m.title || m.name}" removed`, 'success');
          renderLists();
        });

          // add edit rating icon/button
          const editBtn = document.createElement('button');
          editBtn.className = 'ml-1';
          editBtn.innerHTML = '<i class="bx bx-edit"></i>';
          ratingBadge.appendChild(editBtn);
          editBtn.addEventListener('click', () => {
            const val = prompt(`Update rating for \"${r.title || r.name}\" (1-10):`, r.rating || '');
            if (val === null) return;
            const n = Number(val);
            if (!n || n < 1 || n > 10) return showToast('Please enter a number between 1 and 10','error');
            const ratingsList = readList('moviehub_ratings');
            const idx = ratingsList.findIndex(x => String(x.id) === String(r.id));
            if (idx !== -1) { ratingsList[idx].rating = n; writeList('moviehub_ratings', ratingsList); showToast(`Updated rating for \"${r.title || r.name}\" to ${n}/10`, 'success'); }
            else { ratingsList.unshift({ id: r.id, title: r.title || r.name, rating: n, poster_path: r.poster_path }); writeList('moviehub_ratings', ratingsList); showToast(`Rated \"${r.title || r.name}\" ${n}/10`, 'success'); }
            renderLists();
          });

          ratingSection.appendChild(wrapper);
        });
      }
    }
  }

  // initial render and expose for debugging
  renderLists();
  window._renderProfileLists = renderLists;
});