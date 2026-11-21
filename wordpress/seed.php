<?php
/**
 * Isi CMS dari wordpress/content.json (hasil export src/data/site.ts).
 *
 *   wp theme activate assalimi
 *   wp eval-file wordpress/seed.php
 *
 * Aman dijalankan berulang: konten dicocokkan lewat slug.
 */

if ( ! defined( 'ABSPATH' ) ) {
	fwrite( STDERR, "Jalankan lewat WP-CLI: wp eval-file wordpress/seed.php\n" );
	return;
}

$al_file = __DIR__ . '/content.json';
$al_data = json_decode( (string) file_get_contents( $al_file ), true );

if ( ! is_array( $al_data ) ) {
	echo "content.json tidak terbaca.\n";
	return;
}

function al_seed_text( $value ): string {
	if ( ! is_array( $value ) ) {
		return (string) $value;
	}

	$lines = array();
	foreach ( $value as $item ) {
		// Baris berpasangan (mis. aboutStats => [angka, label]) jadi "angka|label".
		$lines[] = is_array( $item ) ? implode( '|', array_map( 'strval', $item ) ) : (string) $item;
	}

	return implode( "\n", $lines );
}

function al_seed_option_map( array $ui ): array {
	$out = array();
	foreach ( $ui as $key => $value ) {
		$out[ $key ] = al_seed_text( $value );
	}
	return $out;
}

/**
 * Impor satu file gambar ke media library, sekali saja.
 */
function al_seed_media( string $relative ): int {
	$source = dirname( __DIR__ ) . '/public/' . ltrim( $relative, '/' );

	if ( ! file_exists( $source ) ) {
		return 0;
	}

	$existing = get_posts(
		array(
			'post_type'      => 'attachment',
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'meta_key'       => '_al_seed_source',
			'meta_value'     => $relative,
		)
	);

	if ( $existing ) {
		return (int) $existing[0];
	}

	require_once ABSPATH . 'wp-admin/includes/image.php';

	$upload = wp_upload_bits( basename( $source ), null, (string) file_get_contents( $source ) );
	if ( ! empty( $upload['error'] ) ) {
		echo "Gagal upload {$relative}: {$upload['error']}\n";
		return 0;
	}

	$type       = wp_check_filetype( $upload['file'] );
	$attachment = array(
		'post_mime_type' => $type['type'] ? $type['type'] : 'image/jpeg',
		'post_title'     => sanitize_file_name( basename( $source ) ),
		'post_status'    => 'inherit',
		'post_content'   => '',
	);

	$attachment_id = wp_insert_attachment( $attachment, $upload['file'] );
	if ( is_wp_error( $attachment_id ) ) {
		return 0;
	}

	update_post_meta( $attachment_id, '_al_seed_source', $relative );
	wp_update_attachment_metadata( $attachment_id, wp_generate_attachment_metadata( $attachment_id, $upload['file'] ) );

	return (int) $attachment_id;
}

/**
 * Buat atau perbarui post berdasarkan slug.
 */
function al_seed_upsert( string $type, string $slug, array $post, array $meta ): int {
	$existing = get_page_by_path( $slug, OBJECT, $type );

	$post['post_type']   = $type;
	$post['post_name']   = $slug;
	$post['post_status'] = 'publish';

	if ( $existing ) {
		$post['ID'] = $existing->ID;
		$result     = wp_update_post( $post, true );
	} else {
		$result = wp_insert_post( $post, true );
	}

	if ( is_wp_error( $result ) ) {
		echo "Gagal menyimpan {$slug}: " . $result->get_error_message() . "\n";
		return 0;
	}

	foreach ( $meta as $key => $value ) {
		if ( '' === $value || null === $value ) {
			delete_post_meta( $result, '_al_' . $key );
			continue;
		}
		update_post_meta( $result, '_al_' . $key, $value );
	}

	return (int) $result;
}

/* Identitas. */
$al_identity = $al_data['identity'];
update_option(
	'al_shared',
	array(
		'name'      => $al_identity['name'],
		'handle'    => $al_identity['handle'],
		'location'  => $al_identity['location'],
		'timezone'  => $al_identity['timezone'],
		'email'     => $al_identity['email'],
		'available' => $al_identity['available'] ? '1' : '0',
		'socials'   => implode( "\n", $al_identity['socials'] ),
	)
);
update_option( 'blogname', $al_identity['name'] );

/* Teks UI dua bahasa. */
update_option( 'al_opt', al_seed_option_map( $al_data['ui']['id'] ) );
update_option( 'al_opt_en', al_seed_option_map( $al_data['ui']['en'] ) );

/* Projek. */
$al_order = 0;
foreach ( $al_data['projects'] as $al_project ) {
	$al_order++;
	$al_id = al_seed_upsert(
		'project',
		$al_project['slug'],
		array(
			'post_title'   => $al_project['id']['title'],
			'post_content' => implode( "\n\n", $al_project['id']['body'] ),
			'post_excerpt' => $al_project['id']['summary'],
			'menu_order'   => $al_order,
		),
		array(
			'year'             => $al_project['year'],
			'client_id'        => $al_project['id']['client'],
			'client_en'        => $al_project['en']['client'],
			'category_id'      => $al_project['id']['category'],
			'category_en'      => $al_project['en']['category'],
			'summary_id'       => $al_project['id']['summary'],
			'summary_en'       => $al_project['en']['summary'],
			'role_id'          => implode( ', ', $al_project['id']['role'] ),
			'role_en'          => implode( ', ', $al_project['en']['role'] ),
			'deliverables_id'  => implode( ', ', $al_project['id']['deliverables'] ),
			'deliverables_en'  => implode( ', ', $al_project['en']['deliverables'] ),
			'body_en'          => implode( "\n\n", $al_project['en']['body'] ),
			'tint'             => $al_project['tint'],
			'size'             => $al_project['size'],
			'link'             => $al_project['link'] ?? '',
		)
	);

	if ( $al_id ) {
		$al_image = al_seed_media( $al_project['cover'] );
		if ( $al_image ) {
			set_post_thumbnail( $al_id, $al_image );
		}
	}
}

