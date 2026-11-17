// Semua isi website ada di file ini. Ganti nama, handle, email, dan ceritanya
// dengan punya lo sendiri — sisanya otomatis ikut.

export const site = {
  name: 'Assalimi',
  handle: '@assalimi',
  role: 'Builder, kreator, kakak yang nyemangatin',
  location: 'Jakarta',
  timezone: 'Asia/Jakarta',
  email: 'hai@assalimi.com',
  available: true,
  audience: 'Gen Alpha 2010–2024 × Gen Beta 2025+',
  intro:
    'Gue bikin situs, alat kecil, dan cerita yang bikin belajar kerasa lebih gampang. Ini portfolio gue, sekalian pesan buat Gen Alpha dan Gen Beta: lo gak perlu jadi sigma buat jadi orang yang berguna.',
  socials: [
    { label: 'Instagram', href: '#' },
    { label: 'TikTok', href: '#' },
    { label: 'GitHub', href: '#' },
    { label: 'YouTube', href: '#' },
  ],
  marquee: ['GAS TERUS', 'NO CAP', 'AURA +9000', 'LEVEL UP', 'BELAJAR DULU', 'COBA AJA', 'W MOVE', 'JANGAN NYERAH'],
}

export interface Project {
  slug: string
  title: string
  client: string
  category: string
  year: string
  cover: string
  tint: string
  summary: string
  role: string[]
  deliverables: string[]
  link?: string
  body: string[]
  size: 'large' | 'small'
}

