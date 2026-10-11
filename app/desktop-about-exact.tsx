const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const asset = (path: string) => `${basePath}${path}`;

function ShieldIcon() {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <path d="M22 4 35 10v9c0 9-5.6 15.6-13 20-7.4-4.4-13-11-13-20v-9L22 4Z" />
      <path d="m16 21 4 4 8-9" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 44 44" aria-hidden="true">
      <path d="M7 10h12c3.5 0 5 2.2 5 5v20c0-3-2.5-4.5-5.5-4.5H7V10Z" />
      <path d="M37 10H25v25c0-3 2.5-4.5 5.5-4.5H37V10Z" />
    </svg>
  );
}

export default function DesktopAboutExact() {
  return (
    <section className="desktop-about-exact" id="d2-about" aria-label="О Дмитрии Рихальском">
      <div className="da-card">
        <div className="da-left">
          <div className="da-heading">
            <span className="da-heading-icon"><ShieldIcon /></span>
            <h2>Обо мне</h2>
          </div>

          <p className="da-copy">
            В работе Дмитрий соединяет оценку движения,<br className="da-wide-break" />
            понимание нагрузки и последовательную физическую<br className="da-wide-break" />
            реабилитацию. Цель — не набор случайных<br className="da-wide-break" />
            упражнений, а понятный план: что ограничивает<br className="da-wide-break" />
            движение сейчас и как безопасно двигаться дальше.
          </p>

          <div className="da-stats" aria-label="Опыт и профессиональное сообщество">
            <article><strong>13</strong><span>лет практики</span></article>
            <article><strong>1000+</strong><span>клиентов</span></article>
            <article><strong>СРР</strong><span>проф. сообщество</span></article>
          </div>

          <article className="da-education">
            <span className="da-education-icon"><BookIcon /></span>
            <div>
              <small>Образование</small>
              <p>Высшее образование —<br />профессиональная база для<br />системной работы с восстановлением<br />движения.</p>
            </div>
          </article>
        </div>

        <div className="da-photo-wrap">
          <img src={asset('/dimaosebe.webp')} alt="Дмитрий Рихальский" />
        </div>
      </div>
    </section>
  );
}
