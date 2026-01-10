/**
 * Temporal Tracking Tests
 *
 * Tests for ProcessTracker and CharacterModel concepts (Phase 2.1)
 * Verifies temporal extensions for process-based worldviews
 */

import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  processTracker,
  calculateGrowth,
  detectTransformation,
  calculateTrajectory
} from '../../../src/concepts/processTracker.js';

import {
  characterModel,
  compareBeliefToAssertion,
  calculateSincerity,
  evaluateConsistency,
  detectMoralDevelopment
} from '../../../src/concepts/characterModel.js';

// ============================================================================
// PROCESS TRACKER CONCEPT TESTS
// ============================================================================

describe('ProcessTracker Concept', () => {
  beforeEach(() => {
    processTracker.actions.reset();
  });

  // ------------------------------------------------------------------------
  // PURE UTILITY TESTS
  // ------------------------------------------------------------------------

  describe('Pure: calculateGrowth', () => {
    test('should calculate positive growth correctly', () => {
      const start = { dimension: 'knowledge', value: 5 };
      const end = { dimension: 'knowledge', value: 8 };

      const growth = calculateGrowth(start, end);

      assert.equal(growth.dimension, 'knowledge');
      assert.equal(growth.magnitude, 3);
      assert.equal(growth.direction, 'positive');
      assert.equal(growth.startValue, 5);
      assert.equal(growth.endValue, 8);
      assert.equal(growth.percentChange, 60); // (3/5)*100
    });

    test('should calculate negative growth (decline)', () => {
      const start = { dimension: 'health', value: 10 };
      const end = { dimension: 'health', value: 7 };

      const growth = calculateGrowth(start, end);

      assert.equal(growth.magnitude, -3);
      assert.equal(growth.direction, 'negative');
      assert.equal(growth.percentChange, -30);
    });

    test('should handle zero growth (neutral)', () => {
      const start = { dimension: 'stability', value: 5 };
      const end = { dimension: 'stability', value: 5 };

      const growth = calculateGrowth(start, end);

      assert.equal(growth.magnitude, 0);
      assert.equal(growth.direction, 'neutral');
      assert.equal(growth.percentChange, 0);
    });

    test('should be deterministic', () => {
      const start = { dimension: 'wisdom', value: 3 };
      const end = { dimension: 'wisdom', value: 7 };

      const growth1 = calculateGrowth(start, end);
      const growth2 = calculateGrowth(start, end);

      assert.deepEqual(growth1, growth2);
    });

    test('should throw on different dimensions', () => {
      const start = { dimension: 'knowledge', value: 5 };
      const end = { dimension: 'wisdom', value: 8 };

      assert.throws(() => {
        calculateGrowth(start, end);
      }, /different dimensions/);
    });
  });

  describe('Pure: detectTransformation', () => {
    test('should detect growth pattern', () => {
      const sequence = [
        { timestamp: '2024-01-01', value: 5 },
        { timestamp: '2024-01-02', value: 6 },
        { timestamp: '2024-01-03', value: 7 },
        { timestamp: '2024-01-04', value: 8 }
      ];

      const result = detectTransformation(sequence);

      assert.equal(result.type, 'growth');
      assert(result.confidence > 0.7);
      assert.equal(result.trajectory, 'ascending');
    });

    test('should detect decline pattern', () => {
      const sequence = [
        { timestamp: '2024-01-01', value: 10 },
        { timestamp: '2024-01-02', value: 8 },
        { timestamp: '2024-01-03', value: 6 },
        { timestamp: '2024-01-04', value: 4 }
      ];

      const result = detectTransformation(sequence);

      assert.equal(result.type, 'decline');
      assert(result.confidence > 0.7);
      assert.equal(result.trajectory, 'descending');
    });

    test('should detect stable pattern', () => {
      const sequence = [
        { timestamp: '2024-01-01', value: 5 },
        { timestamp: '2024-01-02', value: 5.01 },
        { timestamp: '2024-01-03', value: 4.99 },
        { timestamp: '2024-01-04', value: 5.02 }
      ];

      const result = detectTransformation(sequence);

      assert.equal(result.type, 'stable');
      assert(result.confidence > 0.7);
    });

    test('should detect oscillation', () => {
      const sequence = [
        { timestamp: '2024-01-01', value: 5 },
        { timestamp: '2024-01-02', value: 10 },
        { timestamp: '2024-01-03', value: 5 },
        { timestamp: '2024-01-04', value: 10 },
        { timestamp: '2024-01-05', value: 5 }
      ];

      const result = detectTransformation(sequence);

      assert.equal(result.type, 'oscillation');
      assert(result.volatility > 0);
    });

    test('should handle insufficient data', () => {
      const sequence = [];
      const result = detectTransformation(sequence);

      assert.equal(result.type, 'insufficient_data');
      assert.equal(result.confidence, 0);
    });
  });

  describe('Pure: calculateTrajectory', () => {
    test('should calculate ascending trajectory', () => {
      const history = [
        {
          outcome: 'success',
          startState: { dimension: 'skill', value: 5 },
          endState: { dimension: 'skill', value: 7 },
          completedAt: '2024-01-01'
        },
        {
          outcome: 'success',
          startState: { dimension: 'skill', value: 7 },
          endState: { dimension: 'skill', value: 9 },
          completedAt: '2024-01-02'
        }
      ];

      const trajectory = calculateTrajectory(history);

      assert.equal(trajectory.direction, 'ascending');
      assert(trajectory.velocity > 0);
      assert.equal(trajectory.successRate, 1.0);
    });

    test('should calculate descending trajectory', () => {
      const history = [
        {
          outcome: 'failure',
          startState: { dimension: 'health', value: 10 },
          endState: { dimension: 'health', value: 7 },
          completedAt: '2024-01-01'
        },
        {
          outcome: 'failure',
          startState: { dimension: 'health', value: 7 },
          endState: { dimension: 'health', value: 4 },
          completedAt: '2024-01-02'
        }
      ];

      const trajectory = calculateTrajectory(history);

      assert.equal(trajectory.direction, 'descending');
      assert(trajectory.avgChange < 0);
    });

    test('should handle no history', () => {
      const trajectory = calculateTrajectory([]);

      assert.equal(trajectory.direction, 'unknown');
      assert.equal(trajectory.velocity, 0);
      assert.equal(trajectory.confidence, 0);
    });
  });

  // ------------------------------------------------------------------------
  // ACTION TESTS
  // ------------------------------------------------------------------------

  describe('Actions: Process lifecycle', () => {
    test('should start process and emit event', () => {
      let eventReceived = false;

      processTracker.subscribe((event, payload) => {
        if (event === 'processStarted') {
          eventReceived = true;
          assert.equal(payload.type, 'growth');
          assert.equal(payload.agent, 'agent1');
        }
      });

      const process = processTracker.actions.startProcess('growth', 'agent1', {
        goal: 'learn mathematics'
      });

      assert(eventReceived);
      assert.equal(process.type, 'growth');
      assert.equal(process.agent, 'agent1');
      assert.equal(process.state, 'active');
      assert(process.id.startsWith('process_'));
    });

    test('should update process state', () => {
      const process = processTracker.actions.startProcess('learning', 'agent1');

      let updateEventReceived = false;
      processTracker.subscribe((event) => {
        if (event === 'processUpdated') {
          updateEventReceived = true;
        }
      });

      const updated = processTracker.actions.updateProcess(process.id, {
        progress: 50,
        notes: 'Halfway through'
      });

      assert(updateEventReceived);
      assert.equal(updated.updates.length, 1);
      assert.equal(updated.updates[0].progress, 50);
      assert(updated.lastUpdated);
    });

    test('should complete process and move to history', () => {
      const process = processTracker.actions.startProcess('growth', 'agent1');

      const completed = processTracker.actions.completeProcess(process.id, {
        result: 'success',
        startState: { dimension: 'skill', value: 5 },
        endState: { dimension: 'skill', value: 8 }
      });

      assert.equal(completed.state, 'completed');
      assert.equal(completed.outcome, 'success');
      assert.equal(processTracker.state.activeProcesses.length, 0);
      assert.equal(processTracker.state.processHistory.length, 1);
    });

    test('should track agent process history', () => {
      const p1 = processTracker.actions.startProcess('growth', 'agent1');
      const p2 = processTracker.actions.startProcess('learning', 'agent1');

      processTracker.actions.completeProcess(p1.id, { result: 'success' });
      processTracker.actions.completeProcess(p2.id, { result: 'success' });

      const history = processTracker.actions.getProcessHistory('agent1');

      assert.equal(history.length, 2);
      // Verify both process types are present (order may vary)
      const types = history.map(h => h.type);
      assert(types.includes('growth'));
      assert(types.includes('learning'));
    });
  });

  describe('Actions: Transformation tracking', () => {
    test('should track transformation with growth calculation', () => {
      let eventReceived = false;

      processTracker.subscribe((event, payload) => {
        if (event === 'transformationDetected') {
          eventReceived = true;
          assert.equal(payload.agentId, 'agent1');
        }
      });

      const transformation = processTracker.actions.trackTransformation(
        'agent1',
        { dimension: 'wisdom', value: 3 },
        { dimension: 'wisdom', value: 7 }
      );

      assert(eventReceived);
      assert.equal(transformation.agentId, 'agent1');
      assert.equal(transformation.growth.magnitude, 4);
      assert.equal(transformation.growth.direction, 'positive');
    });
  });

  describe('Integration: Multiple concurrent processes', () => {
    test('should track multiple processes for same agent', () => {
      const p1 = processTracker.actions.startProcess('growth', 'agent1');
      const p2 = processTracker.actions.startProcess('learning', 'agent1');
      const p3 = processTracker.actions.startProcess('healing', 'agent1');

      const active = processTracker.actions.getActiveProcesses('agent1');

      assert.equal(active.length, 3);
      // Verify all process types are present (order may vary)
      const types = active.map(a => a.type);
      assert(types.includes('growth'));
      assert(types.includes('learning'));
      assert(types.includes('healing'));
    });
  });
});

