<script lang="ts">
</script>

<section
	class="bg-background text-foreground relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
>
	<div
		class="bg-accent pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
	></div>
	<div
		class="bg-primary pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
	></div>

	<div class="relative z-10 flex w-full flex-col items-center px-4">
		<h1
			class="from-accent via-primary to-foreground mb-4 bg-gradient-to-r bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-lg select-none md:text-7xl"
		>
			MarkHoster
		</h1>
		<p
			class="text-foreground/90 mb-8 max-w-2xl text-center text-xl font-medium drop-shadow md:text-2xl"
		>
			Effortlessly self-host and share your Markdown pages.<br />
			Upload, manage, and publish your Markdown pages in seconds.
		</p>
		<!-- <a
			href="/signup"
			class="bg-primary hover:bg-primary/90 text-primary-foreground ring-primary ring-offset-background mb-12 inline-block rounded-full px-10 py-4 text-lg font-bold shadow-xl ring-2 ring-offset-2 transition"
		>
			Get Started
		</a> -->

		<div class="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
			{#snippet FeatureCard(icon: string, title: string, description: string)}
				<div
					class="bg-card/80 border-border flex flex-col items-center rounded-2xl border p-6 shadow-lg backdrop-blur-lg"
				>
					<span class="mb-2 text-3xl">{icon}</span>
					<h3 class="text-text mb-2 text-lg font-semibold">{title}</h3>
					<p class="text-muted-foreground text-center text-sm">{description}</p>
				</div>
			{/snippet}
			{@render FeatureCard(
				'📂',
				'Easy Upload',
				'Drag and drop Markdown files to instantly create hosted pages.'
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
