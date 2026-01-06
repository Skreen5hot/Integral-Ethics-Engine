/**
 * Deliberation Orchestrator Concept
 *
 * Architecture: Concepts + Synchronizations pattern
 *
 * Responsibilities:
 * - Coordinate multi-step deliberation workflow
 * - Validate scenario inputs against schemas
 * - Orchestrate worldview evaluations and conflict resolution
 * - Format results for consumption by UI or future API
 *
 * NOTE: This is an Orchestrator Service (exception to pure Concepts pattern)
 * It directly imports multiple concepts to coordinate infrastructure-level workflow.
 * This is acceptable because deliberation orchestration is an infrastructure concern,
 * not a domain concept.
 */

import valueConflictResolver from '../concepts/valueConflictResolver.js';
import { validateScenarioInput, validateDeliberationResult } from './schemas/deliberation-schemas.js';
import { parseScenario } from '../concepts/scenarioParser.js';
import { worldviewManager } from '../concepts/worldviewManager.js';
import { applyWorldviewToScenario } from '../concepts/moralReasoner.js';

// ============================================================================
// PURE FUNCTIONS - Domain Detection and Formatting
// ============================================================================

/**
 * Detect domain from scenario text using keyword analysis
 * @param {string} scenarioText - Scenario description
 * @returns {string} Detected domain
 */
export function detectDomain(scenarioText) {
  if (!scenarioText || typeof scenarioText !== 'string') {
    return 'general';
  }

  const text = scenarioText.toLowerCase();

  // Healthcare keywords
  const healthcareKeywords = ['patient', 'medical', 'doctor', 'hospital', 'health', 'disease', 'treatment', 'surgery', 'medicine', 'life support', 'diagnosis', 'therapy'];
  const healthcareScore = healthcareKeywords.filter(kw => text.includes(kw)).length;

  // Spiritual keywords
  const spiritualKeywords = ['god', 'divine', 'religious', 'spiritual', 'prayer', 'faith', 'sacred', 'church', 'worship', 'soul', 'scripture', 'belief'];
  const spiritualScore = spiritualKeywords.filter(kw => text.includes(kw)).length;

  // Education keywords
  const educationKeywords = ['student', 'teacher', 'school', 'university', 'education', 'learning', 'class', 'exam', 'grade', 'curriculum', 'academic', 'study'];
  const educationScore = educationKeywords.filter(kw => text.includes(kw)).length;

  // Vocational keywords
  const vocationalKeywords = ['job', 'career', 'work', 'employer', 'employee', 'salary', 'profession', 'occupation', 'hire', 'resign', 'promotion', 'workplace'];
  const vocationalScore = vocationalKeywords.filter(kw => text.includes(kw)).length;

  // Environmental keywords
  const environmentalKeywords = ['environment', 'nature', 'climate', 'pollution', 'conservation', 'ecosystem', 'wildlife', 'forest', 'ocean', 'sustainability', 'species', 'habitat'];
  const environmentalScore = environmentalKeywords.filter(kw => text.includes(kw)).length;

  // Interpersonal keywords
  const interpersonalKeywords = ['relationship', 'friend', 'family', 'marriage', 'love', 'trust', 'partner', 'spouse', 'parent', 'child', 'sibling', 'intimacy'];
  const interpersonalScore = interpersonalKeywords.filter(kw => text.includes(kw)).length;

  // Intellectual keywords
  const intellectualKeywords = ['research', 'study', 'science', 'knowledge', 'theory', 'experiment', 'hypothesis', 'data', 'evidence', 'publication', 'journal', 'peer review'];
  const intellectualScore = intellectualKeywords.filter(kw => text.includes(kw)).length;

  // Find highest scoring domain
  const scores = {
    healthcare: healthcareScore,
    spiritual: spiritualScore,
    education: educationScore,
    vocational: vocationalScore,
    environmental: environmentalScore,
    interpersonal: interpersonalScore,
    intellectual: intellectualScore
  };

  const maxScore = Math.max(...Object.values(scores));

  // If no clear domain detected (score 0 or tie), return general
  if (maxScore === 0) {
    return 'general';
  }

  // Return domain with highest score (first match if tie)
  for (const [domain, score] of Object.entries(scores)) {
    if (score === maxScore) {
      return domain;
    }
  }

  return 'general';
}

