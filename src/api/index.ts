/**
 * API Module Index
 *
 * This file re-exports all API functions to make imports cleaner
 * and hide the internal organization of the API module.
 */

// Export domain-specific APIs
export * from './creditRepair';
export * from './encryption';
export * from './uploads';
export * from './contact';
export * from './admin';
export * from './tracking';

// Export config if needed elsewhere
export { api, fileApi } from './config';