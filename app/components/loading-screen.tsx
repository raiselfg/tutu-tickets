export function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-label="Загрузка">
      <span className="loading-spinner" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span key={index} style={{ transform: `rotate(${index * 30}deg)`, animationDelay: `${index / 12 - 1}s` }} />
        ))}
      </span>
    </div>
  );
}
