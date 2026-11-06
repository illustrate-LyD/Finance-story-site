(() => {
  'use strict';
  const root = document.documentElement;
  // data-base is set from Eleventy pathPrefix (e.g. "/" or "/Finance-story-site/").
  // Filter state rewrite uses location.pathname (already includes the Pages base);
  // withBase is available if we ever need root-absolute navigation under a prefix.
  const rawBase = root.dataset.base || '/';
  const basePath = rawBase === '/' ? '/' : (rawBase.endsWith('/') ? rawBase : `${rawBase}/`);
  const withBase = (path) => {
    if (!path || path.startsWith('#') || /^https?:/i.test(path)) return path;
    const cleaned = path.startsWith('/') ? path.slice(1) : path;
    return basePath === '/' ? `/${cleaned}` : `${basePath}${cleaned}`;
  };
  void withBase;

  const themeButtons = document.querySelectorAll('[data-theme-toggle]');
  const updateThemeControls = () => {
    const dark = root.dataset.theme === 'dark';
    themeButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? '切换到浅色主题' : '切换到深色主题');
      button.querySelector('[data-theme-label]').textContent = dark ? '浅色' : '深色';
      button.querySelector('[data-theme-icon]').textContent = dark ? '☀' : '☾';
    });
  };
  themeButtons.forEach((button) => button.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('finance-story-theme', root.dataset.theme); } catch (_) {}
    updateThemeControls();
  }));
  updateThemeControls();

  const form = document.querySelector('[data-filter-form]');
  if (!form) return;
  const items = [...document.querySelectorAll('[data-filter-list] [data-story]')];
  const empty = document.querySelector('[data-empty]');
  const list = document.querySelector('[data-filter-list]');
  const count = document.querySelector('[data-result-count]');
  const summary = document.querySelector('[data-selection-summary]');
  const lockedScene = form.querySelector('input[name="scene"]').value;
  const split = (value) => value ? value.split(',').map((x) => x.trim()).filter(Boolean) : [];
  const unique = (array) => [...new Set(array)];

  function readUrl() {
    const params = new URLSearchParams(window.location.search);
    const selectedTags = unique(params.getAll('tag').flatMap(split));
    form.querySelectorAll('[data-tag]').forEach((button) => {
      const selected = selectedTags.includes(button.dataset.tag);
      button.setAttribute('aria-pressed', String(selected));
    });
    const level = ['L1', 'L2', 'L3'].includes(params.get('difficulty')) ? params.get('difficulty') : '';
    const radio = form.querySelector(`input[name="difficulty"][value="${level}"]`);
    if (radio) radio.checked = true;
    if (!lockedScene) {
      const scene = params.get('scene') || '';
      form.querySelectorAll('[data-scene]').forEach((button) => {
        const selected = (button.dataset.scene || '') === scene;
        button.setAttribute('aria-pressed', String(selected));
        button.classList.toggle('selected', selected);
      });
      form.querySelector('input[name="scene"]').value = scene;
    }
  }

  function applyFilters() {
    const tags = form.querySelectorAll('[data-tag][aria-pressed="true"]');
    const selectedTags = [...tags].map((button) => button.dataset.tag);
    const level = form.querySelector('input[name="difficulty"]:checked').value;
    const scene = lockedScene || form.querySelector('input[name="scene"]').value;
    let visible = 0;
    items.forEach((item) => {
      const itemTags = unique(split(item.dataset.tags));
      const levels = split(item.dataset.difficulty);
      const scenes = split(item.dataset.scene);
      const matches = (!scene || scenes.includes(scene)) &&
        (!selectedTags.length || selectedTags.some((tag) => itemTags.includes(tag))) &&
        (!level || levels.includes(level));
      item.hidden = !matches;
      if (matches) visible++;
    });
    if (count) count.textContent = visible;
    if (empty) empty.hidden = visible !== 0;
    if (list) list.hidden = visible === 0;
    if (summary) summary.textContent = `${selectedTags.length ? selectedTags.join(' / ') : '全部标签'} · ${({'L1':'入门','L2':'进阶','L3':'精读'})[level] || '全部难度'}`;

    const params = new URLSearchParams();
    if (scene) params.set('scene', scene);
    selectedTags.forEach((tag) => params.append('tag', tag));
    if (level) params.set('difficulty', level);
    const query = params.toString();
    // Keep the current pathname (already includes GitHub Pages project base).
    history.replaceState(null, '', `${location.pathname}${query ? '?' + query : ''}${location.hash}`);
  }

  form.addEventListener('click', (event) => {
    const tag = event.target.closest('[data-tag]');
    const scene = event.target.closest('button[data-scene]');
    if (tag) tag.setAttribute('aria-pressed', String(tag.getAttribute('aria-pressed') !== 'true'));
    if (scene) {
      form.querySelectorAll('button[data-scene]').forEach((button) => {
        const selected = button === scene;
        button.setAttribute('aria-pressed', String(selected));
        button.classList.toggle('selected', selected);
      });
      form.querySelector('input[name="scene"]').value = scene.dataset.scene;
    }
    if (tag || scene) applyFilters();
  });
  form.addEventListener('change', applyFilters);
  form.addEventListener('submit', (event) => { event.preventDefault(); applyFilters(); });
  document.querySelectorAll('[data-clear-filters]').forEach((button) => button.addEventListener('click', () => {
    form.querySelectorAll('[data-tag]').forEach((tag) => tag.setAttribute('aria-pressed', 'false'));
    form.querySelector('input[name="difficulty"][value=""]').checked = true;
    if (!lockedScene) {
      form.querySelector('input[name="scene"]').value = '';
      form.querySelectorAll('button[data-scene]').forEach((scene) => {
        const selected = !scene.dataset.scene;
        scene.setAttribute('aria-pressed', String(selected));
        scene.classList.toggle('selected', selected);
      });
    }
    applyFilters();
  }));
  window.addEventListener('popstate', () => { readUrl(); applyFilters(); });
  readUrl();
  applyFilters();
})();
