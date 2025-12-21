/**
 * Moral Reasoner Concept
 *
 * Evaluates moral scenarios from multiple worldview perspectives.
 * Implements multi-perspectival moral reasoning without reducing to single foundation.
 *
 * Following Concepts + Synchronizations pattern:
 * - State: current evaluation, reasoning chains, active consultations
 * - Actions: evaluate scenarios, consult worldviews, generate judgments
 * - Pure utilities: scenario → judgment (deterministic, no side effects)
 * - Events: evaluationStarted, worldviewConsulted, evaluationCompleted
 */

// ============================================================================
// PURE UTILITY FUNCTIONS
// These are deterministic, testable, and have no side effects
// ============================================================================

/**
 * Matches scenario elements to relevant values from a worldview.
 * PURE FUNCTION - same inputs always produce same outputs.
 *
 * @param {Object} scenario - The moral scenario
 * @param {Object} values - Value hierarchy from a worldview
 * @returns {Array} Relevant values for this scenario
 */
export function matchScenarioToValues(scenario, values) {
  const relevant = [];

  // Extract scenario components
  const { action, context, agents, artifacts } = scenario;

  // Match terminal values
  if (values.terminal) {
    values.terminal.forEach(value => {
      // Physical wellbeing relevant when bodily harm/benefit involved
      if (value === 'physical_wellbeing' &&
          (action.includes('harm') || action.includes('health') || context.physicalImpact)) {
        relevant.push({ value, type: 'terminal', salience: 'high' });
      }

      // Empirical truth relevant when facts/evidence involved
      if (value === 'empirical_truth' &&
          (action.includes('claim') || action.includes('assert') || context.factsInvolved)) {
        relevant.push({ value, type: 'terminal', salience: 'high' });
      }

      // Experiential richness relevant for aesthetic/sensory scenarios
      if (value === 'experiential_richness' &&
          (context.aesthetic || context.sensory)) {
        relevant.push({ value, type: 'terminal', salience: 'high' });
      }

      // Objective truth relevant when correspondence to reality matters
      if (value === 'objective_truth' &&
          (action.includes('claim') || context.truthClaims)) {
        relevant.push({ value, type: 'terminal', salience: 'high' });
      }

      // Individual uniqueness relevant when personhood at stake
      if (value === 'individual_uniqueness' &&
          (agents?.length > 0 || context.personsInvolved)) {
        relevant.push({ value, type: 'terminal', salience: 'high' });
      }
    });
  }

  // Always include instrumental values as lower salience
  if (values.instrumental) {
    values.instrumental.forEach(value => {
      relevant.push({ value, type: 'instrumental', salience: 'medium' });
    });
  }

  return relevant;
}

/**
 * Detects conflicts between values in a scenario.
 * PURE FUNCTION.
 *
 * @param {Array} relevantValues - Values identified as relevant
 * @param {Object} scenario - The scenario
 * @returns {Array} Detected conflicts
 */
export function detectValueConflicts(relevantValues, scenario) {
  const conflicts = [];

  // Check for terminal value conflicts
  const terminalValues = relevantValues.filter(v => v.type === 'terminal');

  if (terminalValues.length > 1) {
    // Multiple terminal values may conflict
    conflicts.push({
      type: 'terminal_competition',
      values: terminalValues.map(v => v.value),
      description: 'Multiple terminal values compete for priority'
    });
  }

  return conflicts;
}

/**
 * Evaluates an action against a set of values.
 * PURE FUNCTION - deterministic judgment.
 *
 * @param {string} action - The action being evaluated
 * @param {Array} relevantValues - Values to evaluate against
 * @returns {string} Judgment: 'right', 'wrong', 'neutral', 'complex'
 */
export function evaluateAgainstValues(action, relevantValues) {
  if (relevantValues.length === 0) {
    return 'neutral'; // No relevant values = no strong judgment
  }

  const terminalValues = relevantValues.filter(v => v.type === 'terminal');

  if (terminalValues.length === 0) {
    return 'neutral'; // Only instrumental values = contextual
  }

  // Simple heuristic: if action aligns with high-salience terminal values
  // This will be expanded with more sophisticated logic
  const highSalience = terminalValues.filter(v => v.salience === 'high');

  if (highSalience.length > 1) {
    return 'complex'; // Multiple high-salience values suggest complexity
  }

  if (highSalience.length === 1) {
    // Single clear value - need domain-specific evaluation
    // For now, return 'complex' to indicate further analysis needed
    return 'complex';
  }

  return 'neutral';
}

/**
 * Generates reasoning for a judgment based on values.
 * PURE FUNCTION - deterministic reasoning chain.
 *
 * @param {Array} relevantValues - Values that informed judgment
 * @param {Array} conflicts - Detected conflicts
 * @param {string} worldviewName - Name of worldview
 * @returns {string} Natural language reasoning
 */
export function generateReasoning(relevantValues, conflicts, worldviewName) {
  const parts = [];

  parts.push(`From the ${worldviewName} perspective:`);

  if (relevantValues.length === 0) {
    parts.push('This scenario does not engage core values of this worldview.');
    return parts.join(' ');
  }

  const terminal = relevantValues.filter(v => v.type === 'terminal');
  if (terminal.length > 0) {
    const valueList = terminal.map(v => v.value).join(', ');
    parts.push(`The terminal values of ${valueList} are at stake.`);
  }

  if (conflicts.length > 0) {
    parts.push(`However, there are ${conflicts.length} value conflict(s) to resolve.`);
  }

  return parts.join(' ');
}

