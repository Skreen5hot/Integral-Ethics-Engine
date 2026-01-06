/**
 * Scenario Parser Concept
 *
 * Converts natural language scenario descriptions into structured formats
 * that moralReasoner can process.
 *
 * Architecture:
 * - Pure functions for deterministic parsing
 * - Keyword-based extraction (extensible to NLP/LLM later)
 * - Domain-aware context detection
 * - Graceful degradation (works even with minimal matches)
 *
 * Input: { description: string, domain: string, context: {} }
 * Output: { action: string, context: {}, agents: [], artifacts: [] }
 */

// ============================================================================
// KEYWORD DICTIONARIES
// These map keywords to context flags and structural elements
// ============================================================================

/**
 * Action verbs that indicate the core ethical action
 */
const ACTION_VERBS = {
  // Harm/benefit actions
  harm: ['harm', 'hurt', 'injure', 'damage', 'destroy', 'kill', 'abuse', 'neglect'],
  help: ['help', 'heal', 'cure', 'treat', 'support', 'aid', 'assist', 'care'],

  // Truth/deception actions
  claim: ['claim', 'assert', 'state', 'declare', 'argue', 'propose'],
  deceive: ['lie', 'deceive', 'mislead', 'falsify', 'fabricate', 'conceal', 'hide'],
  reveal: ['reveal', 'disclose', 'report', 'expose', 'uncover', 'admit'],

  // Resource/allocation actions
  allocate: ['allocate', 'distribute', 'assign', 'give', 'take', 'share', 'divide'],
  prioritize: ['prioritize', 'choose', 'select', 'prefer', 'favor'],

  // Autonomy/control actions
  force: ['force', 'coerce', 'compel', 'require', 'mandate', 'impose'],
  allow: ['allow', 'permit', 'enable', 'let', 'authorize'],
  prevent: ['prevent', 'stop', 'block', 'restrict', 'prohibit', 'forbid'],

  // Relationship actions
  leave: ['leave', 'abandon', 'depart', 'exit', 'withdraw', 'separate'],
  join: ['join', 'marry', 'unite', 'connect', 'commit'],
  betray: ['betray', 'violate', 'break', 'cheat', 'dishonor'],

  // Work/creation actions
  work: ['work', 'labor', 'create', 'produce', 'build', 'develop'],
  destroy: ['destroy', 'eliminate', 'remove', 'demolish', 'dismantle']
};

/**
 * Context flags that moralReasoner looks for
 */
