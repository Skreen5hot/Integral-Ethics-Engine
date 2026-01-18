/**
 * Unit Tests for Deliberation Schemas
 *
 * Tests validation functions for:
 * - Scenario inputs
 * - Worldview evaluations
 * - Deliberation results
 * - Deliberation options
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateScenarioInput,
  validateWorldviewEvaluation,
  validateDeliberationResult,
  validateDeliberationOptions
} from '../../../../src/application/schemas/deliberation-schemas.js';

// ============================================================================
// SCENARIO INPUT VALIDATION
// ============================================================================

describe('validateScenarioInput', () => {
  it('should accept valid scenario with all fields', () => {
    const scenario = {
      id: 'scenario-123',
      description: 'A patient is on life support and must decide whether to continue treatment.',
      domain: 'healthcare',
      context: { age: 75, family: 'present' }
    };

    const result = validateScenarioInput(scenario);

    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });

  it('should accept valid scenario with only required fields', () => {
    const scenario = {
      description: 'A patient is on life support and must decide whether to continue treatment.'
    };

    const result = validateScenarioInput(scenario);

    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });

  it('should reject scenario without description', () => {
    const scenario = {
      context: { age: 75 }
    };

    const result = validateScenarioInput(scenario);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('description is required')));
  });

  it('should reject scenario with non-string description', () => {
    const scenario = {
      description: 12345
    };

    const result = validateScenarioInput(scenario);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('description must be a string')));
  });

  it('should reject scenario with too short description', () => {
    const scenario = {
      description: 'Too short'
    };

    const result = validateScenarioInput(scenario);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('at least 10 characters')));
  });

  it('should reject scenario with too long description', () => {
    const scenario = {
      description: 'x'.repeat(5001)
    };

    const result = validateScenarioInput(scenario);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('less than 5000 characters')));
  });

  it('should reject scenario with invalid domain', () => {
    const scenario = {
      description: 'A patient is on life support.',
      domain: 'invalid-domain'
    };

    const result = validateScenarioInput(scenario);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('Invalid domain')));
  });

  it('should accept all valid domains', () => {
    const validDomains = [
      'healthcare',
      'spiritual',
      'education',
      'vocational',
      'environmental',
      'interpersonal',
      'intellectual',
      'general'
    ];

    for (const domain of validDomains) {
      const scenario = {
        description: 'A scenario requiring ethical deliberation.',
        domain: domain
      };

      const result = validateScenarioInput(scenario);

      assert.equal(result.valid, true, `Domain "${domain}" should be valid`);
    }
  });

  it('should reject scenario with empty id', () => {
    const scenario = {
      id: '',
      description: 'A patient is on life support.'
    };

    const result = validateScenarioInput(scenario);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('id cannot be empty')));
  });

  it('should reject scenario with non-object context', () => {
    const scenario = {
      description: 'A patient is on life support.',
      context: 'not-an-object'
    };

    const result = validateScenarioInput(scenario);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('context must be an object')));
  });

  it('should reject scenario that is not an object', () => {
    const scenario = 'not-an-object';

    const result = validateScenarioInput(scenario);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('must be an object')));
  });

  it('should reject null scenario', () => {
    const result = validateScenarioInput(null);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('must be an object')));
  });
});

// ============================================================================
// WORLDVIEW EVALUATION VALIDATION
// ============================================================================

describe('validateWorldviewEvaluation', () => {
  it('should accept valid evaluation with all fields', () => {
    const evaluation = {
      worldview: 'materialism',
      judgment: 'permissible',
      confidence: 0.85,
      reasoning: 'Physical autonomy is paramount in healthcare decisions.',
      values: ['bodily_autonomy', 'minimize_suffering'],
      weight: 0.8
    };

    const result = validateWorldviewEvaluation(evaluation);

    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });

  it('should accept valid evaluation with only required fields', () => {
    const evaluation = {
      worldview: 'materialism',
      judgment: 'permissible',
      confidence: 0.85,
      reasoning: 'Physical autonomy is paramount in healthcare decisions.'
    };

    const result = validateWorldviewEvaluation(evaluation);

    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });

  it('should reject evaluation without worldview', () => {
    const evaluation = {
      judgment: 'permissible',
      confidence: 0.85,
      reasoning: 'Some reasoning here.'
    };

    const result = validateWorldviewEvaluation(evaluation);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('Worldview name is required')));
  });

  it('should reject evaluation with invalid worldview', () => {
    const evaluation = {
      worldview: 'InvalidWorldview',
      judgment: 'permissible',
      confidence: 0.85,
      reasoning: 'Some reasoning here.'
    };

    const result = validateWorldviewEvaluation(evaluation);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('Invalid worldview')));
  });

  it('should accept all valid worldviews', () => {
    const validWorldviews = [
      'materialism',
      'sensationalism',
      'phenomenalism',
      'realism',
      'dynamism',
      'monadism',
      'idealism',
      'rationalism',
      'psychism',
      'pneumatism',
      'spiritualism',
      'mathematism'
    ];

    for (const worldview of validWorldviews) {
      const evaluation = {
        worldview: worldview,
        judgment: 'permissible',
        confidence: 0.85,
        reasoning: 'Valid reasoning for this worldview.'
      };

      const result = validateWorldviewEvaluation(evaluation);

      assert.equal(result.valid, true, `Worldview "${worldview}" should be valid`);
    }
  });

  it('should reject evaluation with invalid judgment', () => {
    const evaluation = {
      worldview: 'materialism',
      judgment: 'maybe',
      confidence: 0.85,
      reasoning: 'Some reasoning here.'
    };

    const result = validateWorldviewEvaluation(evaluation);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('Invalid judgment')));
  });

  it('should accept all valid judgments', () => {
    const validJudgments = ['permissible', 'impermissible', 'uncertain'];

    for (const judgment of validJudgments) {
      const evaluation = {
        worldview: 'materialism',
        judgment: judgment,
        confidence: 0.85,
        reasoning: 'Valid reasoning for this judgment.'
      };

      const result = validateWorldviewEvaluation(evaluation);

      assert.equal(result.valid, true, `Judgment "${judgment}" should be valid`);
    }
  });

  it('should reject evaluation without confidence', () => {
    const evaluation = {
      worldview: 'materialism',
      judgment: 'permissible',
      reasoning: 'Some reasoning here.'
    };

    const result = validateWorldviewEvaluation(evaluation);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('Confidence is required')));
  });

  it('should reject evaluation with non-number confidence', () => {
    const evaluation = {
      worldview: 'materialism',
      judgment: 'permissible',
      confidence: '0.85',
      reasoning: 'Some reasoning here.'
    };

    const result = validateWorldviewEvaluation(evaluation);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('Confidence must be a number')));
  });

  it('should reject evaluation with confidence < 0', () => {
    const evaluation = {
      worldview: 'materialism',
      judgment: 'permissible',
      confidence: -0.1,
      reasoning: 'Some reasoning here.'
    };

    const result = validateWorldviewEvaluation(evaluation);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('between 0 and 1')));
  });

  it('should reject evaluation with confidence > 1', () => {
    const evaluation = {
      worldview: 'materialism',
      judgment: 'permissible',
      confidence: 1.1,
      reasoning: 'Some reasoning here.'
    };

    const result = validateWorldviewEvaluation(evaluation);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('between 0 and 1')));
  });

  it('should accept confidence at boundaries (0 and 1)', () => {
    const evaluation0 = {
      worldview: 'materialism',
      judgment: 'permissible',
      confidence: 0,
      reasoning: 'Some reasoning here.'
    };

    const evaluation1 = {
      worldview: 'materialism',
      judgment: 'permissible',
      confidence: 1,
      reasoning: 'Some reasoning here.'
    };

    assert.equal(validateWorldviewEvaluation(evaluation0).valid, true);
    assert.equal(validateWorldviewEvaluation(evaluation1).valid, true);
  });

  it('should reject evaluation with too short reasoning', () => {
    const evaluation = {
      worldview: 'materialism',
      judgment: 'permissible',
      confidence: 0.85,
      reasoning: 'Too short'
    };

    const result = validateWorldviewEvaluation(evaluation);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('at least 10 characters')));
  });

  it('should reject evaluation with non-array values', () => {
    const evaluation = {
      worldview: 'materialism',
      judgment: 'permissible',
      confidence: 0.85,
      reasoning: 'Some reasoning here.',
      values: 'not-an-array'
    };

    const result = validateWorldviewEvaluation(evaluation);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('Values must be an array')));
  });

  it('should reject evaluation with non-string values in array', () => {
    const evaluation = {
      worldview: 'materialism',
      judgment: 'permissible',
      confidence: 0.85,
      reasoning: 'Some reasoning here.',
      values: ['valid', 123, 'another']
    };

    const result = validateWorldviewEvaluation(evaluation);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('All values must be strings')));
  });

  it('should reject evaluation with invalid weight', () => {
    const evaluation = {
      worldview: 'materialism',
      judgment: 'permissible',
      confidence: 0.85,
      reasoning: 'Some reasoning here.',
      weight: 1.5
    };

    const result = validateWorldviewEvaluation(evaluation);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('Weight must be between 0 and 1')));
  });
});

// ============================================================================
// DELIBERATION RESULT VALIDATION
// ============================================================================

describe('validateDeliberationResult', () => {
  const validResult = {
    id: 'result-123',
    timestamp: '2024-01-01T12:00:00Z',
    scenario: {
      description: 'A patient is on life support.',
      domain: 'healthcare',
      context: { age: 75 }
    },
    domain: 'healthcare',
    judgment: 'permissible',
    confidence: 0.75,
    confidenceLevel: 'moderate',
    worldviews: [
      {
        worldview: 'materialism',
        judgment: 'permissible',
        confidence: 0.85,
        reasoning: 'Physical autonomy is paramount.',
        values: ['bodily_autonomy']
      }
    ],
    conflicts: [],
    minorityViews: [],
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
    metadata: {
      evaluationsCount: 1,
      conflictsCount: 0,
      minorityViewsCount: 0,
      completedAt: '2024-01-01T12:00:00Z'
    }
  };

  it('should accept valid deliberation result', () => {
    const result = validateDeliberationResult(validResult);

    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });

  it('should reject result missing required fields', () => {
    const requiredFields = [
      'id',
      'timestamp',
      'scenario',
      'domain',
      'judgment',
      'confidence',
      'confidenceLevel',
      'worldviews',
      'conflicts',
      'minorityViews',
      'supportingWorldviews',
      'justification',
      'steps',
      'metadata'
    ];

    for (const field of requiredFields) {
      const incompleteResult = { ...validResult };
      delete incompleteResult[field];

      const result = validateDeliberationResult(incompleteResult);

      assert.equal(result.valid, false, `Should reject when missing ${field}`);
      assert.ok(result.errors.some(err => err.includes(`Missing required field: ${field}`)));
    }
  });

  it('should reject result with invalid judgment', () => {
    const result = validateDeliberationResult({
      ...validResult,
      judgment: 'maybe'
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('Invalid judgment')));
  });

  it('should reject result with invalid confidence', () => {
    const result = validateDeliberationResult({
      ...validResult,
      confidence: 1.5
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('confidence must be between 0 and 1')));
  });

  it('should reject result with invalid confidenceLevel', () => {
    const result = validateDeliberationResult({
      ...validResult,
      confidenceLevel: 'very-high'
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('Invalid confidenceLevel')));
  });

  it('should accept all valid confidence levels', () => {
    const validLevels = ['low', 'moderate', 'high'];

    for (const level of validLevels) {
      const result = validateDeliberationResult({
        ...validResult,
        confidenceLevel: level
      });

      assert.equal(result.valid, true, `confidenceLevel "${level}" should be valid`);
    }
  });

  it('should reject result with invalid timestamp', () => {
    const result = validateDeliberationResult({
      ...validResult,
      timestamp: 'not-a-date'
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('timestamp must be a valid ISO 8601')));
  });

  it('should reject result with empty worldviews array', () => {
    const result = validateDeliberationResult({
      ...validResult,
      worldviews: []
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('worldviews array cannot be empty')));
  });

  it('should reject result with invalid worldview evaluation', () => {
    const result = validateDeliberationResult({
      ...validResult,
      worldviews: [
        {
          worldview: 'InvalidWorldview',
          judgment: 'permissible',
          confidence: 0.85,
          reasoning: 'Some reasoning.'
        }
      ]
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('Invalid worldview')));
  });

  it('should reject result with wrong number of steps', () => {
    const result = validateDeliberationResult({
      ...validResult,
      steps: ['gather_perspectives', 'identify_conflicts']
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('steps must contain exactly 7 steps')));
  });

  it('should reject result with invalid step names', () => {
    const result = validateDeliberationResult({
      ...validResult,
      steps: [
        'gather_perspectives',
        'identify_conflicts',
        'contextualize_domain',
        'integrate_judgments',
        'acknowledge_minority',
        'generate_justification',
        'invalid_step'
      ]
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('Invalid steps')));
  });

  it('should reject result with missing metadata fields', () => {
    const requiredMetadataFields = [
      'evaluationsCount',
      'conflictsCount',
      'minorityViewsCount',
      'completedAt'
    ];

    for (const field of requiredMetadataFields) {
      const incompleteMetadata = { ...validResult.metadata };
      delete incompleteMetadata[field];

      const result = validateDeliberationResult({
        ...validResult,
        metadata: incompleteMetadata
      });

      assert.equal(result.valid, false, `Should reject when metadata missing ${field}`);
      assert.ok(result.errors.some(err => err.includes(`metadata missing required field: ${field}`)));
    }
  });

  it('should reject result with non-number metadata counts', () => {
    const result = validateDeliberationResult({
      ...validResult,
      metadata: {
        ...validResult.metadata,
        evaluationsCount: '1'
      }
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('evaluationsCount must be a number')));
  });

  it('should reject result with invalid metadata.completedAt', () => {
    const result = validateDeliberationResult({
      ...validResult,
      metadata: {
        ...validResult.metadata,
        completedAt: 'invalid-date'
      }
    });

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('completedAt must be a valid ISO 8601')));
  });

  it('should reject non-object result', () => {
    const result = validateDeliberationResult('not-an-object');

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('must be an object')));
  });
});

// ============================================================================
// DELIBERATION OPTIONS VALIDATION
// ============================================================================

describe('validateDeliberationOptions', () => {
  it('should accept empty options', () => {
    const result = validateDeliberationOptions({});

    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });

  it('should accept null options', () => {
    const result = validateDeliberationOptions(null);

    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });

  it('should accept valid worldviews array', () => {
    const options = {
      worldviews: ['materialism', 'spiritualism']
    };

    const result = validateDeliberationOptions(options);

    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });

  it('should reject invalid worldview names', () => {
    const options = {
      worldviews: ['materialism', 'InvalidWorldview']
    };

    const result = validateDeliberationOptions(options);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('Invalid worldviews')));
  });

  it('should reject non-array worldviews', () => {
    const options = {
      worldviews: 'not-an-array'
    };

    const result = validateDeliberationOptions(options);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('worldviews must be an array')));
  });

  it('should accept valid customWeights', () => {
    const options = {
      customWeights: {
        'Materialism': 0.8,
        'Spiritualism': 0.6
      }
    };

    const result = validateDeliberationOptions(options);

    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });

  it('should reject non-object customWeights', () => {
    const options = {
      customWeights: 'not-an-object'
    };

    const result = validateDeliberationOptions(options);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('customWeights must be an object')));
  });

  it('should reject customWeights with non-number values', () => {
    const options = {
      customWeights: {
        'Materialism': '0.8'
      }
    };

    const result = validateDeliberationOptions(options);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('must be a number')));
  });

  it('should reject customWeights with out-of-range values', () => {
    const options = {
      customWeights: {
        'Materialism': 1.5
      }
    };

    const result = validateDeliberationOptions(options);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('between 0 and 1')));
  });

  it('should accept valid includeReasoning boolean', () => {
    const options1 = { includeReasoning: true };
    const options2 = { includeReasoning: false };

    assert.equal(validateDeliberationOptions(options1).valid, true);
    assert.equal(validateDeliberationOptions(options2).valid, true);
  });

  it('should reject non-boolean includeReasoning', () => {
    const options = {
      includeReasoning: 'yes'
    };

    const result = validateDeliberationOptions(options);

    assert.equal(result.valid, false);
    assert.ok(result.errors.some(err => err.includes('includeReasoning must be a boolean')));
  });

  it('should accept options with multiple valid fields', () => {
    const options = {
      worldviews: ['materialism', 'spiritualism'],
      customWeights: {
        'Materialism': 0.8
      },
      includeReasoning: true
    };

    const result = validateDeliberationOptions(options);

    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);
  });
});
