'use client';

export const FOCUS_CHAT_EVENT = 'cm:focus-chat';

// Baja hasta el chat y, cuando termina el scroll, pone el foco (o manda la pregunta si trae `prompt`).
export default function FocusChatLink({ className, prompt, children }: { className?: string; prompt?: string; children: React.ReactNode }) {
  return (
    <a
      href="#demo"
      className={className}
      onClick={() => setTimeout(() => window.dispatchEvent(new CustomEvent(FOCUS_CHAT_EVENT, { detail: prompt })), 600)}
    >
      {children}
    </a>
  );
}
