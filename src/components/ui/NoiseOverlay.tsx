export function NoiseOverlay() {
  return (
    <div 
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.05] mix-blend-overlay"
      style={{
        backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")',
        backgroundSize: '100px 100px',
        backgroundRepeat: 'repeat',
      }}
    />
  );
}
