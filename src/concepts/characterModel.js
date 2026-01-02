/**
 * Character Model Concept
 *
 * Tracks moral character over time through disposition evaluations and expressive acts.
 * Implements sincerity tracking (belief-assertion alignment) and character development.
 *
 * Following Concepts + Synchronizations pattern:
 * - State: agents, dispositions, expressive acts, sincerity metrics
 * - Actions: create agents, log acts, evaluate character, track sincerity
 * - Pure utilities: sincerity calculation, consistency evaluation, development detection
 * - Events: agentCreated, expressiveActLogged, dispositionUpdated, characterEvaluated
 *
 * Phase 2.1: Temporal Extensions - Character tracking for Monadism worldview
 *
 * ETHICAL COMMITMENT: Character tracking preserves dignity, not reduced to scores.
 * All evaluations include uncertainty, acknowledge limitations, maintain epistemic humility.
 */

// ============================================================================
// PURE UTILITY FUNCTIONS
// These are deterministic, testable, and have no side effects
// ============================================================================

/**
 * Compares belief to assertion for sincerity.
 * PURE FUNCTION - deterministic sincerity calculation.
 *
 * Sincerity as alignment: Does the person assert what they believe?
 * Based on Korsgaard (1996): Sincerity as fundamental moral requirement.
 *
 * @param {*} belief - What the agent believes to be true
 * @param {*} assertion - What the agent asserts publicly
 * @returns {number} Sincerity score from 0 to 1
 */
export function compareBeliefToAssertion(belief, assertion) {
  if (belief === undefined || assertion === undefined) {
    throw new Error('Both belief and assertion required');
  }

  // Handle exact matches
  if (belief === assertion) {
    return 1.0;
  }

  // Handle boolean/string comparisons
  if (typeof belief === 'boolean' && typeof assertion === 'boolean') {
    return belief === assertion ? 1.0 : 0.0;
  }

  if (typeof belief === 'string' && typeof assertion === 'string') {
    // Exact match
    if (belief.toLowerCase() === assertion.toLowerCase()) {
      return 1.0;
    }

    // Opposite meanings (simple heuristic)
    const opposites = [
      ['yes', 'no'], ['true', 'false'], ['good', 'bad'],
      ['right', 'wrong'], ['moral', 'immoral']
    ];

    for (const [a, b] of opposites) {
      if ((belief.toLowerCase().includes(a) && assertion.toLowerCase().includes(b)) ||
          (belief.toLowerCase().includes(b) && assertion.toLowerCase().includes(a))) {
        return 0.0;
      }
    }

    // Partial match (contains same key terms)
    const beliefWords = belief.toLowerCase().split(/\s+/);
    const assertionWords = assertion.toLowerCase().split(/\s+/);
    const overlap = beliefWords.filter(w => assertionWords.includes(w)).length;
    const total = Math.max(beliefWords.length, assertionWords.length);

    return total > 0 ? overlap / total : 0.5;
  }

  // Handle numeric comparisons
  if (typeof belief === 'number' && typeof assertion === 'number') {
    // If both same sign or both zero
    if ((belief >= 0 && assertion >= 0) || (belief < 0 && assertion < 0)) {
      const maxVal = Math.max(Math.abs(belief), Math.abs(assertion));
      const diff = Math.abs(belief - assertion);
      return maxVal > 0 ? 1 - (diff / maxVal) : 1.0;
    }
    // Opposite signs
    return 0.0;
  }

  // Handle objects (shallow comparison)
  if (typeof belief === 'object' && typeof assertion === 'object') {
    const beliefKeys = Object.keys(belief);
    const assertionKeys = Object.keys(assertion);
    const allKeys = new Set([...beliefKeys, ...assertionKeys]);

    let matches = 0;
    for (const key of allKeys) {
      if (belief[key] === assertion[key]) {
        matches++;
      }
    }

    return allKeys.size > 0 ? matches / allKeys.size : 0.5;
  }

  // Default: different types suggest partial sincerity
  return 0.5;
}

