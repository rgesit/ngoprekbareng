<?php
/**
 * Tema Assalimi: semua isi situs bisa diedit dari wp-admin.
 *
 * Model konten:
 *  - CPT project / service / testimonial / experience / pep_talk / message
 *  - Opsi "Konten Situs" untuk teks sections, label, dan identitas
 *  - Setiap teks punya pasangan ID dan EN; EN kosong = pakai versi ID
 *
 * @package Assalimi
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'AL_VERSION', '1.0.0' );

/* -------------------------------------------------------------------------
 * Bahasa (ID default, EN lewat ?lang=en atau cookie)
 * ---------------------------------------------------------------------- */

/**
 * Bahasa aktif untuk request ini.
 */
function al_lang(): string {
	static $lang = null;

	if ( null !== $lang ) {
		return $lang;
	}

	if ( isset( $_GET['lang'] ) && in_array( $_GET['lang'], array( 'id', 'en' ), true ) ) {
		$lang = (string) $_GET['lang'];
	} elseif ( isset( $_COOKIE['al_lang'] ) && 'en' === $_COOKIE['al_lang'] ) {
		$lang = 'en';
	} else {
		$lang = 'id';
	}

	return $lang;
}

/**
 * Simpan pilihan bahasa ke cookie supaya halaman berikutnya ikut.
 */
function al_remember_lang(): void {
	if ( ! isset( $_GET['lang'] ) || headers_sent() ) {
		return;
	}
	if ( ! in_array( $_GET['lang'], array( 'id', 'en' ), true ) ) {
		return;
	}
	setcookie( 'al_lang', sanitize_text_field( wp_unslash( $_GET['lang'] ) ), time() + YEAR_IN_SECONDS, '/' );
}
add_action( 'init', 'al_remember_lang', 1 );

/**
 * URL halaman saat ini dengan bahasa lain.
 */
function al_lang_url( string $lang ): string {
	$current = home_url( add_query_arg( array() ) );
	return add_query_arg( 'lang', $lang, remove_query_arg( 'lang', $current ) );
}

/* -------------------------------------------------------------------------
 * Opsi tema
 * ---------------------------------------------------------------------- */

/**
 * Nilai bawaan yang di-generate dari src/data/site.ts.
 */
function al_defaults(): array {
	static $defaults = null;

	if ( null === $defaults ) {
		$file     = get_template_directory() . '/inc/defaults.php';
		$defaults = file_exists( $file ) ? require $file : array(
			'shared' => array(),
			'id'     => array(),
			'en'     => array(),
		);
	}

	return $defaults;
}

/**
 * Nilai identitas (tidak diterjemahkan).
 *
 * @param string $key Nama field.
 * @return mixed
 */
function al_shared( string $key, $fallback = '' ) {
	$stored = get_option( 'al_shared' );
	$value  = is_array( $stored ) && isset( $stored[ $key ] ) && '' !== $stored[ $key ] ? $stored[ $key ] : null;

	if ( null === $value ) {
		$defaults = al_defaults();
		$value    = $defaults['shared'][ $key ] ?? $fallback;
	}

	return $value;
}

/**
 * Baris-baris dari nilai identitas.
 */
function al_shared_lines( string $key ): array {
	return al_split_lines( (string) al_shared( $key ) );
}

/**
 * URL gambar dari opsi identitas (disimpan sebagai ID lampiran media).
 */
function al_image_url( string $key, string $fallback = '' ): string {
	$id  = (int) al_shared( $key );
	$url = $id ? wp_get_attachment_image_url( $id, 'al-hero' ) : '';

	return $url ? $url : $fallback;
}

/**
 * Teks section/label sesuai bahasa aktif.
 */
function al_opt( string $key ): string {
	$lang  = al_lang();
	$value = '';

	$stored = get_option( 'en' === $lang ? 'al_opt_en' : 'al_opt' );
	if ( is_array( $stored ) && isset( $stored[ $key ] ) && '' !== $stored[ $key ] ) {
		$value = $stored[ $key ];
	}

	// Versi EN kosong: tampilkan versi ID supaya halaman tidak bolong.
	if ( '' === $value && 'en' === $lang ) {
		$stored = get_option( 'al_opt' );
		if ( is_array( $stored ) && isset( $stored[ $key ] ) ) {
			$value = $stored[ $key ];
		}
	}

	if ( '' === $value ) {
		$defaults = al_defaults();
		$value    = $defaults[ $lang ][ $key ] ?? ( $defaults['id'][ $key ] ?? '' );
	}

	return is_array( $value ) ? implode( "\n", array_map( 'strval', $value ) ) : (string) $value;
}

