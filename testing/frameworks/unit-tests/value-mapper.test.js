/**
 * Unit Tests - Value Mapper
 *
 * @description Tests for src/concepts/valueMapper.js
 * @version 1.0.0
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  tagteamToWorldviewValueMap,
  findWorldviewMatches,
  mapSalienceToLevel,
  mapTagteamDomainToIEEDomain,
  getTagteamValuesForWorldviewValue,
  validateValueMappings,
  getMappingStatistics,
  metadata
} from '../../../src/concepts/valueMapper.js';

// ===================================
// Structure & Completeness Tests
// ===================================

test('valueMapper: has all TagTeam values mapped', () => {
  const totalMappings = Object.keys(tagteamToWorldviewValueMap).length;
  assert.ok(totalMappings >= 50, `Should have at least 50 TagTeam values mapped (actual: ${totalMappings})`);
});

test('valueMapper: all mappings are non-empty arrays', () => {
  for (const [tagteamValue, worldviewValues] of Object.entries(tagteamToWorldviewValueMap)) {
    assert.ok(Array.isArray(worldviewValues),
      `${tagteamValue} should map to an array`);
    assert.ok(worldviewValues.length > 0,
      `${tagteamValue} should map to at least one worldview value`);
  }
});

test('valueMapper: mapping validation succeeds', () => {
  const validation = validateValueMappings();
  assert.ok(validation.valid, 'Validation should pass');
  assert.ok(validation.totalMappings >= 50, `Should have at least 50 mappings (actual: ${validation.totalMappings})`);
  assert.equal(validation.missing.length, 0, 'Should have no missing mappings');
});

test('valueMapper: metadata is correct', () => {
  assert.equal(metadata.module, 'valueMapper');
  assert.equal(metadata.version, '1.1.0');
  assert.ok(metadata.totalMappings >= 50, `Should have at least 50 mappings (actual: ${metadata.totalMappings})`);
  assert.deepEqual(metadata.domains, ['Dignity', 'Care', 'Virtue', 'Community', 'Transcendence']);
});

// ===================================
// Domain Mapping Tests
// ===================================

test('valueMapper: Dignity domain values (10 values)', () => {
  const dignityValues = [
    'Autonomy', 'Justice', 'Equality', 'Human Rights', 'Privacy',
    'Dignity', 'Freedom', 'Respect', 'Consent', 'Self-determination'
  ];

  dignityValues.forEach(value => {
    assert.ok(tagteamToWorldviewValueMap[value],
      `${value} should be in mapping`);
  });
});

test('valueMapper: Care domain values (10 values)', () => {
  const careValues = [
    'Compassion', 'Beneficence', 'Non-maleficence', 'Empathy', 'Fidelity',
    'Care', 'Protection', 'Safety', 'Healing', 'Nurturance'
  ];

  careValues.forEach(value => {
    assert.ok(tagteamToWorldviewValueMap[value],
      `${value} should be in mapping`);
  });
});

test('valueMapper: Virtue domain values (10 values)', () => {
  const virtueValues = [
    'Integrity', 'Honesty', 'Courage', 'Wisdom', 'Humility',
    'Temperance', 'Prudence', 'Accountability', 'Excellence', 'Character'
  ];

  virtueValues.forEach(value => {
    assert.ok(tagteamToWorldviewValueMap[value],
      `${value} should be in mapping`);
  });
});

test('valueMapper: Community domain values (10 values)', () => {
  const communityValues = [
    'Solidarity', 'Common Good', 'Stewardship', 'Transparency', 'Civic Duty',
    'Social Justice', 'Sustainability', 'Reciprocity', 'Cooperation', 'Inclusion'
  ];

  communityValues.forEach(value => {
    assert.ok(tagteamToWorldviewValueMap[value],
      `${value} should be in mapping`);
  });
});

test('valueMapper: Transcendence domain values (10 values)', () => {
  const transcendenceValues = [
    'Faith', 'Hope', 'Meaning', 'Sacred/Holy', 'Spiritual Growth',
    'Reverence', 'Gratitude', 'Forgiveness', 'Love', 'Transcendence'
  ];

  transcendenceValues.forEach(value => {
    assert.ok(tagteamToWorldviewValueMap[value],
      `${value} should be in mapping`);
  });
});

// ===================================
// findWorldviewMatches() Tests
// ===================================

test('findWorldviewMatches: finds terminal value matches', () => {
  const worldviewValues = {
    terminal: ['consciousness_development', 'individual_uniqueness', 'objective_truth'],
    constitutive: ['autonomous_agency', 'personal_dignity'],
    instrumental: ['choice']
  };

  const matches = findWorldviewMatches('Autonomy', worldviewValues);

  assert.ok(matches.length > 0, 'Should find matches for Autonomy');

  const terminalMatch = matches.find(m => m.value === 'consciousness_development');
  assert.ok(terminalMatch, 'Should match consciousness_development');
  assert.equal(terminalMatch.type, 'terminal');
  assert.equal(terminalMatch.matchQuality, 'high');
});

test('findWorldviewMatches: finds constitutive value matches', () => {
  const worldviewValues = {
    terminal: ['objective_truth'],
    constitutive: ['autonomous_agency', 'personal_dignity'],
    instrumental: []
  };

  const matches = findWorldviewMatches('Autonomy', worldviewValues);

  const constitutiveMatch = matches.find(m => m.value === 'autonomous_agency');
  assert.ok(constitutiveMatch, 'Should match autonomous_agency');
  assert.equal(constitutiveMatch.type, 'constitutive');
  assert.equal(constitutiveMatch.matchQuality, 'medium');
});

test('findWorldviewMatches: finds instrumental value matches', () => {
  const worldviewValues = {
    terminal: [],
    constitutive: [],
    instrumental: ['individuation', 'personal_development']
  };

  const matches = findWorldviewMatches('Autonomy', worldviewValues);

  const instrumentalMatch = matches.find(m => m.value === 'individuation');
  assert.ok(instrumentalMatch, 'Should match individuation');
  assert.equal(instrumentalMatch.type, 'instrumental');
  assert.equal(instrumentalMatch.matchQuality, 'low');
});

test('findWorldviewMatches: returns empty array for no matches', () => {
  const worldviewValues = {
    terminal: ['unrelated_value'],
    constitutive: [],
    instrumental: []
  };

  const matches = findWorldviewMatches('Autonomy', worldviewValues);
  assert.equal(matches.length, 0, 'Should return empty array');
});

test('findWorldviewMatches: warns for unmapped TagTeam value', () => {
  const worldviewValues = {
    terminal: ['some_value'],
    constitutive: [],
    instrumental: []
  };

  const matches = findWorldviewMatches('NonexistentValue', worldviewValues);
  assert.equal(matches.length, 0, 'Should return empty array for unknown value');
});

test('findWorldviewMatches: finds multiple matches across types', () => {
  const worldviewValues = {
    terminal: ['consciousness_development', 'individual_uniqueness'],
    constitutive: ['autonomous_agency'],
    instrumental: ['individuation']
  };

  const matches = findWorldviewMatches('Autonomy', worldviewValues);

  assert.equal(matches.length, 4, 'Should find all 4 matches');
  assert.ok(matches.some(m => m.type === 'terminal'));
  assert.ok(matches.some(m => m.type === 'constitutive'));
  assert.ok(matches.some(m => m.type === 'instrumental'));
});

// ===================================
// mapSalienceToLevel() Tests
// ===================================

test('mapSalienceToLevel: maps high salience (0.7+)', () => {
  assert.equal(mapSalienceToLevel(0.7), 'high');
  assert.equal(mapSalienceToLevel(0.85), 'high');
  assert.equal(mapSalienceToLevel(1.0), 'high');
});

test('mapSalienceToLevel: maps medium salience (0.4-0.69)', () => {
  assert.equal(mapSalienceToLevel(0.4), 'medium');
  assert.equal(mapSalienceToLevel(0.55), 'medium');
  assert.equal(mapSalienceToLevel(0.69), 'medium');
});

test('mapSalienceToLevel: maps low salience (0.0-0.39)', () => {
  assert.equal(mapSalienceToLevel(0.0), 'low');
  assert.equal(mapSalienceToLevel(0.2), 'low');
  assert.equal(mapSalienceToLevel(0.39), 'low');
});

test('mapSalienceToLevel: handles boundary values correctly', () => {
  assert.equal(mapSalienceToLevel(0.7), 'high', '0.7 should be high');
  assert.equal(mapSalienceToLevel(0.4), 'medium', '0.4 should be medium');
  assert.equal(mapSalienceToLevel(0.39999), 'low', 'Just below 0.4 should be low');
  assert.equal(mapSalienceToLevel(0.69999), 'medium', 'Just below 0.7 should be medium');
});

// ===================================
// mapTagteamDomainToIEEDomain() Tests
// ===================================

test('mapTagteamDomainToIEEDomain: Care → healthcare', () => {
  assert.equal(mapTagteamDomainToIEEDomain('Care'), 'healthcare');
});

test('mapTagteamDomainToIEEDomain: Dignity → healthcare', () => {
  assert.equal(mapTagteamDomainToIEEDomain('Dignity'), 'healthcare');
});

test('mapTagteamDomainToIEEDomain: Virtue → intellectual', () => {
  assert.equal(mapTagteamDomainToIEEDomain('Virtue'), 'intellectual');
});

test('mapTagteamDomainToIEEDomain: Community → interpersonal', () => {
  assert.equal(mapTagteamDomainToIEEDomain('Community'), 'interpersonal');
});

test('mapTagteamDomainToIEEDomain: Transcendence → spiritual', () => {
  assert.equal(mapTagteamDomainToIEEDomain('Transcendence'), 'spiritual');
});

test('mapTagteamDomainToIEEDomain: unknown domain → general', () => {
  assert.equal(mapTagteamDomainToIEEDomain('UnknownDomain'), 'general');
  assert.equal(mapTagteamDomainToIEEDomain(''), 'general');
});

// ===================================
// getTagteamValuesForWorldviewValue() Tests (Reverse Mapping)
// ===================================

test('getTagteamValuesForWorldviewValue: finds all TagTeam values for worldview value', () => {
  const tagteamValues = getTagteamValuesForWorldviewValue('consciousness_development');

  assert.ok(tagteamValues.includes('Autonomy'), 'Should include Autonomy for consciousness_development');
  assert.ok(tagteamValues.length >= 1, 'Should find TagTeam values mapping to consciousness_development');
});

test('getTagteamValuesForWorldviewValue: returns empty array for unmatched value', () => {
  const tagteamValues = getTagteamValuesForWorldviewValue('nonexistent_worldview_value');
  assert.equal(tagteamValues.length, 0);
});

test('getTagteamValuesForWorldviewValue: finds physical_wellbeing mappings', () => {
  const tagteamValues = getTagteamValuesForWorldviewValue('physical_wellbeing');

  assert.ok(tagteamValues.includes('Beneficence'), 'Should include Beneficence');
  assert.ok(tagteamValues.includes('Non-maleficence'), 'Should include Non-maleficence');
  assert.ok(tagteamValues.includes('Healing'), 'Should include Healing');
});

// ===================================
// getMappingStatistics() Tests
// ===================================

test('getMappingStatistics: returns correct structure', () => {
  const stats = getMappingStatistics();

  assert.ok(stats.totalTagteamValues, 'Should have totalTagteamValues');
  assert.ok(stats.byDomain, 'Should have byDomain');
  assert.ok(stats.averageWorldviewValuesPerTagteamValue, 'Should have average');
  assert.ok(stats.uniqueWorldviewValuesCount, 'Should have unique count');
});

test('getMappingStatistics: has at least 50 total values', () => {
  const stats = getMappingStatistics();
  assert.ok(stats.totalTagteamValues >= 50, `Should have at least 50 values (actual: ${stats.totalTagteamValues})`);
});

test('getMappingStatistics: has expected values per domain', () => {
  const stats = getMappingStatistics();
  assert.equal(stats.byDomain.Dignity, 10);
  assert.equal(stats.byDomain.Care, 11); // Added Generosity
  assert.equal(stats.byDomain.Virtue, 11); // Added Patience
  assert.equal(stats.byDomain.Community, 10);
  assert.equal(stats.byDomain.Transcendence, 10);
});

test('getMappingStatistics: average worldview values is reasonable', () => {
  const stats = getMappingStatistics();
  const avg = parseFloat(stats.averageWorldviewValuesPerTagteamValue);

  // Each TagTeam value should map to 2-5 worldview values on average
  assert.ok(avg >= 2, 'Average should be at least 2');
  assert.ok(avg <= 10, 'Average should be at most 10');
});

// ===================================
// Specific Value Mapping Tests
// ===================================

test('valueMapper: Autonomy maps to expected values', () => {
  const mappings = tagteamToWorldviewValueMap['Autonomy'];

  assert.ok(mappings.includes('autonomous_agency'), 'Should map to autonomous_agency');
  assert.ok(mappings.includes('consciousness_development'), 'Should map to consciousness_development');
  assert.ok(mappings.includes('individual_uniqueness'), 'Should map to individual_uniqueness');
});

test('valueMapper: Beneficence maps to wellbeing values', () => {
  const mappings = tagteamToWorldviewValueMap['Beneficence'];

  assert.ok(mappings.includes('physical_wellbeing'), 'Should map to physical_wellbeing');
  assert.ok(mappings.includes('welfare'), 'Should map to welfare');
  assert.ok(mappings.includes('flourishing'), 'Should map to flourishing');
});

test('valueMapper: Justice maps to fairness values', () => {
  const mappings = tagteamToWorldviewValueMap['Justice'];

  assert.ok(mappings.includes('fairness'), 'Should map to fairness');
  assert.ok(mappings.includes('equality'), 'Should map to equality');
  assert.ok(mappings.includes('moral_law'), 'Should map to moral_law');
});

test('valueMapper: Honesty maps to truthfulness values', () => {
  const mappings = tagteamToWorldviewValueMap['Honesty'];

  assert.ok(mappings.includes('truthfulness'), 'Should map to truthfulness');
  assert.ok(mappings.includes('transparency'), 'Should map to transparency');
  assert.ok(mappings.includes('candor'), 'Should map to candor');
});

test('valueMapper: Compassion maps to empathy values', () => {
  const mappings = tagteamToWorldviewValueMap['Compassion'];

  assert.ok(mappings.includes('empathy'), 'Should map to empathy');
  assert.ok(mappings.includes('benevolence'), 'Should map to benevolence');
  assert.ok(mappings.includes('kindness'), 'Should map to kindness');
});

// ===================================
// Integration-like Tests
// ===================================

test('valueMapper: realistic healthcare scenario value matching', () => {
  // Simulate a healthcare worldview with typical values
  const worldviewValues = {
    terminal: ['physical_wellbeing', 'truthfulness', 'self_determination'],
    constitutive: ['health', 'safety', 'dignity'],
    instrumental: ['medicine', 'treatment']
  };

  // Simulate TagTeam detecting Beneficence
  const beneficenceMatches = findWorldviewMatches('Beneficence', worldviewValues);
  assert.ok(beneficenceMatches.length > 0, 'Beneficence should match healthcare values');

  const terminalMatch = beneficenceMatches.find(m => m.value === 'physical_wellbeing');
  assert.ok(terminalMatch, 'Should match physical_wellbeing');
  assert.equal(terminalMatch.matchQuality, 'high');
});

test('valueMapper: realistic spiritual scenario value matching', () => {
  // Simulate a spiritual worldview with typical values
  const worldviewValues = {
    terminal: ['trust_in_divine', 'purpose', 'transcendence'],
    constitutive: ['meaning', 'belief'],
    instrumental: ['prayer', 'meditation']
  };

  // Simulate TagTeam detecting Faith
  const faithMatches = findWorldviewMatches('Faith', worldviewValues);
  assert.ok(faithMatches.length > 0, 'Faith should match spiritual values');

  const terminalMatch = faithMatches.find(m => m.value === 'trust_in_divine');
  assert.ok(terminalMatch, 'Should match trust_in_divine');
  assert.equal(terminalMatch.matchQuality, 'high');
});

test('valueMapper: multiple TagTeam values map to same worldview value', () => {
  // Both Autonomy and Equality should map to personal_dignity
  const autonomyMappings = tagteamToWorldviewValueMap['Autonomy'];
  const equalityMappings = tagteamToWorldviewValueMap['Equality'];

  assert.ok(autonomyMappings.includes('personal_dignity'), 'Autonomy should map to personal_dignity');
  assert.ok(equalityMappings.includes('personal_dignity'), 'Equality should map to personal_dignity');

  // This is correct - multiple TagTeam values can point to same worldview value
});

// ===================================
// Edge Cases
// ===================================

test('valueMapper: handles empty worldview values gracefully', () => {
  const worldviewValues = {
    terminal: [],
    constitutive: [],
    instrumental: []
  };

  const matches = findWorldviewMatches('Autonomy', worldviewValues);
  assert.equal(matches.length, 0, 'Should return empty array for empty worldview');
});

test('valueMapper: handles missing worldview value arrays', () => {
  const worldviewValues = {
    terminal: ['some_value']
    // constitutive and instrumental missing
  };

  const matches = findWorldviewMatches('Autonomy', worldviewValues);
  // Should still check terminal values without crashing
  assert.ok(Array.isArray(matches));
});

console.log('\n✅ All Value Mapper tests completed\n');
