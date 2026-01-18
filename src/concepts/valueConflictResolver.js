/**
 * Value Conflict Resolver Concept
 *
 * Implements the 7-step integration procedure for resolving value conflicts
 * across all 12 worldviews with domain-specific contextualization.
 *
 * Architecture: Concepts + Synchronizations pattern
 * - State: Current resolution, history, domain weights
 * - Actions: Resolve conflicts, set domain, explain resolutions
 * - Pure Utilities: Detect conflicts, integrate judgments, assess confidence
 * - Events: Transparency for integration process
 *
 * 7-Step Integration Procedure:
 * 1. Gather worldview perspectives
 * 2. Identify value conflicts
 * 3. Contextualize by domain
 * 4. Integrate perspectives
 * 5. Acknowledge minority views
 * 6. Generate justification chain
 * 7. Assess confidence
 *
 * Philosophical Commitments:
 * - No worldview systematically privileged across domains
 * - Minority perspectives always preserved and explained
 * - Integration makes conflicts visible, not hidden
 * - Epistemic humility maintained throughout
 * - User agency preserved (recommendations override-able)
 */

// ==================================================================
// PURE UTILITIES (No Side Effects)
// ==================================================================

/**
 * Detect conflicts between worldview evaluations
 * @param {Array} evaluations - Array of worldview evaluations
 * @param {Object} tagteamResult - Optional TagTeam semantic analysis result
 * @returns {Array} Detected conflicts
 */
export function detectConflicts(evaluations, tagteamResult = null) {
  const conflicts = [];

  // PRIORITY 1: Use TagTeam's pre-computed value conflicts if available
  if (tagteamResult?.valueConflicts && Array.isArray(tagteamResult.valueConflicts)) {
    for (const tagteamConflict of tagteamResult.valueConflicts) {
      conflicts.push({
        type: 'value',
        source: 'semantic_detection',
        value1: tagteamConflict.value1,
        value2: tagteamConflict.value2,
        tension: tagteamConflict.tension || tagteamConflict.severity || 'unknown',
        description: tagteamConflict.description || `Conflict between ${tagteamConflict.value1} and ${tagteamConflict.value2}`,
        evidence: tagteamConflict.evidence || [],
        tagteamMetadata: {
          conflictScore: tagteamResult.conflictScore || 0,
          dominantDomain: tagteamResult.dominantDomain
        }
      });
    }
  }

  // PRIORITY 2: IEE's worldview judgment conflicts
  if (!evaluations || evaluations.length < 2) {
    return conflicts; // Return TagTeam conflicts even if no evaluations
  }

  // Group evaluations by judgment
  const judgmentGroups = {};
  for (const evaluation of evaluations) {
    const normalizedJudgment = normalizeJudgment(evaluation.judgment);
    if (!judgmentGroups[normalizedJudgment]) {
      judgmentGroups[normalizedJudgment] = [];
    }
    judgmentGroups[normalizedJudgment].push(evaluation.worldview);
  }

  // If all worldviews agree, no IEE judgment conflicts
  if (Object.keys(judgmentGroups).length === 1) {
    return conflicts; // Return TagTeam conflicts even if worldviews agree
  }

  // Build conflict structure with positions
  const judgments = Object.keys(judgmentGroups);

  // Identify conflicting judgments
  if (judgments.length >= 2) {
    const worldviews = evaluations.map(e => e.worldview);
    const positions = {};

    for (const [judgment, worldviewList] of Object.entries(judgmentGroups)) {
      // Use lowercase for position keys
      positions[judgment.toLowerCase()] = worldviewList;
    }

    conflicts.push({
      type: 'judgment',
      source: 'worldview_evaluation',
      worldviews: worldviews,
      positions: positions,
      description: `Worldviews disagree on judgment: ${judgments.join(' vs ')}`
    });
  }

  return conflicts;
}

/**
 * Compare two worldview judgments for conflicts
 * @param {Object} eval1 - First evaluation
 * @param {Object} eval2 - Second evaluation
 * @returns {Object|null} Conflict object or null
 */
