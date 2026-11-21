<?php
/**
 * Footer: ajakan kontak, form (AJAX ke "Pesan masuk"), sosial, dan jam lokal.
 */

$al_email     = (string) al_shared( 'email' );
$al_available = (string) al_shared( 'available' );
?>
<footer id="contact" class="mt-32 border-t border-line sm:mt-44">
	<div class="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28">
		<div class="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
			<div>
				<h2 class="font-display text-[clamp(46px,8vw,118px)]">
					<span class="block overflow-hidden pb-[0.08em] -mb-[0.08em]"><span class="block"><?php echo esc_html( al_opt( 'footerTop' ) ); ?></span></span>
					<span class="block overflow-hidden pb-[0.08em] -mb-[0.08em]"><span class="block"><?php echo esc_html( al_opt( 'footerBefore' ) ); ?> <span class="text-accent"><?php echo esc_html( al_opt( 'footerAccent' ) ); ?></span></span></span>
				</h2>

				<div class="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
					<a href="mailto:<?php echo esc_attr( $al_email ); ?>" class="round inline-flex h-14 items-center gap-2 rounded-full bg-accent px-7 text-[16px] font-semibold text-bg transition-transform duration-300 hover:-translate-y-0.5">
						<?php echo esc_html( $al_email ); ?>
						<?php echo al_icon( 'arrow-up-right', 'size-4' ); ?>
					</a>
					<p class="text-[14px] text-muted"><?php echo esc_html( '1' === $al_available ? al_opt( 'openForWork' ) : al_opt( 'fullyBooked' ) ); ?></p>
				</div>

				<p class="mt-8 max-w-md text-[15px] leading-relaxed text-muted"><?php echo esc_html( al_opt( 'footerBlurb' ) ); ?></p>
			</div>

			<div>
				<form class="flex flex-col gap-3" data-al-contact>
					<p class="text-[13px] text-muted"><?php echo esc_html( al_opt( 'formNote' ) ); ?></p>
					<div class="grid gap-3 sm:grid-cols-2">
						<label class="sr-only" for="al-name"><?php echo esc_html( al_opt( 'formName' ) ); ?></label>
						<input required id="al-name" name="name" placeholder="<?php echo esc_attr( al_opt( 'formName' ) ); ?>" class="h-14 w-full rounded-control border border-line-strong bg-transparent px-5 text-[15px] placeholder:text-faint transition-colors focus:border-accent focus:outline-none">
						<label class="sr-only" for="al-email"><?php echo esc_html( al_opt( 'formEmail' ) ); ?></label>
						<input required type="email" id="al-email" name="email" placeholder="<?php echo esc_attr( al_opt( 'formEmail' ) ); ?>" class="h-14 w-full rounded-control border border-line-strong bg-transparent px-5 text-[15px] placeholder:text-faint transition-colors focus:border-accent focus:outline-none">
					</div>
					<label class="sr-only" for="al-message"><?php echo esc_html( al_opt( 'formMessage' ) ); ?></label>
					<textarea required id="al-message" name="message" placeholder="<?php echo esc_attr( al_opt( 'formMessage' ) ); ?>" class="min-h-[140px] w-full resize-none rounded-control border border-line-strong bg-transparent px-5 py-4 text-[15px] placeholder:text-faint transition-colors focus:border-accent focus:outline-none"></textarea>
					<button type="submit" class="h-14 rounded-control border border-accent text-[15px] font-medium text-accent transition-colors hover:bg-accent hover:text-bg disabled:opacity-50"><?php echo esc_html( al_opt( 'formSend' ) ); ?></button>
					<p class="hidden text-[13px] text-accent" data-al-form-error role="alert"></p>
				</form>

				<div class="hidden min-h-[320px] flex-col justify-center rounded-card border border-line bg-surface-2/50 p-8" data-al-form-done>
					<p class="font-display text-[36px]"><?php echo esc_html( al_opt( 'formDoneTitle' ) ); ?></p>
					<p class="mt-2 text-[15px] text-muted"><?php echo esc_html( al_opt( 'formDoneBody' ) ); ?></p>
				</div>
			</div>
		</div>

		<div class="mt-24 grid gap-8 border-t border-line pt-8 text-[14px] sm:grid-cols-3">
			<ul class="flex flex-wrap gap-x-6 gap-y-2">
				<?php foreach ( al_shared_lines( 'socials' ) as $al_social ) : ?>
					<?php
						$al_parts = array_map( 'trim', explode( '|', $al_social, 2 ) );
						$al_label = $al_parts[0] ?? '';
						$al_href  = $al_parts[1] ?? '#';
					?>
					<li><a href="<?php echo esc_url( $al_href ); ?>" class="link-draw text-muted transition-colors hover:text-fg"><?php echo esc_html( $al_label ); ?></a></li>
				<?php endforeach; ?>
			</ul>
			<p class="text-faint sm:text-center">
				<?php echo esc_html( al_shared( 'location' ) ); ?>,
				<span data-al-clock data-tz="<?php echo esc_attr( (string) al_shared( 'timezone' ) ); ?>"><?php echo esc_html( al_local_time() ); ?></span>
			</p>
			<p class="text-faint sm:text-right">&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php echo esc_html( (string) al_shared( 'name' ) ); ?></p>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