function al_split_lines( string $raw ): array {
	$lines = preg_split( '/\r\n|\r|\n/', $raw );
	$lines = array_map( 'trim', $lines ? $lines : array() );

	return array_values( array_filter( $lines, 'strlen' ) );
}

function al_lines( string $key ): array {
	return al_split_lines( al_opt( $key ) );
}

/* -------------------------------------------------------------------------
 * Setup tema
 * ---------------------------------------------------------------------- */

function al_setup(): void {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'html5', array( 'style', 'script', 'gallery', 'caption', 'search-form' ) );
	add_theme_support( 'align-wide' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_image_size( 'al-card', 1400, 1100, true );
	add_image_size( 'al-hero', 1800, 1200, true );
}
add_action( 'after_setup_theme', 'al_setup' );

function al_assets(): void {
	$dir = get_template_directory();
	$uri = get_template_directory_uri();

	$css = $dir . '/assets/theme.css';
	wp_enqueue_style( 'al-theme', $uri . '/assets/theme.css', array(), file_exists( $css ) ? (string) filemtime( $css ) : AL_VERSION );

	$js = $dir . '/assets/js/theme.js';
	wp_enqueue_script( 'al-theme', $uri . '/assets/js/theme.js', array(), file_exists( $js ) ? (string) filemtime( $js ) : AL_VERSION, true );

	wp_localize_script(
		'al-theme',
		'AL',
		array(
			'ajax'    => admin_url( 'admin-ajax.php' ),
			'nonce'   => wp_create_nonce( 'al_contact' ),
			'lang'    => al_lang(),
			'strings' => array(
				'sending'   => al_opt( 'formSending' ),
				'error'     => al_opt( 'formError' ),
				'doneTitle' => al_opt( 'formDoneTitle' ),
				'doneBody'  => al_opt( 'formDoneBody' ),
			),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'al_assets' );

function al_document_title( string $title ): string {
	if ( is_front_page() ) {
		return al_opt( 'docTitle' );
	}

	return $title;
}
add_filter( 'pre_get_document_title', 'al_document_title' );

function al_html_lang( string $output ): string {
	return 'lang="' . esc_attr( al_lang() ) . '"';
}
add_filter( 'language_attributes', 'al_html_lang' );

/* -------------------------------------------------------------------------
 * Custom post types
 * ---------------------------------------------------------------------- */

function al_register_types(): void {
	$common = array(
		'public'        => false,
		'show_ui'       => true,
		'show_in_rest'  => true,
		'menu_position' => 25,
		'supports'      => array( 'title', 'editor', 'page-attributes', 'revisions' ),
	);

	register_post_type(
		'project',
		array(
			'labels'       => array(
				'name'          => 'Projek',
				'singular_name' => 'Projek',
				'add_new_item'  => 'Tambah projek',
				'edit_item'     => 'Edit projek',
			),
			'public'       => true,
			'has_archive'  => 'karya',
			'rewrite'      => array( 'slug' => 'karya' ),
			'menu_icon'    => 'dashicons-portfolio',
			'show_in_rest' => true,
			'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes', 'revisions' ),
		)
	);

	register_post_type(
		'service',
		array_merge(
			$common,
			array(
				'labels'    => array(
					'name'          => 'Layanan',
					'singular_name' => 'Layanan',
					'add_new_item'  => 'Tambah layanan',
				),
				'menu_icon' => 'dashicons-hammer',
			)
		)
	);

	register_post_type(
		'testimonial',
		array_merge(
			$common,
			array(
				'labels'    => array(
					'name'          => 'Testimoni',
					'singular_name' => 'Testimoni',
					'add_new_item'  => 'Tambah testimoni',
				),
				'menu_icon' => 'dashicons-format-quote',
			)
		)
	);

	register_post_type(
		'experience',
		array_merge(
			$common,
			array(
				'labels'    => array(
					'name'          => 'Pengalaman',
					'singular_name' => 'Pengalaman',
					'add_new_item'  => 'Tambah pengalaman',
				),
				'menu_icon' => 'dashicons-chart-line',
			)
		)
	);

	register_post_type(
		'pep_talk',
		array_merge(
			$common,
			array(
				'labels'    => array(
					'name'          => 'Pep talk',
					'singular_name' => 'Pep talk',
					'add_new_item'  => 'Tambah pep talk',
				),
				'menu_icon' => 'dashicons-megaphone',
			)
		)
	);

	register_post_type(
		'message',
		array(
			'labels'    => array(
				'name'          => 'Pesan masuk',
				'singular_name' => 'Pesan',
			),
			'public'    => false,
			'show_ui'   => true,
			'menu_icon' => 'dashicons-email-alt',
			'supports'  => array( 'title', 'editor' ),
			'capabilities' => array( 'create_posts' => 'do_not_allow' ),
			'map_meta_cap' => true,
		)
	);
}
add_action( 'init', 'al_register_types' );

/* -------------------------------------------------------------------------
 * Field tambahan per konten (ID + EN)
 * ---------------------------------------------------------------------- */

/**
 * Daftar field meta tiap post type: key => [label, tipe].
 */
function al_meta_defs( string $type ): array {
	switch ( $type ) {
		case 'project':
			return array(
				'year'         => array( 'Tahun', 'text' ),
				'client_id'    => array( 'Klien (ID)', 'text' ),
				'client_en'    => array( 'Klien (EN)', 'text' ),
				'category_id'  => array( 'Kategori (ID)', 'text' ),
				'category_en'  => array( 'Kategori (EN)', 'text' ),
				'summary_id'   => array( 'Ringkasan (ID, fallback excerpt)', 'textarea' ),
				'summary_en'   => array( 'Ringkasan (EN)', 'textarea' ),
				'role_id'      => array( 'Peran (ID, pisahkan dengan koma)', 'text' ),
				'role_en'      => array( 'Peran (EN)', 'text' ),
				'deliverables_id' => array( 'Hasil (ID, pisahkan dengan koma)', 'text' ),
				'deliverables_en' => array( 'Hasil (EN)', 'text' ),
				'body_en'      => array( 'Isi bahasa Inggris (satu paragraf per baris)', 'textarea' ),
				'tint'         => array( 'Warna latar (hex, mis. #d9ff3f)', 'text' ),
				'size'         => array( 'Ukuran kartu (large / small)', 'text' ),
				'link'         => array( 'URL situs projek (opsional)', 'text' ),
			);
		case 'service':
			return array( 'body_en' => array( 'Isi bahasa Inggris', 'textarea' ) );
		case 'testimonial':
			return array(
				'role_id' => array( 'Jabatan (ID)', 'text' ),
				'role_en' => array( 'Jabatan (EN)', 'text' ),
				'body_en' => array( 'Kutipan bahasa Inggris', 'textarea' ),
			);
		case 'experience':
			return array(
				'period_id' => array( 'Periode (ID)', 'text' ),
				'period_en' => array( 'Periode (EN)', 'text' ),
				'body_en'   => array( 'Detail bahasa Inggris', 'textarea' ),
			);
		case 'pep_talk':
			return array(
				'tag_id'    => array( 'Tag (ID)', 'text' ),
				'tag_en'    => array( 'Tag (EN)', 'text' ),
				'age_id'    => array( 'Rentang usia (ID)', 'text' ),
				'age_en'    => array( 'Rentang usia (EN)', 'text' ),
				'points_id' => array( 'Poin (ID, satu per baris)', 'textarea' ),
				'points_en' => array( 'Poin (EN, satu per baris)', 'textarea' ),
				'body_en'   => array( 'Isi bahasa Inggris', 'textarea' ),
			);
	}

	return array();
}

function al_add_meta_boxes(): void {
	foreach ( array( 'project', 'service', 'testimonial', 'experience', 'pep_talk' ) as $type ) {
		add_meta_box(
			'al_details',
			'Detail konten (ID + EN)',
			'al_render_meta_box',
			$type,
			'normal',
			'high',
			array( 'type' => $type )
		);
	}
}
add_action( 'add_meta_boxes', 'al_add_meta_boxes' );

function al_render_meta_box( WP_Post $post, array $box ): void {
	$type = (string) ( $box['args']['type'] ?? $post->post_type );
	$defs = al_meta_defs( $type );

	wp_nonce_field( 'al_meta', 'al_meta_nonce' );
	echo '<table class="form-table" role="presentation"><tbody>';

	foreach ( $defs as $key => $def ) {
		$value = (string) get_post_meta( $post->ID, '_al_' . $key, true );
		$id    = 'al_meta_' . $key;
		echo '<tr><th scope="row"><label for="' . esc_attr( $id ) . '">' . esc_html( $def[0] ) . '</label></th><td>';
		if ( 'textarea' === $def[1] ) {
			echo '<textarea class="large-text" rows="4" id="' . esc_attr( $id ) . '" name="al_meta[' . esc_attr( $key ) . ']">' . esc_textarea( $value ) . '</textarea>';
		} else {
			echo '<input type="text" class="regular-text" id="' . esc_attr( $id ) . '" name="al_meta[' . esc_attr( $key ) . ']" value="' . esc_attr( $value ) . '">';
		}
		echo '</td></tr>';
	}

	echo '</tbody></table>';
	echo '<p class="description">Isi utama (judul, editor, kutipan ringkas) dipakai untuk bahasa Indonesia. Field EN kosong otomatis memakai versi ID.</p>';
}

function al_save_meta( int $post_id ): void {
	if ( ! isset( $_POST['al_meta_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['al_meta_nonce'] ) ), 'al_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$defs = al_meta_defs( (string) get_post_type( $post_id ) );
	$data = isset( $_POST['al_meta'] ) && is_array( $_POST['al_meta'] ) ? wp_unslash( $_POST['al_meta'] ) : array();

	foreach ( $defs as $key => $def ) {
		$raw   = isset( $data[ $key ] ) ? (string) $data[ $key ] : '';
		$value = 'textarea' === $def[1] ? sanitize_textarea_field( $raw ) : sanitize_text_field( $raw );

		if ( '' === $value ) {
			delete_post_meta( $post_id, '_al_' . $key );
		} else {
			update_post_meta( $post_id, '_al_' . $key, $value );
		}
	}
}
add_action( 'save_post', 'al_save_meta' );

/**
 * Nilai meta sesuai bahasa, dengan fallback ke versi ID.
 */
function al_meta( int $post_id, string $key ): string {
	$lang  = al_lang();
	$value = (string) get_post_meta( $post_id, '_al_' . $key . '_' . $lang, true );

	if ( '' === $value && 'en' === $lang ) {
		$value = (string) get_post_meta( $post_id, '_al_' . $key . '_id', true );
	}

	return $value;
}

/**
 * Isi panjang sesuai bahasa (ID memakai editor, EN memakai field body_en).
 */
function al_content( int $post_id, bool $autop = true ): string {
	if ( 'en' === al_lang() ) {
		$en = (string) get_post_meta( $post_id, '_al_body_en', true );
		if ( '' !== $en ) {
			$html = wp_kses_post( $en );
			return $autop ? wpautop( $html ) : $html;
		}
	}

	$html = (string) get_post_field( 'post_content', $post_id );
	return $autop ? apply_filters( 'the_content', $html ) : $html;
}

/* -------------------------------------------------------------------------
 * Halaman "Konten Situs"
 * ---------------------------------------------------------------------- */

/**
 * Skema field opsi: grup => [judul, [key => [label, tipe]]].
 */
function al_option_groups(): array {
	return array(
		'hero'   => array(
			'Hero',
			array(
				'heroBadge'     => array( 'Badge kecil', 'text' ),
				'audienceLabel' => array( 'Label audiens', 'text' ),
				'role'          => array( 'Peran', 'text' ),
				'intro'         => array( 'Paragraf pembuka', 'textarea' ),
				'heroWork'      => array( 'Tombol "lihat karya"', 'text' ),
				'heroPep'       => array( 'Tombol "pep talk"', 'text' ),
				'marquee'       => array( 'Teks marquee (satu per baris)', 'list' ),
				'docTitle'      => array( 'Judul dokumen / SEO', 'text' ),
			),
		),
		'why'    => array(
			'Bagian "Kenapa"',
			array(
				'whyLines' => array( 'Judul (satu per baris)', 'list' ),
				'whyBody'  => array( 'Paragraf (satu per baris)', 'list' ),
				'whyLink'  => array( 'Teks tautan', 'text' ),
			),
		),
		'work'   => array(
			'Bagian Karya',
			array(
				'workLines' => array( 'Judul (satu per baris)', 'list' ),
				'workCount' => array( 'Keterangan jumlah ({n} = jumlah projek)', 'text' ),
				'cardHover' => array( 'Label saat kartu di-hover', 'text' ),
			),
		),
		'level'  => array(
			'Bagian Level Up',
			array(
				'levelLines' => array( 'Judul (satu per baris)', 'list' ),
				'levelBody'  => array( 'Deskripsi', 'textarea' ),
			),
		),
		'skill'  => array(
			'Bagian Skill',
			array(
				'skillLines' => array( 'Judul (satu per baris)', 'list' ),
				'skillBody'  => array( 'Deskripsi', 'textarea' ),
			),
		),
		'pep'    => array(
			'Bagian Pep Talk',
			array(
				'pepLines' => array( 'Judul (satu per baris)', 'list' ),
			),
		),
		'about'  => array(
			'Halaman Tentang',
			array(
				'aboutLines'   => array( 'Judul (satu per baris)', 'list' ),
				'aboutLead'    => array( 'Paragraf pembuka', 'textarea' ),
				'aboutBody'    => array( 'Paragraf isi (satu per baris)', 'list' ),
				'aboutJourney' => array( 'Label perjalanan', 'text' ),
				'aboutStats'   => array( 'Statistik (format: angka|label, satu per baris)', 'list' ),
			),
		),
		'footer' => array(
			'Footer & form kontak',
			array(
				'footerTop'    => array( 'Baris 1 judul', 'text' ),
				'footerBefore' => array( 'Baris 2 sebelum kata aksen', 'text' ),
				'footerAccent' => array( 'Kata beraksen', 'text' ),
				'footerBlurb'  => array( 'Deskripsi', 'textarea' ),
				'openForWork'  => array( 'Status: buka projek', 'text' ),
				'fullyBooked'  => array( 'Status: penuh', 'text' ),
				'formNote'     => array( 'Catatan form', 'text' ),
				'formName'     => array( 'Placeholder nama', 'text' ),
				'formEmail'    => array( 'Placeholder email', 'text' ),
				'formMessage'  => array( 'Placeholder pesan', 'text' ),
				'formSend'     => array( 'Tombol kirim', 'text' ),
				'formSending'  => array( 'Tombol saat mengirim', 'text' ),
				'formError'    => array( 'Pesan error', 'text' ),
				'formDoneTitle' => array( 'Judul setelah terkirim', 'text' ),
				'formDoneBody' => array( 'Isi setelah terkirim', 'text' ),
			),
		),
		'labels' => array(
			'Label & navigasi',
			array(
				'navWork'        => array( 'Nav: karya', 'text' ),
				'navAbout'       => array( 'Nav: tentang', 'text' ),
				'navContact'     => array( 'Nav: kontak', 'text' ),
				'langLabel'      => array( 'Label pengubah bahasa', 'text' ),
				'themeToLight'   => array( 'Label tombol ke tema terang', 'text' ),
				'themeToDark'    => array( 'Label tombol ke tema gelap', 'text' ),
				'preloader'      => array( 'Teks preloader', 'text' ),
				'workBack'       => array( 'Tautan "semua karya"', 'text' ),
				'labelClient'    => array( 'Label klien', 'text' ),
				'labelYear'      => array( 'Label tahun', 'text' ),
				'labelRole'      => array( 'Label peran', 'text' ),
				'labelDeliverables' => array( 'Label hasil', 'text' ),
				'openSite'       => array( 'Tautan buka situs', 'text' ),
				'nextProject'    => array( 'Label projek berikutnya', 'text' ),
				'testimonyAria'  => array( 'Aria label testimoni ({n})', 'text' ),
				'testimonyNext'  => array( 'Label tombol testimoni berikutnya', 'text' ),
			),
		),
	);
}

/**
 * Field identitas (satu bahasa).
 */
function al_identity_fields(): array {
	return array(
		'name'      => array( 'Nama', 'text' ),
		'handle'    => array( 'Handle', 'text' ),
		'location'  => array( 'Kota', 'text' ),
		'timezone'  => array( 'Timezone (mis. Asia/Jakarta)', 'text' ),
		'email'         => array( 'Email publik (tampil di footer)', 'text' ),
		'contact_email' => array( 'Email penerima form kontak (kosong = pakai email publik)', 'text' ),
		'portrait'      => array( 'Foto potret (beranda & halaman Tentang)', 'image' ),
		'available'     => array( 'Buka projek? (1 / 0)', 'text' ),
		'socials'   => array( 'Sosial (format: Label|URL, satu per baris)', 'list' ),
	);
}

function al_register_settings(): void {
	$sanitize = 'al_sanitize_option_array';

	register_setting( 'al_content', 'al_shared', array( 'type' => 'array', 'sanitize_callback' => $sanitize, 'default' => array() ) );
	register_setting( 'al_content', 'al_opt', array( 'type' => 'array', 'sanitize_callback' => $sanitize, 'default' => array() ) );
	register_setting( 'al_content', 'al_opt_en', array( 'type' => 'array', 'sanitize_callback' => $sanitize, 'default' => array() ) );
}
add_action( 'admin_init', 'al_register_settings' );

function al_sanitize_option_array( $input ): array {
	$out = array();

	if ( is_array( $input ) ) {
		foreach ( $input as $key => $value ) {
			$clean_key = preg_replace( '/[^A-Za-z0-9_]/', '', (string) $key );
			if ( '' === $clean_key || is_array( $value ) ) {
				continue;
			}
			$out[ $clean_key ] = sanitize_textarea_field( (string) $value );
		}
	}

	return $out;
}

function al_admin_field( string $option, string $key, string $label, string $type, string $value, string $placeholder ): void {
	$id = $option . '_' . $key;
	echo '<tr><th scope="row"><label for="' . esc_attr( $id ) . '">' . esc_html( $label ) . '</label></th><td>';

	if ( 'image' === $type ) {
		$attachment_id = absint( $value );
		$preview       = $attachment_id ? (string) wp_get_attachment_image_url( $attachment_id, 'medium' ) : '';
		echo '<div data-al-image-field>';
		echo '<input type="hidden" id="' . esc_attr( $id ) . '" name="' . esc_attr( $option . '[' . $key . ']' ) . '" value="' . esc_attr( (string) $attachment_id ) . '" data-al-image-input>';
		echo '<div data-al-image-preview>' . ( $preview ? '<img src="' . esc_url( $preview ) . '" alt="" style="max-width:240px;height:auto;display:block;border-radius:6px">' : '' ) . '</div>';
		echo '<p><button type="button" class="button" data-al-image-select>Pilih gambar</button> <button type="button" class="button-link-delete" data-al-image-clear>Hapus</button></p>';
		echo '<p class="description">Kosongkan untuk memakai gambar bawaan tema. Gambar diambil dari Media Library.</p>';
		echo '</div>';
	} elseif ( 'list' === $type || 'textarea' === $type ) {
		echo '<textarea class="large-text" rows="' . ( 'list' === $type ? '4' : '3' ) . '" id="' . esc_attr( $id ) . '" name="' . esc_attr( $option . '[' . $key . ']' ) . '" placeholder="' . esc_attr( $placeholder ) . '">' . esc_textarea( $value ) . '</textarea>';
	} else {
		echo '<input type="text" class="regular-text" id="' . esc_attr( $id ) . '" name="' . esc_attr( $option . '[' . $key . ']' ) . '" value="' . esc_attr( $value ) . '" placeholder="' . esc_attr( $placeholder ) . '">';
	}

	echo '</td></tr>';
}

function al_render_options(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$shared    = get_option( 'al_shared' );
	$shared    = is_array( $shared ) ? $shared : array();
	$id        = get_option( 'al_opt' );
	$id        = is_array( $id ) ? $id : array();
	$en        = get_option( 'al_opt_en' );
	$en        = is_array( $en ) ? $en : array();
	$defaults  = al_defaults();
	$groups    = al_option_groups();
	?>
	<div class="wrap">
		<h1>Konten Situs</h1>
		<p>Semua teks sections, label, dan identitas. Isi versi EN; kalau dibiarkan kosong, yang tampil versi ID.</p>
		<form method="post" action="options.php">
			<?php settings_fields( 'al_content' ); ?>

			<h2>Identitas</h2>
			<table class="form-table" role="presentation"><tbody>
				<?php foreach ( al_identity_fields() as $key => $field ) : ?>
					<?php
						$stored = $shared[ $key ] ?? '';
						if ( is_array( $stored ) ) {
							$stored = implode( "\n", $stored );
						}
						al_admin_field( 'al_shared', $key, $field[0], $field[1], (string) $stored, (string) ( is_array( $defaults['shared'][ $key ] ?? '' ) ? implode( "\n", $defaults['shared'][ $key ] ) : ( $defaults['shared'][ $key ] ?? '' ) ) );
					?>
				<?php endforeach; ?>
			</tbody></table>

			<?php foreach ( $groups as $slug => $group ) : ?>
				<h2><?php echo esc_html( $group[0] ); ?></h2>
				<table class="form-table" role="presentation"><tbody>
					<?php foreach ( $group[1] as $key => $field ) : ?>
						<?php
							$value_id = isset( $id[ $key ] ) ? (string) $id[ $key ] : '';
							$value_en = isset( $en[ $key ] ) ? (string) $en[ $key ] : '';
							$def_id   = $defaults['id'][ $key ] ?? '';
							$def_en   = $defaults['en'][ $key ] ?? '';
							$def_id   = is_array( $def_id ) ? implode( "\n", $def_id ) : (string) $def_id;
							$def_en   = is_array( $def_en ) ? implode( "\n", $def_en ) : (string) $def_en;
							al_admin_field( 'al_opt', $key, $field[0] . ' — ID', $field[1], $value_id, $def_id );
							al_admin_field( 'al_opt_en', $key, $field[0] . ' — EN', $field[1], $value_en, $def_en );
						?>
					<?php endforeach; ?>
				</tbody></table>
			<?php endforeach; ?>

			<?php submit_button( 'Simpan konten' ); ?>
		</form>
	</div>
	<?php
}

function al_options_menu(): void {
	add_menu_page(
		'Konten Situs',
		'Konten Situs',
		'manage_options',
		'al-content',
		'al_render_options',
		'dashicons-edit-page',
		3
	);
}
add_action( 'admin_menu', 'al_options_menu' );

/**
 * Media picker untuk field gambar di halaman Konten Situs.
 */
function al_admin_assets( string $hook ): void {
	if ( 'toplevel_page_al-content' !== $hook ) {
		return;
	}

	wp_enqueue_media();
	wp_register_script( 'al-admin', false, array( 'jquery' ), AL_VERSION, true );
	wp_enqueue_script( 'al-admin' );
	wp_add_inline_script(
		'al-admin',
		<<<'JS'
	jQuery( function ( $ ) {
		$( document ).on( 'click', '[data-al-image-select]', function ( event ) {
			event.preventDefault();
			var wrap  = $( this ).closest( '[data-al-image-field]' );
			var frame = wp.media( {
				title: 'Pilih gambar',
				button: { text: 'Pakai gambar ini' },
				multiple: false
			} );
			frame.on( 'select', function () {
				var attachment = frame.state().get( 'selection' ).first().toJSON();
				var url = attachment.sizes && attachment.sizes.medium ? attachment.sizes.medium.url : attachment.url;
				wrap.find( '[data-al-image-input]' ).val( attachment.id );
				wrap.find( '[data-al-image-preview]' ).html( '<img src="' + url + '" alt="" style="max-width:240px;height:auto;display:block;border-radius:6px">' );
			} );
			frame.open();
		} );
		$( document ).on( 'click', '[data-al-image-clear]', function ( event ) {
			event.preventDefault();
			var wrap = $( this ).closest( '[data-al-image-field]' );
			wrap.find( '[data-al-image-input]' ).val( '' );
			wrap.find( '[data-al-image-preview]' ).empty();
		} );
	} );
JS
	);
}
add_action( 'admin_enqueue_scripts', 'al_admin_assets' );

/* -------------------------------------------------------------------------
 * Data projek + helper template
 * ---------------------------------------------------------------------- */

/**
 * Semua data satu projek sesuai bahasa aktif.
 */
function al_project_data( int $post_id = 0 ): array {
	$post_id = $post_id ? $post_id : get_the_ID();
	$summary = al_meta( $post_id, 'summary' );
	$tint    = (string) get_post_meta( $post_id, '_al_tint', true );
	$size    = (string) get_post_meta( $post_id, '_al_size', true );

	return array(
		'id'           => $post_id,
		'title'        => get_the_title( $post_id ),
		'year'         => (string) get_post_meta( $post_id, '_al_year', true ),
		'client'       => al_meta( $post_id, 'client' ),
		'category'     => al_meta( $post_id, 'category' ),
		'summary'      => '' !== $summary ? $summary : get_the_excerpt( $post_id ),
		'role'         => al_split_lines( str_replace( ',', "\n", al_meta( $post_id, 'role' ) ) ),
		'deliverables' => al_split_lines( str_replace( ',', "\n", al_meta( $post_id, 'deliverables' ) ) ),
		'body'         => al_content( $post_id ),
		'tint'         => '' !== $tint ? $tint : '#1b1b23',
		'size'         => 'large' === $size ? 'large' : 'small',
		'link'         => (string) get_post_meta( $post_id, '_al_link', true ),
		'cover'        => get_the_post_thumbnail_url( $post_id, 'al-card' ),
	);
}

function al_projects( int $limit = -1 ): WP_Query {
	return new WP_Query(
		array(
			'post_type'              => 'project',
			'posts_per_page'         => $limit,
			'orderby'                => array( 'menu_order' => 'ASC', 'date' => 'DESC' ),
			'no_found_rows'          => true,
			'ignore_sticky_posts'    => true,
			'update_post_term_cache' => false,
		)
	);
}

function al_items( string $type, int $limit = -1 ): WP_Query {
	return new WP_Query(
		array(
			'post_type'           => $type,
			'posts_per_page'      => $limit,
			'orderby'             => array( 'menu_order' => 'ASC', 'date' => 'ASC' ),
			'no_found_rows'       => true,
			'ignore_sticky_posts' => true,
		)
	);
}

/**
 * URL halaman yang memakai template Tentang.
 */
function al_about_url(): string {
	static $url = null;

	if ( null !== $url ) {
		return $url;
	}

	$pages = get_pages(
		array(
			'meta_key'   => '_wp_page_template',
			'meta_value' => 'page-templates/tentang.php',
			'number'     => 1,
		)
	);

	$url = $pages ? (string) get_permalink( $pages[0] ) : home_url( '/#kenapa' );

	return $url;
}

/**
 * Ikon garis sederhana (menggantikan lucide di versi React).
 */
function al_icon( string $name, string $class = 'size-4' ): string {
	$paths = array(
		'arrow-up-right' => '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
		'arrow-left'     => '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
		'plus'           => '<path d="M12 5v14"/><path d="M5 12h14"/>',
		'sun'            => '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/>',
		'moon'           => '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
	);

	if ( ! isset( $paths[ $name ] ) ) {
		return '';
	}

	return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' . esc_attr( $class ) . '" aria-hidden="true">' . $paths[ $name ] . '</svg>';
}

/* -------------------------------------------------------------------------
 * Form kontak (AJAX, tersimpan sebagai "Pesan masuk")
 * ---------------------------------------------------------------------- */

function al_handle_contact(): void {
	check_ajax_referer( 'al_contact', 'nonce' );

	$name    = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
	$email   = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	$message = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';

	if ( '' === $name || '' === $message || ! is_email( $email ) ) {
		wp_send_json_error( array( 'error' => al_opt( 'formError' ) ), 400 );
	}

	$post_id = wp_insert_post(
		array(
			'post_type'    => 'message',
			'post_status'  => 'private',
			'post_title'   => $name,
			'post_content' => $message,
		),
		true
	);

	if ( is_wp_error( $post_id ) ) {
		wp_send_json_error( array( 'error' => al_opt( 'formError' ) ), 500 );
	}

	update_post_meta( $post_id, '_al_email', $email );

	$recipient = (string) al_shared( 'contact_email' );
	if ( ! is_email( $recipient ) ) {
		$recipient = (string) al_shared( 'email' );
	}
	if ( ! is_email( $recipient ) ) {
		$recipient = (string) get_option( 'admin_email' );
	}

	wp_mail(
		$recipient,
		'Pesan baru dari ' . $name . ' — ' . (string) al_shared( 'name' ),
		$message . "\n\n" . __( 'Balas ke:', 'assalimi' ) . ' ' . $email,
		array( 'Reply-To: ' . $name . ' <' . $email . '>' )
	);

	wp_send_json_success( array( 'ok' => true ) );
}
add_action( 'wp_ajax_al_contact', 'al_handle_contact' );
add_action( 'wp_ajax_nopriv_al_contact', 'al_handle_contact' );

/**
 * Kolom email di daftar "Pesan masuk" biar gampang dibalas.
 */
function al_message_columns( array $columns ): array {
	$out = array();

	foreach ( $columns as $key => $label ) {
		$out[ $key ] = $label;
		if ( 'title' === $key ) {
			$out['al_email'] = 'Email';
		}
	}

	return $out;
}
add_filter( 'manage_message_posts_columns', 'al_message_columns' );

function al_message_column( string $column, int $post_id ): void {
	if ( 'al_email' !== $column ) {
		return;
	}

	$email = (string) get_post_meta( $post_id, '_al_email', true );
	echo $email ? '<a href="mailto:' . esc_attr( $email ) . '">' . esc_html( $email ) . '</a>' : '&mdash;';
}
add_action( 'manage_message_posts_custom_column', 'al_message_column', 10, 2 );

/* -------------------------------------------------------------------------
 * Kecil-kecil
 * ---------------------------------------------------------------------- */

/**
 * Baris jam lokal sesuai timezone situs.
 */
function al_local_time(): string {
	try {
		$date = new DateTime( 'now', new DateTimeZone( (string) al_shared( 'timezone', 'Asia/Jakarta' ) ) );
		return $date->format( 'H:i' );
	} catch ( Exception $e ) {
		return gmdate( 'H:i' );
	}
}

/**
 * Warna <meta name="theme-color">.
 */
function al_theme_color(): string {
	return 'dark';
}

function al_excerpt_more(): string {
	return '…';
}
add_filter( 'excerpt_more', 'al_excerpt_more' );
