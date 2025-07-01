<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();
</script>

<Toaster position="top-center" />
<main class="container mx-auto max-w-7xl px-4 py-8">
	{@render children()}
</main>
