export function Promotion({ spacedPrice = false }: { spacedPrice?: boolean }) {
  return (
    <aside className="promotion" aria-label="Предложение Альфа-Карты">
      <div className="promotion-copy">
        <p className="promotion-title">{spacedPrice ? "+1000 ₽" : "+1000₽"}<br />на электрички</p>
        <p className="promotion-description">Кешбэк за первую покупку<br />по Альфа-Карте</p>
        <span className="promotion-action">Заказать карту</span>
      </div>
      <img src="/images/train-promotion.webp" width="547" height="442" alt="Альфа-Карта: +1000 рублей на электрички" />
    </aside>
  );
}
