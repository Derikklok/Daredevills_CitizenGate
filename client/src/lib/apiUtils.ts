/**
 * Utility functions for API calls
 */

/**
 * Gets a normalized API URL by removing the trailing '/api' if it exists
 * to avoid duplication when appending endpoint paths
 * 
 * @param apiUrl - The base API URL
 * @returns The normalized API URL
 */
export function getNormalizedApiUrl(apiUrl: string): string {
    // Remove '/api' if it's already included in the URL to avoid duplication
    return apiUrl.endsWith('/api') 
        ? apiUrl.slice(0, -4) 
        : apiUrl;
}