export const projects: Project[] = [
  {
    slug: 'aura-farming',
    title: 'Aura Farming 101',
    client: 'SMAN 8 Jakarta',
    category: 'Situs edukasi',
    year: '2026',
    cover: '/images/aurora.jpg',
    tint: '#d9ff3f',
    summary: 'Situs yang ngajarin naikin “aura” versi sehat: kebiasaan kecil tiap hari, bukan flexing di feed.',
    role: ['Riset', 'Desain', 'Development'],
    deliverables: ['Situs 12 halaman', 'Kuis kebiasaan', 'Poster cetak'],
    body: [
      'Istilah “aura farming” diambil dari cara anak-anak sekarang ngukur status: makin tenang, makin dihormati. Masalahnya, yang keliatan keren di feed sering bikin orang makin insecure.',
      'Gue balikin definisinya. Aura di situs ini dihitung dari hal yang bisa diulang: tidur cukup, baca sepuluh menit, gerak, bantu satu orang. Ada kuis kecil yang ngasih jawaban jujur, bukan pujian palsu.',
      'Sekolahnya pakai ini di sesi bimbingan konseling, dan versi cetaknya ditempel di mading. Versi digitalnya dibuka 4.000 kali dalam bulan pertama.',
    ],
    size: 'large',
  },
  {
    slug: 'no-cap-notes',
    title: 'No Cap Notes',
    client: 'Self-initiated',
    category: 'Catatan digital',
    year: '2026',
    cover: '/images/meridian.jpg',
    tint: '#7ef2ff',
    summary: 'Catatan pelajaran satu kelas, dirapiin jadi satu tempat: bisa dicari, bisa dikomentari, gak hilang di grup chat.',
    role: ['Desain', 'Development'],
    deliverables: ['Situs catatan', 'Pencarian', 'Sistem tag'],
    body: [
      'Setiap mau ulangan, grup kelas isinya cuma “ada catatan gak?” — terus tenggelam di antara stiker dan pesan lain. Catatan yang bagus pun hilang setelah satu minggu.',
      'No Cap Notes nyimpen catatan per mata pelajaran, dengan tag topik dan pencarian. Siapa pun bisa nambah, tapi yang ngoreksi harus nyebut sumbernya. Gak ada catatan tanpa asal-usul.',
      'Sehari sebelum ujian semester, semua catatan dibuka 900 kali. Itu momen paling berasa gunanya.',
    ],
    size: 'small',
  },
  {
    slug: 'sigma-study-kit',
    title: 'Sigma Study Kit',
    client: 'OSIS SMAN 8',
    category: 'Web app',
    year: '2025',
    cover: '/images/fold.jpg',
    tint: '#ff5fd2',
    summary: 'Alat yang ngubah daftar deadline tugas jadi jadwal belajar harian — dibagi rata, bukan panik semalam.',
    role: ['Product design', 'Development'],
    deliverables: ['Web app', 'Jadwal otomatis', 'Panduan guru'],
    body: [
      'Projek ini lahir dari kebiasaan yang gak sehat: semua tugas dikerjain semalam sebelum dikumpul. Bukan karena malas, tapi karena gak ada yang bantu ngitung waktunya.',
      'Masukin deadline, keluarnya rencana per hari — termasuk hari kosong buat istirahat. Gak ada streak yang bikin rasa bersalah, gak ada notifikasi tengah malam.',
      'Dipakai tiga kelas selama satu semester. Jumlah tugas yang dikumpul telat turun dari separuh jadi seperempat.',
    ],
    size: 'small',
  },
  {
    slug: 'skibidi-radio',
    title: 'Skibidi Radio',
    client: 'Podel Session',
    category: 'Situs audio',
    year: '2025',
    cover: '/images/nocturne.jpg',
    tint: '#b6a1ff',
    summary: 'Playlist buat fokus belajar, isinya lagu kiriman temen-temen — bukan algoritma yang ngejar views.',
    role: ['Art direction', 'Development'],
    deliverables: ['Situs pemutar', 'Kurasi komunitas', 'Identitas visual'],
    body: [
      'Nama yang sengaja receh, isinya serius: satu tempat buat lagu yang bikin orang bisa duduk diam dan ngerjain sesuatu. Semua lagu dikirim sendiri oleh anggotanya.',
      'Pemutarnya satu tombol. Gak ada rekomendasi, gak ada autoplay tanpa akhir, gak ada iklan. Setiap playlist punya batas waktu, jadi berhenti sendiri.',
      'Yang paling sering dipakai: sesi “belajar 45 menit” dan “bikin PR jam 9 malam”.',
    ],
    size: 'large',
  },
  {
    slug: 'level-up-locker',
    title: 'Level Up Locker',
    client: 'Self-initiated',
    category: 'Habit tracker',
    year: '2025',
    cover: '/images/kite.jpg',
    tint: '#ffb45f',
    summary: 'Pelacak kebiasaan yang ngukur hal yang beneran naikin hidup, bukan streak di media sosial.',
    role: ['Desain', 'Development'],
    deliverables: ['Web app', 'Papan progres', 'Mode libur'],
    body: [
      'Aplikasi kebiasaan biasanya bikin lo ngerasa gagal kalau bolong sehari. Itu desain yang jahat buat anak sekolah yang jadwalnya padat.',
      'Level Up Locker ngasih “mode libur” yang otomatis aktif pas lagi ujian atau sakit. Progresnya dihitung bulanan, jadi satu hari bolong gak menghapus semuanya.',
      'Delapan puluh orang pakai tiap minggu, dan yang paling banyak dipilih bukan “olahraga” — tapi “tidur sebelum jam 11”.',
    ],
    size: 'small',
  },
  {
    slug: 'lore-sekolah',
    title: 'Lore Sekolah',
    client: 'Projek foto',
    category: 'Foto dan cerita',
    year: '2024',
    cover: '/images/halcyon.jpg',
    tint: '#9affc8',
    summary: 'Seri foto dan cerita pendek soal sudut sekolah yang biasanya gak pernah masuk feed siapa pun.',
    role: ['Fotografi', 'Penulisan'],
    deliverables: ['24 foto', 'Situs galeri', 'Dua lokakarya'],
    body: [
      'Setiap sekolah punya lore-nya sendiri: tukang parkir yang hafal semua motor, bangku belakang yang legendaris, jendela lab yang selalu berdebu.',
      'Gue motret dua puluh empat momen kecil selama enam bulan, lalu nulis satu paragraf buat tiap foto — dari obrolan sama orangnya, bukan karangan.',
      'Hasilnya dipajang di lorong sekolah dan dipakai buat lokakarya fotografi buat kelas sepuluh. Beberapa anak mulai bawa kamera sendiri setelah itu.',
    ],
    size: 'small',
  },
]

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug)

