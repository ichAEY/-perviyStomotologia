'use client';

import { useEffect, useRef, useState } from 'react';
import { clinic, dentalServices, type ServiceId } from './clinic-data';
import { ClinicMark, DentalVisual } from './dental-visual';
import ConsultationForm from './consultation-form';
import RequestGallery from './request-gallery';
import HeroVisualRotator from './hero-visuals';
import ServiceDetails from './service-details';

function MenuIcon({ open }: { open: boolean }) {
  return <span className={'m2-menu-lines' + (open ? ' is-open' : '')} aria-hidden="true"><i /><i /></span>;
}
function PhoneIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h4l2 5-3 2c1.5 2.8 3.2 4.5 6 6l2-3 4 2v4a2 2 0 0 1-2.5 2C10 19.4 4.6 14 3 5.5A2 2 0 0 1 6 3Z" /></svg>;
}

export default function MobileV2() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState<ServiceId>('treatment');
  const [stickyVisible, setStickyVisible] = useState(false);
  const [request, setRequest] = useState('Консультация стоматолога');
  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const service = dentalServices.find((item) => item.id === activeService)!;

  useEffect(() => {
    let heroVisible = true;
    let formVisible = false;
    const sync = () => setStickyVisible(!heroVisible && !formVisible);
    const heroObserver = new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; sync(); }, { threshold: 0.03 });
    const formObserver = new IntersectionObserver(([entry]) => { formVisible = entry.isIntersecting; sync(); }, { threshold: 0.03 });
    if (heroRef.current) heroObserver.observe(heroRef.current);
    if (formRef.current) formObserver.observe(formRef.current);
    return () => { heroObserver.disconnect(); formObserver.disconnect(); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };
  const goToForm = (label = 'Консультация стоматолога') => { setRequest(label); goTo('m2-contact-form'); };
  const chooseService = (id: ServiceId) => {
    setActiveService(id);
    window.setTimeout(() => goTo('m2-service-detail'), 0);
  };

  return <main className="mobile-v2">
    <section className="m2-hero" id="m2-top" ref={heroRef}>
      <div className="m2-topbar">
        <button className="m2-identity" type="button" onClick={() => goTo('m2-top')} aria-label="Медиком-М — на главную"><span className="m2-avatar"><ClinicMark /></span><span className="m2-identity-copy"><strong>{clinic.name}</strong><small>Стоматология</small></span></button>
        <div className="m2-top-actions">
          <a className="m2-phone-icon" href={clinic.phoneHref} aria-label={'Позвонить в клинику: ' + clinic.phone}><PhoneIcon /></a>
          <button className="m2-menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} aria-controls="m2-navigation"><MenuIcon open={menuOpen} /></button>
        </div>
      </div>
      <div className="m2-hero-body">
        <p className="m2-location">{clinic.city} · {clinic.district}</p>
        <div className="m2-name-block"><h1>{clinic.name}<em>Стоматология для взрослых</em></h1><p>Лечение, профилактика<br />и восстановление зубов.</p></div>
        <div className="m2-hero-actions">
          <button className="m2-button m2-primary" type="button" onClick={() => goToForm()}>{clinic.consultationCta}<span aria-hidden="true">↗</span></button>
          <button className="m2-text-link" type="button" onClick={() => goTo('m2-services')}>Посмотреть услуги <span aria-hidden="true">↓</span></button>
        </div>
        <div className="m2-hero-space"><HeroVisualRotator /></div>
        <div className="m2-hero-bottom"><a href={clinic.mapUrl} target="_blank" rel="noopener noreferrer">{clinic.address}<span aria-hidden="true">↗</span></a><span>Ежедневно · 10:00–21:00</span></div>
      </div>
    </section>

    <div className={'m2-sticky' + (stickyVisible ? ' is-visible' : '')} aria-hidden={!stickyVisible} inert={!stickyVisible}>
      <button className="m2-identity m2-sticky-identity" type="button" onClick={() => goTo('m2-top')}><span className="m2-avatar m2-avatar-small"><ClinicMark /></span><span className="m2-identity-copy"><strong>{clinic.name}</strong></span></button>
      <button className="m2-sticky-book" type="button" onClick={() => goToForm()}>Консультация <span aria-hidden="true">↗</span></button>
      <button className="m2-menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menuOpen} aria-controls="m2-navigation"><MenuIcon open={menuOpen} /></button>
    </div>
    {menuOpen && <><button type="button" className="m2-menu-backdrop" aria-label="Закрыть меню" onClick={() => setMenuOpen(false)} /><nav className="m2-menu-panel" id="m2-navigation" aria-label="Навигация">
      <button type="button" onClick={() => goTo('m2-services')}><span>01</span>Услуги</button>
      <button type="button" onClick={() => goTo('m2-about')}><span>02</span>О клинике</button>
      <button type="button" onClick={() => goTo('m2-request')}><span>03</span>С чем обратиться</button>
      <button type="button" onClick={() => goTo('m2-contact-form')}><span>04</span>Бесплатная консультация</button>
    </nav></>}

    <section className="m2-services" id="m2-services">
      <header className="m2-section-heading"><span className="clinic-section-number">01</span><h2>Услуги</h2><p>Выберите нужное направление.</p></header>
      <div className="m2-service-tabs" id="m2-service-tabs" aria-label="Направления стоматологии">
        {dentalServices.map((item) => <button key={item.id} className={'m2-service-tab' + (activeService === item.id ? ' is-active' : '')} type="button" onClick={() => chooseService(item.id)} aria-pressed={activeService === item.id} aria-controls="m2-service-detail"><span>{item.title}</span><span aria-hidden="true">↗</span></button>)}
      </div>
      <article className="m2-service-detail" id="m2-service-detail" key={activeService} aria-label={service.title}>
        <button type="button" className="m2-service-back" onClick={() => goTo('m2-service-tabs')}>Все направления <span aria-hidden="true">↑</span></button>
        <div className="m2-service-detail-heading"><div><span className="m2-detail-kicker">{service.eyebrow}</span><h3>{service.title}</h3></div><DentalVisual art={service.art} /></div>
        <p className="m2-detail-summary">{service.summary}</p>
        <ServiceDetails serviceId={activeService} />
        <a className="clinic-price-link" href={clinic.phoneHref}>Уточнить стоимость <span aria-hidden="true">↗</span></a>
        <button className="m2-button m2-primary" type="button" onClick={() => goToForm(service.title)}>{clinic.consultationCta}<span aria-hidden="true">↗</span></button>
      </article>
    </section>

    <section className="m2-about" id="m2-about">
      <header className="m2-section-heading"><span className="clinic-section-number">02</span><h2>О клинике</h2></header>
      <p className="m2-about-lead">{clinic.about}</p>
      <span className="clinic-appointment-note">Приём по предварительной записи</span>
      <div className="clinic-location-panel"><small>Рядом с метро</small><h3>{clinic.address}</h3><p>Бульвар Дмитрия Донского<br />Улица Старокачаловская</p><a className="clinic-route-link" href={clinic.mapUrl} target="_blank" rel="noopener noreferrer">Построить маршрут <span aria-hidden="true">↗</span></a></div>
    </section>

    <section className="m2-request" id="m2-request">
      <header className="m2-section-heading"><span className="clinic-section-number">03</span><h2>С чем обратиться</h2><p>Выберите, что вас беспокоит.</p></header>
      <RequestGallery variant="mobile" onConsultation={goToForm} />
      <p className="clinic-gallery-note">Необязательно знать название процедуры. Начните с вашего вопроса.</p>
    </section>

    <section className="m2-form-section" id="m2-contact-form" ref={formRef}>
      <div className="m2-form-head"><span className="clinic-section-number">04 · Связаться с клиникой</span><h2>{clinic.consultationCta}</h2><p>Уточните услуги и договоритесь о записи.</p></div>
      <ConsultationForm variant="mobile" request={request} />
      <div className="m2-contact-card">
        <div className="m2-contact-identity"><strong>{clinic.name}</strong><span>{clinic.hours}</span></div>
        <a className="clinic-mobile-address" href={clinic.mapUrl} target="_blank" rel="noopener noreferrer">{clinic.fullAddress}<span aria-hidden="true">↗</span></a>
        <a href={'mailto:' + clinic.email}>{clinic.email}</a>
        <a href={clinic.secondPhoneHref}>Дополнительный телефон: {clinic.secondPhone}</a>
      </div>
      <p className="clinic-medical-note">Осмотр и лечение оплачиваются по прайсу клиники. Информация не заменяет приём врача.</p>
      <p className="clinic-powered">Цифровой офис · TANEM</p>
    </section>
  </main>;
}
