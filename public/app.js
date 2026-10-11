import data from './site-data.js';
import { validateRequest, formatPrice } from './validation.js';

const $ = id => document.getElementById(id);
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const isDemo = data.mode !== 'live';
const clinic = data.clinic;
const safeUrl = value => {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value, location.href);
    return ['https:', 'http:'].includes(url.protocol) && (url.protocol === 'https:' || url.origin === location.origin) ? url.href : null;
  } catch { return null; }
};
const iconPaths = {
  tooth: '<path d="M8 4c-4 0-5 3-4 7l3 10c.5 2 2 2 2.5 0l1.3-5c.5-2 2-2 2.5 0l1.3 5c.5 2 2 2 2.5 0l3-10c1-4 0-7-4-7-2 0-2.5 1-4 1S10 4 8 4Z"/>',
  spark: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Zm7-1v4m-2-2h4M4 18v4m-2-2h4"/>',
  crown: '<path d="m3 7 4 5 5-8 5 8 4-5-2 13H5L3 7Zm2 10h14"/>',
  implant: '<path d="M8 3h8l2 6H6l2-6Zm4 6v13M8 12h8m-8 4h8m-7 4h6"/>',
  braces: '<path d="M3 6h18v12H3zM3 12h18M7 6v12M17 6v12"/><path d="M5 10h4v4H5zM15 10h4v4h-4z"/>',
  smile: '<circle cx="12" cy="12" r="9"/><path d="M8 10h.01M16 10h.01M7 14c2 4 8 4 10 0"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.tooth}</svg>`;
const portrait = '<svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="25" r="12"/><path d="M13 70c0-21 12-29 27-29s27 8 27 29M32 43l8 13 8-13M40 56v14"/></svg>';
const priceMarkup = item => {
  const price = formatPrice(item.price, item.unit);
  return `<span class="service-price">${escape(price.label)}${item.price != null && item.unit ? `<small> / ${escape(item.unit)}</small>` : ''}</span>`;
};

document.querySelectorAll('[data-clinic-name]').forEach(node => node.textContent = clinic.name);
document.title = `${clinic.name} — цифровой офис TANEM`;
if (clinic.heroTitle && clinic.heroAccent) $('hero-title').innerHTML = `${escape(clinic.heroTitle)}<br><span>${escape(clinic.heroAccent)}</span>`;
$('hero-lead').textContent = clinic.heroDescription;
$('clinic-description').textContent = clinic.description;
for (const [id, source, alt, caption] of [
  ['hero', clinic.heroImage, clinic.heroImageAlt, clinic.heroImageCaption],
  ['clinic', clinic.clinicImage, clinic.clinicImageAlt, clinic.clinicImageCaption]
]) {
  const image = $(`${id}-image`);
  const url = source && safeUrl(source);
  if (url) image.src = url;
  image.alt = alt || '';
  $(`${id}-caption`).textContent = caption || '';
  $(`${id}-caption`).hidden = !caption;
}
for (const id of ['demo-ribbon', 'service-demo-note', 'form-demo-note']) $(id).hidden = !isDemo;
$('clinic-facts').innerHTML = [
  ['Адрес', clinic.address || 'Добавляется адрес клиники'],
  ['Приём', clinic.hours || 'Добавляются часы работы'],
  ['Лицензия', clinic.licenseNumber || 'Добавляются сведения о лицензии']
].map(([label, value]) => `<div class="clinic-fact"><small>${escape(label)}</small><strong>${escape(value)}</strong></div>`).join('');
$('copyright').textContent = clinic.legalName || 'Образец цифрового офиса стоматологии';

// Один набор вкладок для всех экранов. Стрелки/Home/End перемещают фокус.
const services = $('services-grid');
services.innerHTML = data.services.map((service, index) => `<button type="button" class="service-tab" role="tab" id="service-tab-${index}" aria-controls="service-panel" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-service-index="${index}"><small>${String(index + 1).padStart(2, '0')}</small><strong>${escape(service.title)}</strong><span class="service-icon">${icon(service.icon)}</span></button>`).join('');
const serviceTabs = [...services.querySelectorAll('[role=tab]')];
function selectService(index, focus = false) {
  const service = data.services[index];
  if (!service) return;
  serviceTabs.forEach((tab, position) => {
    tab.setAttribute('aria-selected', String(position === index));
    tab.tabIndex = position === index ? 0 : -1;
  });
  const panel = $('service-panel');
  panel.setAttribute('aria-labelledby', `service-tab-${index}`);
  const source = safeUrl(clinic.serviceImage || clinic.clinicImage);
  const alt = clinic.serviceImageAlt || clinic.clinicImageAlt || '';
  const caption = clinic.serviceImageCaption || clinic.clinicImageCaption || '';
  panel.innerHTML = `<div class="service-feature"><div class="service-panel-copy"><span class="section-label">Направление / ${String(index + 1).padStart(2, '0')}</span><h3>${escape(service.title)}</h3><p>${escape(service.description)}</p></div>${source ? `<figure class="service-image"><img src="${escape(source)}" alt="${escape(alt)}" width="1536" height="1024" loading="lazy">${caption ? `<figcaption>${escape(caption)}</figcaption>` : ''}</figure>` : ''}</div><div class="service-detail">${service.items.map(item => `<div class="service-row"><div class="service-row-top"><strong>${escape(item.name)}</strong>${priceMarkup(item)}</div><p>${escape(item.includes)}</p></div>`).join('')}<div class="service-panel-bottom"><p>Объём лечения и итоговую стоимость врач обсуждает после осмотра и диагностики.</p><a class="button button-primary" href="#request">Записаться <span aria-hidden="true">↗</span></a></div></div>`;
  if (focus) serviceTabs[index].focus();
}
if (data.services.length) selectService(0);
else {
  services.hidden = true;
  $('service-panel').removeAttribute('role');
  $('service-panel').removeAttribute('tabindex');
  $('service-panel').textContent = 'Информация об услугах добавляется клиникой.';
}
services.addEventListener('click', event => {
  const tab = event.target.closest('[data-service-index]');
  if (tab) selectService(Number(tab.dataset.serviceIndex));
});
services.addEventListener('keydown', event => {
  const tab = event.target.closest('[data-service-index]');
  if (!tab) return;
  const current = Number(tab.dataset.serviceIndex);
  let next;
  if (['ArrowDown', 'ArrowRight'].includes(event.key)) next = (current + 1) % serviceTabs.length;
  if (['ArrowUp', 'ArrowLeft'].includes(event.key)) next = (current - 1 + serviceTabs.length) % serviceTabs.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = serviceTabs.length - 1;
  if (next !== undefined) { event.preventDefault(); selectService(next, true); }
});
$('doctors-grid').innerHTML = data.doctors.map((doctor, index) => {
  const photo = doctor.photo && safeUrl(doctor.photo);
  return `<article class="doctor-card"><div class="doctor-photo">${photo ? `<img src="${escape(photo)}" alt="${escape(doctor.name)}" loading="lazy">` : `<span class="doctor-number">${String(index + 1).padStart(2, '0')}</span>${portrait}<span>Место для фото врача</span>`}${isDemo ? '<span class="demo-label">Образец карточки</span>' : ''}</div><div class="doctor-body"><h3>${escape(doctor.name || doctor.specialty)}</h3><p class="doctor-specialty">${escape(doctor.name ? doctor.specialty : 'Данные добавляются клиникой')}</p><p>${escape(doctor.description)}</p><button class="text-link" data-doctor="${escape(doctor.id)}">О специалисте <span aria-hidden="true">↗</span></button></div></article>`;
}).join('');
$('faq-list').innerHTML = data.faq.map(item => `<details class="faq-item"><summary>${escape(item.question)}<span aria-hidden="true">+</span></summary><p>${escape(item.answer)}</p></details>`).join('');
$('reviews-content').innerHTML = data.reviews.length ? `<div class="reviews-grid">${data.reviews.map(review => `<article class="review-card"><strong>${escape(review.author)}</strong><p>${escape(review.text)}</p>${safeUrl(review.url) ? `<a class="text-link" href="${escape(safeUrl(review.url))}" target="_blank" rel="noopener noreferrer">Источник отзыва ↗</a>` : ''}</article>`).join('')}</div>` : '<div class="empty-state"><div><strong>Здесь будут отзывы пациентов</strong><p>В образце отзывы не добавлены. В цифровом офисе клиники публикуются реальные отзывы с доступными ссылками на источник.</p></div><span>Только реальные истории ↗</span></div>';

const phoneHref = clinic.phone && `tel:${clinic.phone.replace(/[^\d+]/g, '')}`;
if (!isDemo && !data.reviews.length) $('reviews').hidden = true;
if (phoneHref) {
  $('request-phone').href = phoneHref;
  $('request-phone').textContent = clinic.phone;
  $('request-phone').hidden = false;
}
$('contact-details').innerHTML = [
  ['Адрес', clinic.address || 'Адрес клиники добавляется при заполнении шаблона'],
  ['Часы работы', clinic.hours || 'Часы работы добавляются клиникой'],
  ['Как найти вход', clinic.entrance || 'Ориентиры для входа добавляются клиникой']
].map(([title, value]) => `<div class="contact-item"><small>${escape(title)}</small><p>${escape(value)}</p></div>`).join('') + (phoneHref ? `<div class="contact-item"><small>Телефон</small><a href="${escape(phoneHref)}">${escape(clinic.phone)}</a></div>` : '');
const mapUrl = clinic.mapUrl && safeUrl(clinic.mapUrl);
if (mapUrl) {
  $('map-panel').querySelector('p').textContent = clinic.address;
  $('map-panel').insertAdjacentHTML('beforeend', `<a class="button button-primary" href="${escape(mapUrl)}" target="_blank" rel="noopener noreferrer">Открыть маршрут ↗</a>`);
}
const bookingUrl = clinic.bookingUrl && safeUrl(clinic.bookingUrl);
if (bookingUrl) $('contact-details').insertAdjacentHTML('beforeend', `<div class="contact-item"><small>Онлайн-запись</small><a href="${escape(bookingUrl)}" target="_blank" rel="noopener noreferrer">Выбрать время в сервисе записи ↗</a></div>`);

function renderDocuments(query = '') {
  const filtered = data.documents.filter(doc => doc.title.toLocaleLowerCase('ru').includes(query.toLocaleLowerCase('ru').trim()));
  $('document-list').innerHTML = filtered.map(doc => `<button class="document-row" data-document="${escape(doc.id)}">${escape(doc.title)}<span aria-hidden="true">↗</span></button>`).join('');
  $('document-empty').hidden = filtered.length !== 0;
}
renderDocuments();
$('document-search').addEventListener('input', event => renderDocuments(event.target.value));

const dialog = $('content-dialog');
let dialogOpener;
function openDialog(title, html, opener) {
  $('dialog-title').textContent = title;
  $('dialog-body').innerHTML = html;
  dialogOpener = opener;
  dialog.showModal();
  $('dialog-close').focus();
}
function showPrice(opener) {
  const doc = data.documents.find(item => item.id === 'price');
  if (doc?.url && safeUrl(doc.url)) { window.open(safeUrl(doc.url), '_blank', 'noopener,noreferrer'); return; }
  const intro = isDemo ? '<p>Это структура прайс-листа. Цены появятся после заполнения подтверждённых данных клиники.</p>' : '<p>Стоимость отдельных услуг. Состав комплексного лечения и итоговую стоимость врач обсуждает после диагностики.</p>';
  openDialog('Полный прайс-лист', intro + data.services.map(service => `<table class="price-table"><caption>${escape(service.title)}</caption><thead><tr><th scope="col">Услуга и состав</th><th scope="col">Стоимость</th></tr></thead><tbody>${service.items.map(item => `<tr><td>${escape(item.name)}<small>${escape(item.includes)}${item.unit ? ` · ${escape(item.unit)}` : ''}</small></td><td>${escape(formatPrice(item.price).label)}</td></tr>`).join('')}</tbody></table>`).join(''), opener);
}
$('price-open').addEventListener('click', event => showPrice(event.currentTarget));
document.addEventListener('click', event => {
  const docButton = event.target.closest('[data-document]');
  if (docButton) {
    const doc = data.documents.find(item => item.id === docButton.dataset.document);
    if (!doc) return;
    if (doc.id === 'price') { showPrice(docButton); return; }
    const url = doc.url && safeUrl(doc.url);
    if (url) { window.open(url, '_blank', 'noopener,noreferrer'); return; }
    openDialog(doc.title, doc.text ? `<div class="document-text">${escape(doc.text)}</div>` : '<p>Образец раздела. Документ медицинской организации добавляется до запуска клиники. Этот текст не является действующим документом или согласием конкретного оператора.</p>', docButton);
  }
  const doctorButton = event.target.closest('[data-doctor]');
  if (doctorButton) {
    const doctor = data.doctors.find(item => item.id === doctorButton.dataset.doctor);
    openDialog(doctor.name || doctor.specialty, `<p>${escape(doctor.description)}</p><dl class="doctor-details">${[
      ['Специализация', doctor.specialty], ['Образование', doctor.education], ['Квалификация', doctor.qualification], ['Аккредитация', doctor.accreditation], ['Часы приёма', doctor.schedule]
    ].map(([label, value]) => `<dt>${escape(label)}</dt><dd>${escape(value || 'Добавляется по данным клиники')}</dd>`).join('')}</dl><a class="button button-primary dialog-request" href="#request">Записаться на приём ↗</a>`, doctorButton);
  }
  if (event.target.closest('.dialog-request')) dialog.close();
});
$('dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => dialogOpener?.focus());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  }
});

