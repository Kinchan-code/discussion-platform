import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge class names
 * @param {...ClassValue[]} inputs - Class names to merge
 * @returns {string} Merged class names
 *
 * @example
 * const className = cn('bg-red-500', 'text-white', 'p-4');
 * // Returns: "bg-red-500 text-white p-4"
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Updates a URL parameter without refreshing the page
 * @param paramName The name of the parameter to update
 * @param value The new value, or null to remove the parameter
 */
export const updateUrlParam = (paramName: string, value: string | null) => {
  const searchParams = new URLSearchParams(window.location.search);

  if (value !== null) {
    searchParams.set(paramName, value);
  } else {
    searchParams.delete(paramName);
  }

  const queryString = searchParams.toString();
  const newUrl = queryString ? `?${queryString}` : window.location.pathname;
  window.history.replaceState(null, "", newUrl);
};

/**
 * Formats an ISO date string to a localized date string
 * @param isoDateString The ISO date string (e.g., "2025-07-25T16:01:26.000000Z")
 * @param options Optional Intl.DateTimeFormatOptions to customize the output
 * @returns A localized date string
 */
export const formatDate = (
  isoDateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  try {
    const date = new Date(isoDateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string provided:", isoDateString);
      return "Invalid Date";
    }

    // Default options for a clean date format
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    return date.toLocaleDateString(undefined, options || defaultOptions);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

/**
 * Converts a string to a URL-friendly slug
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug string
 *
 * @example
 * slugify("My Awesome Protocol") // Returns: "my-awesome-protocol"
 * slugify("Thread #123") // Returns: "thread-123"
 */
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};
