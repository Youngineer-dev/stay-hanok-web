/**
 * 재사용 가능한 이미지 라이트박스.
 *
 * 사용:
 *   const lb = window.createLightbox(rootEl);
 *   lb.open(items, startIndex);
 *
 *   items: [{ img, alt, title, desc, caption }]
 *
 * root 내부의 data-lb-* 속성으로 요소를 찾습니다:
 *   data-lb-img, data-lb-title, data-lb-desc, data-lb-counter,
 *   data-lb-prev, data-lb-next, data-lb-close
 *
 * 모든 data-lb-* 요소는 optional — 없으면 해당 기능을 건너뜁니다.
 */
(function () {
  window.createLightbox = function (root) {
    if (!root) return null;

    const imgEl = root.querySelector('[data-lb-img]');
    const titleEl = root.querySelector('[data-lb-title]');
    const descEl = root.querySelector('[data-lb-desc]');
    const counterEl = root.querySelector('[data-lb-counter]');
    const btnPrev = root.querySelector('[data-lb-prev]');
    const btnNext = root.querySelector('[data-lb-next]');
    const btnClose = root.querySelector('[data-lb-close]');

    let items = [];
    let index = 0;

    function render() {
      const item = items[index] || {};
      if (imgEl) {
        imgEl.src = item.img || '';
        imgEl.alt = item.alt || item.title || item.caption || '';
      }
      if (titleEl) titleEl.textContent = item.title || item.caption || item.alt || '';
      if (descEl) descEl.innerHTML = item.desc || '';
      if (counterEl) {
        counterEl.textContent = items.length > 1 ? `${index + 1} / ${items.length}` : '';
      }
      const multi = items.length > 1;
      if (btnPrev) btnPrev.style.display = multi ? '' : 'none';
      if (btnNext) btnNext.style.display = multi ? '' : 'none';
    }

    function open(list, startIdx) {
      items = Array.isArray(list) ? list : [];
      if (items.length === 0) return;
      index = Math.min(Math.max(startIdx || 0, 0), items.length - 1);
      render();
      root.classList.add('is-open');
      root.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      root.classList.remove('is-open');
      root.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function prev() {
      if (items.length < 2) return;
      index = (index - 1 + items.length) % items.length;
      render();
    }

    function next() {
      if (items.length < 2) return;
      index = (index + 1) % items.length;
      render();
    }

    if (btnClose) btnClose.addEventListener('click', close);
    if (btnPrev) btnPrev.addEventListener('click', prev);
    if (btnNext) btnNext.addEventListener('click', next);

    root.addEventListener('click', (e) => {
      if (e.target === root) close();
    });

    document.addEventListener('keydown', (e) => {
      if (!root.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    });

    return { open, close };
  };
})();
