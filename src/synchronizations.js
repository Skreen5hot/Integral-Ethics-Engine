/**
 * Synchronizations
 *
 * Declarative rules that coordinate concepts for the Integral Ethics Engine.
 * This file makes ALL cross-concept dependencies explicit and visible.
 *
 * Following Concepts + Synchronizations pattern:
 * - Each synchronization declares: when (event), from (concept), do (action)
 * - Synchronizations are thin orchestration - no business logic here
 * - All side effects happen in concept actions
 * - Pure coordination logic only
 *
 * Phase 1: Material-Empirical worldviews coordination
 */

import { worldviewManager } from './concepts/worldviewManager.js';
import { moralReasoner } from './concepts/moralReasoner.js';
import { ontologyLoader } from './concepts/ontologyLoader.js';

// ============================================================================
// SYNCHRONIZATION DEFINITIONS
// ============================================================================

/**
 * Synchronization rules as declarative data structures.
 * Each rule specifies an event-driven coordination between concepts.
 */
export const synchronizations = [
  // When ontology is loaded, extract and load worldviews
  {
    name: 'ontology-to-worldview',
    when: 'ontologyLoaded',
    from: ontologyLoader,
    description: 'When ontology loaded, materialize worldviews into worldviewManager',
    do: (payload) => {
      // This is orchestration - coordinating ontologyLoader and worldviewManager
      // No business logic here, just calling concept actions

      // Future enhancement: automatically detect worldviews in loaded ontology
      // For Phase 1, we use programmatic loading via worldviewManager
      console.log(`[Sync] Ontology loaded: ${payload.filePath} (${payload.tripleCount} triples)`);
    }
  },

  // When worldview is loaded, make it available to moral reasoner
  {
    name: 'worldview-to-reasoner',
    when: 'worldviewLoaded',
    from: worldviewManager,
    description: 'When worldview loaded, notify moral reasoner of availability',
    do: (payload) => {
      console.log(`[Sync] Worldview loaded: ${payload.name}`);
      // Moral reasoner will use worldviews passed to evaluate() method
      // No action needed here - just logging for visibility
    }
  },

  // When evaluation is requested, gather active worldviews and evaluate
  {
    name: 'evaluation-coordinator',
    when: 'evaluationRequested',
    from: moralReasoner,
    description: 'When evaluation requested, coordinate multi-perspectival reasoning',
    do: (payload) => {
      const { scenario } = payload;

      // Get active worldviews from worldviewManager
      const activeWorldviewNames = worldviewManager.state.activeWorldviews;

      if (activeWorldviewNames.length === 0) {
        console.warn('[Sync] No active worldviews for evaluation');
        return;
      }

      // Gather worldview data
      const worldviews = activeWorldviewNames.map(name => ({
        name,
        values: worldviewManager.state.valueHierarchies[name],
        metaphysics: worldviewManager.state.worldviews[name]?.metaphysics
      }));

      // Delegate to moral reasoner
      moralReasoner.actions.evaluate(scenario, worldviews);
    }
  },

  // When worldview is activated, log for transparency
  {
    name: 'worldview-activation-logger',
    when: 'worldviewActivated',
    from: worldviewManager,
    description: 'Log worldview activation for transparency',
    do: (payload) => {
      console.log(`[Sync] Worldview activated: ${payload.name}`);
    }
  },

  // When evaluation completes, log results for transparency
  {
    name: 'evaluation-completion-logger',
    when: 'evaluationCompleted',
    from: moralReasoner,
    description: 'Log evaluation completion with summary',
    do: (payload) => {
      const { evaluation } = payload;
      const worldviewCount = evaluation.worldviewsConsulted.length;
      console.log(`[Sync] Evaluation completed: ${worldviewCount} worldviews consulted`);

      // Log each worldview's judgment
      Object.entries(evaluation.judgments).forEach(([worldview, judgment]) => {
        console.log(`  - ${worldview}: ${judgment.judgment} (confidence: ${judgment.confidence})`);
      });
    }
  }
];

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initializes all synchronizations by subscribing to concept events.
 * This function wires up the event-driven coordination.
 *
 * Call this once at application startup.
 */
export function initializeSynchronizations() {
  synchronizations.forEach(sync => {
    // Subscribe to the event from the source concept
    sync.from.subscribe((event, payload) => {
      if (event === sync.when) {
        try {
          sync.do(payload);
        } catch (error) {
          console.error(`[Sync Error] ${sync.name}:`, error.message);
        }
      }
    });

    console.log(`[Sync Init] Registered: ${sync.name} (${sync.description})`);
  });

  console.log(`[Sync Init] ${synchronizations.length} synchronizations initialized`);
}

/**
 * Helper to manually trigger evaluation with automatic worldview coordination.
 * This is a convenience wrapper that leverages synchronizations.
 *
 * @param {Object} scenario - Moral scenario to evaluate
 * @returns {Object} Multi-perspectival evaluation
 */
export function evaluateScenario(scenario) {
  // Get active worldviews
  const activeWorldviewNames = worldviewManager.state.activeWorldviews;

  if (activeWorldviewNames.length === 0) {
    throw new Error('No active worldviews. Load and activate worldviews first.');
  }

  // Gather worldview data
  const worldviews = activeWorldviewNames.map(name => ({
    name,
    values: worldviewManager.state.valueHierarchies[name],
    metaphysics: worldviewManager.state.worldviews[name]?.metaphysics
  }));

  // Evaluate (synchronizations will handle logging)
  return moralReasoner.actions.evaluate(scenario, worldviews);
}

// ============================================================================
// RESET (for testing)
// ============================================================================

/**
 * Resets all concepts managed by synchronizations.
 * Use this in test beforeEach hooks.
 */
export function resetAll() {
  worldviewManager.actions.reset();
  moralReasoner.actions.reset();
  ontologyLoader.actions.reset();
  console.log('[Sync] All concepts reset');
}
