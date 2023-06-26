/**
 * A utility class for strings.
 */
/**
 * Converts a string to camel case.
 * @param {string} str - The input string.
 * @returns {string} The converted camel case string.
 */
export function toCamelCase(str) {
    return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase());
}

/**
 * Converts a string to snake case.
 * @param {string} str - The input string.
 * @param {boolean} [keepLeadingUnderscore=false] - Whether to keep the leading underscore (default: false).
 * @returns {string} The converted snake case string.
 */
export function toSnakeCase(str, keepLeadingUnderscore = false) {
    return str.replace(/[A-Z]/g, match => `_${match.toLowerCase()}`).replace(/^_/, keepLeadingUnderscore ? '_' : '');
}

/**
 * Converts a string to title case.
 * @param {string} str - The input string.
 * @returns {string} The converted title case string.
 */
export function toTitleCase(str) {
    return str.replace(/\b\w/g, match => match.toUpperCase());
}

/**
 * Converts a string to dot case.
 * @param {string} str - The input string.
 * @returns {string} The converted dot case string.
 */
export function toDotCase(str) {
    return str.replace(/\s/g, '.').toLowerCase();
}

/**
 * Converts a string to normal case.
 * @param {string} str - The input string.
 * @returns {string} The converted normal case string.
 */
export function toNormalCase(str) {
    return str.replace(/([A-Z])/g, ' $1').replace(/^(.)(.*)/, (_, firstLetter, restOfSentence) => firstLetter.toUpperCase() + restOfSentence.toLowerCase());
}

/**
 * Converts a string to a slug.
 * @param {string} str - The input string.
 * @returns {string} The converted slug.
 */
export function toSlug(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-');
}
