/* All gallery images start lazy. Promote only the requested series' first
   result before the later application scripts hydrate the page. */
(() => {
  const groups = [...document.querySelectorAll('.project-group[data-series-index]')];
  if (!groups.length) return;
  const match = window.location.hash.match(/^#series-(\d+)$/);
  const target = match ? groups.find(group => group.dataset.seriesIndex === match[1]) : groups[0];
  const image = target?.querySelector('.work-card img');
  if (!image) return;
  image.loading = 'eager';
  image.fetchPriority = 'high';
})();