function compareJudgments(eval1, eval2) {
  const judgment1 = eval1.judgment.toLowerCase();
  const judgment2 = eval2.judgment.toLowerCase();

  // Detect opposing judgments
  const isConflict = (
    (judgment1.includes('permissible') && judgment2.includes('impermissible')) ||
    (judgment1.includes('obligatory') && judgment2.includes('forbidden')) ||
    (judgment1.includes('virtuous') && judgment2.includes('vicious')) ||
    (judgment1.includes('good') && judgment2.includes('bad')) ||
    (judgment1.includes('right') && judgment2.includes('wrong')) ||
    (judgment1.includes('acceptable') && judgment2.includes('unacceptable'))
  );

  if (isConflict) {
    return {
      worldview1: eval1.worldview,
      worldview2: eval2.worldview,
      judgment1: eval1.judgment,
      judgment2: eval2.judgment,
      type: classifyConflictType(eval1, eval2),
      reasoning1: eval1.reasoning || '',
      reasoning2: eval2.reasoning || ''
    };
  }

  return null;
}

/**
 * Classify the type of conflict
 * @param {Object} eval1 - First evaluation
 * @param {Object} eval2 - Second evaluation
 * @returns {string} Conflict type
 */
function classifyConflictType(eval1, eval2) {
  const values1 = eval1.relevantValues || [];
  const values2 = eval2.relevantValues || [];

  // Check if conflict is metaphysical (different foundations)
  if (hasMetaphysicalConflict(eval1.worldview, eval2.worldview)) {
    return 'metaphysical';
  }

  // Check if conflict is axiological (different value priorities)
  if (hasValueConflict(values1, values2)) {
    return 'axiological';
  }

  // Otherwise, it's a practical conflict (different actions recommended)
  return 'practical';
}

/**
 * Check if worldviews have metaphysical conflict
 * @param {string} worldview1 - First worldview name
 * @param {string} worldview2 - Second worldview name
 * @returns {boolean} True if metaphysical conflict exists
 */
function hasMetaphysicalConflict(worldview1, worldview2) {
  const complementaryPairs = [
    ['Materialism', 'Spiritualism'],
    ['Sensationalism', 'Rationalism'],
    ['Phenomenalism', 'Realism'],
    ['Dynamism', 'Mathematism'], // Becoming vs. Eternal Forms
    ['Monadism', 'Materialism'], // Individual vs. Physical matter
    ['Idealism', 'Materialism'], // Consciousness vs. Matter
    ['Psychism', 'Materialism'], // Soul depth vs. Physical surface
    ['Pneumatism', 'Materialism'] // Living spirit vs. Dead matter
  ];

  return complementaryPairs.some(([w1, w2]) =>
    (worldview1 === w1 && worldview2 === w2) ||
    (worldview1 === w2 && worldview2 === w1)
  );
}

/**
 * Check if value sets have conflicts
 * @param {Array} values1 - First set of values
 * @param {Array} values2 - Second set of values
 * @returns {boolean} True if value conflict exists
 */
function hasValueConflict(values1, values2) {
  // Simple heuristic: check if value sets are disjoint
  const set1 = new Set(values1.map(v => v.toLowerCase()));
  const set2 = new Set(values2.map(v => v.toLowerCase()));

  const intersection = [...set1].filter(v => set2.has(v));
  return intersection.length < Math.min(set1.size, set2.size) / 2;
}

/**
 * Get domain-specific worldview weights
 * @param {string} domain - Domain type
 * @returns {Object} Worldview weights for domain
 */
