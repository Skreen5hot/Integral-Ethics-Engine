/**
 * Unit Tests for MoralReasoner Concept
 *
 * Tests multi-perspectival moral evaluation logic.
 * Following the process-isolated testing strategy from testStrategy.md.
 */

import { describe, test, beforeEach } from './test-utils.js';
import { strictEqual, deepStrictEqual, ok, throws } from '../../../src/assert.js';
import {
  matchScenarioToValues,
  detectValueConflicts,
  evaluateAgainstValues,
  generateReasoning,
  calculateConfidence,
  applyWorldviewToScenario,
  moralReasoner
} from '../../../src/concepts/moralReasoner.js';

// ============================================================================
// PURE FUNCTION TESTS
// These test deterministic evaluation logic without side effects
// ============================================================================

describe('Pure Evaluation Functions', () => {
  test('matchScenarioToValues: identifies relevant physical wellbeing values', () => {
    const scenario = {
      action: 'harm_person',
      context: { physicalImpact: true },
      agents: ['person1']
    };

    const values = {
      terminal: ['physical_wellbeing', 'empirical_truth'],
      instrumental: ['technology', 'medicine']
    };

    const relevant = matchScenarioToValues(scenario, values);

    const physicalWellbeing = relevant.find(v => v.value === 'physical_wellbeing');
    ok(physicalWellbeing, 'Should identify physical_wellbeing as relevant');
    strictEqual(physicalWellbeing.salience, 'high', 'Should mark as high salience');
  });

  test('matchScenarioToValues: identifies relevant truth values', () => {
    const scenario = {
      action: 'make_claim',
      context: { factsInvolved: true }
    };

    const values = {
      terminal: ['empirical_truth', 'objective_truth'],
      instrumental: ['verification']
    };

    const relevant = matchScenarioToValues(scenario, values);

    ok(relevant.some(v => v.value === 'empirical_truth'), 'Should identify empirical_truth');
    ok(relevant.some(v => v.value === 'objective_truth'), 'Should identify objective_truth');
  });

  test('matchScenarioToValues: includes instrumental values at medium salience', () => {
    const scenario = {
      action: 'test_action',
      context: {}
    };

    const values = {
      terminal: [],
      instrumental: ['technology', 'medicine']
    };

    const relevant = matchScenarioToValues(scenario, values);

    ok(relevant.every(v => v.salience === 'medium'), 'Instrumental values should have medium salience');
  });

  test('detectValueConflicts: identifies terminal value competition', () => {
    const relevantValues = [
      { value: 'physical_wellbeing', type: 'terminal', salience: 'high' },
      { value: 'objective_truth', type: 'terminal', salience: 'high' }
    ];

    const conflicts = detectValueConflicts(relevantValues, {});

    ok(conflicts.length > 0, 'Should detect conflict');
    strictEqual(conflicts[0].type, 'terminal_competition', 'Should identify as terminal competition');
  });

  test('detectValueConflicts: no conflict with single terminal value', () => {
    const relevantValues = [
      { value: 'physical_wellbeing', type: 'terminal', salience: 'high' },
      { value: 'medicine', type: 'instrumental', salience: 'medium' }
    ];

    const conflicts = detectValueConflicts(relevantValues, {});

    strictEqual(conflicts.length, 0, 'Should not detect conflict with single terminal value');
  });

  test('evaluateAgainstValues: returns neutral when no values', () => {
    const judgment = evaluateAgainstValues('some_action', []);

    strictEqual(judgment, 'neutral', 'Should return neutral for no values');
  });

  test('evaluateAgainstValues: returns complex for multiple high-salience values', () => {
    const values = [
      { value: 'value1', type: 'terminal', salience: 'high' },
      { value: 'value2', type: 'terminal', salience: 'high' }
    ];

    const judgment = evaluateAgainstValues('action', values);

    strictEqual(judgment, 'complex', 'Should return complex for multiple values');
  });

  test('generateReasoning: creates natural language explanation', () => {
    const relevantValues = [
      { value: 'physical_wellbeing', type: 'terminal', salience: 'high' }
    ];

    const conflicts = [];

    const reasoning = generateReasoning(relevantValues, conflicts, 'materialism');

    ok(reasoning.includes('materialism'), 'Should mention worldview');
    ok(reasoning.includes('physical_wellbeing'), 'Should mention relevant value');
  });

  test('generateReasoning: mentions conflicts when present', () => {
    const relevantValues = [
      { value: 'value1', type: 'terminal' },
      { value: 'value2', type: 'terminal' }
    ];

    const conflicts = [{ type: 'terminal_competition' }];

    const reasoning = generateReasoning(relevantValues, conflicts, 'worldview');

    ok(reasoning.includes('conflict'), 'Should mention conflicts');
  });

  test('calculateConfidence: high confidence for single clear terminal value', () => {
    const values = [
      { value: 'value1', type: 'terminal', salience: 'high' }
    ];

    const confidence = calculateConfidence(values, {});

    ok(confidence >= 0.8, 'Should have high confidence (>= 0.8)');
  });

  test('calculateConfidence: medium confidence for multiple values', () => {
    const values = [
      { value: 'value1', type: 'terminal', salience: 'high' },
      { value: 'value2', type: 'terminal', salience: 'high' }
    ];

    const confidence = calculateConfidence(values, {});

    ok(confidence >= 0.4 && confidence <= 0.6,
       'Should have medium confidence (0.4-0.6)');
  });

  test('calculateConfidence: low confidence for no values', () => {
    const confidence = calculateConfidence([], {});

    ok(confidence <= 0.2, 'Should have low confidence (<= 0.2)');
  });

  test('applyWorldviewToScenario: complete evaluation workflow', () => {
    const worldviewValues = {
      terminal: ['physical_wellbeing'],
      instrumental: ['medicine'],
      subordinated: ['spirituality']
    };

    const scenario = {
      action: 'provide_medical_care',
      context: { physicalImpact: true },
      agents: ['patient']
    };

    const evaluation = applyWorldviewToScenario(worldviewValues, scenario, 'materialism');

    strictEqual(evaluation.worldview, 'materialism');
    ok(evaluation.judgment, 'Should have judgment');
    ok(evaluation.reasoning, 'Should have reasoning');
    ok(evaluation.relevantValues, 'Should identify relevant values');
    ok(evaluation.confidence >= 0 && evaluation.confidence <= 1,
       'Confidence should be between 0 and 1');
  });

  test('applyWorldviewToScenario: deterministic - same inputs produce same output', () => {
    const values = { terminal: ['truth'], instrumental: [], subordinated: [] };
    const scenario = { action: 'speak_truth', context: {} };

    const eval1 = applyWorldviewToScenario(values, scenario, 'realism');
    const eval2 = applyWorldviewToScenario(values, scenario, 'realism');

    // Remove timestamps for comparison
    delete eval1.timestamp;
    delete eval2.timestamp;

    deepStrictEqual(eval1, eval2, 'Should produce identical results');
  });
});

