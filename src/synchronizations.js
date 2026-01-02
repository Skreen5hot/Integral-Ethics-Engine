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
import { processTracker } from './concepts/processTracker.js';
import { characterModel } from './concepts/characterModel.js';

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

  // When ValueNet is loaded, log for transparency
  {
    name: 'valuenet-loader',
    when: 'valueNetLoaded',
    from: ontologyLoader,
    description: 'When ValueNet loaded, log disposition count',
    do: (payload) => {
      console.log(`[Sync] ValueNet loaded: ${payload.dispositionCount} dispositions from ${payload.filesLoaded.length} files`);
    }
  },

  // When ValueNet mappings are loaded, log for transparency
  {
    name: 'valuenet-mappings-loader',
    when: 'valueNetMappingsLoaded',
    from: ontologyLoader,
    description: 'When ValueNet mappings loaded, log mapping count',
    do: (payload) => {
      console.log(`[Sync] ValueNet mappings loaded: ${payload.mappingCount} mappings from ${payload.filePath}`);
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
  },

  // ========================================================================
  // PHASE 2.1: TEMPORAL SYNCHRONIZATIONS
  // ========================================================================

  // When process completes, update character dispositions
  {
    name: 'process-character-coordination',
    when: 'processCompleted',
    from: processTracker,
    description: 'When process completes, update character dispositions based on outcome',
    do: (payload) => {
      const { agentId, outcome, processType } = payload;

      // Ensure agent exists in character model
      if (!characterModel.state.agents[agentId]) {
        try {
          characterModel.actions.createAgent(agentId, {
            source: 'process_tracker',
            createdVia: 'synchronization'
          });
        } catch (error) {
          // Agent might have been created concurrently
          if (!error.message.includes('already exists')) {
            console.error(`[Sync Error] Could not create agent ${agentId}:`, error.message);
            return;
          }
        }
      }

      // Update dispositions based on process type and outcome
      if (processType === 'growth' && outcome === 'success') {
        // Successful growth increases growth disposition
        const currentGrowth = characterModel.state.dispositions[agentId].growth || [];
        const currentValue = currentGrowth.length > 0
          ? currentGrowth[currentGrowth.length - 1].value
          : 0.5;
        const newValue = Math.min(1.0, currentValue + 0.1);

        characterModel.actions.updateDisposition(agentId, 'growth', newValue);
      } else if (processType === 'growth' && outcome === 'failure') {
        // Failed growth slightly decreases disposition (learning from failure)
        const currentGrowth = characterModel.state.dispositions[agentId].growth || [];
        const currentValue = currentGrowth.length > 0
          ? currentGrowth[currentGrowth.length - 1].value
          : 0.5;
        const newValue = Math.max(0.0, currentValue - 0.05);

        characterModel.actions.updateDisposition(agentId, 'growth', newValue);
      }

      console.log(`[Sync] Process ${processType} (${outcome}) → character disposition updated for ${agentId}`);
    }
  },

  // When expressive act logged, monitor sincerity threshold
  {
    name: 'expressive-act-sincerity-tracker',
    when: 'expressiveActLogged',
    from: characterModel,
    description: 'When expressive act logged, check sincerity threshold and log warnings',
    do: (payload) => {
      const { agentId, sincerity } = payload;

      if (sincerity < 0.5) {
        console.warn(`[Sync] Low sincerity detected for ${agentId}: ${sincerity.toFixed(2)}`);
      } else if (sincerity > 0.9) {
        console.log(`[Sync] High sincerity for ${agentId}: ${sincerity.toFixed(2)}`);
      }
    }
  },

  // When sincerity threshold crossed, log warning
  {
    name: 'sincerity-threshold-monitor',
    when: 'sincerityThresholdCrossed',
    from: characterModel,
    description: 'Monitor and log sincerity threshold crossings',
    do: (payload) => {
      const { agentId, sincerity, direction, threshold } = payload;
      console.warn(`[Sync] Sincerity threshold crossed for ${agentId}: ${sincerity.toFixed(2)} (${direction} ${threshold})`);
    }
  },

  // When character evaluated, log summary
  {
    name: 'character-evaluation-logger',
    when: 'characterEvaluated',
    from: characterModel,
    description: 'Log character evaluation summary for transparency',
    do: (payload) => {
      const { evaluation, agentId } = payload;
      console.log(`[Sync] Character evaluated for ${agentId}:`);
      console.log(`  - Sincerity: ${evaluation.sincerity.overallSincerity?.toFixed(2) || 'N/A'} (trend: ${evaluation.sincerity.trend})`);
      console.log(`  - Consistency: ${evaluation.consistency.consistency?.toFixed(2) || 'N/A'} (${evaluation.consistency.patternType})`);
      console.log(`  - Development: ${evaluation.development.progression} (confidence: ${evaluation.confidence.toFixed(2)})`);
    }
  },

  // When transformation detected, log for visibility
  {
    name: 'transformation-logger',
    when: 'transformationDetected',
    from: processTracker,
    description: 'Log transformation events for process worldviews (Dynamism)',
    do: (payload) => {
      const { transformation, agentId } = payload;
      console.log(`[Sync] Transformation detected for ${agentId}:`);
      console.log(`  - Dimension: ${transformation.growth.dimension}`);
      console.log(`  - Direction: ${transformation.growth.direction}`);
      console.log(`  - Magnitude: ${transformation.growth.magnitude.toFixed(2)}`);
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
 *
 * @param {Object} options - Initialization options
 * @param {boolean} options.loadValueNet - Whether to load ValueNet ontologies (default: true)
 */
export async function initializeSynchronizations(options = {}) {
  const { loadValueNet = true } = options;

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

  // Load ValueNet if requested
  if (loadValueNet) {
    try {
      await ontologyLoader.actions.loadValueNet();
      await ontologyLoader.actions.loadValueNetMappings();
      console.log('[Sync Init] ValueNet ontologies loaded');
    } catch (error) {
      console.warn('[Sync Init] Could not load ValueNet:', error.message);
    }
  }
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
