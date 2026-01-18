/**
 * Value Mapper - Maps TagTeam's 50 ethical values to IEE worldview values
 *
 * @module concepts/valueMapper
 * @description Provides mapping between TagTeam's 50-value ethical ontology
 *              and the Integral Ethics Engine's worldview-specific value hierarchies.
 *              Each worldview (Materialism, Idealism, etc.) has terminal, constitutive,
 *              and instrumental values. This module maps TagTeam detections to those values.
 *
 * @version 1.0.0
 * @date 2026-01-18
 */

/**
 * Comprehensive mapping from TagTeam's 50 values to IEE worldview values
 *
 * Structure:
 * {
 *   "TagTeam Value Name": ["worldview_value_1", "worldview_value_2", ...]
 * }
 *
 * Multiple worldview values may map to a single TagTeam value because:
 * - Different worldviews use different terminology
 * - Some TagTeam values are broader than worldview values
 * - Allows matching across diverse philosophical perspectives
 */
export const tagteamToWorldviewValueMap = {
  // ==========================================
  // Dignity Domain (10 values)
  // ==========================================

  'Autonomy': [
    'self_determination',
    'freedom',
    'agency',
    'independence',
    'liberty'
  ],

  'Justice': [
    'fairness',
    'equality',
    'moral_law',
    'rights',
    'distributive_justice'
  ],

  'Equality': [
    'fairness',
    'equal_treatment',
    'parity',
    'non_discrimination'
  ],

  'Human Rights': [
    'dignity',
    'inherent_worth',
    'inalienable_rights',
    'human_dignity'
  ],

  'Privacy': [
    'self_determination',
    'personal_boundaries',
    'confidentiality',
    'autonomy'
  ],

  'Dignity': [
    'inherent_worth',
    'respect',
    'human_dignity',
    'worth'
  ],

  'Freedom': [
    'liberty',
    'self_determination',
    'independence',
    'autonomy'
  ],

  'Respect': [
    'dignity',
    'recognition',
    'honor',
    'esteem'
  ],

  'Consent': [
    'autonomy',
    'self_determination',
    'voluntary_choice',
    'informed_consent'
  ],

  'Self-determination': [
    'autonomy',
    'agency',
    'self_governance',
    'freedom'
  ],

  // ==========================================
  // Care Domain (10 values)
  // ==========================================

  'Compassion': [
    'empathy',
    'benevolence',
    'kindness',
    'sympathy',
    'concern'
  ],

  'Beneficence': [
    'physical_wellbeing',
    'welfare',
    'good',
    'benefit',
    'flourishing'
  ],

  'Non-maleficence': [
    'physical_wellbeing',
    'harm_prevention',
    'do_no_harm',
    'safety'
  ],

  'Empathy': [
    'compassion',
    'understanding',
    'fellow_feeling',
    'sympathy'
  ],

  'Fidelity': [
    'trustworthiness',
    'loyalty',
    'faithfulness',
    'reliability',
    'commitment'
  ],

  'Care': [
    'compassion',
    'concern',
    'attentiveness',
    'solicitude',
    'benevolence'
  ],

  'Protection': [
    'safety',
    'security',
    'harm_prevention',
    'defense',
    'safeguarding'
  ],

  'Safety': [
    'security',
    'protection',
    'wellbeing',
    'harm_prevention'
  ],

  'Healing': [
    'restoration',
    'physical_wellbeing',
    'recovery',
    'cure'
  ],

  'Nurturance': [
    'care',
    'support',
    'fostering',
    'nurturing'
  ],

  'Generosity': [
    'benevolence',
    'charity',
    'giving',
    'altruism',
    'kindness'
  ],

  // ==========================================
  // Virtue Domain (10 values)
  // ==========================================

  'Integrity': [
    'moral_coherence',
    'wholeness',
    'consistency',
    'uprightness',
    'honesty'
  ],

  'Honesty': [
    'truthfulness',
    'transparency',
    'candor',
    'veracity',
    'sincerity'
  ],

  'Courage': [
    'bravery',
    'fortitude',
    'moral_strength',
    'valor',
    'fearlessness'
  ],

  'Wisdom': [
    'practical_reason',
    'prudence',
    'understanding',
    'sagacity',
    'insight'
  ],

  'Humility': [
    'modesty',
    'self_awareness',
    'humbleness',
    'unpretentiousness'
  ],

  'Temperance': [
    'moderation',
    'self_control',
    'restraint',
    'balance'
  ],

  'Prudence': [
    'practical_reason',
    'wisdom',
    'discretion',
    'sound_judgment'
  ],

  'Accountability': [
    'responsibility',
    'answerability',
    'obligation',
    'duty'
  ],

  'Excellence': [
    'virtue',
    'flourishing',
    'arete',
    'perfection',
    'goodness'
  ],

  'Character': [
    'virtue',
    'moral_excellence',
    'ethos',
    'integrity'
  ],

  'Patience': [
    'forbearance',
    'endurance',
    'tolerance',
    'perseverance',
    'restraint'
  ],

  // ==========================================
  // Community Domain (10 values)
  // ==========================================

  'Solidarity': [
    'fellowship',
    'mutual_support',
    'community',
    'unity',
    'togetherness'
  ],

  'Common Good': [
    'collective_welfare',
    'social_flourishing',
    'public_interest',
    'general_welfare'
  ],

  'Stewardship': [
    'responsible_management',
    'care_for_resources',
    'guardianship',
    'conservation'
  ],

  'Transparency': [
    'openness',
    'accountability',
    'honesty',
    'disclosure',
    'clarity'
  ],

  'Civic Duty': [
    'citizenship',
    'social_responsibility',
    'public_obligation',
    'civic_virtue'
  ],

  'Social Justice': [
    'fairness',
    'equality',
    'distributive_justice',
    'equity',
    'rights'
  ],

  'Sustainability': [
    'future_care',
    'environmental_responsibility',
    'stewardship',
    'long_term_thinking'
  ],

  'Reciprocity': [
    'mutual_exchange',
    'fairness',
    'give_and_take',
    'balance'
  ],

  'Cooperation': [
    'collaboration',
    'mutual_assistance',
    'working_together',
    'teamwork'
  ],

  'Inclusion': [
    'belonging',
    'participation',
    'equality',
    'accessibility',
    'diversity'
  ],

  // ==========================================
  // Transcendence Domain (10 values)
  // ==========================================

  'Faith': [
    'trust_in_divine',
    'religious_commitment',
    'belief',
    'spiritual_trust'
  ],

  'Hope': [
    'future_orientation',
    'trust',
    'optimism',
    'expectation',
    'aspiration'
  ],

  'Meaning': [
    'purpose',
    'significance',
    'teleology',
    'meaningfulness',
    'point'
  ],

  'Sacred/Holy': [
    'divine_value',
    'religious_significance',
    'sacredness',
    'holiness',
    'sanctity'
  ],

  'Spiritual Growth': [
    'spiritual_development',
    'transcendence',
    'elevation',
    'spiritual_progress'
  ],

  'Reverence': [
    'awe',
    'respect_for_sacred',
    'veneration',
    'devotion'
  ],

  'Gratitude': [
    'thankfulness',
    'appreciation',
    'gratefulness',
    'recognition'
  ],

  'Forgiveness': [
    'mercy',
    'pardon',
    'reconciliation',
    'clemency',
    'absolution'
  ],

  'Love': [
    'agape',
    'charity',
    'benevolence',
    'affection',
    'compassion'
  ],

  'Transcendence': [
    'beyond_material',
    'spiritual_elevation',
    'higher_consciousness',
    'transcending'
  ]
};

