<?php
/**
 * Tulisan biasa (post).
 */

get_header();

while ( have_posts() ) :
	the_post();
	?>
	<main class="mx-auto max-w-[900px] px-5 pt-28 sm:px-8 sm:pt-36">
		<article>
			<p class="text-[13px] text-muted"><?php echo esc_html( get_the_date() ); ?></p>
			<h1 class="font-display mt-3 text-balance text-[clamp(40px,7vw,96px)]"><?php the_title(); ?></h1>
			<div class="entry-content mt-10 max-w-2xl text-[17px] leading-relaxed text-fg/90">
				<?php the_content(); ?>
			</div>
		</article>
	</main>
	<?php
endwhile;

get_footer();
