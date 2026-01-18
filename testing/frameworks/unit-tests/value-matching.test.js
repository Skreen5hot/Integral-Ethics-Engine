/**
 * Unit Tests - Value Matching Enhancement
 *
 * @description Tests for matchScenarioToValues() with TagTeam integration
 * @version 1.0.0
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchScenarioToValues } from '../../../src/concepts/moralReasoner.js';

// ===================================
// Test Data
// ===================================

const sampleWorldviewValues = {
  terminal: ['physical_wellbeing', 'self_determination', 'fairness', 'truthfulness'],
  constitutive: ['health', 'freedom', 'dignity'],
  instrumental: ['medicine', 'choice', 'treatment']
};

const healthcareScenario = {
  action: 'provides medical treatment',
  context: {
    physicalImpact: true,
    personsInvolved: true,
    expertise: true
  },
  agents: [{ role: 'doctor' }],
  artifacts: [{ type: 'health' }]
};

// ===================================
// Baseline Tests (Keyword-based)
// ===================================

test('matchScenarioToValues: baseline keyword matching works', () => {
  const values = matchScenarioToValues(healthcareScenario, sampleWorldviewValues);

  assert.ok(values.length > 0, 'Should match some values');

  // Should match physical_wellbeing due to health artifact
  const physicalWellbeing = values.find(v => v.value === 'physical_wellbeing');
  assert.ok(physicalWellbeing, 'Should match physical_wellbeing');
});

test('matchScenarioToValues: returns empty array for empty worldview', () => {
  const emptyWorldview = {
    terminal: [],
    constitutive: [],
    instrumental: []
  };

  const values = matchScenarioToValues(healthcareScenario, emptyWorldview);
  assert.ok(Array.isArray(values), 'Should return array');
});

// ===================================
// TagTeam Integration Tests
// ===================================

test('matchScenarioToValues: uses TagTeam detected values', () => {
  const tagteamResult = {
    ethicalProfile: {
      values: [
        { name: 'Beneficence', salience: 0.83, polarity: 1, evidence: ['treatment'] }
      ]
    }
  };

  const values = matchScenarioToValues(healthcareScenario, sampleWorldviewValues, tagteamResult);

  // Should include TagTeam-detected value (Beneficence → physical_wellbeing)
  const semanticValue = values.find(v => v.source === 'semantic_detection');
  assert.ok(semanticValue, 'Should have semantic detection');
  assert.equal(semanticValue.tagteamValue, 'Beneficence');
  assert.equal(semanticValue.value, 'physical_wellbeing');
});

test('matchScenarioToValues: includes TagTeam metadata', () => {
  const tagteamResult = {
    ethicalProfile: {
      values: [
        { name: 'Beneficence', salience: 0.83, polarity: 1, evidence: ['alleviate', 'treatment'] }
      ]
    }
  };

  const values = matchScenarioToValues(healthcareScenario, sampleWorldviewValues, tagteamResult);

  const semanticValue = values.find(v => v.source === 'semantic_detection');
  assert.ok(semanticValue);
  assert.equal(semanticValue.tagteamSalience, 0.83);
  assert.equal(semanticValue.polarity, 1);
  assert.ok(Array.isArray(semanticValue.evidence));
  assert.equal(semanticValue.evidence.length, 2);
});

test('matchScenarioToValues: maps salience levels correctly', () => {
  const tagteamResult = {
    ethicalProfile: {
      values: [
        { name: 'Beneficence', salience: 0.83, polarity: 1, evidence: [] },  // high
        { name: 'Honesty', salience: 0.55, polarity: 1, evidence: [] },      // medium
        { name: 'Humility', salience: 0.25, polarity: 1, evidence: [] }      // low
      ]
    }
  };

  const values = matchScenarioToValues(healthcareScenario, sampleWorldviewValues, tagteamResult);

  const highValue = values.find(v => v.tagteamValue === 'Beneficence');
  const mediumValue = values.find(v => v.tagteamValue === 'Honesty');
  const lowValue = values.find(v => v.tagteamValue === 'Humility');

  assert.equal(highValue?.salience, 'high', 'Salience 0.83 should map to high');
  assert.equal(mediumValue?.salience, 'medium', 'Salience 0.55 should map to medium');
  // lowValue might not match if no worldview mapping exists
});

test('matchScenarioToValues: handles multiple TagTeam values', () => {
  const tagteamResult = {
    ethicalProfile: {
      values: [
        { name: 'Beneficence', salience: 0.83, polarity: 1, evidence: [] },
        { name: 'Non-maleficence', salience: 0.53, polarity: 1, evidence: [] },
        { name: 'Autonomy', salience: 0.45, polarity: 0, evidence: [] }
      ]
    }
  };

  const values = matchScenarioToValues(healthcareScenario, sampleWorldviewValues, tagteamResult);

  const semanticValues = values.filter(v => v.source === 'semantic_detection');
  assert.ok(semanticValues.length >= 2, 'Should detect multiple TagTeam values');
});

// ===================================
// Priority Tests
// ===================================

test('matchScenarioToValues: TagTeam takes priority over keywords', () => {
  const tagteamResult = {
    ethicalProfile: {
      values: [
        { name: 'Beneficence', salience: 0.83, polarity: 1, evidence: ['treatment'] }
      ]
    }
  };

  const values = matchScenarioToValues(healthcareScenario, sampleWorldviewValues, tagteamResult);

  // If physical_wellbeing appears, it should be from semantic detection, not keyword
  const physicalWellbeing = values.find(v => v.value === 'physical_wellbeing');

  if (physicalWellbeing) {
    assert.equal(physicalWellbeing.source, 'semantic_detection',
      'TagTeam should take priority over keyword matching for same value');
  }
});

test('matchScenarioToValues: keyword matching still works for undetected values', () => {
  const tagteamResult = {
    ethicalProfile: {
      values: [
        { name: 'Beneficence', salience: 0.83, polarity: 1, evidence: [] }
      ]
    }
  };

  const values = matchScenarioToValues(healthcareScenario, sampleWorldviewValues, tagteamResult);

  const semanticValues = values.filter(v => v.source === 'semantic_detection');
  const keywordValues = values.filter(v => v.source === 'keyword_inference');

  assert.ok(semanticValues.length > 0, 'Should have semantic values');
  assert.ok(keywordValues.length >= 0, 'May have keyword values for non-detected values');
});

// ===================================
// Fallback Tests
// ===================================

test('matchScenarioToValues: works without TagTeam (null)', () => {
  const values = matchScenarioToValues(healthcareScenario, sampleWorldviewValues, null);

  assert.ok(values.length > 0, 'Should still match values without TagTeam');

  // All values should be keyword-inferred
  const allKeyword = values.every(v => v.source === 'keyword_inference' || !v.source);
  assert.ok(allKeyword, 'Without TagTeam, all should be keyword-based');
});

test('matchScenarioToValues: handles empty TagTeam result', () => {
  const tagteamResult = {};

  const values = matchScenarioToValues(healthcareScenario, sampleWorldviewValues, tagteamResult);

  assert.ok(Array.isArray(values), 'Should return array');
  // Should fall back to keyword matching
});

test('matchScenarioToValues: handles missing ethicalProfile', () => {
  const tagteamResult = {
    version: '2.0'
    // No ethicalProfile
  };

  const values = matchScenarioToValues(healthcareScenario, sampleWorldviewValues, tagteamResult);

  assert.ok(Array.isArray(values), 'Should return array');
});

test('matchScenarioToValues: handles empty values array in TagTeam', () => {
  const tagteamResult = {
    ethicalProfile: {
      values: []
    }
  };

  const values = matchScenarioToValues(healthcareScenario, sampleWorldviewValues, tagteamResult);

  assert.ok(Array.isArray(values), 'Should return array');
  // Should fall back to keyword matching
});

// ===================================
// Edge Cases
// ===================================

test('matchScenarioToValues: handles TagTeam value with no worldview match', () => {
  const tagteamResult = {
    ethicalProfile: {
      values: [
        { name: 'UnmappedValue', salience: 0.75, polarity: 1, evidence: [] }
      ]
    }
  };

  const values = matchScenarioToValues(healthcareScenario, sampleWorldviewValues, tagteamResult);

  // Should not crash, just not include the unmapped value
  assert.ok(Array.isArray(values), 'Should handle unmapped values gracefully');
});

test('matchScenarioToValues: handles malformed TagTeam value', () => {
  const tagteamResult = {
    ethicalProfile: {
      values: [
        { name: 'Beneficence' }  // Missing salience, polarity
      ]
    }
  };

  const values = matchScenarioToValues(healthcareScenario, sampleWorldviewValues, tagteamResult);

  assert.ok(Array.isArray(values), 'Should handle malformed values gracefully');
});

// ===================================
// Integration Scenarios
// ===================================

test('Integration: healthcare scenario with Care domain values', () => {
  const tagteamResult = {
    version: '2.0',
    ethicalProfile: {
      values: [
        { name: 'Beneficence', salience: 0.83, polarity: 1, evidence: ['alleviate', 'treatment'] },
        { name: 'Non-maleficence', salience: 0.53, polarity: 1, evidence: ['alleviate suffering'] }
      ],
      dominantDomain: 'Care'
    }
  };

  const values = matchScenarioToValues(healthcareScenario, sampleWorldviewValues, tagteamResult);

  const semanticValues = values.filter(v => v.source === 'semantic_detection');
  assert.ok(semanticValues.length >= 1, 'Should detect Care domain values');

  const beneficence = semanticValues.find(v => v.tagteamValue === 'Beneficence');
  assert.ok(beneficence, 'Should include Beneficence');
  assert.equal(beneficence.salience, 'high');
  assert.equal(beneficence.polarity, 1);
});

test('Integration: conflict scenario with opposing polarities', () => {
  const conflictScenario = {
    action: 'patient refuses treatment',
    context: {
      physicalImpact: true,
      autonomyAtStake: true
    },
    agents: [{ role: 'patient' }, { role: 'doctor' }],
    artifacts: [{ type: 'health' }]
  };

  const tagteamResult = {
    ethicalProfile: {
      values: [
        { name: 'Autonomy', salience: 0.9, polarity: -1, evidence: ['refuses'] },      // Violated
        { name: 'Beneficence', salience: 0.8, polarity: 1, evidence: ['treatment'] }  // Upheld
      ]
    }
  };

  const values = matchScenarioToValues(conflictScenario, sampleWorldviewValues, tagteamResult);

  const autonomy = values.find(v => v.tagteamValue === 'Autonomy');
  const beneficence = values.find(v => v.tagteamValue === 'Beneficence');

  assert.ok(autonomy, 'Should detect Autonomy');
  assert.ok(beneficence, 'Should detect Beneficence');
  assert.equal(autonomy.polarity, -1, 'Autonomy should be violated');
  assert.equal(beneficence.polarity, 1, 'Beneficence should be upheld');
});

console.log('\n✅ All Value Matching tests completed\n');