/**
 * Calculates overall sincerity from a history of expressive acts.
 * PURE FUNCTION - deterministic historical analysis.
 *
 * @param {Array} expressiveActs - Array of {belief, assertion, sincerity, timestamp}
 * @returns {Object} Sincerity analysis
 */
export function calculateSincerity(expressiveActs) {
  if (!expressiveActs || expressiveActs.length === 0) {
    return {
      overallSincerity: null,
      trend: 'insufficient_data',
      actCount: 0,
      confidence: 0
    };
  }

  const sincerityScores = expressiveActs.map(act => act.sincerity);
  const overallSincerity = sincerityScores.reduce((sum, s) => sum + s, 0) / sincerityScores.length;

  // Detect trend if we have enough data
  let trend = 'stable';
  if (expressiveActs.length >= 3) {
    const recentHalf = Math.ceil(expressiveActs.length / 2);
    const recentActs = expressiveActs.slice(-recentHalf);
    const earlierActs = expressiveActs.slice(0, expressiveActs.length - recentHalf);

    const recentAvg = recentActs.reduce((sum, a) => sum + a.sincerity, 0) / recentActs.length;
    const earlierAvg = earlierActs.reduce((sum, a) => sum + a.sincerity, 0) / earlierActs.length;

    const diff = recentAvg - earlierAvg;

    if (diff > 0.1) {
      trend = 'improving';
    } else if (diff < -0.1) {
      trend = 'declining';
    }
  }

  return {
    overallSincerity,
    trend,
    actCount: expressiveActs.length,
    confidence: Math.min(0.9, 0.3 + (expressiveActs.length * 0.05)),
    highestSincerity: Math.max(...sincerityScores),
    lowestSincerity: Math.min(...sincerityScores)
  };
}

/**
 * Evaluates consistency of disposition realizations over time.
 * PURE FUNCTION - analyzes historical disposition states.
 *
 * @param {Array} dispositionHistory - Array of {timestamp, disposition, value}
 * @returns {Object} Consistency analysis
 */
export function evaluateConsistency(dispositionHistory) {
  if (!dispositionHistory || dispositionHistory.length === 0) {
    return {
      consistency: null,
      volatility: null,
      patternType: 'insufficient_data',
      confidence: 0
    };
  }

  if (dispositionHistory.length === 1) {
    return {
      consistency: 1.0,
      volatility: 0,
      patternType: 'single_observation',
      confidence: 0.3
    };
  }

  // Calculate variance in disposition values
  const values = dispositionHistory.map(d => d.value);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const volatility = Math.sqrt(variance);

  // Consistency is inverse of normalized volatility (0-1 scale)
  // Assuming values are on 0-1 scale or normalized
  const consistency = Math.max(0, 1 - (volatility / 0.5)); // 0.5 is max expected std dev for 0-1 range

  // Detect pattern type
  let patternType = 'stable';
  if (volatility < 0.1) {
    patternType = 'highly_consistent';
  } else if (volatility < 0.2) {
    patternType = 'stable';
  } else if (volatility < 0.3) {
    patternType = 'moderate_variation';
  } else {
    patternType = 'volatile';
  }

  return {
    consistency,
    volatility,
    patternType,
    confidence: Math.min(0.9, 0.4 + (dispositionHistory.length * 0.05)),
    mean,
    observationCount: dispositionHistory.length
  };
}

/**
 * Detects moral development patterns in character history.
 * PURE FUNCTION - identifies developmental trajectory.
 *
 * @param {Array} characterHistory - Array of character evaluations over time
 * @returns {Object} Development analysis
 */
