# Tema WordPress Assalimi

Situs di root repo tetap situs statis (Vite/React) yang tayang di `ngoprekbareng.vercel.app`.
Folder ini berisi **tema WordPress** untuk desain yang sama, plus instalasi WordPress lokal
supaya konten bisa diedit lewat CMS.

## Buka CMS (instalasi lokal)

```bash
bun run wp:setup    # sekali: PHP statis + WordPress + SQLite + seed konten
bun run wp:serve    # jalankan di 0.0.0.0:3000
```

- Situs: `http://127.0.0.1:3000` (atau hostname preview chat, port 3000)
- Admin: `/wp-admin`
- User: `assalimi` — password: `NgoprekBareng!2026`

Instalasi ada di `.wp-local/` (di-gitignore): PHP statis, WordPress core, dan database SQLite.
Tidak butuh MySQL, root, atau Docker.

## Yang bisa diedit dari wp-admin

- **Projek** — judul, isi, ringkasan, gambar unggulan, tahun, klien, kategori, peran, hasil,
  warna latar, ukuran kartu, plus versi bahasa Inggris tiap field.
- **Layanan, Testimoni, Pengalaman, Pep talk** — masing-masing CPT dengan field ID + EN.
- **Konten Situs** — semua teks section, label navigasi, identitas, sosial, dan teks form.
- **Pesan masuk** — form kontak di footer menyimpan pesan ke sini dan meneruskannya via email.

Bahasa: `ID` default, `EN` lewat tombol di navigasi (`?lang=en`, disimpan di cookie).
Field EN yang kosong otomatis memakai versi ID.

## Alur konten

`src/data/site.ts` masih jadi sumber awal. Setelah mengubahnya:

```bash
bun run wp:export                                   # -> wordpress/content.json + inc/defaults.php
php .wp-local/wp-cli/wp eval-file wordpress/seed.php --path=.wp-local/site
```

Setelah mengubah kelas Tailwind di template PHP:

```bash
bun run wp:css                                      # -> assets/theme.css + assets/fonts/
```

## Pasang di hosting WordPress sungguhan

Vercel tidak bisa menjalankan PHP, jadi tema ini perlu hosting WordPress (Hostinger,
SiteGround, WP Engine, dsb.):

1. Zip folder `wordpress/theme/assalimi` (atau pakai `wordpress/assalimi-theme.zip`).
2. wp-admin → Appearance → Themes → Add New → Upload Theme → Activate.
3. Isi konten: CPT dan halaman "Konten Situs" (atau impor lewat WP-CLI:
   `wp eval-file wordpress/seed.php` setelah `content.json` diunggah).
4. Buat halaman dengan template **Tentang** untuk halaman about.

Catatan: snippet `wp-config-local.php` hanya untuk instalasi lokal ini (hostname dinamis);
jangan dipakai di produksi.
