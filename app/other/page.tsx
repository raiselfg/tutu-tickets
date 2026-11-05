import Link from "next/link";
import { Promotion } from "../components/promotion";

export default function Other() {
  return (
    <div className="other-page">
      <div className="other-promotion"><Promotion spacedPrice /></div>

      <section className="other-profile" aria-label="Профиль">
        <div>
          <p className="other-profile-label">Профиль</p>
          <p className="other-email">idima6335@gmail.com</p>
        </div>
        <span>Выйти</span>
      </section>

      <div className="other-menu">
        {["Кошелёк", "Видимость элементов", "Уведомления"].map((label) => (
          <div className="other-menu-row" key={label}>
            <span>{label}</span>
            <svg viewBox="0 0 12 22" aria-hidden="true"><path d="m2 2 9 9-9 9" /></svg>
          </div>
        ))}
        <Link href="/create-ticket" className="other-menu-row">
          <span>Помощь</span>
          <svg viewBox="0 0 12 22" aria-hidden="true"><path d="m2 2 9 9-9 9" /></svg>
        </Link>
        <div className="other-contact">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="12" fill="#45476b" />
            <path d="M6 7.5h12M6 12h12M6 16.5h10" fill="none" stroke="#c3c3ff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>Связаться с разработчиками</span>
        </div>
      </div>

      <footer className="other-legal">
        <p>Политика в отношении обработки персональных данных</p>
        <p>Правовая информация</p>
        <p className="other-version">© 2026, ООО «Глобус Медиа» · Версия 5.23.0</p>
      </footer>
    </div>
  );
}
