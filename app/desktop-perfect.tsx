'use client';

import { useState } from 'react';

import { clinic, copy, services, firstService, secondService, asset, type ServiceId } from './site-content';
import RequestForm from './request-form';

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

function PhoneIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h4l2 5-3 2c2 3 3 4 6 6l2-3 5 2v4c0 2-2 3-4 2C10 19 5 14 3 7c-1-2 0-4 2-4Z" /></svg>;
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
  const [activeService, setActiveService] = useState<ServiceId>(firstService);
  const service = services[activeService];

  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToForm = (serviceId?: ServiceId) => {
    if (serviceId) setActiveService(serviceId);
    window.setTimeout(() => goTo('dp-contact'), 0);
  };

  return (
    <main className="desktop-perfect">
      <header className="dp-header">
        <div className="dp-shell dp-header-inner">
          <button className="dp-identity" type="button" onClick={() => goTo('dp-top')}>
            <span className="dp-avatar">
              <img src={asset('/assets/favicon.svg')} alt={copy.subtitle} />
              </span>
            <span>
              <strong>{clinic.name}</strong>
              <small>{copy.subtitle}</small>
            </span>
          </button>

          <nav className="dp-nav" aria-label="Навигация по сайту">
            <button type="button" onClick={() => goTo('dp-services')}>Услуги</button>
            <button type="button" onClick={() => goTo('dp-about')}>О клинике</button>
            <button type="button" onClick={() => goTo('dp-request')}>С чем обратиться</button>
            <button type="button" onClick={() => goTo('dp-contact')}>Контакты</button>
          </nav>

          <button className="dp-header-cta" type="button" onClick={() => goToForm(firstService)}>
            Записаться на приём <Arrow />
          </button>
        </div>
      </header>

      <section className="dp-hero" id="dp-top">
        <div className="dp-shell dp-hero-grid">
          <div className="dp-hero-copy">
            <div className="dp-location"><span /> {copy.location}</div>
            <div className="dp-proof">
              <div><strong>{copy.facts[0].value}</strong><span>{copy.facts[0].label}</span></div>
              <i />
              <div><strong>{copy.facts[1].value}</strong><span>{copy.facts[1].label}</span></div>
            </div>
            <span className="dp-kicker">{copy.subtitle}</span>
            <h1>{clinic.heroTitle}<br /><em>{clinic.heroAccent}</em></h1>
            <p className="dp-hero-lead">{clinic.heroDescription}</p>

            <div className="dp-hero-actions">
              <button className="dp-button dp-button-primary" type="button" onClick={() => goToForm(firstService)}>Записаться на приём <Arrow /></button>
              <button className="dp-button dp-button-secondary" type="button" onClick={() => goTo('dp-services')}>Посмотреть услуги <Arrow /></button>
            </div>

            <div className="dp-specialty">
              <div><small>Направление</small><strong>{copy.subtitle}</strong></div>
              <div><small>Категория</small><strong>Приём в клинике</strong></div>
            </div>
          </div>

          <div className="dp-hero-photo-card">
            <img src={asset(clinic.heroImage)} alt={clinic.heroImageAlt} />
            <div className="dp-photo-caption">
              <span><b>{clinic.heroImageCaption}</b><small>{copy.subtitle}</small></span>
              <span className="dp-photo-status">Шаблон</span>
            </div>
          </div>
        </div>
      </section>

      <section className="dp-credentials">
        <div className="dp-shell dp-credentials-grid">
          <article className="dp-credential-main">
            <span className="dp-icon-box"><BookIcon /></span>
            <div>
              <small>{copy.credentials.title}</small>
              <h2>{copy.credentials.description}</h2>
            </div>
          </article>

          <article className="dp-credential-stat">
            <small>{copy.credentials.statTitle}</small>
            <strong>{copy.credentials.statValue}</strong>
            <p>{copy.credentials.statText}</p>
          </article>

          <article className="dp-credential-stat">
            <small>{copy.credentials.detailTitle}</small>
            <strong>{copy.credentials.detailValue}</strong>
            <p>{copy.credentials.detailText}</p>
          </article>
        </div>
      </section>

      <section className="dp-services" id="dp-services">
        <div className="dp-shell">
          <div className="dp-section-heading">
            <div><span className="dp-section-number">01</span><h2>Услуги</h2></div>
            <p>{copy.serviceNotes}</p>
          </div>

          <div className="dp-service-layout">
            <div className="dp-service-tabs" role="tablist" aria-label="Направления услуг">
              {(Object.keys(services) as ServiceId[]).map((id) => (
                <button key={id} type="button" className={activeService === id ? 'is-active' : ''} onClick={() => setActiveService(id)}>
                  <span>{String(Object.keys(services).indexOf(id) + 1).padStart(2, '0')}</span>
                  <small>{services[id].eyebrow}</small>
                  <strong>{services[id].tab}</strong>
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
                    <h4>Что входит</h4>
                    <ul>{service.gives.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div>
                    <h4>Об услуге</h4>
                    <ul>{service.fits.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                </div>

                <div className="dp-service-footer">
                  <div className="dp-service-meta">
                    <span><small>Стоимость</small><strong>{service.price}</strong></span>
                    <span><small>Расчёт стоимости</small><strong>{service.unit}</strong></span>
                  </div>
                  <button className="dp-button dp-button-primary" type="button" onClick={() => goToForm(activeService)}>Записаться <Arrow /></button>
                </div>
              </div>

              <div className="dp-service-photo">
                <img src={asset(service.image)} alt={clinic.serviceImageAlt} /><small className="template-media-caption">{clinic.serviceImageCaption}</small>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="dp-about" id="dp-about">
        <div className="dp-shell dp-about-grid">
          <div className="dp-about-photo">
            <img src={asset(clinic.clinicImage)} alt={clinic.clinicImageAlt} /><small className="template-media-caption">{clinic.clinicImageCaption}</small>
          </div>

          <div className="dp-about-copy">
            <div className="dp-about-title">
              <span className="dp-icon-box"><ShieldIcon /></span>
              <span><small>02</small><h2>О клинике</h2></span>
            </div>
            <p>{clinic.description}</p>

            <div className="dp-about-facts">
              {copy.facts.map((fact) => <article key={fact.label}><strong>{fact.value}</strong><span>{fact.label}</span></article>)}
            </div>

            <div className="dp-about-principle">
              <small>Принцип работы</small>
              <strong>{copy.aboutPrinciple}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="dp-request" id="dp-request">
        <div className="dp-shell">
          <div className="dp-section-heading dp-request-heading">
            <div><span className="dp-section-number">03</span><h2>С чем обратиться</h2></div>
            <p>{copy.requestTitle}</p>
          </div>

          <div className="dp-request-grid">
            {copy.requests.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>

          <div className="dp-request-bottom">
            <p>{copy.requestDescription}</p>
            <button className="dp-button dp-button-primary" type="button" onClick={() => goToForm(firstService)}>Связаться с клиникой <Arrow /></button>
          </div>
        </div>
      </section>

      <section className="dp-contact" id="dp-contact">
        <div className="dp-shell dp-contact-grid">
          <div className="dp-contact-copy">
            <span className="dp-contact-number">04 · Контакты</span>
            <h2>Оставьте заявку</h2>
            <p>{copy.requestDescription}</p>

            <div className="dp-contact-person">
              <span className="dp-avatar dp-avatar-large">
                <img src={asset('/assets/favicon.svg')} alt={copy.subtitle} />
                </span>
              <span><strong>{clinic.name}</strong><small>{copy.subtitle}</small></span>
            </div>

            <div className="dp-contact-links">
              <span><i><PhoneIcon /></i><b>Телефон</b><em>{clinic.phone || 'Телефон клиники'}</em></span>
              <span><i><PinIcon /></i><b>{clinic.address || copy.location}</b><em>очный приём по записи</em></span>
            </div>
          </div>

          <RequestForm variant="desktop" serviceId={activeService} />
        </div>
      </section>
    </main>
  );
}
