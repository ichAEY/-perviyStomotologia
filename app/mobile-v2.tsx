'use client';

import { useEffect, useRef, useState } from 'react';

import { clinic, dentalServices, asset, type ServiceId } from './clinic-data';
import { ClinicMark, DentalVisual, ToothIcon } from './dental-visual';
import ConsultationForm from './consultation-form';
import RequestGallery from './request-gallery';
import HeroVisualRotator from './hero-visuals';

const services = Object.fromEntries(dentalServices.map((service) => [service.id, service])) as Record<ServiceId, typeof dentalServices[number]>;

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5.5" width="16" height="14" rx="3" />
      <path d="M8 3.5v4M16 3.5v4M4 9.5h16" />
      <path d="M8 13h3M13.5 13H16M8 16h3" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className={`m2-menu-lines${open ? ' is-open' : ''}`} aria-hidden="true">
      <i />
      <i />
    </span>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3h4l2 5-3 2c1.5 2.8 3.2 4.5 6 6l2-3 4 2v4a2 2 0 0 1-2.5 2C10 19.4 4.6 14 3 5.5A2 2 0 0 1 6 3Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

function ServiceIcon({ type }: { type: ServiceId }) {
  return <ToothIcon shine={type === 'aesthetics'} />;
}

function BookIcon() {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true">
      <path d="M5 6h8c2.5 0 4 1.5 4 4v14c0-2-1.6-3-4-3H5z" />
      <path d="M25 6h-8v18c0-2 1.6-3 4-3h4z" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true">
      <circle cx="11" cy="10" r="4" />
      <circle cx="21" cy="11" r="3" />
      <path d="M4 25c1-5 3-8 7-8s7 3 8 8M18 18c4 0 6 2 7 7" />
    </svg>
  );
}

function UnionIcon() {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true">
      <path d="M15 3.5l9 4.5v6.5c0 5.5-3.7 9.2-9 11-5.3-1.8-9-5.5-9-11V8z" />
      <path d="M10.5 14.5l3 3 6-6" />
    </svg>
  );
}

