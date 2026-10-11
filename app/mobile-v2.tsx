'use client';

import { useEffect, useRef, useState } from 'react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const asset = (path: string) => `${basePath}${path}`;

type ServiceId = 'offline' | 'online';

const services = {
  offline: {
    tab: 'Очный приём',
    eyebrow: 'Севастополь',
    title: 'Очный приём',
    summary: 'Очная оценка состояния и движения с разбором ограничений и персональным планом дальнейшей работы.',
    gives: [
      'Определить движения и нагрузки, которые сейчас провоцируют дискомфорт.',
      'Понять, какие ограничения действительно требуют внимания в первую очередь.',
      'Получить понятный план восстановления и возвращения к привычной активности.',
    ],
    fits: [
      'Боль и скованность в спине, суставах или мышцах.',
      'Восстановление после травм и периода ограниченной активности.',
      'Возвращение к тренировкам, спорту и повседневной нагрузке.',
    ],
    price: '5 000 ₽',
    duration: '60 минут',
    image: '/dimavhalate.webp',
  },
  online: {
    tab: 'Онлайн',
    eyebrow: 'Дистанционно',
    title: 'Онлайн-консультация',
    summary: 'Видеоразбор ситуации и движения, когда личный визит не нужен или вы находитесь в другом городе.',
    gives: [
      'Структурировать проблему и понять, с чего начинать работу.',
      'Разобрать доступные движения и текущую нагрузку в домашних условиях.',
      'Получить последовательный план действий и критерии оценки прогресса.',
    ],
    fits: [
      'Первичный разбор ситуации из любого города.',
      'Контроль прогресса и корректировка текущей нагрузки.',
      'Ситуации, когда очный приём неудобен или временно невозможен.',
    ],
    price: '5 000 ₽',
    duration: '60 минут',
    image: '/dimaonline.webp',
  },
} as const;

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

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 4.5 3.8 11.1c-.9.4-.8 1.1.2 1.4l4.2 1.3 1.6 5c.2.7.7.8 1.2.3l2.3-2.1 4.2 3.1c.7.5 1.3.2 1.5-.7L22 5.7c.2-1-.4-1.6-1.5-1.2Z" />
      <path d="m8.2 13.8 9.5-6.1-7.9 7.1" />
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
  if (type === 'online') {
    return (
      <svg viewBox="0 0 42 42" aria-hidden="true">
        <rect x="7" y="8" width="28" height="21" rx="4" />
        <path d="M14 35h14M21 29v6M14 16h14M14 21h9" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 42 42" aria-hidden="true">
      <circle cx="21" cy="11" r="5" />
      <path d="M13 34c1-9 3.5-15 8-15s7 6 8 15M10 26h8M24 26h8" />
    </svg>
  );
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
  const [activeService, setActiveService] = useState<ServiceId>('offline');
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const requestRef = useRef<HTMLDivElement>(null);
  const service = services[activeService];

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('m2-visible')),
      { threshold: 0.1 },
    );
    document.querySelectorAll('.mobile-v2 [data-m2-reveal]').forEach((node) => revealObserver.observe(node));

    let heroVisible = true;
    let requestVisible = false;
    const syncSticky = () => setStickyVisible(!heroVisible && !requestVisible);

    const heroObserver = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      syncSticky();
    }, { threshold: 0.03 });

    const requestObserver = new IntersectionObserver(([entry]) => {
      requestVisible = entry.isIntersecting;
      syncSticky();
    }, { threshold: 0.08 });

    if (heroRef.current) heroObserver.observe(heroRef.current);
    if (requestRef.current) requestObserver.observe(requestRef.current);

    return () => {
      revealObserver.disconnect();
      heroObserver.disconnect();
      requestObserver.disconnect();
    };
  }, []);

  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goToForm = (serviceId?: ServiceId) => {
    if (serviceId) setActiveService(serviceId);
    goTo('m2-contact-form');
  };

  return (
    <main className="mobile-v2">
      <section className="m2-hero" id="m2-top" ref={heroRef}>
        <div className="m2-topbar">
          <button className="m2-identity" type="button" onClick={() => goTo('m2-about')} aria-label="Перейти к разделу о Дмитрии">
            <span className="m2-avatar">
              <img src={asset('/dmitriyaglav.webp')} alt="Дмитрий Рихальский" />
              <i className="m2-online-dot" />
            </span>
            <span className="m2-identity-copy">
              <strong>Рихальский Дмитрий</strong>
              <small>Специалист по физической реабилитации</small>
            </span>
          </button>

          <div className="m2-top-actions">
            <button className="m2-form-icon" type="button" onClick={() => goToForm()} aria-label="Перейти к форме записи">
              <CalendarIcon />
            </button>
            <button className="m2-menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Открыть меню">
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>

        <div className="m2-hero-body">
          <p className="m2-location" data-m2-reveal><span>●</span> Севастополь · очный приём по предварительной записи</p>

          <div className="m2-proof" data-m2-reveal>
            <strong>13 лет <span>практики</span></strong>
            <i />
            <strong>1000+ <span>клиентов</span></strong>
          </div>

          <div className="m2-name-block" data-m2-reveal>
            <span className="m2-name-label">Физическая реабилитация</span>
            <h1><span>Рихальский Дмитрий</span><em>Александрович</em></h1>
            <p>Специалист по физической реабилитации. Работает с болью и ограничениями движения, восстановлением после травм и безопасным возвращением к привычной нагрузке.</p>
          </div>

          <div className="m2-hero-space" />

          <div className="m2-hero-bottom" data-m2-reveal>
            <div className="m2-specialty-line">
              <div><small>Специальность</small><strong>Физическая реабилитация</strong></div>
              <i />
              <div><small>Категория</small><strong>Частная практика</strong></div>
            </div>
            <button className="m2-button m2-primary" type="button" onClick={() => goToForm('offline')}>Записаться на приём <span>↗</span></button>
            <button className="m2-button m2-outline m2-online-cta" type="button" onClick={() => goToForm('online')}>Онлайн-консультация <span>↗</span></button>
          </div>
        </div>
      </section>

      <div className={`m2-sticky${stickyVisible ? ' is-visible' : ''}`}>
        <button className="m2-identity m2-sticky-identity" type="button" onClick={() => goTo('m2-top')}>
          <span className="m2-avatar m2-avatar-small">
            <img src={asset('/dmitriyaglav.webp')} alt="" />
            <i className="m2-online-dot" />
          </span>
          <span className="m2-identity-copy">
            <strong>Рихальский Дмитрий</strong>
            <small>Специалист по физической реабилитации</small>
          </span>
        </button>
        <button className="m2-sticky-book" type="button" onClick={() => goToForm()}>Запись</button>
        <button className="m2-menu-button m2-menu-sticky" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Открыть меню">
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {menuOpen && (
        <nav className="m2-menu-panel" aria-label="Навигация">
          <button type="button" onClick={() => goTo('m2-services')}><span>01</span> Услуги</button>
          <button type="button" onClick={() => goTo('m2-about')}><span>02</span> Обо мне</button>
          <button type="button" onClick={() => goTo('m2-contact-form')}><span>03</span> Форма обращения</button>
        </nav>
      )}

      <section className="m2-education" id="m2-education">
        <div className="m2-photo-blend" data-m2-reveal>
          <img src={asset('/dimadima.PNG')} alt="Дмитрий Рихальский" />
        </div>

        <div className="m2-education-cards">
          <article className="m2-info-card m2-info-wide" data-m2-reveal>
            <span className="m2-info-icon"><BookIcon /></span>
            <div>
              <small>Образование</small>
              <h2>Высшее образование — профессиональная база для системной работы с восстановлением движения.</h2>
            </div>
          </article>

          <div className="m2-info-grid">
            <article className="m2-info-card" data-m2-reveal>
              <span className="m2-info-icon"><PeopleIcon /></span>
              <div><strong>1600+</strong><p>аудитория профессионального блога</p></div>
            </article>
            <article className="m2-info-card" data-m2-reveal>
              <span className="m2-info-icon"><UnionIcon /></span>
              <div><small className="m2-nowrap">Проф. сообщество</small><strong>СРР</strong><p>член Союза реабилитологов России</p></div>
            </article>
          </div>
        </div>
      </section>

      <section className="m2-services" id="m2-services">
        <header className="m2-services-head" data-m2-reveal>
          <div className="m2-services-title">
            <span className="m2-services-mark"><ServiceIcon type="offline" /></span>
            <h2>Услуги</h2>
          </div>
          <p>Выберите формат консультации. В обоих случаях задача одна: разобраться в ситуации и определить понятный следующий шаг.</p>
        </header>

        <div className="m2-service-tabs" data-m2-reveal>
          {(Object.keys(services) as ServiceId[]).map((id) => (
            <button key={id} className={`m2-service-tab${activeService === id ? ' is-active' : ''}`} type="button" onClick={() => setActiveService(id)}>
              <span className="m2-service-icon"><ServiceIcon type={id} /></span>
              <small>{services[id].eyebrow}</small>
              <strong>{services[id].tab}</strong>
            </button>
          ))}
        </div>

        <article className="m2-service-detail" key={activeService}>
          <span className="m2-detail-kicker">{service.eyebrow}</span>
          <h3>{service.title}</h3>
          <p className="m2-detail-summary">{service.summary}</p>

          <div className="m2-detail-content">
            <section>
              <h4>Что даёт:</h4>
              <ul>{service.gives.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section>
              <h4>Кому подходит:</h4>
              <ul>{service.fits.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          </div>

          <div className="m2-service-meta">
            <div><small>Стоимость</small><strong>{service.price}</strong></div>
            <i />
            <div><small>Длительность</small><strong>{service.duration}</strong></div>
          </div>

          <button className="m2-button m2-primary" type="button" onClick={() => goToForm(activeService)}>Записаться на приём <span>↗</span></button>

          <div className="m2-service-photo">
            <img src={asset(service.image)} alt={`${service.title} с Дмитрием Рихальским`} />
          </div>
        </article>
      </section>

      <section className="m2-about" id="m2-about">
        <header className="m2-about-head" data-m2-reveal>
          <span className="m2-about-mark"><UnionIcon /></span>
          <h2>Обо мне</h2>
        </header>

        <p className="m2-about-lead" data-m2-reveal>В работе Дмитрий соединяет оценку движения, понимание нагрузки и последовательную физическую реабилитацию. Цель — не набор случайных упражнений, а понятный план: что ограничивает движение сейчас и как безопасно двигаться дальше.</p>

        <div className="m2-achievements" data-m2-reveal>
          <div><strong>13</strong><span>лет практики</span></div>
          <div><strong>1000+</strong><span>клиентов</span></div>
          <div><strong>СРР</strong><span>проф. сообщество</span></div>
        </div>

        <div className="m2-about-photo" data-m2-reveal>
          <img src={asset('/dimaosebe.webp')} alt="Дмитрий Рихальский — физическая реабилитация" />
        </div>

        <div className="m2-request" data-m2-reveal ref={requestRef}>
          <span>С чем обратиться</span>
          <h3>Когда движение стало болезненным, ограниченным или непредсказуемым.</h3>
          <div className="m2-request-scroll" aria-label="Частые запросы">
            <b>Боль в спине, суставах и мышцах</b>
            <b>Восстановление после травмы</b>
            <b>Ограничение подвижности</b>
            <b>Возвращение к спорту и нагрузке</b>
          </div>
          <p>На консультации вы разберёте текущую ситуацию и получите пошаговый план дальнейших действий: что делать сейчас, какую нагрузку использовать и как оценивать прогресс.</p>
        </div>

        <div className="m2-contact-card" data-m2-reveal>
          <div className="m2-contact-identity">
            <span className="m2-avatar m2-contact-avatar">
              <img src={asset('/dmitriyaglav.webp')} alt="Дмитрий Рихальский" />
              <i className="m2-online-dot" />
            </span>
            <span><strong>Рихальский Дмитрий</strong><small>Специалист по физической реабилитации</small></span>
          </div>

          <div className="m2-contact-links" aria-label="Контакты Дмитрия">
            <span className="m2-contact-link m2-contact-telegram"><i><TelegramIcon /></i><b>Telegram</b></span>
            <span className="m2-contact-link"><i className="m2-i-mark">i</i><b>@dm_rihalsky</b></span>
            <span className="m2-contact-link"><i><PinIcon /></i><b>Севастополь</b></span>
          </div>
        </div>
      </section>

      <section className="m2-form-section" id="m2-contact-form">
        <div className="m2-form-head" data-m2-reveal>
          <span>Форма обращения</span>
          <h2>Оставьте заявку</h2>
          <p>Оставьте заявку и мы свяжемся с вами в ближайшее время, чтобы проконсультировать.</p>
        </div>

        <form className="m2-form" data-m2-reveal data-tanem-form="dmitriy-rihalsky" onSubmit={(event) => event.preventDefault()}>
          <input type="hidden" name="specialist" value="Дмитрий Рихальский" readOnly />
          <input type="hidden" name="source" value="dm-rihalsky-site" readOnly />
          <input type="hidden" name="service" value={activeService} readOnly />

          <label>
            <span>ФИО</span>
            <input name="fullName" type="text" autoComplete="name" placeholder="Иван Иванов" required />
          </label>
          <label>
            <span>Телефон</span>
            <input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+7 999 000-00-00" required />
          </label>
          <label>
            <span>Комментарий <small>необязательно</small></span>
            <textarea name="comment" rows={4} placeholder="Коротко опишите, с чем хотите обратиться" />
          </label>
          <button type="submit">Оставить заявку <span>↗</span></button>
        </form>
      </section>
    </main>
  );
}