export function detectMoralDevelopment(characterHistory) {
  if (!characterHistory || characterHistory.length === 0) {
    return {
      currentStage: 'unknown',
      progression: 'insufficient_data',
      confidence: 0
    };
  }

  if (characterHistory.length === 1) {
    return {
      currentStage: characterHistory[0].stage || 'unknown',
      progression: 'single_observation',
      confidence: 0.3
    };
  }

  // Simple heuristic: look for improvement in key metrics
  const first = characterHistory[0];
  const last = characterHistory[characterHistory.length - 1];

  const sincerityChange = (last.sincerity || 0) - (first.sincerity || 0);
  const consistencyChange = (last.consistency || 0) - (first.consistency || 0);

  const overallChange = (sincerityChange + consistencyChange) / 2;

  let progression = 'stable';
  if (overallChange > 0.1) {
    progression = 'advancing';
  } else if (overallChange < -0.1) {
    progression = 'regressing';
  }

  return {
    currentStage: last.stage || 'developing',
    progression,
    confidence: Math.min(0.85, 0.5 + (characterHistory.length * 0.05)),
    sincerityChange,
    consistencyChange,
    overallChange,
    timeSpan: characterHistory.length
  };
}

// ============================================================================
// CHARACTER MODEL CONCEPT (Singleton)
// ============================================================================

