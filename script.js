const enquiryDialog = document.querySelector('#equipment-enquiry');
const enquiryForm = document.querySelector('#equipment-form');
const enquiryStatus = document.querySelector('#form-status');
const productSelect = document.querySelector('#product-select');
const caseScroller = document.querySelector('#case-scroll');
const casePrev = document.querySelector('[data-case-prev]');
const caseNext = document.querySelector('[data-case-next]');
const siteHeader = document.querySelector('.site-header');
const headerNav = document.querySelector('#site-nav');
const menuToggle = document.querySelector('.menu-toggle');

function closeHeaderMenu() {
  headerNav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
  headerNav.querySelectorAll('details[open]').forEach((menu) => { menu.open = false; });
}

menuToggle.addEventListener('click', () => {
  const open = !headerNav.classList.contains('is-open');
  if (!open) return closeHeaderMenu();
  headerNav.classList.add('is-open');
  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.setAttribute('aria-label', 'Close menu');
});

headerNav.querySelectorAll('.header-menu').forEach((menu) => {
  menu.addEventListener('toggle', () => {
    if (menu.open) headerNav.querySelectorAll('.header-menu').forEach((other) => { if (other !== menu) other.open = false; });
  });
});

document.addEventListener('click', (event) => {
  if (!siteHeader.contains(event.target)) closeHeaderMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeHeaderMenu();
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeHeaderMenu();
});

document.querySelector('.country-switcher').addEventListener('change', (event) => {
  const code = event.target.value;
  window.location.href = code === 'au' ? 'https://vortecglobal.com/' : `https://vortecglobal.com/?code=${encodeURIComponent(code)}`;
});

let enquiryTrigger = null;

document.querySelectorAll('[data-open-enquiry]').forEach((button) => {
  button.addEventListener('click', () => {
    enquiryTrigger = button;
    enquiryStatus.textContent = '';
    productSelect.value = button.dataset.product || 'Help me choose';
    enquiryDialog.showModal();
    document.body.classList.add('dialog-open');
    enquiryDialog.querySelector('input[name="First Name"]').focus();
  });
});

function closeEnquiry() {
  enquiryDialog.close();
}

enquiryDialog.querySelector('[data-close-enquiry]').addEventListener('click', closeEnquiry);
enquiryDialog.addEventListener('click', (event) => {
  if (event.target === enquiryDialog) closeEnquiry();
});
enquiryDialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  enquiryTrigger?.focus();
});

enquiryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;

  const details = [...new FormData(enquiryForm)].map(([label, value]) => `${label}: ${String(value).trim()}`);
  const subject = `Melbourne equipment quote request: ${productSelect.value}`;
  const body = ['Hello Vortec,', '', 'I would like a quote for a hydroseeder or erosion control machine.', '', ...details, '', 'Please contact me to discuss the right configuration and pricing.'].join('\n');
  const draftUrl = `mailto:sales@vortecglobal.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  enquiryStatus.textContent = 'Your email app should open with a draft. Send it to complete your enquiry. ';
  const fallback = document.createElement('a');
  fallback.href = draftUrl;
  fallback.textContent = 'Open the email draft again';
  enquiryStatus.append(fallback);
  window.location.href = draftUrl;
});

function scrollCases(direction) {
  const card = caseScroller.querySelector('.proof-card');
  if (!card) return;
  const gap = Number.parseFloat(getComputedStyle(caseScroller).gap) || 0;
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  caseScroller.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior });
}

function updateCaseControls() {
  casePrev.disabled = caseScroller.scrollLeft <= 2;
  caseNext.disabled = caseScroller.scrollLeft + caseScroller.clientWidth >= caseScroller.scrollWidth - 2;
}

casePrev.addEventListener('click', () => scrollCases(-1));
caseNext.addEventListener('click', () => scrollCases(1));
caseScroller.addEventListener('scroll', updateCaseControls, { passive: true });
window.addEventListener('resize', updateCaseControls);
updateCaseControls();
