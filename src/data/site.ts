// Semua isi website ada di file ini, dalam dua bahasa (id + en).
// Ganti nama, handle, email, dan ceritanya dengan punya lo sendiri — sisanya otomatis ikut.

export type Lang = 'id' | 'en'

export const site = {
  name: 'Assalimi',
  handle: '@assalimi',
  location: 'Jakarta',
  timezone: 'Asia/Jakarta',
  email: 'hai@assalimi.my.id',
  available: true,
  socials: [
    { label: 'Instagram', href: '#' },
    { label: 'TikTok', href: '#' },
    { label: 'GitHub', href: '#' },
    { label: 'YouTube', href: '#' },
  ],
}

export interface ProjectText {
  title: string
  client: string
  category: string
  summary: string
  role: string[]
  deliverables: string[]
  body: string[]
}

export interface Project extends ProjectText {
  slug: string
  year: string
  cover: string
  tint: string
  size: 'large' | 'small'
  link?: string
}

// Bahasa-netral: gambar, warna, tahun. Teksnya ada di `content[lang].projects`.
export const projectMeta: Array<Omit<Project, keyof ProjectText>> = [
  { slug: 'aura-farming', year: '2026', cover: '/images/aurora.jpg', tint: '#d9ff3f', size: 'large' },
  { slug: 'no-cap-notes', year: '2026', cover: '/images/meridian.jpg', tint: '#7ef2ff', size: 'small' },
  { slug: 'sigma-study-kit', year: '2025', cover: '/images/fold.jpg', tint: '#ff5fd2', size: 'small' },
  { slug: 'skibidi-radio', year: '2025', cover: '/images/nocturne.jpg', tint: '#b6a1ff', size: 'large' },
  { slug: 'level-up-locker', year: '2025', cover: '/images/kite.jpg', tint: '#ffb45f', size: 'small' },
  { slug: 'lore-sekolah', year: '2024', cover: '/images/halcyon.jpg', tint: '#9affc8', size: 'small' },
]

export interface Ui {
  docTitle: string
  navWork: string
  navAbout: string
  navContact: string
  langLabel: string
  themeToDark: string
  themeToLight: string
  preloader: string
  heroBadge: string
  heroWork: string
  heroPep: string
  whyLines: string[]
  whyBody: string[]
  whyLink: string
  workLines: string[]
  workCount: string
  levelLines: string[]
  levelBody: string
  skillLines: string[]
  skillBody: string
  pepLines: string[]
  testimonyAria: string
  testimonyNext: string
  aboutLines: string[]
  aboutLead: string
  aboutBody: string[]
  aboutJourney: string
  aboutStats: Array<[string, string]>
  workBack: string
  labelClient: string
  labelYear: string
  labelRole: string
  labelDeliverables: string
  openSite: string
  nextProject: string
  cardHover: string
  footerTop: string
  footerBefore: string
  footerAccent: string
  openForWork: string
  fullyBooked: string
  footerBlurb: string
  formDoneTitle: string
  formDoneBody: string
  formNote: string
  formName: string
  formEmail: string
  formMessage: string
  formSend: string
  formSending: string
  formError: string
  audienceLabel: string
  role: string
  intro: string
  marquee: string[]
}

export interface Content {
  projects: Record<string, ProjectText>
  services: Array<{ title: string; body: string }>
  testimonials: Array<{ quote: string; name: string; role: string }>
  experience: Array<{ period: string; title: string; detail: string }>
  pepTalk: Array<{ tag: string; age: string; title: string; body: string; points: string[] }>
  ui: Ui
}

