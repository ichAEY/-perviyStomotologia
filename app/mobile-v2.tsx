'use client';

import { useEffect, useRef, useState } from 'react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const asset = (path: string) => `${basePath}${path}`;

type ServiceId = 'offline' | 'online';

const services = {
  offline: {
    tab: 'Лечение зубов',
    eyebrow: 'Здоровье зубов',
    title: 'Лечение зубов',
    summary: 'Начинаем с осмотра и диагностики, чтобы разобраться в причине жалоб и обсудить возможные варианты лечения.',
    gives: [
      'Осмотр и обсуждение того, что вас беспокоит.',
      'Объяснение возможных вариантов лечения после диагностики.',
      'Понятный план следующих шагов и ответы на вопросы.',
    ],
    fits: [
      'Зубная боль или повышенная чувствительность.',
      'Кариес и другие проблемы, требующие оценки стоматолога.',
      'Плановый осмотр и необходимость второго мнения.',
    ],
    price: 'Уточняется',
    duration: 'Индивидуально',
    image: '/dimavhalate.webp',
  },
  online: {
    tab: 'Эстетика улыбки',
    eyebrow: 'Внешний вид зубов',
    title: 'Эстетика улыбки',
    summary: 'Обсудите, что хотели бы изменить в улыбке. Подходящие методы определяются после осмотра и оценки состояния зубов.',
    gives: [
      'Обсуждение ваших пожеланий и ожиданий.',
      'Оценка состояния зубов и возможных ограничений.',
      'Подбор дальнейших шагов и разъяснение вариантов.',
    ],
    fits: [
      'Вопросы о цвете или форме зубов.',
      'Сколы, заметные дефекты и другие эстетические запросы.',
      'Желание узнать о возможностях восстановления улыбки.',
    ],
    price: 'Уточняется',
    duration: 'Индивидуально',
    image: '/dimaonline.webp',
  },
} as const;

