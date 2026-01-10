/**
 * Scenario Evaluation Tests
 *
 * Tests complete multi-perspectival evaluation of moral scenarios.
 * This demonstrates the integrated system working end-to-end.
 *
 * Following the process-isolated testing strategy from testStrategy.md.
 */

import { describe, test, beforeEach } from './test-utils.js';
import { strictEqual, ok } from '../../../src/assert.js';
import { worldviewManager } from '../../../src/concepts/worldviewManager.js';
import { moralReasoner } from '../../../src/concepts/moralReasoner.js';

// ============================================================================
// END-TO-END SCENARIO EVALUATION TESTS
// These test complete evaluation workflows across concepts
// ============================================================================

describe('Classic Moral Scenarios - Material-Empirical Worldviews', () => {
  beforeEach(() => {
    // Reset all concepts
    worldviewManager.actions.reset();
    moralReasoner.actions.reset();

    // Load Phase 1 worldviews
    worldviewManager.actions.loadMaterialEmpiricalWorldviews();
  });

  test('Scenario: Keeping a found wallet', () => {
    const scenario = {
      action: 'keep_wallet',
      context: {
        artifact: 'wallet',
        situation: 'found_on_street',
        physicalImpact: false,
        factsInvolved: false,
        personsInvolved: true
      },
      agents: ['finder', 'original_owner'],
      artifacts: ['wallet', 'money', 'identification']
    };

    // Get active worldviews
    const worldviews = worldviewManager.state.activeWorldviews.map(name => ({
      name,
      values: worldviewManager.state.valueHierarchies[name]
    }));

    const evaluation = moralReasoner.actions.evaluate(scenario, worldviews);

    // Should consult all 4 Phase 1 worldviews
    strictEqual(evaluation.worldviewsConsulted.length, 4,
                'Should consult all 4 Material-Empirical worldviews');

    // All worldviews should produce judgments
    ok(evaluation.judgments['materialism'], 'Should have materialism judgment');
    ok(evaluation.judgments['sensationalism'], 'Should have sensationalism judgment');
    ok(evaluation.judgments['phenomenalism'], 'Should have phenomenalism judgment');
    ok(evaluation.judgments['realism'], 'Should have realism judgment');

    // Each judgment should have required components
    Object.values(evaluation.judgments).forEach(judgment => {
      ok(judgment.judgment, 'Should have judgment');
      ok(judgment.reasoning, 'Should have reasoning');
      ok(judgment.confidence !== undefined, 'Should have confidence');
      ok(judgment.worldview, 'Should identify worldview');
    });
  });

  test('Scenario: Making a false claim to avoid harm', () => {
    const scenario = {
      action: 'make_false_claim',
      context: {
        truthClaims: true,
        factsInvolved: true,
        physicalImpact: true, // Harm avoided
        motivation: 'protect_other'
      },
      agents: ['speaker', 'threatened_person', 'potential_harmer']
    };

    const worldviews = worldviewManager.state.activeWorldviews.map(name => ({
      name,
      values: worldviewManager.state.valueHierarchies[name]
    }));

    const evaluation = moralReasoner.actions.evaluate(scenario, worldviews);

    // Materialism might focus on physical harm avoided
    const materialismJudgment = evaluation.judgments['materialism'];
    ok(materialismJudgment.relevantValues.some(v => v.value === 'physical_wellbeing'),
       'Materialism should consider physical wellbeing');

    // Realism might focus on truth violation
    const realismJudgment = evaluation.judgments['realism'];
    ok(realismJudgment.relevantValues.some(v => v.value === 'objective_truth'),
       'Realism should consider objective truth');

    // Should detect value conflict (truth vs. wellbeing)
    ok(evaluation.judgments['realism'].conflicts || evaluation.judgments['materialism'].conflicts,
       'Should detect potential value conflicts');
  });

  test('Scenario: Providing medical care', () => {
    const scenario = {
      action: 'provide_medical_care',
      context: {
        physicalImpact: true,
        factsInvolved: true, // Medical facts
        professional: true
      },
      agents: ['doctor', 'patient']
    };

    const worldviews = worldviewManager.state.activeWorldviews.map(name => ({
      name,
      values: worldviewManager.state.valueHierarchies[name]
    }));

    const evaluation = moralReasoner.actions.evaluate(scenario, worldviews);

    // Materialism should strongly favor (health, empirical medicine)
    const materialismJudgment = evaluation.judgments['materialism'];
    ok(materialismJudgment.relevantValues.some(v =>
      v.value === 'physical_wellbeing' || v.value === 'empirical_truth'
    ), 'Materialism should identify health and empirical values');

    // Sensationalism might consider comfort/pain relief
    const sensationalismJudgment = evaluation.judgments['sensationalism'];
    ok(sensationalismJudgment.reasoning.includes('sensationalism'),
       'Sensationalism should provide perspective');
  });

  test('Scenario: Creating art', () => {
    const scenario = {
      action: 'create_art',
      context: {
        aesthetic: true,
        sensory: true,
        physicalImpact: false
      },
      agents: ['artist'],
      artifacts: ['artwork']
    };

    const worldviews = worldviewManager.state.activeWorldviews.map(name => ({
      name,
      values: worldviewManager.state.valueHierarchies[name]
    }));

    const evaluation = moralReasoner.actions.evaluate(scenario, worldviews);

    // Sensationalism should find this highly relevant
    const sensationalismJudgment = evaluation.judgments['sensationalism'];
    ok(sensationalismJudgment.relevantValues.some(v =>
      v.value === 'experiential_richness' || v.value === 'aesthetic_beauty'
    ), 'Sensationalism should value aesthetic experience');

    // Materialism might be less engaged (no physical wellbeing at stake)
    const materialismJudgment = evaluation.judgments['materialism'];
    // This is a weaker test - materialism might still find some value
    ok(materialismJudgment.judgment !== undefined,
       'Materialism should still provide judgment even if less engaged');
  });
});