// ============================================================================
// MORAL REASONER CONCEPT TESTS
// These test the stateful concept behavior
// ============================================================================

describe('MoralReasoner Concept', () => {
  // THE GOLDEN RULE: Reset state before each test
  beforeEach(() => {
    moralReasoner.state.currentEvaluation = null;
    moralReasoner.state.reasoningChains = [];
    moralReasoner.state.worldviewJudgments = {};
    moralReasoner.state.evaluationInProgress = false;
    moralReasoner._subscribers = [];
  });

  test('evaluate: requires valid scenario with action', () => {
    throws(
      () => moralReasoner.actions.evaluate({}),
      Error,
      'Should throw error for scenario without action'
    );

    throws(
      () => moralReasoner.actions.evaluate(null),
      Error,
      'Should throw error for null scenario'
    );
  });

  test('evaluate: requires worldviews array', () => {
    const scenario = { action: 'test_action', context: {} };

    throws(
      () => moralReasoner.actions.evaluate(scenario, []),
      Error,
      'Should throw error for empty worldviews array'
    );

    throws(
      () => moralReasoner.actions.evaluate(scenario, null),
      Error,
      'Should throw error for null worldviews'
    );
  });

  test('evaluate: evaluates from all provided worldviews', () => {
    const scenario = {
      action: 'test_action',
      context: {}
    };

    const worldviews = [
      {
        name: 'materialism',
        values: { terminal: ['physical_wellbeing'], instrumental: [], subordinated: [] }
      },
      {
        name: 'realism',
        values: { terminal: ['objective_truth'], instrumental: [], subordinated: [] }
      }
    ];

    const evaluation = moralReasoner.actions.evaluate(scenario, worldviews);

    strictEqual(Object.keys(evaluation.judgments).length, 2,
                'Should have judgments from both worldviews');
    ok(evaluation.judgments['materialism'], 'Should have materialism judgment');
    ok(evaluation.judgments['realism'], 'Should have realism judgment');
  });

  test('evaluate: stores evaluation in reasoning chains', () => {
    const scenario = { action: 'test_action', context: {} };
    const worldviews = [
      { name: 'test', values: { terminal: [], instrumental: [], subordinated: [] } }
    ];

    moralReasoner.actions.evaluate(scenario, worldviews);

    strictEqual(moralReasoner.state.reasoningChains.length, 1,
                'Should store evaluation in history');
  });

  test('evaluate: emits evaluationStarted event', () => {
    let eventEmitted = false;

    moralReasoner.subscribe((event, payload) => {
      if (event === 'evaluationStarted') {
        eventEmitted = true;
        strictEqual(payload.worldviewCount, 1);
      }
    });

    const scenario = { action: 'test', context: {} };
    const worldviews = [
      { name: 'test', values: { terminal: [], instrumental: [], subordinated: [] } }
    ];

    moralReasoner.actions.evaluate(scenario, worldviews);

    ok(eventEmitted, 'Should emit evaluationStarted event');
  });

  test('evaluate: emits evaluationCompleted event', () => {
    let eventEmitted = false;

    moralReasoner.subscribe((event, payload) => {
      if (event === 'evaluationCompleted') {
        eventEmitted = true;
        ok(payload.evaluation, 'Should include evaluation in payload');
      }
    });

    const scenario = { action: 'test', context: {} };
    const worldviews = [
      { name: 'test', values: { terminal: [], instrumental: [], subordinated: [] } }
    ];

    moralReasoner.actions.evaluate(scenario, worldviews);

    ok(eventEmitted, 'Should emit evaluationCompleted event');
  });

  test('consultWorldview: emits worldviewConsulted event', () => {
    let eventEmitted = false;

    moralReasoner.subscribe((event, payload) => {
      if (event === 'worldviewConsulted') {
        eventEmitted = true;
        strictEqual(payload.worldview, 'test');
      }
    });

    const values = { terminal: ['value1'], instrumental: [], subordinated: [] };
    const scenario = { action: 'test', context: {} };

    moralReasoner.actions.consultWorldview('test', values, scenario);

    ok(eventEmitted, 'Should emit worldviewConsulted event');
  });

  test('getCurrentEvaluation: returns current evaluation', () => {
    const scenario = { action: 'test', context: {} };
    const worldviews = [
      { name: 'test', values: { terminal: [], instrumental: [], subordinated: [] } }
    ];

    moralReasoner.actions.evaluate(scenario, worldviews);

    const current = moralReasoner.actions.getCurrentEvaluation();
    strictEqual(current.action, 'test');
  });

  test('getReasoningHistory: returns all evaluations', () => {
    const scenario1 = { action: 'test1', context: {} };
    const scenario2 = { action: 'test2', context: {} };
    const worldviews = [
      { name: 'test', values: { terminal: [], instrumental: [], subordinated: [] } }
    ];

    moralReasoner.actions.evaluate(scenario1, worldviews);
    moralReasoner.actions.evaluate(scenario2, worldviews);

    const history = moralReasoner.actions.getReasoningHistory();
    strictEqual(history.length, 2, 'Should have 2 evaluations in history');
  });

  test('reset: clears all state', () => {
    const scenario = { action: 'test', context: {} };
    const worldviews = [
      { name: 'test', values: { terminal: [], instrumental: [], subordinated: [] } }
    ];

    moralReasoner.actions.evaluate(scenario, worldviews);
    moralReasoner.actions.reset();

    strictEqual(moralReasoner.state.currentEvaluation, null);
    strictEqual(moralReasoner.state.reasoningChains.length, 0);
    strictEqual(Object.keys(moralReasoner.state.worldviewJudgments).length, 0);
  });
});

