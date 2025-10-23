// footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Companies grid + filters (no coming-soon fallback)
(async () => {
  const grid = document.getElementById('grid');
  const filters = document.getElementById('filters');

  try {
    const res = await fetch('data/portfolio.json', { cache: 'no-store' });
    const items = await res.json();
    if (!Array.isArray(items)) return;

    // Build filters from tags
    const tags = ['All', ...Array.from(new Set(items.flatMap(i => i.tags || []))).sort()];
    tags.forEach((t, idx) => {
      const b = document.createElement('button');
      b.className = 'filter' + (idx === 0 ? ' active' : '');
      b.textContent = t;
      b.type = 'button';
      b.addEventListener('click', () => {
        document.querySelectorAll('.filter').forEach(el => el.classList.remove('active'));
        b.classList.add('active');
        render(t === 'All' ? items : items.filter(i => i.tags?.includes(t)));
      });
      filters.appendChild(b);
    });

    function render(list){
      grid.innerHTML = '';
      list.forEach(item => {
        const a = document.createElement('a');
        a.className = 'tile';
        a.href = item.url || '#';
        a.target = '_blank'; a.rel = 'noopener';

        if(item.logo){
          const img = document.createElement('img');
          img.src = item.logo; img.alt = `${item.name} logo`; img.loading = 'lazy'; img.className='logo';
          a.appendChild(img);
        }

        const h = document.createElement('h4'); h.textContent = item.name;
        const p = document.createElement('p'); p.textContent = item.description || '';
        a.append(h, p);

        if(item.tags?.length){
          const tw = document.createElement('div'); tw.className='tags';
          item.tags.forEach(t => {
            const s = document.createElement('span'); s.className='tag'; s.textContent=t;
            tw.appendChild(s);
          });
          a.appendChild(tw);
        }

        const more = document.createElement('span'); more.className='more'; more.textContent='Visit →';
        a.appendChild(more);

        grid.appendChild(a);
      });
    }

    render(items);
  } catch (e) {
    console.error('Failed to load companies:', e);
  }
})();
