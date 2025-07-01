import { db } from '$lib/server/db';
import { markdownPages } from '$lib/server/db/schema';
import type { RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';



// Function to generate a URL-safe slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim()
        .substring(0, 50); // Limit length
}

// Function to ensure unique slug
async function ensureUniqueSlug(baseSlug: string): Promise<string> {
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
        const existing = await db.select().from(markdownPages).where(eq(markdownPages.slug, slug)).limit(1);
        if (existing.length === 0) {
            return slug;
        }
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
}

export const POST: RequestHandler = async ({ request, url }) => {
    try {
        const formData = await request.formData();
        
        const file = formData.get('file') as File | null;
        const title = formData.get('title') as string | null;
        const description = formData.get('description') as string | null;
        const isPublic = formData.get('isPublic') !== 'false'; // Default to true

        if (!file) {
            return new Response(JSON.stringify({ error: 'No file uploaded.' }), { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const originalName = file.name;
        const pageTitle = title || originalName.replace(/\.md$/i, '');
        const baseSlug = generateSlug(pageTitle);
        const uniqueSlug = await ensureUniqueSlug(baseSlug);
        const markdownContent = buffer.toString('utf-8');

        // Insert into database with proper schema
        const [insertedPage] = await db.insert(markdownPages).values({
            userId: null, // TODO: Get from session/auth
            title: pageTitle,
            slug: uniqueSlug,
            content: markdownContent,
            description: description || null,
            isPublic,
            isActive: true,
            viewCount: 0
        }).returning();

        const publicUrl = `${url.origin}/pages/${uniqueSlug}`;
        return new Response(JSON.stringify({ 
            success: true, 
            id: insertedPage.id,
            slug: uniqueSlug,
            url: publicUrl,
            title: pageTitle
        }), { status: 201 });
    } catch (e) {
        console.error('API: Upload failed:', e);
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        return new Response(JSON.stringify({ error: 'Upload failed: ' + errorMessage }), { status: 500 });
    }
};