'use client';

import { useEffect, useState } from 'react';
import { MOTION_KEY, motionOn } from '@/lib/motion';

// Interruptor Motion on/off. Recarga al cambiar: las animaciones de entrada se arman una sola vez al cargar.
export default function MotionToggle() {
  const [on, setOn] = useState<boolean | null>(null);
  useEffect(() => setOn(motionOn()), []);

  const toggle = () => {
    try {
      localStorage.setItem(MOTION_KEY, on ? 'off' : 'on');
    } catch {}
    location.reload();
  };

  return (
    <button type="button" className="motion-toggle" role="switch" aria-checked={!!on} aria-label="Animaciones" onClick={toggle}>
      <span className="motion-toggle__track" aria-hidden="true">
        <span className="motion-toggle__thumb" />
      </span>
      <span className="only-wide">Motion {on ? 'on' : 'off'}</span>
    </button>
  );
}
