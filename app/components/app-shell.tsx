"use client";

import Link from "next/link";
import localFont from "next/font/local";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, type ReactNode } from "react";

const roboto = localFont({
  src: "../fonts/Roboto.ttf",
  weight: "100 900",
  display: "swap",
});

const tabs = [
  { href: "/schedule", label: "Расписание", icon: "schedule" },
  { href: "/", label: "Мои билеты", icon: "tickets" },
  { href: "/station", label: "Станция", icon: "station" },
  { href: "/other", label: "Другое", icon: "more" },
];

export function ScreenHeader({ children }: { children: ReactNode }) {
  return (
    <header className="screen-header">
      <div className="navigation-bar">{children}</div>
    </header>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const currentTab = tabs.find((tab) => tab.href === pathname);
  const scrollPositions = useRef<Record<string, number>>({});
  const contentRef = useRef<HTMLDivElement>(null);
  const isTicket = pathname === "/ticket";

  useLayoutEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = scrollPositions.current[pathname]
        ?? (pathname === "/" ? Number(sessionStorage.getItem("ticket-list-scroll")) : 0);
    }
  }, [pathname]);

  return (
    <div className={`app-shell${pathname === "/other" ? ` app-shell-other ${roboto.className}` : pathname === "/" ? ` app-shell-tickets ${roboto.className}` : isTicket ? ` ${roboto.className}` : ""}`}>
      {!isTicket && <ScreenHeader><h1>{currentTab?.label ?? "Мои билеты"}</h1></ScreenHeader>}
      <div
        className={`page-content${isTicket ? " page-content-ticket" : ""}`}
        role={isTicket ? undefined : "main"}
        ref={contentRef}
        onScroll={(event) => {
          const scrollTop = event.currentTarget.scrollTop;
          scrollPositions.current[pathname] = scrollTop;
          if (pathname === "/") sessionStorage.setItem("ticket-list-scroll", String(scrollTop));
        }}
      >{children}</div>
      {!isTicket && <nav className="tab-bar" aria-label="Основная навигация">
        {tabs.map((tab) => (
          <Link key={tab.href} href={tab.href} className="tab" aria-current={pathname === tab.href ? "page" : undefined}>
            <span className={`tab-icon tab-icon-${tab.icon}`} style={{ maskImage: `url(/images/nav-${tab.icon}.png)` }} aria-hidden="true" />
            <span>{tab.label}</span>
          </Link>
        ))}
      </nav>}
    </div>
  );
}
