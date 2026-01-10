/**
 * Integration Procedures Test Suite
 *
 * Tests the 7-step integration procedure for resolving value conflicts
 * across all 12 worldviews with domain-specific contextualization.
 *
 * Phase 2.5: Value Conflict Resolution
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import valueConflictResolver from '../../../src/concepts/valueConflictResolver.js';
import {
  detectConflicts,
  getDomainWeights,
  getDomainWeightJustification,
  integrateJudgments,
  identifyMinorityViews,
  assessConfidence,
  generateJustification
} from '../../../src/concepts/valueConflictResolver.js';

// Sample evaluations for testing
const sampleEvaluations = [
  {
    worldview: 'Materialism',
    judgment: 'permissible',
    confidence: 0.85,
    reasoning: 'Physical wellbeing and autonomy maximized',
    values: ['physical_wellbeing', 'individual_autonomy']
  },
  {
    worldview: 'Spiritualism',
    judgment: 'impermissible',
    confidence: 0.90,
    reasoning: 'Sacred life, divine will considerations',
    values: ['sacred_life', 'divine_will']
  },
  {
    worldview: 'Monadism',
    judgment: 'permissible',
    confidence: 0.80,
    reasoning: 'Individual dignity and irreplaceable personhood respected',
    values: ['individual_dignity', 'personal_autonomy']
  },
  {
    worldview: 'Psychism',
    judgment: 'permissible',
    confidence: 0.75,
    reasoning: 'Psychological wholeness and authentic choice',
    values: ['psychological_wholeness', 'authentic_choice']
  }
];

// ============================================================================
// STEP 1: CONFLICT DETECTION TESTS
// ============================================================================

test('Should detect conflict when worldviews disagree on judgment', () => {
  const conflicts = detectConflicts(sampleEvaluations);

  assert(conflicts.length > 0, 'Should detect at least one conflict');
  assert(conflicts[0].type === 'judgment', 'Should identify judgment conflict');
  assert(conflicts[0].worldviews.includes('Materialism'), 'Should include Materialism');
  assert(conflicts[0].worldviews.includes('Spiritualism'), 'Should include Spiritualism');
});

test('Should classify conflict types correctly', () => {
  const conflicts = detectConflicts(sampleEvaluations);
  const conflict = conflicts[0];

  assert(conflict.type, 'Conflict should have a type');
  assert(['judgment', 'values', 'metaphysical'].includes(conflict.type),
    'Conflict type should be recognized category');
});

test('Should detect no conflicts when all worldviews agree', () => {
  const agreeingEvaluations = [
    { worldview: 'Materialism', judgment: 'permissible', confidence: 0.85, reasoning: 'Test', values: [] },
    { worldview: 'Spiritualism', judgment: 'permissible', confidence: 0.90, reasoning: 'Test', values: [] },
    { worldview: 'Monadism', judgment: 'permissible', confidence: 0.80, reasoning: 'Test', values: [] }
  ];

  const conflicts = detectConflicts(agreeingEvaluations);
  assert.equal(conflicts.length, 0, 'Should detect no conflicts when all agree');
});

test('Should map conflict structure (which worldviews agree/disagree)', () => {
  const conflicts = detectConflicts(sampleEvaluations);
  const conflict = conflicts[0];

  assert(conflict.positions, 'Conflict should map positions');
  assert(Array.isArray(conflict.positions.permissible), 'Should identify permissible positions');
  assert(Array.isArray(conflict.positions.impermissible), 'Should identify impermissible positions');
  assert(conflict.positions.permissible.includes('Materialism'), 'Materialism should be in permissible position');
  assert(conflict.positions.impermissible.includes('Spiritualism'), 'Spiritualism should be in impermissible position');
});

// ============================================================================
// STEP 2: DOMAIN WEIGHT TESTS
// ============================================================================

test('Should return correct weights for healthcare domain', () => {
  const weights = getDomainWeights('healthcare');

  assert(weights.Materialism >= 0.85, 'Materialism should be weighted highly in healthcare');
  assert(weights.Realism >= 0.85, 'Realism should be weighted highly in healthcare');
  assert(weights.Rationalism >= 0.80, 'Rationalism should be weighted highly in healthcare');
  assert(weights.Spiritualism <= 0.50, 'Spiritualism should be weighted lower in healthcare');
  assert(weights.Pneumatism <= 0.50, 'Pneumatism should be weighted lower in healthcare');
});

test('Should return correct weights for spiritual domain', () => {
  const weights = getDomainWeights('spiritual');

  assert(weights.Spiritualism >= 0.90, 'Spiritualism should be weighted highly in spiritual domain');
  assert(weights.Idealism >= 0.80, 'Idealism should be weighted highly in spiritual domain');
  assert(weights.Psychism >= 0.80, 'Psychism should be weighted highly in spiritual domain');
  assert(weights.Materialism <= 0.40, 'Materialism should be weighted lower in spiritual domain');
  assert(weights.Sensationalism <= 0.40, 'Sensationalism should be weighted lower in spiritual domain');
});

test('Should return correct weights for environmental domain', () => {
  const weights = getDomainWeights('environmental');

  assert(weights.Pneumatism >= 0.90, 'Pneumatism should be weighted highly in environmental domain');
  assert(weights.Realism >= 0.80, 'Realism should be weighted highly in environmental domain');
  assert(weights.Rationalism >= 0.75, 'Rationalism should be weighted highly in environmental domain');
});

test('Should return correct weights for vocational domain', () => {
  const weights = getDomainWeights('vocational');

  assert(weights.Monadism >= 0.85, 'Monadism should be weighted highly in vocational domain');
  assert(weights.Dynamism >= 0.80, 'Dynamism should be weighted highly in vocational domain');
  assert(weights.Idealism >= 0.75, 'Idealism should be weighted highly in vocational domain');
});

test('Should return correct weights for intellectual domain', () => {
  const weights = getDomainWeights('intellectual');

  assert(weights.Rationalism >= 0.90, 'Rationalism should be weighted highly in intellectual domain');
  assert(weights.Realism >= 0.85, 'Realism should be weighted highly in intellectual domain');
  assert(weights.Mathematism >= 0.80, 'Mathematism should be weighted highly in intellectual domain');
});

test('Should return general weights for unknown domain', () => {
  const weights = getDomainWeights('unknown_domain');

  // General weights should be relatively balanced
  const values = Object.values(weights);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  assert(average > 0.55 && average < 0.70, 'General weights should be balanced around 0.60');
});

test('Should provide justification for domain weights', () => {
  const justification = getDomainWeightJustification('healthcare');

  assert(typeof justification === 'string', 'Justification should be a string');
  assert(justification.length > 50, 'Justification should be substantive');
  assert(justification.includes('Materialism') || justification.includes('physical'),
    'Healthcare justification should mention physical/material concerns');
});

// ============================================================================
// STEP 3: INTEGRATION TESTS
// ============================================================================

test('Should integrate judgments using domain weights', () => {
  const weights = getDomainWeights('healthcare');
  const integration = integrateJudgments(sampleEvaluations, weights);

  assert(integration.judgment, 'Should return integrated judgment');
  assert(['permissible', 'impermissible', 'uncertain'].includes(integration.judgment),
    'Judgment should be recognized category');
  assert(typeof integration.confidence === 'number', 'Should return confidence level');
  assert(integration.confidence >= 0 && integration.confidence <= 1,
    'Confidence should be between 0 and 1');
});

test('Healthcare domain should favor Materialism over Spiritualism', () => {
  const weights = getDomainWeights('healthcare');
  const integration = integrateJudgments(sampleEvaluations, weights);

  // With healthcare weights, Materialism (permissible) should be favored over Spiritualism (impermissible)
  assert.equal(integration.judgment, 'permissible',
    'Healthcare domain should favor Materialism judgment');
});

test('Spiritual domain should weight Spiritualism highly', () => {
  const weights = getDomainWeights('spiritual');
  const integration = integrateJudgments(sampleEvaluations, weights);

  // With spiritual weights, Spiritualism should be weighted highly (0.95)
  // But in our sample, 3 worldviews say permissible (Monadism 0.55, Materialism 0.30, Psychism 0.85 = 1.70 total)
  // vs 1 worldview impermissible (Spiritualism 0.95)
  // So permissible wins even in spiritual domain - this is correct behavior
  assert(weights.Spiritualism >= 0.90, 'Spiritualism should be weighted highly in spiritual domain');
  assert(weights.Spiritualism > weights.Materialism, 'Spiritualism should outweigh Materialism');

  // The majority still wins, but minority (Spiritualism) should be preserved
  const minorityViews = identifyMinorityViews(sampleEvaluations, integration);
  const spiritualismMinority = minorityViews.find(v => v.worldview === 'Spiritualism');
  assert(spiritualismMinority || integration.supportingWorldviews.includes('Spiritualism'),
    'Spiritualism perspective should be acknowledged');
});

test('Should preserve reasoning from all consulted worldviews', () => {
  const weights = getDomainWeights('healthcare');
  const integration = integrateJudgments(sampleEvaluations, weights);

  assert(Array.isArray(integration.contributingWorldviews),
    'Should track contributing worldviews');
  assert(integration.contributingWorldviews.length === sampleEvaluations.length,
    'Should include all evaluated worldviews');
});

// ============================================================================
// STEP 4: MINORITY VIEW TESTS
// ============================================================================

test('Should identify minority views', () => {
  const weights = getDomainWeights('healthcare');
  const integration = integrateJudgments(sampleEvaluations, weights);
  const minorityViews = identifyMinorityViews(sampleEvaluations, integration);

  assert(Array.isArray(minorityViews), 'Should return array of minority views');
  assert(minorityViews.length > 0, 'Should identify at least one minority view');
});

test('Minority views should include Spiritualism in healthcare domain', () => {
  const weights = getDomainWeights('healthcare');
  const integration = integrateJudgments(sampleEvaluations, weights);
  const minorityViews = identifyMinorityViews(sampleEvaluations, integration);

  const spiritualismMinority = minorityViews.find(v => v.worldview === 'Spiritualism');
  assert(spiritualismMinority, 'Spiritualism should be identified as minority in healthcare');
  assert(spiritualismMinority.reasoning, 'Minority view should preserve reasoning');
});

test('Minority views should include Spiritualism in spiritual domain', () => {
  const weights = getDomainWeights('spiritual');
  const integration = integrateJudgments(sampleEvaluations, weights);
  const minorityViews = identifyMinorityViews(sampleEvaluations, integration);

  // In our sample, permissible wins even in spiritual domain (weighted total: 1.70 vs 0.95)
  // So Spiritualism (impermissible) is the minority, not Materialism (permissible)
  const spiritualismMinority = minorityViews.find(v => v.worldview === 'Spiritualism');
  assert(spiritualismMinority, 'Spiritualism should be identified as minority (impermissible loses to weighted permissible majority)');
});

test('Should explain minority view reasoning fully', () => {
  const weights = getDomainWeights('healthcare');
  const integration = integrateJudgments(sampleEvaluations, weights);
  const minorityViews = identifyMinorityViews(sampleEvaluations, integration);

  minorityViews.forEach(view => {
    assert(view.reasoning, 'Each minority view should have reasoning');
    assert(view.reasoning.length > 10, 'Reasoning should be substantive');
  });
});

// ============================================================================
// STEP 5: CONFIDENCE ASSESSMENT TESTS
// ============================================================================

test('Should assess confidence based on worldview agreement', () => {
  const weights = getDomainWeights('healthcare');
  const confidence = assessConfidence(sampleEvaluations, weights);

  assert(typeof confidence.score === 'number', 'Should return confidence score');
  assert(confidence.score >= 0 && confidence.score <= 1, 'Confidence score should be 0-1');
  assert(typeof confidence.level === 'string', 'Should return confidence level label');
  assert(Array.isArray(confidence.uncertaintySources), 'Should identify uncertainty sources');
});

test('Should have lower confidence when worldviews deeply divided', () => {
  const weights = getDomainWeights('general'); // Balanced weights
  const confidence = assessConfidence(sampleEvaluations, weights);

  // With deep division (3 vs 1) and balanced weights, confidence should be moderate (0.75)
  // 3 permissible * 0.60 = 1.80, 1 impermissible * 0.60 = 0.60, total = 2.40, confidence = 1.80/2.40 = 0.75
  assert(confidence.score <= 0.75, 'Should have moderate confidence with 3:1 division and equal weights');
});

test('Should have higher confidence when worldviews mostly agree', () => {
  const agreeingEvaluations = [
    { worldview: 'Materialism', judgment: 'permissible', confidence: 0.85, reasoning: 'Test', values: [] },
    { worldview: 'Monadism', judgment: 'permissible', confidence: 0.80, reasoning: 'Test', values: [] },
    { worldview: 'Psychism', judgment: 'permissible', confidence: 0.75, reasoning: 'Test', values: [] },
    { worldview: 'Spiritualism', judgment: 'impermissible', confidence: 0.90, reasoning: 'Test', values: [] }
  ];

  const weights = getDomainWeights('healthcare'); // Materialism weighted highly
  const confidence = assessConfidence(agreeingEvaluations, weights);

  assert(confidence.score > 0.65, 'Should have higher confidence when weighted worldviews agree');
});

test('Should identify sources of uncertainty', () => {
  const weights = getDomainWeights('healthcare');
  const confidence = assessConfidence(sampleEvaluations, weights);

  assert(Array.isArray(confidence.uncertaintySources), 'Should return uncertainty sources array');
  assert(confidence.uncertaintySources.length > 0, 'Should identify at least one uncertainty source');
});

// ============================================================================
// STEP 6: JUSTIFICATION GENERATION TESTS
// ============================================================================

test('Should generate complete justification chain', () => {
  const weights = getDomainWeights('healthcare');
  const integration = integrateJudgments(sampleEvaluations, weights);
  const minorityViews = identifyMinorityViews(sampleEvaluations, integration);
  const confidence = assessConfidence(sampleEvaluations, weights);

  const resolution = {
    judgment: integration.judgment,
    confidence: confidence.level,
    minorityViews,
    integration,
    confidenceAssessment: confidence
  };

  const justification = generateJustification(resolution, sampleEvaluations, weights, 'healthcare');

  assert(typeof justification === 'string', 'Justification should be a string');
  assert(justification.length > 100, 'Justification should be comprehensive');
});

test('Justification should cite all worldviews consulted', () => {
  const weights = getDomainWeights('healthcare');
  const integration = integrateJudgments(sampleEvaluations, weights);
  const minorityViews = identifyMinorityViews(sampleEvaluations, integration);
  const confidence = assessConfidence(sampleEvaluations, weights);

  const resolution = {
    judgment: integration.judgment,
    confidence: confidence.level,
    minorityViews,
    integration,
    confidenceAssessment: confidence
  };

  const justification = generateJustification(resolution, sampleEvaluations, weights, 'healthcare');

  sampleEvaluations.forEach(evaluation => {
    assert(justification.includes(evaluation.worldview),
      `Justification should mention ${evaluation.worldview}`);
  });
});

test('Justification should explain domain weighting influence', () => {
  const weights = getDomainWeights('healthcare');
  const integration = integrateJudgments(sampleEvaluations, weights);
  const minorityViews = identifyMinorityViews(sampleEvaluations, integration);
  const confidence = assessConfidence(sampleEvaluations, weights);

  const resolution = {
    judgment: integration.judgment,
    confidence: confidence.level,
    minorityViews,
    integration,
    confidenceAssessment: confidence
  };

  const justification = generateJustification(resolution, sampleEvaluations, weights, 'healthcare');

  assert(justification.includes('healthcare') || justification.includes('domain'),
    'Justification should mention domain context');
});

test('Justification should acknowledge limitations and uncertainties', () => {
  const weights = getDomainWeights('healthcare');
  const integration = integrateJudgments(sampleEvaluations, weights);
  const minorityViews = identifyMinorityViews(sampleEvaluations, integration);
  const confidence = assessConfidence(sampleEvaluations, weights);

  const resolution = {
    judgment: integration.judgment,
    confidence: confidence.level,
    minorityViews,
    integration,
    confidenceAssessment: confidence
  };

  const justification = generateJustification(resolution, sampleEvaluations, weights, 'healthcare');

  // Should include epistemic humility markers
  const humilityMarkers = ['uncertainty', 'limitation', 'minority', 'however', 'although', 'nevertheless'];
  const hasHumility = humilityMarkers.some(marker =>
    justification.toLowerCase().includes(marker)
  );

  assert(hasHumility, 'Justification should acknowledge epistemic limitations');
});

// ============================================================================
// STEP 7: FULL 7-STEP PROCEDURE TESTS
// ============================================================================

test('Should apply 7-step procedure in correct order', () => {
  valueConflictResolver.actions.reset();
  valueConflictResolver.actions.setDomain('healthcare');

  const resolution = valueConflictResolver.actions.resolveConflict(sampleEvaluations, {
    scenarioId: 'test-scenario-1',
    description: 'End-of-life care decision'
  });

  assert(resolution, 'Should return resolution');
  assert(resolution.steps, 'Should track procedure steps');
  assert(resolution.steps.length === 7, 'Should execute all 7 steps');

  // Verify step order
  assert(resolution.steps[0].name === 'gather_perspectives', 'Step 1 should gather perspectives');
  assert(resolution.steps[1].name === 'identify_conflicts', 'Step 2 should identify conflicts');
  assert(resolution.steps[2].name === 'contextualize_domain', 'Step 3 should contextualize by domain');
  assert(resolution.steps[3].name === 'integrate_judgments', 'Step 4 should integrate judgments');
  assert(resolution.steps[4].name === 'acknowledge_minority', 'Step 5 should acknowledge minority views');
  assert(resolution.steps[5].name === 'generate_justification', 'Step 6 should generate justification');
  assert(resolution.steps[6].name === 'assess_confidence', 'Step 7 should assess confidence');
});

test('Should store resolution in history', () => {
  valueConflictResolver.actions.reset();
  valueConflictResolver.actions.setDomain('healthcare');

  const resolution = valueConflictResolver.actions.resolveConflict(sampleEvaluations, {
    scenarioId: 'test-scenario-2',
    description: 'Test scenario'
  });

  const history = valueConflictResolver.state.resolutionHistory;
  assert(history.length > 0, 'Should store resolution in history');
  assert(history[history.length - 1].scenarioId === 'test-scenario-2',
    'Should store correct scenario ID');
});

test('Should retrieve resolution by scenario ID', () => {
  valueConflictResolver.actions.reset();
  valueConflictResolver.actions.setDomain('healthcare');

  valueConflictResolver.actions.resolveConflict(sampleEvaluations, {
    scenarioId: 'test-scenario-3',
    description: 'Retrievable scenario'
  });

  const history = valueConflictResolver.actions.getResolutionHistory('test-scenario-3');
  assert(history.length > 0, 'Should retrieve resolution by scenario ID');
  assert(history[0].scenarioId === 'test-scenario-3', 'Should retrieve correct resolution');
});

test('Should explain resolution by ID', () => {
  valueConflictResolver.actions.reset();
  valueConflictResolver.actions.setDomain('healthcare');

  const resolution = valueConflictResolver.actions.resolveConflict(sampleEvaluations, {
    scenarioId: 'test-scenario-4',
    description: 'Explainable scenario'
  });

  const explanation = valueConflictResolver.actions.explainResolution(resolution.id);
  assert(explanation, 'Should return explanation');
  assert(typeof explanation === 'string', 'Explanation should be a string');
  assert(explanation.length > 50, 'Explanation should be substantive');
});

// ============================================================================
// EVENT SYSTEM TESTS
// ============================================================================

test('Should emit conflictDetected event when conflicts found', () => {
  valueConflictResolver.actions.reset();

  let eventEmitted = false;
  const unsubscribe = valueConflictResolver.events.on('conflictDetected', () => {
    eventEmitted = true;
  });

  valueConflictResolver.actions.setDomain('healthcare');
  valueConflictResolver.actions.resolveConflict(sampleEvaluations, {
    scenarioId: 'test-event-1'
  });

  assert(eventEmitted, 'Should emit conflictDetected event');
  unsubscribe();
});

test('Should emit resolutionGenerated event when integration complete', () => {
  valueConflictResolver.actions.reset();

  let eventEmitted = false;
  const unsubscribe = valueConflictResolver.events.on('resolutionGenerated', () => {
    eventEmitted = true;
  });

  valueConflictResolver.actions.setDomain('healthcare');
  valueConflictResolver.actions.resolveConflict(sampleEvaluations, {
    scenarioId: 'test-event-2'
  });

  assert(eventEmitted, 'Should emit resolutionGenerated event');
  unsubscribe();
});

test('Should emit minorityViewIdentified event when dissenting perspective found', () => {
  valueConflictResolver.actions.reset();

  let eventEmitted = false;
  const unsubscribe = valueConflictResolver.events.on('minorityViewIdentified', () => {
    eventEmitted = true;
  });

  valueConflictResolver.actions.setDomain('healthcare');
  valueConflictResolver.actions.resolveConflict(sampleEvaluations, {
    scenarioId: 'test-event-3'
  });

  assert(eventEmitted, 'Should emit minorityViewIdentified event');
  unsubscribe();
});

test('Should emit confidenceAssessed event with confidence calculation', () => {
  valueConflictResolver.actions.reset();

  let confidenceValue = null;
  const unsubscribe = valueConflictResolver.events.on('confidenceAssessed', (data) => {
    confidenceValue = data.confidence;
  });

  valueConflictResolver.actions.setDomain('healthcare');
  valueConflictResolver.actions.resolveConflict(sampleEvaluations, {
    scenarioId: 'test-event-4'
  });

  assert(confidenceValue !== null, 'Should emit confidenceAssessed event with data');
  assert(typeof confidenceValue === 'number', 'Confidence should be a number');
  unsubscribe();
});

test('Should emit domainSet event when domain changed', () => {
  valueConflictResolver.actions.reset();

  let eventEmitted = false;
  let newDomain = null;
  const unsubscribe = valueConflictResolver.events.on('domainSet', (data) => {
    eventEmitted = true;
    newDomain = data.domain;
  });

  valueConflictResolver.actions.setDomain('spiritual');

  assert(eventEmitted, 'Should emit domainSet event');
  assert.equal(newDomain, 'spiritual', 'Should emit correct domain');
  unsubscribe();
});

// ============================================================================
// STATE MANAGEMENT TESTS
// ============================================================================

test('Should update currentDomain when setDomain called', () => {
  valueConflictResolver.actions.reset();
  valueConflictResolver.actions.setDomain('vocational');

  assert.equal(valueConflictResolver.state.currentDomain, 'vocational',
    'Should update current domain');
});

test('Should update domainWeights when setDomain called', () => {
  valueConflictResolver.actions.reset();
  valueConflictResolver.actions.setDomain('environmental');

  const weights = valueConflictResolver.state.domainWeights;
  assert(weights.Pneumatism >= 0.90, 'Should update weights for environmental domain');
});

test('Should return current weights with getCurrentWeights', () => {
  valueConflictResolver.actions.reset();
  valueConflictResolver.actions.setDomain('intellectual');

  const weights = valueConflictResolver.actions.getCurrentWeights();
  assert(weights.Rationalism >= 0.90, 'Should return current domain weights');
  assert(weights.Mathematism >= 0.80, 'Should include Mathematism weight for intellectual domain');
});

test('Should reset state when reset called', () => {
  valueConflictResolver.actions.reset();
  valueConflictResolver.actions.setDomain('healthcare');
  valueConflictResolver.actions.resolveConflict(sampleEvaluations, { scenarioId: 'test-reset' });

  // State should have content
  assert(valueConflictResolver.state.resolutionHistory.length > 0, 'Should have history before reset');

  valueConflictResolver.actions.reset();

  // State should be cleared
  assert.equal(valueConflictResolver.state.currentResolution, null, 'Current resolution should be null');
  assert.equal(valueConflictResolver.state.resolutionHistory.length, 0, 'History should be empty');
  assert.equal(valueConflictResolver.state.currentDomain, 'general', 'Should reset to general domain');
});

console.log('\n✅ Integration Procedures Test Suite Complete\n');
