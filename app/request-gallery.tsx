'use client';

import { useRef, useState } from 'react';
import { clinic, visitReasons } from './clinic-data';
import { DentalVisual } from './dental-visual';

export default function RequestGallery({ variant, onConsultation }: { variant: 'mobile' | 'desktop'; onConsultation: (request: string) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [position, setPosition] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const reason = selected === null ? null : visitReasons[selected];
  const open = (index: number) => { setSelected(index); dialog.current?.showModal(); };
  const close = () => dialog.current?.close();
  const step = () => {
    const cards = list.current?.children;
    return cards && cards.length > 1 ? (cards[1] as HTMLElement).offsetLeft - (cards[0] as HTMLElement).offsetLeft : 0;
  };
  const move = (direction: number) => {
    const next = Math.max(0, Math.min(visitReasons.length - 1, position + direction));
    list.current?.scrollTo({ left: next * step(), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return <div className={'clinic-request-gallery clinic-request-' + variant}>
    <div className="clinic-reason-list" role="list" aria-label="С чем можно обратиться в стоматологию" ref={list} onScroll={() => { const width = step(); if (width && list.current) setPosition(Math.min(visitReasons.length - 1, Math.max(0, Math.round(list.current.scrollLeft / width)))); }}>
      {visitReasons.map((item, index) => <article className="clinic-reason-card" key={item.id} role="listitem">
        <DentalVisual art={item.art} className="clinic-reason-image" />
        <div className="clinic-reason-copy">
          <span className="clinic-reason-number">{'0' + (index + 1)}</span>
          <h3>{item.title}</h3><p>{item.short}</p>
          <button className="clinic-reason-open" type="button" onClick={() => open(index)} aria-haspopup="dialog" aria-label={'Подробнее: ' + item.title}>Подробнее <span aria-hidden="true">↗</span></button>
        </div>
      </article>)}
    </div>
    <div className="clinic-gallery-controls">
      <span aria-live="polite" aria-label={'Обращение ' + (position + 1) + ' из ' + visitReasons.length}>{String(position + 1).padStart(2, '0')} <span aria-hidden="true">/ 04</span></span>
      <div><button type="button" onClick={() => move(-1)} disabled={position === 0} aria-label="Предыдущее обращение">←</button><button type="button" onClick={() => move(1)} disabled={position === visitReasons.length - 1} aria-label="Следующее обращение">→</button></div>
    </div>
    <dialog className="clinic-reason-dialog" ref={dialog} onClick={(event) => { if (event.target === event.currentTarget) close(); }} aria-label={reason?.title ?? 'Подробнее об обращении'}>
      <button className="clinic-dialog-close" type="button" onClick={close} autoFocus aria-label="Закрыть подробности">×</button>
      {reason && <div className="clinic-dialog-copy">
        <div className="clinic-dialog-heading"><div><small>С чем можем помочь</small><h3>{reason.title}</h3></div><DentalVisual art={reason.art} className="clinic-dialog-image" /></div>
        <p>{reason.text}</p>
        <h4>С чего начнём</h4><ol>{reason.steps.map((item) => <li key={item}>{item}</li>)}</ol>
        <div className="clinic-dialog-tags">{reason.services.map((item) => <span key={item}>{item}</span>)}</div>
        <p className="clinic-dialog-note">Сроки и стоимость лечения определяются после осмотра.</p>
        <button className="clinic-dialog-cta" type="button" onClick={() => { close(); onConsultation(reason.title); }}>{clinic.consultationCta}<span aria-hidden="true">↗</span></button>
      </div>}
    </dialog>
  </div>;
}
