/**
 * Deliberation Store
 *
 * Svelte writable store that wraps deliberationOrchestrator
 * Provides reactive state management for the deliberation UI
 *
 * Architecture: Follows Svelte store contract with subscribe/set/update
 * Events from deliberationOrchestrator automatically update the store
 */

import { writable } from 'svelte/store';
import { deliberationOrchestrator } from '../../application/deliberationOrchestrator.js';

/**
 * Create deliberation store
 * @returns {Object} Svelte writable store
 */
function createDeliberationStore() {
	// Initialize with orchestrator state
	const { subscribe, set, update } = writable({
		currentDeliberation: deliberationOrchestrator.state.currentDeliberation,
		inProgress: deliberationOrchestrator.state.deliberationInProgress,
		lastError: deliberationOrchestrator.state.lastError
	});

	// Subscribe to orchestrator events
	deliberationOrchestrator.on('deliberationStarted', () => {
		update(state => ({
			...state,
			inProgress: true,
			lastError: null
		}));
	});

	deliberationOrchestrator.on('deliberationCompleted', ({ result }) => {
		update(state => ({
			...state,
			currentDeliberation: result,
			inProgress: false,
			lastError: null
		}));
	});

	deliberationOrchestrator.on('deliberationFailed', ({ error }) => {
		update(state => ({
			...state,
			inProgress: false,
			lastError: error
		}));
	});

	deliberationOrchestrator.on('reset', () => {
		set({
			currentDeliberation: null,
			inProgress: false,
			lastError: null
		});
	});

	return {
		subscribe,

		/**
		 * Start deliberation on a scenario
		 * @param {Object} scenario - Scenario input
		 * @param {Object} options - Deliberation options
		 */
		async deliberate(scenario, options = {}) {
			try {
				const result = await deliberationOrchestrator.actions.deliberateOnScenario(scenario, options);
				return result;
			} catch (error) {
				console.error('Deliberation failed:', error);
				throw error;
			}
		},

		/**
		 * Reset deliberation state
		 */
		reset() {
			deliberationOrchestrator.actions.reset();
		}
	};
}

export const deliberation = createDeliberationStore();
