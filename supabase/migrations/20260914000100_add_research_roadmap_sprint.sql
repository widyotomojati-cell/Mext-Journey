update public.quest_packs
set is_active = false
where is_active = true;

insert into public.quest_packs (
  slug,
  version,
  title,
  total_days,
  is_active
)
values (
  'research-roadmap-sprint',
  1,
  'Level 2 · Research & MEXT Roadmap',
  14,
  true
)
on conflict (slug, version) do update
set
  title = excluded.title,
  total_days = excluded.total_days,
  is_active = excluded.is_active;

with active_pack as (
  select id
  from public.quest_packs
  where slug = 'research-roadmap-sprint'
    and version = 1
),
quests(day_number, quest_type, theme, title, instructions, evidence_prompt, duration_minutes, xp_value) as (
  values
    (1::smallint, 'standard'::public.quest_type, 'Arah riset makin tajam', 'Pilih benang merah Level 1', 'Baca ulang evidence Level 1. Pilih satu kalimat yang paling kuat menghubungkan pengalaman landed house Jabodetabek dengan passive design untuk iklim tropis.', 'Salin satu kalimat terkuat dan jelaskan singkat kenapa ini penting.', 15::smallint, 25),
    (2::smallint, 'standard'::public.quest_type, 'Arah riset makin tajam', 'Research question v0', 'Ubah benang merah kemarin menjadi satu pertanyaan riset. Gunakan pola: bagaimana strategi X dapat memperbaiki Y pada konteks Z?', 'Satu pertanyaan riset versi awal.', 15::smallint, 25),
    (3::smallint, 'standard'::public.quest_type, 'Arah riset makin tajam', 'Problem, context, evidence', 'Tulis tiga baris: masalah desain yang lo lihat, konteks landed house Jabodetabek, dan bukti pengalaman yang membuat lo layak menelitinya.', 'Tiga baris: problem, context, evidence.', 15::smallint, 25),
    (4::smallint, 'standard'::public.quest_type, 'Arah riset makin tajam', 'Persempit keyword akademik', 'Susun enam keyword bahasa Inggris: dua tentang passive design, dua tentang hot-humid housing, dan dua tentang performa bangunan.', 'Enam keyword dalam tiga pasangan.', 15::smallint, 25),
    (5::smallint, 'standard'::public.quest_type, 'Cari rumah akademik', 'Temukan dua lab di Jepang', 'Cari dua laboratory atau research group di universitas Jepang yang relevan dengan keyword lo. Hari ini cukup simpan nama lab, universitas, dan tautannya.', 'Dua nama lab, universitas, dan URL.', 15::smallint, 30),
    (6::smallint, 'standard'::public.quest_type, 'Cari rumah akademik', 'Bandingkan dua lab', 'Bandingkan dua lab kemarin berdasarkan topik, metode, dan kecocokan dengan pengalaman profesional lo. Jangan memilih berdasarkan ranking saja.', 'Tiga poin perbandingan dan satu kandidat sementara.', 15::smallint, 30),
    (7::smallint, 'optional-review'::public.quest_type, 'Sunday Review', 'Rapikan jejak riset', 'Baca evidence enam hari terakhir. Perbaiki satu kalimat yang masih kabur dan tandai satu keputusan yang sudah cukup kuat.', 'Satu revisi kalimat dan satu keputusan yang dipertahankan.', 5::smallint, 10),
    (8::smallint, 'standard'::public.quest_type, 'MEXT jadi konkret', 'Peta G2G dan U2U', 'Tulis perbedaan praktis jalur Embassy Recommendation dan University Recommendation: pintu masuk, kebutuhan kontak universitas, dan ritme persiapan.', 'Dua kolom ringkas G2G versus U2U.', 15::smallint, 30),
    (9::smallint, 'standard'::public.quest_type, 'MEXT jadi konkret', 'Audit dokumen aplikasi', 'Buat tiga kelompok dokumen: sudah ada, perlu diperbarui, dan belum ada. Fokus pada dokumen akademik, profesional, bahasa, serta proposal riset.', 'Daftar dokumen dalam tiga kelompok.', 15::smallint, 25),
    (10::smallint, 'standard'::public.quest_type, 'IELTS tanpa drama', 'Baseline IELTS yang jujur', 'Nilai kondisi IELTS lo saat ini untuk Listening, Reading, Writing, dan Speaking dengan skala 1 sampai 5. Pilih satu skill terlemah tanpa menghakimi diri.', 'Empat skor dan satu skill prioritas.', 15::smallint, 25),
    (11::smallint, 'standard'::public.quest_type, 'IELTS tanpa drama', 'Listening diagnostic mini', 'Kerjakan satu latihan Listening pendek maksimal 15 menit. Catat jumlah benar dan dua jenis kesalahan yang paling sering muncul.', 'Skor latihan dan dua pola kesalahan.', 15::smallint, 30),
    (12::smallint, 'standard'::public.quest_type, 'IELTS tanpa drama', 'Reading diagnostic mini', 'Kerjakan satu passage Reading atau latihan pendek maksimal 15 menit. Catat jumlah benar, waktu, dan satu hambatan utama.', 'Skor, durasi, dan satu hambatan.', 15::smallint, 30),
    (13::smallint, 'standard'::public.quest_type, 'Sistem yang bisa dijalani', 'Roadmap 90 hari v0', 'Bagi 90 hari menjadi tiga fase: fondasi IELTS, riset kampus dan lab, serta dokumen MEXT. Beri satu outcome kecil untuk tiap fase.', 'Tiga fase dan masing-masing satu outcome.', 15::smallint, 35),
    (14::smallint, 'optional-review'::public.quest_type, 'Sprint Review', 'Pilih fokus Level 3', 'Tinjau seluruh Level 2. Pilih fokus sprint selanjutnya: IELTS intensive, proposal riset, atau shortlist universitas dan supervisor. Jelaskan keputusan dalam dua kalimat.', 'Pilihan fokus Level 3 dan dua kalimat alasan.', 15::smallint, 50)
)
insert into public.quest_definitions (
  pack_id,
  day_number,
  quest_type,
  theme,
  title,
  instructions,
  evidence_prompt,
  duration_minutes,
  xp_value
)
select
  active_pack.id,
  quests.day_number,
  quests.quest_type,
  quests.theme,
  quests.title,
  quests.instructions,
  quests.evidence_prompt,
  quests.duration_minutes,
  quests.xp_value
