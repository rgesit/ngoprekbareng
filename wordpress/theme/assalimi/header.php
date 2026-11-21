<?php
/**
 * Header: navigasi, pengubah bahasa, dan tombol tema.
 */

$al_name   = (string) al_shared( 'name' );
$al_handle = (string) al_shared( 'handle' );
$al_lang   = al_lang();
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="color-scheme" content="dark light">
	<meta name="theme-color" content="#0b0b0f" id="al-theme-color">
	<script>
		// Terapkan tema tersimpan sebelum paint pertama, biar gak kedip.
		try {
			var saved = localStorage.getItem('theme')
			document.documentElement.dataset.theme = saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
		} catch (error) {}
	</script>
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header fixed inset-x-0 top-0 z-40 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" data-al-header>
	<div class="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 sm:px-8">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="flex items-baseline gap-2">
			<span class="text-[15px] font-medium"><?php echo esc_html( $al_name ); ?></span>
			<span class="hidden text-[12px] text-faint sm:inline"><?php echo esc_html( $al_handle ); ?></span>
		</a>

		<nav class="flex items-center gap-3.5 sm:gap-6" aria-label="Navigasi utama">
			<a href="<?php echo esc_url( home_url( '/#karya' ) ); ?>" class="link-draw text-[13px] transition-colors text-muted hover:text-fg sm:text-[14px]"><?php echo esc_html( al_opt( 'navWork' ) ); ?></a>
			<a href="<?php echo esc_url( al_about_url() ); ?>" class="link-draw text-[13px] transition-colors <?php echo is_page_template( 'page-templates/tentang.php' ) ? 'text-fg' : 'text-muted hover:text-fg'; ?> sm:text-[14px]"><?php echo esc_html( al_opt( 'navAbout' ) ); ?></a>
			<a href="<?php echo esc_url( home_url( '/#contact' ) ); ?>" class="link-draw text-[13px] text-muted transition-colors hover:text-fg sm:text-[14px]"><?php echo esc_html( al_opt( 'navContact' ) ); ?></a>

			<span class="hidden text-[13px] tabular-nums text-faint md:inline">
				<?php echo esc_html( al_shared( 'location' ) ); ?>
				<span data-al-clock data-tz="<?php echo esc_attr( (string) al_shared( 'timezone' ) ); ?>"><?php echo esc_html( al_local_time() ); ?></span>
			</span>

			<div class="flex items-center gap-1.5">
				<button
					type="button"
					data-al-theme-toggle
					aria-label="<?php echo esc_attr( al_opt( 'themeToLight' ) ); ?>"
					title="<?php echo esc_attr( al_opt( 'themeToLight' ) ); ?>"
					data-label-light="<?php echo esc_attr( al_opt( 'themeToDark' ) ); ?>"
					data-label-dark="<?php echo esc_attr( al_opt( 'themeToLight' ) ); ?>"
					class="round grid size-8 place-items-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent"
				>
					<span class="hidden" data-al-icon="sun"><?php echo al_icon( 'sun', 'size-4' ); ?></span>
					<span class="hidden" data-al-icon="moon"><?php echo al_icon( 'moon', 'size-4' ); ?></span>
				</button>

				<div class="round flex items-center gap-0.5 rounded-full border border-line p-0.5" role="group" aria-label="<?php echo esc_attr( al_opt( 'langLabel' ) ); ?>">
					<a
						href="<?php echo esc_url( al_lang_url( 'id' ) ); ?>"
						hreflang="id"
						aria-pressed="<?php echo 'id' === $al_lang ? 'true' : 'false'; ?>"
						class="round rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors <?php echo 'id' === $al_lang ? 'bg-accent text-bg' : 'text-muted hover:text-fg'; ?>"
					>ID</a>
					<a
						href="<?php echo esc_url( al_lang_url( 'en' ) ); ?>"
						hreflang="en"
						aria-pressed="<?php echo 'en' === $al_lang ? 'true' : 'false'; ?>"
						class="round rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors <?php echo 'en' === $al_lang ? 'bg-accent text-bg' : 'text-muted hover:text-fg'; ?>"
					>EN</a>
				</div>
			</div>
		</nav>
	</div>
</header>
