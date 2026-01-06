/**
 * Session Store
 *
 * Svelte writable store that wraps sessionManager
 * Provides reactive state management for session, preferences, and history
 *
 * Features:
 * - Reactive session state
 * - Automatic persistence via IndexedDB
 * - History management
 * - Preferences sync
 */

import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { sessionManager } from '../../application/sessionManager.js';
import { IndexedDBAdapter } from '../storage/IndexedDBAdapter.js';

/**
 * Create session store
 * @returns {Object} Svelte writable store with session actions
 */
function createSessionStore() {
	// Initialize with sessionManager state
	const { subscribe, set, update } = writable({
		currentSession: sessionManager.state.currentSession,
		currentDeliberation: sessionManager.state.currentDeliberation,
		history: sessionManager.state.history,
		isInitialized: sessionManager.state.isInitialized,
		lastError: sessionManager.state.lastError
	});

	// Initialize sessionManager with IndexedDB (browser only)
	if (browser) {
		const adapter = new IndexedDBAdapter();
		sessionManager.actions.initialize(adapter).catch(error => {
			console.error('Failed to initialize session manager:', error);
		});
	}

	// Subscribe to sessionManager events
	sessionManager.on('initialized', ({ hasSession, historyCount }) => {
		update(state => ({
			...state,
			currentSession: sessionManager.state.currentSession,
			history: sessionManager.state.history,
			isInitialized: true
		}));
	});

	sessionManager.on('sessionCreated', ({ session }) => {
		update(state => ({
			...state,
			currentSession: session
		}));
	});

	sessionManager.on('sessionEnded', () => {
		update(state => ({
			...state,
			currentSession: null,
			currentDeliberation: null
		}));
	});

	sessionManager.on('preferencesUpdated', ({ preferences }) => {
		update(state => ({
			...state,
			currentSession: sessionManager.state.currentSession
		}));
	});

	sessionManager.on('deliberationSaved', ({ deliberation }) => {
		update(state => ({
			...state,
			currentDeliberation: sessionManager.state.currentDeliberation,
			history: sessionManager.state.history
		}));
	});

	sessionManager.on('historyCleared', () => {
		update(state => ({
			...state,
			history: [],
			currentDeliberation: null
		}));
	});

	sessionManager.on('error', ({ error }) => {
		update(state => ({
			...state,
			lastError: error
		}));
	});

	return {
		subscribe,

		/**
		 * Create new session
		 * @param {string} userId - User identifier
		 * @param {Object} preferences - Initial preferences
		 */
		async createSession(userId, preferences = {}) {
			try {
				const session = await sessionManager.actions.createSession(userId, preferences);
				return session;
			} catch (error) {
				console.error('Failed to create session:', error);
				throw error;
			}
		},

		/**
		 * End current session
		 */
		async endSession() {
			try {
				await sessionManager.actions.endSession();
			} catch (error) {
				console.error('Failed to end session:', error);
				throw error;
			}
		},

		/**
		 * Update preferences
		 * @param {Object} newPreferences - Preferences to update
		 */
		async updatePreferences(newPreferences) {
			try {
				const preferences = await sessionManager.actions.updatePreferences(newPreferences);
				return preferences;
			} catch (error) {
				console.error('Failed to update preferences:', error);
				throw error;
			}
		},

		/**
		 * Get current preferences
		 * @returns {Object} Current preferences
		 */
		getPreferences() {
			return sessionManager.actions.getPreferences();
		},

		/**
		 * Save deliberation to history
		 * @param {Object} deliberation - Deliberation result
		 */
		async saveDeliberation(deliberation) {
			try {
				const entry = await sessionManager.actions.saveDeliberation(deliberation);
				return entry;
			} catch (error) {
				console.error('Failed to save deliberation:', error);
				throw error;
			}
		},

		/**
		 * Get deliberation history
		 * @param {Object} criteria - Filter and sort criteria
		 * @returns {Array} Filtered history
		 */
		getHistory(criteria = {}) {
			return sessionManager.actions.getHistory(criteria);
		},

		/**
		 * Get deliberation by ID
		 * @param {string} id - Deliberation ID
		 * @returns {Object|null} History entry or null
		 */
		getDeliberationById(id) {
			return sessionManager.actions.getDeliberationById(id);
		},

		/**
		 * Clear history
		 */
		async clearHistory() {
			try {
				await sessionManager.actions.clearHistory();
			} catch (error) {
				console.error('Failed to clear history:', error);
				throw error;
			}
		},

		/**
		 * Export session data
		 * @returns {Object} Complete session data
		 */
		exportData() {
			return sessionManager.actions.exportSessionData();
		},

		/**
		 * Import session data
		 * @param {Object} data - Session data to import
		 */
		async importData(data) {
			try {
				await sessionManager.actions.importSessionData(data);
			} catch (error) {
				console.error('Failed to import session data:', error);
				throw error;
			}
		}
	};
}

export const session = createSessionStore();