/**
 * Find worldview values that match a TagTeam-detected value
 *
 * @param {string} tagteamValueName - Name of TagTeam value (e.g., "Autonomy")
 * @param {Object} worldviewValues - Worldview's value hierarchy
 * @param {string[]} worldviewValues.terminal - Terminal values
 * @param {string[]} worldviewValues.constitutive - Constitutive values
 * @param {string[]} worldviewValues.instrumental - Instrumental values
 * @returns {Array<Object>} Array of matches with value, type, and match quality
 *
 * @example
 * const worldviewValues = {
 *   terminal: ['self_determination', 'fairness'],
 *   constitutive: ['freedom', 'equality'],
 *   instrumental: ['choice', 'voice']
 * };
 *
 * const matches = findWorldviewMatches('Autonomy', worldviewValues);
 * // Returns:
 * // [
 * //   { value: 'self_determination', type: 'terminal', matchQuality: 'high' },
 * //   { value: 'freedom', type: 'constitutive', matchQuality: 'medium' }
 * // ]
 */
export function findWorldviewMatches(tagteamValueName, worldviewValues) {
  const mappings = tagteamToWorldviewValueMap[tagteamValueName];

  if (!mappings) {
    console.warn(`No mapping found for TagTeam value: ${tagteamValueName}`);
    return [];
  }

  const matches = [];

  // Check terminal values (highest priority)
  if (worldviewValues.terminal) {
    worldviewValues.terminal.forEach(terminalValue => {
      if (mappings.includes(terminalValue)) {
        matches.push({
          value: terminalValue,
          type: 'terminal',
          matchQuality: 'high'
        });
      }
    });
  }

  // Check constitutive values (medium priority)
  if (worldviewValues.constitutive) {
    worldviewValues.constitutive.forEach(constitutiveValue => {
      if (mappings.includes(constitutiveValue)) {
        matches.push({
          value: constitutiveValue,
          type: 'constitutive',
          matchQuality: 'medium'
        });
      }
    });
  }

  // Check instrumental values (lower priority)
  if (worldviewValues.instrumental) {
    worldviewValues.instrumental.forEach(instrumentalValue => {
      if (mappings.includes(instrumentalValue)) {
        matches.push({
          value: instrumentalValue,
          type: 'instrumental',
          matchQuality: 'low'
        });
      }
    });
  }

  return matches;
}

