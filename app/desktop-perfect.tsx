'use client';

import { useState } from 'react';

import { clinic, dentalServices, asset, type ServiceId } from './clinic-data';
import { ClinicMark, DentalVisual } from './dental-visual';
import ConsultationForm from './consultation-form';
import RequestGallery from './request-gallery';

const services = Object.fromEntries(dentalServices.map((service) => [service.id, service])) as Record<ServiceId, typeof dentalServices[number]>;

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 3.5 26 8v7.2c0 6.6-4.2 11.2-10 14.1-5.8-2.9-10-7.5-10-14.1V8l10-4.5Z" />
      <path d="m11.5 15.7 3.1 3.1 6.2-7" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M5 7h9c2.8 0 4 1.8 4 4v15c0-2.2-1.8-3.4-4.2-3.4H5V7Z" />
      <path d="M27 7h-9v19c0-2.2 1.8-3.4 4.2-3.4H27V7Z" />
    </svg>
  );
}

function MailIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></svg>;
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

export default function DesktopPerfect() {
  const [activeService, setActiveService] = useState<ServiceId>('treatment');
  const service = services[activeService];
  const [request, setRequest] = useState('Консультация стоматолога');

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  const goToForm = (serviceId?: ServiceId) => {
    if (serviceId) { setActiveService(serviceId); setRequest(services[serviceId].title); }
    window.setTimeout(() => goTo('dp-contact'), 0);
  };

  const goToConsultation = (label: string) => { setRequest(label); goTo('dp-contact'); };

  return (
    <main className="desktop-perfect">
      <header className="dp-header">
        <div className="dp-shell dp-header-inner">
          <button className="dp-identity" type="button" onClick={() => goTo('dp-top')}>
            <span className="dp-avatar">
              <ClinicMark />
            </span>
            <span>
              <strong>{clinic.name}</strong>
              <small>{clinic.specialty}</small>
            </span>
          </button>

          <nav className="dp-nav" aria-label="Навигация по сайту">
            <button type="button" onClick={() => goTo('dp-services')}>Услуги</button>
            <button type="button" onClick={() => goTo('dp-about')}>О клинике</button>
            <button type="button" onClick={() => goTo('dp-request')}>С чем обратиться</button>
            <button type="button" onClick={() => goTo('dp-contact')}>Контакты</button>
          </nav>

          <button className="dp-header-cta" type="button" onClick={() => goToForm('treatment')}>
            {clinic.consultationCta} <Arrow />
          </button>
        </div>
      </header>

      <section className="dp-hero" id="dp-top">
        <div className="dp-shell dp-hero-grid">
          <div className="dp-hero-copy">
            <div className="dp-location"><span /> {clinic.city} · {clinic.district}</div>
            <div className="dp-proof">
              <div><strong>10:00–21:00</strong><span>ежедневно</span></div>
              <div><strong>Для взрослых</strong><span>стоматология</span></div>
            </div>
            <span className="dp-kicker">{clinic.specialty}</span>
            <h1>{clinic.name}<br /><em>Стоматологическая клиника</em></h1>
            <p className="dp-hero-lead">Лечение зубов, профессиональная гигиена и восстановление улыбки в Северном Бутове. Начните с консультации и узнайте подходящие варианты.</p>

            <div className="dp-hero-actions">
              <button className="dp-button dp-button-primary" type="button" onClick={() => goToForm('treatment')}>{clinic.consultationCta} <Arrow /></button>
              <button className="dp-button dp-button-secondary" type="button" onClick={() => goTo('dp-services')}>Посмотреть услуги <Arrow /></button>
            </div>

            <div className="dp-specialty">
              <div><small>Адрес</small><strong>{clinic.address}</strong></div>
              <div><small>Приём</small><strong>По предварительной записи</strong></div>
            </div>
          </div>

          <div className="dp-hero-photo-card">
            <img src={asset('/assets/dental-care.webp')} alt="Стоматологическая иллюстрация" fetchPriority="high" decoding="async" />
            <div className="dp-photo-caption">
              <span><b>{clinic.name}</b><small>{clinic.fullAddress}</small></span>
              <span className="dp-photo-status">Иллюстрация</span>
            </div>
          </div>
        </div>
      </section>

      <section className="dp-credentials">
        <div className="dp-shell dp-credentials-grid">
          <article className="dp-credential-main">
            <span className="dp-icon-box"><BookIcon /></span>
            <div>
              <small>{clinic.name}</small>
              <h2>Стоматологическая клиника для взрослых в Северном Бутове, рядом с метро.</h2>
            </div>
          </article>

          <article className="dp-credential-stat">
            <small>График работы</small>
            <strong>10–21</strong>
            <p>ежедневно, без выходных</p>
          </article>

          <article className="dp-credential-stat">
            <small>Направления</small>
            <strong>8</strong>
            <p>от лечения до восстановления зубов</p>
          </article>
        </div>
      </section>

      <section className="dp-services" id="dp-services">
        <div className="dp-shell">
          <div className="dp-section-heading">
            <div><span className="dp-section-number">01</span><h2>Услуги</h2></div>
            <p>Выберите направление, чтобы посмотреть услуги и узнать, с какими вопросами можно обратиться.</p>
          </div>

          <div className="dp-service-layout">
            <div className="dp-service-tabs" aria-label="Направления стоматологии">
              {(Object.keys(services) as ServiceId[]).map((id) => (
                <button key={id} type="button" className={activeService === id ? 'is-active' : ''} onClick={() => setActiveService(id)} aria-pressed={activeService === id}>
                  <span>{String(dentalServices.findIndex((item) => item.id === id) + 1).padStart(2, '0')}</span>
                  <small>{services[id].eyebrow}</small>
                  <strong>{services[id].title}</strong>
                  <b>→</b>
                </button>
              ))}
            </div>

            <article className="dp-service-card" key={activeService}>
              <div className="dp-service-copy">
                <span className="dp-kicker">{service.eyebrow}</span>
                <h3>{service.title}</h3>
                <p className="dp-service-summary">{service.summary}</p>

                <div className="dp-service-lists">
                  <div>
                    <h4>Направления работы</h4>
                    <ul>{service.gives.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div>
                    <h4>Кому подходит</h4>
                    <ul>{service.fits.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                </div>

                <div className="dp-service-footer">
                  <div className="dp-service-meta">
                    <span><small>Стоимость</small><strong><a href={clinic.phoneHref}>Уточнить по телефону</a></strong></span>
                    <span><small>Приём</small><strong>По записи</strong></span>
                  </div>
                  <button className="dp-button dp-button-primary" type="button" onClick={() => goToForm(activeService)}>{clinic.consultationCta} <Arrow /></button>
                </div>
              </div>

              <div className="dp-service-photo">
                <DentalVisual art={service.art} />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="dp-about" id="dp-about">
        <div className="dp-shell dp-about-grid">
          <div className="dp-about-photo">
            <DentalVisual art={3} />
          </div>

          <div className="dp-about-copy">
            <div className="dp-about-title">
              <span className="dp-icon-box"><ShieldIcon /></span>
              <span><small>02</small><h2>О клинике</h2></span>
            </div>
            <p>{clinic.about}</p>

            <div className="dp-about-facts">
              <article><strong>Москва</strong><span>Северное Бутово</span></article>
              <article><strong>8</strong><span>направлений</span></article>
              <article><strong>10–21</strong><span>ежедневно</span></article>
            </div>

            <div className="dp-about-principle">
              <small>Как добраться</small>
              <strong>{clinic.metro}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="dp-request" id="dp-request">
        <div className="dp-shell">
          <div className="dp-section-heading dp-request-heading">
            <div><span className="dp-section-number">03</span><h2>С чем к нам обращаться</h2></div>
            <p>Откройте карточку, чтобы узнать, с чего начинается решение вашего вопроса.</p>
          </div>

          <RequestGallery variant="desktop" onConsultation={goToConsultation} />

          <div className="dp-request-bottom">
            <p>Необязательно знать название процедуры. Опишите свой вопрос, а врач определит необходимые обследования и варианты лечения.</p>
            <button className="dp-button dp-button-primary" type="button" onClick={() => goToForm('treatment')}>{clinic.consultationCta} <Arrow /></button>
          </div>
        </div>
      </section>

      <section className="dp-contact" id="dp-contact">
        <div className="dp-shell dp-contact-grid">
          <div className="dp-contact-copy">
            <span className="dp-contact-number">04 · Контакты</span>
            <h2>{clinic.consultationCta}</h2>
            <p>Уточните услуги и порядок записи. Оставьте контакты, чтобы клиника могла ответить на ваше обращение.</p>

            <div className="dp-contact-person">
              <span className="dp-avatar dp-avatar-large">
                <ClinicMark />
                </span>
              <span><strong>{clinic.name}</strong><small>{clinic.specialty}</small></span>
            </div>

            <div className="dp-contact-links">
              <a href={clinic.phoneHref}><b>Телефон</b><em>{clinic.phone}</em></a>
              <a href={clinic.secondPhoneHref}><b>Дополнительный</b><em>{clinic.secondPhone}</em></a>
              <a href={'mailto:' + clinic.email}><i><MailIcon /></i><b>Почта</b><em>{clinic.email}</em></a>
              <a href={clinic.mapUrl} target="_blank" rel="noopener noreferrer"><i><PinIcon /></i><b>Адрес</b><em>{clinic.fullAddress}</em></a>
              <span><b>График</b><em>{clinic.hours}</em></span>
            </div>
          </div>

          <ConsultationForm variant="desktop" request={request} />
        </div>
      </section>
<footer className="clinic-desktop-footer">Осмотр, обследования и лечение оплачиваются по прайсу клиники. Информация на сайте не заменяет приём врача.<span>Цифровой офис · TANEM</span></footer>
    </main>
  );
}