const CONTEXT_KEYWORDS = {
  // Physical context
  physicalImpact: [
    'harm', 'injury', 'pain', 'suffering', 'death', 'dying', 'illness', 'disease',
    'health', 'body', 'physical', 'bodily', 'medical', 'treatment', 'life support',
    'terminal', 'fatal', 'life-threatening', 'organ', 'transplant', 'surgery'
  ],

  // Truth/knowledge context
  factsInvolved: [
    'fact', 'evidence', 'data', 'claim', 'truth', 'false', 'lie', 'honest',
    'dishonest', 'report', 'falsify', 'fabricate', 'research', 'study', 'test'
  ],

  truthClaims: [
    'claim', 'assert', 'believe', 'doctrine', 'teaching', 'faith', 'creed',
    'truth', 'reality', 'knowledge', 'certainty', 'doubt', 'question'
  ],

  // Experiential context
  aesthetic: [
    'beauty', 'art', 'music', 'literature', 'culture', 'aesthetic', 'creative',
    'expression', 'artistic', 'experience', 'meaning', 'inspiration'
  ],

  sensory: [
    'feel', 'sense', 'experience', 'sensation', 'perception', 'awareness',
    'consciousness', 'subjective', 'phenomenal', 'qualia'
  ],

  // Social context
  personsInvolved: [
    'person', 'people', 'individual', 'patient', 'student', 'employee', 'family',
    'friend', 'parent', 'child', 'spouse', 'partner', 'colleague', 'community',
    'someone', 'I', 'me', 'my', 'they', 'them', 'their', 'we', 'us'
  ],

  communityImpact: [
    'community', 'society', 'public', 'social', 'collective', 'group', 'town',
    'city', 'nation', 'culture', 'tradition', 'custom', 'network', 'team'
  ],

  // Resource context
  resourceScarcity: [
    'limited', 'scarce', 'only one', 'insufficient', 'shortage', 'competition',
    'compete', 'allocate', 'distribute', 'priority', 'choose between', 'available'
  ],

  financialStakes: [
    'money', 'cost', 'expensive', 'afford', 'pay', 'income', 'salary', 'wage',
    'debt', 'financial', 'economic', 'price', 'dollar', '$', 'insurance'
  ],

  // Moral/value context
  moralConflict: [
    'should', 'wrong', 'right', 'ethical', 'unethical', 'moral', 'immoral',
    'duty', 'obligation', 'responsibility', 'conflict', 'tension', 'dilemma'
  ],

  autonomyAtStake: [
    'choice', 'decide', 'decision', 'autonomy', 'freedom', 'liberty', 'control',
    'independent', 'self-determination', 'force', 'coerce', 'compel', 'require'
  ],

  // Temporal context
  urgency: [
    'urgent', 'emergency', 'immediate', 'now', 'crisis', 'critical', 'dying',
    'deadline', 'time-sensitive', 'quickly', 'soon', 'imminent'
  ],

  futureImpact: [
    'future', 'long-term', 'generation', 'legacy', 'permanent', 'irreversible',
    'career', 'lifetime', 'forever', 'children', 'grandchildren'
  ],

  // Epistemic context
  uncertainty: [
    'uncertain', 'unknown', 'unclear', 'ambiguous', 'maybe', 'might', 'could',
    'possibly', 'experimental', 'untested', 'risk', 'gamble', 'chance'
  ],

  expertise: [
    'expert', 'specialist', 'professional', 'trained', 'qualified', 'experienced',
    'research', 'science', 'evidence-based', 'proven', 'studied'
  ]
};

/**
 * Agent role patterns (helps identify stakeholders)
 */
const AGENT_PATTERNS = {
  patient: ['patient', 'sick person', 'ill person'],
  doctor: ['doctor', 'physician', 'surgeon', 'medical professional'],
  family: ['family', 'parent', 'child', 'spouse', 'sibling', 'relative'],
  student: ['student', 'pupil', 'learner'],
  teacher: ['teacher', 'professor', 'instructor', 'educator'],
  employee: ['employee', 'worker', 'staff'],
  employer: ['employer', 'boss', 'manager', 'company', 'corporation'],
  friend: ['friend', 'best friend', 'close friend'],
  stranger: ['stranger', 'unknown person'],
  community: ['community', 'group', 'organization', 'society'],
  authority: ['authority', 'government', 'police', 'official', 'regulator'],
  self: ['I', 'me', 'my', 'myself']
};

/**
 * Artifact patterns (objects/concepts at stake)
 */
const ARTIFACT_PATTERNS = {
  life: ['life', 'survival', 'existence'],
  health: ['health', 'wellbeing', 'wellness'],
  money: ['money', 'income', 'wealth', 'financial security'],
  job: ['job', 'career', 'employment', 'position', 'work'],
  relationship: ['relationship', 'friendship', 'marriage', 'partnership'],
  reputation: ['reputation', 'standing', 'honor', 'respect'],
  freedom: ['freedom', 'liberty', 'autonomy', 'independence'],
  knowledge: ['knowledge', 'truth', 'understanding', 'education'],
  environment: ['environment', 'nature', 'wilderness', 'ecosystem', 'planet'],
  tradition: ['tradition', 'custom', 'heritage', 'culture', 'faith'],
  safety: ['safety', 'security', 'protection']
};

// ============================================================================
// PURE EXTRACTION FUNCTIONS
// ============================================================================

/**
 * Extracts the primary action from a scenario description.
 * Looks for action verbs and returns the most relevant one.
 *
 * @param {string} description - Natural language scenario
 * @returns {string} Extracted action phrase
 */
