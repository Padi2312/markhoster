<script lang="ts">
	let { children } = $props();
</script>

<main class="container mx-auto max-w-7xl px-4 py-8">
	{@render children()}
</main>
