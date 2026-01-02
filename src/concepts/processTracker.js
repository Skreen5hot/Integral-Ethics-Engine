/**
 * Process Tracker Concept
 *
 * Tracks processes, transformations, and growth over time for process-based worldviews.
 * Enables temporal moral reasoning by recording state changes and developmental trajectories.
 *
 * Following Concepts + Synchronizations pattern:
 * - State: process history, active processes, transformations, agent tracking
 * - Actions: start, update, complete processes; track transformations
 * - Pure utilities: growth calculation, transformation detection, trajectory analysis
 * - Events: processStarted, processUpdated, processCompleted, transformationDetected
 *
 * Phase 2.1: Temporal Extensions - Process tracking for Dynamism worldview
 */

// ============================================================================
// PURE UTILITY FUNCTIONS
// These are deterministic, testable, and have no side effects
// ============================================================================

/**
 * Calculates growth between two states.
 * PURE FUNCTION - same inputs always produce same outputs.
 *
 * @param {Object} startState - Initial state { dimension: string, value: number }
 * @param {Object} endState - Final state { dimension: string, value: number }
 * @returns {Object} Growth metrics
 */
export function calculateGrowth(startState, endState) {
  if (!startState || !endState) {
    throw new Error('Both startState and endState required');
  }

  if (startState.dimension !== endState.dimension) {
    throw new Error('Cannot calculate growth across different dimensions');
  }

  const magnitude = endState.value - startState.value;
  const direction = magnitude > 0 ? 'positive' : magnitude < 0 ? 'negative' : 'neutral';
  const percentChange = startState.value !== 0
    ? (magnitude / Math.abs(startState.value)) * 100
    : (magnitude !== 0 ? Infinity : 0);

  return {
    dimension: startState.dimension,
    magnitude,
    direction,
    percentChange,
    startValue: startState.value,
    endValue: endState.value
  };
}

/**
 * Detects transformation patterns in a state sequence.
 * PURE FUNCTION - analyzes temporal sequence to identify pattern type.
 *
 * @param {Array} stateSequence - Array of states over time [{timestamp, value}, ...]
 * @returns {Object} Transformation analysis
 */
export function detectTransformation(stateSequence) {
  if (!stateSequence || stateSequence.length === 0) {
    return { type: 'insufficient_data', confidence: 0, reason: 'No states provided' };
  }

  if (stateSequence.length === 1) {
    return { type: 'stable', confidence: 0.5, reason: 'Single data point' };
  }

  // Calculate differences between consecutive states
  const diffs = [];
  for (let i = 1; i < stateSequence.length; i++) {
    diffs.push(stateSequence[i].value - stateSequence[i - 1].value);
  }

  const avgDiff = diffs.reduce((sum, d) => sum + d, 0) / diffs.length;
  const variance = diffs.reduce((sum, d) => sum + Math.pow(d - avgDiff, 2), 0) / diffs.length;
  const stdDev = Math.sqrt(variance);

  // Determine pattern type
  const threshold = 0.05; // 5% threshold for stability

  // Check for oscillation: high variance with low average change
  // Oscillation means large swings but no net directionChange
  if (stdDev > 2 && Math.abs(avgDiff) < 1 && stateSequence.length >= 4) {
    // High volatility but low average change suggests oscillation
    return {
      type: 'oscillation',
      confidence: 0.75,
      avgChange: avgDiff,
      volatility: stdDev,
      oscillationMagnitude: stdDev
    };
  }

  if (Math.abs(avgDiff) < threshold) {
    return {
      type: 'stable',
      confidence: 0.9,
      avgChange: avgDiff,
      volatility: stdDev
    };
  }

  if (avgDiff > threshold) {
    return {
      type: 'growth',
      confidence: 0.85,
      avgChange: avgDiff,
      volatility: stdDev,
      trajectory: 'ascending'
    };
  }

  if (avgDiff < -threshold) {
    return {
      type: 'decline',
      confidence: 0.85,
      avgChange: avgDiff,
      volatility: stdDev,
      trajectory: 'descending'
    };
  }

  return {
    type: 'unclear',
    confidence: 0.3,
    avgChange: avgDiff,
    volatility: stdDev
  };
}

/**
 * Calculates developmental trajectory from process history.
 * PURE FUNCTION - analyzes historical processes to predict trajectory.
 *
 * @param {Array} processHistory - Array of completed processes
 * @returns {Object} Trajectory analysis
 */
export function calculateTrajectory(processHistory) {
  if (!processHistory || processHistory.length === 0) {
    return {
      direction: 'unknown',
      velocity: 0,
      confidence: 0,
      reason: 'No process history'
    };
  }

  // Extract outcomes (success/failure) and growth indicators
  const successfulProcesses = processHistory.filter(p => p.outcome === 'success');
  const successRate = successfulProcesses.length / processHistory.length;

  // If we have state changes, analyze them
  const stateChanges = processHistory
    .filter(p => p.startState && p.endState)
    .map(p => ({
      timestamp: p.completedAt,
      value: p.endState.value - p.startState.value
    }));

  if (stateChanges.length === 0) {
    // No quantitative data, use success rate
    if (successRate > 0.7) {
      return {
        direction: 'ascending',
        velocity: successRate,
        confidence: 0.6,
        basis: 'success_rate'
      };
    } else if (successRate < 0.3) {
      return {
        direction: 'descending',
        velocity: 1 - successRate,
        confidence: 0.6,
        basis: 'success_rate'
      };
    } else {
      return {
        direction: 'plateau',
        velocity: 0.5,
        confidence: 0.4,
        basis: 'success_rate'
      };
    }
  }

  // Analyze state changes over time
  const avgChange = stateChanges.reduce((sum, sc) => sum + sc.value, 0) / stateChanges.length;

  // Calculate velocity (change per unit time if timestamps available)
  let velocity = Math.abs(avgChange);

  if (stateChanges.length >= 2) {
    const firstTime = new Date(stateChanges[0].timestamp).getTime();
    const lastTime = new Date(stateChanges[stateChanges.length - 1].timestamp).getTime();
    const timeSpan = (lastTime - firstTime) / (1000 * 60 * 60 * 24); // days

    if (timeSpan > 0) {
      velocity = Math.abs(avgChange) / timeSpan;
    }
  }

  const direction = avgChange > 0.1 ? 'ascending'
                  : avgChange < -0.1 ? 'descending'
                  : 'plateau';

  return {
    direction,
    velocity,
    confidence: Math.min(0.9, 0.5 + (stateChanges.length * 0.05)),
    avgChange,
    processCount: processHistory.length,
    successRate
  };
}