export const services = [
  {
    title: 'Web & kode',
    body: 'Situs, web app kecil, dan semua yang harus jalan di browser. Dibangun rapi, cepet, dan gampang diurus sendiri — tanpa perlu bayar orang tiap mau ganti satu kata.',
  },
  {
    title: 'Desain visual',
    body: 'Layout, tipografi, dan warna yang berani tapi tetap kebaca di HP. Bukan template yang diganti teksnya doang.',
  },
  {
    title: 'Konten & cerita',
    body: 'Nulis, motret, dan nyusun naskah pendek buat kegiatan sekolah atau komunitas. Bikin sesuatu yang orang mau baca sampai habis, bukan cuma di-scroll cepat.',
  },
  {
    title: 'Ngajarin',
    body: 'Kelas kecil dan mentoring buat temen-temen yang mau mulai bikin website dari nol. Pelan-pelan, sampai bisa sendiri. Gak pelit ilmu, gak bikin ngerasa bodoh.',
  },
]

export const testimonials = [
  {
    quote: 'Dia yang ngajarin anak-anak di kelas saya bahwa konsisten itu lebih keren daripada sekali viral. Buktinya kelihatan di nilai mereka.',
    name: 'Bu Ratna',
    role: 'Wali kelas, SMAN 8',
  },
  {
    quote: 'Gue tanya cara bikin website, dijawabnya sabar sampai gue paham. Gak bikin gue ngerasa telat belajar.',
    name: 'Dita',
    role: 'Temen satu kelas',
  },
  {
    quote: 'Kata kakak gue, gagal itu tandanya lagi latihan. Sekarang gue gak takut salah lagi.',
    name: 'Birru',
    role: 'Adik, 9 tahun',
  },
]

export const experience = [
  { period: '2024 – sekarang', title: 'Independent builder', detail: 'Bikin situs dan alat belajar buat sekolah, komunitas, dan projek sendiri' },
  { period: '2023 – 2024', title: 'Freelance kecil-kecilan', detail: 'Poster, edit video, dan situs pertama yang dibayar Rp 250 ribu' },
  { period: '2022 – 2023', title: 'Mulai dari nol', detail: 'Belajar sendiri dari YouTube, rusak satu laptop, lalu ngulang lagi' },
]

// Dua pesan utama website ini: satu buat generasi sendiri, satu buat yang lahir
// setelah kita. Ini yang bikin portfolio-nya punya alasan, bukan cuma pamer.
export const pepTalk = [
  {
    tag: 'Buat Gen Alpha',
    age: 'lahir 2010 – 2024',
    title: 'Lo gak telat.',
    body: 'Umur lo belum seperempat abad, tapi feed udah bikin lo ngerasa ketinggalan. Itu bohong. Yang keliatan “udah jadi” di layar biasanya baru bagian highlight-nya.',
    points: [
      'Satu skill, dilatih 20 menit sehari, setahun lagi lo udah beda level.',
      'Gak semua harus direkam. Ada proses yang lebih kuat kalau gak ada yang nonton.',
      'Kalau hari ini cuma bisa satu hal kecil, itu tetap W.',
    ],
  },
  {
    tag: 'Buat Gen Beta',
    age: 'lahir 2025 ke atas',
    title: 'Dunia lo bakal beda.',
    body: 'Kalian tumbuh bareng alat yang bisa bikin apa aja dalam hitungan detik. Itu keren, tapi yang bikin kalian berarti bukan alatnya — tapi apa yang kalian putuskan buat dikerjain.',
    points: [
      'Belajar satu hal sampai dalam, bukan seratus hal sampai kelihatan.',
      'Tanya “kenapa” lebih sering daripada “gimana caranya”.',
      'Jaga orang di sekitar kalian. Itu yang gak bisa diganti mesin.',
    ],
  },
]
