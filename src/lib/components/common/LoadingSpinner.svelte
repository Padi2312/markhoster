<script lang="ts">
	let { size = 16 } = $props();
	let borderWidth: number = $derived(Math.max(2, Math.round(size / 8)));
</script>

<div
	class="text-loading-spinner inline-block animate-spin rounded-full border-solid border-current border-e-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
	style={`width: ${size}px; height: ${size}px; border-width: ${borderWidth}px;`}
	role="status"
	aria-label="Loading"
>
	<span
		class="!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]"
	>
		Loading...
	</span>
</div>
