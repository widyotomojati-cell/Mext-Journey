"use client";

import { Clipboard, ClipboardCheck, MessageCircle } from "lucide-react";
import { useState } from "react";

type MentorItem = {
  title: string;
  theme: string;
  evidence: { value: string } | null;
};

type Props = {
  weekLabel: string;
  completedCount: number;
  minutes: number;
  xp: number;
  cumulative: { completedCount: number; minutes: number; xp: number };
  items: MentorItem[];
};

export function CopyWeeklyMentorPrompt({ weekLabel, completedCount, minutes, xp, cumulative, items }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyPrompt() {
    const submissions = items
      .map((item, index) => `${index + 1}. ${item.title} — ${item.theme}\nJawaban: ${item.evidence?.value ?? "(Jawaban tidak tersedia)"}`)
      .join("\n\n");

    const prompt = `Lo adalah mentor MEXT Journey Dio. Buat weekly review yang hangat, jujur, dan praktis dari submission berikut. Jangan menghakimi pengalaman personal atau meminta bukti tambahan. Jika ada klaim MEXT/lab yang faktual, tandai untuk verifikasi sumber resmi.\n\nPERIODE\n${weekLabel}\n\nRINGKASAN AKTIVITAS\n- ${completedCount} quest selesai\n- ${minutes} menit fokus\n- +${xp} XP\n- Akumulasi: ${cumulative.completedCount} quest · ${cumulative.minutes} menit · ${cumulative.xp} XP\n\nSEMUA SUBMISSION MINGGU INI\n${submissions}\n\nJawab dengan format:\n1. Apa yang paling kuat dibangun minggu ini\n2. Pola atau arah riset/MEXT/IELTS yang mulai terlihat\n3. Satu celah paling penting yang perlu dipertegas\n4. Satu fokus kecil dan realistis untuk minggu depan\n5. Satu pertanyaan refleksi untuk Dio.`;

    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="weekly-mentor-cta">
      <div>
        <p className="eyebrow">Weekly mentor session</p>
        <p>Gabungkan semua submission ini menjadi satu review bersama mentor di chat MEXT Dio.</p>
      </div>
      <button type="button" onClick={copyPrompt} className="weekly-mentor-cta__button">
        {copied ? <ClipboardCheck size={17} aria-hidden="true" /> : <Clipboard size={17} aria-hidden="true" />}
        {copied ? "Prompt siap dipaste" : "Copy prompt untuk mentor"}
      </button>
      {!copied ? <small><MessageCircle size={14} aria-hidden="true" /> Paste ke chat “MEXT Mentor · Quest Review”.</small> : null}
    </div>
  );
}
