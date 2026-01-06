/**
 * Unit Tests for Deliberation Orchestrator
 *
 * Tests the application layer orchestrator that coordinates
 * the multi-step deliberation workflow.
 *
 * Test Coverage:
 * - Domain detection (pure function)
 * - Worldview selection (pure function)
 * - Result formatting (pure function)
 * - End-to-end deliberation flow (action)
 * - State management (action)
 * - Event emission
 * - Error handling
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  detectDomain,
  selectWorldviews,
  formatDeliberationResult,
  deliberationOrchestrator
} from '../../src/application/deliberationOrchestrator.js';

// ============================================================================
// PURE FUNCTION TESTS - Domain Detection
// ============================================================================

describe('detectDomain', () => {
  it('should detect healthcare domain from medical keywords', () => {
    const scenario = 'A patient is on life support and the doctor must decide whether to continue treatment.';
    const domain = detectDomain(scenario);
    assert.equal(domain, 'healthcare');
  });

  it('should detect spiritual domain from religious keywords', () => {
    const scenario = 'The church community must decide whether to allow divorced members to participate in sacred rituals.';
    const domain = detectDomain(scenario);
    assert.equal(domain, 'spiritual');
  });

  it('should detect education domain from academic keywords', () => {
    const scenario = 'A teacher must decide whether to curve exam grades for struggling students.';
    const domain = detectDomain(scenario);
    assert.equal(domain, 'education');
  });

  it('should detect vocational domain from workplace keywords', () => {
    const scenario = 'An employee must decide whether to accept a promotion that requires relocating.';
    const domain = detectDomain(scenario);
    assert.equal(domain, 'vocational');
  });

  it('should detect environmental domain from nature keywords', () => {
    const scenario = 'A conservation group must decide whether to protect an endangered species habitat.';
    const domain = detectDomain(scenario);
    assert.equal(domain, 'environmental');
  });

  it('should detect interpersonal domain from relationship keywords', () => {
    const scenario = 'A person must decide whether to maintain trust with a friend who lied.';
    const domain = detectDomain(scenario);
    assert.equal(domain, 'interpersonal');
  });

  it('should detect intellectual domain from research keywords', () => {
    const scenario = 'A researcher must decide whether to publish data that contradicts their hypothesis.';
    const domain = detectDomain(scenario);
    assert.equal(domain, 'intellectual');
  });

  it('should return general for unclear domain', () => {
    const scenario = 'Should I do this thing or that thing?';
    const domain = detectDomain(scenario);
    assert.equal(domain, 'general');
  });

  it('should return general for empty input', () => {
    const domain = detectDomain('');
    assert.equal(domain, 'general');
  });

  it('should return general for null input', () => {
    const domain = detectDomain(null);
    assert.equal(domain, 'general');
  });

  it('should choose highest scoring domain when multiple keywords present', () => {
    // More healthcare keywords (4) than education keywords (2)
    const scenario = 'A medical student must study disease treatment in the hospital with their doctor mentor.';
    const domain = detectDomain(scenario);
    assert.equal(domain, 'healthcare');
  });
});

// ============================================================================
// PURE FUNCTION TESTS - Worldview Selection
// ============================================================================

describe('selectWorldviews', () => {
  const scenario = { description: 'Test scenario' };
  const domain = 'healthcare';

  it('should return all 12 worldviews by default', () => {
    const worldviews = selectWorldviews(scenario, domain);
    assert.equal(worldviews.length, 12);
    assert.ok(worldviews.includes('Materialism'));
    assert.ok(worldviews.includes('Sensationalism'));
    assert.ok(worldviews.includes('Phenomenalism'));
    assert.ok(worldviews.includes('Realism'));
    assert.ok(worldviews.includes('Dynamism'));
    assert.ok(worldviews.includes('Monadism'));
    assert.ok(worldviews.includes('Idealism'));
    assert.ok(worldviews.includes('Rationalism'));
    assert.ok(worldviews.includes('Psychism'));
    assert.ok(worldviews.includes('Pneumatism'));
    assert.ok(worldviews.includes('Spiritualism'));
    assert.ok(worldviews.includes('Mathematism'));
  });

  it('should return custom worldviews when specified', () => {
    const options = {
      worldviews: ['Materialism', 'Spiritualism', 'Rationalism']
    };
    const worldviews = selectWorldviews(scenario, domain, options);
    assert.equal(worldviews.length, 3);
    assert.ok(worldviews.includes('Materialism'));
    assert.ok(worldviews.includes('Spiritualism'));
    assert.ok(worldviews.includes('Rationalism'));
  });

  it('should filter out invalid worldview names', () => {
    const options = {
      worldviews: ['Materialism', 'InvalidWorldview', 'Spiritualism']
    };
    const worldviews = selectWorldviews(scenario, domain, options);
    assert.equal(worldviews.length, 2);
    assert.ok(worldviews.includes('Materialism'));
    assert.ok(worldviews.includes('Spiritualism'));
    assert.ok(!worldviews.includes('InvalidWorldview'));
  });

  it('should return empty array for all invalid worldviews', () => {
    const options = {
      worldviews: ['InvalidWorldview1', 'InvalidWorldview2']
    };
    const worldviews = selectWorldviews(scenario, domain, options);
    assert.equal(worldviews.length, 0);
  });

  it('should return all worldviews when options.worldviews is empty array', () => {
    const options = { worldviews: [] };
    const worldviews = selectWorldviews(scenario, domain, options);
    assert.equal(worldviews.length, 12);
  });

  it('should return all worldviews when options.worldviews is not an array', () => {
    const options = { worldviews: 'not-an-array' };
    const worldviews = selectWorldviews(scenario, domain, options);
    assert.equal(worldviews.length, 12);
  });
});

// ============================================================================
// PURE FUNCTION TESTS - Result Formatting
// ============================================================================

describe('formatDeliberationResult', () => {
  const scenario = {
    description: 'A patient is on life support',
    context: { age: 75, family: 'present' }
  };

  const domain = 'healthcare';

  const evaluations = [
    {
      worldview: 'Materialism',
      judgment: 'permissible',
      confidence: 0.85,
      reasoning: 'Physical autonomy is paramount.',
      values: ['bodily_autonomy', 'minimize_suffering']
    },
    {
      worldview: 'Spiritualism',
      judgment: 'impermissible',
      confidence: 0.90,
      reasoning: 'Life is sacred.',
      values: ['sacred_life', 'divine_sovereignty']
    }
  ];

  const resolution = {
    id: 'test-id-123',
    timestamp: '2024-01-01T12:00:00Z',
    judgment: 'permissible',
    confidence: 0.75,
    confidenceLevel: 'moderate',
    weights: {
      'Materialism': 0.8,
      'Spiritualism': 0.6
    },
    conflictDetails: [
      {
        worldviews: ['Materialism', 'Spiritualism'],
        judgments: ['permissible', 'impermissible']
      }
    ],
    minorityViews: [
      {
        worldview: 'Spiritualism',
        judgment: 'impermissible',
        reasoning: 'Life is sacred.'
      }
    ],
    supportingWorldviews: ['Materialism'],
    justification: 'The integrated judgment balances autonomy with respect for life.',
    steps: [
      'gather_perspectives',
      'identify_conflicts',
      'contextualize_domain',
      'integrate_judgments',
      'acknowledge_minority',
      'generate_justification',
      'assess_confidence'
    ],
    conflicts: 1
  };

  it('should format complete deliberation result correctly', () => {
    const result = formatDeliberationResult(resolution, evaluations, domain, scenario);

    assert.equal(result.id, 'test-id-123');
    assert.equal(result.timestamp, '2024-01-01T12:00:00Z');
    assert.equal(result.domain, 'healthcare');
    assert.equal(result.judgment, 'permissible');
    assert.equal(result.confidence, 0.75);
    assert.equal(result.confidenceLevel, 'moderate');
  });

  it('should include scenario information', () => {
    const result = formatDeliberationResult(resolution, evaluations, domain, scenario);

    assert.equal(result.scenario.description, 'A patient is on life support');
    assert.equal(result.scenario.domain, 'healthcare');
    assert.deepEqual(result.scenario.context, { age: 75, family: 'present' });
  });

  it('should format worldview evaluations with weights', () => {
    const result = formatDeliberationResult(resolution, evaluations, domain, scenario);

    assert.equal(result.worldviews.length, 2);

    const materialism = result.worldviews.find(wv => wv.worldview === 'Materialism');
    assert.ok(materialism);
    assert.equal(materialism.judgment, 'permissible');
    assert.equal(materialism.confidence, 0.85);
    assert.equal(materialism.reasoning, 'Physical autonomy is paramount.');
    assert.deepEqual(materialism.values, ['bodily_autonomy', 'minimize_suffering']);
    assert.equal(materialism.weight, 0.8);

    const spiritualism = result.worldviews.find(wv => wv.worldview === 'Spiritualism');
    assert.ok(spiritualism);
    assert.equal(spiritualism.weight, 0.6);
  });

  it('should include conflict information', () => {
    const result = formatDeliberationResult(resolution, evaluations, domain, scenario);

    assert.equal(result.conflicts.length, 1);
    assert.deepEqual(result.conflicts[0].worldviews, ['Materialism', 'Spiritualism']);
    assert.deepEqual(result.conflicts[0].judgments, ['permissible', 'impermissible']);
  });

  it('should include minority views', () => {
    const result = formatDeliberationResult(resolution, evaluations, domain, scenario);

    assert.equal(result.minorityViews.length, 1);
    assert.equal(result.minorityViews[0].worldview, 'Spiritualism');
    assert.equal(result.minorityViews[0].judgment, 'impermissible');
  });

  it('should include supporting worldviews and justification', () => {
    const result = formatDeliberationResult(resolution, evaluations, domain, scenario);

    assert.deepEqual(result.supportingWorldviews, ['Materialism']);
    assert.equal(result.justification, 'The integrated judgment balances autonomy with respect for life.');
  });

  it('should include all 7 steps', () => {
    const result = formatDeliberationResult(resolution, evaluations, domain, scenario);

    assert.equal(result.steps.length, 7);
    assert.deepEqual(result.steps, [
      'gather_perspectives',
      'identify_conflicts',
      'contextualize_domain',
      'integrate_judgments',
      'acknowledge_minority',
      'generate_justification',
      'assess_confidence'
    ]);
  });

  it('should include metadata', () => {
    const result = formatDeliberationResult(resolution, evaluations, domain, scenario);

    assert.equal(result.metadata.evaluationsCount, 2);
    assert.equal(result.metadata.conflictsCount, 1);
    assert.equal(result.metadata.minorityViewsCount, 1);
    assert.equal(result.metadata.completedAt, '2024-01-01T12:00:00Z');
  });

  it('should handle missing context gracefully', () => {
    const scenarioWithoutContext = { description: 'Test scenario' };
    const result = formatDeliberationResult(resolution, evaluations, domain, scenarioWithoutContext);

    assert.deepEqual(result.scenario.context, {});
  });

  it('should use default weight 0.5 for worldviews not in resolution.weights', () => {
    const evaluationsWithExtra = [
      ...evaluations,
      {
        worldview: 'Realism',
        judgment: 'uncertain',
        confidence: 0.60,
        reasoning: 'Need more evidence.',
        values: ['empirical_evidence']
      }
    ];

    const result = formatDeliberationResult(resolution, evaluationsWithExtra, domain, scenario);

    const realism = result.worldviews.find(wv => wv.worldview === 'Realism');
    assert.ok(realism);
    assert.equal(realism.weight, 0.5); // Default weight
  });
});

// ============================================================================
// ACTION TESTS - End-to-End Deliberation
// ============================================================================

describe('deliberationOrchestrator.actions.deliberateOnScenario', () => {
  beforeEach(() => {
    // Reset state before each test
    deliberationOrchestrator.actions.reset();
  });

  it('should complete full deliberation workflow', async () => {
    const scenario = {
      description: 'A patient is on life support and the doctor must decide whether to continue treatment.',
      context: { age: 75 }
    };

    const result = await deliberationOrchestrator.actions.deliberateOnScenario(scenario);

    // Verify result structure
    assert.ok(result.id);
    assert.ok(result.timestamp);
    assert.equal(result.domain, 'healthcare');
    assert.ok(['permissible', 'impermissible', 'uncertain'].includes(result.judgment));
    assert.ok(result.confidence >= 0 && result.confidence <= 1);
    assert.ok(result.worldviews.length > 0);
    assert.ok(result.steps.length === 7);
  });

  it('should use provided domain instead of detecting', async () => {
    const scenario = {
      description: 'A general scenario',
      domain: 'spiritual' // Explicitly provided
    };

    const result = await deliberationOrchestrator.actions.deliberateOnScenario(scenario);

    assert.equal(result.domain, 'spiritual');
  });

  it('should detect domain when not provided', async () => {
    const scenario = {
      description: 'A student must decide whether to cheat on an exam.'
    };

    const result = await deliberationOrchestrator.actions.deliberateOnScenario(scenario);

    assert.equal(result.domain, 'education');
  });

  it('should use custom worldviews when specified', async () => {
    const scenario = {
      description: 'Test scenario'
    };

    const options = {
      worldviews: ['Materialism', 'Spiritualism']
    };

    const result = await deliberationOrchestrator.actions.deliberateOnScenario(scenario, options);

    assert.equal(result.worldviews.length, 2);
    const worldviewNames = result.worldviews.map(wv => wv.worldview);
    assert.ok(worldviewNames.includes('Materialism'));
    assert.ok(worldviewNames.includes('Spiritualism'));
  });

  it('should update state during deliberation', async () => {
    const scenario = {
      description: 'Test scenario'
    };

    assert.equal(deliberationOrchestrator.state.deliberationInProgress, false);

    const deliberationPromise = deliberationOrchestrator.actions.deliberateOnScenario(scenario);

    // State should be in progress during deliberation
    // Note: Due to async nature, this might complete too fast to catch

    const result = await deliberationPromise;

    // After completion, should not be in progress
    assert.equal(deliberationOrchestrator.state.deliberationInProgress, false);
    assert.equal(deliberationOrchestrator.state.currentDeliberation.id, result.id);
    assert.equal(deliberationOrchestrator.state.lastError, null);
  });

  it('should throw error for invalid scenario input', async () => {
    const invalidScenario = {
      // Missing description
      context: { foo: 'bar' }
    };

    await assert.rejects(
      async () => {
        await deliberationOrchestrator.actions.deliberateOnScenario(invalidScenario);
      },
      {
        message: /Invalid scenario input/
      }
    );
  });

  it('should update lastError state on failure', async () => {
    const invalidScenario = {};

    try {
      await deliberationOrchestrator.actions.deliberateOnScenario(invalidScenario);
      assert.fail('Should have thrown error');
    } catch (error) {
      assert.ok(deliberationOrchestrator.state.lastError);
      assert.equal(deliberationOrchestrator.state.deliberationInProgress, false);
    }
  });
});

// ============================================================================
// ACTION TESTS - State Management
// ============================================================================

describe('deliberationOrchestrator.actions.reset', () => {
  it('should reset all state to initial values', async () => {
    // First, populate state with a deliberation
    const scenario = {
      description: 'Test scenario'
    };

    await deliberationOrchestrator.actions.deliberateOnScenario(scenario);

    // State should have data
    assert.ok(deliberationOrchestrator.state.currentDeliberation);

    // Now reset
    deliberationOrchestrator.actions.reset();

    // State should be cleared
    assert.equal(deliberationOrchestrator.state.currentDeliberation, null);
    assert.equal(deliberationOrchestrator.state.deliberationInProgress, false);
    assert.equal(deliberationOrchestrator.state.lastError, null);
  });
});

// ============================================================================
// EVENT EMISSION TESTS
// ============================================================================

describe('deliberationOrchestrator events', () => {
  beforeEach(() => {
    deliberationOrchestrator.actions.reset();
    // Clear all listeners
    deliberationOrchestrator.listeners = {};
  });

  it('should emit deliberationStarted event', async () => {
    let eventData = null;

    deliberationOrchestrator.on('deliberationStarted', (data) => {
      eventData = data;
    });

    const scenario = { description: 'Test scenario' };
    await deliberationOrchestrator.actions.deliberateOnScenario(scenario);

    assert.ok(eventData);
    assert.equal(eventData.scenario.description, 'Test scenario');
  });

  it('should emit domainDetected event', async () => {
    let eventData = null;

    deliberationOrchestrator.on('domainDetected', (data) => {
      eventData = data;
    });

    const scenario = { description: 'A patient needs medical treatment.' };
    await deliberationOrchestrator.actions.deliberateOnScenario(scenario);

    assert.ok(eventData);
    assert.equal(eventData.domain, 'healthcare');
  });

  it('should emit worldviewsSelected event', async () => {
    let eventData = null;

    deliberationOrchestrator.on('worldviewsSelected', (data) => {
      eventData = data;
    });

    const scenario = { description: 'Test scenario' };
    await deliberationOrchestrator.actions.deliberateOnScenario(scenario);

    assert.ok(eventData);
    assert.ok(Array.isArray(eventData.worldviews));
    assert.equal(eventData.count, 12); // Default all worldviews
  });

  it('should emit evaluationsGenerated event', async () => {
    let eventData = null;

    deliberationOrchestrator.on('evaluationsGenerated', (data) => {
      eventData = data;
    });

    const scenario = { description: 'Test scenario' };
    await deliberationOrchestrator.actions.deliberateOnScenario(scenario);

    assert.ok(eventData);
    assert.ok(eventData.count > 0);
  });

  it('should emit conflictsResolved event', async () => {
    let eventData = null;

    deliberationOrchestrator.on('conflictsResolved', (data) => {
      eventData = data;
    });

    const scenario = { description: 'Test scenario' };
    await deliberationOrchestrator.actions.deliberateOnScenario(scenario);

    assert.ok(eventData);
    assert.ok(eventData.resolution);
    assert.ok(eventData.resolution.judgment);
  });

  it('should emit deliberationCompleted event', async () => {
    let eventData = null;

    deliberationOrchestrator.on('deliberationCompleted', (data) => {
      eventData = data;
    });

    const scenario = { description: 'Test scenario' };
    await deliberationOrchestrator.actions.deliberateOnScenario(scenario);

    assert.ok(eventData);
    assert.ok(eventData.result);
    assert.ok(eventData.result.id);
  });

  it('should emit deliberationFailed event on error', async () => {
    let eventData = null;

    deliberationOrchestrator.on('deliberationFailed', (data) => {
      eventData = data;
    });

    const invalidScenario = {}; // Will fail validation

    try {
      await deliberationOrchestrator.actions.deliberateOnScenario(invalidScenario);
    } catch (error) {
      // Expected to throw
    }

    assert.ok(eventData);
    assert.ok(eventData.error);
  });

  it('should emit reset event', () => {
    let eventEmitted = false;

    deliberationOrchestrator.on('reset', () => {
      eventEmitted = true;
    });

    deliberationOrchestrator.actions.reset();

    assert.equal(eventEmitted, true);
  });

  it('should allow multiple listeners for same event', async () => {
    let listener1Called = false;
    let listener2Called = false;

    deliberationOrchestrator.on('deliberationStarted', () => {
      listener1Called = true;
    });

    deliberationOrchestrator.on('deliberationStarted', () => {
      listener2Called = true;
    });

    const scenario = { description: 'Test scenario' };
    await deliberationOrchestrator.actions.deliberateOnScenario(scenario);

    assert.equal(listener1Called, true);
    assert.equal(listener2Called, true);
  });

  it('should allow unsubscribing from events', async () => {
    let callCount = 0;

    const unsubscribe = deliberationOrchestrator.on('deliberationStarted', () => {
      callCount++;
    });

    const scenario = { description: 'Test scenario' };
    await deliberationOrchestrator.actions.deliberateOnScenario(scenario);

    assert.equal(callCount, 1);

    // Unsubscribe
    unsubscribe();

    // Call again
    await deliberationOrchestrator.actions.deliberateOnScenario(scenario);

    // Should still be 1 (not 2)
    assert.equal(callCount, 1);
  });
});
