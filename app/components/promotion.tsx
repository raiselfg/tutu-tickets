"use client";

import { useEffect, useState } from "react";

export function Promotion({ spacedPrice = false }: { spacedPrice?: boolean }) {
  const [showCashback, setShowCashback] = useState<boolean | null>(null);

  useEffect(() => {
    const selected = Math.random() < 0.5;
    setShowCashback((current) => current ?? selected);
  }, []);

  if (showCashback === null) {
    return <div className="promotion" aria-hidden="true" />;
  }

  if (showCashback) {
    return (
      <aside>
        <img
          className="promotion-screenshot"
          src="/images/cashback-promotion.png"
          width="1093"
          height="403"
          alt="Используйте кешбэк 30% в приложении Туту"
        />
      </aside>
    );
  }

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
