import { Landmark, Settings2 } from "lucide-react";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  aside: ReactNode;
};

export function AppShell({ children, aside }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <Landmark size={19} strokeWidth={1.8} />
          </span>
          <span>
            <span className="brand-name">MEXT Journey</span>
            <span className="brand-subtitle">Dio&apos;s 15-minute practice</span>
          </span>
        </div>

        <div className="profile-control" aria-label="Profile Dio">
          <span className="profile-avatar" aria-hidden="true">
            D
          </span>
          <span className="hidden text-sm font-semibold sm:inline">Dio</span>
          <Settings2 size={16} strokeWidth={1.8} aria-hidden="true" />
        </div>
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