from active_pack
cross join quests
on conflict (pack_id, day_number) where day_number is not null do update
set
  quest_type = excluded.quest_type,
  theme = excluded.theme,
  title = excluded.title,
  instructions = excluded.instructions,
  evidence_prompt = excluded.evidence_prompt,
  duration_minutes = excluded.duration_minutes,
  xp_value = excluded.xp_value;

with active_pack as (
  select id
  from public.quest_packs
  where slug = 'research-roadmap-sprint'
    and version = 1
)
insert into public.quest_definitions (
  pack_id,
  day_number,
  quest_type,
  theme,
  title,
  instructions,
  evidence_prompt,
  duration_minutes,
  xp_value
)
select
  active_pack.id,
  null,
  'recovery'::public.quest_type,
  'Recovery Quest',
  'Buka lagi jejak terakhir',
  'Baca evidence terakhir yang lo simpan. Tambahkan satu kalimat yang membuat langkah berikutnya lebih jelas. Tidak perlu mengejar semua yang tertinggal.',
  'Satu kalimat lanjutan yang berguna.',
  5,
  10
from active_pack
on conflict (pack_id) where quest_type = 'recovery' do update
set
  theme = excluded.theme,
  title = excluded.title,
  instructions = excluded.instructions,
  evidence_prompt = excluded.evidence_prompt,
  duration_minutes = excluded.duration_minutes,
  xp_value = excluded.xp_value;
