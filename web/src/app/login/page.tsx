import { KeyRound, Landmark } from "lucide-react";

import { LoginForm } from "./login-form";
import { PinLoginForm } from "./pin-login-form";

type LoginPageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { mode } = await searchParams;
  const pinConfigured = Boolean(process.env.MEXT_OWNER_EMAIL);
  const showRecovery = mode === "email" || !pinConfigured;

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <span className="brand-mark" aria-hidden="true">
          {showRecovery ? (
            <Landmark size={19} strokeWidth={1.8} />
          ) : (
            <KeyRound size={19} strokeWidth={1.8} />
          )}
        </span>
        <p className="eyebrow mt-6">MEXT Journey</p>
        <h1 id="login-title" className="login-title">
          {showRecovery ? "Pulihkan akses Dio." : "Masukkan PIN, lalu lanjut."}
        </h1>
        <p className="login-lede">
          {showRecovery
            ? "Recovery email tetap tersedia kalau PIN lupa atau belum dibuat."
            : "Satu PIN yang sama untuk laptop dan HP. Progress tetap tersimpan di akun yang sama."}
        </p>
        {showRecovery ? <LoginForm /> : <PinLoginForm />}
        {process.env.NODE_ENV === "development" ? (
          <p className="login-dev-note">
            Mode lokal: email masuk ke Mailpit di <strong>127.0.0.1:54324</strong>.
          </p>
        ) : null}
      </section>
    </main>
  );
}
