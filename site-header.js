const siteHeader = document.querySelector('.site-header');
const headerNav = siteHeader?.querySelector('#site-nav');
const menuToggle = siteHeader?.querySelector('.menu-toggle');
if (siteHeader && headerNav && menuToggle) {
  const closeHeaderMenu = () => {
    headerNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    headerNav.querySelectorAll('details[open]').forEach(menu => { menu.open = false; });
  };
  menuToggle.addEventListener('click', () => {
    if (headerNav.classList.contains('is-open')) return closeHeaderMenu();
    headerNav.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
  });
  headerNav.querySelectorAll('.header-menu').forEach(menu => {
    menu.addEventListener('toggle', () => {
      if (menu.open) headerNav.querySelectorAll('.header-menu').forEach(other => { if (other !== menu) other.open = false; });
    });
  });
  document.addEventListener('click', event => { if (!siteHeader.contains(event.target)) closeHeaderMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeHeaderMenu(); });
  window.addEventListener('resize', () => { if (innerWidth > 900) closeHeaderMenu(); });
  siteHeader.querySelector('.country-switcher')?.addEventListener('change', event => {
    const code = event.target.value;
    if (code !== 'au') location.href = `https://vortecglobal.com/?code=${encodeURIComponent(code)}`;
  });
}