const menuToggle = $('menu-toggle');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Открыть меню');
  $('mobile-nav').hidden = true;
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  $('mobile-nav').hidden = !open;
});
$('mobile-nav').addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !dialog.open && menuToggle.getAttribute('aria-expanded') === 'true') { closeMenu(); menuToggle.focus(); } });
window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const accessibility = $('accessibility-toggle');
function setAccessible(value) {
  document.body.classList.toggle('accessible', value);
  accessibility.setAttribute('aria-pressed', String(value));
  accessibility.textContent = value ? 'Обычная версия' : 'Версия для слабовидящих';
  try { localStorage.setItem('tanem-accessible', String(value)); } catch { /* Optional preference storage. */ }
}
try { setAccessible(localStorage.getItem('tanem-accessible') === 'true'); } catch { /* Storage unavailable. */ }
accessibility.addEventListener('click', () => setAccessible(!document.body.classList.contains('accessible')));

if ('IntersectionObserver' in window) {
  let heroVisible = true, formVisible = false;
  const syncSticky = () => { $('mobile-sticky').hidden = heroVisible || formVisible; };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.target.classList.contains('hero')) heroVisible = entry.isIntersecting;
      if (entry.target.id === 'request') formVisible = entry.isIntersecting;
    });
    syncSticky();
  }, { threshold: 0 });
  observer.observe(document.querySelector('.hero'));
  observer.observe($('request'));
}

