<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { ArrowLeft } from '@lucide/svelte';

	let fileInput: HTMLInputElement;
	let selectedFile: File | null = $state(null);
	let title = $state('');
	let description = $state('');
	let isPublic = $state(true);
	let uploading = $state(false);
	let uploadResult: any = $state(null);
	let error = $state('');

	async function handleUpload() {
		console.log('Upload triggered');
		console.log('Selected file:', selectedFile);

		if (!selectedFile) {
			error = 'Please select a markdown file';
			console.log('No file selected');
			return;
		}

		console.log('Selected file:', selectedFile.name, selectedFile.type, selectedFile.size);

		if (!selectedFile.name.endsWith('.md')) {
			error = 'Please select a .md file';
			return;
		}

		uploading = true;
		error = '';
		uploadResult = null;

		try {
			const formData = new FormData();
			formData.append('file', selectedFile);
			formData.append('title', title || selectedFile.name.replace('.md', ''));
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

	function handleFileChange() {
		const file = fileInput.files?.[0];
		console.log('File change event:', file);
		selectedFile = file || null;
		if (file && !title) {
			title = file.name.replace('.md', '');
		}
	}
</script>

<svelte:head>
	<title>Upload Markdown - MarkHoster Admin</title>
</svelte:head>

<div class="container mx-auto max-w-2xl px-4 py-12">
	<div class="mb-10 flex items-center gap-4">
		<Button
			href="/admin/dashboard"
			variant="ghost"
			size="icon"
			class="border-border bg-background hover:bg-muted rounded-full border shadow"
		>
			<ArrowLeft class="h-5 w-5" />
		</Button>
		<div>
			<h1 class="text-foreground text-4xl leading-tight font-extrabold">Upload Markdown Page</h1>
			<p class="text-muted-foreground mt-1 text-base">
				Upload a markdown file to create a new hosted page
			</p>
		</div>
	</div>

	{#if uploadResult}
		<div class="max-w-2xl mx-auto mb-8">
			<div class="rounded-xl border-2 border-success bg-success/20 p-5 flex items-center gap-4 shadow-lg animate-in fade-in slide-in-from-top-2">
				<svg class="w-8 h-8 text-success flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
				<div class="flex-1">
					<span class="font-bold text-success text-lg">Page uploaded successfully!</span>
					<a href={uploadResult.url} class="ml-3 font-semibold underline text-success hover:text-success/80 transition" target="_blank">View page</a>
				</div>
			</div>
		</div>
	{/if}

	<Card class="shadow-xl border border-border bg-card">
		<CardHeader class="pb-2">
			<CardTitle class="text-xl font-semibold">Upload Details</CardTitle>
			<CardDescription class="text-muted-foreground">Choose a markdown file and provide details for your hosted page</CardDescription>
		</CardHeader>
		<CardContent class="space-y-8 pt-2">
			<div class="space-y-2">
				<Label for="file" class="font-medium">Markdown File</Label>
				<input
					id="file"
					type="file"
					accept=".md"
					bind:this={fileInput}
					onchange={handleFileChange}
					required
					class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-11 w-full rounded-lg border px-4 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-base file:font-medium focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
				/>
				{#if selectedFile}
					<p class="text-success mt-1 text-sm">
						Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
					</p>
				{/if}
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
					class="h-11 rounded-lg text-base"
				/>
			</div>

			<div class="space-y-2">
				<Label for="description" class="font-medium">Description (Optional)</Label>
				<Textarea
					id="description"
					bind:value={description}
					placeholder="Brief description for SEO and social media"
					rows={3}
					class="rounded-lg text-base"
				/>
			</div>

			<div class="flex items-center space-x-2 pt-2">
				<input
					id="public"
					type="checkbox"
					bind:checked={isPublic}
					class="border-border accent-primary h-5 w-5 rounded"
				/>
				<Label for="public" class="text-base">Make page public</Label>
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
</div>
