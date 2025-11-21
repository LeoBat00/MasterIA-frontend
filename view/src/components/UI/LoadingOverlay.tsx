'use client';
type LoadingOverlayProps = {
  fullscreen?: boolean;
};

export default function LoadingOverlay({ fullscreen = true }: LoadingOverlayProps) {
  return (
    <div
      className={`${
        fullscreen ? 'fixed inset-0' : 'absolute inset-0'
      } z-[999] flex items-center justify-center bg-[linear-gradient(to_bottom_left,_rgba(14,14,21,0.92)_0%,_rgba(20,20,31,0.92)_100%)] text-white`}
      role="status"
      aria-live="polite"
      aria-label="Carregando conteúdo"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#685BFF]/40 border-t-[#685BFF]" />
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
