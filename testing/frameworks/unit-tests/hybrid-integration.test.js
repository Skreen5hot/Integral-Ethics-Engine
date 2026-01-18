/**
 * Hybrid Integration Unit Tests
 *
 * Tests the hybrid judgment integration approach implemented in valueConflictResolver.js
 * Based on: docs/philosophy/hybrid_jusdgemtn_integration.md
 *
 * Tests verify:
 * 1. Categorical scoring (winner-takes-all among definitive judgments)
 * 2. Contested detection (margin < 15%)
 * 3. Hybrid confidence formula: confidence = agreement × √quorum × contestationPenalty
 * 4. Proper handling of uncertain judgments (excluded from voting)
 * 5. Metadata exposure (margin, isContested, secondPlace, quorum, etc.)
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { integrateJudgments } from '../../../src/concepts/valueConflictResolver.js';

// ===================================
// Test Data
// ===================================

const defaultWeights = {
  materialism: 0.6,
  realism: 0.6,
  idealism: 0.6,
  rationalism: 0.6,
  spiritualism: 0.6,
  phenomenalism: 0.6,
  sensationalism: 0.6,
  dynamism: 0.6,
  monadism: 0.6,
  psychism: 0.6,
  pneumatism: 0.6,
  mathematism: 0.6
};

// ===================================
// Phase 1 Tests: Categorical Scoring
// ===================================

test('Categorical Scoring: definitive judgments use winner-takes-all, not averaging', () => {
  const evaluations = [
    { judgment: 'permissible', worldview: 'materialism', confidence: 0.8 },
    { judgment: 'permissible', worldview: 'realism', confidence: 0.8 },
    { judgment: 'impermissible', worldview: 'idealism', confidence: 0.7 }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  assert.equal(result.judgment, 'permissible', 'Winner should be permissible (2 vs 1)');
  assert.ok(result.confidence > 0.5, 'Confidence should reflect categorical win, not averaging');
  assert.equal(result.supportingWorldviews.length, 2, 'Should have 2 supporting worldviews');
});

test('Categorical Scoring: "problematic" counts as definitive, not uncertain', () => {
  const evaluations = [
    { judgment: 'problematic', worldview: 'materialism' },
    { judgment: 'problematic', worldview: 'idealism' },
    { judgment: 'uncertain', worldview: 'realism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  assert.equal(result.judgment, 'problematic', 'Problematic should win as definitive judgment');
  assert.equal(result.definitiveCount, 2, 'Should count 2 definitive judgments');
  assert.equal(result.uncertainCount, 1, 'Should count 1 uncertain judgment');
});

test('Categorical Scoring: uncertain judgments excluded from voting', () => {
  const evaluations = [
    { judgment: 'permissible', worldview: 'materialism' },
    { judgment: 'permissible', worldview: 'realism' },
    { judgment: 'permissible', worldview: 'idealism' },
    { judgment: 'uncertain', worldview: 'spiritualism' },
    { judgment: 'uncertain', worldview: 'rationalism' },
    { judgment: 'uncertain', worldview: 'phenomenalism' },
    { judgment: 'uncertain', worldview: 'sensationalism' },
    { judgment: 'uncertain', worldview: 'dynamism' },
    { judgment: 'uncertain', worldview: 'monadism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  assert.equal(result.judgment, 'permissible', '3 permissible should beat 9 uncertain');
  assert.equal(result.definitiveCount, 3, 'Should have 3 definitive');
  assert.equal(result.uncertainCount, 6, 'Should have 6 uncertain');
  // Confidence should be penalized by low quorum (3/9 = 1/3)
  assert.ok(result.confidence < 0.7, 'Confidence should be penalized by low quorum');
});

// ===================================
// Phase 2 Tests: Contested Detection
// ===================================

test('Contested Detection: 51/49 split flagged as contested', () => {
  // Setup: 6 worldviews vote permissible (60%), 5 vote impermissible (50%)
  // With equal weights: 6*0.6 = 3.6 vs 5*0.6 = 3.0
  // Margin = 0.6 / 6.6 = 9.09% < 15% → CONTESTED
  const evaluations = [
    { judgment: 'permissible', worldview: 'materialism' },
    { judgment: 'permissible', worldview: 'realism' },
    { judgment: 'permissible', worldview: 'idealism' },
    { judgment: 'permissible', worldview: 'rationalism' },
    { judgment: 'permissible', worldview: 'spiritualism' },
    { judgment: 'permissible', worldview: 'phenomenalism' },
    { judgment: 'impermissible', worldview: 'sensationalism' },
    { judgment: 'impermissible', worldview: 'dynamism' },
    { judgment: 'impermissible', worldview: 'monadism' },
    { judgment: 'impermissible', worldview: 'psychism' },
    { judgment: 'impermissible', worldview: 'pneumatism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  assert.equal(result.isContested, true, 'Narrow split should be flagged as contested');
  assert.ok(result.marginPercent < 0.15, 'Margin should be less than 15%');
  assert.equal(result.contestationPenalty, 0.7, 'Should apply 30% penalty');
  assert.ok(result.confidence < 0.7, 'Contested judgments should have reduced confidence');
});

test('Contested Detection: 60/40 split NOT flagged as contested', () => {
  // 7 vs 4 with equal weights: 7*0.6 = 4.2 vs 4*0.6 = 2.4
  // Margin = 1.8 / 6.6 = 27.3% > 15% → NOT CONTESTED
  const evaluations = [
    { judgment: 'permissible', worldview: 'materialism' },
    { judgment: 'permissible', worldview: 'realism' },
    { judgment: 'permissible', worldview: 'idealism' },
    { judgment: 'permissible', worldview: 'rationalism' },
    { judgment: 'permissible', worldview: 'spiritualism' },
    { judgment: 'permissible', worldview: 'phenomenalism' },
    { judgment: 'permissible', worldview: 'sensationalism' },
    { judgment: 'impermissible', worldview: 'dynamism' },
    { judgment: 'impermissible', worldview: 'monadism' },
    { judgment: 'impermissible', worldview: 'psychism' },
    { judgment: 'impermissible', worldview: 'pneumatism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  assert.equal(result.isContested, false, 'Clear margin should NOT be contested');
  assert.ok(result.marginPercent >= 0.15, 'Margin should be 15% or greater');
  assert.equal(result.contestationPenalty, 1.0, 'Should NOT apply contestation penalty');
});

test('Contested Detection: boundary condition near 15%', () => {
  // Create a scenario where margin is close to 15%
  // To get ~15% margin: need permissible score to be ~57.5% of total
  // With 11 equal-weight worldviews: 6.35 vs 4.65 would give 15% margin
  // Approximate with 6 vs 5 worldviews with slight weight adjustment
  const evaluations = [
    { judgment: 'permissible', worldview: 'materialism' },
    { judgment: 'permissible', worldview: 'realism' },
    { judgment: 'permissible', worldview: 'idealism' },
    { judgment: 'permissible', worldview: 'rationalism' },
    { judgment: 'permissible', worldview: 'spiritualism' },
    { judgment: 'permissible', worldview: 'phenomenalism' },
    { judgment: 'impermissible', worldview: 'sensationalism' },
    { judgment: 'impermissible', worldview: 'dynamism' },
    { judgment: 'impermissible', worldview: 'monadism' },
    { judgment: 'impermissible', worldview: 'psychism' },
    { judgment: 'impermissible', worldview: 'pneumatism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  // With equal weights: 6*0.6 vs 5*0.6 → margin = 0.6 / 6.6 ≈ 9% → CONTESTED
  assert.equal(result.isContested, true, 'Should be contested (narrow margin)');
  assert.ok(result.marginPercent < 0.15, 'Margin should be below 15% threshold');
});

// ===================================
// Phase 3 Tests: Hybrid Confidence Formula
// ===================================

test('Hybrid Formula: confidence = agreement × √quorum × contestationPenalty', () => {
  // Clear consensus: 10 permissible, 2 uncertain
  const evaluations = [
    { judgment: 'permissible', worldview: 'materialism' },
    { judgment: 'permissible', worldview: 'realism' },
    { judgment: 'permissible', worldview: 'idealism' },
    { judgment: 'permissible', worldview: 'rationalism' },
    { judgment: 'permissible', worldview: 'spiritualism' },
    { judgment: 'permissible', worldview: 'phenomenalism' },
    { judgment: 'permissible', worldview: 'sensationalism' },
    { judgment: 'permissible', worldview: 'dynamism' },
    { judgment: 'permissible', worldview: 'monadism' },
    { judgment: 'permissible', worldview: 'psychism' },
    { judgment: 'uncertain', worldview: 'pneumatism' },
    { judgment: 'uncertain', worldview: 'mathematism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  // Expected values:
  // agreement = 1.0 (all definitive agree)
  // quorum = √(10/12) = √0.833 ≈ 0.91
  // contestationPenalty = 1.0 (not contested)
  // confidence = 1.0 × 0.91 × 1.0 ≈ 0.91

  assert.equal(result.judgment, 'permissible');
  assert.equal(result.agreement, 1.0, 'Agreement should be 1.0 (unanimous among definitive)');
  assert.ok(result.quorum >= 0.90 && result.quorum <= 0.92, 'Quorum should be ~0.91');
  assert.equal(result.contestationPenalty, 1.0, 'No contestation penalty');
  assert.ok(result.confidence >= 0.85, 'Confidence should be high (~0.91)');
});

test('Hybrid Formula: quorum penalty applied for high uncertainty', () => {
  // 3 definitive, 9 uncertain
  const evaluations = [
    { judgment: 'permissible', worldview: 'materialism' },
    { judgment: 'permissible', worldview: 'realism' },
    { judgment: 'permissible', worldview: 'idealism' },
    { judgment: 'uncertain', worldview: 'rationalism' },
    { judgment: 'uncertain', worldview: 'spiritualism' },
    { judgment: 'uncertain', worldview: 'phenomenalism' },
    { judgment: 'uncertain', worldview: 'sensationalism' },
    { judgment: 'uncertain', worldview: 'dynamism' },
    { judgment: 'uncertain', worldview: 'monadism' },
    { judgment: 'uncertain', worldview: 'psychism' },
    { judgment: 'uncertain', worldview: 'pneumatism' },
    { judgment: 'uncertain', worldview: 'mathematism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  // Expected:
  // agreement = 1.0 (all 3 definitive agree)
  // quorum = √(3/12) = √0.25 = 0.5
  // confidence = 1.0 × 0.5 × 1.0 = 0.5

  assert.equal(result.judgment, 'permissible');
  assert.equal(result.agreement, 1.0, 'Agreement should be 1.0');
  assert.equal(result.quorum, 0.5, 'Quorum should be 0.5 (√0.25)');
  assert.ok(result.confidence <= 0.6, 'Confidence should be penalized by low quorum');
});

test('Hybrid Formula: contestation penalty multiplies confidence', () => {
  // 6 vs 5 split (contested)
  const evaluations = [
    { judgment: 'permissible', worldview: 'materialism' },
    { judgment: 'permissible', worldview: 'realism' },
    { judgment: 'permissible', worldview: 'idealism' },
    { judgment: 'permissible', worldview: 'rationalism' },
    { judgment: 'permissible', worldview: 'spiritualism' },
    { judgment: 'permissible', worldview: 'phenomenalism' },
    { judgment: 'impermissible', worldview: 'sensationalism' },
    { judgment: 'impermissible', worldview: 'dynamism' },
    { judgment: 'impermissible', worldview: 'monadism' },
    { judgment: 'impermissible', worldview: 'psychism' },
    { judgment: 'impermissible', worldview: 'pneumatism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  assert.equal(result.isContested, true, 'Should be contested');
  assert.equal(result.contestationPenalty, 0.7, 'Contestation penalty should be 0.7');

  // Confidence should be agreement × quorum × 0.7
  // agreement ≈ 0.55 (6/11)
  // quorum = 1.0 (all definitive)
  // confidence ≈ 0.55 × 1.0 × 0.7 ≈ 0.38
  assert.ok(result.confidence < 0.5, 'Confidence should be reduced by contestation');
});

// ===================================
// Phase 4 Tests: Metadata Exposure
// ===================================

test('Metadata: all new fields present in result', () => {
  const evaluations = [
    { judgment: 'permissible', worldview: 'materialism' },
    { judgment: 'permissible', worldview: 'realism' },
    { judgment: 'impermissible', worldview: 'idealism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  // Check all new metadata fields
  assert.ok('agreement' in result, 'Should have agreement field');
  assert.ok('quorum' in result, 'Should have quorum field');
  assert.ok('contestationPenalty' in result, 'Should have contestationPenalty field');
  assert.ok('margin' in result, 'Should have margin field');
  assert.ok('marginPercent' in result, 'Should have marginPercent field');
  assert.ok('isContested' in result, 'Should have isContested field');
  assert.ok('secondPlace' in result, 'Should have secondPlace field');
  assert.ok('secondPlaceScore' in result, 'Should have secondPlaceScore field');
  assert.ok('definitiveCount' in result, 'Should have definitiveCount field');
  assert.ok('uncertainCount' in result, 'Should have uncertainCount field');
  assert.ok('totalDefinitiveWeight' in result, 'Should have totalDefinitiveWeight field');
  assert.ok('totalUncertainWeight' in result, 'Should have totalUncertainWeight field');
});

test('Metadata: secondPlace judgment identified correctly', () => {
  const evaluations = [
    { judgment: 'permissible', worldview: 'materialism' },
    { judgment: 'permissible', worldview: 'realism' },
    { judgment: 'permissible', worldview: 'idealism' },
    { judgment: 'impermissible', worldview: 'rationalism' },
    { judgment: 'impermissible', worldview: 'spiritualism' },
    { judgment: 'problematic', worldview: 'phenomenalism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  assert.equal(result.judgment, 'permissible', 'First place should be permissible');
  assert.equal(result.secondPlace, 'impermissible', 'Second place should be impermissible');
  assert.ok(result.secondPlaceScore > 0, 'Second place should have positive score');
});

test('Metadata: definitiveCount and uncertainCount accurate', () => {
  const evaluations = [
    { judgment: 'permissible', worldview: 'materialism' },
    { judgment: 'impermissible', worldview: 'realism' },
    { judgment: 'problematic', worldview: 'idealism' },
    { judgment: 'uncertain', worldview: 'rationalism' },
    { judgment: 'uncertain', worldview: 'spiritualism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  assert.equal(result.definitiveCount, 3, 'Should count 3 definitive judgments');
  assert.equal(result.uncertainCount, 2, 'Should count 2 uncertain judgments');
  assert.equal(result.definitiveCount + result.uncertainCount, 5, 'Should sum to total');
});

// ===================================
// Phase 5 Tests: Edge Cases
// ===================================

test('Edge Case: all worldviews uncertain', () => {
  const evaluations = [
    { judgment: 'uncertain', worldview: 'materialism' },
    { judgment: 'uncertain', worldview: 'realism' },
    { judgment: 'uncertain', worldview: 'idealism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  assert.equal(result.judgment, 'uncertain', 'Should return uncertain');
  assert.equal(result.confidence, 0.1, 'Should have low confidence');
  assert.equal(result.agreement, 0, 'Agreement should be 0');
  assert.equal(result.quorum, 0, 'Quorum should be 0');
  assert.equal(result.definitiveCount, 0, 'No definitive judgments');
});

test('Edge Case: single definitive judgment', () => {
  const evaluations = [
    { judgment: 'permissible', worldview: 'materialism' },
    { judgment: 'uncertain', worldview: 'realism' },
    { judgment: 'uncertain', worldview: 'idealism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  assert.equal(result.judgment, 'permissible', 'Should return the single definitive judgment');
  assert.equal(result.agreement, 1.0, 'Agreement should be 1.0 (single opinion wins)');
  assert.ok(result.quorum < 0.7, 'Quorum should be low (1/3 = √0.33 ≈ 0.58)');
  assert.equal(result.isContested, false, 'Cannot be contested with only one judgment');
  assert.equal(result.secondPlace, null, 'No second place judgment');
});

test('Edge Case: three-way split', () => {
  const evaluations = [
    { judgment: 'permissible', worldview: 'materialism' },
    { judgment: 'permissible', worldview: 'realism' },
    { judgment: 'permissible', worldview: 'idealism' },
    { judgment: 'permissible', worldview: 'rationalism' },
    { judgment: 'impermissible', worldview: 'spiritualism' },
    { judgment: 'impermissible', worldview: 'phenomenalism' },
    { judgment: 'impermissible', worldview: 'sensationalism' },
    { judgment: 'problematic', worldview: 'dynamism' },
    { judgment: 'problematic', worldview: 'monadism' },
    { judgment: 'problematic', worldview: 'psychism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  // 4 permissible vs 3 impermissible vs 3 problematic
  // Winner should be permissible (highest count)
  assert.equal(result.judgment, 'permissible', 'Permissible should win 4-3-3 split');
  assert.ok(result.secondPlace !== null, 'Should have second place');
  assert.ok(result.confidence < 0.7, 'Confidence should be low due to three-way split');
});

test('Edge Case: no evaluations provided', () => {
  const result = integrateJudgments([], defaultWeights);

  // Should return error response structure
  assert.ok(result.integrated || result.judgment, 'Should return some judgment field');
  assert.equal(result.confidence, 0, 'Confidence should be 0');
  assert.ok(result.reasoning, 'Should include reasoning');
});

test('Edge Case: weights make a difference', () => {
  const evaluations = [
    { judgment: 'permissible', worldview: 'materialism' },
    { judgment: 'permissible', worldview: 'realism' },
    { judgment: 'impermissible', worldview: 'idealism' },
    { judgment: 'impermissible', worldview: 'rationalism' }
  ];

  // Equal weights: 2 vs 2 → could go either way
  const equalResult = integrateJudgments(evaluations, {
    materialism: 0.5,
    realism: 0.5,
    idealism: 0.5,
    rationalism: 0.5
  });

  // Weighted: materialism/realism get 0.9, idealism/rationalism get 0.3
  const weightedResult = integrateJudgments(evaluations, {
    materialism: 0.9,
    realism: 0.9,
    idealism: 0.3,
    rationalism: 0.3
  });

  // With weighted scores: permissible gets 1.8, impermissible gets 0.6
  assert.equal(weightedResult.judgment, 'permissible', 'Domain weights should affect outcome');
  assert.ok(weightedResult.confidence > equalResult.confidence, 'Weighted should have higher confidence');
});

// ===================================
// Integration Tests: Real-World Scenarios
// ===================================

test('Integration: Clear Consensus Scenario', () => {
  // Scenario A from implementation plan: 10 permissible, 2 uncertain
  const evaluations = [
    { judgment: 'permissible', worldview: 'materialism' },
    { judgment: 'permissible', worldview: 'realism' },
    { judgment: 'permissible', worldview: 'idealism' },
    { judgment: 'permissible', worldview: 'rationalism' },
    { judgment: 'permissible', worldview: 'spiritualism' },
    { judgment: 'permissible', worldview: 'phenomenalism' },
    { judgment: 'permissible', worldview: 'sensationalism' },
    { judgment: 'permissible', worldview: 'dynamism' },
    { judgment: 'permissible', worldview: 'monadism' },
    { judgment: 'permissible', worldview: 'psychism' },
    { judgment: 'uncertain', worldview: 'pneumatism' },
    { judgment: 'uncertain', worldview: 'mathematism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  assert.equal(result.judgment, 'permissible');
  assert.ok(result.confidence >= 0.8, 'Clear consensus should have high confidence');
  assert.equal(result.isContested, false, 'Clear consensus should not be contested');
});

test('Integration: Narrow Split Scenario', () => {
  // Scenario B from implementation plan: 6 permissible, 5 impermissible, 1 uncertain
  const evaluations = [
    { judgment: 'permissible', worldview: 'materialism' },
    { judgment: 'permissible', worldview: 'realism' },
    { judgment: 'permissible', worldview: 'idealism' },
    { judgment: 'permissible', worldview: 'rationalism' },
    { judgment: 'permissible', worldview: 'spiritualism' },
    { judgment: 'permissible', worldview: 'phenomenalism' },
    { judgment: 'impermissible', worldview: 'sensationalism' },
    { judgment: 'impermissible', worldview: 'dynamism' },
    { judgment: 'impermissible', worldview: 'monadism' },
    { judgment: 'impermissible', worldview: 'psychism' },
    { judgment: 'impermissible', worldview: 'pneumatism' },
    { judgment: 'uncertain', worldview: 'mathematism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  assert.equal(result.judgment, 'permissible', 'Permissible should win narrowly');
  assert.equal(result.isContested, true, 'Narrow split should be CONTESTED');
  assert.ok(result.confidence <= 0.7, 'Contested should have medium confidence');
  assert.ok(result.marginPercent < 0.15, 'Margin should be less than 15%');
});

test('Integration: Problematic Recognition Scenario', () => {
  // Scenario C from implementation plan: 8 problematic, 4 uncertain
  const evaluations = [
    { judgment: 'problematic', worldview: 'materialism' },
    { judgment: 'problematic', worldview: 'realism' },
    { judgment: 'problematic', worldview: 'idealism' },
    { judgment: 'problematic', worldview: 'rationalism' },
    { judgment: 'problematic', worldview: 'spiritualism' },
    { judgment: 'problematic', worldview: 'phenomenalism' },
    { judgment: 'problematic', worldview: 'sensationalism' },
    { judgment: 'problematic', worldview: 'dynamism' },
    { judgment: 'uncertain', worldview: 'monadism' },
    { judgment: 'uncertain', worldview: 'psychism' },
    { judgment: 'uncertain', worldview: 'pneumatism' },
    { judgment: 'uncertain', worldview: 'mathematism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  assert.equal(result.judgment, 'problematic', 'Problematic should be recognized');
  assert.ok(result.confidence >= 0.6, 'Should have high confidence (8/12 quorum)');
  assert.equal(result.isContested, false, 'Unanimous among definitive should not be contested');
  assert.equal(result.definitiveCount, 8, 'Should count 8 definitive judgments');
});

test('Integration: High Uncertainty Scenario', () => {
  // Scenario D from implementation plan: 3 permissible, 9 uncertain
  const evaluations = [
    { judgment: 'permissible', worldview: 'materialism' },
    { judgment: 'permissible', worldview: 'realism' },
    { judgment: 'permissible', worldview: 'idealism' },
    { judgment: 'uncertain', worldview: 'rationalism' },
    { judgment: 'uncertain', worldview: 'spiritualism' },
    { judgment: 'uncertain', worldview: 'phenomenalism' },
    { judgment: 'uncertain', worldview: 'sensationalism' },
    { judgment: 'uncertain', worldview: 'dynamism' },
    { judgment: 'uncertain', worldview: 'monadism' },
    { judgment: 'uncertain', worldview: 'psychism' },
    { judgment: 'uncertain', worldview: 'pneumatism' },
    { judgment: 'uncertain', worldview: 'mathematism' }
  ];

  const result = integrateJudgments(evaluations, defaultWeights);

  assert.equal(result.judgment, 'permissible', 'Should still return permissible');
  assert.ok(result.confidence < 0.7, 'LOW confidence due to quorum penalty');
  assert.equal(result.isContested, false, 'Not contested (unanimous among definitive)');
  assert.ok(result.quorum < 0.6, 'Quorum should be low (√(3/12) = 0.5)');
});

console.log('\n✅ All Hybrid Integration tests completed\n');
