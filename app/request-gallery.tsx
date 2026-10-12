'use client';

import { useRef, useState } from 'react';
import { clinic, visitReasons } from './clinic-data';
import { DentalVisual } from './dental-visual';

export default function RequestGallery({ variant, onConsultation }: { variant: 'mobile' | 'desktop'; onConsultation: (request: string) => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const reason = selected === null ? null : visitReasons[selected];

  const open = (index: number) => {
    setSelected(index);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  return <div className={'clinic-request-gallery clinic-request-' + variant}>
    <div className="clinic-reason-list" role="list" aria-label="С чем можно обратиться в стоматологию">
      {visitReasons.map((item, index) => <article className="clinic-reason-card" key={item.id} role="listitem">
        <DentalVisual art={item.art} className="clinic-reason-image" />
        <div className="clinic-reason-copy"><span className="clinic-reason-number">{'0' + (index + 1)}</span><h4>{item.title}</h4><p>{item.short}</p>
          <button type="button" onClick={() => open(index)} aria-haspopup="dialog" aria-label={'Подробнее: ' + item.title}>Как можем помочь <span aria-hidden="true">↗</span></button>
        </div>
      </article>)}
    </div>
    <dialog className="clinic-reason-dialog" ref={dialog} onClick={(event) => { if (event.target === event.currentTarget) close(); }} aria-label={reason?.title ?? 'Подробнее об обращении'}>
      <button className="clinic-dialog-close" type="button" onClick={close} autoFocus aria-label="Закрыть подробности">×</button>
      {reason && <><DentalVisual art={reason.art} className="clinic-dialog-image" /><div className="clinic-dialog-copy"><small>С чем мы можем помочь</small><h3>{reason.title}</h3><p>{reason.text}</p>
        <h4>С чего начнём</h4><ol>{reason.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <div className="clinic-dialog-tags">{reason.services.map((service) => <span key={service}>{service}</span>)}</div>
        <p className="clinic-dialog-note">Объём лечения, сроки и стоимость определяются после осмотра.</p>
        <button className="clinic-dialog-cta" type="button" onClick={() => { close(); onConsultation(reason.title); }}>{clinic.consultationCta}<span aria-hidden="true">↗</span></button>
      </div></>}
    </dialog>
  </div>;
}
