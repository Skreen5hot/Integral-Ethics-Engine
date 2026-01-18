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

import { findWorldviewMatches, mapSalienceToLevel } from './valueMapper.js';

// ============================================================================
// PURE UTILITY FUNCTIONS
// These are deterministic, testable, and have no side effects
// ============================================================================

/**
 * Matches scenario elements to relevant values from a worldview.
 * Enhanced with TagTeam semantic analysis for high-confidence value detection.
 * PURE FUNCTION - same inputs always produce same outputs.
 *
 * @param {Object} scenario - The moral scenario
 * @param {Object} values - Value hierarchy from a worldview
 * @param {Object} [tagteamResult] - Optional TagTeam semantic analysis result
 * @returns {Array} Relevant values for this scenario
 */
export function matchScenarioToValues(scenario, values, tagteamResult = null) {
  const relevant = [];
  const tagteamDetectedValues = new Set();

  // PRIORITY 1: Use TagTeam's detected values for high-confidence matches
  // semanticAnalyzer returns values in detectedValues array (not ethicalProfile.values)
  const tagteamValues = tagteamResult?.detectedValues || tagteamResult?.ethicalProfile?.values;

  if (tagteamValues && Array.isArray(tagteamValues)) {
    for (const detectedValue of tagteamValues) {
      const matches = findWorldviewMatches(detectedValue.name, values);

      for (const match of matches) {
        tagteamDetectedValues.add(match.value);

        relevant.push({
          value: match.value,
          type: match.type,
          salience: mapSalienceToLevel(detectedValue.salience),
          source: 'semantic_detection',
          tagteamValue: detectedValue.name,
          tagteamSalience: detectedValue.salience,
          polarity: detectedValue.polarity,
          evidence: detectedValue.evidence || [],
          matchQuality: match.matchQuality
        });
      }
    }
  }

  // Extract scenario components
  const { action, context, agents, artifacts } = scenario;
  const actionLower = action?.toLowerCase() || '';

  // PRIORITY 2: Keyword-based matching for values NOT detected by TagTeam
  // Match terminal values - EXPANDED for comprehensive coverage
  if (values.terminal) {
    values.terminal.forEach(value => {
      let matched = false;
      let salience = 'medium';

      // MATERIAL-EMPIRICAL CLUSTER
      if (value === 'physical_wellbeing' || value === 'material_security') {
        if (context.physicalImpact ||
            artifacts?.some(a => a.type === 'life' || a.type === 'health') ||
            actionLower.match(/harm|health|pain|suffer|dying|terminal|cancer|treatment|medical|life support/)) {
          matched = true;
          salience = 'high';
        }
      }

      if (value === 'empirical_truth') {
        if (context.factsInvolved || context.expertise ||
            actionLower.match(/evidence|data|research|study|proven|medical fact/)) {
          matched = true;
          salience = 'high';
        }
      }

      if (value === 'experiential_richness' || value === 'hedonic_quality' || value === 'aesthetic_beauty') {
        if (context.aesthetic || context.sensory ||
            actionLower.match(/experience|quality of life|pleasure|beauty|aesthetic/)) {
          matched = true;
          salience = context.aesthetic ? 'high' : 'medium';
        }
      }

      if (value === 'interpretive_honesty' || value === 'lived_experience' || value === 'phenomenological_depth') {
        if (context.sensory || context.personsInvolved ||
            agents?.some(a => a.role === 'self' || a.role === 'patient') ||
            actionLower.match(/experience|feel|perspective|interpret|prefer/)) {
          matched = true;
          salience = 'medium';
        }
      }

      if (value === 'objective_truth' || value === 'correspondence_to_reality' || value === 'natural_law') {
        if (context.truthClaims || context.factsInvolved ||
            actionLower.match(/fact|truth|reality|objective|evidence/)) {
          matched = true;
          salience = 'high';
        }
      }

      // PROCESS-INDIVIDUAL CLUSTER
      if (value === 'growth' || value === 'transformation' || value === 'vital_energy' || value === 'creative_becoming') {
        if (context.futureImpact ||
            actionLower.match(/grow|develop|transform|evolve|change|progress/)) {
          matched = true;
          salience = 'medium';
        }
      }

      if (value === 'individual_uniqueness' || value === 'personal_identity' || value === 'authentic_selfhood') {
        if (context.personsInvolved || agents?.length > 0 ||
            actionLower.match(/individual|person|patient|self|identity|autonomy|dignity/)) {
          matched = true;
          salience = agents?.some(a => a.role === 'self') ? 'high' : 'medium';
        }
      }

      // DEPTH-IDEAL CLUSTER
      if (value === 'conceptual_coherence' || value === 'rational_order' || value === 'ideal_form') {
        if (context.moralConflict ||
            actionLower.match(/principle|concept|ideal|should|ought|right|wrong/)) {
          matched = true;
          salience = 'medium';
        }
      }

      if (value === 'logical_consistency' || value === 'systematic_knowledge' || value === 'rational_certainty') {
        if (context.moralConflict || context.expertise ||
            actionLower.match(/rational|logic|reason|systematic|coherent|consistent/)) {
          matched = true;
          salience = 'medium';
        }
      }

      if (value === 'consciousness_evolution' || value === 'psychic_depth' || value === 'interiority') {
        if (context.personsInvolved || context.moralConflict ||
            actionLower.match(/conscious|awareness|inner|mental|psychological|emotional/)) {
          matched = true;
          salience = 'medium';
        }
      }

      if (value === 'spiritual_transcendence' || value === 'sacred_meaning' || value === 'divine_purpose') {
        if (context.truthClaims ||
            actionLower.match(/spirit|sacred|divine|soul|religious|faith|meaning|purpose/)) {
          matched = true;
          salience = 'medium';
        }
      }

      if (value === 'eternal_truth' || value === 'unchanging_principle' || value === 'absolute_order') {
        if (context.truthClaims || context.moralConflict ||
            actionLower.match(/eternal|absolute|universal|principle|truth|law/)) {
          matched = true;
          salience = 'medium';
        }
      }

      // UNIVERSAL HIGH-SALIENCE: Autonomy and dignity
      if (value.match(/autonomy|dignity|respect|freedom|liberty|rights/)) {
        if (context.autonomyAtStake || context.personsInvolved ||
            agents?.length > 0 ||
            actionLower.match(/decide|choice|freedom|autonomy|consent|force|require/)) {
          matched = true;
          salience = 'high';
        }
      }

      // UNIVERSAL MEDIUM-SALIENCE: Justice, fairness, care
      if (value.match(/justice|fairness|equity|care|compassion|wellbeing/)) {
        if (context.personsInvolved || context.resourceScarcity || context.moralConflict ||
            actionLower.match(/fair|just|care|compassion|allocate|distribute/)) {
          matched = true;
          salience = 'medium';
        }
      }

      // Add if matched AND not already detected by TagTeam
      if (matched && !tagteamDetectedValues.has(value)) {
        relevant.push({ value, type: 'terminal', salience, source: 'keyword_inference' });
      }
    });
  }

  // Always include instrumental values as lower salience (if not detected by TagTeam)
  if (values.instrumental) {
    values.instrumental.forEach(value => {
      if (!tagteamDetectedValues.has(value)) {
        relevant.push({ value, type: 'instrumental', salience: 'low', source: 'keyword_inference' });
      }
    });
  }

  // Fallback: If NO terminal values matched but scenario has context, include at least some instrumental
  if (relevant.filter(v => v.type === 'terminal').length === 0 && values.terminal && values.terminal.length > 0) {
    // Emergency fallback: if physicalImpact context, assume physical wellbeing matters
    if (context.physicalImpact && values.terminal.includes('physical_wellbeing')) {
      relevant.push({ value: 'physical_wellbeing', type: 'terminal', salience: 'high' });
    }
    // If persons involved, assume individual matters
    if (context.personsInvolved && values.terminal.find(v => v.match(/individual|person|dignity/))) {
      const personalValue = values.terminal.find(v => v.match(/individual|person|dignity/));
      relevant.push({ value: personalValue, type: 'terminal', salience: 'medium' });
    }
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
export function applyWorldviewToScenario(worldviewValues, scenario, worldviewName, tagteamResult = null) {
  // Match scenario to relevant values (with optional TagTeam enhancement)
  const relevantValues = matchScenarioToValues(scenario, worldviewValues, tagteamResult);

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
