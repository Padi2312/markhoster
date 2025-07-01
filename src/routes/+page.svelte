<script lang="ts">
	import Logo from '$lib/assets/logo.png';
</script>

<section
	class="bg-background text-foreground relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
>
	<!-- Soft background blobs -->
	<div
		class="bg-accent pointer-events-none absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full opacity-25 blur-[120px]"
	></div>
	<div
		class="bg-primary pointer-events-none absolute -right-40 -bottom-40 h-[28rem] w-[28rem] rounded-full opacity-15 blur-[120px]"
	></div>

	<div class="relative z-10 flex w-full flex-col items-center px-4">
		<!-- Logo and comfy heading -->
		<div class="mb-6 flex flex-col items-center gap-4">
			<img
				src={Logo}
				alt="MarkHoster Logo"
				class="h-20 w-20 rounded-xl bg-white/70 p-2 shadow-lg"
			/>
			<h1 class="text-5xl font-extrabold tracking-tight drop-shadow-lg select-none md:text-7xl">
				MarkHoster
			</h1>
		</div>
		<p
			class="text-foreground/90 mb-10 max-w-2xl text-center text-xl font-medium drop-shadow-sm md:text-2xl"
		>
			<span class="bg-card/70 inline-block rounded-xl px-4 py-2 shadow-sm">
				Effortlessly self-host and share your Markdown pages.<br />
				Upload, manage, and publish your Markdown pages in seconds.
			</span>
		</p>
		<a
			href="/admin"
			class="bg-primary hover:bg-primary/90 text-primary-foreground ring-</div>primary ring-offset-background tion mb-12 inline-block rounded-full px-10 py-4 text-lg font-bold shadow-xl ring-2 ring-offset-2"
		>
			Get Started
		</a>

		<div class="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
			{#snippet FeatureCard(icon: string, title: string, description: string)}
				<div
					class="bg-card/90 border-border flex flex-col items-center rounded-2xl border p-6 shadow-lg backdrop-blur-xl transition hover:scale-105 hover:shadow-2xl"
				>
					<span class="mb-3 text-4xl">{icon}</span>
					<h3 class="text-text mb-2 text-lg font-semibold">{title}</h3>
					<p class="text-muted-foreground text-center text-sm">{description}</p>
				</div>
			{/snippet}
			{@render FeatureCard(
				'📂',
				'Easy Upload',
				'Drag and drop Markdown files to instantly creatosted pages.'
			)}
			{@render FeatureCard(
				'🌐',
				'Instant Hosting',
				'Your Markdown files are served as beautiful web pages with custom URLs.'
			)}
			{@render FeatureCard(
				'🔒',
				'Private or Public',
				'Choose which pages are public or keep them private for your eyes only.'
			)}
			{@render FeatureCard(
				'📊',
				'Analytics',
				'Track page views and engagement with built-in analytics.'
			)}
		</div>
	</div>
</section>
