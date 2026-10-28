// Château 632 — light interactivity: compare sliders, photo lightbox + reveal-on-scroll.
// Inquiry form: composes an email to the leasing team (mailto) on static hosting.
(function () {
  var form = document.querySelector('form[name="inquiry"]');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fr = document.documentElement.lang === 'fr';
    var get = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
    var subject = (fr ? 'Demande de visite — Château 632, 632, rue Laurier, Rockland' : 'Tour request — Château 632, 632 Laurier Street, Rockland');
    var suite = get('suite') || get('use');
    var body = (fr ? 'Nom : ' : 'Name: ') + get('name') + '\n' +
      (fr ? 'Courriel ou téléphone : ' : 'Email or phone: ') + get('contact') + '\n' +
      (fr ? 'Type de logement souhaité : ' : 'Suite type of interest: ') + suite + '\n' +
      (fr ? 'Langue préférée : ' : 'Preferred language: ') + get('language') + '\n\n' + get('message');
    location.href = 'mailto:leasing@chateau632.ca?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
})();

// Compare sliders (Plantagenet pattern): range input drives --pos clip.
document.querySelectorAll('.compare').forEach(function (box) {
  var slider = box.querySelector('input[type=range]');
  if (!slider) return;
  var set = function () { box.style.setProperty('--pos', slider.value + '%'); };
  slider.addEventListener('input', set); set();
});

(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.gallery figure a'));
  links = links.filter(function (a) { return /\.(jpe?g|png)$/i.test(a.getAttribute('href') || ''); });
  if (!links.length) return;
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<button class="lb-close" aria-label="Close">✕</button>' +
    '<button class="lb-prev" aria-label="Previous photo">‹</button>' +
    '<img alt=""><div class="lb-cap"></div>' +
    '<button class="lb-next" aria-label="Next photo">›</button>';
  document.body.appendChild(lb);
  var img = lb.querySelector('img'), cap = lb.querySelector('.lb-cap'), i = 0;
  function show(n) {
    i = (n + links.length) % links.length;
    var a = links[i], im = a.querySelector('img');
    img.src = a.href; img.alt = im ? im.alt : '';
    var fig = a.closest('figure'), fc = fig ? fig.querySelector('figcaption') : null;
    cap.textContent = fc ? fc.textContent.trim() : '';
  }
  function open(n) { show(n); lb.classList.add('open'); }
  function close() { lb.classList.remove('open'); }
  links.forEach(function (a, n) { a.addEventListener('click', function (e) { e.preventDefault(); open(n); }); });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(i - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(i + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
})();

// Gentle reveal-on-scroll for sections (skipped for reduced motion or no IO support).
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  var els = document.querySelectorAll('main section, footer .wrap');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.08 });
  els.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
})();