/**
 * Convert TagTeam salience (0.0-1.0) to IEE salience levels (high/medium/low)
 *
 * @param {number} salience - TagTeam salience score (0.0-1.0)
 * @returns {string} IEE salience level: 'high', 'medium', or 'low'
 *
 * Thresholds:
 * - High: 0.7+ (strong evidence, multiple keywords, frame/role boosts)
 * - Medium: 0.4-0.69 (moderate evidence)
 * - Low: 0.0-0.39 (weak evidence, below detection threshold)
 */
export function mapSalienceToLevel(salience) {
  if (salience >= 0.7) return 'high';
  if (salience >= 0.4) return 'medium';
  return 'low';
}

/**
 * Get domain from TagTeam's 5-domain ontology
 *
 * @param {string} tagteamDomain - TagTeam domain (Dignity, Care, Virtue, Community, Transcendence)
 * @returns {string} IEE domain (healthcare, spiritual, education, etc.)
 *
 * Mapping strategy:
 * - Care/Dignity → healthcare (bodily concerns)
 * - Virtue → intellectual (character development)
 * - Community → interpersonal (social relationships)
 * - Transcendence → spiritual (religious/existential)
 */
export function mapTagteamDomainToIEEDomain(tagteamDomain) {
  const domainMap = {
    'Care': 'healthcare',
    'Dignity': 'healthcare',  // Often healthcare context (bodily autonomy, dignity in medical care)
    'Virtue': 'intellectual',  // Character formation, intellectual virtues
    'Community': 'interpersonal',  // Social relationships
    'Transcendence': 'spiritual'  // Religious, spiritual, existential
  };

  return domainMap[tagteamDomain] || 'general';
}

