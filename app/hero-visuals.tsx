'use client';

import { useEffect, useRef, useState } from 'react';
import { DentalVisual } from './dental-visual';
import type { DentalArt } from './clinic-data';

const visuals: DentalArt[] = [0, 1, 2, 3];

export default function HeroVisualRotator() {
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const firstGroup = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const drag = useRef({ pointer: -1, x: 0, y: 0, offset: 0, horizontal: false });
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = stage.current;
    const ribbon = track.current;
    const group = firstGroup.current;
    if (!element || !ribbon || !group) return;
    let width = 0;
    let frame = 0;
    let inView = false;
    let last = 0;
    const mobile = window.matchMedia('(max-width: 767px)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const paint = () => { ribbon.style.transform = 'translate3d(' + offset.current + 'px,0,0)'; };
    const measure = () => {
      const next = group.getBoundingClientRect().width;
      if (!next) return;
      if (!width) offset.current = -next;
      width = next;
      paint();
    };
    const animate = (now: number) => {
      const delta = Math.min(50, now - last);
      last = now;
      if (drag.current.pointer < 0 && width) {
        offset.current -= 14 * delta / 1000;
        while (offset.current <= -2 * width) offset.current += width;
        while (offset.current > -width) offset.current -= width;
        paint();
      }
      frame = window.requestAnimationFrame(animate);
    };
    const sync = () => {
      window.cancelAnimationFrame(frame);
      if (mobile.matches && inView && !paused && !reducedMotion.matches && !document.hidden && width) {
        last = performance.now();
        frame = window.requestAnimationFrame(animate);
      }
    };
    const resize = new ResizeObserver(() => { measure(); sync(); });
    resize.observe(element);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; measure(); sync(); });
    observer.observe(element);
    mobile.addEventListener('change', sync);
    reducedMotion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      window.cancelAnimationFrame(frame);
      resize.disconnect(); observer.disconnect();
      mobile.removeEventListener('change', sync);
      reducedMotion.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [paused]);

  return <div className="m2-dental-visuals">
    <div className="m2-dental-ribbon" ref={stage} aria-label="Стоматологические иллюстрации"
      onPointerDown={(event) => { drag.current = { pointer: event.pointerId, x: event.clientX, y: event.clientY, offset: offset.current, horizontal: false }; }}
      onPointerMove={(event) => {
        const current = drag.current;
        if (current.pointer !== event.pointerId) return;
        const dx = event.clientX - current.x;
        const dy = event.clientY - current.y;
        if (!current.horizontal && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { current.horizontal = true; event.currentTarget.setPointerCapture(event.pointerId); }
        if (!current.horizontal) return;
        event.preventDefault();
        offset.current = current.offset + dx;
        if (track.current) track.current.style.transform = 'translate3d(' + offset.current + 'px,0,0)';
      }}
      onPointerUp={() => { drag.current.pointer = -1; }}
      onPointerCancel={() => { drag.current.pointer = -1; }}>
      <div className="m2-dental-track" ref={track} aria-hidden="true">
        {[0, 1, 2].map((group) => <div className="m2-dental-group" key={group} ref={group === 0 ? firstGroup : undefined}>
          {visuals.map((art) => <div className="m2-dental-tile" key={art}><DentalVisual art={art} /></div>)}
        </div>)}
      </div>
    </div>
    <button type="button" className="m2-ribbon-toggle" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? 'Продолжить анимацию' : 'Приостановить анимацию'}>{paused ? <span aria-hidden="true">▷</span> : <span className="m2-pause-icon" aria-hidden="true"><i /><i /></span>}</button>
  </div>;
}
