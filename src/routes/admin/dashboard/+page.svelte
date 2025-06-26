<script lang="ts">
	import MarkdownPageList from '$lib/components/markhoster/MarkdownPageList.svelte';
	import PageHeader from '$lib/components/markhoster/PageHeader.svelte';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
</script>

<svelte:head>
	<title>MarkHoster Admin</title>
</svelte:head>

<PageHeader
	title="Admin Dashboard"
	description="View and manage your hosted markdown pages"
	showBackButton={false}
/>

{#if !data?.pages || data.pages.length === 0}
	<div class="bg-card rounded-lg border py-12 text-center">
		<h3 class="text-foreground mb-2 text-lg font-semibold">No pages yet</h3>
		<p class="text-muted-foreground mb-4">Upload your first markdown page to get started</p>
		<Button href="/admin/upload">Upload Page</Button>
	</div>
{:else}
	<ul class="divide-border bg-card divide-y rounded-lg border">
		<MarkdownPageList pages={data.pages} />
	</ul>
{/if}
