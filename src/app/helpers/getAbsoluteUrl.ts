/**
 * Helper function to convert relative URLs to absolute URLs
 * @param path - Relative path (e.g., '/city/buenos-aires' or '/travel-guide')
 * @returns Absolute URL (e.g., 'https://www.sherpafoodtours.com/city/buenos-aires')
 */
export function getAbsoluteUrl(path: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.sherpafoodtours.com';
    
    // If path is already absolute, return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    
    // If path is an anchor link, return as is (relative to current page)
    if (path.startsWith('#')) {
        return path;
    }
    
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Remove trailing slash from baseUrl and add normalized path
    return `${baseUrl.replace(/\/$/, '')}${normalizedPath}`;
}

