insert into public.quest_packs (
  id,
  slug,
  version,
  title,
  total_days,
  is_active
)
values (
  '00000000-0000-4000-8000-000000000001',
  'foundation-sprint',
  1,
  'MEXT Foundation Sprint',
  14,
  true
)
on conflict (slug, version) do update
set
  title = excluded.title,
  total_days = excluded.total_days,
  is_active = excluded.is_active;

insert into public.quest_definitions (
  id,
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
values
  (
    '10000000-0000-4000-8000-000000000001',
    '00000000-0000-4000-8000-000000000001',
    1,
    'standard',
    'Cerita gue punya arah',
    'Kenapa sekarang?',
    'Tulis satu kalimat jujur tentang kenapa lanjut S2 ke Jepang penting buat hidup lo sekarang. Jangan bikin esai; cari alasan yang paling personal dan paling terasa.',
    'Satu kalimat alasan utama.',
    15,
    20
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    '00000000-0000-4000-8000-000000000001',
    2,
    'standard',
    'Cerita gue punya arah',
    'Sembilan tahun, tiga bukti',
    'Pecah pengalaman profesional lo menjadi tiga bukti yang relevan untuk studi: tipe proyek, tanggung jawab, keputusan desain, atau pelajaran yang berulang.',
    'Tiga bullet bukti pengalaman.',
    15,
    20
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    '00000000-0000-4000-8000-000000000001',
    3,
    'standard',
    'Cerita gue punya arah',
    'Bangun problem bank',
    'Catat masalah thermal comfort atau konsumsi energi yang pernah lo lihat pada landed house di Jabodetabek. Tulis observasi nyata, bukan solusi dulu.',
    'Minimal tiga masalah yang pernah diamati.',
    15,
    20
  ),
  (
    '10000000-0000-4000-8000-000000000004',
    '00000000-0000-4000-8000-000000000001',
    4,
    'standard',
    'Cerita gue punya arah',
    'Pilih satu masalah',
    'Pilih satu masalah dari problem bank yang paling kuat bukti personalnya dan paling mungkin dibawa menjadi pertanyaan akademik.',
    'Satu masalah terpilih dan satu alasan.',
    15,
    20
  ),
  (
    '10000000-0000-4000-8000-000000000005',
    '00000000-0000-4000-8000-000000000001',
    5,
    'standard',
    'Cerita gue punya arah',
    'Satu cerita potensi akademik',
    'Ambil satu proyek yang menunjukkan kemampuan desain atau analisis. Ringkas situasinya, tindakan lo, dan apa yang lo pelajari.',
    'Situation, action, dan learning dalam bentuk singkat.',
    15,
    20
  ),
  (
    '10000000-0000-4000-8000-000000000006',
    '00000000-0000-4000-8000-000000000001',
    6,
    'standard',
    'Cerita gue punya arah',
    'Why Japan v0',
    'Tulis dua alasan akademik kenapa Jepang relevan untuk arah passive design dan hot-humid housing lo. Hindari alasan wisata atau budaya dulu.',
    'Dua alasan akademik.',
    15,
    20
  ),
  (
    '10000000-0000-4000-8000-000000000007',
    '00000000-0000-4000-8000-000000000001',
    7,
    'optional-review',
    'Sunday Review',
    'Lihat jejak minggu pertama',
    'Baca ulang evidence enam hari terakhir. Pilih satu bagian yang terasa paling kuat dan satu bagian yang masih kabur. Review ini opsional dan tidak memengaruhi streak.',
    'Satu hal kuat dan satu hal yang masih kabur.',
    5,
    10
  ),
  (
    '10000000-0000-4000-8000-000000000008',
    '00000000-0000-4000-8000-000000000001',
    8,
    'standard',
    'Topik gue bisa dicari',
    'Lima keyword bahasa Inggris',
    'Terjemahkan arah riset lo menjadi lima keyword akademik berbahasa Inggris yang bisa dipakai mencari paper dan researcher.',
    'Lima keyword berbahasa Inggris.',
    15,
    20
  ),
  (
    '10000000-0000-4000-8000-000000000009',
    '00000000-0000-4000-8000-000000000001',
    9,
    'standard',
    'Topik gue bisa dicari',
    'Temukan satu paper',
    'Gunakan keyword kemarin untuk menemukan satu paper akademik yang relevan. Hari ini cukup simpan judul dan tautannya.',
    'Judul paper dan URL.',
    15,
    20
  ),
  (
    '10000000-0000-4000-8000-000000000010',
    '00000000-0000-4000-8000-000000000001',
    10,
    'standard',
    'Topik gue bisa dicari',
    'Baca abstract saja',
    'Baca abstract paper yang dipilih. Ambil tiga hal tanpa membuka seluruh paper: masalah, metode, dan temuan utama.',
    'Problem, method, dan finding.',
    15,
    20
  ),
  (
    '10000000-0000-4000-8000-000000000011',
    '00000000-0000-4000-8000-000000000001',
    11,
    'standard',
    'Topik gue bisa dicari',
    'Temukan satu researcher Jepang',
    'Cari satu researcher yang berbasis di universitas Jepang dan punya hubungan nyata dengan keyword atau paper yang sudah lo simpan.',
    'Nama, universitas, dan URL profil researcher.',
    15,
    20
  ),
  (
    '10000000-0000-4000-8000-000000000012',
    '00000000-0000-4000-8000-000000000001',
    12,
    'standard',
    'Topik gue bisa dicari',
    'Uji kecocokan researcher',
    'Simpan satu paper terbaru dari atau relevan dengan researcher tersebut. Jelaskan dalam satu kalimat kenapa ada kecocokan dengan arah lo.',
    'URL paper dan satu kalimat kecocokan.',
    15,
    20
  ),
  (
    '10000000-0000-4000-8000-000000000013',
    '00000000-0000-4000-8000-000000000001',
    13,
    'standard',
    'Topik gue bisa dicari',
    'Application Spine v0.1',
    'Susun rantai singkat: background profesional, masalah yang diamati, arah riset, alasan memilih Jepang, dan kontribusi yang ingin dibawa pulang.',
    'Background → problem → research direction → why Japan → contribution.',
    15,
    30
  ),
  (
    '10000000-0000-4000-8000-000000000014',
    '00000000-0000-4000-8000-000000000001',
    14,
    'optional-review',
    'Sprint Review',
    'Tutup sprint pertama',
    'Lihat seluruh jejak 14 hari. Tulis apa yang sekarang lebih jelas, apa yang masih berat, dan satu komitmen kecil untuk sprint berikutnya.',
    'Refleksi singkat dan satu next commitment.',
    15,
    40
  ),
  (
    '10000000-0000-4000-8000-000000000099',
    '00000000-0000-4000-8000-000000000001',
    null,
    'recovery',
    'Recovery Quest',
    'Balik lagi, pelan-pelan',
    'Buka evidence terakhir yang pernah lo simpan dan tambahkan satu kalimat yang berguna. Nggak perlu mengganti quest yang terlewat.',
    'Satu kalimat tambahan pada jejak terakhir.',
    5,
    10
  )
on conflict (id) do update
set
  pack_id = excluded.pack_id,
  day_number = excluded.day_number,
  quest_type = excluded.quest_type,
  theme = excluded.theme,
  title = excluded.title,
  instructions = excluded.instructions,
  evidence_prompt = excluded.evidence_prompt,
  duration_minutes = excluded.duration_minutes,
  xp_value = excluded.xp_value;
