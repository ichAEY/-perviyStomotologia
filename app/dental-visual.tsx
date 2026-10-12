import { asset, type DentalArt } from './clinic-data';

export function DentalVisual({ art = 0, className = '' }: { art?: DentalArt; className?: string }) {
  return <div className={'dental-art dental-art-' + art + ' ' + className} aria-hidden="true"><img src={asset('/assets/dental-directions.webp')} alt="" loading="lazy" decoding="async" /></div>;
}

export function ClinicMark() { return <span className="clinic-mark" aria-hidden="true">М</span>; }