const id: Content = {
  projects: {
    'aura-farming': {
      title: 'Aura Farming 101',
      client: 'SMAN 8 Jakarta',
      category: 'Situs edukasi',
      summary: 'Situs yang ngajarin naikin “aura” versi sehat: kebiasaan kecil tiap hari, bukan flexing di feed.',
      role: ['Riset', 'Desain', 'Development'],
      deliverables: ['Situs 12 halaman', 'Kuis kebiasaan', 'Poster cetak'],
      body: [
        'Istilah “aura farming” diambil dari cara anak-anak sekarang ngukur status: makin tenang, makin dihormati. Masalahnya, yang keliatan keren di feed sering bikin orang makin insecure.',
        'Gue balikin definisinya. Aura di situs ini dihitung dari hal yang bisa diulang: tidur cukup, baca sepuluh menit, gerak, bantu satu orang. Ada kuis kecil yang ngasih jawaban jujur, bukan pujian palsu.',
        'Sekolahnya pakai ini di sesi bimbingan konseling, dan versi cetaknya ditempel di mading. Versi digitalnya dibuka 4.000 kali dalam bulan pertama.',
      ],
    },
    'no-cap-notes': {
      title: 'No Cap Notes',
      client: 'Self-initiated',
      category: 'Catatan digital',
      summary: 'Catatan pelajaran satu kelas, dirapiin jadi satu tempat: bisa dicari, bisa dikomentari, gak hilang di grup chat.',
      role: ['Desain', 'Development'],
      deliverables: ['Situs catatan', 'Pencarian', 'Sistem tag'],
      body: [
        'Setiap mau ulangan, grup kelas isinya cuma “ada catatan gak?” — terus tenggelam di antara stiker dan pesan lain. Catatan yang bagus pun hilang setelah satu minggu.',
        'No Cap Notes nyimpen catatan per mata pelajaran, dengan tag topik dan pencarian. Siapa pun bisa nambah, tapi yang ngoreksi harus nyebut sumbernya. Gak ada catatan tanpa asal-usul.',
        'Sehari sebelum ujian semester, semua catatan dibuka 900 kali. Itu momen paling berasa gunanya.',
      ],
    },
    'sigma-study-kit': {
      title: 'Sigma Study Kit',
      client: 'OSIS SMAN 8',
      category: 'Web app',
      summary: 'Alat yang ngubah daftar deadline tugas jadi jadwal belajar harian — dibagi rata, bukan panik semalam.',
      role: ['Product design', 'Development'],
      deliverables: ['Web app', 'Jadwal otomatis', 'Panduan guru'],
      body: [
        'Projek ini lahir dari kebiasaan yang gak sehat: semua tugas dikerjain semalam sebelum dikumpul. Bukan karena malas, tapi karena gak ada yang bantu ngitung waktunya.',
        'Masukin deadline, keluarnya rencana per hari — termasuk hari kosong buat istirahat. Gak ada streak yang bikin rasa bersalah, gak ada notifikasi tengah malam.',
        'Dipakai tiga kelas selama satu semester. Jumlah tugas yang dikumpul telat turun dari separuh jadi seperempat.',
      ],
    },
    'skibidi-radio': {
      title: 'Skibidi Radio',
      client: 'Podel Session',
      category: 'Situs audio',
      summary: 'Playlist buat fokus belajar, isinya lagu kiriman temen-temen — bukan algoritma yang ngejar views.',
      role: ['Art direction', 'Development'],
      deliverables: ['Situs pemutar', 'Kurasi komunitas', 'Identitas visual'],
      body: [
        'Nama yang sengaja receh, isinya serius: satu tempat buat lagu yang bikin orang bisa duduk diam dan ngerjain sesuatu. Semua lagu dikirim sendiri oleh anggotanya.',
        'Pemutarnya satu tombol. Gak ada rekomendasi, gak ada autoplay tanpa akhir, gak ada iklan. Setiap playlist punya batas waktu, jadi berhenti sendiri.',
        'Yang paling sering dipakai: sesi “belajar 45 menit” dan “bikin PR jam 9 malam”.',
      ],
    },
    'level-up-locker': {
      title: 'Level Up Locker',
      client: 'Self-initiated',
      category: 'Habit tracker',
      summary: 'Pelacak kebiasaan yang ngukur hal yang beneran naikin hidup, bukan streak di media sosial.',
      role: ['Desain', 'Development'],
      deliverables: ['Web app', 'Papan progres', 'Mode libur'],
      body: [
        'Aplikasi kebiasaan biasanya bikin lo ngerasa gagal kalau bolong sehari. Itu desain yang jahat buat anak sekolah yang jadwalnya padat.',
        'Level Up Locker ngasih “mode libur” yang otomatis aktif pas lagi ujian atau sakit. Progresnya dihitung bulanan, jadi satu hari bolong gak menghapus semuanya.',
        'Delapan puluh orang pakai tiap minggu, dan yang paling banyak dipilih bukan “olahraga” — tapi “tidur sebelum jam 11”.',
      ],
    },
    'lore-sekolah': {
      title: 'Lore Sekolah',
      client: 'Projek foto',
      category: 'Foto dan cerita',
      summary: 'Seri foto dan cerita pendek soal sudut sekolah yang biasanya gak pernah masuk feed siapa pun.',
      role: ['Fotografi', 'Penulisan'],
      deliverables: ['24 foto', 'Situs galeri', 'Dua lokakarya'],
      body: [
        'Setiap sekolah punya lore-nya sendiri: tukang parkir yang hafal semua motor, bangku belakang yang legendaris, jendela lab yang selalu berdebu.',
        'Gue motret dua puluh empat momen kecil selama enam bulan, lalu nulis satu paragraf buat tiap foto — dari obrolan sama orangnya, bukan karangan.',
        'Hasilnya dipajang di lorong sekolah dan dipakai buat lokakarya fotografi buat kelas sepuluh. Beberapa anak mulai bawa kamera sendiri setelah itu.',
      ],
    },
  },
  services: [
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
  ],
  testimonials: [
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
  ],
  experience: [
    { period: '2024 – sekarang', title: 'Independent builder', detail: 'Bikin situs dan alat belajar buat sekolah, komunitas, dan projek sendiri' },
    { period: '2023 – 2024', title: 'Freelance kecil-kecilan', detail: 'Poster, edit video, dan situs pertama yang dibayar Rp 250 ribu' },
    { period: '2022 – 2023', title: 'Mulai dari nol', detail: 'Belajar sendiri dari YouTube, rusak satu laptop, lalu ngulang lagi' },
  ],
  // Dua pesan utama website ini: satu buat generasi sendiri, satu buat yang lahir
  // setelah kita. Ini yang bikin portfolio-nya punya alasan, bukan cuma pamer.
  pepTalk: [
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
  ],
  ui: {
    docTitle: 'Assalimi — Portfolio & Pep Talk Gen Alpha',
    navWork: 'Karya',
    navAbout: 'Tentang',
    navContact: 'Kontak',
    langLabel: 'Ganti bahasa',
    themeToDark: 'Pakai tema gelap',
    themeToLight: 'Pakai tema terang',
    preloader: 'Gaskeun',
    heroBadge: 'Portfolio + pep talk',
    heroWork: 'Lihat karya',
    heroPep: 'Baca pep talk',
    whyLines: ['Kenapa site', 'ini ada'],
    whyBody: [
      'Gue bikin website sejak kelas sepuluh, dimulai dari laptop yang kipasnya berisik. Tiga tahun kemudian projek yang paling gue banggakan bukan yang paling keren secara desain — tapi yang bikin orang lain bisa ikut belajar.',
      'Jadi halaman ini dua fungsi: portfolio buat orang yang mau kerja bareng gue, dan pep talk buat Gen Alpha yang lagi mulai, plus Gen Beta yang belum lahir waktu gue nulis ini.',
    ],
    whyLink: 'Versi panjangnya',
    workLines: ['Karya gue'],
    workCount: '{n} projek, 2024 sampai sekarang',
    levelLines: ['Level up'],
    levelBody: 'Rank gue naik bukan karena sekali viral. Ini tiga level yang beneran gue lewatin, lengkap sama bagian gagalnya.',
    skillLines: ['Skill gue'],
    skillBody: 'Empat hal, dikerjain sampai bener. Kebanyakan projek pakai dua di antaranya.',
    pepLines: ['Pep talk', 'buat dua generasi'],
    testimonyAria: 'Pep talk {n}',
    testimonyNext: 'Berikutnya',
    aboutLines: ['Builder, kreator,', 'kakak yang nyemangatin'],
    aboutLead: 'Gue mulai dari rasa penasaran: kenapa satu website bisa bikin orang percaya sama sesuatu? Jawabannya bikin gue belajar ngoding sendiri sampai sekarang.',
    aboutBody: [
      'Tiga tahun terakhir gue ngerjain situs buat sekolah, komunitas, dan projek pribadi. Kebanyakan dimulai dari masalah kecil: catatan yang hilang, jadwal yang kacau, temen yang mau belajar tapi gak tahu mulai dari mana.',
      'Yang gue percaya: kerja bagus itu hasil dari ngulang, bukan dari bakat yang turun dari langit. Versi pertama website ini jelek, dan itu bagian dari ceritanya.',
      'Buat Gen Alpha yang lagi mulai: lo boleh lambat, asal jangan berhenti. Buat Gen Beta yang bakal baca ini nanti: dunia lo bakal lebih cepat, tapi hal yang bikin lo berguna tetap sama — mau belajar, mau dengerin, dan mau bantu.',
    ],
    aboutJourney: 'Perjalanan',
    aboutStats: [
      ['3', 'tahun belajar sendiri'],
      ['6', 'projek selesai'],
      ['1', 'adik yang diajarin'],
    ],
    workBack: 'Semua karya',
    labelClient: 'Buat',
    labelYear: 'Tahun',
    labelRole: 'Peran',
    labelDeliverables: 'Hasil',
    openSite: 'Buka situsnya',
    nextProject: 'Projek berikutnya',
    cardHover: 'Buka ceritanya',
    footerTop: 'Mau bikin',
    footerBefore: 'sesuatu',
    footerAccent: 'bareng',
    openForWork: 'Buka projek buat kuartal depan',
    fullyBooked: 'Lagi penuh, tapi tetap boleh mampir',
    footerBlurb: 'Mau bikin situs buat kelas, komunitas, atau projek sendiri? Ceritain aja — gak harus udah punya ide lengkap. Kadang setengah ide udah cukup buat mulai.',
    formDoneTitle: 'Makasih',
    formDoneBody: 'Pesan lo udah masuk ke inbox CMS. Gue baca semua, biasanya dibalas dalam beberapa hari.',
    formNote: 'Pesan lo masuk ke inbox CMS. Sertakan email biar gampang dibalas.',
    formName: 'Nama lo',
    formEmail: 'Email',
    formMessage: 'Ceritain sedikit soal projeknya',
    formSend: 'Kirim',
    formSending: 'Ngirim…',
    formError: 'Gagal ngirim. Coba lagi ya.',
    audienceLabel: 'Gen Alpha 2010–2024 × Gen Beta 2025+',
    role: 'Builder, kreator, kakak yang nyemangatin',
    intro:
      'Gue bikin situs, alat kecil, dan cerita yang bikin belajar kerasa lebih gampang. Ini portfolio gue, sekalian pesan buat Gen Alpha dan Gen Beta: lo gak perlu jadi sigma buat jadi orang yang berguna.',
    marquee: ['GAS TERUS', 'NO CAP', 'AURA +9000', 'LEVEL UP', 'BELAJAR DULU', 'COBA AJA', 'W MOVE', 'JANGAN NYERAH'],
  },
}

