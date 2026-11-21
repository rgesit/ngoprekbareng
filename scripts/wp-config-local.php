<?php
/* >>> dev lokal >>> */
// Dev lokal: WP_HOME/WP_SITEURL mengikuti hostname request supaya 127.0.0.1 dan
// hostname preview memakai satu instalasi (cookie tetap per-host). Preview
// Cloud berjalan di https, jadi hostname *.style.dev dipaksa https.
if ( isset( $_SERVER['HTTP_HOST'] ) ) {
	$al_host  = (string) $_SERVER['HTTP_HOST'];
	$al_proto = ( ! empty( $_SERVER['HTTPS'] ) && 'off' !== $_SERVER['HTTPS'] ) || ( isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) && 'https' === $_SERVER['HTTP_X_FORWARDED_PROTO'] ) ? 'https' : 'http';

	if ( str_ends_with( $al_host, '.style.dev' ) ) {
		$al_proto = 'https';
	}

	define( 'WP_HOME', $al_proto . '://' . $al_host );
	define( 'WP_SITEURL', WP_HOME );
}
if ( ! defined( 'WP_DEBUG_DISPLAY' ) ) {
	define( 'WP_DEBUG_DISPLAY', false );
}
if ( ! defined( 'WP_DEBUG_LOG' ) ) {
	define( 'WP_DEBUG_LOG', true );
}
if ( ! defined( 'WP_ENVIRONMENT_TYPE' ) ) {
	define( 'WP_ENVIRONMENT_TYPE', 'local' );
}
if ( ! defined( 'AUTOMATIC_UPDATER_DISABLED' ) ) {
	define( 'AUTOMATIC_UPDATER_DISABLED', true );
}
/* <<< dev lokal <<< */
