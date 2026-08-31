import Link from "next/link";
import { BarChart3, Landmark, Map, Settings2, Target } from "lucide-react";
import type { ReactNode } from "react";

type ActiveNav = "today" | "journey" | "progress" | "settings";

type AppShellProps = {
  children: ReactNode;
  aside: ReactNode;
  activeNav?: ActiveNav;
};

const navigation = [
  { href: "/", label: "Hari ini", value: "today" as const, icon: Target },
  { href: "/journey", label: "Journey", value: "journey" as const, icon: Map },
  {
    href: "/progress",
    label: "Progress",
    value: "progress" as const,
    icon: BarChart3,
  },
];

export function AppShell({
  children,
  aside,
  activeNav = "today",
}: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link href="/" className="brand-lockup" aria-label="MEXT Journey home">
          <span className="brand-mark" aria-hidden="true">
            <Landmark size={19} strokeWidth={1.8} />
          </span>
          <span>
            <span className="brand-name">MEXT Journey</span>
            <span className="brand-subtitle">Dio&apos;s 15-minute practice</span>
          </span>
        </Link>

        <nav className="app-nav" aria-label="Navigasi utama">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.value === activeNav;

            return (
              <Link
                key={item.value}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "app-nav__link app-nav__link--active"
                    : "app-nav__link"
                }
              >
                <Icon size={17} strokeWidth={1.9} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Link
          href="/settings/security"
          className={
            activeNav === "settings"
              ? "profile-control profile-control--active"
              : "profile-control"
          }
          aria-label="Pengaturan akun Dio"
        >
          <span className="profile-avatar" aria-hidden="true">
            D
          </span>
          <span className="hidden text-sm font-semibold sm:inline">Dio</span>
          <Settings2 size={16} strokeWidth={1.8} aria-hidden="true" />
        </Link>
      </header>

      <main className="app-main">
        <div className="content-column">{children}</div>
        <aside className="aside-column" aria-label="Journey summary">
          {aside}
        </aside>
      </main>
    </div>
  );
}