export default function MobileV2() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState<ServiceId>('treatment');
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);
  const [request, setRequest] = useState('Консультация стоматолога');
  const service = services[activeService];

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('m2-visible')),
      { threshold: 0.1 },
    );
    document.querySelectorAll('.mobile-v2 [data-m2-reveal]').forEach((node) => revealObserver.observe(node));

    let heroVisible = true;
    let formVisible = false;
    const syncSticky = () => setStickyVisible(!heroVisible && !formVisible);

    const heroObserver = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      syncSticky();
    }, { threshold: 0.03 });

    const formObserver = new IntersectionObserver(([entry]) => {
      formVisible = entry.isIntersecting;
      syncSticky();
    }, { threshold: 0.08 });

    if (heroRef.current) heroObserver.observe(heroRef.current);
    if (formRef.current) formObserver.observe(formRef.current);

    return () => {
      revealObserver.disconnect();
      heroObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  };

  const goToForm = (serviceId?: ServiceId) => {
    if (serviceId) { setActiveService(serviceId); setRequest(services[serviceId].title); }
    goTo('m2-contact-form');
  };

  const goToConsultation = (label: string) => { setRequest(label); goTo('m2-contact-form'); };

  return (
    <main className="mobile-v2">
      <section className="m2-hero" id="m2-top" ref={heroRef}>
        <div className="m2-topbar">
          <button className="m2-identity" type="button" onClick={() => goTo('m2-about')} aria-label="Перейти к разделу о клинике">
            <span className="m2-avatar">
              <ClinicMark />
              
            </span>
            <span className="m2-identity-copy">
              <strong>{clinic.name}</strong>
              <small>{clinic.specialty}</small>
            </span>
          </button>

          <div className="m2-top-actions">
            <button className="m2-form-icon" type="button" onClick={() => goToForm()} aria-label="Перейти к форме записи">
              <CalendarIcon />
            </button>
            <button className="m2-menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} aria-expanded={menuOpen}>
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>

        <div className="m2-hero-body">
          <p className="m2-location" data-m2-reveal>{clinic.city} · {clinic.district}</p>

          <div className="m2-proof" data-m2-reveal>
            <strong>10:00–21:00 <span>ежедневно</span></strong>
            <i />
            <strong>Для взрослых</strong>
          </div>

          <div className="m2-name-block" data-m2-reveal>
            <span className="m2-name-label">Стоматологическая клиника</span>
            <h1><span>{clinic.name}</span><em>Стоматологическая клиника</em></h1>
            <p>Лечение зубов, профессиональная гигиена и восстановление улыбки в Северном Бутове. Начните с консультации и узнайте подходящие варианты.</p>
          </div>

          <div className="m2-hero-space"><HeroVisualRotator /></div>

          <div className="m2-hero-bottom" data-m2-reveal>
            <div className="m2-specialty-line">
              <div><small>Направление</small><strong>Стоматология</strong></div>
              <i />
              <div><small>Формат</small><strong>Приём по записи</strong></div>
            </div>
            <button className="m2-button m2-primary" type="button" onClick={() => goToForm('treatment')}>{clinic.consultationCta} <span aria-hidden="true">↗</span></button>
            <button className="m2-button m2-outline m2-online-cta" type="button" onClick={() => goTo('m2-services')}>Посмотреть услуги <span>↗</span></button>
          </div>
        </div>
      </section>

      <div className={`m2-sticky${stickyVisible ? ' is-visible' : ''}`}>
        <button className="m2-identity m2-sticky-identity" type="button" onClick={() => goTo('m2-top')}>
          <span className="m2-avatar m2-avatar-small">
            <ClinicMark />
            
          </span>
          <span className="m2-identity-copy">
            <strong>{clinic.name}</strong>
            <small>{clinic.specialty}</small>
          </span>
        </button>
        <button className="m2-sticky-book" type="button" onClick={() => goToForm()}>Консультация</button>
        <button className="m2-menu-button m2-menu-sticky" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"} aria-expanded={menuOpen}>
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen && (
        <nav className="m2-menu-panel" aria-label="Навигация">
          <button type="button" onClick={() => goTo('m2-services')}><span>01</span> Услуги</button>
          <button type="button" onClick={() => goTo('m2-about')}><span>02</span> О клинике</button>
          <button type="button" onClick={() => goTo('m2-request')}><span>03</span> С чем обратиться</button>
          <button type="button" onClick={() => goTo('m2-contact-form')}><span>04</span> Бесплатная консультация</button>
        </nav>
      )}

      <section className="m2-education" id="m2-education">
        <div className="m2-photo-blend" data-m2-reveal>
          <img src={asset('/assets/dental-care.webp')} alt="Стоматологическая иллюстрация" loading="lazy" decoding="async" />
        </div>

        <div className="m2-education-cards">
          <article className="m2-info-card m2-info-wide" data-m2-reveal>
            <span className="m2-info-icon"><BookIcon /></span>
            <div>
              <small>{clinic.name} · Москва</small>
              <h2>Стоматологическая клиника для взрослых на бульваре Дмитрия Донского, 13.</h2>
            </div>
          </article>

          <div className="m2-info-grid">
            <article className="m2-info-card" data-m2-reveal>
              <span className="m2-info-icon"><PeopleIcon /></span>
              <div><strong>10:00–21:00</strong><p>работаем ежедневно</p></div>
            </article>
            <article className="m2-info-card" data-m2-reveal>
              <span className="m2-info-icon"><UnionIcon /></span>
              <div><small>Северное Бутово</small><strong>Москва</strong><p>рядом с метро</p></div>
            </article>
          </div>
        </div>
      </section>

      <section className="m2-services" id="m2-services">
        <header className="m2-services-head" data-m2-reveal>
          <div className="m2-services-title">
            <span className="m2-services-mark"><ServiceIcon type="treatment" /></span>
            <h2>Услуги</h2>
          </div>
          <p>Выберите направление, чтобы узнать, с какими вопросами можно обратиться в стоматологию.</p>
        </header>

        <div className="m2-service-tabs" data-m2-reveal>
          {(Object.keys(services) as ServiceId[]).map((id) => (
            <button key={id} className={`m2-service-tab${activeService === id ? ' is-active' : ''}`} type="button" onClick={() => setActiveService(id)} aria-pressed={activeService === id}>
              <span className="m2-service-icon"><ServiceIcon type={id} /></span>
              <small>{services[id].eyebrow}</small>
              <strong>{services[id].title}</strong>
            </button>
          ))}
        </div>

        <article className="m2-service-detail" key={activeService}>
          <span className="m2-detail-kicker">{service.eyebrow}</span>
          <h3>{service.title}</h3>
          <p className="m2-detail-summary">{service.summary}</p>

          <div className="m2-detail-content">
            <section>
              <h4>Направления работы:</h4>
              <ul>{service.gives.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section>
              <h4>Когда обратиться:</h4>
              <ul>{service.fits.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          </div>

          <div className="m2-service-meta">
            <div><small>Стоимость</small><strong><a href={clinic.phoneHref}>Уточнить по телефону</a></strong></div>
            <i />
            <div><small>Приём</small><strong>По записи</strong></div>
          </div>

          <button className="m2-button m2-primary" type="button" onClick={() => goToForm(activeService)}>{clinic.consultationCta} <span aria-hidden="true">↗</span></button>

          <div className="m2-service-photo">
            <DentalVisual art={service.art} />
          </div>
        </article>
      </section>

      <section className="m2-about" id="m2-about">
        <header className="m2-about-head" data-m2-reveal>
          <span className="m2-about-mark"><UnionIcon /></span>
          <h2>О клинике</h2>
        </header>

        <p className="m2-about-lead" data-m2-reveal>{clinic.about}</p>

        <div className="m2-achievements" data-m2-reveal>
          <div><strong>Москва</strong><span>Северное Бутово</span></div>
          <div><strong>8</strong><span>направлений</span></div>
          <div><strong>10–21</strong><span>ежедневно</span></div>
        </div>

        <div className="m2-about-photo" data-m2-reveal>
          <DentalVisual art={3} />
        </div>

        <div className="m2-request" id="m2-request" data-m2-reveal>
          <span>С чем к нам обращаться</span>
          <h3>Начните с вопроса, который беспокоит вас.</h3>
          <RequestGallery variant="mobile" onConsultation={goToConsultation} />
          <p>Откройте карточку, чтобы узнать, с чего начинается решение вашего вопроса.</p>
        </div>

        <div className="m2-contact-card" data-m2-reveal>
          <div className="m2-contact-identity">
            <span className="m2-avatar m2-contact-avatar">
              <ClinicMark />
              
            </span>
            <span><strong>{clinic.name}</strong><small>{clinic.hours}</small></span>
          </div>

          <p className="clinic-mobile-address">{clinic.fullAddress}</p>
          <a className="clinic-mobile-phone" href={clinic.phoneHref}>{clinic.phone}</a>
          <div className="m2-contact-links" aria-label="Контакты клиники">
            <a className="m2-contact-link" href={clinic.phoneHref}><i><PhoneIcon /></i><b>Позвонить</b></a>
            <a className="m2-contact-link" href={'mailto:' + clinic.email}><b>Написать</b></a>
            <a className="m2-contact-link" href={clinic.mapUrl} target="_blank" rel="noopener noreferrer"><i><PinIcon /></i><b>На карте</b></a>
          </div>
        </div>
      </section>

      <section className="m2-form-section" id="m2-contact-form" ref={formRef}>
        <div className="m2-form-head" data-m2-reveal>
          <span>Свяжитесь с клиникой</span>
          <h2>{clinic.consultationCta}</h2>
          <p>Уточните услуги и порядок записи. Оставьте контакты, чтобы клиника могла ответить на ваше обращение.</p>
        </div>
        <ConsultationForm variant="mobile" request={request} />
        <p className="clinic-medical-note">Осмотр, обследования и лечение оплачиваются по прайсу клиники. Информация на сайте не заменяет приём врача.</p>
        <p className="clinic-powered">Цифровой офис · TANEM</p>
      </section>
    </main>
  );
}
