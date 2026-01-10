/**
 * Domain Contextualization Test Suite
 *
 * Tests domain-specific weighting and contextualization logic for
 * the value conflict resolution framework.
 *
 * Phase 2.5: Value Conflict Resolution
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  getDomainWeights,
  getDomainWeightJustification
} from '../src/concepts/valueConflictResolver.js';

// ============================================================================
// DOMAIN WEIGHT APPROPRIATENESS TESTS
// ============================================================================

test('Healthcare domain should prioritize physical wellbeing worldviews', () => {
  const weights = getDomainWeights('healthcare');

  // High weights for empirical/physical worldviews
  assert(weights.Materialism >= 0.85, 'Materialism should be weighted highly');
  assert(weights.Realism >= 0.85, 'Realism should be weighted highly');
  assert(weights.Rationalism >= 0.80, 'Rationalism should be weighted highly');

  // Lower weights for non-empirical worldviews
  assert(weights.Spiritualism <= 0.50, 'Spiritualism should be weighted lower');
  assert(weights.Pneumatism <= 0.50, 'Pneumatism should be weighted lower');
});

test('Spiritual domain should prioritize transcendent worldviews', () => {
  const weights = getDomainWeights('spiritual');

  // High weights for spiritual/transcendent worldviews
  assert(weights.Spiritualism >= 0.90, 'Spiritualism should be weighted highly');
  assert(weights.Idealism >= 0.80, 'Idealism should be weighted highly');
  assert(weights.Psychism >= 0.80, 'Psychism should be weighted highly');

  // Lower weights for material worldviews
  assert(weights.Materialism <= 0.40, 'Materialism should be weighted lower');
  assert(weights.Sensationalism <= 0.40, 'Sensationalism should be weighted lower');
});

test('Education domain should prioritize consciousness development', () => {
  const weights = getDomainWeights('education');

  // High weights for developmental worldviews
  assert(weights.Idealism >= 0.85, 'Idealism should be weighted highly');
  assert(weights.Rationalism >= 0.80, 'Rationalism should be weighted highly');
  assert(weights.Dynamism >= 0.75, 'Dynamism should be weighted highly');

  // Lower weights for purely sensory worldviews
  assert(weights.Sensationalism <= 0.50, 'Sensationalism should be weighted lower');
});

test('Vocational domain should prioritize individual uniqueness', () => {
  const weights = getDomainWeights('vocational');

  // High weights for individual-focused worldviews
  assert(weights.Monadism >= 0.85, 'Monadism should be weighted highly');
  assert(weights.Dynamism >= 0.80, 'Dynamism should be weighted highly');
  assert(weights.Idealism >= 0.75, 'Idealism should be weighted highly');
});

test('Environmental domain should prioritize ecological worldviews', () => {
  const weights = getDomainWeights('environmental');

  // High weights for nature-oriented worldviews
  assert(weights.Pneumatism >= 0.90, 'Pneumatism (ensouled nature) should be weighted highly');
  assert(weights.Realism >= 0.80, 'Realism (objective ecology) should be weighted highly');
  assert(weights.Rationalism >= 0.75, 'Rationalism (systematic analysis) should be weighted highly');
});

test('Interpersonal domain should prioritize relational worldviews', () => {
  const weights = getDomainWeights('interpersonal');

  // High weights for person-oriented worldviews
  assert(weights.Monadism >= 0.85, 'Monadism (individual dignity) should be weighted highly');
  assert(weights.Psychism >= 0.80, 'Psychism (emotional authenticity) should be weighted highly');
  assert(weights.Idealism >= 0.75, 'Idealism (meaning-making) should be weighted highly');

  // Lower weights for impersonal worldviews
  assert(weights.Materialism <= 0.50, 'Materialism should be weighted lower');
  assert(weights.Mathematism <= 0.40, 'Mathematism should be weighted lower');
});

test('Intellectual domain should prioritize rational/formal worldviews', () => {
  const weights = getDomainWeights('intellectual');

  // High weights for rational worldviews
  assert(weights.Rationalism >= 0.90, 'Rationalism should be weighted highly');
  assert(weights.Realism >= 0.85, 'Realism should be weighted highly');
  assert(weights.Mathematism >= 0.80, 'Mathematism should be weighted highly');

  // Lower weights for non-rational worldviews
  assert(weights.Spiritualism <= 0.50, 'Spiritualism should be weighted lower');
  assert(weights.Psychism <= 0.50, 'Psychism should be weighted lower');
});

test('General domain should provide balanced weights', () => {
  const weights = getDomainWeights('general');

  const values = Object.values(weights);
  const average = values.reduce((a, b) => a + b, 0) / values.length;

  // All should be equal (with floating point tolerance)
  assert(Math.abs(average - 0.60) < 0.001, 'Average weight should be 0.60');

  // All worldviews should have same weight
  values.forEach(weight => {
    assert.equal(weight, 0.60, 'All worldviews should have equal weight in general domain');
  });
});

// ============================================================================
// CROSS-DOMAIN CONSISTENCY TESTS
// ============================================================================

test('Same worldview should have different weights in different domains', () => {
  const healthcareWeights = getDomainWeights('healthcare');
  const spiritualWeights = getDomainWeights('spiritual');

  // Materialism should be high in healthcare, low in spiritual
  assert(healthcareWeights.Materialism > spiritualWeights.Materialism,
    'Materialism should be weighted higher in healthcare than spiritual');

  // Spiritualism should be high in spiritual, low in healthcare
  assert(spiritualWeights.Spiritualism > healthcareWeights.Spiritualism,
    'Spiritualism should be weighted higher in spiritual than healthcare');
});

test('Domain weights should sum to meaningful total', () => {
  const domains = ['healthcare', 'spiritual', 'education', 'vocational', 'environmental', 'interpersonal', 'intellectual'];

  domains.forEach(domain => {
    const weights = getDomainWeights(domain);
    const total = Object.values(weights).reduce((a, b) => a + b, 0);

    // Total weight should be reasonable (not all 0, not all 1)
    assert(total > 5, `Total weight for ${domain} should be > 5`);
    assert(total < 12, `Total weight for ${domain} should be < 12`);
  });
});

test('Each domain should have at least 3 high-weighted worldviews', () => {
  const domains = ['healthcare', 'spiritual', 'education', 'vocational', 'environmental', 'interpersonal', 'intellectual'];

  domains.forEach(domain => {
    const weights = getDomainWeights(domain);
    const highWeightCount = Object.values(weights).filter(w => w >= 0.75).length;

    assert(highWeightCount >= 3,
      `${domain} should have at least 3 worldviews weighted >= 0.75 (has ${highWeightCount})`);
  });
});

test('No domain should have all worldviews weighted equally', () => {
  const domains = ['healthcare', 'spiritual', 'education', 'vocational', 'environmental', 'interpersonal', 'intellectual'];

  domains.forEach(domain => {
    const weights = getDomainWeights(domain);
    const uniqueWeights = new Set(Object.values(weights));

    assert(uniqueWeights.size > 1,
      `${domain} should have varied weights (not all equal)`);
  });
});

// ============================================================================
// MINORITY VIEW PRESERVATION TESTS
// ============================================================================

test('No worldview should ever be weighted at 0', () => {
  const domains = ['healthcare', 'spiritual', 'education', 'vocational', 'environmental', 'interpersonal', 'intellectual', 'general'];

  domains.forEach(domain => {
    const weights = getDomainWeights(domain);

    Object.entries(weights).forEach(([worldview, weight]) => {
      assert(weight > 0,
        `${worldview} should have weight > 0 in ${domain} (has ${weight})`);
    });
  });
});

test('All worldviews should be included in every domain', () => {
  const expectedWorldviews = [
    'Materialism', 'Sensationalism', 'Phenomenalism', 'Realism',
    'Dynamism', 'Monadism', 'Idealism', 'Rationalism',
    'Psychism', 'Pneumatism', 'Spiritualism', 'Mathematism'
  ];

  const domains = ['healthcare', 'spiritual', 'education', 'vocational', 'environmental', 'interpersonal', 'intellectual', 'general'];

  domains.forEach(domain => {
    const weights = getDomainWeights(domain);
    const worldviews = Object.keys(weights);

    expectedWorldviews.forEach(expected => {
      assert(worldviews.includes(expected),
        `${domain} weights should include ${expected}`);
    });
  });
});

test('Minority worldviews should still have meaningful weight', () => {
  const healthcareWeights = getDomainWeights('healthcare');

  // Even Spiritualism (minority in healthcare) should have weight > 0.25
  assert(healthcareWeights.Spiritualism >= 0.25,
    'Minority worldviews should have weight >= 0.25');

  const spiritualWeights = getDomainWeights('spiritual');

  // Even Materialism (minority in spiritual) should have weight > 0.25
  assert(spiritualWeights.Materialism >= 0.25,
    'Minority worldviews should have weight >= 0.25');
});

// ============================================================================
// WEIGHTING TRANSPARENCY TESTS
// ============================================================================

test('Every domain should have justification', () => {
  const domains = ['healthcare', 'spiritual', 'education', 'vocational', 'environmental', 'interpersonal', 'intellectual'];

  domains.forEach(domain => {
    const justification = getDomainWeightJustification(domain);

    assert(justification, `${domain} should have justification`);
    assert(typeof justification === 'string', 'Justification should be a string');
    assert(justification.length > 50, 'Justification should be substantive (> 50 chars)');
  });
});

test('Healthcare justification should mention physical/material concerns', () => {
  const justification = getDomainWeightJustification('healthcare');

  const keywords = ['physical', 'health', 'empirical', 'material', 'medical', 'wellbeing'];
  const hasKeyword = keywords.some(keyword =>
    justification.toLowerCase().includes(keyword)
  );

  assert(hasKeyword, 'Healthcare justification should mention physical/material concerns');
});

test('Spiritual justification should mention transcendent concerns', () => {
  const justification = getDomainWeightJustification('spiritual');

  const keywords = ['spirit', 'transcendent', 'divine', 'sacred', 'meaning', 'consciousness'];
  const hasKeyword = keywords.some(keyword =>
    justification.toLowerCase().includes(keyword)
  );

  assert(hasKeyword, 'Spiritual justification should mention transcendent concerns');
});

test('Environmental justification should mention nature/ecology', () => {
  const justification = getDomainWeightJustification('environmental');

  const keywords = ['nature', 'ecological', 'environment', 'sustainability', 'ensouled'];
  const hasKeyword = keywords.some(keyword =>
    justification.toLowerCase().includes(keyword)
  );

  assert(hasKeyword, 'Environmental justification should mention nature/ecology');
});

test('General domain should explain balanced approach', () => {
  const justification = getDomainWeightJustification('general');

  const keywords = ['equal', 'balanced', 'no specific', 'all worldviews'];
  const hasKeyword = keywords.some(keyword =>
    justification.toLowerCase().includes(keyword)
  );

  assert(hasKeyword, 'General justification should explain balanced approach');
});

// ============================================================================
// DOMAIN OVERRIDE CAPABILITY TESTS
// ============================================================================

test('Unknown domain should default to general weights', () => {
  const unknownWeights = getDomainWeights('unknown_domain_12345');
  const generalWeights = getDomainWeights('general');

  assert.deepEqual(unknownWeights, generalWeights,
    'Unknown domain should return general weights');
});

test('Domain parameter should be case-sensitive', () => {
  const healthcareWeights = getDomainWeights('healthcare');
  const healthcareUpperWeights = getDomainWeights('HEALTHCARE');

  // HEALTHCARE should default to general, not healthcare
  assert.notDeepEqual(healthcareUpperWeights, healthcareWeights,
    'Domain names should be case-sensitive');
});

test('All 7 domain names should be recognized', () => {
  const recognizedDomains = ['healthcare', 'spiritual', 'education', 'vocational', 'environmental', 'interpersonal', 'intellectual'];

  recognizedDomains.forEach(domain => {
    const weights = getDomainWeights(domain);
    const generalWeights = getDomainWeights('general');

    assert.notDeepEqual(weights, generalWeights,
      `${domain} should have specialized weights (not general)`);
  });
});

// ============================================================================
// WEIGHT VALUE RANGE TESTS
// ============================================================================

test('All weights should be between 0 and 1', () => {
  const domains = ['healthcare', 'spiritual', 'education', 'vocational', 'environmental', 'interpersonal', 'intellectual', 'general'];

  domains.forEach(domain => {
    const weights = getDomainWeights(domain);

    Object.entries(weights).forEach(([worldview, weight]) => {
      assert(weight >= 0 && weight <= 1,
        `${worldview} weight in ${domain} should be 0-1 (is ${weight})`);
    });
  });
});

test('Each domain should have variety in weights (not all same)', () => {
  const domains = ['healthcare', 'spiritual', 'education', 'vocational', 'environmental', 'interpersonal', 'intellectual'];

  domains.forEach(domain => {
    const weights = getDomainWeights(domain);
    const values = Object.values(weights);
    const min = Math.min(...values);
    const max = Math.max(...values);

    assert(max - min >= 0.30,
      `${domain} should have weight range >= 0.30 (has ${max - min})`);
  });
});

console.log('\n✅ Domain Contextualization Test Suite Complete\n');