export function extractAction(description) {
  const lowerDesc = description.toLowerCase();
  const sentences = description.split(/[.!?]+/);

  // Find sentences with action verbs
  let bestAction = null;
  let bestScore = 0;

  for (const [category, verbs] of Object.entries(ACTION_VERBS)) {
    for (const verb of verbs) {
      // Look for verb in question context (stronger signal)
      const questionPattern = new RegExp(`(should|must|can|may|is it).*${verb}`, 'i');
      if (questionPattern.test(lowerDesc)) {
        const match = lowerDesc.match(questionPattern);
        if (match) {
          return match[0]; // Return the whole question phrase
        }
      }

      // Look for verb in declarative context
      const verbPattern = new RegExp(`\\b${verb}\\w*\\b`, 'i');
      if (verbPattern.test(lowerDesc)) {
        const score = 1 + (category === 'harm' ? 2 : 0); // Prioritize harm actions
        if (score > bestScore) {
          bestScore = score;
          bestAction = verb;
        }
      }
    }
  }

  // If we found a specific verb, try to get context
  if (bestAction) {
    const verbPattern = new RegExp(`([^.!?]*\\b${bestAction}\\w*\\b[^.!?]*)`, 'i');
    const match = description.match(verbPattern);
    if (match) {
      return match[1].trim();
    }
    return bestAction;
  }

  // Fallback: use first sentence as action
  return sentences[0]?.trim() || description.substring(0, 100);
}

/**
 * Detects context flags based on keywords in description.
 *
 * @param {string} description - Natural language scenario
 * @param {string} domain - Domain hint
 * @returns {Object} Context flags (boolean values)
 */
export function detectContext(description, domain) {
  const lowerDesc = description.toLowerCase();
  const context = {};

  // Check each context flag
  for (const [flag, keywords] of Object.entries(CONTEXT_KEYWORDS)) {
    context[flag] = keywords.some(keyword =>
      lowerDesc.includes(keyword.toLowerCase())
    );
  }

  // Domain-specific context enhancements
  if (domain === 'healthcare' || domain === 'medical') {
    context.physicalImpact = true; // Always relevant
    context.personsInvolved = true;
  }

  if (domain === 'spiritual' || domain === 'religious') {
    context.truthClaims = true;
    context.communityImpact = true;
  }

  if (domain === 'environmental') {
    context.futureImpact = true;
    context.communityImpact = true;
  }

  if (domain === 'vocational' || domain === 'business') {
    context.financialStakes = true;
    context.autonomyAtStake = true;
  }

  if (domain === 'interpersonal') {
    context.personsInvolved = true;
    context.moralConflict = true;
  }

  return context;
}

/**
 * Identifies agents (stakeholders) in the scenario.
 *
 * @param {string} description - Natural language scenario
 * @returns {Array<Object>} Identified agents with roles
 */
export function identifyAgents(description) {
  const lowerDesc = description.toLowerCase();
  const agents = [];

  for (const [role, patterns] of Object.entries(AGENT_PATTERNS)) {
    for (const pattern of patterns) {
      if (lowerDesc.includes(pattern)) {
        // Avoid duplicates
        if (!agents.find(a => a.role === role)) {
          agents.push({ role, mentioned: pattern });
        }
      }
    }
  }

  // Always include self if first-person pronouns present
  if (['i', 'me', 'my', 'myself'].some(p => lowerDesc.includes(` ${p} `) || lowerDesc.startsWith(p))) {
    if (!agents.find(a => a.role === 'self')) {
      agents.push({ role: 'self', mentioned: 'I' });
    }
  }

  return agents;
}

/**
 * Identifies artifacts (things at stake) in the scenario.
 *
 * @param {string} description - Natural language scenario
 * @returns {Array<Object>} Identified artifacts
 */
export function identifyArtifacts(description) {
  const lowerDesc = description.toLowerCase();
  const artifacts = [];

  for (const [type, patterns] of Object.entries(ARTIFACT_PATTERNS)) {
    for (const pattern of patterns) {
      if (lowerDesc.includes(pattern)) {
        // Avoid duplicates
        if (!artifacts.find(a => a.type === type)) {
          artifacts.push({ type, mentioned: pattern });
        }
      }
    }
  }

  return artifacts;
}

