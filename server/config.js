import { normalizePhone } from '../public/validation.js';

export function validateConfig(data) {
  const errors = [];
  if (!['demo', 'live'].includes(data.mode)) errors.push('mode должен быть demo или live');
  if (!data.clinic?.name?.trim()) errors.push('Нужно название клиники');
  for (const key of ['services', 'doctors', 'faq', 'reviews', 'documents']) {
    if (!Array.isArray(data[key])) errors.push(`${key} должен быть массивом`);
  }
  if (errors.length || data.mode !== 'live') return errors;
  const clinic = data.clinic;
  for (const key of ['legalName', 'inn', 'ogrn', 'licenseNumber', 'address', 'hours', 'entrance', 'heroImage', 'heroImageAlt', 'clinicImage', 'clinicImageAlt']) {
    if (!clinic[key]?.trim()) errors.push(`Заполните clinic.${key}`);
  }
  if (!normalizePhone(clinic.phone)) errors.push('Нужен действительный телефон клиники');
  for (const key of ['heroImage', 'clinicImage', 'serviceImage']) {
    if (['clinic-hero.webp', 'clinician-editorial.webp', 'clinic-editorial.webp'].some(file => clinic[key]?.includes(file))) errors.push(`Замените иллюстрацию на фотографию клиники: ${key}`);
  }
  if (!data.consentVersion?.trim()) errors.push('Нужна версия согласия');
  if (!data.services.length) errors.push('Добавьте услуги клиники');
  for (const service of data.services) {
    if (!service.id || !service.title || !service.items?.length) errors.push('Заполните направление услуг');
    for (const item of service.items || []) {
      const price = item.price;
      const validPrice = typeof price === 'number' && Number.isFinite(price) && price >= 0 ||
        price && typeof price.from === 'number' && Number.isFinite(price.from) && price.from >= 0 &&
        (price.to == null || typeof price.to === 'number' && Number.isFinite(price.to) && price.to >= price.from);
      if (!item.name || !validPrice || !item.includes) errors.push(`Укажите цену и состав услуги: ${item.name || service.title}`);
    }
  }
  if (!data.doctors.length) errors.push('Добавьте врачей клиники');
  for (const doctor of data.doctors) {
    for (const key of ['name', 'specialty', 'photo', 'education', 'qualification', 'accreditation', 'schedule']) {
      if (!doctor[key]?.trim()) errors.push(`Заполните ${doctor.id || 'врач'}.${key}`);
    }
    if (doctor.demo) errors.push('Удалите demo у карточек врачей');
  }
  const requiredDocuments = ['clinic', 'license', 'price', 'rules', 'contract', 'privacy', 'consent', 'authorities'];
  for (const id of requiredDocuments) {
    const doc = data.documents.find(item => item.id === id);
    if (!doc?.title || !(doc.url?.trim() || doc.text?.trim())) errors.push(`Добавьте документ: ${id}`);
  }
  for (const review of data.reviews) {
    if (!review.author || !review.text || !review.url?.startsWith('https://')) errors.push('Отзывы должны содержать автора, текст и HTTPS-ссылку на источник');
  }
  return errors;
}
