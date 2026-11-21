<?php
/**
 * Arsip semua projek (/karya/).
 */

get_header();
?>

<main class="mx-auto max-w-[1400px] px-5 pt-28 sm:px-8 sm:pt-36">
	<h1 class="font-display text-[clamp(48px,9vw,140px)]"><?php echo esc_html( al_opt( 'navWork' ) ); ?></h1>
	<p class="mt-4 text-[14px] text-muted"><?php echo esc_html( str_replace( '{n}', (string) $GLOBALS['wp_query']->found_posts, al_opt( 'workCount' ) ) ); ?></p>

	<div class="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:gap-x-8 lg:gap-y-20">
		<?php
		while ( have_posts() ) :
			the_post();
			$al_project = al_project_data();
			$al_large   = 'large' === $al_project['size'];
			?>
			<div class="<?php echo $al_large ? 'md:col-span-2' : 'md:col-span-1'; ?>">
				<a href="<?php the_permalink(); ?>" class="group relative block">
					<div class="relative overflow-hidden rounded-image <?php echo $al_large ? 'aspect-[16/10]' : 'aspect-[4/5] md:aspect-[4/4.6]'; ?>" style="background:<?php echo esc_attr( $al_project['tint'] ); ?>">
						<?php if ( $al_project['cover'] ) : ?>
							<img src="<?php echo esc_url( $al_project['cover'] ); ?>" alt="<?php echo esc_attr( $al_project['title'] ); ?>" class="size-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]" loading="lazy">
						<?php endif; ?>
						<span class="round pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent px-4 py-2.5 text-[13px] font-semibold text-bg opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:block">
							<?php echo esc_html( al_opt( 'cardHover' ) ); ?>
						</span>
					</div>
					<div class="mt-4 flex items-baseline justify-between gap-4">
						<h2 class="font-display text-[28px] sm:text-[32px]"><?php the_title(); ?></h2>
						<p class="shrink-0 text-[13.5px] text-muted">
							<?php echo esc_html( $al_project['category'] ); ?>
							<span class="ml-3 tabular-nums text-faint"><?php echo esc_html( $al_project['year'] ); ?></span>
						</p>
					</div>
				</a>
			</div>
		<?php endwhile; ?>
	</div>

	<div class="mt-16">
		<?php the_posts_pagination(); ?>
	</div>
</main>

<?php get_footer(); ?>
