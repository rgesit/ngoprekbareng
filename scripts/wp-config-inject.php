<?php
/**
 * Sisipkan snippet dev lokal ke wp-config.php sebelum `require_once ... wp-settings.php`.
 *
 *   php scripts/wp-config-inject.php .wp-local/site/wp-config.php scripts/wp-config-local.php
 *
 * Idempoten: blok bertanda `>>> dev lokal >>>` diganti, bukan ditumpuk.
 */

$file    = $argv[1] ?? '';
$snippet = $argv[2] ?? '';

if ( ! $file || ! $snippet || ! file_exists( $file ) || ! file_exists( $snippet ) ) {
	fwrite( STDERR, "Pemakaian: php scripts/wp-config-inject.php <wp-config.php> <snippet.php>\n" );
	exit( 1 );
}

$config = (string) file_get_contents( $file );

// Buang blok lama (bertanda) dan sisa blok versi pertama yang tidak bertanda.
$config = (string) preg_replace( '~/\* >>> dev lokal >>> \*/.*?/\* <<< dev lokal <<< \*/~s', '', $config );
$config = (string) preg_replace( '~/\* (Dev lokal|Local dev)[^\n]*\n.*?require_once ABSPATH\.~s', "require_once ABSPATH.", $config );

$block   = rtrim( (string) file_get_contents( $snippet ) );
$block   = (string) preg_replace( '~^\s*<\?php\s*~', '', $block ); // buang tag pembuka
$marker  = "require_once ABSPATH . 'wp-settings.php';";

if ( ! str_contains( $config, $marker ) ) {
	fwrite( STDERR, "Penanda wp-settings.php tidak ditemukan.\n" );
	exit( 1 );
}

$config = str_replace( $marker, $block . "\n\n" . $marker, $config );

file_put_contents( $file, $config );
echo "wp-config.php: blok dev lokal ditulis sebelum wp-settings.php\n";
