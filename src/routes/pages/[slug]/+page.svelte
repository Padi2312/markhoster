<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{data.page.title}</title>
	{#if data.page.description}
		<meta name="description" content={data.page.description} />
	{/if}
	<meta property="og:title" content={data.page.title} />
	{#if data.page.description}
		<meta property="og:description" content={data.page.description} />
	{/if}
	<meta property="og:type" content="article" />
	<link rel="stylesheet" href="/github-dark.css" />
</svelte:head>

<main class="container mx-auto max-w-6xl px-4 py-8">
	<!-- Page Header -->
	<header class="mb-8">
		<h1 class="mb-4 text-4xl font-bold">{data.page.title}</h1>
		<div class="flex items-center space-x-4 text-sm">
			<time datetime={data.page.createdAt.toString()}>
				Published {new Date(data.page.createdAt).toLocaleDateString()}
			</time>
			{#if data.page.updatedAt !== data.page.createdAt}
				<time datetime={data.page.updatedAt.toString()}>
					Updated {new Date(data.page.updatedAt).toLocaleDateString()}
				</time>
			{/if}
			<span>{data.page.viewCount} views</span>
		</div>
	</header>

	<!-- Markdown Content -->
	<article class="markdown-body">
		{@html data.page.content}
	</article>

	<!-- Footer -->
	<footer class="mt-12 border-t pt-8">
		<div class="text-center text-sm">
			<p>Hosted on MarkHoster</p>
		</div>
	</footer>
</main>

<style lang="postcss">
</style>
