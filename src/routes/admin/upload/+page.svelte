<script lang="ts">
	import Header from '$lib/components/markhoster/PageHeader.svelte';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Toggle } from '$lib/components/ui/toggle';
	import { marked } from 'marked';

	let fileInput: HTMLInputElement;
	let selectedFile: File | null = $state(null);
	let title = $state('');
	let description = $state('');
	let isPublic = $state(true);
	let uploading = $state(false);
	let uploadResult: any = $state(null);
	let error = $state('');
	let markdownContent = $state('');
	let showPreview = $state(false);

	let renderedContent = $derived(marked.parse(markdownContent));

	async function handleUpload(e: Event) {
		e.preventDefault();
		console.log('Upload triggered');

		if (!markdownContent) {
			error = 'Please select a markdown file or add content';
			console.log('No file selected');
			return;
		}

		uploading = true;
		error = '';
		uploadResult = null;

		try {
			const formData = new FormData();
			const file = new Blob([markdownContent], { type: 'text/markdown' });
			const fileName = selectedFile?.name ?? title + '.md';

			formData.append('file', file, fileName);
			formData.append('title', title || fileName.replace('.md', ''));
			formData.append('description', description);
			formData.append('isPublic', isPublic.toString());

			console.log('Sending request with FormData');

			const response = await fetch('/api/pages', {
				method: 'POST',
				body: formData
			});

			console.log('Response status:', response.status);
			const result = await response.json();
			console.log('Response data:', result);

			if (response.ok) {
				uploadResult = result;
				// Reset form
				title = '';
				description = '';
				selectedFile = null;
				if (fileInput) fileInput.value = '';
				markdownContent = ''; // Clear markdown content
				showPreview = false;
			} else {
				error = result.error || 'Upload failed';
			}
		} catch (e) {
			console.error('Upload error:', e);
			error = 'Network error occurred';
		} finally {
			uploading = false;
		}
	}

	async function handleFileChange() {
		const file = fileInput.files?.[0];
		console.log('File change event:', file);
		selectedFile = file || null;
		if (file) {
			if (!title) {
				title = file.name.replace('.md', '');
			}
			// Read file content for preview
			const reader = new FileReader();
			reader.onload = (e) => {
				markdownContent = e.target?.result as string;
			};
			reader.readAsText(file);
		} else {
			markdownContent = '';
		}
	}
</script>

<svelte:head>
	<title>Upload Markdown</title>
</svelte:head>

<Header
	title="Upload Markdown Page"
	description="Upload a markdown file to create a new hosted page"
/>

{#if uploadResult}
	<div class="mx-auto mb-8 max-w-2xl">
		<div
			class="border-success bg-success/20 animate-in fade-in slide-in-from-top-2 flex items-center gap-4 rounded-xl border-2 p-5 shadow-lg"
		>
			<svg
				class="text-success h-8 w-8 flex-shrink-0"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				viewBox="0 0 24 24"
				><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg
			>
			<div class="flex-1">
				<span class="text-success text-lg font-bold">Page uploaded successfully!</span>
				<a
					href={uploadResult.url + `?preview=true`}
					class="text-success hover:text-success/80 ml-3 font-semibold underline transition"
					target="_blank">View page</a
				>
			</div>
		</div>
	</div>
{/if}

<Card class="border-border bg-card border shadow-xl">
	<CardHeader class="pb-2">
		<CardTitle class="text-xl font-semibold">Upload Details</CardTitle>
		<CardDescription class="text-muted-foreground"
			>Choose a markdown file and provide details for your hosted page</CardDescription
		>
	</CardHeader>
	<CardContent class="space-y-8 pt-2">
		<div class="space-y-2">
			<Label for="file" class="font-medium">Markdown File</Label>
			<div
				class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-16 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-2 text-base shadow-sm transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				role="button"
				tabindex="0"
				onclick={() => fileInput.click()}
				onkeydown={(e) => e.key === 'Enter' && fileInput.click()}
			>
				<input
					id="file"
					type="file"
					accept=".md"
					bind:this={fileInput}
					onchange={handleFileChange}
					required
					class="sr-only"
				/>
				{#if selectedFile}
					<p class="text-success mt-1 text-sm">
						Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
					</p>
				{:else}
					<p class="text-muted-foreground">Click to browse or drag & drop</p>
				{/if}
			</div>

			<p class="text-muted-foreground text-xs">
				Only <span class="font-mono">.md</span> files are allowed
			</p>
		</div>

		<div class="space-y-2">
			<Label for="title" class="font-medium">Title</Label>
			<Input
				id="title"
				bind:value={title}
				placeholder="Page title (will be auto-filled from filename)"
			/>
		</div>

		<div class="space-y-2">
			<Label for="description" class="font-medium">Description (Optional)</Label>
			<Textarea
				id="description"
				bind:value={description}
				placeholder="Brief description for SEO and social media"
				rows={3}
			/>
		</div>

		<div class="flex items-center space-x-2 pt-2">
			<Checkbox id="public" bind:checked={isPublic} />
			<Label for="public" class="text-base">Make page public</Label>
		</div>

		<div class="mb-4">
			<div class="mb-2 flex items-center justify-between">
				<Label for="markdownContent">Content</Label>
				<Toggle pressed={showPreview} onPressedChange={(p) => (showPreview = p)}>
					Toggle Preview
				</Toggle>
			</div>
			<div
				class="grid"
				style="grid-template-columns: {showPreview ? '1fr 1fr' : '1fr'}; gap: 1rem;"
			>
				<Textarea
					id="markdownContent"
					bind:value={markdownContent}
					placeholder="Markdown content will appear here after selecting a file..."
					rows={15}
					class="font-mono"
				/>
				{#if showPreview}
					<div class="markdown-body overflow-auto rounded-md border p-4" style="max-height: 400px;">
						{@html renderedContent}
					</div>
				{/if}
			</div>
		</div>

		{#if error}
			<Alert class="border-destructive/20 bg-destructive/10 mt-2">
				<AlertDescription class="text-destructive">{error}</AlertDescription>
			</Alert>
		{/if}

		<Button
			onclick={handleUpload}
			disabled={uploading}
			class="mt-4 h-11 w-full text-base font-semibold"
		>
			{uploading ? 'Uploading...' : 'Upload Page'}
		</Button>
	</CardContent>
</Card>
