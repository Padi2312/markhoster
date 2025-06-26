import type { RequestHandler } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import path from 'path';
import { error } from '@sveltejs/kit';

const ASSETS_DIR = path.resolve('files', 'assets');

export const GET: RequestHandler = async ({ params }) => {
    try {
        const { filename } = params;
        
        if (!filename) {
            throw error(404, 'File not found');
        }
        
        // Sanitize filename to prevent directory traversal
        const sanitizedFilename = path.basename(filename);
        const filePath = path.join(ASSETS_DIR, sanitizedFilename);
        
        // Read the file
        const fileBuffer = await readFile(filePath);
        
        // Determine content type based on file extension
        const ext = path.extname(sanitizedFilename).toLowerCase();
        const contentTypes: Record<string, string> = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.txt': 'text/plain',
            '.json': 'application/json'
        };
        
        const contentType = contentTypes[ext] || 'application/octet-stream';
        
        return new Response(new Uint8Array(fileBuffer), {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000' // Cache for 1 year
            }
        });
        
    } catch (e) {
        console.error('Error serving asset:', e);
        throw error(404, 'File not found');
    }
};