/**
 * Select worldviews to consult for deliberation
 * @param {Object} scenario - Scenario input
 * @param {string} domain - Domain context
 * @param {Object} options - Selection options
 * @returns {string[]} Array of worldview names
 */
export function selectWorldviews(scenario, domain, options = {}) {
  // Default: all 12 worldviews
  const allWorldviews = [
    'Materialism',
    'Sensationalism',
    'Phenomenalism',
    'Realism',
    'Dynamism',
    'Monadism',
    'Idealism',
    'Rationalism',
    'Psychism',
    'Pneumatism',
    'Spiritualism',
    'Mathematism'
  ];

  // If user specified custom worldviews, use those
  if (options.worldviews && Array.isArray(options.worldviews) && options.worldviews.length > 0) {
    // Validate that specified worldviews exist
    return options.worldviews.filter(wv => allWorldviews.includes(wv));
  }

  // Otherwise return all worldviews
  return allWorldviews;
}

/**
 * Format deliberation result for API/UI consumption
 * @param {Object} resolution - Resolution from valueConflictResolver
 * @param {Array} evaluations - Worldview evaluations
 * @param {string} domain - Domain context
 * @param {Object} scenario - Original scenario input
 * @returns {Object} Formatted deliberation result
 */
export function formatDeliberationResult(resolution, evaluations, domain, scenario) {
  // Extract step names from step objects (valueConflictResolver returns objects)
  const stepNames = Array.isArray(resolution.steps)
    ? resolution.steps.map(step => typeof step === 'string' ? step : step.name)
    : [];

  return {
    id: resolution.id,
    timestamp: resolution.timestamp,
    scenario: {
      description: scenario.description,
      domain: domain,
      context: scenario.context || {}
    },
    domain: domain,
    judgment: resolution.judgment,
    confidence: resolution.confidence,
    confidenceLevel: resolution.confidenceLevel,
    worldviews: evaluations.map(evaluation => ({
      worldview: evaluation.worldview,
      judgment: evaluation.judgment,
      confidence: evaluation.confidence,
      reasoning: evaluation.reasoning,
      values: evaluation.values || [],
      weight: resolution.weights[evaluation.worldview] || 0.5
    })),
    conflicts: resolution.conflictDetails,
    minorityViews: resolution.minorityViews,
    supportingWorldviews: resolution.supportingWorldviews,
    justification: resolution.justification,
    steps: stepNames,
    metadata: {
      evaluationsCount: evaluations.length,
      conflictsCount: resolution.conflicts,
      minorityViewsCount: resolution.minorityViews.length,
      completedAt: resolution.timestamp
    }
  };
}

// ============================================================================
// DELIBERATION ORCHESTRATOR CONCEPT
// ============================================================================

export const deliberationOrchestrator = {
  /**
   * State
   */
  state: {
    currentDeliberation: null,
    deliberationInProgress: false,
    lastError: null
  },

  /**
   * Actions (stateful operations)
   */
  actions: {
    /**
     * Main deliberation workflow - orchestrates full process
     * @param {Object} scenario - Scenario input
     * @param {Object} options - Deliberation options
     * @returns {Object} Formatted deliberation result
     */
    async deliberateOnScenario(scenario, options = {}) {
      try {
        // Mark deliberation as in progress
        deliberationOrchestrator.state.deliberationInProgress = true;
        deliberationOrchestrator.state.lastError = null;
        deliberationOrchestrator.emit('deliberationStarted', { scenario });

        // Step 1: Validate scenario input
        const validationResult = validateScenarioInput(scenario);
        if (!validationResult.valid) {
          throw new Error(`Invalid scenario input: ${validationResult.errors.join(', ')}`);
        }

        // Step 2: Detect or use provided domain
        const domain = scenario.domain || detectDomain(scenario.description);
        deliberationOrchestrator.emit('domainDetected', { domain });

        // Step 3: Select worldviews to consult
        const worldviews = selectWorldviews(scenario, domain, options);
        deliberationOrchestrator.emit('worldviewsSelected', { worldviews, count: worldviews.length });

        // Step 4: Generate worldview evaluations using real moralReasoner
        const evaluations = generateRealEvaluations(worldviews, scenario, domain);
        deliberationOrchestrator.emit('evaluationsGenerated', { count: evaluations.length });

        // Step 5: Resolve conflicts using valueConflictResolver
        valueConflictResolver.actions.setDomain(domain);
        const resolution = valueConflictResolver.actions.resolveConflict(evaluations, {
          scenarioId: scenario.id || `scenario_${Date.now()}`,
          description: scenario.description,
          domain: domain
        });
        deliberationOrchestrator.emit('conflictsResolved', { resolution });

        // Step 6: Format complete result
        const result = formatDeliberationResult(resolution, evaluations, domain, scenario);

        // Validate formatted result
        const resultValidation = validateDeliberationResult(result);
        if (!resultValidation.valid) {
          console.warn('Result validation warnings:', resultValidation.errors);
        }

        // Update state
        deliberationOrchestrator.state.currentDeliberation = result;
        deliberationOrchestrator.state.deliberationInProgress = false;

        deliberationOrchestrator.emit('deliberationCompleted', { result });

        return result;

      } catch (error) {
        deliberationOrchestrator.state.lastError = error.message;
        deliberationOrchestrator.state.deliberationInProgress = false;
        deliberationOrchestrator.emit('deliberationFailed', { error: error.message });
        throw error;
      }
    },

    /**
     * Reset orchestrator state
     */
    reset() {
      deliberationOrchestrator.state.currentDeliberation = null;
      deliberationOrchestrator.state.deliberationInProgress = false;
      deliberationOrchestrator.state.lastError = null;
      deliberationOrchestrator.emit('reset');
    }
  },

  /**
   * Event emitter
   */
  listeners: {},

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  },

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
};