export function getDomainWeights(domain) {
  const domainWeights = {
    healthcare: {
      Materialism: 0.90,
      Realism: 0.90,
      Rationalism: 0.85,
      Monadism: 0.70,
      Idealism: 0.65,
      Dynamism: 0.60,
      Psychism: 0.55,
      Phenomenalism: 0.50,
      Sensationalism: 0.45,
      Mathematism: 0.40,
      Spiritualism: 0.40,
      Pneumatism: 0.35
    },
    spiritual: {
      Spiritualism: 0.95,
      Idealism: 0.85,
      Psychism: 0.85,
      Pneumatism: 0.75,
      Rationalism: 0.60,
      Monadism: 0.55,
      Dynamism: 0.50,
      Phenomenalism: 0.45,
      Realism: 0.40,
      Mathematism: 0.40,
      Sensationalism: 0.35,
      Materialism: 0.30
    },
    education: {
      Idealism: 0.90,
      Rationalism: 0.85,
      Dynamism: 0.80,
      Monadism: 0.70,
      Psychism: 0.70,
      Realism: 0.65,
      Mathematism: 0.60,
      Spiritualism: 0.55,
      Pneumatism: 0.50,
      Sensationalism: 0.45,
      Materialism: 0.50,
      Phenomenalism: 0.55
    },
    vocational: {
      Monadism: 0.90,
      Dynamism: 0.85,
      Idealism: 0.80,
      Materialism: 0.70,
      Psychism: 0.70,
      Rationalism: 0.65,
      Phenomenalism: 0.60,
      Realism: 0.55,
      Spiritualism: 0.50,
      Pneumatism: 0.45,
      Sensationalism: 0.50,
      Mathematism: 0.55
    },
    environmental: {
      Pneumatism: 0.95,
      Realism: 0.85,
      Rationalism: 0.80,
      Materialism: 0.70,
      Dynamism: 0.65,
      Spiritualism: 0.60,
      Idealism: 0.55,
      Psychism: 0.50,
      Phenomenalism: 0.50,
      Sensationalism: 0.45,
      Monadism: 0.40,
      Mathematism: 0.55
    },
    interpersonal: {
      Monadism: 0.90,
      Psychism: 0.85,
      Idealism: 0.80,
      Spiritualism: 0.70,
      Dynamism: 0.65,
      Phenomenalism: 0.65,
      Pneumatism: 0.60,
      Sensationalism: 0.55,
      Rationalism: 0.55,
      Realism: 0.50,
      Materialism: 0.40,
      Mathematism: 0.35
    },
    intellectual: {
      Rationalism: 0.95,
      Realism: 0.90,
      Mathematism: 0.85,
      Materialism: 0.75,
      Idealism: 0.70,
      Dynamism: 0.60,
      Phenomenalism: 0.55,
      Monadism: 0.50,
      Psychism: 0.45,
      Spiritualism: 0.40,
      Sensationalism: 0.40,
      Pneumatism: 0.35
    }
  };

  // Return weights for specified domain, or equal weights if unknown
  if (domainWeights[domain]) {
    return domainWeights[domain];
  }

  // Equal weights (no domain specified)
  return {
    Materialism: 0.60,
    Sensationalism: 0.60,
    Phenomenalism: 0.60,
    Realism: 0.60,
    Dynamism: 0.60,
    Monadism: 0.60,
    Idealism: 0.60,
    Rationalism: 0.60,
    Psychism: 0.60,
    Pneumatism: 0.60,
    Spiritualism: 0.60,
    Mathematism: 0.60
  };
}

/**
 * Get justification for domain weights
 * @param {string} domain - Domain type
 * @returns {string} Weight justification
 */
export function getDomainWeightJustification(domain) {
  const justifications = {
    healthcare: 'Healthcare prioritizes physical wellbeing, empirical evidence, and individual dignity. Materialism and Realism are weighted highly for their emphasis on physical health and objective medical facts. Rationalism supports systematic diagnosis. Monadism preserves individual dignity. Spiritualism is weighted lower but preserved for patients with religious concerns.',
    spiritual: 'Spiritual formation prioritizes transcendent relationship, meaning-making, and psychological depth. Spiritualism is weighted highest for divine relationship. Idealism and Psychism support consciousness development and emotional authenticity. Materialism is weighted lower but preserved for physical health considerations in spiritual practice.',
    education: 'Education prioritizes consciousness development, systematic understanding, and growth. Idealism supports meaning-making. Rationalism enables logical thinking. Dynamism emphasizes transformation. Monadism preserves individual uniqueness. Materialism and Sensationalism are weighted lower but preserved for practical skill development.',
    vocational: 'Vocational choice prioritizes individual uniqueness, growth, and meaningful work. Monadism emphasizes authentic calling. Dynamism supports transformation. Idealism provides meaning. Materialism is weighted moderately for financial security. All perspectives contribute to holistic vocational discernment.',
    environmental: 'Environmental policy prioritizes ensouled nature, objective ecological facts, and systematic sustainability. Pneumatism is weighted highest for sacred presence in nature. Realism provides objective ecological data. Rationalism enables systematic analysis. Materialism and Monadism are weighted lower but preserved for human welfare considerations.',
    interpersonal: 'Interpersonal relationships prioritize individual dignity, emotional authenticity, and meaning-making. Monadism emphasizes irreplaceable personhood. Psychism supports emotional congruence. Idealism provides meaning. Spiritualism offers sacred covenant perspective. Materialism and Mathematism are weighted lower but preserved for practical considerations.',
    intellectual: 'Intellectual pursuits prioritize logical coherence, objective truth, and formal perfection. Rationalism is weighted highest for systematic reasoning. Realism provides objective grounding. Mathematism supports formal elegance. Spiritualism and Pneumatism are weighted lower but preserved for wisdom traditions and holistic knowing.'
  };

  return justifications[domain] || 'No specific domain context provided. All worldviews weighted equally to avoid privileging any single perspective.';
}

