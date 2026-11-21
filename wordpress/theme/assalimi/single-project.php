<?php
/**
 * Halaman detail satu projek.
 */

get_header();

while ( have_posts() ) :
	the_post();

	$al_project = al_project_data();
	$al_all     = get_posts(
		array(
			'post_type'      => 'project',
			'posts_per_page' => -1,
			'orderby'        => array( 'menu_order' => 'ASC', 'date' => 'DESC' ),
			'fields'         => 'ids',
		)
	);
	$al_position = array_search( get_the_ID(), $al_all, true );
	$al_next_id  = false !== $al_position ? $al_all[ ( $al_position + 1 ) % count( $al_all ) ] : $al_all[0] ?? 0;
	?>

	<main class="mx-auto max-w-[1400px] px-5 pt-28 sm:px-8 sm:pt-36">
		<a href="<?php echo esc_url( home_url( '/#karya' ) ); ?>" class="inline-flex h-9 items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-fg">
			<?php echo al_icon( 'arrow-left', 'size-4' ); ?>
			<?php echo esc_html( al_opt( 'workBack' ) ); ?>
		</a>

		<div class="mt-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
			<h1 class="font-display text-[clamp(52px,10vw,150px)]"><?php the_title(); ?></h1>
			<p class="max-w-md text-pretty text-[17px] leading-relaxed text-muted lg:pb-4"><?php echo esc_html( $al_project['summary'] ); ?></p>
		</div>

		<div class="mt-12 overflow-hidden rounded-[32px]" style="background:<?php echo esc_attr( $al_project['tint'] ); ?>">
			<?php if ( $al_project['cover'] ) : ?>
				<div class="image-frame relative aspect-[16/10] sm:aspect-[16/9]">
					<img src="<?php echo esc_url( $al_project['cover'] ); ?>" alt="<?php echo esc_attr( $al_project['title'] ); ?>" class="size-full object-cover">
				</div>
			<?php endif; ?>
		</div>

		<div class="mt-16 grid gap-12 lg:grid-cols-[320px_1fr] lg:gap-24">
			<dl class="grid grid-cols-2 gap-x-6 gap-y-8 text-[14px] lg:grid-cols-1">
				<div class="border-t border-line pt-3">
					<dt class="text-muted"><?php echo esc_html( al_opt( 'labelClient' ) ); ?></dt>
					<dd class="mt-1 text-fg"><?php echo esc_html( $al_project['client'] ); ?></dd>
				</div>
				<div class="border-t border-line pt-3">
					<dt class="text-muted"><?php echo esc_html( al_opt( 'labelYear' ) ); ?></dt>
					<dd class="mt-1 text-fg"><?php echo esc_html( $al_project['year'] ); ?></dd>
				</div>
				<div class="border-t border-line pt-3">
					<dt class="text-muted"><?php echo esc_html( al_opt( 'labelRole' ) ); ?></dt>
					<dd class="mt-1 text-fg"><?php echo esc_html( implode( ', ', $al_project['role'] ) ); ?></dd>
				</div>
				<div class="border-t border-line pt-3">
					<dt class="text-muted"><?php echo esc_html( al_opt( 'labelDeliverables' ) ); ?></dt>
					<dd class="mt-1 text-fg"><?php echo esc_html( implode( ', ', $al_project['deliverables'] ) ); ?></dd>
				</div>
				<?php if ( $al_project['link'] ) : ?>
					<div class="border-t border-line pt-3">
						<a href="<?php echo esc_url( $al_project['link'] ); ?>" class="link-draw inline-flex items-center gap-1 font-medium">
							<?php echo esc_html( al_opt( 'openSite' ) ); ?>
							<?php echo al_icon( 'arrow-up-right', 'size-4' ); ?>
						</a>
					</div>
				<?php endif; ?>
			</dl>

			<div class="entry-content max-w-2xl leading-relaxed text-fg/90">
				<?php echo wp_kses_post( $al_project['body'] ); ?>
			</div>
		</div>

		<?php if ( $al_next_id ) : ?>
			<a href="<?php echo esc_url( get_permalink( $al_next_id ) ); ?>" class="group mt-32 block border-t border-line pt-10">
				<p class="text-[14px] text-muted"><?php echo esc_html( al_opt( 'nextProject' ) ); ?></p>
				<div class="mt-3 flex items-end justify-between gap-6">
					<h2 class="font-display text-[clamp(44px,8vw,120px)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3"><?php echo esc_html( get_the_title( $al_next_id ) ); ?></h2>
					<?php if ( has_post_thumbnail( $al_next_id ) ) : ?>
						<span class="image-frame hidden aspect-[4/3] w-[260px] shrink-0 rounded-[20px] sm:block">
							<img src="<?php echo esc_url( (string) get_the_post_thumbnail_url( $al_next_id, 'al-card' ) ); ?>" alt="" class="size-full object-cover transition-transform duration-700 group-hover:scale-105">
						</span>
					<?php endif; ?>
				</div>
			</a>
		<?php endif; ?>
	</main>

	<?php
endwhile;

get_footer();
