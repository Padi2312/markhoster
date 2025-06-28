import { marked } from 'marked';

export async function processMarkdown(markdown: string, assets: { filename: string; publicUrl: string }[]): Promise<string> {
	let processedMarkdown = markdown;

	// Replace asset filenames with their public URLs
	assets.forEach(asset => {
		// Create a regex to match the filename, ensuring it's a whole word
		// This is a basic example and might need refinement for more complex cases
		const escapedFilename = asset.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regex = new RegExp(escapedFilename, 'g');
		processedMarkdown = processedMarkdown.replace(regex, asset.publicUrl);
	});

	return marked.parse(processedMarkdown);
}