const visitReasons = [
  {
    number: '01',
    title: 'Болит зуб',
    text: 'Боль, чувствительность или дискомфорт при жевании — повод для осмотра. Стоматолог выяснит причину и объяснит, какое лечение может потребоваться.',
  },
  {
    number: '02',
    title: 'Хочется красивую улыбку',
    text: 'Если беспокоят цвет, форма зубов или сколы, можно обсудить эстетические варианты. Решение подбирается с учётом состояния зубов и ваших пожеланий.',
  },
  {
    number: '03',
    title: 'Не хватает зуба',
    text: 'Врач оценит состояние полости рта и расскажет о возможных способах восстановления. Подходящий вариант определяется после диагностики.',
  },
  {
    number: '04',
    title: 'Нужна профилактика',
    text: 'Плановый осмотр помогает вовремя заметить проблемы, а консультация по гигиене — понять, как правильно ухаживать за зубами дома.',
  },
] as const;

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
  if (type === 'online') {
    return (
      <svg viewBox="0 0 42 42" aria-hidden="true">
        <path d="M21 5c-4-3-13-1-13 7 0 4 3 7 4 13 1 7 4 12 7 2l2-6 2 6c3 10 6 5 7-2 1-6 4-9 4-13 0-8-9-10-13-7Z" />
        <path d="M34 4v8M30 8h8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 42 42" aria-hidden="true">
      <path d="M21 5c-4-3-13-1-13 7 0 4 3 7 4 13 1 7 4 12 7 2l2-6 2 6c3 10 6 5 7-2 1-6 4-9 4-13 0-8-9-10-13-7Z" />
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
          <button className="m2-identity" type="button" onClick={() => goTo('m2-about')} aria-label="Перейти к разделу о клинике">
            <span className="m2-avatar">
              <img src={asset('/dmitriyaglav.webp')} alt="Временное изображение для сайта клиники" />
              <i className="m2-online-dot" />
            </span>
            <span className="m2-identity-copy">
              <strong>Стоматологическая клиника</strong>
              <small>Диагностика и лечение зубов</small>
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
          <p className="m2-location" data-m2-reveal><span>●</span> Приём по предварительной записи</p>

          <div className="m2-proof" data-m2-reveal>
            <strong>Здоровье <span>зубов</span></strong>
            <i />
            <strong>Эстетика <span>улыбки</span></strong>
          </div>

          <div className="m2-name-block" data-m2-reveal>
            <span className="m2-name-label">Стоматологическая клиника</span>
            <h1><span>Стоматология</span><em>для вашей улыбки</em></h1>
            <p>Лечение и здоровье зубов начинаются с внимательного осмотра. Понятно объясняем возможности стоматологии и каждый следующий шаг.</p>
          </div>

          <div className="m2-hero-space" />

          <div className="m2-hero-bottom" data-m2-reveal>
            <div className="m2-specialty-line">
              <div><small>Направление</small><strong>Стоматология</strong></div>
              <i />
              <div><small>Формат</small><strong>Приём по записи</strong></div>
            </div>
            <button className="m2-button m2-primary" type="button" onClick={() => goToForm('offline')}>Записаться на приём <span>↗</span></button>
            <button className="m2-button m2-outline m2-online-cta" type="button" onClick={() => goTo('m2-services')}>Посмотреть услуги <span>↗</span></button>
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
            <strong>Стоматологическая клиника</strong>
            <small>Диагностика и лечение зубов</small>
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
          <button type="button" onClick={() => goTo('m2-about')}><span>02</span> О клинике</button>
          <button type="button" onClick={() => goTo('m2-contact-form')}><span>03</span> Форма обращения</button>
        </nav>
      )}

      <section className="m2-education" id="m2-education">
        <div className="m2-photo-blend" data-m2-reveal>
          <img src={asset('/dimadima.PNG')} alt="Временное изображение для стоматологического шаблона" />
        </div>

        <div className="m2-education-cards">
          <article className="m2-info-card m2-info-wide" data-m2-reveal>
            <span className="m2-info-icon"><BookIcon /></span>
            <div>
              <small>Первый визит</small>
              <h2>Осмотр и понятные объяснения — основа осознанного выбора стоматологического лечения.</h2>
            </div>
          </article>

          <div className="m2-info-grid">
            <article className="m2-info-card" data-m2-reveal>
              <span className="m2-info-icon"><PeopleIcon /></span>
              <div><strong>Осмотр</strong><p>знакомство с ситуацией и вопросами пациента</p></div>
            </article>
            <article className="m2-info-card" data-m2-reveal>
              <span className="m2-info-icon"><UnionIcon /></span>
              <div><small className="m2-nowrap">После осмотра</small><strong>План</strong><p>разбор вариантов и дальнейших шагов</p></div>
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
          <p>Выберите направление, чтобы узнать, с какими вопросами можно обратиться в стоматологию.</p>
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
              <h4>Что обсудим:</h4>
              <ul>{service.gives.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section>
              <h4>Когда обратиться:</h4>
              <ul>{service.fits.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          </div>

          <div className="m2-service-meta">
            <div><small>Стоимость</small><strong>{service.price}</strong></div>
            <i />
            <div><small>План приёма</small><strong>{service.duration}</strong></div>
          </div>

          <button className="m2-button m2-primary" type="button" onClick={() => goToForm(activeService)}>Записаться на приём <span>↗</span></button>

          <div className="m2-service-photo">
            <img src={asset(service.image)} alt={`Временное изображение для раздела «${service.title}»`} />
          </div>
        </article>
      </section>

      <section className="m2-about" id="m2-about">
        <header className="m2-about-head" data-m2-reveal>
          <span className="m2-about-mark"><UnionIcon /></span>
          <h2>О клинике</h2>
        </header>

        <p className="m2-about-lead" data-m2-reveal>Стоматология — это не только лечение зубов, но и понятный путь от первого вопроса до выбора подходящего решения. Осмотр помогает определить состояние зубов, обсудить варианты и спланировать дальнейшие действия.</p>

        <div className="m2-achievements" data-m2-reveal>
          <div><strong>01</strong><span>Осмотр</span></div>
          <div><strong>02</strong><span>Обсуждение</span></div>
          <div><strong>03</strong><span>План</span></div>
        </div>

        <div className="m2-about-photo" data-m2-reveal>
          <img src={asset('/dimaosebe.webp')} alt="Временное изображение для раздела о клинике" />
        </div>

        <div className="m2-request" data-m2-reveal ref={requestRef}>
          <span>С чем к нам обращаются</span>
          <h3>Начните с вопроса, который беспокоит именно вас.</h3>
          <div className="m2-request-scroll" aria-label="Популярные обращения">
            {visitReasons.map((reason) => <b key={reason.number}>{reason.title}</b>)}
          </div>
          <div className="m2-request-explanations">
            {visitReasons.map((reason) => (
              <article className="m2-request-explanation" key={reason.number}>
                <div className="m2-request-explanation-head">
                  <span>{reason.number}</span>
                  <h4>{reason.title}</h4>
                </div>
                <p>{reason.text}</p>
              </article>
            ))}
          </div>
          <p>Необязательно знать название процедуры заранее. На консультации можно описать свой запрос, а врач определит необходимые обследования и варианты дальнейших действий.</p>
        </div>

        <div className="m2-contact-card" data-m2-reveal>
          <div className="m2-contact-identity">
            <span className="m2-avatar m2-contact-avatar">
              <img src={asset('/dmitriyaglav.webp')} alt="Стоматологическая клиника" />
              <i className="m2-online-dot" />
            </span>
            <span><strong>Стоматологическая клиника</strong><small>Контакты для записи появятся здесь</small></span>
          </div>

          <div className="m2-contact-links" aria-label="Контакты стоматологической клиники">
            <span className="m2-contact-link m2-contact-telegram"><i><PhoneIcon /></i><b>Телефон</b></span>
            <span className="m2-contact-link"><i className="m2-i-mark">i</i><b>Уточняется</b></span>
            <span className="m2-contact-link"><i><PinIcon /></i><b>Адрес уточняется</b></span>
          </div>
        </div>
      </section>

      <section className="m2-form-section" id="m2-contact-form">
        <div className="m2-form-head" data-m2-reveal>
          <span>Форма обращения</span>
          <h2>Оставьте заявку</h2>
          <p>Укажите контакты для записи. Администратор сможет связаться с вами после подключения формы к клинике.</p>
        </div>

        <form className="m2-form" data-m2-reveal onSubmit={(event) => event.preventDefault()}>
          <input type="hidden" name="department" value="Стоматология" readOnly />
          <input type="hidden" name="source" value="dentistry-mobile-demo" readOnly />
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
            <textarea name="comment" rows={4} placeholder="При желании укажите удобное время для звонка" />
          </label>
          <button type="submit">Оставить заявку <span>↗</span></button>
          <p className="m2-form-demo-note">Демонстрационная форма: отправка заявок пока не подключена.</p>
        </form>
      </section>
    </main>
  );
}
