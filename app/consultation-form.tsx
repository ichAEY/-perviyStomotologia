'use client';

import { useState, type FormEvent } from 'react';
import { clinic } from './clinic-data';
import { consultationMailto, normalizePhone } from './consultation';

export default function ConsultationForm({ variant, request }: { variant: 'mobile' | 'desktop'; request: string }) {
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const prefix = variant === 'mobile' ? 'm2' : 'dp';
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const phone = String(data.get('phone') ?? '');
    if (!normalizePhone(phone)) { setError('Проверьте номер телефона: укажите от 10 до 15 цифр.'); return; }
    if (data.get('consent') !== 'on') { setError('Подтвердите согласие отправить контакты в клинику.'); return; }
    const href = consultationMailto({ phone, name: String(data.get('name') ?? ''), request });
    setError('');
    setDraft(href);
    window.location.href = href;
  };

  return <form className={prefix + '-form clinic-consultation-form'} onSubmit={onSubmit} noValidate>
    <div className="clinic-form-request"><small>Ваш вопрос</small><strong>{request}</strong></div>
    <label><span>Телефон</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 ___ ___-__-__" required maxLength={30} aria-describedby={prefix + '-delivery-note'} /></label>
    <label><span>Как к вам обращаться <small>необязательно</small></span><input name="name" type="text" autoComplete="given-name" placeholder="Ваше имя" maxLength={80} /></label>
    <label className="clinic-consent"><input name="consent" type="checkbox" required /><span>Согласен отправить имя и телефон в «{clinic.name}» по электронной почте для ответа на обращение.</span></label>
    {error && <p className="clinic-form-error" role="alert">{error}</p>}
    <button type="submit">{clinic.consultationCta}<span aria-hidden="true">↗</span></button>
    <p className="clinic-delivery-note" id={prefix + '-delivery-note'}>Откроется письмо на {clinic.email}. Отправьте его из своего почтового приложения.</p>
    {draft && <div className="clinic-mail-status" role="status"><p>Письмо подготовлено. Обращение будет доставлено после его отправки.</p><a href={draft}>Открыть письмо ещё раз ↗</a></div>}
    <a className="clinic-phone-alternative" href={clinic.phoneHref}>Или позвоните: {clinic.phone}</a>
  </form>;
}