/**
 * Calculates a complexity score for the scenario.
 * Higher complexity suggests more nuanced moral reasoning needed.
 *
 * @param {Object} structuredScenario - Parsed scenario
 * @returns {number} Complexity score (0-1)
 */
export function calculateComplexity(structuredScenario) {
  const { context, agents, artifacts } = structuredScenario;

  let score = 0;

  // Count active context flags (each adds complexity)
  const activeFlags = Object.values(context).filter(Boolean).length;
  score += Math.min(activeFlags * 0.05, 0.3); // Max 0.3 from context

  // Multiple agents increase complexity
  score += Math.min(agents.length * 0.1, 0.3); // Max 0.3 from agents

  // Multiple artifacts at stake increase complexity
  score += Math.min(artifacts.length * 0.08, 0.24); // Max 0.24 from artifacts

  // Specific high-complexity indicators
  if (context.moralConflict) score += 0.1;
  if (context.uncertainty) score += 0.08;
  if (context.resourceScarcity) score += 0.08;

  return Math.min(score, 1.0);
}

// ============================================================================
// MAIN PARSING FUNCTION
// ============================================================================

/**
 * Parses a natural language scenario into structured format.
 * This is the main entry point for the parser.
 *
 * PURE FUNCTION - deterministic, no side effects.
 *
 * @param {Object} rawScenario - { description, domain, context }
 * @returns {Object} Structured scenario for moralReasoner
 */
export function parseScenario(rawScenario) {
  const { description, domain, context: userContext = {} } = rawScenario;

  if (!description || description.trim().length === 0) {
    throw new Error('Scenario description is required');
  }

  // Extract structural elements
  const action = extractAction(description);
  const detectedContext = detectContext(description, domain);
  const agents = identifyAgents(description);
  const artifacts = identifyArtifacts(description);

  // Merge user-provided context with detected context
  const mergedContext = {
    ...detectedContext,
    ...userContext // User overrides win
  };

  const structured = {
    // Required by moralReasoner
    action,
    context: mergedContext,
    agents,
    artifacts,

    // Metadata for debugging/enhancement
    meta: {
      originalDescription: description,
      domain,
      complexity: 0, // Will be calculated after structure complete
      parserVersion: '1.0.0',
      timestamp: new Date().toISOString()
    }
  };

  // Calculate complexity
  structured.meta.complexity = calculateComplexity(structured);

  return structured;
}

/**
 * Validates that a structured scenario has required fields.
 *
 * @param {Object} scenario - Structured scenario
 * @returns {boolean} True if valid
 * @throws {Error} If invalid with specific reason
 */
export function validateStructuredScenario(scenario) {
  if (!scenario.action || typeof scenario.action !== 'string') {
    throw new Error('Structured scenario must have action string');
  }

  if (!scenario.context || typeof scenario.context !== 'object') {
    throw new Error('Structured scenario must have context object');
  }

  if (!Array.isArray(scenario.agents)) {
    throw new Error('Structured scenario must have agents array');
  }

  if (!Array.isArray(scenario.artifacts)) {
    throw new Error('Structured scenario must have artifacts array');
  }

  return true;
}

// ============================================================================
// UTILITY EXPORTS
// ============================================================================

/**
 * Gets all available context flags (useful for UI/debugging).
 *
 * @returns {Array<string>} List of context flag names
 */
export function getAvailableContextFlags() {
  return Object.keys(CONTEXT_KEYWORDS);
}

/**
 * Gets all available agent roles (useful for UI/debugging).
 *
 * @returns {Array<string>} List of agent role names
 */
export function getAvailableAgentRoles() {
  return Object.keys(AGENT_PATTERNS);
}

/**
 * Gets all available artifact types (useful for UI/debugging).
 *
 * @returns {Array<string>} List of artifact type names
 */
export function getAvailableArtifactTypes() {
  return Object.keys(ARTIFACT_PATTERNS);
}