// ============================================================================
// REAL REASONING INTEGRATION
// ============================================================================

/**
 * Generate real worldview evaluations using moralReasoner.
 * Replaces the previous mock implementation.
 *
 * @param {string[]} worldviews - Worldviews to evaluate
 * @param {Object} scenario - Raw scenario (natural language)
 * @param {string} domain - Domain
 * @returns {Array} Real evaluations from moralReasoner
 */
function generateRealEvaluations(worldviews, scenario, domain) {
  // Step 1: Parse natural language scenario into structured format
  const structuredScenario = parseScenario({
    description: scenario.description,
    domain: domain,
    context: scenario.context || {}
  });

  // Step 2: Get real value hierarchies for each worldview
  const worldviewsWithValues = worldviews.map(worldviewName => {
    // Get worldview data from worldviewManager
    const worldviewData = worldviewManager.state.worldviews[worldviewName];
    const values = worldviewManager.state.valueHierarchies[worldviewName];

    if (!worldviewData || !values) {
      console.warn(`Worldview ${worldviewName} not found in worldviewManager, using fallback`);
      return {
        name: worldviewName,
        values: {
          terminal: [],
          constitutive: [],
          instrumental: []
        }
      };
    }

    return {
      name: worldviewName,
      values: values
    };
  });

  // Step 3: Apply each worldview to the structured scenario
  const evaluations = worldviewsWithValues.map(({ name, values }) => {
    try {
      // Use real moralReasoner logic
      const judgment = applyWorldviewToScenario(values, structuredScenario, name);

      // Map moralReasoner output format to deliberationOrchestrator expected format
      return {
        worldview: name,
        judgment: mapJudgmentToPermissibility(judgment.judgment),
        confidence: judgment.confidence,
        reasoning: judgment.reasoning,
        values: judgment.relevantValues.map(v => v.value),
        meta: {
          conflicts: judgment.conflicts,
          complexity: structuredScenario.meta.complexity
        }
      };
    } catch (error) {
      console.error(`Error evaluating worldview ${name}:`, error);
      // Fallback to neutral judgment if evaluation fails
      return {
        worldview: name,
        judgment: 'uncertain',
        confidence: 0.1,
        reasoning: `Could not evaluate from ${name} perspective: ${error.message}`,
        values: [],
        meta: {
          error: error.message
        }
      };
    }
  });

  return evaluations;
}

/**
 * Maps moralReasoner judgment types to permissibility categories.
 * moralReasoner uses: 'right', 'wrong', 'neutral', 'complex'
 * UI expects: 'permissible', 'impermissible', 'uncertain'
 *
 * @param {string} judgment - moralReasoner judgment
 * @returns {string} Mapped judgment
 */
function mapJudgmentToPermissibility(judgment) {
  const mapping = {
    'right': 'permissible',
    'wrong': 'impermissible',
    'neutral': 'uncertain',
    'complex': 'uncertain'
  };

  return mapping[judgment] || 'uncertain';
}

export default deliberationOrchestrator;