const en: Content = {
  projects: {
    'aura-farming': {
      title: 'Aura Farming 101',
      client: 'SMAN 8 Jakarta',
      category: 'Education site',
      summary: 'A site that teaches the healthy version of “aura”: small habits built daily, not flexing on the feed.',
      role: ['Research', 'Design', 'Development'],
      deliverables: ['12-page site', 'Habit quiz', 'Print poster'],
      body: [
        'The phrase “aura farming” comes from how kids measure status now: the calmer you look, the more respect you get. The problem is that what looks cool on a feed usually makes everyone else feel worse.',
        'So I turned the definition around. On this site, aura is counted from things you can repeat: enough sleep, ten minutes of reading, moving your body, helping one person. A short quiz gives honest answers instead of fake praise.',
        'The school uses it in counselling sessions, and the printed version hangs on the notice board. The digital version was opened 4,000 times in its first month.',
      ],
    },
    'no-cap-notes': {
      title: 'No Cap Notes',
      client: 'Self-initiated',
      category: 'Digital notes',
      summary: 'One class worth of notes, gathered in a single place: searchable, commentable, never lost in the group chat.',
      role: ['Design', 'Development'],
      deliverables: ['Notes site', 'Search', 'Tag system'],
      body: [
        'Before every test the class chat fills up with “anyone got notes?” — then it drowns between stickers and other messages. Even good notes disappear after a week.',
        'No Cap Notes keeps notes per subject, with topic tags and search. Anyone can add, but whoever corrects has to name a source. No notes without a paper trail.',
        'The day before semester exams, the notes were opened 900 times. That was the moment it proved its worth.',
      ],
    },
    'sigma-study-kit': {
      title: 'Sigma Study Kit',
      client: 'Student council, SMAN 8',
      category: 'Web app',
      summary: 'A tool that turns a pile of homework deadlines into a daily study plan — spread out, not panic the night before.',
      role: ['Product design', 'Development'],
      deliverables: ['Web app', 'Automatic schedule', 'Teacher guide'],
      body: [
        'This project came out of an unhealthy habit: every assignment done the night before it was due. Not laziness — nobody had helped them count the time.',
        'Put your deadlines in, get a plan per day, including empty days for rest. No streaks to feel guilty about, no midnight notifications.',
        'Three classes used it for a full semester. Late submissions dropped from half to a quarter.',
      ],
    },
    'skibidi-radio': {
      title: 'Skibidi Radio',
      client: 'Podel Session',
      category: 'Audio site',
      summary: 'A study-focus playlist made of songs your friends sent in — not an algorithm chasing views.',
      role: ['Art direction', 'Development'],
      deliverables: ['Player site', 'Community curation', 'Visual identity'],
      body: [
        'A deliberately silly name with a serious job: one place for music that lets people sit down and get something done. Every track was submitted by a member.',
        'The player is one button. No recommendations, no endless autoplay, no ads. Each playlist has a time limit, so it stops on its own.',
        'The two most-used sessions: “study 45 minutes” and “homework at 9pm”.',
      ],
    },
    'level-up-locker': {
      title: 'Level Up Locker',
      client: 'Self-initiated',
      category: 'Habit tracker',
      summary: 'A habit tracker that measures what actually improves your life, not a streak on social media.',
      role: ['Design', 'Development'],
      deliverables: ['Web app', 'Progress board', 'Rest mode'],
      body: [
        'Habit apps usually make you feel like a failure after one missed day. That is a cruel design for students with packed schedules.',
        'Level Up Locker has a “rest mode” that switches on automatically during exams or illness. Progress is counted monthly, so one missed day does not wipe everything out.',
        'Eighty people use it weekly, and the most-picked habit is not “exercise” — it is “sleep before 11pm”.',
      ],
    },
    'lore-sekolah': {
      title: 'Lore Sekolah',
      client: 'Photo project',
      category: 'Photo and story',
      summary: 'A series of photos and short stories about the corners of school that never make anyone’s feed.',
      role: ['Photography', 'Writing'],
      deliverables: ['24 photos', 'Gallery site', 'Two workshops'],
      body: [
        'Every school has its own lore: the parking guy who knows every motorbike, the legendary back bench, the lab window that is always dusty.',
        'I shot twenty-four small moments over six months, then wrote one paragraph per photo — from conversations with the people in them, not from imagination.',
        'The work hung in the school corridor and became a photography workshop for tenth graders. A few of them started carrying their own cameras afterwards.',
      ],
    },
  },
  services: [
    {
      title: 'Web & code',
      body: 'Sites, small web apps, and anything that has to run in a browser. Built tidy, fast, and easy to maintain yourself — no paying someone every time you change one word.',
    },
    {
      title: 'Visual design',
      body: 'Layout, type, and colour that are bold but still readable on a phone. Not a template with the text swapped out.',
    },
    {
      title: 'Content & story',
      body: 'Writing, photography, and short scripts for school or community events. Making something people read to the end, not just scroll past.',
    },
    {
      title: 'Teaching',
      body: 'Small classes and mentoring for friends who want to build a website from zero. Slowly, until they can do it alone. No gatekeeping, no making anyone feel stupid.',
    },
  ],
  testimonials: [
    {
      quote: 'He is the one who taught the kids in my class that consistency is cooler than going viral once. You can see the proof in their grades.',
      name: 'Bu Ratna',
      role: 'Homeroom teacher, SMAN 8',
    },
    {
      quote: 'I asked how to build a website and he answered patiently until I understood. He never made me feel like I started too late.',
      name: 'Dita',
      role: 'Classmate',
    },
    {
      quote: 'My brother says failing means you are still practising. Now I am not scared of getting it wrong.',
      name: 'Birru',
      role: 'Little brother, 9',
    },
  ],
  experience: [
    { period: '2024 – now', title: 'Independent builder', detail: 'Building sites and learning tools for schools, communities, and my own projects' },
    { period: '2023 – 2024', title: 'Small freelance work', detail: 'Posters, video edits, and the first site I got paid for: Rp 250k' },
    { period: '2022 – 2023', title: 'Starting from zero', detail: 'Self-taught on YouTube, broke a laptop, then started again' },
  ],
  pepTalk: [
    {
      tag: 'For Gen Alpha',
      age: 'born 2010 – 2024',
      title: 'You are not late.',
      body: 'You are not a quarter of a century old yet, but the feed already makes you feel behind. That is a lie. What looks “already made” on screen is usually just the highlight reel.',
      points: [
        'One skill, twenty minutes a day — a year from now you are on another level.',
        'Not everything needs recording. Some process is stronger when nobody is watching.',
        'If today you can only do one small thing, that still counts as a W.',
      ],
    },
    {
      tag: 'For Gen Beta',
      age: 'born 2025 and after',
      title: 'Your world will be different.',
      body: 'You are growing up with tools that can make anything in seconds. That is cool, but what makes you matter is not the tool — it is what you decide to build with it.',
      points: [
        'Learn one thing deeply, not a hundred things just enough to look like it.',
        'Ask “why” more often than “how”.',
        'Look after the people around you. No machine can replace that.',
      ],
    },
  ],
  ui: {
    docTitle: 'Assalimi — Portfolio & Pep Talk for Gen Alpha',
    navWork: 'Work',
    navAbout: 'About',
    navContact: 'Contact',
    langLabel: 'Switch language',
    themeToDark: 'Use dark theme',
    themeToLight: 'Use light theme',
    preloader: 'Let’s go',
    heroBadge: 'Portfolio + pep talk',
    heroWork: 'See the work',
    heroPep: 'Read the pep talk',
    whyLines: ['Why this', 'site exists'],
    whyBody: [
      'I have been building websites since tenth grade, starting on a laptop with a noisy fan. Three years later the project I am proudest of is not the best-looking one — it is the one that let other people learn too.',
      'So this page does two jobs: a portfolio for people who want to work with me, and a pep talk for Gen Alpha just getting started, plus Gen Beta who were not born when I wrote this.',
    ],
    whyLink: 'The longer version',
    workLines: ['Selected work'],
    workCount: '{n} projects, 2024 to now',
    levelLines: ['Level up'],
    levelBody: 'My rank did not come from one viral moment. These are three levels I actually went through, failure included.',
    skillLines: ['What I do'],
    skillBody: 'Four things, done properly. Most projects use two of them.',
    pepLines: ['Pep talk', 'for two generations'],
    testimonyAria: 'Quote {n}',
    testimonyNext: 'Next',
    aboutLines: ['Builder, creator,', 'the brother who hypes you up'],
    aboutLead: 'It started with a question: why can one website make people believe in something? Chasing that answer is how I learned to code.',
    aboutBody: [
      'For the last three years I have built sites for schools, communities, and personal projects. Most started from a small problem: notes that got lost, a schedule in chaos, a friend who wanted to learn but did not know where to begin.',
      'What I believe: good work comes from repeating, not from talent falling out of the sky. The first version of this website was ugly, and that is part of the story.',
      'For Gen Alpha just starting: you are allowed to be slow, just do not stop. For Gen Beta who will read this later: your world will move faster, but the things that make you useful stay the same — willing to learn, willing to listen, willing to help.',
    ],
    aboutJourney: 'Journey',
    aboutStats: [
      ['3', 'years of self-teaching'],
      ['6', 'projects shipped'],
      ['1', 'little brother taught'],
    ],
    workBack: 'All work',
    labelClient: 'For',
    labelYear: 'Year',
    labelRole: 'Role',
    labelDeliverables: 'Deliverables',
    openSite: 'Open the site',
    nextProject: 'Next project',
    cardHover: 'Open the story',
    footerTop: 'Want to build',
    footerBefore: 'something',
    footerAccent: 'together',
    openForWork: 'Open for projects next quarter',
    fullyBooked: 'Fully booked, but you can still say hi',
    footerBlurb: 'Need a site for your class, community, or your own project? Just tell me — you do not need a complete idea. Half an idea is often enough to start.',
    formDoneTitle: 'Thank you',
    formDoneBody: 'Your message is in the CMS inbox. I read everything and usually reply within a few days.',
    formNote: 'Your message goes to the CMS inbox. Leave an email so it is easy to reply.',
    formName: 'Your name',
    formEmail: 'Email',
    formMessage: 'Tell me a little about the project',
    formSend: 'Send',
    formSending: 'Sending…',
    formError: 'Could not send. Try again.',
    audienceLabel: 'Gen Alpha 2010–2024 × Gen Beta 2025+',
    role: 'Builder, creator, the brother who hypes you up',
    intro:
      'I build sites, small tools, and stories that make learning feel easier. This is my portfolio, plus a message for Gen Alpha and Gen Beta: you do not need to be sigma to be someone useful.',
    marquee: ['KEEP GOING', 'NO CAP', 'AURA +9000', 'LEVEL UP', 'STUDY FIRST', 'JUST TRY', 'W MOVE', 'DON’T QUIT'],
  },
}

export const content: Record<Lang, Content> = { id, en }

export function projectsFor(lang: Lang): Project[] {
  return projectMeta.map((meta) => ({ ...meta, ...content[lang].projects[meta.slug] }))
}
