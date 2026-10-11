const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const asset = (path: string) => `${basePath}${path}`;

function ArrowIcon() {
  return <span className="dx-arrow" aria-hidden="true">↗</span>;
}

export default function DesktopHeroExact() {
  return (
    <section className="desktop-hero-exact" aria-label="Главный экран Дмитрия Рихальского">
      <div className="dx-card">
        <header className="dx-topbar">
          <a className="dx-identity" href="#dx-top" aria-label="Наверх">
            <span className="dx-avatar">
              <img src={asset('/dmitriyaglav.webp')} alt="Дмитрий Рихальский" />
              <i className="dx-online-dot" aria-hidden="true" />
            </span>
            <span className="dx-identity-copy">
              <strong>Рихальский Дмитрий</strong>
              <small>Специалист по физической<br />реабилитации</small>
            </span>
          </a>

          <nav className="dx-nav" aria-label="Навигация по сайту">
            <a href="#d2-services">Услуги</a>
            <a href="#d2-about">Обо мне</a>
            <a href="#d2-form">Контакты</a>
          </nav>

          <div className="dx-top-actions">
            <a className="dx-top-cta dx-top-cta-primary" href="#d2-form">
              <span>Записаться на приём</span><ArrowIcon />
            </a>
            <a className="dx-top-cta dx-top-cta-secondary" href="#d2-form">
              <span>Онлайн-консультация</span><ArrowIcon />
            </a>
          </div>
        </header>

        <div className="dx-main" id="dx-top">
          <div className="dx-room" aria-hidden="true" />
          <img className="dx-hero-photo" src={asset('/dimadima.PNG')} alt="Дмитрий Рихальский" />
          <div className="dx-photo-fade" aria-hidden="true" />

          <div className="dx-copy">
            <div className="dx-stats" aria-label="Опыт Дмитрия Рихальского">
              <div><strong>13 лет</strong><span>практики</span></div>
              <i aria-hidden="true" />
              <div><strong>1000+</strong><span>клиентов</span></div>
            </div>

            <span className="dx-label">Физическая реабилитация</span>

            <h1>
              <span>Рихальский Дмитрий</span>
              <em>Александрович</em>
            </h1>

            <p className="dx-lead">
              Специалист по физической реабилитации. Работает с<br className="dx-wide-break" /> болью и ограничениями движения, восстановлением<br className="dx-wide-break" /> после травм и безопасным возвращением к привычной<br className="dx-wide-break" /> нагрузке.
            </p>

            <div className="dx-actions">
              <a className="dx-btn dx-btn-primary" href="#d2-form">
                <span>Записаться на приём</span><ArrowIcon />
              </a>
              <a className="dx-btn dx-btn-secondary" href="#d2-form">
                <span>Онлайн-консультация</span><ArrowIcon />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
