import type { RequestHandler } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { markdownPages } from '$lib/server/db/schema';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { eq } from 'drizzle-orm';

const UPLOAD_DIR = path.resolve('files', 'pages');

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
    console.log('API: Upload request received');
    try {
        const formData = await request.formData();
        console.log('API: FormData parsed');
        
        const file = formData.get('file') as File | null;
        const title = formData.get('title') as string | null;
        const description = formData.get('description') as string | null;
        const isPublic = formData.get('isPublic') !== 'false'; // Default to true
        
        console.log('API: File received:', file?.name, file?.size);
        console.log('API: Title:', title);
        console.log('API: Description:', description);
        console.log('API: IsPublic:', isPublic);
        
        if (!file) {
            console.log('API: No file in request');
            return new Response(JSON.stringify({ error: 'No file uploaded.' }), { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const originalName = file.name;
        const ext = path.extname(originalName).toLowerCase();

        console.log('API: File extension:', ext);

        if (ext !== '.md') {
            console.log('API: Invalid file extension');
            return new Response(JSON.stringify({ error: 'Only .md files allowed.' }), { status: 400 });
        }

        const id = randomUUID();
        const filename = `${id}${ext}`;
        const pageTitle = title || originalName.replace(/\.md$/i, '');
        const baseSlug = generateSlug(pageTitle);
        const uniqueSlug = await ensureUniqueSlug(baseSlug);
        
        console.log('API: Generated slug:', uniqueSlug);
        
        // Read the markdown content
        const markdownContent = buffer.toString('utf-8');
        console.log('API: Markdown content length:', markdownContent.length);

        await mkdir(UPLOAD_DIR, { recursive: true });
        await writeFile(path.join(UPLOAD_DIR, filename), buffer);
        console.log('API: File written to disk');

        // Insert into database with proper schema
        const [insertedPage] = await db.insert(markdownPages).values({
            id,
            userId: null, // TODO: Get from session/auth
            title: pageTitle,
            slug: uniqueSlug,
            content: markdownContent,
            description: description || null,
            isPublic,
            isActive: true,
            viewCount: 0,
            filenameOnFilesystem: filename
        }).returning();

        console.log('API: Page inserted into database:', insertedPage.id);

        const publicUrl = `${url.origin}/pages/${uniqueSlug}`;

        console.log('API: Success, returning URL:', publicUrl);

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