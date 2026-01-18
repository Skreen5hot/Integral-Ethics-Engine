/**
 * Unit Tests - Conflict Detection Enhancement
 *
 * @description Tests for detectConflicts() with TagTeam integration
 * @version 1.0.0
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectConflicts } from '../../../src/concepts/valueConflictResolver.js';

// ===================================
// Test Data
// ===================================

const sampleEvaluations = [
  {
    worldview: 'Materialism',
    judgment: 'permissible',
    reasoning: 'Physical wellbeing is promoted',
    relevantValues: ['physical_wellbeing']
  },
  {
    worldview: 'Idealism',
    judgment: 'permissible',
    reasoning: 'Conscious meaning-making is supported',
    relevantValues: ['meaning']
  },
  {
    worldview: 'Spiritualism',
    judgment: 'impermissible',
    reasoning: 'Violates sacred relationship',
    relevantValues: ['sacred_relationship']
  }
];

const agreementEvaluations = [
  {
    worldview: 'Materialism',
    judgment: 'permissible',
    reasoning: 'Physical wellbeing is promoted'
  },
  {
    worldview: 'Idealism',
    judgment: 'permissible',
    reasoning: 'Conscious meaning-making is supported'
  }
];

// ===================================
// Baseline Tests (IEE Worldview Conflicts)
// ===================================

test('detectConflicts: baseline worldview conflict detection', () => {
  const conflicts = detectConflicts(sampleEvaluations);

  assert.ok(conflicts.length > 0, 'Should detect conflicts');

  const judgmentConflict = conflicts.find(c => c.type === 'judgment');
  assert.ok(judgmentConflict, 'Should detect judgment conflict');
  assert.ok(judgmentConflict.positions, 'Should have positions');
  assert.ok(judgmentConflict.positions.permissible, 'Should have permissible position');
  assert.ok(judgmentConflict.positions.impermissible, 'Should have impermissible position');
});

test('detectConflicts: no conflicts when worldviews agree', () => {
  const conflicts = detectConflicts(agreementEvaluations);

  // Should have no IEE judgment conflicts
  const judgmentConflicts = conflicts.filter(c => c.type === 'judgment');
  assert.equal(judgmentConflicts.length, 0, 'Should have no judgment conflicts when worldviews agree');
});

test('detectConflicts: returns empty array for insufficient evaluations', () => {
  const conflicts = detectConflicts([]);
  assert.ok(Array.isArray(conflicts), 'Should return array');
  assert.equal(conflicts.length, 0, 'Should be empty for no evaluations');

  const singleConflicts = detectConflicts([sampleEvaluations[0]]);
  assert.equal(singleConflicts.length, 0, 'Should be empty for single evaluation');
});

test('detectConflicts: handles null/undefined evaluations', () => {
  const conflicts1 = detectConflicts(null);
  assert.ok(Array.isArray(conflicts1), 'Should return array for null');

  const conflicts2 = detectConflicts(undefined);
  assert.ok(Array.isArray(conflicts2), 'Should return array for undefined');
});

// ===================================
// TagTeam Integration Tests
// ===================================

test('detectConflicts: uses TagTeam value conflicts', () => {
  const tagteamResult = {
    valueConflicts: [
      {
        value1: 'Autonomy',
        value2: 'Beneficence',
        tension: 'high',
        description: 'Patient autonomy conflicts with medical beneficence'
      }
    ],
    conflictScore: 0.75,
    dominantDomain: 'Care'
  };

  const conflicts = detectConflicts(agreementEvaluations, tagteamResult);

  // Should include TagTeam value conflict
  const valueConflict = conflicts.find(c => c.type === 'value');
  assert.ok(valueConflict, 'Should detect TagTeam value conflict');
  assert.equal(valueConflict.source, 'semantic_detection');
  assert.equal(valueConflict.value1, 'Autonomy');
  assert.equal(valueConflict.value2, 'Beneficence');
  assert.equal(valueConflict.tension, 'high');
});

test('detectConflicts: includes TagTeam metadata in conflicts', () => {
  const tagteamResult = {
    valueConflicts: [
      {
        value1: 'Autonomy',
        value2: 'Beneficence',
        tension: 'high'
      }
    ],
    conflictScore: 0.75,
    dominantDomain: 'Care'
  };

  const conflicts = detectConflicts(agreementEvaluations, tagteamResult);

  const valueConflict = conflicts.find(c => c.type === 'value');
  assert.ok(valueConflict.tagteamMetadata, 'Should include TagTeam metadata');
  assert.equal(valueConflict.tagteamMetadata.conflictScore, 0.75);
  assert.equal(valueConflict.tagteamMetadata.dominantDomain, 'Care');
});

test('detectConflicts: handles multiple TagTeam value conflicts', () => {
  const tagteamResult = {
    valueConflicts: [
      { value1: 'Autonomy', value2: 'Beneficence', tension: 'high' },
      { value1: 'Justice', value2: 'Care', tension: 'medium' },
      { value1: 'Honesty', value2: 'Compassion', tension: 'low' }
    ],
    conflictScore: 0.6
  };

  const conflicts = detectConflicts(agreementEvaluations, tagteamResult);

  const valueConflicts = conflicts.filter(c => c.type === 'value');
  assert.equal(valueConflicts.length, 3, 'Should detect all TagTeam conflicts');
});

test('detectConflicts: handles TagTeam conflicts with evidence', () => {
  const tagteamResult = {
    valueConflicts: [
      {
        value1: 'Autonomy',
        value2: 'Beneficence',
        tension: 'high',
        evidence: ['patient refuses', 'doctor recommends'],
        description: 'Patient refuses beneficial treatment'
      }
    ]
  };

  const conflicts = detectConflicts([], tagteamResult);

  const valueConflict = conflicts.find(c => c.type === 'value');
  assert.ok(valueConflict, 'Should detect conflict even without evaluations');
  assert.ok(Array.isArray(valueConflict.evidence), 'Should include evidence');
  assert.equal(valueConflict.evidence.length, 2);
  assert.equal(valueConflict.description, 'Patient refuses beneficial treatment');
});

test('detectConflicts: uses severity if tension not provided', () => {
  const tagteamResult = {
    valueConflicts: [
      {
        value1: 'Autonomy',
        value2: 'Beneficence',
        severity: 'critical' // Use severity instead of tension
      }
    ]
  };

  const conflicts = detectConflicts([], tagteamResult);

  const valueConflict = conflicts.find(c => c.type === 'value');
  assert.equal(valueConflict.tension, 'critical', 'Should use severity if tension not provided');
});

test('detectConflicts: generates default description if missing', () => {
  const tagteamResult = {
    valueConflicts: [
      {
        value1: 'Autonomy',
        value2: 'Beneficence'
        // No description provided
      }
    ]
  };

  const conflicts = detectConflicts([], tagteamResult);

  const valueConflict = conflicts.find(c => c.type === 'value');
  assert.ok(valueConflict.description, 'Should have default description');
  assert.ok(valueConflict.description.includes('Autonomy'), 'Description should mention value1');
  assert.ok(valueConflict.description.includes('Beneficence'), 'Description should mention value2');
});

// ===================================
// Priority Tests
// ===================================

test('detectConflicts: TagTeam conflicts included even when worldviews agree', () => {
  const tagteamResult = {
    valueConflicts: [
      { value1: 'Autonomy', value2: 'Beneficence', tension: 'high' }
    ]
  };

  // All worldviews agree (no IEE judgment conflicts)
  const conflicts = detectConflicts(agreementEvaluations, tagteamResult);

  const valueConflicts = conflicts.filter(c => c.type === 'value');
  const judgmentConflicts = conflicts.filter(c => c.type === 'judgment');

  assert.equal(valueConflicts.length, 1, 'Should include TagTeam value conflicts');
  assert.equal(judgmentConflicts.length, 0, 'Should have no judgment conflicts');
});

test('detectConflicts: both TagTeam and IEE conflicts included', () => {
  const tagteamResult = {
    valueConflicts: [
      { value1: 'Autonomy', value2: 'Beneficence', tension: 'high' }
    ]
  };

  // Worldviews disagree (IEE judgment conflicts)
  const conflicts = detectConflicts(sampleEvaluations, tagteamResult);

  const valueConflicts = conflicts.filter(c => c.type === 'value');
  const judgmentConflicts = conflicts.filter(c => c.type === 'judgment');

  assert.ok(valueConflicts.length >= 1, 'Should include TagTeam value conflicts');
  assert.ok(judgmentConflicts.length >= 1, 'Should include IEE judgment conflicts');
  assert.ok(conflicts.length >= 2, 'Should include both types of conflicts');
});

test('detectConflicts: source field distinguishes conflict origins', () => {
  const tagteamResult = {
    valueConflicts: [
      { value1: 'Autonomy', value2: 'Beneficence', tension: 'high' }
    ]
  };

  const conflicts = detectConflicts(sampleEvaluations, tagteamResult);

  const valueConflict = conflicts.find(c => c.type === 'value');
  const judgmentConflict = conflicts.find(c => c.type === 'judgment');

  assert.equal(valueConflict.source, 'semantic_detection', 'TagTeam conflicts should have semantic_detection source');
  assert.equal(judgmentConflict.source, 'worldview_evaluation', 'IEE conflicts should have worldview_evaluation source');
});

// ===================================
// Fallback Tests
// ===================================

test('detectConflicts: works without TagTeam (null)', () => {
  const conflicts = detectConflicts(sampleEvaluations, null);

  assert.ok(conflicts.length > 0, 'Should detect IEE conflicts without TagTeam');

  // All conflicts should be IEE judgment conflicts
  const allFromIEE = conflicts.every(c => c.source === 'worldview_evaluation' || c.type === 'judgment');
  assert.ok(allFromIEE, 'All conflicts should be from IEE when TagTeam null');
});

test('detectConflicts: handles empty TagTeam result', () => {
  const tagteamResult = {};

  const conflicts = detectConflicts(sampleEvaluations, tagteamResult);

  assert.ok(Array.isArray(conflicts), 'Should return array');
  // Should fall back to IEE judgment conflicts
});

test('detectConflicts: handles missing valueConflicts array', () => {
  const tagteamResult = {
    version: '2.0',
    conflictScore: 0.5
    // No valueConflicts array
  };

  const conflicts = detectConflicts(sampleEvaluations, tagteamResult);

  assert.ok(Array.isArray(conflicts), 'Should return array');
  // Should only include IEE conflicts
});

test('detectConflicts: handles empty valueConflicts array', () => {
  const tagteamResult = {
    valueConflicts: []
  };

  const conflicts = detectConflicts(sampleEvaluations, tagteamResult);

  assert.ok(Array.isArray(conflicts), 'Should return array');
  // Should only include IEE conflicts
});

test('detectConflicts: handles malformed valueConflicts', () => {
  const tagteamResult = {
    valueConflicts: [
      { value1: 'Autonomy' } // Missing value2
    ]
  };

  const conflicts = detectConflicts(sampleEvaluations, tagteamResult);

  assert.ok(Array.isArray(conflicts), 'Should handle malformed conflicts gracefully');
  // Should still include IEE conflicts
});

// ===================================
// Edge Cases
// ===================================

test('detectConflicts: TagTeam conflicts without evaluations', () => {
  const tagteamResult = {
    valueConflicts: [
      { value1: 'Autonomy', value2: 'Beneficence', tension: 'high' }
    ]
  };

  const conflicts = detectConflicts([], tagteamResult);

  assert.equal(conflicts.length, 1, 'Should return TagTeam conflicts even without evaluations');
  assert.equal(conflicts[0].type, 'value');
});

test('detectConflicts: TagTeam conflicts with single evaluation', () => {
  const tagteamResult = {
    valueConflicts: [
      { value1: 'Autonomy', value2: 'Beneficence', tension: 'high' }
    ]
  };

  const conflicts = detectConflicts([sampleEvaluations[0]], tagteamResult);

  // Should include TagTeam value conflicts (no IEE judgment conflicts with single eval)
  const valueConflicts = conflicts.filter(c => c.type === 'value');
  assert.ok(valueConflicts.length >= 1, 'Should include TagTeam conflicts');
});

test('detectConflicts: handles conflictScore 0', () => {
  const tagteamResult = {
    valueConflicts: [
      { value1: 'Autonomy', value2: 'Beneficence', tension: 'low' }
    ],
    conflictScore: 0
  };

  const conflicts = detectConflicts([], tagteamResult);

  const valueConflict = conflicts.find(c => c.type === 'value');
  assert.equal(valueConflict.tagteamMetadata.conflictScore, 0, 'Should handle conflictScore of 0');
});

test('detectConflicts: handles missing conflictScore', () => {
  const tagteamResult = {
    valueConflicts: [
      { value1: 'Autonomy', value2: 'Beneficence', tension: 'high' }
    ]
    // No conflictScore
  };

  const conflicts = detectConflicts([], tagteamResult);

  const valueConflict = conflicts.find(c => c.type === 'value');
  assert.equal(valueConflict.tagteamMetadata.conflictScore, 0, 'Should default conflictScore to 0');
});

// ===================================
// Integration Scenarios
// ===================================

test('Integration: healthcare scenario with value conflict', () => {
  const tagteamResult = {
    version: '2.0',
    valueConflicts: [
      {
        value1: 'Autonomy',
        value2: 'Beneficence',
        tension: 'high',
        description: 'Patient autonomy conflicts with medical beneficence',
        evidence: ['patient refuses', 'doctor recommends']
      }
    ],
    conflictScore: 0.8,
    dominantDomain: 'Care'
  };

  const evaluations = [
    { worldview: 'Materialism', judgment: 'permissible', reasoning: 'Promotes health' },
    { worldview: 'Idealism', judgment: 'impermissible', reasoning: 'Violates autonomy' }
  ];

  const conflicts = detectConflicts(evaluations, tagteamResult);

  const valueConflicts = conflicts.filter(c => c.type === 'value');
  const judgmentConflicts = conflicts.filter(c => c.type === 'judgment');

  assert.ok(valueConflicts.length >= 1, 'Should detect TagTeam value conflicts');
  assert.ok(judgmentConflicts.length >= 1, 'Should detect IEE judgment conflicts');

  const autonomyConflict = valueConflicts.find(c => c.value1 === 'Autonomy');
  assert.ok(autonomyConflict, 'Should detect Autonomy vs Beneficence conflict');
  assert.equal(autonomyConflict.tension, 'high');
  assert.equal(autonomyConflict.tagteamMetadata.dominantDomain, 'Care');
});

test('Integration: conflict-free scenario with TagTeam', () => {
  const tagteamResult = {
    valueConflicts: [], // No conflicts detected
    conflictScore: 0,
    dominantDomain: 'Care'
  };

  const evaluations = [
    { worldview: 'Materialism', judgment: 'permissible', reasoning: 'Promotes health' },
    { worldview: 'Idealism', judgment: 'permissible', reasoning: 'Supports meaning' }
  ];

  const conflicts = detectConflicts(evaluations, tagteamResult);

  assert.equal(conflicts.length, 0, 'Should have no conflicts when neither TagTeam nor IEE detects any');
});

test('Integration: TagTeam detects conflicts IEE misses', () => {
  // Worldviews agree on judgment, but TagTeam detects underlying value tension
  const tagteamResult = {
    valueConflicts: [
      {
        value1: 'Justice',
        value2: 'Mercy',
        tension: 'medium',
        description: 'Justice requires punishment, mercy suggests leniency'
      }
    ],
    conflictScore: 0.5
  };

  const evaluations = [
    { worldview: 'Materialism', judgment: 'permissible', reasoning: 'Rational choice' },
    { worldview: 'Idealism', judgment: 'permissible', reasoning: 'Meaningful action' }
  ];

  const conflicts = detectConflicts(evaluations, tagteamResult);

  const valueConflicts = conflicts.filter(c => c.type === 'value');
  const judgmentConflicts = conflicts.filter(c => c.type === 'judgment');

  assert.equal(valueConflicts.length, 1, 'TagTeam should detect value conflict');
  assert.equal(judgmentConflicts.length, 0, 'IEE should detect no judgment conflict (agreement)');
});

console.log('\n✅ All Conflict Detection tests completed\n');