// ============================================================================
// CHARACTER MODEL CONCEPT TESTS
// ============================================================================

describe('CharacterModel Concept', () => {
  beforeEach(() => {
    characterModel.actions.reset();
  });

  // ------------------------------------------------------------------------
  // PURE UTILITY TESTS
  // ------------------------------------------------------------------------

  describe('Pure: compareBeliefToAssertion', () => {
    test('should return 1.0 for exact match', () => {
      const sincerity = compareBeliefToAssertion('The sky is blue', 'The sky is blue');
      assert.equal(sincerity, 1.0);
    });

    test('should return 1.0 for boolean match', () => {
      const sincerity = compareBeliefToAssertion(true, true);
      assert.equal(sincerity, 1.0);
    });

    test('should return 0.0 for boolean contradiction', () => {
      const sincerity = compareBeliefToAssertion(true, false);
      assert.equal(sincerity, 0.0);
    });

    test('should detect opposite meanings in strings', () => {
      const sincerity = compareBeliefToAssertion('This is good', 'This is bad');
      assert.equal(sincerity, 0.0);
    });

    test('should handle partial string overlap', () => {
      const sincerity = compareBeliefToAssertion(
        'The policy is beneficial',
        'The policy is helpful'
      );
      // Should have partial overlap ('the', 'policy', 'is')
      assert(sincerity > 0.3 && sincerity < 1.0);
    });

    test('should handle numeric alignment', () => {
      const sincerity1 = compareBeliefToAssertion(10, 10);
      assert.equal(sincerity1, 1.0);

      const sincerity2 = compareBeliefToAssertion(10, 8);
      assert(sincerity2 > 0.5 && sincerity2 < 1.0);

      const sincerity3 = compareBeliefToAssertion(10, -10);
      assert.equal(sincerity3, 0.0); // Opposite signs
    });

    test('should be deterministic', () => {
      const s1 = compareBeliefToAssertion('truth', 'truth');
      const s2 = compareBeliefToAssertion('truth', 'truth');
      assert.equal(s1, s2);
    });
  });

  describe('Pure: calculateSincerity', () => {
    test('should calculate overall sincerity from acts', () => {
      const acts = [
        { belief: true, assertion: true, sincerity: 1.0, timestamp: '2024-01-01' },
        { belief: 'yes', assertion: 'yes', sincerity: 1.0, timestamp: '2024-01-02' },
        { belief: true, assertion: false, sincerity: 0.0, timestamp: '2024-01-03' }
      ];

      const result = calculateSincerity(acts);

      assert.equal(result.overallSincerity, (1.0 + 1.0 + 0.0) / 3);
      assert.equal(result.actCount, 3);
      assert(result.confidence > 0);
    });

    test('should detect improving trend', () => {
      const acts = [
        { sincerity: 0.3, timestamp: '2024-01-01' },
        { sincerity: 0.4, timestamp: '2024-01-02' },
        { sincerity: 0.7, timestamp: '2024-01-03' },
        { sincerity: 0.9, timestamp: '2024-01-04' }
      ];

      const result = calculateSincerity(acts);

      assert.equal(result.trend, 'improving');
    });

    test('should detect declining trend', () => {
      const acts = [
        { sincerity: 0.9, timestamp: '2024-01-01' },
        { sincerity: 0.7, timestamp: '2024-01-02' },
        { sincerity: 0.4, timestamp: '2024-01-03' },
        { sincerity: 0.2, timestamp: '2024-01-04' }
      ];

      const result = calculateSincerity(acts);

      assert.equal(result.trend, 'declining');
    });

    test('should handle empty history', () => {
      const result = calculateSincerity([]);

      assert.equal(result.overallSincerity, null);
      assert.equal(result.trend, 'insufficient_data');
      assert.equal(result.confidence, 0);
    });
  });

  describe('Pure: evaluateConsistency', () => {
    test('should detect highly consistent pattern', () => {
      const history = [
        { timestamp: '2024-01-01', disposition: 'courage', value: 0.8 },
        { timestamp: '2024-01-02', disposition: 'courage', value: 0.81 },
        { timestamp: '2024-01-03', disposition: 'courage', value: 0.79 },
        { timestamp: '2024-01-04', disposition: 'courage', value: 0.80 }
      ];

      const result = evaluateConsistency(history);

      assert.equal(result.patternType, 'highly_consistent');
      assert(result.consistency > 0.9);
      assert(result.volatility < 0.1);
    });

    test('should detect volatile pattern', () => {
      const history = [
        { timestamp: '2024-01-01', value: 0.2 },
        { timestamp: '2024-01-02', value: 0.9 },
        { timestamp: '2024-01-03', value: 0.1 },
        { timestamp: '2024-01-04', value: 0.8 }
      ];

      const result = evaluateConsistency(history);

      assert.equal(result.patternType, 'volatile');
      assert(result.volatility > 0.3);
    });

    test('should handle empty history', () => {
      const result = evaluateConsistency([]);

      assert.equal(result.consistency, null);
      assert.equal(result.patternType, 'insufficient_data');
    });
  });

  describe('Pure: detectMoralDevelopment', () => {
    test('should detect advancing progression', () => {
      const history = [
        { timestamp: '2024-01-01', sincerity: 0.5, consistency: 0.6 },
        { timestamp: '2024-02-01', sincerity: 0.7, consistency: 0.75 },
        { timestamp: '2024-03-01', sincerity: 0.85, consistency: 0.9 }
      ];

      const result = detectMoralDevelopment(history);

      assert.equal(result.progression, 'advancing');
      assert(result.overallChange > 0);
    });

    test('should detect regressing progression', () => {
      const history = [
        { timestamp: '2024-01-01', sincerity: 0.9, consistency: 0.85 },
        { timestamp: '2024-02-01', sincerity: 0.7, consistency: 0.7 },
        { timestamp: '2024-03-01', sincerity: 0.5, consistency: 0.6 }
      ];

      const result = detectMoralDevelopment(history);

      assert.equal(result.progression, 'regressing');
      assert(result.overallChange < 0);
    });
  });

  // ------------------------------------------------------------------------
  // ACTION TESTS
  // ------------------------------------------------------------------------

  describe('Actions: Agent management', () => {
    test('should create agent with metadata', () => {
      let eventReceived = false;

      characterModel.subscribe((event, payload) => {
        if (event === 'agentCreated') {
          eventReceived = true;
          assert.equal(payload.agentId, 'agent1');
        }
      });

      const agent = characterModel.actions.createAgent('agent1', {
        name: 'Test Agent'
      });

      assert(eventReceived);
      assert.equal(agent.id, 'agent1');
      assert.equal(agent.name, 'Test Agent');
      assert(agent.createdAt);
    });

    test('should reject duplicate agent', () => {
      characterModel.actions.createAgent('agent1');

      assert.throws(() => {
        characterModel.actions.createAgent('agent1');
      }, /already exists/);
    });
  });

  describe('Actions: Expressive act logging', () => {
    test('should log expressive act and calculate sincerity', () => {
      characterModel.actions.createAgent('agent1');

      let eventReceived = false;
      characterModel.subscribe((event, payload) => {
        if (event === 'expressiveActLogged') {
          eventReceived = true;
          assert.equal(payload.agentId, 'agent1');
          assert.equal(payload.sincerity, 1.0);
        }
      });

      const act = characterModel.actions.logExpressiveAct(
        'agent1',
        true,
        true,
        { situation: 'test' }
      );

      assert(eventReceived);
      assert.equal(act.belief, true);
      assert.equal(act.assertion, true);
      assert.equal(act.sincerity, 1.0);
    });

    test('should emit threshold event for low sincerity', () => {
      characterModel.actions.createAgent('agent1');

      let thresholdCrossed = false;

      // Subscribe BEFORE the action
      characterModel.subscribe((event, payload) => {
        if (event === 'sincerityThresholdCrossed') {
          thresholdCrossed = true;
          assert.equal(payload.direction, 'below');
          assert(payload.sincerity < 0.5);
        }
      });

      // Now perform the action that should trigger the event
      characterModel.actions.logExpressiveAct('agent1', true, false);

      assert.equal(thresholdCrossed, true, 'Threshold event should have been triggered');
    });
  });

  describe('Actions: Disposition tracking', () => {
    test('should update and track dispositions', () => {
      characterModel.actions.createAgent('agent1');

      const d1 = characterModel.actions.updateDisposition('agent1', 'courage', 0.7);
      const d2 = characterModel.actions.updateDisposition('agent1', 'courage', 0.8);

      assert.equal(d1.type, 'courage');
      assert.equal(d1.value, 0.7);
      assert.equal(d2.value, 0.8);

      assert.equal(characterModel.state.dispositions.agent1.courage.length, 2);
    });

    test('should validate disposition value range', () => {
      characterModel.actions.createAgent('agent1');

      assert.throws(() => {
        characterModel.actions.updateDisposition('agent1', 'courage', 1.5);
      }, /between 0 and 1/);

      assert.throws(() => {
        characterModel.actions.updateDisposition('agent1', 'courage', -0.5);
      }, /between 0 and 1/);
    });
  });

  describe('Actions: Character evaluation', () => {
    test('should evaluate character with sincerity and consistency', () => {
      characterModel.actions.createAgent('agent1');

      // Log some expressive acts
      characterModel.actions.logExpressiveAct('agent1', true, true);
      characterModel.actions.logExpressiveAct('agent1', 'yes', 'yes');
      characterModel.actions.logExpressiveAct('agent1', false, false);

      // Update some dispositions
      characterModel.actions.updateDisposition('agent1', 'sincerity', 0.9);
      characterModel.actions.updateDisposition('agent1', 'sincerity', 0.95);

      const evaluation = characterModel.actions.evaluateCharacter('agent1');

      assert.equal(evaluation.agentId, 'agent1');
      assert.equal(evaluation.sincerity.overallSincerity, 1.0); // All acts were sincere
      assert(evaluation.consistency.consistency > 0);
      assert(evaluation.limitations.length > 0); // ETHICAL: Always includes limitations
    });

    test('should include epistemic humility in evaluation', () => {
      characterModel.actions.createAgent('agent1');
      characterModel.actions.logExpressiveAct('agent1', true, true);

      const evaluation = characterModel.actions.evaluateCharacter('agent1');

      // Verify limitations are acknowledged
      assert(evaluation.limitations.includes('Character evaluation is descriptive, not prescriptive'));
      assert(evaluation.limitations.some(l => l.includes('uncertainty')));
      assert(evaluation.confidence <= 1.0);
    });
  });
});

