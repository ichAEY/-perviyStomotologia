'use client';

import { useState } from 'react';
import { clinic, dentalServices, asset, type ServiceId } from './clinic-data';
import { ClinicMark, DentalVisual } from './dental-visual';
import ConsultationForm from './consultation-form';
import RequestGallery from './request-gallery';
import ServiceDetails from './service-details';

function Arrow() { return <span aria-hidden="true">↗</span>; }

export default function DesktopPerfect() {
  const [activeService, setActiveService] = useState<ServiceId>('treatment');
  const [request, setRequest] = useState('Консультация стоматолога');
  const service = dentalServices.find((item) => item.id === activeService)!;
  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start',
  });
  const goToForm = (label = 'Консультация стоматолога') => { setRequest(label); goTo('dp-contact'); };

  return <main className="desktop-perfect">
    <header className="dp-header">
      <div className="dp-shell dp-header-inner">
        <button className="dp-identity" type="button" onClick={() => goTo('dp-top')} aria-label="Медиком-М — на главную">
          <span className="dp-avatar"><ClinicMark /></span>
          <span><strong>{clinic.name}</strong><small>Стоматология</small></span>
        </button>
        <nav className="dp-nav" aria-label="Навигация по сайту">
          <button type="button" onClick={() => goTo('dp-services')}>Услуги</button>
          <button type="button" onClick={() => goTo('dp-about')}>О клинике</button>
          <button type="button" onClick={() => goTo('dp-request')}>С чем обратиться</button>
          <button type="button" onClick={() => goTo('dp-contact')}>Контакты</button>
        </nav>
        <button className="dp-header-cta" type="button" onClick={() => goToForm()}>{clinic.consultationCta}<Arrow /></button>
      </div>
    </header>

    <section className="dp-hero" id="dp-top">
      <div className="dp-shell dp-hero-grid">
        <div className="dp-hero-copy">
          <p className="dp-location">{clinic.city} · {clinic.district}</p>
          <h1>{clinic.name}<em>Стоматология для взрослых</em></h1>
          <p className="dp-hero-lead">Лечение, профилактика и восстановление зубов.</p>
          <div className="dp-hero-actions">
            <button className="dp-button dp-button-primary" type="button" onClick={() => goToForm()}>{clinic.consultationCta}<Arrow /></button>
            <button className="dp-text-link" type="button" onClick={() => goTo('dp-services')}>Посмотреть услуги <span aria-hidden="true">↓</span></button>
          </div>
          <div className="dp-specialty">
            <div><small>Адрес</small><a href={clinic.mapUrl} target="_blank" rel="noopener noreferrer">{clinic.address}</a></div>
            <div><small>Ежедневно</small><span>10:00–21:00</span></div>
          </div>
        </div>
        <div className="dp-hero-photo-card">
          <img src={asset('/assets/dental-care.webp')} alt="" fetchPriority="high" decoding="async" />
          <span className="dp-photo-caption">Стоматологическая иллюстрация</span>
        </div>
      </div>
    </section>

    <section className="dp-services" id="dp-services">
      <div className="dp-shell">
        <div className="dp-section-heading"><div><span className="dp-section-number">01</span><h2>Услуги</h2></div><p>Выберите нужное направление.</p></div>
        <div className="dp-service-layout">
          <div className="dp-service-tabs" aria-label="Направления стоматологии">
            {dentalServices.map((item) => <button key={item.id} type="button" className={activeService === item.id ? 'is-active' : ''} onClick={() => setActiveService(item.id)} aria-pressed={activeService === item.id} aria-controls="dp-service-detail"><span>{item.title}</span><span aria-hidden="true">↗</span></button>)}
          </div>
          <article className="dp-service-card" id="dp-service-detail" key={activeService} aria-label={service.title}>
            <div className="dp-service-copy">
              <span className="dp-kicker">{service.eyebrow}</span>
              <h3>{service.title}</h3>
              <p className="dp-service-summary">{service.summary}</p>
              <ServiceDetails serviceId={activeService} />
              <div className="dp-service-footer">
                <a className="clinic-price-link" href={clinic.phoneHref}>Уточнить стоимость <span aria-hidden="true">↗</span></a>
                <button className="dp-button dp-button-primary" type="button" onClick={() => goToForm(service.title)}>{clinic.consultationCta}<Arrow /></button>
              </div>
            </div>
            <div className="dp-service-photo"><DentalVisual art={service.art} /></div>
          </article>
        </div>
      </div>
    </section>

    <section className="dp-about" id="dp-about">
      <div className="dp-shell dp-about-grid">
        <div className="dp-about-copy">
          <div className="dp-section-heading"><div><span className="dp-section-number">02</span><h2>О клинике</h2></div></div>
          <p>{clinic.about}</p>
          <span className="clinic-appointment-note">Приём по предварительной записи</span>
        </div>
        <div className="clinic-location-panel">
          <small>Москва · Северное Бутово</small>
          <h3>{clinic.address}</h3>
          <p>Метро: Бульвар Дмитрия Донского<br />Улица Старокачаловская</p>
          <a className="clinic-route-link" href={clinic.mapUrl} target="_blank" rel="noopener noreferrer">Построить маршрут <Arrow /></a>
        </div>
      </div>
    </section>

    <section className="dp-request" id="dp-request">
      <div className="dp-shell">
        <div className="dp-section-heading"><div><span className="dp-section-number">03</span><h2>С чем обратиться</h2></div><p>Выберите, что вас беспокоит.</p></div>
        <RequestGallery variant="desktop" onConsultation={goToForm} />
        <p className="clinic-gallery-note">Необязательно знать название процедуры. Начните с вашего вопроса.</p>
      </div>
    </section>

    <section className="dp-contact" id="dp-contact">
      <div className="dp-shell dp-contact-grid">
        <div className="dp-contact-copy">
          <span className="dp-contact-number">04 · Связаться с клиникой</span>
          <h2>{clinic.consultationCta}</h2>
          <p>Уточните услуги и договоритесь о записи.</p>
          <div className="dp-contact-links">
            <a className="clinic-main-phone" href={clinic.phoneHref}>{clinic.phone}<Arrow /></a>
            <a href={clinic.secondPhoneHref}><small>Дополнительный телефон</small><span>{clinic.secondPhone}</span></a>
            <a href={'mailto:' + clinic.email}><small>Почта</small><span>{clinic.email}</span></a>
            <a href={clinic.mapUrl} target="_blank" rel="noopener noreferrer"><small>Адрес</small><span>{clinic.fullAddress}</span></a>
            <div><small>График</small><span>{clinic.hours}</span></div>
          </div>
        </div>
        <ConsultationForm variant="desktop" request={request} />
      </div>
    </section>
    <footer className="clinic-desktop-footer"><div className="dp-shell"><p>Осмотр и лечение оплачиваются по прайсу клиники. Информация не заменяет приём врача.</p><span>Цифровой офис · TANEM</span></div></footer>
  </main>;
}
