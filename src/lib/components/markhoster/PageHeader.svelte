<script>
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from '@lucide/svelte';

	let { title, description, showBackButton = true } = $props();
</script>

<div class="mb-8 flex items-center gap-4">
	{#if showBackButton}
		<Button
			href="/admin/dashboard"
			variant="ghost"
			size="icon"
			class="border-border bg-background hover:bg-muted rounded-full border shadow"
		>
			<ArrowLeft class="h-8 w-8" />
		</Button>
	{/if}
	<div>
		<h1 class="text-foreground mb-2 text-3xl font-bold">{title}</h1>
		<p class="text-muted-foreground">{description}</p>
	</div>
</div>
