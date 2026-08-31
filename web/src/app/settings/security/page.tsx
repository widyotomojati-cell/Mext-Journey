import { redirect } from "next/navigation";
import { KeyRound, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { createClient } from "@/lib/supabase/server";
import { PinSetupForm } from "./pin-setup-form";

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return "akun Dio";
  return `${name.slice(0, 2)}•••@${domain}`;
}

export default async function SecuritySettingsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) redirect("/login");

  return (
    <AppShell
      activeNav="settings"
      aside={
        <section className="progress-card">
          <ShieldCheck size={21} className="text-primary" aria-hidden="true" />
          <p className="eyebrow mt-4">Akun yang sama</p>
          <h2 className="mt-2 text-lg font-semibold">
            Progress tetap sinkron
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            HP dan laptop memakai user Supabase yang sama. Device hanya
            menyimpan session login masing-masing.
          </p>
        </section>
      }
    >
      <section className="page-intro" aria-labelledby="security-title">
        <div>
          <p className="eyebrow text-primary">Settings · Security</p>
          <h1 id="security-title" className="page-title">
            Buat PIN lintas device.
          </h1>
          <p className="page-lede">
            PIN menjadi cara masuk utama untuk {maskEmail(data.user.email ?? "")}.
            Magic link tetap tersedia sebagai recovery.
          </p>
        </div>
      </section>

      <section className="security-card">
        <span className="security-card__icon" aria-hidden="true">
          <KeyRound size={23} strokeWidth={1.8} />
        </span>
        <div>
          <h2>Enam angka yang mudah lo ingat</h2>
          <p>
            Hindari 123456, tanggal lahir, atau angka yang gampang ditebak.
            Jangan kirim PIN ini ke chat maupun menyimpannya di source code.
          </p>
        </div>
        <PinSetupForm />
      </section>
    </AppShell>
  );
}
