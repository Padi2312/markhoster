<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import type { MarkdownPage } from '$lib/types';
	import { Eye, Folder, Pencil } from '@lucide/svelte';

	let { pages }: { pages: MarkdownPage[] } = $props();
</script>

{#each pages as page}
	<li
		class="hover:bg-accent/30 flex flex-col items-start justify-between gap-2 px-3 py-2 transition sm:flex-row sm:items-center"
	>
		<div class="min-w-0 flex-1">
			<div class="flex min-w-0 items-center gap-2">
				<a
					href="/pages/{page.slug}"
					class="text-primary truncate text-base font-semibold hover:underline"
					target="_blank"
				>
					{page.title}
				</a>
				{#if page.isPublic}
					<Badge variant="default" class="h-5 px-2 py-0.5 text-[10px]">Public</Badge>
				{:else}
					<Badge variant="secondary" class="h-5 px-2 py-0.5 text-[10px]">Private</Badge>
				{/if}
				{#if page.isActive}
					<Badge variant="outline" class="border-chart-1 text-chart-1 h-5 px-2 py-0.5 text-[10px]"
						>Active</Badge
					>
				{:else}
					<Badge
						variant="outline"
						class="border-destructive text-destructive h-5 px-2 py-0.5 text-[10px]">Inactive</Badge
					>
				{/if}
			</div>
			<div class="text-muted-foreground truncate text-xs">
				{#if page.description}
					{page.description}
				{:else}
					<span class="text-muted-foreground">No description</span>
				{/if}
			</div>
			<div class="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
				<span>Created {new Date(page.createdAt).toLocaleDateString()}</span>
				<span>•</span>
				<span>{page.viewCount} views</span>
				<span>•</span>
				<span class="font-mono">/pages/{page.slug}</span>
			</div>
		</div>
		<div class="mt-2 flex gap-1 sm:mt-0">
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
			<Button
				variant="ghost"
				size="icon"
				aria-label="Edit page"
				class="hover:bg-primary/10"
				href={`/admin/pages/${page.slug}/edit`}
			>
				<Pencil class="size-5" />
			</Button>
		</div>
	</li>
{/each}