/* Layanan. */
$al_id_lang = array_column( $al_data['services'], 'items', 'lang' );
$al_en_lang = array_column( $al_data['services'], 'items', 'lang' );
foreach ( $al_id_lang['id'] as $al_i => $al_service ) {
	$al_english = $al_en_lang['en'][ $al_i ]['body'] ?? '';
	al_seed_upsert(
		'service',
		'layanan-' . ( $al_i + 1 ),
		array(
			'post_title'   => $al_service['title'],
			'post_content' => $al_service['body'],
			'menu_order'   => $al_i + 1,
		),
		array( 'body_en' => $al_english )
	);
}

/* Testimoni. */
$al_id_lang = array_column( $al_data['testimonials'], 'items', 'lang' );
$al_en_lang = array_column( $al_data['testimonials'], 'items', 'lang' );
foreach ( $al_id_lang['id'] as $al_i => $al_testimonial ) {
	$al_english = $al_en_lang['en'][ $al_i ] ?? array();
	al_seed_upsert(
		'testimonial',
		'testimoni-' . ( $al_i + 1 ),
		array(
			'post_title'   => $al_testimonial['name'],
			'post_content' => $al_testimonial['quote'],
			'menu_order'   => $al_i + 1,
		),
		array(
			'role_id' => $al_testimonial['role'],
			'role_en' => $al_english['role'] ?? '',
			'body_en' => $al_english['quote'] ?? '',
		)
	);
}

/* Pengalaman. */
$al_id_lang = array_column( $al_data['experience'], 'items', 'lang' );
$al_en_lang = array_column( $al_data['experience'], 'items', 'lang' );
foreach ( $al_id_lang['id'] as $al_i => $al_experience ) {
	$al_english = $al_en_lang['en'][ $al_i ] ?? array();
	al_seed_upsert(
		'experience',
		'level-' . ( $al_i + 1 ),
		array(
			'post_title'   => $al_experience['title'],
			'post_content' => $al_experience['detail'],
			'menu_order'   => $al_i + 1,
		),
		array(
			'period_id' => $al_experience['period'],
			'period_en' => $al_english['period'] ?? '',
			'body_en'   => $al_english['detail'] ?? '',
		)
	);
}

/* Pep talk. */
$al_id_lang = array_column( $al_data['pepTalk'], 'items', 'lang' );
$al_en_lang = array_column( $al_data['pepTalk'], 'items', 'lang' );
foreach ( $al_id_lang['id'] as $al_i => $al_pep ) {
	$al_english = $al_en_lang['en'][ $al_i ] ?? array();
	al_seed_upsert(
		'pep_talk',
		'pep-talk-' . ( $al_i + 1 ),
		array(
			'post_title'   => $al_pep['title'],
			'post_content' => $al_pep['body'],
			'menu_order'   => $al_i + 1,
		),
		array(
			'tag_id'    => $al_pep['tag'],
			'tag_en'    => $al_english['tag'] ?? '',
			'age_id'    => $al_pep['age'],
			'age_en'    => $al_english['age'] ?? '',
			'points_id' => implode( "\n", $al_pep['points'] ),
			'points_en' => implode( "\n", $al_english['points'] ?? array() ),
			'body_en'   => $al_english['body'] ?? '',
		)
	);
}

/* Halaman Tentang. */
$al_about = get_page_by_path( 'tentang', OBJECT, 'page' );
$al_about_post = array(
	'post_type'   => 'page',
	'post_title'  => 'Tentang',
	'post_name'   => 'tentang',
	'post_status' => 'publish',
	'post_content' => $al_data['ui']['id']['aboutLead'],
);
if ( $al_about ) {
	$al_about_post['ID'] = $al_about->ID;
	$al_about_id         = wp_update_post( $al_about_post );
} else {
	$al_about_id = wp_insert_post( $al_about_post );
}
update_post_meta( $al_about_id, '_wp_page_template', 'page-templates/tentang.php' );
update_post_meta( $al_about_id, '_al_body_en', $al_data['ui']['en']['aboutLead'] );

/* Bersihkan konten contoh bawaan WordPress. */
foreach ( array( 'hello-world', 'sample-page', 'privacy-policy' ) as $al_slug ) {
	foreach ( array( 'post', 'page' ) as $al_type ) {
		$al_sample = get_page_by_path( $al_slug, OBJECT, $al_type );
		if ( $al_sample ) {
			wp_delete_post( $al_sample->ID, true );
		}
	}
}

flush_rewrite_rules();

echo "Seed selesai: " . count( $al_data['projects'] ) . " projek, 4 layanan, 3 testimoni, 3 pengalaman, 2 pep talk.\n";
