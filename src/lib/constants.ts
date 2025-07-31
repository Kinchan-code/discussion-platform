/**
 * API constants
 * @description This file contains constants used for API endpoints and configurations.
 *
 * @returns {Object} An object containing API-related constants.
 *
 * @example
 * import { API_URL, TYPESENSE_API_KEY } from '@/lib/constants';
 */

export const API_URL = import.meta.env.VITE_API_URL;

export const TYPESENSE_API_KEY = import.meta.env.VITE_TYPESENSE_API_KEY;

export const TYPESENSE_HOST = import.meta.env.VITE_TYPESENSE_HOST;

export const TYPESENSE_PORT = import.meta.env.VITE_TYPESENSE_PORT;

export const TYPESENSE_PROTOCOL = import.meta.env.VITE_TYPESENSE_PROTOCOL;

export const TYPESENSE_SEARCH_ONLY_API_KEY = import.meta.env
  .VITE_TYPESENSE_SEARCH_ONLY_API_KEY;
