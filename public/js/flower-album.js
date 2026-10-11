(function () {
  const album = document.querySelector('.flower-album');
  if (!album) return;

  const monthList = document.getElementById('month-list');
  const sections = album.querySelectorAll('.photo-group');

  // 1. 按 data-month 生成 1-12 月导航（无年份）
  const monthsWithContent = new Set();
  sections.forEach(s => monthsWithContent.add(s.dataset.month));

  for (let m = 1; m <= 12; m++) {
    const mm = String(m).padStart(2, '0');
    if (!monthsWithContent.has(mm)) continue;

    // 找该月第一个 section 的 id 作为锚点
    const firstSection = album.querySelector(`.photo-group[data-month="${mm}"]`);
    if (!firstSection) continue;

    const a = document.createElement('a');
    a.href = `#${firstSection.id}`;
    a.className = 'month-item';
    a.textContent = `${m}月`;
    a.dataset.month = mm;
    monthList.appendChild(a);
  }

  // 2. 平滑滚动
  monthList.addEventListener('click', e => {
    const link = e.target.closest('.month-item');
    if (!link) return;
    e.preventDefault();
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // 3. 滚动高亮当前月份
  const navItems = monthList.querySelectorAll('.month-item');
  function highlight() {
    let active = null;
    let minDist = Infinity;
    const scrollPos = window.scrollY + 140;

    sections.forEach(s => {
      const top = s.getBoundingClientRect().top + window.scrollY;
      if (top <= scrollPos + 220) {
        const dist = Math.abs(top - scrollPos);
        if (dist < minDist) {
          minDist = dist;
          active = s.dataset.month;
        }
      }
    });

    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.month === active);
    });
  }
  window.addEventListener('scroll', highlight);
  window.addEventListener('resize', highlight);
  highlight();

  // 4. 点击图片放大
  album.addEventListener('click', e => {
    if (!e.target.classList.contains('photo-img')) return;
    const modal = document.createElement('div');
    modal.className = 'flower-modal';
    const img = document.createElement('img');
    img.src = e.target.src;
    img.alt = e.target.alt;
    modal.appendChild(img);
    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.addEventListener('click', close);
    document.addEventListener('keydown', function esc(ev) {
      if (ev.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
    });
  });
})();