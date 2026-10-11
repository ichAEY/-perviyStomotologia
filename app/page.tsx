'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const asset = (path: string) => `${basePath}${path}`;

const helpItems = [
  {
    title: 'Спина, суставы, мышцы',
    text: 'Если боль, скованность или неприятные ощущения мешают нормально двигаться и нагружаться.',
    tone: 'back',
  },
  {
    title: 'После травмы',
    text: 'Если нужно постепенно вернуть движение, силу и уверенность после травмы или периода ограничений.',
    tone: 'trauma',
  },
  {
    title: 'Осанка и дисбалансы',
    text: 'Если тело двигается неравномерно и отдельные зоны постоянно перегружаются.',
    tone: 'posture',
  },
  {
    title: 'Возвращение к нагрузке',
    text: 'Если хочется снова тренироваться, ходить, бегать и двигаться без страха повторной боли.',
    tone: 'load',
  },
];

const consultationSteps = [
  ['01', 'Разберу вашу ситуацию', 'Сначала я уточню, что беспокоит, как давно это длится и в каких движениях появляется боль или ограничение.'],
  ['02', 'Оценю движение', 'Посмотрю подвижность, контроль и реакцию тела на доступные движения и привычную для вас нагрузку.'],
  ['03', 'Соберу план восстановления', 'Определю приоритеты и дам понятный следующий шаг: что делать сейчас и как постепенно возвращать нагрузку.'],
];

const mobileServices = [
  {
    id: 'offline',
    title: 'Очный приём',
    eyebrow: 'Севастополь',
    summary: 'Разбор состояния и движения в очном формате с персональным планом дальнейшей работы.',
    result: 'Помогает определить, какие движения сейчас ограничены, что провоцирует дискомфорт и с чего безопасно начинать восстановление.',
    fit: 'Подходит при боли и скованности, после травм, при ограничении подвижности и перед возвращением к тренировкам.',
    price: '5 000 ₽',
    duration: '60 минут',
    image: '/dimavhalate.webp',
  },
  {
    id: 'online',
    title: 'Онлайн-консультация',
    eyebrow: 'Дистанционно',
    summary: 'Видеоразбор ситуации, движения и нагрузки, когда личный визит не нужен или невозможен.',
    result: 'Позволяет структурировать проблему, проверить доступные движения и получить понятную последовательность действий.',
    fit: 'Подходит для первичного разбора, контроля прогресса, коррекции нагрузки и консультации из другого города.',
    price: '5 000 ₽',
    duration: '60 минут',
    image: '/dimaonline.webp',
  },
] as const;

function ServiceIcon({ type }: { type: 'offline' | 'online' }) {
  if (type === 'online') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="8" y="11" width="32" height="24" rx="5" />
        <path d="M17 40h14M24 35v5" />
        <path d="M19 20h10M19 25h7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="14" r="6" />
      <path d="M15 38c1-9 4-15 9-15s8 6 9 15" />
      <path d="M13 29h7M28 29h7" />
    </svg>
  );
}

function MarkIcon({ kind }: { kind: 'book' | 'people' | 'union' | 'about' }) {
  if (kind === 'book') {
    return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 7h8c3 0 4 2 4 4v14c0-2-2-3-4-3H6z" /><path d="M26 7h-8v18c0-2 2-3 4-3h4z" /></svg>;
  }
  if (kind === 'people') {
    return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="12" cy="12" r="4" /><circle cx="22" cy="13" r="3" /><path d="M5 25c1-5 3-8 7-8s7 3 8 8M19 19c4 0 6 2 7 6" /></svg>;
  }
  if (kind === 'union') {
    return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4l10 5v7c0 6-4 10-10 12C10 26 6 22 6 16V9z" /><path d="M11 16l3 3 7-7" /></svg>;
  }
  return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="11" /><path d="M16 10v7l5 3" /></svg>;
}

export default function Home() {
  return (
    <>
      <DesktopSite />
      <MobileSite />
    </>
  );
}

function DesktopSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const consultationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.14 },
    );
    document.querySelectorAll('.desktop-version [data-reveal]').forEach((node) => revealObserver.observe(node));

    let heroVisible = true;
    let consultationVisible = false;
    const syncSticky = () => setStickyVisible(!heroVisible && !consultationVisible);

    const heroObserver = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      syncSticky();
    }, { threshold: 0.05 });

    const consultationObserver = new IntersectionObserver(([entry]) => {
      consultationVisible = entry.isIntersecting;
      syncSticky();
    }, { threshold: 0.08 });

    if (heroRef.current) heroObserver.observe(heroRef.current);
    if (consultationRef.current) consultationObserver.observe(consultationRef.current);

    return () => {
      revealObserver.disconnect();
      heroObserver.disconnect();
      consultationObserver.disconnect();
    };
  }, []);

  return (
    <main className="site desktop-version">
      <header className="hero" id="desktop-top" ref={heroRef}>
        <div className="topbar shell">
          <a className="brand" href="#desktop-top">Дмитрий Рихальский</a>
          <nav className="desktop-nav" aria-label="Навигация">
            <a href="#desktop-about">Обо мне</a>
            <a href="#desktop-help">С чем помогаю</a>
            <a href="#desktop-consultation">Консультация</a>
          </nav>
          <button
            className={`menu-button${menuOpen ? ' is-open' : ''}`}
            type="button"
            aria-label="Меню"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <i /><i />
          </button>
          {menuOpen && (
            <nav className="mobile-menu" aria-label="Мобильное меню">
              <a href="#desktop-about" onClick={() => setMenuOpen(false)}>Обо мне</a>
              <a href="#desktop-help" onClick={() => setMenuOpen(false)}>С чем помогаю</a>
              <a href="#desktop-consultation" onClick={() => setMenuOpen(false)}>Консультация</a>
            </nav>
          )}
        </div>

        <div className="hero-inner shell">
          <div className="hero-copy">
            <p className="eyebrow">Физическая реабилитация · Севастополь и онлайн</p>
            <h1>Вернуть свободу<br /><span>движения</span></h1>
            <p className="hero-lead">Помогаю понять, что ограничивает движение, уменьшить влияние боли на повседневную активность и выстроить персональный план восстановления.</p>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="spine-glow" />
            <div className="spine-ring spine-ring-a" />
            <div className="spine-ring spine-ring-b" />
            <span className="spine-dot spine-dot-a" />
            <span className="spine-dot spine-dot-b" />
            <div className="motion-core"><i /><i /><i /></div>
          </div>

          <div className="hero-bottom">
            <div className="hero-action-row">
              <a className="hero-consult-link" href="#desktop-consultation">
                <span>Как проходит консультация</span><i>↓</i>
              </a>
              <a className="primary-cta" href="#desktop-consultation">Разобрать мой случай <span>↘</span></a>
            </div>

            <div className="hero-facts" aria-label="Параметры консультации">
              <div><strong>60 минут</strong><span>консультация</span></div>
              <div><strong>5 000 ₽</strong><span>стоимость</span></div>
              <div><strong>Очно / онлайн</strong><span>Севастополь · дистанционно</span></div>
            </div>
          </div>
        </div>
      </header>

      <section className="about section" id="desktop-about">
        <div className="shell">
          <div className="section-frame about-frame reveal" data-reveal>
            <div className="about-photo">
              <img src={asset('/dmitry-ai.jpg')} alt="Дмитрий Рихальский" />
            </div>
            <div className="about-copy">
              <p className="section-kicker">Обо мне</p>
              <h2>Дмитрий Рихальский</h2>
              <p>Я занимаюсь физической реабилитацией больше 13 лет. Работаю с болью в спине, суставах и мышцах, восстановлением после травм, двигательными дисбалансами и возвращением к привычной нагрузке.</p>
              <p>Мне важно не просто дать упражнения. Сначала я разбираюсь, что именно ограничивает движение у конкретного человека, а затем выстраиваю понятный путь восстановления.</p>

              <div className="credentials" aria-label="Опыт и квалификация">
                <div className="credential credential-number">
                  <strong>13+</strong>
                  <span>лет практики</span>
                </div>
                <div className="credential credential-number">
                  <strong>1000+</strong>
                  <span>клиентов</span>
                </div>
                <div className="credential credential-text">
                  <small>Образование</small>
                  <strong>Высшее</strong>
                  <span>профессиональная база для работы с восстановлением</span>
                </div>
                <div className="credential credential-text">
                  <small>Профессиональное сообщество</small>
                  <strong>СРР</strong>
                  <span>член Союза реабилитологов России</span>
                </div>
              </div>

              <div className="profile-badge">
                <span className="profile-dot" />
                <span><small>Профиль Дмитрия</small><strong>@dm_rihalsky</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="help section" id="desktop-help">
        <div className="shell">
          <div className="section-heading reveal" data-reveal>
            <div>
              <p className="section-kicker">С чем я помогаю</p>
              <h2>Четыре частых запроса</h2>
            </div>
            <p>Если узнаёте свою ситуацию — можно начать с одной консультации и понять, какой следующий шаг нужен именно вам.</p>
          </div>

          <div className="help-grid">
            {helpItems.map((item, index) => (
              <article
                className="help-card reveal"
                data-reveal
                key={item.title}
                style={{ '--delay': `${index * 70}ms` } as CSSProperties}
              >
                <div className={`help-visual ${item.tone}`} aria-hidden="true">
                  <span className="joint joint-a" />
                  <span className="joint joint-b" />
                  <i />
                </div>
                <div className="help-card-copy">
                  <span className="card-number">0{index + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="consultation" id="desktop-consultation" ref={consultationRef}>
        <div className="consultation-shell shell reveal" data-reveal>
          <div className="consultation-head-card">
            <div>
              <p className="section-kicker">Консультация</p>
              <h2>За 60 минут — от вопроса к понятному плану.</h2>
            </div>
            <p>Я не обещаю универсальное «лечение за один сеанс». Моя задача — разобраться в вашей ситуации и показать, как безопасно двигаться дальше.</p>
          </div>

          <div className="consultation-flow">
            <div className="consultation-steps">
              {consultationSteps.map(([number, title, text]) => (
                <article className="consult-step" key={number}>
                  <span className="step-number">{number}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>

            <aside className="consultation-result">
              <p className="result-label">После консультации</p>
              <h3>У вас будет понятная точка старта.</h3>
              <p>Что сейчас важно, какие движения можно использовать и в какой последовательности возвращать нагрузку.</p>
              <div className="result-meta">
                <div><small>Формат</small><strong>Очно / онлайн</strong></div>
                <div><small>Длительность</small><strong>60 минут</strong></div>
                <div><small>Стоимость</small><strong>5 000 ₽</strong></div>
              </div>
              <a className="consultation-cta" href="#desktop-consultation">Разобрать мой случай <span>↘</span></a>
              <span className="consultation-handle">@dm_rihalsky</span>
            </aside>
          </div>
        </div>
      </section>

      <a className={`sticky-cta${stickyVisible ? ' is-visible' : ''}`} href="#desktop-consultation">
        <span className="sticky-pulse" />
        <span className="sticky-copy"><small>Консультация · 60 минут</small><strong>Разобрать мой случай</strong></span>
        <i>↘</i>
      </a>
    </main>
  );
}

function MobileSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState<(typeof mobileServices)[number]['id']>('offline');
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const service = mobileServices.find((item) => item.id === activeService) ?? mobileServices[0];

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('m-is-visible')),
      { threshold: 0.12 },
    );
    document.querySelectorAll('.mobile-redesign [data-m-reveal]').forEach((node) => revealObserver.observe(node));

    const heroObserver = new IntersectionObserver(([entry]) => {
      setStickyVisible(!entry.isIntersecting);
    }, { threshold: 0.02 });

    if (heroRef.current) heroObserver.observe(heroRef.current);

    return () => {
      revealObserver.disconnect();
      heroObserver.disconnect();
    };
  }, []);

  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="mobile-redesign">
      <section className="m-hero" id="m-top" ref={heroRef}>
        <div className="m-topbar">
          <button className="m-identity" type="button" onClick={() => goTo('m-about')} aria-label="Перейти к информации о Дмитрии">
            <span className="m-avatar-wrap">
              <img src={asset('/dmitriyaglav.webp')} alt="Дмитрий Рихальский" />
              <i className="m-online-dot" aria-label="Специалист на связи" />
            </span>
            <span className="m-identity-copy">
              <strong>Рихальский Дмитрий</strong>
              <small>Специалист по физической реабилитации</small>
            </span>
          </button>

          <div className="m-top-actions">
            <button className="m-form-button" type="button" onClick={() => goTo('m-contact')}>
              <span>Заполнить форму</span><strong>обращения</strong>
            </button>
            <button className={`m-menu-button${menuOpen ? ' is-open' : ''}`} type="button" aria-label="Открыть меню" onClick={() => setMenuOpen((value) => !value)}>
              <i /><i />
            </button>
          </div>
        </div>

        <div className="m-hero-body">
          <p className="m-location" data-m-reveal><span>●</span> Севастополь · очный приём по предварительной записи</p>
          <p className="m-proof" data-m-reveal><strong>13 лет практики</strong><i />Более 1000 клиентов</p>

          <div className="m-name-block" data-m-reveal>
            <span className="m-name-label">Физическая реабилитация</span>
            <h1>Рихальский Дмитрий<br /><em>Александрович</em></h1>
            <p>Специалист по физической реабилитации. Работает с болью и ограничениями движения, восстановлением после травм и безопасным возвращением к привычной нагрузке.</p>
          </div>

          <div className="m-hero-spacer" />

          <div className="m-hero-bottom" data-m-reveal>
            <div className="m-specialty-row">
              <div><span>Специальность</span><strong>Физическая реабилитация</strong></div>
              <div><span>Категория</span><strong>Частная практика</strong></div>
            </div>
            <button className="m-button m-button-primary" type="button" onClick={() => goTo('m-services')}>Записаться на приём <span>↘</span></button>
            <button className="m-button m-button-outline" type="button" onClick={() => { setActiveService('online'); goTo('m-services'); }}>Онлайн-консультация <span>↗</span></button>
          </div>
        </div>
      </section>

      <div className={`m-sticky-header${stickyVisible ? ' is-visible' : ''}`}>
        <button className="m-sticky-identity" type="button" onClick={() => goTo('m-top')}>
          <span className="m-avatar-wrap small">
            <img src={asset('/dmitriyaglav.webp')} alt="" />
            <i className="m-online-dot" />
          </span>
          <span><strong>Рихальский Дмитрий</strong><small>Физическая реабилитация</small></span>
        </button>
        <button className="m-sticky-book" type="button" onClick={() => goTo('m-services')}>Запись</button>
        <button className={`m-menu-button sticky${menuOpen ? ' is-open' : ''}`} type="button" aria-label="Открыть меню" onClick={() => setMenuOpen((value) => !value)}><i /><i /></button>
      </div>

      {menuOpen && (
        <div className="m-menu-panel" role="dialog" aria-label="Навигация">
          <button type="button" onClick={() => goTo('m-services')}><span>01</span> Услуги</button>
          <button type="button" onClick={() => goTo('m-about')}><span>02</span> Обо мне</button>
          <button type="button" onClick={() => goTo('m-contact')}><span>03</span> Связаться</button>
        </div>
      )}

      <section className="m-education" id="m-education">
        <div className="m-photo-fade" data-m-reveal>
          <img src={asset('/dmitriy.webp')} alt="Дмитрий Рихальский" />
        </div>

        <div className="m-education-content">
          <article className="m-info-card m-info-wide" data-m-reveal>
            <span className="m-card-icon"><MarkIcon kind="book" /></span>
            <div><small>Образование</small><h2>Высшее образование — профессиональная база для системной работы с восстановлением движения.</h2></div>
          </article>

          <div className="m-info-grid">
            <article className="m-info-card" data-m-reveal>
              <span className="m-card-icon"><MarkIcon kind="people" /></span>
              <div><strong>1600+</strong><p>человек в аудитории профессионального блога</p></div>
            </article>
            <article className="m-info-card" data-m-reveal>
              <span className="m-card-icon"><MarkIcon kind="union" /></span>
              <div><small>Профессиональное сообщество</small><strong>СРР</strong><p>член Союза реабилитологов России</p></div>
            </article>
          </div>
        </div>
      </section>

      <section className="m-services" id="m-services">
        <div className="m-section-head center" data-m-reveal>
          <span>Форматы работы</span>
          <h2>Услуги</h2>
          <p>Выберите формат консультации. В обоих случаях задача одна: разобраться в ситуации и определить понятный следующий шаг.</p>
        </div>

        <div className="m-service-switch" data-m-reveal>
          {mobileServices.map((item) => (
            <button
              key={item.id}
              className={`m-service-tab${activeService === item.id ? ' is-active' : ''}`}
              type="button"
              onClick={() => setActiveService(item.id)}
              aria-pressed={activeService === item.id}
            >
              <span className="m-service-icon"><ServiceIcon type={item.id} /></span>
              <small>{item.eyebrow}</small>
              <strong>{item.title}</strong>
            </button>
          ))}
        </div>

        <article className="m-service-detail" key={service.id}>
          <span className="m-detail-kicker">{service.eyebrow}</span>
          <h3>{service.title}</h3>
          <p className="m-detail-summary">{service.summary}</p>

          <div className="m-detail-text">
            <div><span>Что даёт</span><p>{service.result}</p></div>
            <div><span>Кому подходит</span><p>{service.fit}</p></div>
          </div>

          <div className="m-service-meta">
            <div><span>Стоимость</span><strong>{service.price}</strong></div>
            <div><span>Длительность</span><strong>{service.duration}</strong></div>
          </div>

          <button className="m-button m-button-primary" type="button" onClick={() => goTo('m-contact')}>Записаться на приём <span>↘</span></button>

          <div className="m-service-photo">
            <img src={asset(service.image)} alt={`${service.title} с Дмитрием Рихальским`} />
          </div>
        </article>
      </section>

      <section className="m-about" id="m-about">
        <div className="m-about-head" data-m-reveal>
          <span className="m-about-icon"><MarkIcon kind="about" /></span>
          <div><small>Специалист</small><h2>Обо мне</h2></div>
        </div>

        <p className="m-about-lead" data-m-reveal>В работе Дмитрий соединяет оценку движения, понимание нагрузки и последовательную физическую реабилитацию. Цель — не набор случайных упражнений, а понятный план: что ограничивает движение сейчас и как безопасно двигаться дальше.</p>

        <div className="m-achievements" data-m-reveal>
          <div><strong>13</strong><span>лет практики</span></div>
          <div><strong>1000+</strong><span>клиентов</span></div>
          <div><strong>СРР</strong><span>проф. сообщество</span></div>
        </div>

        <div className="m-about-photo" data-m-reveal>
          <img src={asset('/dimaosebe.webp')} alt="Дмитрий Рихальский — специалист по физической реабилитации" />
        </div>

        <div className="m-request" data-m-reveal>
          <span className="m-request-kicker">С чем обратиться</span>
          <h3>Когда движение стало болезненным, ограниченным или непредсказуемым.</h3>
          <div className="m-request-list">
            <span>Боль в спине, суставах и мышцах</span>
            <span>Восстановление после травмы</span>
            <span>Ограничение подвижности</span>
            <span>Возвращение к спорту и нагрузке</span>
          </div>
          <p>На консультации вы разберёте текущую ситуацию и получите пошаговый план дальнейших действий: что делать сейчас, какую нагрузку использовать и как оценивать прогресс.</p>
        </div>

        <div className="m-contact-card" id="m-contact" data-m-reveal>
          <div className="m-contact-identity">
            <span className="m-avatar-wrap contact">
              <img src={asset('/dmitriyaglav.webp')} alt="Дмитрий Рихальский" />
              <i className="m-online-dot" />
            </span>
            <span><strong>Рихальский Дмитрий</strong><small>Специалист по физической реабилитации</small></span>
          </div>

          <div className="m-contact-row">
            <div className="m-contact-methods" aria-label="Способы связи">
              <span className="m-contact-circle">TG</span>
              <span className="m-contact-handle">@dm_rihalsky</span>
            </div>
            <button className="m-contact-book" type="button" onClick={() => goTo('m-services')}>Записаться <span>↗</span></button>
          </div>

          <div className="m-tanem-badge">TANEM.RU</div>
        </div>
      </section>
    </main>
  );
}
