'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import { site, services } from './site-content';
import { validateRequest } from '../public/validation.js';

type Errors = { name?: string; phone?: string; consent?: string };

export default function RequestForm({ variant, serviceId }: { variant: 'desktop' | 'mobile'; serviceId: string }) {
  const id = useId();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [documentOpen, setDocumentOpen] = useState(false);
  const requestId = useRef('');
  const lastPayload = useRef('');
  const agreement = site.documents.find((doc) => doc.id === 'consent');
  const demo = site.mode === 'demo';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const result = validateRequest({ name, phone, consent });
    setErrors(result.errors);
    setStatus('');
    if (!result.valid) return;
    if (demo) {
      setStatus('Это шаблон: заявка не отправлена, номер телефона не сохранён.');
      return;
    }
    const serialized = JSON.stringify(result.data);
    if (!requestId.current || serialized !== lastPayload.current) {
      requestId.current = crypto.randomUUID();
      lastPayload.current = serialized;
    }
    setBusy(true);
    try {
      const response = await fetch(site.requestEndpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result.data, requestId: requestId.current, consentVersion: site.consentVersion, website: '' }),
      });
      const answer = await response.json();
      if (!response.ok || answer.accepted !== true) throw new Error(answer.message || 'Не удалось принять заявку. Попробуйте ещё раз.');
      setStatus('Заявка принята. Администратор свяжется с вами для согласования приёма.');
      setName(''); setPhone(''); setConsent(false); requestId.current = '';
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Не удалось принять заявку. Попробуйте ещё раз.');
    } finally { setBusy(false); }
  }

  return (
    <form className={variant === 'desktop' ? 'dp-form' : 'm2-form'} data-tanem-form="dentistry-template" onSubmit={submit} noValidate>
      {variant === 'desktop' && <div className="dp-form-top"><span>Форма обращения</span><b>{services[serviceId].title}</b></div>}
      {demo && <p className="template-form-note">Образец формы · заявки не отправляются</p>}
      <label htmlFor={`${id}-name`}><span>Имя <small>необязательно</small></span>
        <input id={`${id}-name`} name="name" autoComplete="name" placeholder="Как к вам обращаться" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? `${id}-name-error` : undefined} />
      </label>
      {errors.name && <p id={`${id}-name-error`} className="template-error">{errors.name}</p>}
      <label htmlFor={`${id}-phone`}><span>Телефон</span>
        <input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+7 ___ ___-__-__" value={phone} onChange={(event) => setPhone(event.target.value)} required aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? `${id}-phone-error` : undefined} />
      </label>
      {errors.phone && <p id={`${id}-phone-error`} className="template-error">{errors.phone}</p>}
      <label className="template-consent" htmlFor={`${id}-consent`}>
        <input id={`${id}-consent`} name="consent" type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? `${id}-consent-error` : undefined} />
        <span>{demo ? 'Проверить согласие в образце формы' : 'Я согласен на обработку персональных данных для обратного звонка.'}</span>
      </label>
      {!demo && <button className="template-document-button" type="button" onClick={() => setDocumentOpen(true)}>Прочитать согласие</button>}
      {errors.consent && <p id={`${id}-consent-error`} className="template-error">{errors.consent}</p>}
      <button type="submit" disabled={busy}>{busy ? 'Отправляем…' : 'Перезвоните мне'} <span aria-hidden="true">↗</span></button>
      <p className="template-status" role="status" aria-live="polite">{status}</p>
      {documentOpen && <div className="template-dialog-backdrop"><div className="template-dialog" role="dialog" aria-modal="true" aria-label="Согласие на обработку данных">
        <h2>{agreement?.title}</h2><p>{agreement?.text}</p>
        {agreement?.url && <a href={agreement.url} target="_blank" rel="noreferrer">Открыть документ</a>}
        <button type="button" autoFocus onClick={() => setDocumentOpen(false)}>Закрыть</button>
      </div></div>}
    </form>
  );
}
