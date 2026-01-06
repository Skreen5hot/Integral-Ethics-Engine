/**
 * Deliberation API Schemas
 *
 * Defines input/output schemas and validation functions for the
 * deliberation application layer.
 *
 * Schemas:
 * - ScenarioInput: User-provided scenario for deliberation
 * - DeliberationResult: Complete deliberation outcome
 * - WorldviewEvaluation: Single worldview's ethical assessment
 * - DeliberationOptions: Configuration options for deliberation
 */

// ============================================================================
// SCHEMA DEFINITIONS
// ============================================================================

/**
 * Scenario Input Schema
 *
 * Required:
 * - description: String describing the ethical scenario
 *
 * Optional:
 * - id: Unique identifier for the scenario
 * - domain: Pre-specified domain (healthcare, spiritual, etc.)
 * - context: Additional context metadata
 */
export const ScenarioInputSchema = {
  type: 'object',
  required: ['description'],
  properties: {
    id: {
      type: 'string',
      minLength: 1
    },
    description: {
      type: 'string',
      minLength: 10,
      maxLength: 5000
    },
    domain: {
      type: 'string',
      enum: [
        'healthcare',
        'spiritual',
        'education',
        'vocational',
        'environmental',
        'interpersonal',
        'intellectual',
        'general'
      ]
    },
    context: {
      type: 'object'
    }
  }
};

/**
 * Worldview Evaluation Schema
 *
 * Structure of a single worldview's ethical assessment
 */
export const WorldviewEvaluationSchema = {
  type: 'object',
  required: ['worldview', 'judgment', 'confidence', 'reasoning'],
  properties: {
    worldview: {
      type: 'string',
      enum: [
        'Materialism',
        'Sensationalism',
        'Phenomenalism',
        'Realism',
        'Dynamism',
        'Monadism',
        'Idealism',
        'Rationalism',
        'Psychism',
        'Pneumatism',
        'Spiritualism',
        'Mathematism'
      ]
    },
    judgment: {
      type: 'string',
      enum: ['permissible', 'impermissible', 'uncertain']
    },
    confidence: {
      type: 'number',
      minimum: 0,
      maximum: 1
    },
    reasoning: {
      type: 'string',
      minLength: 10
    },
    values: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    weight: {
      type: 'number',
      minimum: 0,
      maximum: 1
    }
  }
};

/**
 * Deliberation Result Schema
 *
 * Complete output structure from deliberation process
 */
export const DeliberationResultSchema = {
  type: 'object',
  required: [
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
  ],
  properties: {
    id: {
      type: 'string',
      minLength: 1
    },
    timestamp: {
      type: 'string',
      format: 'date-time'
    },
    scenario: {
      type: 'object',
      required: ['description', 'domain'],
      properties: {
        description: {
          type: 'string',
          minLength: 1
        },
        domain: {
          type: 'string'
        },
        context: {
          type: 'object'
        }
      }
    },
    domain: {
      type: 'string'
    },
    judgment: {
      type: 'string',
      enum: ['permissible', 'impermissible', 'uncertain']
    },
    confidence: {
      type: 'number',
      minimum: 0,
      maximum: 1
    },
    confidenceLevel: {
      type: 'string',
      enum: ['low', 'moderate', 'high']
    },
    worldviews: {
      type: 'array',
      minItems: 1,
      items: WorldviewEvaluationSchema
    },
    conflicts: {
      type: 'array',
      items: {
        type: 'object'
      }
    },
    minorityViews: {
      type: 'array',
      items: {
        type: 'object'
      }
    },
    supportingWorldviews: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    justification: {
      type: 'string',
      minLength: 1
    },
    steps: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'gather_perspectives',
          'identify_conflicts',
          'contextualize_domain',
          'integrate_judgments',
          'acknowledge_minority',
          'generate_justification',
          'assess_confidence'
        ]
      },
      minItems: 7,
      maxItems: 7
    },
    metadata: {
      type: 'object',
      required: ['evaluationsCount', 'conflictsCount', 'minorityViewsCount', 'completedAt'],
      properties: {
        evaluationsCount: {
          type: 'number',
          minimum: 1
        },
        conflictsCount: {
          type: 'number',
          minimum: 0
        },
        minorityViewsCount: {
          type: 'number',
          minimum: 0
        },
        completedAt: {
          type: 'string',
          format: 'date-time'
        }
      }
    }
  }
};

/**
 * Deliberation Options Schema
 *
 * Configuration options for deliberation process
 */
