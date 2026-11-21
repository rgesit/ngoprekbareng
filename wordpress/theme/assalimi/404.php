<?php
/**
 * 404.
 */

get_header();
?>

<main class="mx-auto flex min-h-[80svh] max-w-[900px] flex-col justify-center px-5 pt-28 sm:px-8">
	<p class="text-[11px] uppercase tracking-[0.2em] text-accent">404</p>
	<h1 class="font-display mt-4 text-[clamp(44px,9vw,120px)]">Halaman ini gak ada.</h1>
	<p class="mt-6 max-w-md text-[16px] leading-relaxed text-muted">Mungkin tautannya salah, atau isinya sudah dipindah. Balik ke beranda aja.</p>
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="round mt-8 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-accent px-6 text-[15px] font-semibold text-bg">
		<?php echo al_icon( 'arrow-left', 'size-4' ); ?>
		<?php echo esc_html( (string) al_shared( 'name' ) ); ?>
	</a>
</main>

<?php get_footer(); ?>
