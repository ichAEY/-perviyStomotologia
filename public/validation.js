export function normalizePhone(value) {
  const raw = String(value ?? '').trim();
  if (!/^[+\d\s().-]+$/.test(raw)) return null;
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 10) digits = `7${digits}`;
  if (digits.length !== 11 || !/^[78]/.test(digits)) return null;
  return `+7${digits.slice(1)}`;
}
export function validateRequest(input) {
  const errors = {};
  const phone = normalizePhone(input.phone);
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  if (!phone) errors.phone = 'Укажите российский номер телефона: 10 цифр или номер с +7 / 8.';
  if ([...name].length > 80 || /[\u0000-\u001f]/.test(name)) errors.name = 'Имя должно содержать не более 80 символов.';
  if (input.consent !== true) errors.consent = 'Для обратного звонка нужно ваше согласие на обработку данных.';
  return { valid: Object.keys(errors).length === 0, errors, data: { phone, name, consent: input.consent === true } };
}
export function formatPrice(price, unit = '') {
  const format = value => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
  let label = 'Стоимость уточняется';
  if (typeof price === 'number' && Number.isFinite(price) && price >= 0) label = format(price);
  if (price && typeof price === 'object' && typeof price.from === 'number' && Number.isFinite(price.from)) {
    label = typeof price.to === 'number' ? `${format(price.from)}–${format(price.to)}` : `от ${format(price.from)}`;
  }
  return { label, unit };
}
