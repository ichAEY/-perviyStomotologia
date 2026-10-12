import { clinic } from './clinic-data';

export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15 ? digits : '';
}

export function consultationMailto(input: { phone: string; name: string; request: string }): string {
  if (!normalizePhone(input.phone)) throw new Error('Проверьте номер телефона.');
  const body = ['Здравствуйте!', '', 'Прошу связаться со мной по поводу консультации в клинике «' + clinic.name + '».',
    'Телефон: ' + input.phone.trim(),
    input.name.trim() ? 'Имя: ' + input.name.trim() : '',
    'Направление обращения: ' + input.request,
    '', 'Источник: ' + clinic.siteUrl,
  ].filter((line, index) => line || index === 1).join('\r\n');
  return 'mailto:' + clinic.email + '?subject=' + encodeURIComponent('Запрос на консультацию — ' + clinic.name) + '&body=' + encodeURIComponent(body);
}
