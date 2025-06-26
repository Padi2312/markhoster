import type { PageAsset } from '$lib/server/db/types';
import { marked } from 'marked';

export const processMarkdown = (content: string, assets: PageAsset[]) => {
	// Replace asset references with actual URLs
	let processedContent = content;

	assets.forEach((asset) => {
		// Replace references like ![alt](filename.jpg) with the actual public URL
		const regex = new RegExp(`!\\[([^\\]]*)\\]\\(${asset.filename}\\)`, 'g');
		processedContent = processedContent.replace(
			regex,
			`![${asset.altText || '$1'}](${asset.publicUrl})`
		);

		// Also handle markdown links to assets
		const linkRegex = new RegExp(`\\[([^\\]]*)\\]\\(${asset.filename}\\)`, 'g');
		processedContent = processedContent.replace(linkRegex, `[$1](${asset.publicUrl})`);
	});

	// Configure marked options
	marked.setOptions({
		breaks: true,
		gfm: true
	});

	return marked(processedContent);
};
