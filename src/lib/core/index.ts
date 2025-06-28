import type { PageAsset } from '$lib/server/db/types';
import { marked } from 'marked';
import markedAlert from 'marked-alert';
import markedShiki from 'marked-shiki';
import { codeToHtml } from 'shiki';

export const processMarkdown = async (content: string, assets: PageAsset[]) => {
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
	marked.use(markedAlert());
	marked.use(
		markedShiki({
			async highlight(code, lang) {
				return await codeToHtml(code, { lang, theme: 'min-dark' });
			}
		})
	);

	return await marked(processedContent);
};
