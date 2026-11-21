<?php
/**
 * Template Name: Tentang
 *
 * Halaman tentang: judul besar, potret, cerita, perjalanan dari CPT
 * "Pengalaman", dan statistik dari opsi Konten Situs.
 */

get_header();

$al_about_lines = al_lines( 'aboutLines' );
$al_about_body  = al_lines( 'aboutBody' );
$al_stats       = al_lines( 'aboutStats' );
$al_portrait    = al_image_url( 'portrait', get_template_directory_uri() . '/assets/img/portrait.jpg' );
$al_socials     = al_shared_lines( 'socials' );
?>

<main class="mx-auto max-w-[1400px] px-5 pt-28 sm:px-8 sm:pt-36">
	<article>
		<h1 class="font-display text-balance text-[clamp(42px,7.5vw,108px)]">
			<?php foreach ( $al_about_lines as $al_line ) : ?>
				<span class="block"><?php echo esc_html( $al_line ); ?></span>
			<?php endforeach; ?>
		</h1>

		<div class="mt-14 grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
			<div>
				<div class="image-frame relative aspect-[3/4] rounded-image">
					<img src="<?php echo esc_url( $al_portrait ); ?>" alt="<?php echo esc_attr( (string) al_shared( 'name' ) ); ?>" class="size-full object-cover">
				</div>
				<ul class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
					<?php foreach ( $al_socials as $al_social ) : ?>
						<?php
						$al_parts = array_map( 'trim', explode( '|', $al_social, 2 ) );
						?>
						<li>
							<a href="<?php echo esc_url( $al_parts[1] ?? '#' ); ?>" class="link-draw inline-flex items-center gap-1 text-muted hover:text-fg">
								<?php echo esc_html( $al_parts[0] ?? '' ); ?>
								<?php echo al_icon( 'arrow-up-right', 'size-3.5' ); ?>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
			</div>

			<div>
				<div class="entry-content text-pretty text-[19px] leading-relaxed sm:text-[22px]">
					<?php while ( have_posts() ) : the_post(); ?>
						<?php if ( '' !== trim( (string) get_the_content() ) ) : ?>
							<?php the_content(); ?>
						<?php else : ?>
							<p><?php echo esc_html( al_opt( 'aboutLead' ) ); ?></p>
						<?php endif; ?>
					<?php endwhile; ?>
				</div>

				<div class="entry-content mt-8 flex flex-col gap-5 text-[17px] leading-relaxed text-muted">
					<?php foreach ( $al_about_body as $al_paragraph ) : ?>
						<p><?php echo esc_html( $al_paragraph ); ?></p>
					<?php endforeach; ?>
				</div>

				<div class="reveal mt-16">
					<h2 class="text-[14px] text-muted"><?php echo esc_html( al_opt( 'aboutJourney' ) ); ?></h2>
					<ol class="mt-4 divide-y divide-line border-y border-line">
						<?php
						$al_experience = al_items( 'experience' );
						while ( $al_experience->have_posts() ) :
							$al_experience->the_post();
							?>
							<li class="grid gap-1 py-5 sm:grid-cols-[180px_1fr]">
								<span class="text-[13px] tabular-nums text-accent"><?php echo esc_html( al_meta( get_the_ID(), 'period' ) ); ?></span>
								<span>
									<span class="block text-[16px] font-medium"><?php the_title(); ?></span>
									<span class="block text-[14.5px] text-muted"><?php echo esc_html( wp_strip_all_tags( al_content( get_the_ID(), false ) ) ); ?></span>
								</span>
							</li>
						<?php endwhile; wp_reset_postdata(); ?>
					</ol>
				</div>

				<?php if ( $al_stats ) : ?>
					<div class="reveal mt-16 grid grid-cols-3 gap-6">
						<?php foreach ( $al_stats as $al_stat ) : ?>
							<?php $al_parts = array_map( 'trim', explode( '|', $al_stat, 2 ) ); ?>
							<div>
								<p class="font-display text-[52px] leading-none text-accent sm:text-[72px]"><?php echo esc_html( $al_parts[0] ?? '' ); ?></p>
								<p class="mt-2 text-[14px] text-muted"><?php echo esc_html( $al_parts[1] ?? '' ); ?></p>
							</div>
						<?php endforeach; ?>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</article>
</main>

<?php get_footer(); ?>
