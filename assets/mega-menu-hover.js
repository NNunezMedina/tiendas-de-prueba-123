document.addEventListener('DOMContentLoaded', () => {
  const DESKTOP_BP = 990;
  const CLOSE_DELAY = 220; // debe calzar con el CSS
  const isDesktop = () => window.innerWidth >= DESKTOP_BP;

  const closeTimers = new WeakMap();

  function cancelClose(details) {
    const t = closeTimers.get(details);
    if (t) clearTimeout(t);
    closeTimers.delete(details);
    details.classList.remove('is-closing');
  }

  function openMenu(details) {
    // re-dispara animación de apertura siempre
    details.classList.remove('is-opening');
    // forzar reflow para que el class toggle reinicie el animation
    void details.offsetWidth;
    details.classList.add('is-opening');

    details.setAttribute('open', '');
  }

  function scheduleClose(details) {
    const prev = closeTimers.get(details);
    if (prev) clearTimeout(prev);

    // activa animación de cierre (mantiene open mientras anima)
    details.classList.add('is-closing');

    const t = setTimeout(() => {
      details.classList.remove('is-closing');
      details.removeAttribute('open');
      closeTimers.delete(details);
    }, CLOSE_DELAY);

    closeTimers.set(details, t);
  }

  document.querySelectorAll('header details.mega-menu').forEach((details) => {
    const content = details.querySelector('.mega-menu__content');

    details.addEventListener('mouseenter', () => {
      if (!isDesktop()) return;
      cancelClose(details);
      openMenu(details);
    });

    details.addEventListener('mouseleave', () => {
      if (!isDesktop()) return;
      scheduleClose(details);
    });

    if (content) {
      content.addEventListener('mouseenter', () => {
        if (!isDesktop()) return;
        cancelClose(details);
        openMenu(details);
      });

      content.addEventListener('mouseleave', () => {
        if (!isDesktop()) return;
        scheduleClose(details);
      });
    }

    // teclado
    details.addEventListener('focusin', () => {
      if (!isDesktop()) return;
      cancelClose(details);
      openMenu(details);
    });

    details.addEventListener('focusout', (e) => {
      if (!isDesktop()) return;
      if (!details.contains(e.relatedTarget)) scheduleClose(details);
    });
  });
});