/**
 * Calculates confidence in a judgment based on value clarity.
 * PURE FUNCTION.
 *
 * @param {Array} relevantValues - Values informing judgment
 * @param {Object} context - Scenario context
 * @returns {number} Confidence from 0 to 1
 */
export function calculateConfidence(relevantValues, context) {
  if (relevantValues.length === 0) {
    return 0.1; // Very low confidence when no values apply
  }

  const terminalValues = relevantValues.filter(v => v.type === 'terminal');
  const highSalience = terminalValues.filter(v => v.salience === 'high');

  if (highSalience.length === 1 && terminalValues.length === 1) {
    return 0.9; // High confidence when single clear terminal value
  }

  if (highSalience.length > 1) {
    return 0.5; // Medium confidence when multiple values compete
  }

  return 0.6; // Moderate confidence otherwise
}

/**
 * Applies a worldview's values to a scenario to generate judgment.
 * PURE FUNCTION - this is the core evaluation logic.
 *
 * @param {Object} worldviewValues - Value hierarchy from worldview
 * @param {Object} scenario - Moral scenario to evaluate
 * @param {string} worldviewName - Name of worldview
 * @returns {Object} Judgment with reasoning
 */
export function applyWorldviewToScenario(worldviewValues, scenario, worldviewName) {
  // Match scenario to relevant values
  const relevantValues = matchScenarioToValues(scenario, worldviewValues);

  // Detect any value conflicts
  const conflicts = detectValueConflicts(relevantValues, scenario);

  // Generate judgment
  const judgment = evaluateAgainstValues(scenario.action, relevantValues);

  // Generate reasoning chain
  const reasoning = generateReasoning(relevantValues, conflicts, worldviewName);

  // Calculate confidence
  const confidence = calculateConfidence(relevantValues, scenario.context);

  return {
    judgment,
    reasoning,
    relevantValues,
    conflicts,
    confidence,
    worldview: worldviewName,
    timestamp: new Date().toISOString()
  };
}

// ============================================================================
// MORAL REASONER CONCEPT (Singleton)
// ============================================================================

export const moralReasoner = {
  /**
   * State - All mutable data
   * Reset this in test beforeEach hooks
   */
  state: {
    currentEvaluation: null,      // Current scenario being evaluated
    reasoningChains: [],           // Historical reasoning chains
    worldviewJudgments: {},        // Judgments by worldview for current scenario
    evaluationInProgress: false
  },

  /**
   * Actions - Business logic that may mutate state
   */
  actions: {
    /**
     * Evaluates a moral scenario from all active worldviews.
     *
     * @param {Object} scenario - Moral scenario to evaluate
     * @param {Array} worldviews - Worldviews to consult (from worldviewManager)
     * @returns {Object} Multi-perspectival evaluation
     */
    evaluate(scenario, worldviews) {
      const self = moralReasoner;

      if (!scenario || !scenario.action) {
        throw new Error('Invalid scenario: must have action property');
      }

      if (!worldviews || worldviews.length === 0) {
        throw new Error('No worldviews provided for evaluation');
      }

      self.state.evaluationInProgress = true;
      self.state.currentEvaluation = scenario;
      self.state.worldviewJudgments = {};

      self.notify('evaluationStarted', { scenario, worldviewCount: worldviews.length });

      // Consult each worldview independently
      worldviews.forEach(worldview => {
        const judgment = self.actions.consultWorldview(worldview.name, worldview.values, scenario);
        self.state.worldviewJudgments[worldview.name] = judgment;
      });

      const evaluation = {
        scenario,
        judgments: self.state.worldviewJudgments,
        worldviewsConsulted: worldviews.map(w => w.name),
        timestamp: new Date().toISOString()
      };

      self.state.reasoningChains.push(evaluation);
      self.state.evaluationInProgress = false;

      self.notify('evaluationCompleted', { evaluation });

      return evaluation;
    },

    /**
     * Consults a single worldview on a scenario.
     * Wraps the pure applyWorldviewToScenario function.
     *
     * @param {string} name - Worldview name
     * @param {Object} values - Value hierarchy
     * @param {Object} scenario - Scenario to evaluate
     * @returns {Object} Judgment from this worldview
     */
    consultWorldview(name, values, scenario) {
      const self = moralReasoner;

      try {
        const judgment = applyWorldviewToScenario(values, scenario, name);

        self.notify('worldviewConsulted', { worldview: name, judgment });

        return judgment;
      } catch (error) {
        self.notify('worldviewConsultationFailed', { worldview: name, error: error.message });
        throw error;
      }
    },

    /**
     * Gets the current evaluation state.
     *
     * @returns {Object} Current evaluation
     */
    getCurrentEvaluation() {
      return moralReasoner.state.currentEvaluation;
    },

    /**
     * Gets all reasoning chains (history).
     *
     * @returns {Array} Historical evaluations
     */
    getReasoningHistory() {
      return moralReasoner.state.reasoningChains;
    },

    /**
     * Resets all state (for testing).
     */
    reset() {
      const self = moralReasoner;
      self.state.currentEvaluation = null;
      self.state.reasoningChains = [];
      self.state.worldviewJudgments = {};
      self.state.evaluationInProgress = false;
      self.notify('reset');
    }
  },

  /**
   * Event System - Pub/Sub for loose coupling
   */
  _subscribers: [],

  notify(event, payload = {}) {
    this._subscribers.forEach(fn => fn(event, payload));
  },

  subscribe(fn) {
    this._subscribers.push(fn);
  },

  unsubscribe(fn) {
    this._subscribers = this._subscribers.filter(sub => sub !== fn);
  }
};
