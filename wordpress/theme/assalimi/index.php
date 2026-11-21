<?php
/**
 * Fallback: daftar tulisan.
 */

get_header();
?>

<main class="mx-auto max-w-[900px] px-5 pt-28 sm:px-8 sm:pt-36">
	<h1 class="font-display text-[clamp(40px,7vw,96px)]">
		<?php
		if ( is_home() && ! is_front_page() ) {
			single_post_title();
		} else {
			echo esc_html( (string) al_shared( 'name' ) );
		}
		?>
	</h1>

	<div class="mt-12 divide-y divide-line border-t border-line">
		<?php while ( have_posts() ) : the_post(); ?>
			<article class="py-8">
				<h2 class="font-display text-[28px]"><a href="<?php the_permalink(); ?>" class="link-draw"><?php the_title(); ?></a></h2>
				<p class="mt-2 text-[13px] text-faint"><?php echo esc_html( get_the_date() ); ?></p>
				<div class="mt-3 text-[15px] text-muted"><?php the_excerpt(); ?></div>
			</article>
		<?php endwhile; ?>
	</div>

	<div class="mt-10"><?php the_posts_pagination(); ?></div>
</main>

<?php get_footer(); ?>
