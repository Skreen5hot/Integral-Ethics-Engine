/**
 * Unit Tests - Domain Detection Enhancement
 *
 * @description Tests for detectDomain() with TagTeam integration
 * @version 1.0.0
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectDomain } from '../../../src/application/deliberationOrchestrator.js';

// ===================================
// Baseline Tests (Keyword-based)
// ===================================

test('detectDomain: healthcare keywords (baseline)', () => {
  const text = "A doctor provides medical treatment to a patient";
  const domain = detectDomain(text);
  assert.equal(domain, 'healthcare');
});

test('detectDomain: spiritual keywords (baseline)', () => {
  const text = "The person prays to God for guidance in their faith";
  const domain = detectDomain(text);
  assert.equal(domain, 'spiritual');
});

test('detectDomain: education keywords (baseline)', () => {
  const text = "The student studies for the exam at university";
  const domain = detectDomain(text);
  assert.equal(domain, 'education');
});

test('detectDomain: vocational keywords (baseline)', () => {
  const text = "The employee seeks a promotion at their workplace";
  const domain = detectDomain(text);
  assert.equal(domain, 'vocational');
});

test('detectDomain: environmental keywords (baseline)', () => {
  const text = "Conservation efforts protect the endangered species in the forest";
  const domain = detectDomain(text);
  assert.equal(domain, 'environmental');
});

test('detectDomain: interpersonal keywords (baseline)', () => {
  const text = "The couple works on trust in their relationship";
  const domain = detectDomain(text);
  assert.equal(domain, 'interpersonal');
});

test('detectDomain: intellectual keywords (baseline)', () => {
  const text = "The scientist conducts research and publishes data in a journal";
  const domain = detectDomain(text);
  assert.equal(domain, 'intellectual');
});

test('detectDomain: no clear domain (baseline)', () => {
  const text = "Something happens somewhere";
  const domain = detectDomain(text);
  assert.equal(domain, 'general');
});

test('detectDomain: empty string (baseline)', () => {
  const domain = detectDomain('');
  assert.equal(domain, 'general');
});

test('detectDomain: null input (baseline)', () => {
  const domain = detectDomain(null);
  assert.equal(domain, 'general');
});

// ===================================
// TagTeam Integration Tests
// ===================================

test('detectDomain: uses TagTeam Care → healthcare', () => {
  const text = "A doctor provides treatment";
  const tagteamResult = {
    ethicalProfile: {
      dominantDomain: 'Care'
    }
  };

  const domain = detectDomain(text, tagteamResult);
  assert.equal(domain, 'healthcare', 'Care domain should map to healthcare');
});

test('detectDomain: uses TagTeam Dignity → healthcare', () => {
  const text = "Patient autonomy in medical decisions";
  const tagteamResult = {
    ethicalProfile: {
      dominantDomain: 'Dignity'
    }
  };

  const domain = detectDomain(text, tagteamResult);
  assert.equal(domain, 'healthcare', 'Dignity domain should map to healthcare');
});

test('detectDomain: uses TagTeam Virtue → intellectual', () => {
  const text = "Developing character through study";
  const tagteamResult = {
    ethicalProfile: {
      dominantDomain: 'Virtue'
    }
  };

  const domain = detectDomain(text, tagteamResult);
  assert.equal(domain, 'intellectual', 'Virtue domain should map to intellectual');
});

test('detectDomain: uses TagTeam Community → interpersonal', () => {
  const text = "Building solidarity in the community";
  const tagteamResult = {
    ethicalProfile: {
      dominantDomain: 'Community'
    }
  };

  const domain = detectDomain(text, tagteamResult);
  assert.equal(domain, 'interpersonal', 'Community domain should map to interpersonal');
});

test('detectDomain: uses TagTeam Transcendence → spiritual', () => {
  const text = "Seeking meaning through faith";
  const tagteamResult = {
    ethicalProfile: {
      dominantDomain: 'Transcendence'
    }
  };

  const domain = detectDomain(text, tagteamResult);
  assert.equal(domain, 'spiritual', 'Transcendence domain should map to spiritual');
});

test('detectDomain: TagTeam takes priority over keywords', () => {
  // Text has medical keywords but TagTeam detects Community
  const text = "The doctor works with the community to promote health";
  const tagteamResult = {
    ethicalProfile: {
      dominantDomain: 'Community'
    }
  };

  const domain = detectDomain(text, tagteamResult);
  assert.equal(domain, 'interpersonal', 'TagTeam suggestion should override keyword matching');
});

// ===================================
// Fallback Tests
// ===================================

test('detectDomain: falls back to keywords when TagTeam unavailable', () => {
  const text = "A doctor provides medical treatment to a patient";
  const domain = detectDomain(text, null);
  assert.equal(domain, 'healthcare', 'Should use keyword matching when TagTeam null');
});

test('detectDomain: falls back to keywords when ethicalProfile missing', () => {
  const text = "A doctor provides medical treatment to a patient";
  const tagteamResult = {
    version: '2.0'
    // No ethicalProfile
  };

  const domain = detectDomain(text, tagteamResult);
  assert.equal(domain, 'healthcare', 'Should fall back to keywords when ethicalProfile missing');
});

test('detectDomain: falls back to keywords when dominantDomain missing', () => {
  const text = "A doctor provides medical treatment to a patient";
  const tagteamResult = {
    ethicalProfile: {
      values: []
      // No dominantDomain
    }
  };

  const domain = detectDomain(text, tagteamResult);
  assert.equal(domain, 'healthcare', 'Should fall back to keywords when dominantDomain missing');
});

test('detectDomain: falls back to keywords for unmapped TagTeam domain', () => {
  const text = "A doctor provides medical treatment to a patient";
  const tagteamResult = {
    ethicalProfile: {
      dominantDomain: 'UnknownDomain'  // Not in mapping
    }
  };

  const domain = detectDomain(text, tagteamResult);
  assert.equal(domain, 'healthcare', 'Should fall back to keywords for unmapped domain');
});

// ===================================
// Edge Cases
// ===================================

test('detectDomain: handles empty TagTeam result gracefully', () => {
  const text = "A doctor provides medical treatment to a patient";
  const tagteamResult = {};

  const domain = detectDomain(text, tagteamResult);
  assert.equal(domain, 'healthcare', 'Should handle empty TagTeam result');
});

test('detectDomain: handles malformed TagTeam result gracefully', () => {
  const text = "A doctor provides medical treatment to a patient";
  const tagteamResult = {
    ethicalProfile: null
  };

  const domain = detectDomain(text, tagteamResult);
  assert.equal(domain, 'healthcare', 'Should handle malformed TagTeam result');
});

// ===================================
// Real-world Integration Scenarios
// ===================================

test('Integration: healthcare scenario with TagTeam', () => {
  const text = "The family must decide whether to continue treatment for their unconscious father.";
  const tagteamResult = {
    version: '2.0',
    agent: { text: 'family', type: 'collective' },
    action: { verb: 'decide' },
    ethicalProfile: {
      values: [
        { name: 'Autonomy', salience: 0.6, polarity: 0 }
      ],
      dominantDomain: 'Dignity',
      confidence: 0.6
    }
  };

  const domain = detectDomain(text, tagteamResult);
  assert.equal(domain, 'healthcare', 'Dignity in medical context should map to healthcare');
});

test('Integration: spiritual scenario with TagTeam', () => {
  const text = "The person seeks meaning through prayer and faith.";
  const tagteamResult = {
    version: '2.0',
    ethicalProfile: {
      values: [
        { name: 'Faith', salience: 0.8, polarity: 1 },
        { name: 'Meaning', salience: 0.7, polarity: 1 }
      ],
      dominantDomain: 'Transcendence',
      confidence: 0.8
    }
  };

  const domain = detectDomain(text, tagteamResult);
  assert.equal(domain, 'spiritual', 'Transcendence should map to spiritual');
});

test('Integration: community scenario with TagTeam', () => {
  const text = "The group works together for the common good.";
  const tagteamResult = {
    version: '2.0',
    ethicalProfile: {
      values: [
        { name: 'Common Good', salience: 0.75, polarity: 1 },
        { name: 'Solidarity', salience: 0.65, polarity: 1 }
      ],
      dominantDomain: 'Community',
      confidence: 0.7
    }
  };

  const domain = detectDomain(text, tagteamResult);
  assert.equal(domain, 'interpersonal', 'Community should map to interpersonal');
});

console.log('\n✅ All Domain Detection tests completed\n');
