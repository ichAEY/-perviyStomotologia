import { asset, type DentalArt } from './clinic-data';

export function DentalVisual({ art = 0, className = '' }: { art?: DentalArt; className?: string }) {
  return <div className={'dental-art dental-art-' + art + ' ' + className}>
    <img src={asset('/assets/dental-directions.webp')} alt="Стоматологическая иллюстрация" loading="lazy" decoding="async" />
  </div>;
}

export function ClinicMark() {
  return <span className="clinic-mark" aria-hidden="true">М</span>;
}

export function ToothIcon({ shine = false }: { shine?: boolean }) {
  return <svg viewBox="0 0 42 42" aria-hidden="true">
    <path d="M21 5c-4-3-13-1-13 7 0 4 3 7 4 13 1 7 4 12 7 2l2-6 2 6c3 10 6 5 7-2 1-6 4-9 4-13 0-8-9-10-13-7Z" />
    {shine && <path d="M34 4v8M30 8h8" />}
  </svg>;
}