// ============================================================================
// WORLDVIEW COMPARISON TESTS
// Demonstrate that different worldviews produce different judgments
// ============================================================================

describe('Worldview Judgment Differences', () => {
  beforeEach(() => {
    worldviewManager.actions.reset();
    moralReasoner.actions.reset();
    worldviewManager.actions.loadMaterialEmpiricalWorldviews();
  });

  test('Same scenario produces different reasoning from different worldviews', () => {
    const scenario = {
      action: 'test_action',
      context: {
        physicalImpact: true,
        truthClaims: true,
        aesthetic: true
      }
    };

    const worldviews = worldviewManager.state.activeWorldviews.map(name => ({
      name,
      values: worldviewManager.state.valueHierarchies[name]
    }));

    const evaluation = moralReasoner.actions.evaluate(scenario, worldviews);

    // Get reasoning from each worldview
    const reasonings = Object.values(evaluation.judgments).map(j => j.reasoning);

    // Each should mention its own worldview
    ok(reasonings[0].includes('materialism') ||
       reasonings[0].includes('sensationalism') ||
       reasonings[0].includes('phenomenalism') ||
       reasonings[0].includes('realism'),
       'Each reasoning should identify its worldview');

    // Reasonings should be distinct (not all identical)
    const uniqueReasonings = new Set(reasonings);
    ok(uniqueReasonings.size > 1,
       'Different worldviews should produce distinct reasoning');
  });

  test('Value hierarchies remain distinct across evaluations', () => {
    const scenario1 = { action: 'action1', context: {} };
    const scenario2 = { action: 'action2', context: {} };

    const worldviews = worldviewManager.state.activeWorldviews.map(name => ({
      name,
      values: worldviewManager.state.valueHierarchies[name]
    }));

    moralReasoner.actions.evaluate(scenario1, worldviews);
    moralReasoner.actions.evaluate(scenario2, worldviews);

    // Check that worldview value hierarchies haven't changed
    const materialismValues = worldviewManager.state.valueHierarchies['materialism'];
    ok(materialismValues.terminal.includes('physical_wellbeing'),
       'Materialism values should remain consistent');

    const realismValues = worldviewManager.state.valueHierarchies['realism'];
    ok(realismValues.terminal.includes('objective_truth'),
       'Realism values should remain consistent');
  });
});

// ============================================================================
// EVALUATION TRANSPARENCY TESTS
// Ensure all reasoning is traceable and auditable
// ============================================================================

describe('Evaluation Transparency', () => {
  beforeEach(() => {
    worldviewManager.actions.reset();
    moralReasoner.actions.reset();
    worldviewManager.actions.loadMaterialEmpiricalWorldviews();
  });

  test('Evaluation includes complete metadata', () => {
    const scenario = { action: 'test', context: {} };

    const worldviews = worldviewManager.state.activeWorldviews.map(name => ({
      name,
      values: worldviewManager.state.valueHierarchies[name]
    }));

    const evaluation = moralReasoner.actions.evaluate(scenario, worldviews);

    // Required metadata
    ok(evaluation.scenario, 'Should include scenario');
    ok(evaluation.judgments, 'Should include judgments');
    ok(evaluation.worldviewsConsulted, 'Should list consulted worldviews');
    ok(evaluation.timestamp, 'Should include timestamp');
  });

  test('Each judgment is fully traceable', () => {
    const scenario = { action: 'test', context: { physicalImpact: true } };

    const worldviews = worldviewManager.state.activeWorldviews.map(name => ({
      name,
      values: worldviewManager.state.valueHierarchies[name]
    }));

    const evaluation = moralReasoner.actions.evaluate(scenario, worldviews);

    Object.entries(evaluation.judgments).forEach(([worldviewName, judgment]) => {
      // Required judgment components
      ok(judgment.judgment, `${worldviewName} should have judgment`);
      ok(judgment.reasoning, `${worldviewName} should have reasoning`);
      ok(judgment.worldview === worldviewName,
         `${worldviewName} judgment should identify itself`);
      ok(judgment.relevantValues !== undefined,
         `${worldviewName} should identify relevant values`);
      ok(judgment.confidence !== undefined,
         `${worldviewName} should include confidence level`);
    });
  });

  test('Reasoning history is preserved', () => {
    const scenario1 = { action: 'action1', context: {} };
    const scenario2 = { action: 'action2', context: {} };

    const worldviews = worldviewManager.state.activeWorldviews.map(name => ({
      name,
      values: worldviewManager.state.valueHierarchies[name]
    }));

    moralReasoner.actions.evaluate(scenario1, worldviews);
    moralReasoner.actions.evaluate(scenario2, worldviews);

    const history = moralReasoner.actions.getReasoningHistory();

    strictEqual(history.length, 2, 'Should preserve both evaluations');
    strictEqual(history[0].scenario.action, 'action1', 'Should preserve order');
    strictEqual(history[1].scenario.action, 'action2', 'Should preserve order');
  });

  test('All worldviews consulted for every evaluation', () => {
    const scenario = { action: 'test', context: {} };

    const worldviews = worldviewManager.state.activeWorldviews.map(name => ({
      name,
      values: worldviewManager.state.valueHierarchies[name]
    }));

    const evaluation = moralReasoner.actions.evaluate(scenario, worldviews);

    // Non-negotiable: all active worldviews must be consulted
    strictEqual(
      evaluation.worldviewsConsulted.length,
      worldviewManager.state.activeWorldviews.length,
      'Must consult ALL active worldviews, no shortcuts'
    );
  });
});
