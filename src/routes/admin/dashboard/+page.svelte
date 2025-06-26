<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Eye, Folder, Pencil } from '@lucide/svelte';

	let { data } = $props();

	let username = $state('');
	let password = $state('');
	let error = $state('');
</script>

<svelte:head>
	<title>MarkHoster Admin</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-foreground mb-2 text-3xl font-bold">MarkHoster Admin</h1>
			<p class="text-muted-foreground">Manage your hosted markdown pages</p>
		</div>
		<Button href="/admin/upload">Upload New Page</Button>
	</div>
	{#if !data?.pages || data.pages.length === 0}
		<div class="py-12 text-center border rounded-lg bg-card">
			<h3 class="text-foreground mb-2 text-lg font-semibold">No pages yet</h3>
			<p class="text-muted-foreground mb-4">Upload your first markdown page to get started</p>
			<Button href="/admin/upload">Upload Page</Button>
		</div>
	{:else}
		<ul class="divide-y divide-border rounded-lg border bg-card">
			{#each data.pages as page}
				<li class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 py-2 hover:bg-accent/30 transition">
					<div class="flex-1 min-w-0">
						<div class="flex items-center gap-2 min-w-0">
							<a
								href="/pages/{page.slug}"
								class="truncate font-semibold text-primary hover:underline text-base"
								target="_blank"
							>
								{page.title}
							</a>
							{#if page.isPublic}
								<Badge variant="default" class="text-[10px] px-2 py-0.5 h-5">Public</Badge>
							{:else}
								<Badge variant="secondary" class="text-[10px] px-2 py-0.5 h-5">Private</Badge>
							{/if}
							{#if page.isActive}
								<Badge variant="outline" class="border-chart-1 text-chart-1 text-[10px] px-2 py-0.5 h-5">Active</Badge>
							{:else}
								<Badge variant="outline" class="border-destructive text-destructive text-[10px] px-2 py-0.5 h-5">Inactive</Badge>
							{/if}
						</div>
						<div class="text-xs text-muted-foreground truncate">
							{#if page.description}
								{page.description}
							{:else}
								<span class="text-muted-foreground">No description</span>
							{/if}
						</div>
						<div class="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
							<span>Created {new Date(page.createdAt).toLocaleDateString()}</span>
							<span>•</span>
							<span>{page.viewCount} views</span>
							<span>•</span>
							<span class="font-mono">/pages/{page.slug}</span>
						</div>
					</div>
					<div class="flex gap-1 mt-2 sm:mt-0">
						<Button
							variant="ghost"
							size="icon"
							href={`/pages/${page.slug}`}
							target="_blank"
							aria-label="View page"
							class="hover:bg-primary/10"
						>
							<Eye class="size-5" />
						</Button>
						<Button variant="ghost" size="icon" aria-label="Manage assets" class="hover:bg-primary/10">
							<Folder class="size-5" />
						</Button>
						<Button variant="ghost" size="icon" aria-label="Edit page" class="hover:bg-primary/10">
							<Pencil class="size-5" />
						</Button>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