// ============================================================================
// MULTI-PERSPECTIVAL EVALUATION TESTS
// Critical: Each worldview must evaluate independently
// ============================================================================

describe('Multi-Perspectival Independence', () => {
  beforeEach(() => {
    moralReasoner.actions.reset();
  });

  test('worldview evaluations are independent', () => {
    const scenario = { action: 'test', context: {} };

    const worldviews = [
      {
        name: 'worldview1',
        values: { terminal: ['value1'], instrumental: [], subordinated: [] }
      },
      {
        name: 'worldview2',
        values: { terminal: ['value2'], instrumental: [], subordinated: [] }
      }
    ];

    const evaluation = moralReasoner.actions.evaluate(scenario, worldviews);

    // Each worldview should reference only its own values
    ok(evaluation.judgments['worldview1'].relevantValues.every(v =>
      v.value === 'value1' || v.type === 'instrumental'
    ), 'Worldview1 should only reference its own values');

    ok(evaluation.judgments['worldview2'].relevantValues.every(v =>
      v.value === 'value2' || v.type === 'instrumental'
    ), 'Worldview2 should only reference its own values');
  });

  test('evaluation order does not affect individual judgments', () => {
    const scenario = { action: 'test', context: {} };

    const worldviews = [
      { name: 'A', values: { terminal: ['valueA'], instrumental: [], subordinated: [] } },
      { name: 'B', values: { terminal: ['valueB'], instrumental: [], subordinated: [] } }
    ];

    const eval1 = moralReasoner.actions.evaluate(scenario, worldviews);

    moralReasoner.actions.reset();

    // Reverse order
    const worldviewsReversed = [worldviews[1], worldviews[0]];
    const eval2 = moralReasoner.actions.evaluate(scenario, worldviewsReversed);

    // Individual judgments should be identical regardless of order
    const judgmentA1 = eval1.judgments['A'];
    const judgmentA2 = eval2.judgments['A'];

    strictEqual(judgmentA1.judgment, judgmentA2.judgment,
                'Judgment should not change based on evaluation order');
  });
});
