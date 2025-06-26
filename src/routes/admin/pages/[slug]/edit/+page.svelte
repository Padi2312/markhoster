<script lang="ts">
	import PageHeader from '$lib/components/markhoster/PageHeader.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Toggle } from '$lib/components/ui/toggle';
	import * as Switch from '$lib/components/ui/switch';
	import { processMarkdown } from '$lib/core';
	import { ArrowLeft } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { superForm } from 'sveltekit-superforms/client';

	let { data } = $props();

	const { form, errors, enhance } = superForm(data.form, {
		dataType: 'json', // Ensure data is sent as JSON
		onResult(event) {
			if (event.result.type === 'success') {
				toast.success('Page updated successfully!');
			}
			if (event.result.type === 'error') {
				toast.error('Failed to update page.');
			}
		}
	});

	let showPreview = $state(false);

	let renderedContent = $derived.by(async () => {
		return await processMarkdown($form.content, []);
	});
</script>

<svelte:head>
	<title>Edit {data.page.title}</title>
</svelte:head>

<PageHeader
	title="Edit {data.page.title}"
	description="Modify the content and settings of your markdown page"
/>

<form method="POST" use:enhance>
	<div class="mb-4">
		<Label for="title">Title</Label>
		<Input type="text" id="title" name="title" bind:value={$form.title} />
		{#if $errors.title}
			<p class="text-destructive mt-1 text-sm">{$errors.title}</p>
		{/if}
	</div>
	<div class="mb-4">
		<Label for="description">Description</Label>
		<Input type="text" id="description" name="description" bind:value={$form.description} />
		{#if $errors.description}
			<p class="text-destructive mt-1 text-sm">{$errors.description}</p>
		{/if}
	</div>

	<div class="mb-4 flex items-center space-x-2">
		<Switch.Root bind:checked={$form.isPublic} id="isPublic" name="isPublic" />
		<Label for="isPublic">Page Public</Label>
	</div>
	<div class="mb-4">
		<div class="mb-2 flex items-center justify-between">
			<Label for="content">Content (Markdown)</Label>
			<Toggle pressed={showPreview} onPressedChange={(p) => (showPreview = p)}>
				Toggle Preview
			</Toggle>
		</div>
		<div class="grid" style="grid-template-columns: {showPreview ? '1fr 1fr' : '1fr'}; gap: 1rem;">
			<Textarea id="content" name="content" rows={20} bind:value={$form.content} />
			{#if showPreview}
				<div class="markdown-body overflow-auto rounded-md border p-4">
					{#await renderedContent}
						<p>Loading preview...</p>
					{:then renderedContent}
						{@html renderedContent}
					{:catch error}
						<p>Error rendering preview: {error.message}</p>
					{/await}
				</div>
			{/if}
		</div>
		{#if $errors.content}
			<p class="text-destructive mt-1 text-sm">{$errors.content}</p>
		{/if}
	</div>

	<Button type="submit">Save Changes</Button>
</form>