/**
 * Integrate worldview judgments with domain weights
 * @param {Array} evaluations - Worldview evaluations
 * @param {Object} weights - Domain weights
 * @returns {Object} Integrated judgment
 */
export function integrateJudgments(evaluations, weights) {
  if (!evaluations || evaluations.length === 0) {
    return {
      integrated: 'Insufficient perspectives',
      confidence: 0,
      reasoning: 'No worldview evaluations provided'
    };
  }

  // Categorize judgments
  const judgmentCategories = categorizeJudgments(evaluations);

  // CRITICAL FIX: Separate definitive judgments from uncertain ones
  // "uncertain" means "I don't know" - it shouldn't outvote definitive judgments
  const definitiveJudgments = ['permissible', 'impermissible', 'obligatory'];
  const definitiveCategories = {};
  const uncertainEvaluations = judgmentCategories['uncertain'] || [];

  for (const [judgment, evals] of Object.entries(judgmentCategories)) {
    if (definitiveJudgments.includes(judgment)) {
      definitiveCategories[judgment] = evals;
    }
  }

  // Calculate weighted scores ONLY for definitive judgments
  const weightedScores = {};
  for (const [judgment, evals] of Object.entries(definitiveCategories)) {
    weightedScores[judgment] = evals.reduce((sum, evaluation) => {
      const weight = weights[evaluation.worldview] || 0.5;
      return sum + weight;
    }, 0);
  }

  // Find judgment with highest weighted score among definitive judgments
  let maxScore = 0;
  let integratedJudgment = 'uncertain'; // Default to uncertain if no definitive judgments
  for (const [judgment, score] of Object.entries(weightedScores)) {
    if (score > maxScore) {
      maxScore = score;
      integratedJudgment = judgment;
    }
  }

  // Calculate confidence based on agreement among OPINIONATED worldviews
  // (i.e., those with definitive judgments)
  const totalDefinitiveWeight = Object.values(weightedScores).reduce((sum, score) => sum + score, 0);
  let confidence = 0;

  if (totalDefinitiveWeight > 0) {
    // Confidence = (winning score) / (total weight of worldviews with opinions)
    confidence = maxScore / totalDefinitiveWeight;

    // Penalize confidence based on proportion of uncertain worldviews
    const totalUncertainWeight = uncertainEvaluations.reduce((sum, evaluation) => {
      return sum + (weights[evaluation.worldview] || 0.5);
    }, 0);
    const totalWeight = totalDefinitiveWeight + totalUncertainWeight;
    const uncertaintyProportion = totalUncertainWeight / totalWeight;

    // Reduce confidence by uncertainty proportion
    // If 50% of worldviews are uncertain, reduce confidence by 50%
    // This ensures significant uncertainty lowers confidence meaningfully
    confidence = confidence * (1 - uncertaintyProportion);
    confidence = Math.max(confidence, 0.1); // Minimum confidence if we have any definitive judgment
  } else {
    // NO definitive judgments - all worldviews are uncertain
    integratedJudgment = 'uncertain';
    confidence = 0.1; // Low confidence because nobody has an opinion
  }

  // Generate integrated reasoning
  const supportingEvals = judgmentCategories[integratedJudgment] || [];
  const reasoning = generateIntegratedReasoning(integratedJudgment, supportingEvals, weights);

  return {
    judgment: integratedJudgment,
    integrated: integratedJudgment,
    confidence: Math.round(confidence * 100) / 100,
    reasoning,
    supportingWorldviews: supportingEvals.map(e => e.worldview),
    contributingWorldviews: evaluations.map(e => e.worldview),
    weightedScore: maxScore,
    totalWeight: totalDefinitiveWeight + (uncertainEvaluations.reduce((sum, e) => sum + (weights[e.worldview] || 0.5), 0))
  };
}

