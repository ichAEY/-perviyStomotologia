'use client';

import { useState } from 'react';

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
    tab: 'Онлайн-консультация',
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

const requestItems = [
  ['01', 'Боль в спине, суставах и мышцах', 'Когда боль или скованность мешают обычному движению и нагрузке.'],
  ['02', 'Восстановление после травмы', 'Когда нужно последовательно вернуть подвижность, силу и уверенность.'],
  ['03', 'Ограничение подвижности', 'Когда отдельные движения стали недоступными или вызывают дискомфорт.'],
  ['04', 'Возвращение к спорту и нагрузке', 'Когда важно вернуться к активности без резкого увеличения нагрузки.'],
] as const;

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

export default function DesktopPerfect() {
  const [activeService, setActiveService] = useState<ServiceId>('offline');
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
              <img src={asset('/dmitriyaglav.webp')} alt="Дмитрий Рихальский" />
              <i />
            </span>
            <span>
              <strong>Рихальский Дмитрий</strong>
              <small>Специалист по физической реабилитации</small>
            </span>
          </button>

          <nav className="dp-nav" aria-label="Навигация по сайту">
            <button type="button" onClick={() => goTo('dp-services')}>Услуги</button>
            <button type="button" onClick={() => goTo('dp-about')}>Обо мне</button>
            <button type="button" onClick={() => goTo('dp-request')}>С чем обратиться</button>
            <button type="button" onClick={() => goTo('dp-contact')}>Контакты</button>
          </nav>

          <button className="dp-header-cta" type="button" onClick={() => goToForm('offline')}>
            Записаться на приём <Arrow />
          </button>
        </div>
      </header>

      <section className="dp-hero" id="dp-top">
        <div className="dp-shell dp-hero-grid">
          <div className="dp-hero-copy">
            <div className="dp-location"><span /> Севастополь · очно и онлайн</div>
            <div className="dp-proof">
              <div><strong>13 лет</strong><span>практики</span></div>
              <i />
              <div><strong>1000+</strong><span>клиентов</span></div>
            </div>
            <span className="dp-kicker">Физическая реабилитация</span>
            <h1>Вернуться к движению<br /><em>без лишней сложности.</em></h1>
            <p className="dp-hero-lead">Дмитрий Рихальский — специалист по физической реабилитации. Работает с болью и ограничениями движения, восстановлением после травм и безопасным возвращением к привычной нагрузке.</p>

            <div className="dp-hero-actions">
              <button className="dp-button dp-button-primary" type="button" onClick={() => goToForm('offline')}>Записаться на приём <Arrow /></button>
              <button className="dp-button dp-button-secondary" type="button" onClick={() => goToForm('online')}>Онлайн-консультация <Arrow /></button>
            </div>

            <div className="dp-specialty">
              <div><small>Специальность</small><strong>Физическая реабилитация</strong></div>
              <div><small>Категория</small><strong>Частная практика</strong></div>
            </div>
          </div>

          <div className="dp-hero-photo-card">
            <img src={asset('/dimadima.PNG')} alt="Дмитрий Рихальский" />
            <div className="dp-photo-caption">
              <span><b>Дмитрий Рихальский</b><small>Физическая реабилитация</small></span>
              <span className="dp-photo-status"><i /> Приём по записи</span>
            </div>
          </div>
        </div>
      </section>

      <section className="dp-credentials">
        <div className="dp-shell dp-credentials-grid">
          <article className="dp-credential-main">
            <span className="dp-icon-box"><BookIcon /></span>
            <div>
              <small>Образование</small>
              <h2>Высшее образование — профессиональная база для системной работы с восстановлением движения.</h2>
            </div>
          </article>

          <article className="dp-credential-stat">
            <small>Профессиональный блог</small>
            <strong>1600+</strong>
            <p>аудитория профессионального блога</p>
          </article>

          <article className="dp-credential-stat">
            <small>Проф. сообщество</small>
            <strong>СРР</strong>
            <p>член Союза реабилитологов России</p>
          </article>
        </div>
      </section>

      <section className="dp-services" id="dp-services">
        <div className="dp-shell">
          <div className="dp-section-heading">
            <div><span className="dp-section-number">01</span><h2>Услуги</h2></div>
            <p>Два формата работы. В обоих случаях задача одна: разобраться в ситуации и определить понятный следующий шаг.</p>
          </div>

          <div className="dp-service-layout">
            <div className="dp-service-tabs" role="tablist" aria-label="Формат консультации">
              {(Object.keys(services) as ServiceId[]).map((id) => (
                <button key={id} type="button" className={activeService === id ? 'is-active' : ''} onClick={() => setActiveService(id)}>
                  <span>{id === 'offline' ? '01' : '02'}</span>
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
                    <h4>Что даёт консультация</h4>
                    <ul>{service.gives.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                  <div>
                    <h4>Кому подходит</h4>
                    <ul>{service.fits.map((item) => <li key={item}>{item}</li>)}</ul>
                  </div>
                </div>

                <div className="dp-service-footer">
                  <div className="dp-service-meta">
                    <span><small>Стоимость</small><strong>{service.price}</strong></span>
                    <span><small>Длительность</small><strong>{service.duration}</strong></span>
                  </div>
                  <button className="dp-button dp-button-primary" type="button" onClick={() => goToForm(activeService)}>Записаться <Arrow /></button>
                </div>
              </div>

              <div className="dp-service-photo">
                <img src={asset(service.image)} alt={`${service.title} — Дмитрий Рихальский`} />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="dp-about" id="dp-about">
        <div className="dp-shell dp-about-grid">
          <div className="dp-about-photo">
            <img src={asset('/dimaosebe.webp')} alt="Дмитрий Рихальский" />
          </div>

          <div className="dp-about-copy">
            <div className="dp-about-title">
              <span className="dp-icon-box"><ShieldIcon /></span>
              <span><small>02</small><h2>Обо мне</h2></span>
            </div>
            <p>В работе Дмитрий соединяет оценку движения, понимание нагрузки и последовательную физическую реабилитацию. Цель — не набор случайных упражнений, а понятный план: что ограничивает движение сейчас и как безопасно двигаться дальше.</p>

            <div className="dp-about-facts">
              <article><strong>13</strong><span>лет практики</span></article>
              <article><strong>1000+</strong><span>клиентов</span></article>
              <article><strong>СРР</strong><span>проф. сообщество</span></article>
            </div>

            <div className="dp-about-principle">
              <small>Принцип работы</small>
              <strong>Сначала понять причину ограничения, затем выстроить последовательный путь восстановления.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="dp-request" id="dp-request">
        <div className="dp-shell">
          <div className="dp-section-heading dp-request-heading">
            <div><span className="dp-section-number">03</span><h2>С чем обратиться</h2></div>
            <p>Когда движение стало болезненным, ограниченным или непредсказуемым.</p>
          </div>

          <div className="dp-request-grid">
            {requestItems.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>

          <div className="dp-request-bottom">
            <p>На консультации вы разберёте текущую ситуацию и получите пошаговый план дальнейших действий: что делать сейчас, какую нагрузку использовать и как оценивать прогресс.</p>
            <button className="dp-button dp-button-primary" type="button" onClick={() => goToForm('offline')}>Разобрать мой случай <Arrow /></button>
          </div>
        </div>
      </section>

      <section className="dp-contact" id="dp-contact">
        <div className="dp-shell dp-contact-grid">
          <div className="dp-contact-copy">
            <span className="dp-contact-number">04 · Контакты</span>
            <h2>Оставьте заявку</h2>
            <p>Оставьте контакты и коротко опишите ситуацию. С вами свяжутся, чтобы уточнить формат консультации.</p>

            <div className="dp-contact-person">
              <span className="dp-avatar dp-avatar-large">
                <img src={asset('/dmitriyaglav.webp')} alt="Дмитрий Рихальский" />
                <i />
              </span>
              <span><strong>Рихальский Дмитрий</strong><small>Специалист по физической реабилитации</small></span>
            </div>

            <div className="dp-contact-links">
              <span><i><TelegramIcon /></i><b>Telegram</b><em>@dm_rihalsky</em></span>
              <span><i><PinIcon /></i><b>Севастополь</b><em>очный приём по записи</em></span>
            </div>
          </div>

          <form className="dp-form" data-tanem-form="dmitriy-rihalsky" onSubmit={(event) => event.preventDefault()}>
            <input type="hidden" name="specialist" value="Дмитрий Рихальский" readOnly />
            <input type="hidden" name="source" value="dm-rihalsky-site" readOnly />
            <input type="hidden" name="service" value={activeService} readOnly />

            <div className="dp-form-top">
              <span>Форма обращения</span>
              <b>{activeService === 'offline' ? 'Очный приём' : 'Онлайн'}</b>
            </div>
            <label><span>ФИО</span><input name="fullName" type="text" autoComplete="name" placeholder="Иван Иванов" required /></label>
            <label><span>Телефон</span><input name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="+7 999 000-00-00" required /></label>
            <label><span>Комментарий <small>необязательно</small></span><textarea name="comment" rows={5} placeholder="Коротко опишите, с чем хотите обратиться" /></label>
            <button type="submit">Оставить заявку <Arrow /></button>
          </form>
        </div>
      </section>
    </main>
  );
}
