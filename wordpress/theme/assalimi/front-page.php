<?php
/**
 * Beranda: hero, marquee, kenapa, karya, level up, skill, pep talk, testimoni.
 *
 * Semua teks berasal dari opsi "Konten Situs"; daftar projek/layanan/testimoni/
 * pengalaman/pep talk berasal dari CPT masing-masing.
 */

get_header();

$al_projects     = al_projects();
$al_project_total = (int) $al_projects->post_count;
$al_marquee      = al_lines( 'marquee' );
$al_why_lines    = al_lines( 'whyLines' );
$al_why_body     = al_lines( 'whyBody' );
$al_work_lines   = al_lines( 'workLines' );
$al_level_lines  = al_lines( 'levelLines' );
$al_skill_lines  = al_lines( 'skillLines' );
$al_pep_lines    = al_lines( 'pepLines' );
$al_portrait     = al_image_url( 'portrait', get_template_directory_uri() . '/assets/img/portrait.jpg' );
?>

<main>
	<!-- Hero -->
	<section class="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
		<div aria-hidden class="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_55%,transparent_96%)]">
			<div class="absolute inset-0">
				<div class="round absolute -top-[25%] right-[-12%] h-[95%] w-[70%] animate-drift-a rounded-full bg-[radial-gradient(closest-side,rgb(204_255_47/0.34),transparent)] blur-3xl"></div>
				<div class="round absolute -top-[10%] left-[-12%] h-[80%] w-[62%] animate-drift-b rounded-full bg-[radial-gradient(closest-side,rgb(255_79_216/0.3),transparent)] blur-3xl"></div>
				<div class="round absolute top-[22%] left-[32%] h-[70%] w-[56%] animate-drift-c rounded-full bg-[radial-gradient(closest-side,rgb(74_120_255/0.34),transparent)] blur-3xl"></div>
				<div class="round absolute top-[45%] right-[12%] h-[50%] w-[40%] animate-drift-b rounded-full bg-[radial-gradient(closest-side,rgb(150_90_255/0.28),transparent)] blur-3xl"></div>
			</div>
			<div class="grain absolute inset-0"></div>
		</div>

		<div class="relative mx-auto w-full max-w-[1400px] px-5 pb-10 pt-24 sm:px-8 sm:pb-14">
			<div class="mb-7 flex flex-wrap items-center gap-2">
				<span class="round inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
					<span class="round size-1.5 rounded-full bg-accent" aria-hidden></span>
					<?php echo esc_html( al_opt( 'heroBadge' ) ); ?>
				</span>
				<span class="round rounded-full border border-line px-3.5 py-1.5 text-[11px] uppercase tracking-[0.12em] text-muted">
					<?php echo esc_html( al_opt( 'audienceLabel' ) ); ?>
				</span>
			</div>

			<h1 class="font-display text-[clamp(60px,13vw,200px)]">
				<?php foreach ( explode( ' ', (string) al_shared( 'name' ) ) as $al_word ) : ?>
					<span class="block overflow-hidden pb-[0.06em] -mb-[0.06em]"><span class="block"><?php echo esc_html( $al_word ); ?></span></span>
				<?php endforeach; ?>
			</h1>

			<div class="mt-9 border-t border-line pt-6">
				<div class="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
					<div class="max-w-lg">
						<p class="text-pretty text-[17px] leading-relaxed text-muted sm:text-[19px]"><?php echo esc_html( al_opt( 'intro' ) ); ?></p>
						<p class="mt-3 text-[11px] uppercase tracking-[0.18em] text-faint"><?php echo esc_html( al_opt( 'role' ) ); ?> &middot; <?php echo esc_html( al_shared( 'handle' ) ); ?></p>
					</div>
					<div class="flex flex-wrap items-center gap-2.5">
						<a href="#karya" class="round inline-flex h-12 items-center gap-2 rounded-full bg-accent px-6 text-[15px] font-semibold text-bg transition-transform duration-300 hover:-translate-y-0.5">
							<?php echo esc_html( al_opt( 'heroWork' ) ); ?>
							<?php echo al_icon( 'arrow-up-right', 'size-4' ); ?>
						</a>
						<a href="#pep-talk" class="round inline-flex h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-[15px] font-medium transition-colors hover:border-accent hover:text-accent">
							<?php echo esc_html( al_opt( 'heroPep' ) ); ?>
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Marquee -->
	<?php if ( $al_marquee ) : ?>
		<div class="overflow-hidden border-y border-line py-5" aria-hidden="true">
			<ul class="font-display flex w-max animate-marquee items-center gap-10 whitespace-nowrap text-[28px] text-fg/60 sm:text-[36px]">
				<?php foreach ( array_merge( $al_marquee, $al_marquee ) as $al_item ) : ?>
					<li class="flex items-center gap-10">
						<?php echo esc_html( $al_item ); ?>
						<span class="round size-2 rounded-full bg-accent"></span>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
	<?php endif; ?>

	<!-- Kenapa site ini ada -->
	<section id="kenapa" class="mx-auto max-w-[1400px] scroll-mt-24 px-5 pt-24 sm:px-8 sm:pt-32">
		<div class="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
			<div class="reveal">
				<div class="image-frame relative aspect-[3/4] max-w-[460px] rounded-image">
					<img src="<?php echo esc_url( $al_portrait ); ?>" alt="<?php echo esc_attr( (string) al_shared( 'name' ) ); ?>" class="size-full object-cover" loading="lazy">
				</div>
			</div>
			<div class="flex flex-col justify-center">
				<h2 class="font-display text-balance text-[40px] sm:text-[56px] lg:text-[64px]">
					<?php foreach ( $al_why_lines as $al_line ) : ?>
						<span class="block"><?php echo esc_html( $al_line ); ?></span>
					<?php endforeach; ?>
				</h2>
				<div class="reveal mt-8 max-w-xl text-pretty text-[17px] leading-relaxed text-muted">
					<?php foreach ( $al_why_body as $al_paragraph ) : ?>
						<p class="mt-4 first:mt-0"><?php echo esc_html( $al_paragraph ); ?></p>
					<?php endforeach; ?>
				</div>
				<div class="reveal mt-8">
					<a href="<?php echo esc_url( al_about_url() ); ?>" class="link-draw inline-flex items-center gap-1.5 text-[15px] font-medium">
						<?php echo esc_html( al_opt( 'whyLink' ) ); ?>
						<?php echo al_icon( 'arrow-up-right', 'size-4' ); ?>
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- Karya -->
	<section id="karya" class="mx-auto max-w-[1400px] scroll-mt-20 px-5 pt-24 sm:px-8 sm:pt-32">
		<div class="flex items-end justify-between gap-6">
			<h2 class="font-display text-[44px] sm:text-[64px]">
				<?php foreach ( $al_work_lines as $al_line ) : ?>
					<span class="block"><?php echo esc_html( $al_line ); ?></span>
				<?php endforeach; ?>
			</h2>
			<p class="hidden pb-2 text-[13px] text-muted sm:block"><?php echo esc_html( str_replace( '{n}', (string) $al_project_total, al_opt( 'workCount' ) ) ); ?></p>
		</div>

		<div class="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:gap-x-8 lg:gap-y-20">
			<?php
			if ( $al_projects->have_posts() ) :
				while ( $al_projects->have_posts() ) :
					$al_projects->the_post();
					$al_project = al_project_data();
					$al_large   = 'large' === $al_project['size'];
					?>
					<div class="<?php echo $al_large ? 'md:col-span-2' : 'md:col-span-1'; ?>">
						<a href="<?php echo esc_url( get_permalink( $al_project['id'] ) ); ?>" class="group relative block">
							<div class="relative overflow-hidden rounded-image <?php echo $al_large ? 'aspect-[16/10]' : 'aspect-[4/5] md:aspect-[4/4.6]'; ?>" style="background:<?php echo esc_attr( $al_project['tint'] ); ?>">
								<?php if ( $al_project['cover'] ) : ?>
									<div class="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]">
										<img src="<?php echo esc_url( $al_project['cover'] ); ?>" alt="<?php echo esc_attr( $al_project['title'] ); ?>" class="size-full object-cover" loading="lazy">
									</div>
								<?php endif; ?>
								<span class="round pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center rounded-full bg-accent px-4 py-2.5 text-[13px] font-semibold text-bg opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
									<?php echo esc_html( al_opt( 'cardHover' ) ); ?>
								</span>
							</div>
							<div class="mt-4 flex items-baseline justify-between gap-4">
								<h3 class="font-display text-[28px] sm:text-[32px]"><?php echo esc_html( $al_project['title'] ); ?></h3>
								<p class="shrink-0 text-[13.5px] text-muted">
									<?php echo esc_html( $al_project['category'] ); ?>
									<span class="ml-3 tabular-nums text-faint"><?php echo esc_html( $al_project['year'] ); ?></span>
								</p>
							</div>
						</a>
					</div>
					<?php
				endwhile;
				wp_reset_postdata();
			endif;
			?>
		</div>
	</section>

	<!-- Level up -->
	<section id="level-up" class="mx-auto max-w-[1400px] scroll-mt-20 px-5 pt-28 sm:px-8 sm:pt-40">
		<div class="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
			<div>
				<h2 class="font-display text-[40px] sm:text-[56px]">
					<?php foreach ( $al_level_lines as $al_line ) : ?>
						<span class="block"><?php echo esc_html( $al_line ); ?></span>
					<?php endforeach; ?>
				</h2>
				<p class="reveal mt-5 max-w-sm text-[16px] leading-relaxed text-muted"><?php echo esc_html( al_opt( 'levelBody' ) ); ?></p>
			</div>
			<ol class="border-t border-line">
				<?php
				$al_experience = al_items( 'experience' );
				$al_index      = 0;
				while ( $al_experience->have_posts() ) :
					$al_experience->the_post();
					$al_index++;
					$al_period = al_meta( get_the_ID(), 'period' );
					?>
					<li class="reveal grid gap-2 border-b border-line py-7 sm:grid-cols-[180px_1fr] sm:items-baseline sm:gap-6">
						<span class="text-[12px] uppercase tracking-[0.14em] tabular-nums text-accent"><?php echo esc_html( $al_period ); ?></span>
						<span>
							<span class="font-display block text-[28px] sm:text-[36px]">
								<span class="mr-2 text-[13px] tabular-nums text-faint">0<?php echo esc_html( (string) $al_index ); ?></span>
								<?php the_title(); ?>
							</span>
							<span class="mt-1.5 block text-[15px] text-muted"><?php echo esc_html( wp_strip_all_tags( al_content( get_the_ID(), false ) ) ); ?></span>
						</span>
					</li>
				<?php endwhile; wp_reset_postdata(); ?>
			</ol>
		</div>
	</section>

	<!-- Skill -->
	<section id="skill" class="mx-auto max-w-[1400px] scroll-mt-20 px-5 pt-28 sm:px-8 sm:pt-40">
		<div class="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
			<div>
				<h2 class="font-display text-[40px] sm:text-[56px]">
					<?php foreach ( $al_skill_lines as $al_line ) : ?>
						<span class="block"><?php echo esc_html( $al_line ); ?></span>
					<?php endforeach; ?>
				</h2>
				<p class="reveal mt-4 max-w-xs text-[15px] leading-relaxed text-muted"><?php echo esc_html( al_opt( 'skillBody' ) ); ?></p>
			</div>

			<div>
				<?php
				$al_services = al_items( 'service' );
				$al_number   = 0;
				?>
				<div class="border-t border-line">
					<?php while ( $al_services->have_posts() ) : $al_services->the_post(); $al_number++; ?>
						<details class="group border-b border-line" <?php echo 1 === $al_number ? 'open' : ''; ?>>
							<summary class="flex w-full cursor-pointer list-none items-center gap-6 py-7 text-left [&::-webkit-details-marker]:hidden">
								<span class="w-10 shrink-0 text-[14px] tabular-nums text-faint">0<?php echo esc_html( (string) $al_number ); ?></span>
								<span class="font-display flex-1 text-[30px] text-fg/60 transition-colors group-hover:text-fg sm:text-[42px] group-open:text-fg"><?php the_title(); ?></span>
								<span class="grid size-10 shrink-0 place-items-center rounded-[12px] border border-line-strong transition-colors duration-300 group-open:border-accent group-open:bg-accent group-open:text-bg">
									<?php echo al_icon( 'plus', 'size-4 transition-transform duration-500 group-open:rotate-45' ); ?>
								</span>
							</summary>
							<div class="max-w-xl pb-8 pl-16 text-pretty text-[16px] leading-relaxed text-muted">
								<?php echo wp_kses_post( al_content( get_the_ID() ) ); ?>
							</div>
						</details>
					<?php endwhile; wp_reset_postdata(); ?>
				</div>
			</div>
		</div>
	</section>

	<!-- Pep talk -->
	<section id="pep-talk" class="mx-auto max-w-[1400px] scroll-mt-20 px-5 pt-28 sm:px-8 sm:pt-40">
		<h2 class="font-display text-balance text-[44px] sm:text-[64px]">
			<?php foreach ( $al_pep_lines as $al_line ) : ?>
				<span class="block"><?php echo esc_html( $al_line ); ?></span>
			<?php endforeach; ?>
		</h2>

		<div class="mt-12 grid gap-5 md:grid-cols-2">
			<?php
			$al_pep   = al_items( 'pep_talk' );
			$al_count = 0;
			while ( $al_pep->have_posts() ) :
				$al_pep->the_post();
				$al_count++;
				$al_points = al_split_lines( al_meta( get_the_ID(), 'points' ) );
				?>
				<article class="reveal flex h-full flex-col rounded-[28px] border p-7 sm:p-9 <?php echo 1 === $al_count ? 'border-accent/40 bg-accent/[0.06]' : 'border-line bg-surface'; ?>">
					<p class="text-[11px] uppercase tracking-[0.16em] text-accent"><?php echo esc_html( al_meta( get_the_ID(), 'tag' ) ); ?></p>
					<p class="mt-1 text-[11px] uppercase tracking-[0.16em] text-faint"><?php echo esc_html( al_meta( get_the_ID(), 'age' ) ); ?></p>
					<h3 class="font-display mt-6 text-[36px] sm:text-[46px]"><?php the_title(); ?></h3>
					<div class="mt-4 text-pretty text-[16px] leading-relaxed text-muted"><?php echo wp_kses_post( al_content( get_the_ID() ) ); ?></div>
					<?php if ( $al_points ) : ?>
						<ul class="mt-6 space-y-3 border-t border-line pt-5 text-[15px] leading-relaxed">
							<?php foreach ( $al_points as $al_point ) : ?>
								<li class="flex gap-3">
									<span class="round mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden></span>
									<span class="text-fg/85"><?php echo esc_html( $al_point ); ?></span>
								</li>
							<?php endforeach; ?>
						</ul>
					<?php endif; ?>
				</article>
			<?php endwhile; wp_reset_postdata(); ?>
		</div>
	</section>

	<!-- Kata mereka -->
	<section class="mx-auto max-w-[1400px] px-5 pt-28 sm:px-8 sm:pt-40">
		<?php
		$al_quotes = al_items( 'testimonial' );
		if ( $al_quotes->have_posts() ) :
			$al_total = (int) $al_quotes->post_count;
			$al_i     = 0;
			?>
			<div class="rounded-[32px] bg-accent px-6 py-14 text-bg sm:px-14 sm:py-20" data-al-slider>
				<div class="mx-auto max-w-3xl">
					<?php while ( $al_quotes->have_posts() ) : $al_quotes->the_post(); ?>
						<blockquote class="<?php echo 0 === $al_i ? '' : 'hidden'; ?>" data-al-slide="<?php echo esc_attr( (string) $al_i ); ?>">
							<p class="font-display text-balance text-[30px] leading-[1.08] sm:text-[44px]">&ldquo;<?php echo esc_html( wp_strip_all_tags( al_content( get_the_ID(), false ) ) ); ?>&rdquo;</p>
							<footer class="mt-8 text-[15px] text-bg/60">
								<span class="text-bg"><?php the_title(); ?></span>, <?php echo esc_html( al_meta( get_the_ID(), 'role' ) ); ?>
							</footer>
						</blockquote>
						<?php $al_i++; ?>
					<?php endwhile; ?>

					<div class="mt-10 flex items-center gap-2">
						<?php for ( $al_dot = 0; $al_dot < $al_total; $al_dot++ ) : ?>
							<button
								type="button"
								data-al-dot="<?php echo esc_attr( (string) $al_dot ); ?>"
								aria-label="<?php echo esc_attr( str_replace( '{n}', (string) ( $al_dot + 1 ), al_opt( 'testimonyAria' ) ) ); ?>"
								class="h-1.5 rounded-[3px] transition-all duration-500 <?php echo 0 === $al_dot ? 'w-10 bg-bg' : 'w-4 bg-bg/30 hover:bg-bg/50'; ?>"
							></button>
						<?php endfor; ?>
						<button
							type="button"
							data-al-next
							aria-label="<?php echo esc_attr( al_opt( 'testimonyNext' ) ); ?>"
							class="ml-auto grid size-12 place-items-center rounded-[14px] border border-bg/20 transition-colors hover:bg-bg hover:text-accent"
						>
							<?php echo al_icon( 'arrow-up-right', 'size-4 rotate-45' ); ?>
						</button>
					</div>
				</div>
			</div>
			<?php wp_reset_postdata(); ?>
		<?php endif; ?>
	</section>
</main>

<?php get_footer(); ?>
