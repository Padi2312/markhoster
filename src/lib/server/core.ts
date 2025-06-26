import { marked } from 'marked';

export async function processMarkdown(markdown: string, assets: any[]): Promise<string> {
	// In a real application, you would process assets here as well,
	// e.g., replacing placeholders with public URLs.
	return marked.parse(markdown);
}