export const DeliberationOptionsSchema = {
  type: 'object',
  properties: {
    worldviews: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    customWeights: {
      type: 'object',
      additionalProperties: {
        type: 'number',
        minimum: 0,
        maximum: 1
      }
    },
    includeReasoning: {
      type: 'boolean'
    }
  }
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate scenario input against schema
 * @param {Object} scenario - Scenario to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateScenarioInput(scenario) {
  const errors = [];

  // Check if scenario exists
  if (!scenario || typeof scenario !== 'object') {
    errors.push('Scenario must be an object');
    return { valid: false, errors };
  }

  // Required: description
  if (!scenario.description) {
    errors.push('Scenario description is required');
  } else if (typeof scenario.description !== 'string') {
    errors.push('Scenario description must be a string');
  } else if (scenario.description.length < 10) {
    errors.push('Scenario description must be at least 10 characters');
  } else if (scenario.description.length > 5000) {
    errors.push('Scenario description must be less than 5000 characters');
  }

  // Optional: id
  if (scenario.id !== undefined) {
    if (typeof scenario.id !== 'string') {
      errors.push('Scenario id must be a string');
    } else if (scenario.id.length === 0) {
      errors.push('Scenario id cannot be empty');
    }
  }

  // Optional: domain
  if (scenario.domain !== undefined) {
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

    if (!validDomains.includes(scenario.domain)) {
      errors.push(`Invalid domain: ${scenario.domain}. Must be one of: ${validDomains.join(', ')}`);
    }
  }

  // Optional: context
  if (scenario.context !== undefined) {
    if (typeof scenario.context !== 'object' || Array.isArray(scenario.context)) {
      errors.push('Scenario context must be an object');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate worldview evaluation against schema
 * @param {Object} evaluation - Evaluation to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateWorldviewEvaluation(evaluation) {
  const errors = [];

  if (!evaluation || typeof evaluation !== 'object') {
    errors.push('Evaluation must be an object');
    return { valid: false, errors };
  }

  // Required: worldview
  const validWorldviews = [
    'Materialism',
    'Sensationalism',
    'Phenomenalism',
    'Realism',
    'Dynamism',
    'Monadism',
    'Idealism',
    'Rationalism',
    'Psychism',
    'Pneumatism',
    'Spiritualism',
    'Mathematism'
  ];

  if (!evaluation.worldview) {
    errors.push('Worldview name is required');
  } else if (!validWorldviews.includes(evaluation.worldview)) {
    errors.push(`Invalid worldview: ${evaluation.worldview}`);
  }

  // Required: judgment
  const validJudgments = ['permissible', 'impermissible', 'uncertain'];
  if (!evaluation.judgment) {
    errors.push('Judgment is required');
  } else if (!validJudgments.includes(evaluation.judgment)) {
    errors.push(`Invalid judgment: ${evaluation.judgment}`);
  }

  // Required: confidence
  if (evaluation.confidence === undefined || evaluation.confidence === null) {
    errors.push('Confidence is required');
  } else if (typeof evaluation.confidence !== 'number') {
    errors.push('Confidence must be a number');
  } else if (evaluation.confidence < 0 || evaluation.confidence > 1) {
    errors.push('Confidence must be between 0 and 1');
  }

  // Required: reasoning
  if (!evaluation.reasoning) {
    errors.push('Reasoning is required');
  } else if (typeof evaluation.reasoning !== 'string') {
    errors.push('Reasoning must be a string');
  } else if (evaluation.reasoning.length < 10) {
    errors.push('Reasoning must be at least 10 characters');
  }

  // Optional: values
  if (evaluation.values !== undefined) {
    if (!Array.isArray(evaluation.values)) {
      errors.push('Values must be an array');
    } else if (!evaluation.values.every(v => typeof v === 'string')) {
      errors.push('All values must be strings');
    }
  }

  // Optional: weight
  if (evaluation.weight !== undefined) {
    if (typeof evaluation.weight !== 'number') {
      errors.push('Weight must be a number');
    } else if (evaluation.weight < 0 || evaluation.weight > 1) {
      errors.push('Weight must be between 0 and 1');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate deliberation result against schema
 * @param {Object} result - Result to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateDeliberationResult(result) {
  const errors = [];

  if (!result || typeof result !== 'object') {
    errors.push('Result must be an object');
    return { valid: false, errors };
  }

  // Required fields
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
    if (result[field] === undefined || result[field] === null) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate id
  if (result.id && typeof result.id !== 'string') {
    errors.push('id must be a string');
  }

  // Validate timestamp (ISO 8601 format)
  if (result.timestamp) {
    if (typeof result.timestamp !== 'string') {
      errors.push('timestamp must be a string');
    } else if (isNaN(Date.parse(result.timestamp))) {
      errors.push('timestamp must be a valid ISO 8601 date-time string');
    }
  }

  // Validate judgment
  const validJudgments = ['permissible', 'impermissible', 'uncertain'];
  if (result.judgment && !validJudgments.includes(result.judgment)) {
    errors.push(`Invalid judgment: ${result.judgment}`);
  }

  // Validate confidence
  if (result.confidence !== undefined) {
    if (typeof result.confidence !== 'number') {
      errors.push('confidence must be a number');
    } else if (result.confidence < 0 || result.confidence > 1) {
      errors.push('confidence must be between 0 and 1');
    }
  }

  // Validate confidenceLevel
  const validConfidenceLevels = ['low', 'moderate', 'high'];
  if (result.confidenceLevel && !validConfidenceLevels.includes(result.confidenceLevel)) {
    errors.push(`Invalid confidenceLevel: ${result.confidenceLevel}`);
  }

  // Validate worldviews array
  if (result.worldviews) {
    if (!Array.isArray(result.worldviews)) {
      errors.push('worldviews must be an array');
    } else if (result.worldviews.length === 0) {
      errors.push('worldviews array cannot be empty');
    } else {
      // Validate each worldview evaluation
      result.worldviews.forEach((wv, index) => {
        const wvValidation = validateWorldviewEvaluation(wv);
        if (!wvValidation.valid) {
          errors.push(`Worldview ${index}: ${wvValidation.errors.join(', ')}`);
        }
      });
    }
  }

  // Validate steps
  if (result.steps) {
    if (!Array.isArray(result.steps)) {
      errors.push('steps must be an array');
    } else if (result.steps.length !== 7) {
      errors.push('steps must contain exactly 7 steps');
    } else {
      const validSteps = [
        'gather_perspectives',
        'identify_conflicts',
        'contextualize_domain',
        'integrate_judgments',
        'acknowledge_minority',
        'generate_justification',
        'assess_confidence'
      ];

      const invalidSteps = result.steps.filter(step => !validSteps.includes(step));
      if (invalidSteps.length > 0) {
        errors.push(`Invalid steps: ${invalidSteps.join(', ')}`);
      }
    }
  }

  // Validate metadata
  if (result.metadata) {
    if (typeof result.metadata !== 'object') {
      errors.push('metadata must be an object');
    } else {
      const requiredMetadataFields = [
        'evaluationsCount',
        'conflictsCount',
        'minorityViewsCount',
        'completedAt'
      ];

      for (const field of requiredMetadataFields) {
        if (result.metadata[field] === undefined || result.metadata[field] === null) {
          errors.push(`metadata missing required field: ${field}`);
        }
      }

      // Validate counts are numbers
      if (result.metadata.evaluationsCount !== undefined && typeof result.metadata.evaluationsCount !== 'number') {
        errors.push('metadata.evaluationsCount must be a number');
      }
      if (result.metadata.conflictsCount !== undefined && typeof result.metadata.conflictsCount !== 'number') {
        errors.push('metadata.conflictsCount must be a number');
      }
      if (result.metadata.minorityViewsCount !== undefined && typeof result.metadata.minorityViewsCount !== 'number') {
        errors.push('metadata.minorityViewsCount must be a number');
      }

      // Validate completedAt is a valid date
      if (result.metadata.completedAt) {
        if (typeof result.metadata.completedAt !== 'string') {
          errors.push('metadata.completedAt must be a string');
        } else if (isNaN(Date.parse(result.metadata.completedAt))) {
          errors.push('metadata.completedAt must be a valid ISO 8601 date-time string');
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate deliberation options
 * @param {Object} options - Options to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateDeliberationOptions(options) {
  const errors = [];

  if (!options || typeof options !== 'object') {
    // Empty options are valid
    return { valid: true, errors: [] };
  }

  // Optional: worldviews
  if (options.worldviews !== undefined) {
    if (!Array.isArray(options.worldviews)) {
      errors.push('worldviews must be an array');
    } else {
      const validWorldviews = [
        'Materialism',
        'Sensationalism',
        'Phenomenalism',
        'Realism',
        'Dynamism',
        'Monadism',
        'Idealism',
        'Rationalism',
        'Psychism',
        'Pneumatism',
        'Spiritualism',
        'Mathematism'
      ];

      const invalidWorldviews = options.worldviews.filter(wv => !validWorldviews.includes(wv));
      if (invalidWorldviews.length > 0) {
        errors.push(`Invalid worldviews: ${invalidWorldviews.join(', ')}`);
      }
    }
  }

  // Optional: customWeights
  if (options.customWeights !== undefined) {
    if (typeof options.customWeights !== 'object' || Array.isArray(options.customWeights)) {
      errors.push('customWeights must be an object');
    } else {
      for (const [worldview, weight] of Object.entries(options.customWeights)) {
        if (typeof weight !== 'number') {
          errors.push(`customWeights.${worldview} must be a number`);
        } else if (weight < 0 || weight > 1) {
          errors.push(`customWeights.${worldview} must be between 0 and 1`);
        }
      }
    }
  }

  // Optional: includeReasoning
  if (options.includeReasoning !== undefined && typeof options.includeReasoning !== 'boolean') {
    errors.push('includeReasoning must be a boolean');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