const form = $('request-form');
let sending = false, requestToken = null;
function showStatus(message, error = false) {
  const status = $('form-status');
  status.hidden = false;
  status.classList.toggle('is-error', error);
  status.setAttribute('role', error ? 'alert' : 'status');
  status.textContent = message;
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (sending) return;
  const result = validateRequest({ phone: $('phone').value, name: $('name').value, consent: $('consent').checked });
  for (const field of ['phone', 'name', 'consent']) {
    const message = result.errors[field];
    $(`${field}-error`).hidden = !message;
    $(`${field}-error`).textContent = message || '';
    $(field).setAttribute('aria-invalid', String(Boolean(message)));
  }
  if (!result.valid) { $(Object.keys(result.errors)[0]).focus(); return; }
  if (isDemo) {
    showStatus('Форма заполнена корректно. Это образец цифрового офиса: заявка не отправлена в клинику.');
    $('form-status').focus();
    return;
  }
  const signature = JSON.stringify(result.data);
  if (!requestToken || requestToken.signature !== signature) requestToken = { signature, key: crypto.randomUUID() };
  const payload = { ...result.data, requestId: requestToken.key, consentVersion: data.consentVersion, website: $('website').value };
  sending = true;
  form.setAttribute('aria-busy', 'true');
  form.querySelectorAll('input,button[type=submit]').forEach(node => node.disabled = true);
  $('submit-label').textContent = 'Отправляем…';
  $('form-status').hidden = true;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(data.requestEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal, credentials: 'same-origin' });
    const body = await response.json();
    if (!response.ok || body.accepted !== true) throw new Error(body.message || 'Не удалось отправить заявку. Попробуйте ещё раз или позвоните в клинику.');
    showStatus('Заявка принята. Администратор свяжется с вами в рабочее время, чтобы согласовать приём.');
    form.reset();
    requestToken = null;
    if (data.metrikaId && typeof window.ym === 'function') window.ym(Number(data.metrikaId), 'reachGoal', 'request_accepted');
    $('form-status').focus();
  } catch (error) {
    showStatus(error.name === 'AbortError' ? 'Не удалось получить ответ сервера. Данные сохранены в форме. Повторите отправку или позвоните в клинику.' : error.message || 'Нет связи с сервером. Данные остались в форме. Попробуйте ещё раз.', true);
  } finally {
    window.clearTimeout(timeout);
    sending = false;
    form.removeAttribute('aria-busy');
    form.querySelectorAll('input,button[type=submit]').forEach(node => node.disabled = false);
    $('submit-label').textContent = 'Перезвоните мне';
  }
});

// Данные формы в аналитику не передаются. Webvisor для формы выключен.
if (!isDemo && /^\d+$/.test(String(data.metrikaId))) {
  window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
  const script = document.createElement('script');
  script.src = 'https://mc.yandex.ru/metrika/tag.js';
  script.async = true;
  document.head.appendChild(script);
  window.ym(Number(data.metrikaId), 'init', { clickmap: false, trackLinks: true, accurateTrackBounce: true, webvisor: false, params: { office: 'dentistry' } });
}