/**
 * Categorize judgments by type
 * @param {Array} evaluations - Worldview evaluations
 * @returns {Object} Judgments categorized
 */
function categorizeJudgments(evaluations) {
  const categories = {};

  for (const evaluation of evaluations) {
    const judgment = normalizeJudgment(evaluation.judgment);
    if (!categories[judgment]) {
      categories[judgment] = [];
    }
    categories[judgment].push(evaluation);
  }

  return categories;
}

/**
 * Normalize judgment to standard categories
 * @param {string} judgment - Raw judgment
 * @returns {string} Normalized judgment
 */
function normalizeJudgment(judgment) {
  const j = judgment.toLowerCase();

  if (j.includes('permissible') && !j.includes('impermissible')) return 'permissible';
  if (j.includes('impermissible')) return 'impermissible';
  if (j.includes('obligatory') || j.includes('required')) return 'obligatory';
  if (j.includes('forbidden') || j.includes('prohibited')) return 'forbidden';
  if (j.includes('virtuous') || j.includes('praiseworthy')) return 'virtuous';
  if (j.includes('vicious') || j.includes('blameworthy')) return 'vicious';
  if (j.includes('good') && !j.includes('bad')) return 'good';
  if (j.includes('bad') || j.includes('wrong')) return 'bad';
  if (j.includes('right') && !j.includes('wrong')) return 'right';
  if (j.includes('acceptable')) return 'acceptable';
  if (j.includes('unacceptable')) return 'unacceptable';
  if (j.includes('uncertain')) return 'uncertain';

  return judgment; // Return original if no normalization applies
}

/**
 * Generate integrated reasoning from supporting evaluations
 * @param {string} judgment - Integrated judgment
 * @param {Array} supportingEvals - Supporting evaluations
 * @param {Object} weights - Domain weights
 * @returns {string} Integrated reasoning
 */
function generateIntegratedReasoning(judgment, supportingEvals, weights) {
  if (supportingEvals.length === 0) {
    return `Judgment: ${judgment} (no supporting worldviews)`;
  }

  const reasoningParts = supportingEvals.map(evaluation => {
    const weight = weights[evaluation.worldview] || 0.5;
    const weightStr = `(weight: ${Math.round(weight * 100)}%)`;
    return `- ${evaluation.worldview} ${weightStr}: ${evaluation.reasoning || evaluation.judgment}`;
  });

  return `Integrated judgment: ${judgment}\n\nSupporting worldviews:\n${reasoningParts.join('\n')}`;
}

/**
 * Identify minority worldview perspectives
 * @param {Array} evaluations - All evaluations
 * @param {Object} integration - Integrated result
 * @returns {Array} Minority perspectives
 */
export function identifyMinorityViews(evaluations, integration) {
  if (!evaluations || !integration) {
    return [];
  }

  const supportingWorldviews = new Set(integration.supportingWorldviews || []);
  const minorityViews = evaluations.filter(evaluation =>
    !supportingWorldviews.has(evaluation.worldview)
  );

  return minorityViews.map(evaluation => ({
    worldview: evaluation.worldview,
    judgment: evaluation.judgment,
    reasoning: evaluation.reasoning,
    relevantValues: evaluation.relevantValues || [],
    perspectiveValue: `This perspective emphasizes: ${(evaluation.relevantValues || []).join(', ')}`
  }));
}

/**
 * Assess confidence in integrated judgment
 * @param {Array} evaluations - All evaluations
 * @param {Object} weights - Domain weights
 * @returns {Object} Confidence assessment
 */