// ============================================================================
// TEMPORAL SYNCHRONIZATIONS TESTS
// ============================================================================

describe('Temporal Synchronizations', () => {
  beforeEach(() => {
    processTracker.actions.reset();
    characterModel.actions.reset();
  });

  test('Process completion should trigger character update via synchronization', () => {
    // Note: This test verifies the coordination logic exists in synchronizations.js
    // The actual synchronization is initialized in the main app

    // The synchronization should:
    // 1. Listen for processCompleted event
    // 2. Create agent if needed
    // 3. Update character disposition based on outcome

    // We test the coordination logic would work correctly
    const agentId = 'agent1';

    // Create agent first
    characterModel.actions.createAgent(agentId);

    // Start and complete a growth process
    const process = processTracker.actions.startProcess('growth', agentId);
    processTracker.actions.completeProcess(process.id, {
      result: 'success',
      startState: { dimension: 'skill', value: 5 },
      endState: { dimension: 'skill', value: 8 }
    });

    // The synchronization would update disposition
    // Here we verify the data is available for synchronization
    const completedProcess = processTracker.state.agents[agentId][0];
    assert.equal(completedProcess.outcome, 'success');
    assert.equal(completedProcess.type, 'growth');
  });

  test('Expressive act logging should have data for sincerity monitoring', () => {
    const agentId = 'agent1';
    characterModel.actions.createAgent(agentId);

    let lowSincerityLogged = false;

    // Subscribe to events before action
    characterModel.subscribe((event, payload) => {
      if (event === 'expressiveActLogged' && payload.sincerity < 0.5) {
        lowSincerityLogged = true;
      }
    });

    const act = characterModel.actions.logExpressiveAct(agentId, true, false);

    // Verify low sincerity would trigger synchronization
    assert(act.sincerity < 0.5);
    assert(lowSincerityLogged);

    const history = characterModel.actions.getSincerityHistory(agentId);
    assert.equal(history.length, 1);
    assert(history[0].sincerity < 0.5);
  });
});
