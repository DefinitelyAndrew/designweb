// main.js — Definitely_Andrew Portfolio

(function () {
    const grid       = document.getElementById('works-grid');
    const cards      = () => Array.from(grid.querySelectorAll('.card'));
    const emptyState = document.getElementById('empty-state');
    const titleEl    = document.getElementById('filter-title');
    const searchInput = document.getElementById('search-input');
    const sortSelect  = document.getElementById('sort-options');
    const filterBtns  = document.querySelectorAll('.filter-btn');

    let activeFilter = '*';
    let searchQuery  = '';
    let sortMode     = 'newest';

    // ── Filter label map ──────────────────────────────
    const filterLabels = {
        '*':  'All Projects',
        'ds': 'Designs',
        'mc': 'Mockups',
        'ig': 'Infographics',
        'lg': 'Logos',
        'in': 'Innovations',
    };

    // ── Apply all current state ───────────────────────
    function applyState() {
        const all = cards();

        // 1. Sort
        const sorted = [...all].sort((a, b) => {
            if (sortMode === 'newest') {
                return new Date(b.dataset.date) - new Date(a.dataset.date);
            } else if (sortMode === 'oldest') {
                return new Date(a.dataset.date) - new Date(b.dataset.date);
            } else if (sortMode === 'alphabetical') {
                return (a.dataset.title || '').localeCompare(b.dataset.title || '');
            }
            return 0;
        });

        // Re-append in sorted order
        sorted.forEach(card => grid.appendChild(card));

        // 2. Filter + Search
        let visibleCount = 0;

        cards().forEach(card => {
            const matchesFilter =
                activeFilter === '*' ||
                card.classList.contains(activeFilter);

            const matchesSearch =
                searchQuery === '' ||
                (card.dataset.title || '').toLowerCase().includes(searchQuery);

            if (matchesFilter && matchesSearch) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // 3. Empty state
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';

        // 4. Update page title
        titleEl.textContent = filterLabels[activeFilter] || 'Projects';
    }

    // ── Filter buttons ────────────────────────────────
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            applyState();
        });
    });

    // ── Search ────────────────────────────────────────
    searchInput.addEventListener('input', () => {
        searchQuery = searchInput.value.trim().toLowerCase();
        applyState();
    });

    // ── Sort ─────────────────────────────────────────
    sortSelect.addEventListener('change', () => {
        sortMode = sortSelect.value;
        applyState();
    });

    // ── Initial render ────────────────────────────────
    applyState();

})();
