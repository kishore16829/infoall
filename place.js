(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const grid = $('#placesGrid'), cards = $$('.place-card', grid), search = $('#placeSearch'), sort = $('#sortSelect');
  const count = $('#resultCount'), empty = $('#emptyState'), toast = $('#toast'), modal = $('#placeModal');
  let activeFilter = 'all', savedOnly = false, activePlace = null, toastTimer;
  const savedKey = 'infoall.savedPlaces';
  const getSaved = () => { try { return JSON.parse(localStorage.getItem(savedKey) || '[]'); } catch { return []; } };
  const setSaved = values => { try { localStorage.setItem(savedKey, JSON.stringify(values)); } catch {} };
  const slug = card => card.querySelector('[data-save]')?.dataset.save || '';
  function notify(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2400); }
  function updateSavedUI() { const saved = getSaved(); $('#savedCount').textContent = saved.length; $$('[data-save]').forEach(btn => { const yes = saved.includes(btn.dataset.save); btn.classList.toggle('saved', yes); btn.textContent = yes ? '♥' : '♡'; btn.setAttribute('aria-pressed', String(yes)); }); }
  function applyFilters() {
    const term = search.value.trim().toLowerCase(); let shown = 0;
    const ordered = [...cards].sort((a,b) => {
      if (sort.value === 'az') return a.dataset.name.localeCompare(b.dataset.name);
      if (sort.value === 'budget') return Number(a.dataset.budget) - Number(b.dataset.budget);
      return Number(a.dataset.index) - Number(b.dataset.index);
    });
    ordered.forEach(card => {
      const matchesText = (card.dataset.name + ' ' + card.dataset.description + ' ' + card.dataset.category).toLowerCase().includes(term);
      const matchesCategory = activeFilter === 'all' || card.dataset.category.split(' ').includes(activeFilter);
      const matchesSaved = !savedOnly || getSaved().includes(slug(card));
      const visible = matchesText && matchesCategory && matchesSaved;
      card.hidden = !visible; if (visible) shown++;
      grid.appendChild(card);
    });
    count.textContent = `${String(shown).padStart(2,'0')} ${shown === 1 ? 'PLACE' : 'PLACES'} TO EXPLORE`;
    empty.hidden = shown !== 0;
    $$('.filter-chip').forEach(btn => btn.classList.toggle('active', btn.dataset.filter === activeFilter));
  }
  function toggleSave(id) {
    const saved = getSaved(), exists = saved.includes(id);
    setSaved(exists ? saved.filter(item => item !== id) : [...saved, id]); updateSavedUI(); applyFilters();
    notify(exists ? 'Removed from your saved places.' : 'Place saved to your collection.');
    if (activePlace === id) $('#modalSave').textContent = getSaved().includes(id) ? '♥ Saved to your places' : '♡ Save this place';
  }
  function openDetails(id) {
    const card = cards.find(item => slug(item) === id); if (!card) return;
    activePlace = id; $('#modalTitle').textContent = card.dataset.name.split(' ').slice(0, card.dataset.name.includes('Swiss') ? 2 : 1).join(' ');
    if (id === 'swiss-alps') $('#modalTitle').textContent = 'Swiss Alps';
    if (id === 'varkala') $('#modalTitle').textContent = 'Varkala';
    if (id === 'maldives') $('#modalTitle').textContent = 'Maldives';
    if (id === 'munnar') $('#modalTitle').textContent = 'Munnar';
    $('#modalDescription').textContent = card.dataset.description;
    $('#modalBest').textContent = card.dataset.best; $('#modalDuration').textContent = card.dataset.duration; $('#modalCost').textContent = card.dataset.cost;
    $('#modalPhoto').style.backgroundImage = getComputedStyle(card.querySelector('.card-image')).backgroundImage;
    $('#modalSave').textContent = getSaved().includes(id) ? '♥ Saved to your places' : '♡ Save this place';
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow = 'hidden'; $('#modalClose').focus();
  }
  function closeModal() { modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow = ''; activePlace = null; }
  $$('.filter-chip').forEach(btn => btn.addEventListener('click', () => { activeFilter = btn.dataset.filter; savedOnly = false; $('#savedToggle').classList.remove('selected'); applyFilters(); }));
  search.addEventListener('input', applyFilters); sort.addEventListener('change', applyFilters);
  $('#resetFilters').addEventListener('click', () => { search.value = ''; activeFilter = 'all'; savedOnly = false; applyFilters(); });
  $('#savedToggle').addEventListener('click', () => { savedOnly = !savedOnly; activeFilter = 'all'; $('#savedToggle').classList.toggle('selected', savedOnly); $('#savedToggle').firstChild.textContent = savedOnly ? '♥ Show all places ' : '♡ View saved places '; applyFilters(); if (savedOnly) $('#explore').scrollIntoView({behavior:'smooth'}); });
  grid.addEventListener('click', e => { const save = e.target.closest('[data-save]'); const details = e.target.closest('[data-details]'); if (save) toggleSave(save.dataset.save); else if (details) openDetails(details.dataset.details); });
  $('#modalClose').addEventListener('click', closeModal); modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  $('#modalSave').addEventListener('click', () => { if (activePlace) toggleSave(activePlace); });
  document.addEventListener('keydown', e => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); search.focus(); $('#explore').scrollIntoView({behavior:'smooth'}); } if (e.key === 'Escape') closeModal(); });
  $('#menuToggle').addEventListener('click', () => { const nav = $('#mobileNav'), open = nav.classList.toggle('open'); $('#menuToggle').setAttribute('aria-expanded', String(open)); $('#menuToggle').textContent = open ? '×' : '☰'; });
  $$('#mobileNav a').forEach(a => a.addEventListener('click', () => { $('#mobileNav').classList.remove('open'); $('#menuToggle').setAttribute('aria-expanded','false'); $('#menuToggle').textContent = '☰'; }));
  const themeKey = 'infoall.placeTheme';
  try { if (localStorage.getItem(themeKey) === 'dark') document.body.classList.add('dark-mode'); } catch {}
  $('#themeToggle').addEventListener('click', () => { document.body.classList.toggle('dark-mode'); try { localStorage.setItem(themeKey, document.body.classList.contains('dark-mode') ? 'dark' : 'light'); } catch {} notify(document.body.classList.contains('dark-mode') ? 'Dark theme enabled.' : 'Light theme enabled.'); });
  const backTop = $('#backTop'); window.addEventListener('scroll', () => backTop.classList.toggle('visible', window.scrollY > 450), {passive:true}); backTop.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } }), {threshold:.12}) : null;
  $$('.reveal').forEach(el => observer ? observer.observe(el) : el.classList.add('in-view'));
  $('#year').textContent = new Date().getFullYear(); updateSavedUI(); applyFilters();
})();