export function assessConfidence(evaluations, weights) {
  if (!evaluations || evaluations.length === 0) {
    return {
      level: 'low',
      score: 0,
      factors: ['No worldview evaluations provided'],
      uncertainties: ['Cannot assess without worldview perspectives']
    };
  }

  const integration = integrateJudgments(evaluations, weights);
  const confidenceScore = integration.confidence;

  // Determine confidence level (low, moderate, high)
  let level = 'low';
  if (confidenceScore >= 0.75) level = 'high';
  else if (confidenceScore >= 0.5) level = 'moderate';
  else level = 'low';

  // Identify confidence factors
  const factors = [];
  const uncertainties = [];

  // Factor: Agreement level
  const judgmentTypes = Object.keys(categorizeJudgments(evaluations)).length;
  if (judgmentTypes === 1) {
    factors.push('All worldviews agree on judgment');
  } else if (judgmentTypes === 2) {
    factors.push('Most worldviews agree, with one dissenting position');
  } else {
    uncertainties.push(`Worldviews divided across ${judgmentTypes} different positions`);
  }

  // Factor: Number of evaluations
  if (evaluations.length >= 10) {
    factors.push('Comprehensive consultation (10+ worldviews)');
  } else if (evaluations.length >= 6) {
    factors.push('Moderate consultation (6-9 worldviews)');
  } else {
    uncertainties.push(`Limited consultation (${evaluations.length} worldviews)`);
  }

  // Factor: Minority view strength
  const minorityViews = identifyMinorityViews(evaluations, integration);
  if (minorityViews.length > 0) {
    const minorityWeight = minorityViews.reduce((sum, view) => {
      return sum + (weights[view.worldview] || 0.5);
    }, 0);
    if (minorityWeight > integration.weightedScore * 0.3) {
      uncertainties.push('Significant minority perspective(s) present');
    }
  }

  return {
    level,
    score: confidenceScore,
    factors,
    uncertainties,
    uncertaintySources: uncertainties // Alias for test compatibility
  };
}

/**
 * Generate complete justification chain
 * @param {Object} resolution - Resolution object
 * @param {Array} evaluations - All evaluations
 * @param {Object} weights - Domain weights
 * @param {string} domain - Domain type
 * @returns {string} Complete justification
 */