export const characterModel = {
  /**
   * State - All mutable data
   * Reset this in test beforeEach hooks
   */
  state: {
    agents: {},                 // Agent ID → agent metadata
    dispositions: {},           // Agent ID → disposition states
    expressiveActs: [],         // All expressive acts (beliefs, assertions)
    realizationHistory: [],     // Disposition realizations over time
    sincerityMetrics: {},       // Agent ID → sincerity scores
    characterEvaluations: {}    // Agent ID → evaluation history
  },

  /**
   * Actions - Business logic that may mutate state
   */
  actions: {
    /**
     * Creates a new agent for character tracking.
     *
     * @param {string} agentId - Unique agent identifier
     * @param {Object} metadata - Agent metadata
     * @returns {Object} Agent record
     */
    createAgent(agentId, metadata = {}) {
      const self = characterModel;

      if (!agentId) {
        throw new Error('Agent ID required');
      }

      if (self.state.agents[agentId]) {
        throw new Error(`Agent ${agentId} already exists`);
      }

      const agent = {
        id: agentId,
        createdAt: new Date().toISOString(),
        ...metadata
      };

      self.state.agents[agentId] = agent;
      self.state.dispositions[agentId] = {};
      self.state.sincerityMetrics[agentId] = [];
      self.state.characterEvaluations[agentId] = [];

      self.notify('agentCreated', { agentId, agent });

      return agent;
    },

    /**
     * Logs an expressive act (belief-assertion pair).
     *
     * @param {string} agentId - Agent ID
     * @param {*} belief - What agent believes
     * @param {*} assertion - What agent asserts
     * @param {Object} context - Act context
     * @returns {Object} Expressive act record
     */
    logExpressiveAct(agentId, belief, assertion, context = {}) {
      const self = characterModel;

      if (!self.state.agents[agentId]) {
        throw new Error(`Agent ${agentId} not found. Create agent first.`);
      }

      const sincerity = compareBeliefToAssertion(belief, assertion);

      const act = {
        id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        agentId,
        belief,
        assertion,
        sincerity,
        timestamp: new Date().toISOString(),
        context
      };

      self.state.expressiveActs.push(act);
      self.state.sincerityMetrics[agentId].push({
        timestamp: act.timestamp,
        sincerity,
        actId: act.id
      });

      self.notify('expressiveActLogged', { act, agentId, sincerity });

      // Check threshold
      if (sincerity < 0.5) {
        self.notify('sincerityThresholdCrossed', {
          agentId,
          sincerity,
          direction: 'below',
          threshold: 0.5
        });
      }

      return act;
    },

    /**
     * Updates a disposition for an agent.
     *
     * @param {string} agentId - Agent ID
     * @param {string} dispositionType - Disposition type (e.g., 'sincerity', 'courage')
     * @param {number} value - Disposition value (0-1)
     * @returns {Object} Disposition record
     */
    updateDisposition(agentId, dispositionType, value) {
      const self = characterModel;

      if (!self.state.agents[agentId]) {
        throw new Error(`Agent ${agentId} not found`);
      }

      if (value < 0 || value > 1) {
        throw new Error('Disposition value must be between 0 and 1');
      }

      if (!self.state.dispositions[agentId][dispositionType]) {
        self.state.dispositions[agentId][dispositionType] = [];
      }

      const disposition = {
        timestamp: new Date().toISOString(),
        type: dispositionType,
        value
      };

      self.state.dispositions[agentId][dispositionType].push(disposition);
      self.state.realizationHistory.push({
        agentId,
        ...disposition
      });

      self.notify('dispositionUpdated', { agentId, dispositionType, value, disposition });

      return disposition;
    },

    /**
     * Evaluates character for an agent over a time range.
     *
     * @param {string} agentId - Agent ID
     * @param {Object} timeRange - Optional {start, end} timestamps
     * @returns {Object} Character evaluation
     */
    evaluateCharacter(agentId, timeRange = null) {
      const self = characterModel;

      if (!self.state.agents[agentId]) {
        throw new Error(`Agent ${agentId} not found`);
      }

      // Get expressive acts for this agent
      let acts = self.state.expressiveActs.filter(act => act.agentId === agentId);

      if (timeRange) {
        acts = acts.filter(act => {
          const timestamp = new Date(act.timestamp).getTime();
          const start = timeRange.start ? new Date(timeRange.start).getTime() : 0;
          const end = timeRange.end ? new Date(timeRange.end).getTime() : Date.now();
          return timestamp >= start && timestamp <= end;
        });
      }

      // Calculate sincerity
      const sincerityAnalysis = calculateSincerity(acts);

      // Get disposition history
      const dispositionHistory = [];
      for (const [type, history] of Object.entries(self.state.dispositions[agentId])) {
        dispositionHistory.push(...history.map(h => ({ ...h, disposition: type })));
      }

      // Calculate consistency across all dispositions
      const consistencyAnalysis = evaluateConsistency(dispositionHistory);

      // Detect development
      const previousEvaluations = self.state.characterEvaluations[agentId] || [];
      const developmentAnalysis = detectMoralDevelopment([
        ...previousEvaluations,
        {
          timestamp: new Date().toISOString(),
          sincerity: sincerityAnalysis.overallSincerity,
          consistency: consistencyAnalysis.consistency
        }
      ]);

      const evaluation = {
        agentId,
        timestamp: new Date().toISOString(),
        timeRange: timeRange || { start: null, end: null },
        sincerity: sincerityAnalysis,
        consistency: consistencyAnalysis,
        development: developmentAnalysis,
        actCount: acts.length,
        dispositionCount: dispositionHistory.length,
        confidence: Math.min(
          sincerityAnalysis.confidence,
          consistencyAnalysis.confidence,
          developmentAnalysis.confidence
        ),
        // ETHICAL: Always acknowledge limitations
        limitations: [
          'Character evaluation is descriptive, not prescriptive',
          'Limited to observable expressive acts',
          'Significant uncertainty inherent in sincerity inference',
          'Development is non-linear and context-dependent',
          'Confidence reflects data quantity, not absolute certainty'
        ]
      };

      self.state.characterEvaluations[agentId].push(evaluation);

      self.notify('characterEvaluated', { evaluation, agentId });

      return evaluation;
    },

    /**
     * Gets sincerity history for an agent.
     *
     * @param {string} agentId - Agent ID
     * @returns {Array} Sincerity history
     */
    getSincerityHistory(agentId) {
      const self = characterModel;

      if (!self.state.agents[agentId]) {
        throw new Error(`Agent ${agentId} not found`);
      }

      return self.state.sincerityMetrics[agentId] || [];
    },

    /**
     * Resets all state (for testing).
     */
    reset() {
      const self = characterModel;
      self.state.agents = {};
      self.state.dispositions = {};
      self.state.expressiveActs = [];
      self.state.realizationHistory = [];
      self.state.sincerityMetrics = {};
      self.state.characterEvaluations = {};
      // Clear subscribers AFTER notify to avoid race condition
      const tempSubs = [...self._subscribers];
      self._subscribers = [];
      tempSubs.forEach(fn => fn('reset', {}));
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
