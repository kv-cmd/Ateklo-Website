// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Intersection Observer for reveal animations
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Load portfolio
(async function loadPortfolio(){
  const grid = document.getElementById('grid');
  const empty = document.getElementById('empty');
  const filterWrap = document.getElementById('filters');

  try{
    const res = await fetch('data/portfolio.json', {cache:'no-store'});
    const items = await res.json();

    if(!Array.isArray(items) || items.length === 0){ empty.hidden = false; return; }

    // Build filters
    const tags = Array.from(new Set(items.flatMap(i => i.tags || []))).sort();
    const allBtn = makeChip('All', true, () => apply('All'));
    filterWrap.appendChild(allBtn);
    tags.forEach(t => filterWrap.appendChild(makeChip(t, false, () => apply(t))));

    function makeChip(label, active=false, onClick){
      const btn = document.createElement('button');
      btn.className = 'filter' + (active ? ' active' : '');
      btn.textContent = label;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        onClick();
      });
      return btn;
    }

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

        const h4 = document.createElement('h4'); h4.textContent = item.name;
        const p = document.createElement('p'); p.textContent = item.description || '';
        a.append(h4, p);

        if(item.tags?.length){
          const tags = document.createElement('div'); tags.className='tags';
          item.tags.forEach(t => {
            const span = document.createElement('span'); span.className='tag'; span.textContent = t;
            tags.appendChild(span);
          });
          a.appendChild(tags);
        }

        const more = document.createElement('span'); more.className='more'; more.textContent = 'Visit →';
        a.appendChild(more);

        grid.appendChild(a);
      });
      empty.hidden = list.length > 0;
    }

    function apply(tag){
      const list = tag === 'All' ? items : items.filter(i => i.tags?.includes(tag));
      render(list);
    }

    render(items);
  }catch(err){
    console.error(err);
    empty.hidden = false;
  }
})();