export function generateJustification(resolution, evaluations, weights, domain) {
  const parts = [];

  // Handle both full resolution objects and integration objects
  const integrated = resolution.integrated || resolution.judgment;
  const supportingWorldviews = resolution.supportingWorldviews || [];

  // Step 1: State integrated judgment
  parts.push(`# Integrated Moral Judgment\n`);
  parts.push(`**Judgment**: ${integrated}\n`);
  parts.push(`**Confidence**: ${resolution.confidence} (${resolution.confidence >= 0.75 ? 'high' : resolution.confidence >= 0.5 ? 'moderate' : 'low'})\n`);

  // Step 2: Domain context
  if (domain && domain !== 'general') {
    parts.push(`\n## Domain Context: ${domain.charAt(0).toUpperCase() + domain.slice(1)}\n`);
    parts.push(getDomainWeightJustification(domain));
    parts.push('\n');
  } else {
    parts.push('\n## Domain Context: General (No Specific Domain)\n');
    parts.push('No specific domain context provided. All worldviews weighted equally.\n');
  }

  // Step 3: Supporting worldviews
  parts.push(`\n## Supporting Worldviews (${supportingWorldviews.length})\n`);
  for (const worldview of supportingWorldviews) {
    const evaluation = evaluations.find(e => e.worldview === worldview);
    if (evaluation) {
      const weight = weights[worldview] || 0.5;
      parts.push(`\n### ${worldview} (weight: ${Math.round(weight * 100)}%)\n`);
      parts.push(`**Judgment**: ${evaluation.judgment}\n`);
      parts.push(`**Reasoning**: ${evaluation.reasoning || 'Not provided'}\n`);
      if (evaluation.relevantValues && evaluation.relevantValues.length > 0) {
        parts.push(`**Values**: ${evaluation.relevantValues.join(', ')}\n`);
      }
    }
  }

  // Step 4: Minority perspectives
  const minorityViews = identifyMinorityViews(evaluations, resolution);
  if (minorityViews.length > 0) {
    parts.push(`\n## Minority Perspectives (${minorityViews.length})\n`);
    parts.push('**Important**: These dissenting views must be acknowledged and considered:\n');
    for (const view of minorityViews) {
      const weight = weights[view.worldview] || 0.5;
      parts.push(`\n### ${view.worldview} (weight: ${Math.round(weight * 100)}%)\n`);
      parts.push(`**Judgment**: ${view.judgment}\n`);
      parts.push(`**Reasoning**: ${view.reasoning || 'Not provided'}\n`);
      parts.push(`**Perspective Value**: ${view.perspectiveValue}\n`);
    }
    parts.push('\n**Conditions under which minority view might be correct**: ');
    parts.push('Different domain context, different value priorities, or additional relevant information not currently available.\n');
  }

  // Step 5: Confidence assessment
  const confidence = assessConfidence(evaluations, weights);
  parts.push(`\n## Confidence Assessment\n`);
  parts.push(`**Level**: ${confidence.level}\n`);
  parts.push(`**Score**: ${confidence.score}\n`);
  if (confidence.factors.length > 0) {
    parts.push(`**Supporting Factors**:\n`);
    for (const factor of confidence.factors) {
      parts.push(`- ${factor}\n`);
    }
  }
  if (confidence.uncertainties.length > 0) {
    parts.push(`**Uncertainties**:\n`);
    for (const uncertainty of confidence.uncertainties) {
      parts.push(`- ${uncertainty}\n`);
    }
  }

  // Step 6: Epistemic humility
  parts.push(`\n## Limitations and Epistemic Humility\n`);
  parts.push('This integrated judgment represents a weighted synthesis of multiple worldview perspectives. ');
  parts.push('It is not a claim to absolute moral truth, but rather a reasoned integration given the current context and domain. ');
  parts.push('All moral judgments are subject to revision with new information, different contexts, or reconsidered priorities. ');
  parts.push('Minority perspectives deserve serious consideration and may be correct under different circumstances.\n');

  return parts.join('');
}

// ==================================================================
// STATE & ACTIONS (Stateful Concept)
// ==================================================================