// ============================================================================
// PROCESS TRACKER CONCEPT (Singleton)
// ============================================================================

export const processTracker = {
  /**
   * State - All mutable data
   * Reset this in test beforeEach hooks
   */
  state: {
    processHistory: [],        // All completed processes
    activeProcesses: [],       // Currently ongoing processes
    transformations: [],       // Tracked transformations (from → to)
    agents: {},                // Agent IDs to process histories
    nextProcessId: 1           // Auto-incrementing process ID
  },

  /**
   * Actions - Business logic that may mutate state
   */
  actions: {
    /**
     * Starts tracking a new process.
     *
     * @param {string} type - Process type (e.g., 'growth', 'learning', 'transformation')
     * @param {string} agent - Agent ID
     * @param {Object} context - Process context
     * @returns {Object} Process record
     */
    startProcess(type, agent, context = {}) {
      const self = processTracker;

      if (!type || !agent) {
        throw new Error('Process type and agent required');
      }

      const process = {
        id: `process_${self.state.nextProcessId++}`,
        type,
        agent,
        context,
        startedAt: new Date().toISOString(),
        state: 'active',
        updates: []
      };

      self.state.activeProcesses.push(process);

      // Track agent's processes
      if (!self.state.agents[agent]) {
        self.state.agents[agent] = [];
      }

      self.notify('processStarted', { process, agent, type });

      return process;
    },

    /**
     * Updates an ongoing process state.
     *
     * @param {string} processId - Process ID
     * @param {Object} updateData - State update
     * @returns {Object} Updated process
     */
    updateProcess(processId, updateData) {
      const self = processTracker;

      const process = self.state.activeProcesses.find(p => p.id === processId);

      if (!process) {
        throw new Error(`Process ${processId} not found or not active`);
      }

      const update = {
        timestamp: new Date().toISOString(),
        ...updateData
      };

      process.updates.push(update);
      process.lastUpdated = update.timestamp;

      self.notify('processUpdated', { process, update });

      return process;
    },

    /**
     * Completes a process.
     *
     * @param {string} processId - Process ID
     * @param {Object} outcome - Completion outcome
     * @returns {Object} Completed process
     */
    completeProcess(processId, outcome) {
      const self = processTracker;

      const index = self.state.activeProcesses.findIndex(p => p.id === processId);

      if (index === -1) {
        throw new Error(`Process ${processId} not found or not active`);
      }

      const process = self.state.activeProcesses[index];
      process.state = 'completed';
      process.completedAt = new Date().toISOString();
      process.outcome = outcome.result || 'success';
      process.endState = outcome.endState;
      process.startState = outcome.startState;

      // Move to history
      self.state.processHistory.push(process);
      self.state.activeProcesses.splice(index, 1);

      // Add to agent history
      self.state.agents[process.agent].push(process);

      self.notify('processCompleted', {
        process,
        agentId: process.agent,
        outcome: process.outcome,
        processType: process.type
      });

      return process;
    },

    /**
     * Tracks a transformation event.
     *
     * @param {string} agentId - Agent ID
     * @param {Object} fromState - Initial state
     * @param {Object} toState - Final state
     * @returns {Object} Transformation record
     */
    trackTransformation(agentId, fromState, toState) {
      const self = processTracker;

      if (!agentId || !fromState || !toState) {
        throw new Error('Agent ID, fromState, and toState required');
      }

      const transformation = {
        id: `transform_${Date.now()}`,
        agentId,
        fromState,
        toState,
        timestamp: new Date().toISOString(),
        growth: calculateGrowth(
          { dimension: fromState.dimension || 'general', value: fromState.value },
          { dimension: toState.dimension || 'general', value: toState.value }
        )
      };

      self.state.transformations.push(transformation);

      self.notify('transformationDetected', { transformation, agentId });

      return transformation;
    },

    /**
     * Gets process history for an agent.
     *
     * @param {string} agentId - Agent ID
     * @returns {Array} Process history
     */
    getProcessHistory(agentId) {
      const self = processTracker;
      return self.state.agents[agentId] || [];
    },

    /**
     * Gets active processes for an agent.
     *
     * @param {string} agentId - Agent ID
     * @returns {Array} Active processes
     */
    getActiveProcesses(agentId) {
      const self = processTracker;
      return self.state.activeProcesses.filter(p => p.agent === agentId);
    },

    /**
     * Resets all state (for testing).
     */
    reset() {
      const self = processTracker;
      self.state.processHistory = [];
      self.state.activeProcesses = [];
      self.state.transformations = [];
      self.state.agents = {};
      self.state.nextProcessId = 1;
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
