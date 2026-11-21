#!/usr/bin/env bash
# WordPress lokal untuk tema Assalimi, tanpa root, tanpa MySQL.
#
#   bash scripts/wp-local.sh          # pasang / perbarui instalasi
#   bash scripts/wp-local.sh serve    # jalankan di 0.0.0.0:3000
#
# PHP statis + WordPress + plugin SQLite disimpan di .wp-local/ (di-gitignore).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WP_DIR="$ROOT/.wp-local"
SITE="$WP_DIR/site"
PHP="$WP_DIR/bin/php"
WP="$PHP $WP_DIR/wp-cli/wp"
PHP_URL="${PHP_URL:-https://dl.static-php.dev/static-php-cli/common/php-8.3.28-cli-linux-x86_64.tar.gz}"
ADMIN_USER="${WP_ADMIN_USER:-assalimi}"
ADMIN_PASS="${WP_ADMIN_PASS:-NgoprekBareng!2026}"
ADMIN_EMAIL="${WP_ADMIN_EMAIL:-hai@assalimi.my.id}"
PORT="${PORT:-3000}"

download_php() {
	if [ -x "$PHP" ]; then
		return
	fi
	echo "→ Unduh PHP statis"
	mkdir -p "$WP_DIR/bin"
	curl -fsSL "$PHP_URL" -o "$WP_DIR/bin/php.tar.gz"
	tar xzf "$WP_DIR/bin/php.tar.gz" -C "$WP_DIR/bin"
	rm -f "$WP_DIR/bin/php.tar.gz"
}

install_wp() {
	if [ ! -f "$SITE/wp-load.php" ]; then
		echo "→ Unduh WordPress"
		mkdir -p "$SITE"
		curl -fsSL https://wordpress.org/latest.tar.gz -o "$WP_DIR/wp.tar.gz"
		tar xzf "$WP_DIR/wp.tar.gz" --strip-components=1 -C "$SITE"
		rm -f "$WP_DIR/wp.tar.gz"
	fi

	if [ ! -f "$WP_DIR/wp-cli/wp" ]; then
		echo "→ Unduh WP-CLI"
		mkdir -p "$WP_DIR/wp-cli"
		curl -fsSL https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -o "$WP_DIR/wp-cli/wp"
		chmod +x "$WP_DIR/wp-cli/wp"
	fi

	if [ ! -d "$SITE/wp-content/plugins/sqlite-database-integration" ]; then
		echo "→ Unduh plugin SQLite"
		curl -fsSL https://downloads.wordpress.org/plugin/sqlite-database-integration.latest-stable.zip -o "$WP_DIR/sqlite.zip"
		unzip -q -o "$WP_DIR/sqlite.zip" -d "$SITE/wp-content/plugins"
	fi

	if [ ! -f "$SITE/wp-content/db.php" ]; then
		cp "$SITE/wp-content/plugins/sqlite-database-integration/db.copy" "$SITE/wp-content/db.php"
	fi

	if [ ! -f "$SITE/wp-config.php" ]; then
		echo "→ Buat wp-config.php"
		$WP config create --path="$SITE" --dbname=wordpress --dbuser=wp --dbpass=wp --dbhost=localhost --skip-check --force >/dev/null
	fi

	# WP_HOME/WP_SITEURL harus ikut hostname request, dan harus ditulis sebelum
	# wp-settings.php dijalankan.
	$PHP "$ROOT/scripts/wp-config-inject.php" "$SITE/wp-config.php" "$ROOT/scripts/wp-config-local.php"

	if ! $WP core is-installed --path="$SITE" >/dev/null 2>&1; then
		echo "→ Instal WordPress"
		$WP core install --path="$SITE" --url="http://127.0.0.1:$PORT" --title="Assalimi" \
			--admin_user="$ADMIN_USER" --admin_password="$ADMIN_PASS" --admin_email="$ADMIN_EMAIL" --skip-email
	fi

	$WP plugin activate sqlite-database-integration --path="$SITE" >/dev/null

	ln -sfn "$ROOT/wordpress/theme/assalimi" "$SITE/wp-content/themes/assalimi"
	$WP theme activate assalimi --path="$SITE" >/dev/null
	$WP rewrite structure '/%postname%/' --path="$SITE" >/dev/null
}

seed() {
	echo "→ Export konten dari src/data/site.ts"
	if command -v bun >/dev/null 2>&1; then
		(cd "$ROOT" && bun run scripts/export-wp-content.ts)
	else
		echo "  bun tidak ada; memakai wordpress/content.json yang sudah ada"
	fi
	echo "→ Seed konten ke CMS"
	$WP eval-file "$ROOT/wordpress/seed.php" --path="$SITE"
}

case "${1:-setup}" in
	setup)
		download_php
		install_wp
		seed
		echo
		echo "WordPress lokal siap."
		echo "  Situs : http://127.0.0.1:$PORT"
		echo "  Admin : http://127.0.0.1:$PORT/wp-admin"
		echo "  User  : $ADMIN_USER"
		echo "  Pass  : $ADMIN_PASS"
		echo "Jalankan server: bash scripts/wp-local.sh serve"
		;;
	serve)
		cat > "$WP_DIR/router.php" <<'EOF'
<?php
// Router untuk `php -S`: file statis dan .php dilayani langsung, sisanya ke WordPress.
$root = __DIR__ . '/site';
$path = (string) parse_url( $_SERVER['REQUEST_URI'], PHP_URL_PATH );

// Preview Cloud memakai https; beri tahu PHP supaya cookie & URL konsisten.
$host = (string) ( $_SERVER['HTTP_HOST'] ?? '' );
if ( str_ends_with( $host, '.style.dev' ) ) {
	$_SERVER['HTTPS']        = 'on';
	$_SERVER['SERVER_PORT']  = '443';
	$_SERVER['REQUEST_SCHEME'] = 'https';
}

if ( ! str_contains( $path, '..' ) ) {
	$target = $root . urldecode( $path );
	if ( is_file( $target ) ) {
		return false;
	}
	// Folder (mis. /wp-admin/): biarkan server bawaan melayani index.php-nya.
	if ( is_dir( $target ) && is_file( $target . '/index.php' ) ) {
		return false;
	}
}

require $root . '/index.php';
EOF
		exec "$PHP" -S "0.0.0.0:$PORT" -t "$SITE" "$WP_DIR/router.php"
		;;
	*)
		echo "Pemakaian: bash scripts/wp-local.sh [setup|serve]" >&2
		exit 1
		;;
esac