/**
 * Get all possible TagTeam values for a given worldview value
 * (Reverse mapping for validation and debugging)
 *
 * @param {string} worldviewValue - IEE worldview value (e.g., "self_determination")
 * @returns {string[]} Array of TagTeam values that could map to this worldview value
 *
 * @example
 * const tagteamValues = getTagteamValuesForWorldviewValue('self_determination');
 * // Returns: ['Autonomy', 'Privacy', 'Freedom', 'Self-determination', 'Consent']
 */
export function getTagteamValuesForWorldviewValue(worldviewValue) {
  const reverseMap = [];

  for (const [tagteamValue, worldviewValues] of Object.entries(tagteamToWorldviewValueMap)) {
    if (worldviewValues.includes(worldviewValue)) {
      reverseMap.push(tagteamValue);
    }
  }

  return reverseMap;
}

/**
 * Validate that all TagTeam values have mappings
 *
 * @returns {Object} Validation result with status and missing values
 *
 * @example
 * const validation = validateValueMappings();
 * if (!validation.valid) {
 *   console.error('Missing mappings:', validation.missing);
 * }
 */
export function validateValueMappings() {
  const expectedTagteamValues = 50;
  const actualMappings = Object.keys(tagteamToWorldviewValueMap).length;

  const missing = [];
  const duplicates = [];

  // Check for completeness
  if (actualMappings < expectedTagteamValues) {
    missing.push(`Expected ${expectedTagteamValues} values, found ${actualMappings}`);
  }

  return {
    valid: missing.length === 0 && duplicates.length === 0,
    totalMappings: actualMappings,
    expectedMappings: expectedTagteamValues,
    missing,
    duplicates
  };
}

/**
 * Get statistics about the value mapping
 *
 * @returns {Object} Mapping statistics
 */
export function getMappingStatistics() {
  const stats = {
    totalTagteamValues: Object.keys(tagteamToWorldviewValueMap).length,
    byDomain: {
      'Dignity': 0,
      'Care': 0,
      'Virtue': 0,
      'Community': 0,
      'Transcendence': 0
    },
    averageWorldviewValuesPerTagteamValue: 0,
    uniqueWorldviewValues: new Set()
  };

  // Count values by domain (based on order in mapping)
  const valueNames = Object.keys(tagteamToWorldviewValueMap);

  // Domain boundaries (based on actual order in tagteamToWorldviewValueMap)
  let dignityEnd = 10;
  let careEnd = dignityEnd + 11;  // 11 values (added Generosity)
  let virtueEnd = careEnd + 11;   // 11 values (added Patience)
  let communityEnd = virtueEnd + 10;
  let transcendenceEnd = communityEnd + 10;

  stats.byDomain.Dignity = dignityEnd;
  stats.byDomain.Care = careEnd - dignityEnd;
  stats.byDomain.Virtue = virtueEnd - careEnd;
  stats.byDomain.Community = communityEnd - virtueEnd;
  stats.byDomain.Transcendence = transcendenceEnd - communityEnd;

  // Calculate averages
  let totalWorldviewValues = 0;
  for (const worldviewValues of Object.values(tagteamToWorldviewValueMap)) {
    totalWorldviewValues += worldviewValues.length;
    worldviewValues.forEach(v => stats.uniqueWorldviewValues.add(v));
  }

  stats.averageWorldviewValuesPerTagteamValue = (totalWorldviewValues / stats.totalTagteamValues).toFixed(2);
  stats.uniqueWorldviewValuesCount = stats.uniqueWorldviewValues.size;
  delete stats.uniqueWorldviewValues;  // Remove Set for cleaner output

  return stats;
}

// Module metadata
export const metadata = {
  module: 'valueMapper',
  version: '1.1.0',
  description: 'Maps TagTeam value ontology to IEE worldview values',
  tagteamVersion: '2.0.0',
  totalMappings: Object.keys(tagteamToWorldviewValueMap).length,
  domains: ['Dignity', 'Care', 'Virtue', 'Community', 'Transcendence']
};