export const valueConflictResolver = {
  // State
  state: {
    currentResolution: null,
    resolutionHistory: [],
    currentDomain: 'general',
    domainWeights: getDomainWeights('general'),
    conflictPatterns: []
  },

  // Actions
  actions: {
    /**
     * Resolve value conflict using 7-step integration procedure
     * @param {Array} evaluations - Worldview evaluations
     * @param {Object} context - Scenario context (domain, tagteamResult, etc.)
     * @returns {Object} Resolution result
     */
    resolveConflict(evaluations, context = {}) {
      const domain = context.domain || valueConflictResolver.state.currentDomain;
      const weights = getDomainWeights(domain);
      const tagteamResult = context.tagteamResult || null;

      // Track the 7-step procedure
      const steps = [];

      // Step 1: Gather perspectives (already have evaluations)
      steps.push({ name: 'gather_perspectives', completed: true, result: `Gathered ${evaluations.length} worldview evaluations` });

      // Step 2: Identify conflicts (use TagTeam if available)
      const conflicts = detectConflicts(evaluations, tagteamResult);
      steps.push({ name: 'identify_conflicts', completed: true, result: `Detected ${conflicts.length} conflicts` });

      // Step 3: Contextualize by domain (get weights)
      steps.push({ name: 'contextualize_domain', completed: true, result: `Domain: ${domain}` });

      // Step 4: Integrate perspectives
      const integration = integrateJudgments(evaluations, weights);
      steps.push({ name: 'integrate_judgments', completed: true, result: `Integrated judgment: ${integration.judgment}` });

      // Step 5: Acknowledge minority views
      const minorityViews = identifyMinorityViews(evaluations, integration);
      steps.push({ name: 'acknowledge_minority', completed: true, result: `Identified ${minorityViews.length} minority views` });

      // Step 6: Generate justification chain
      const justification = generateJustification(integration, evaluations, weights, domain);
      steps.push({ name: 'generate_justification', completed: true, result: 'Generated full justification' });

      // Step 7: Assess confidence
      const confidenceAssessment = assessConfidence(evaluations, weights);
      steps.push({ name: 'assess_confidence', completed: true, result: `Confidence: ${confidenceAssessment.level}` });

      // Create resolution object
      const resolution = {
        id: `resolution_${Date.now()}`,
        timestamp: new Date().toISOString(),
        scenarioId: context.scenarioId || null,
        domain,
        judgment: integration.judgment,
        integrated: integration.integrated,
        confidence: integration.confidence,
        confidenceLevel: confidenceAssessment.level,
        conflicts: conflicts.length,
        conflictDetails: conflicts,
        supportingWorldviews: integration.supportingWorldviews,
        minorityViews: minorityViews,
        justification: justification,
        evaluations: evaluations,
        weights: weights,
        context: context,
        steps: steps
      };

      // Update state
      valueConflictResolver.state.currentResolution = resolution;
      valueConflictResolver.state.resolutionHistory.push(resolution);
      valueConflictResolver.state.currentDomain = domain;
      valueConflictResolver.state.domainWeights = weights;

      // Track conflict patterns
      if (conflicts.length > 0) {
        valueConflictResolver.state.conflictPatterns.push({
          conflicts: conflicts.map(c => `${c.worldview1} vs ${c.worldview2}`),
          domain,
          timestamp: resolution.timestamp
        });
      }

      // Emit events
      if (conflicts.length > 0) {
        valueConflictResolver.emit('conflictDetected', {
          conflicts,
          domain,
          resolutionId: resolution.id
        });
      }

      if (minorityViews.length > 0) {
        valueConflictResolver.emit('minorityViewIdentified', {
          minorityViews,
          resolutionId: resolution.id
        });
      }

      valueConflictResolver.emit('resolutionGenerated', resolution);

      valueConflictResolver.emit('confidenceAssessed', {
        confidence: confidenceAssessment.score,  // Number for test compatibility
        level: confidenceAssessment.level,
        score: confidenceAssessment.score,
        factors: confidenceAssessment.factors,
        uncertainties: confidenceAssessment.uncertainties
      });

      return resolution;
    },

    /**
     * Set domain context for future resolutions
     * @param {string} domainType - Domain type
     */
    setDomain(domainType) {
      const validDomains = ['healthcare', 'spiritual', 'education', 'vocational', 'environmental', 'interpersonal', 'intellectual', 'general'];
      const domain = validDomains.includes(domainType) ? domainType : 'general';

      valueConflictResolver.state.currentDomain = domain;
      valueConflictResolver.state.domainWeights = getDomainWeights(domain);

      valueConflictResolver.emit('domainSet', { domain });
    },

    /**
     * Get resolution history for a scenario
     * @param {string} scenarioId - Scenario identifier
     * @returns {Array} Historical resolutions
     */
    getResolutionHistory(scenarioId) {
      if (!scenarioId) {
        return valueConflictResolver.state.resolutionHistory;
      }

      return valueConflictResolver.state.resolutionHistory.filter(r =>
        r.context && r.context.scenarioId === scenarioId
      );
    },

    /**
     * Explain a specific resolution
     * @param {string} resolutionId - Resolution ID
     * @returns {string|null} Full justification or null
     */
    explainResolution(resolutionId) {
      const resolution = valueConflictResolver.state.resolutionHistory.find(r =>
        r.id === resolutionId
      );

      return resolution ? resolution.justification : null;
    },

    /**
     * Get current domain weights
     * @returns {Object} Current weights
     */
    getCurrentWeights() {
      return valueConflictResolver.state.domainWeights;
    },

    /**
     * Reset resolver state
     */
    reset() {
      valueConflictResolver.state.currentResolution = null;
      valueConflictResolver.state.resolutionHistory = [];
      valueConflictResolver.state.currentDomain = 'general';
      valueConflictResolver.state.domainWeights = getDomainWeights('general');
      valueConflictResolver.state.conflictPatterns = [];

      valueConflictResolver.emit('reset');
    }
  },

  // Event emitter
  listeners: {},

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    // Return unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  },

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  },

  // Expose events API for compatibility
  events: {
    on(event, callback) {
      return valueConflictResolver.on(event, callback);
    }
  }
};

export default valueConflictResolver;
