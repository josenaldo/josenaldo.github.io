/**
 * Converts a string into a URL-friendly slug.
 * Handles accented characters, spaces, and special characters.
 *
 * Examples:
 *   "Engenharia de Software" → "engenharia-de-software"
 *   "opinião"                → "opiniao"
 *   "job-market"             → "job-market"
 */
const slugify = (text) =>
    String(text)
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // strip diacritics
        .replace(/[^a-z0-9\s-]/g, '')   // remove non-alphanumeric except spaces/hyphens
        .replace(/[\s_]+/g, '-')         // spaces/underscores → hyphens
        .replace(/-+/g, '-')             // collapse consecutive hyphens
        .replace(/^-|-$/g, '')           // trim leading/trailing hyphens

export default slugify
