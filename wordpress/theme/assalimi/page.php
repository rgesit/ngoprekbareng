<?php
/**
 * Halaman biasa: judul + isi editor.
 */

get_header();

while ( have_posts() ) :
	the_post();
	?>
	<main class="mx-auto max-w-[900px] px-5 pt-28 sm:px-8 sm:pt-36">
		<article>
			<h1 class="font-display text-balance text-[clamp(42px,7vw,96px)]"><?php the_title(); ?></h1>
			<div class="entry-content mt-10 max-w-2xl text-[17px] leading-relaxed text-fg/90">
				<?php the_content(); ?>
			</div>
			<p class="mt-12">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="link-draw text-[15px] font-medium"><?php echo esc_html( (string) al_shared( 'name' ) ); ?></a>
			</p>
		</article>
	</main>
	<?php
endwhile;

get_footer();
