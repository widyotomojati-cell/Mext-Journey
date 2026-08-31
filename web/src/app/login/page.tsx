import { Landmark } from "lucide-react";

import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <span className="brand-mark" aria-hidden="true">
          <Landmark size={19} strokeWidth={1.8} />
        </span>
        <p className="eyebrow mt-6">MEXT Journey</p>
        <h1 id="login-title" className="login-title">
          Balik ke ritme 15 menit.
        </h1>
        <p className="login-lede">
          Nggak pakai password. Masuk lewat magic link, lalu lanjutkan quest
          kecil hari ini.
        </p>
        <LoginForm />
        {process.env.NODE_ENV === "development" ? (
          <p className="login-dev-note">
            Mode lokal: email masuk ke Mailpit di <strong>127.0.0.1:54324</strong>.
          </p>
        ) : null}
      </section>
    </main>
  );
}
