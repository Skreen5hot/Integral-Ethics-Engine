# TagTeam-IEE Integration Design

**Version:** 1.0.0
**Date:** January 18, 2026
**Status:** Design Document - Ready for Implementation

---

## Executive Summary

This document specifies the integration architecture for connecting TagTeam.js v2.0.0 (semantic parser with ethical value detection) to the Integral Ethics Engine (IEE) deliberation system.

**Integration Approach:** Augmented Pipeline Pattern
**Complexity:** Low-Medium (minimal architectural changes)
**Benefits:** Enhanced value detection, better domain selection, richer semantic understanding
**Timeline:** Phased delivery over 2-3 sprints

---

## 1. Integration Architecture Overview

### Current IEE Pipeline

```
User Input (text)
    ↓
Keyword-based Parsing ──→ Structured Scenario
    ↓
12 Worldview Evaluations (keyword-matched values)
    ↓
Conflict Resolution (domain-weighted integration)
    ↓
Final Deliberation Result
```

### Enhanced Pipeline with TagTeam

```
User Input (text)
    ↓
    ├─→ [NEW] TagTeam.parse() ──→ Semantic Analysis
    │         • Agent: "doctor"
    │         • Action: "provide_treatment"
    │         • ethicalProfile: {values, conflicts, domains}
    │         • contextIntensity: {temporal, relational, ...}
    │
    └─→ Keyword-based Parsing ──→ Structured Scenario
              ↓
    [MERGE] Enhanced Scenario (keywords + semantics)
              ↓
12 Worldview Evaluations (semantically-enhanced)
    ↓
Conflict Resolution (TagTeam conflicts included)
    ↓
Final Result (with semantic metadata)
```

**Key Principle:** TagTeam augments, doesn't replace. Keyword-based fallback always available.

---

## 2. Data Flow Specification

### 2.1 TagTeam Output → IEE Input Mapping

#### TagTeam.parse() Output Structure

```javascript
{
  version: "2.0",

  // Semantic Roles (Week 1)
  agent: {
    text: "doctor",
    entity: "doctor",
    type: "professional"
  },
  action: {
    verb: "provides",
    modality: null,
    tense: "present"
  },
  patient: {
    text: "treatment",
    entity: "treatment",
    type: "medical_intervention"
  },
  semanticFrame: "Caring",

  // Context Intensity (Week 2a) - 12 dimensions
  contextIntensity: {
    temporal: {
      urgency: 0.3,
      duration: 0.5,
      reversibility: 0.6
    },
    relational: {
      intimacy: 0.5,
      powerDifferential: 0.6,
      trust: 0.7
    },
    consequential: {
      harmSeverity: 0.4,
      benefitMagnitude: 0.7,
      scope: 0.3
    },
    epistemic: {
      certainty: 0.8,
      informationCompleteness: 0.7,
      expertise: 0.9
    }
  },

  // Ethical Profile (Week 2b) - 50 values
  ethicalProfile: {
    values: [
      {
        name: "Beneficence",
        salience: 0.83,
        polarity: 1,        // +1 = upheld, -1 = violated, 0 = neutral
        source: "keyword",
        evidence: ["alleviate", "treatment"],
        roleBoosts: ["doctor"],
        frameBoosts: ["Caring"],
        breakdown: {
          keywordScore: 0.6,
          frameBoost: 0.2,
          roleBoost: 0.03
        }
      },
      {
        name: "Non-maleficence",
        salience: 0.53,
        polarity: 1,
        source: "keyword",
        evidence: ["alleviate suffering"],
        roleBoosts: ["doctor"],
        frameBoosts: ["Caring"],
        breakdown: {
          keywordScore: 0.3,
          frameBoost: 0.2,
          roleBoost: 0.03
        }
      }
    ],
    topValues: [
      { name: "Beneficence", salience: 0.83, polarity: 1 },
      { name: "Non-maleficence", salience: 0.53, polarity: 1 }
    ],
    valueSummary: {
      total: 2,
      byDomain: { "Care": 2 },
      byPolarity: { "upheld": 2, "violated": 0, "conflicted": 0 }
    },
    dominantDomain: "Care",
    domainScores: {
      "Dignity": 0,
      "Care": 0.68,
      "Virtue": 0,
      "Community": 0,
      "Transcendence": 0
    },
    conflictScore: 0,
    conflicts: [],
    confidence: 0.83
  }
}
```

#### IEE Scenario Structure (Current)

```javascript
{
  description: "A doctor provides evidence-based medical treatment...",
  domain: "healthcare",  // Detected or user-specified

  // After parsing
  action: "provide_medical_treatment",
  context: {
    physicalImpact: true,
    factsInvolved: true,
    personsInvolved: true,
    expertiseRequired: true,
    // ... 12+ more boolean flags
  },
  agents: [
    { role: "doctor", mentioned: "doctor" },
    { role: "patient", mentioned: "patient" }
  ],
  artifacts: [
    { type: "health", mentioned: "patient suffering" },
    { type: "life", mentioned: "patient" }
  ],
  complexity: 0.68
}
```

#### Enhanced IEE Scenario (With TagTeam)

```javascript
{
  description: "A doctor provides evidence-based medical treatment...",
  domain: "healthcare",

  // Existing keyword-based parsing (unchanged)
  action: "provide_medical_treatment",
  context: { ... },
  agents: [ ... ],
  artifacts: [ ... ],
  complexity: 0.68,

  // NEW: Semantic analysis from TagTeam
  semanticAnalysis: {
    source: "TagTeam",
    version: "2.0",

    // Semantic roles
    semanticAgent: {
      text: "doctor",
      entity: "doctor",
      type: "professional"
    },
    semanticAction: {
      verb: "provides",
      modality: null,
      tense: "present"
    },
    semanticPatient: {
      text: "treatment",
      entity: "treatment",
      type: "medical_intervention"
    },
    semanticFrame: "Caring",

    // Context intensity (maps to IEE's context flags)
    contextIntensity: {
      temporal: { urgency: 0.3, duration: 0.5, reversibility: 0.6 },
      relational: { intimacy: 0.5, powerDifferential: 0.6, trust: 0.7 },
      consequential: { harmSeverity: 0.4, benefitMagnitude: 0.7, scope: 0.3 },
      epistemic: { certainty: 0.8, informationCompleteness: 0.7, expertise: 0.9 }
    },

    // Detected ethical values (PRIMARY BENEFIT)
    detectedValues: [
      {
        name: "Beneficence",
        salience: 0.83,
        polarity: 1,
        evidence: ["alleviate", "treatment"],
        domain: "Care"
      },
      {
        name: "Non-maleficence",
        salience: 0.53,
        polarity: 1,
        evidence: ["alleviate suffering"],
        domain: "Care"
      }
    ],

    // Value conflicts detected
    valueConflicts: [],

    // Domain suggestions (for domain detection)
    suggestedDomains: ["healthcare"],
    dominantDomain: "Care",

    // Overall confidence
    confidence: 0.83
  }
}
```

---

## 3. Integration Points (Priority Order)

### 3.1 PRIORITY 1: Domain Detection Enhancement

**File:** `src/application/deliberationOrchestrator.js`
**Function:** `detectDomain(scenarioText)`
**Change Type:** Enhancement (non-breaking)

#### Current Implementation

```javascript
export function detectDomain(scenarioText) {
  const text = scenarioText.toLowerCase();

  if (text.includes('health') || text.includes('medical') ||
      text.includes('patient') || text.includes('doctor')) {
    return 'healthcare';
  }
  if (text.includes('god') || text.includes('faith') ||
      text.includes('prayer') || text.includes('spiritual')) {
    return 'spiritual';
  }
  // ... more keyword checks ...

  return 'general';
}
```

#### Enhanced Implementation

```javascript
export function detectDomain(scenarioText, tagteamResult = null) {
  // PRIORITY 1: Use TagTeam's domain suggestion if available
  if (tagteamResult?.ethicalProfile?.dominantDomain) {
    const domainMap = {
      'Care': 'healthcare',
      'Dignity': 'healthcare',  // Often healthcare context
      'Virtue': 'intellectual',
      'Community': 'interpersonal',
      'Transcendence': 'spiritual'
    };

    const mappedDomain = domainMap[tagteamResult.ethicalProfile.dominantDomain];
    if (mappedDomain) {
      return mappedDomain;
    }
  }

  // FALLBACK: Keyword-based detection
  const text = scenarioText.toLowerCase();

  if (text.includes('health') || text.includes('medical') ||
      text.includes('patient') || text.includes('doctor')) {
    return 'healthcare';
  }
  // ... existing keyword logic ...

  return 'general';
}
```

**Benefits:**
- More accurate domain selection
- Skips expensive keyword matching when semantic analysis available
- Non-breaking: Falls back to keywords if TagTeam unavailable

**Testing:**
```javascript
test('detectDomain: uses TagTeam suggestion when available', () => {
  const text = "A doctor provides treatment";
  const tagteamResult = {
    ethicalProfile: { dominantDomain: "Care" }
  };

  const domain = detectDomain(text, tagteamResult);
  assert.equal(domain, 'healthcare');
});

test('detectDomain: falls back to keywords when TagTeam unavailable', () => {
  const text = "A doctor provides treatment";
  const domain = detectDomain(text, null);
  assert.equal(domain, 'healthcare');
});
```

---

### 3.2 PRIORITY 2: Value Matching Enhancement

**File:** `src/concepts/moralReasoner.js`
**Function:** `matchScenarioToValues(scenario, worldviewValues)`
**Change Type:** Enhancement (non-breaking)

#### Current Implementation

```javascript
export function matchScenarioToValues(scenario, worldviewValues) {
  const relevantValues = [];

  // For each terminal value in worldview
  worldviewValues.terminal.forEach(terminalValue => {
    // Keyword matching logic
    if (scenario.context.physicalImpact ||
        scenario.artifacts.some(a => a.type === 'health' || a.type === 'life')) {

      if (terminalValue === 'physical_wellbeing') {
        relevantValues.push({
          value: terminalValue,
          type: 'terminal',
          salience: 'high'
        });
      }
    }
  });

  return relevantValues;
}
```

#### Enhanced Implementation

```javascript
export function matchScenarioToValues(scenario, worldviewValues, tagteamResult = null) {
  const relevantValues = [];

  // PRIORITY 1: Use TagTeam's detected values for high-confidence matches
  if (tagteamResult?.ethicalProfile?.values) {
    tagteamResult.ethicalProfile.values.forEach(detectedValue => {
      // Map TagTeam value to worldview value
      const terminalMatch = findWorldviewValueMatch(
        detectedValue.name,
        worldviewValues.terminal
      );

      if (terminalMatch) {
        relevantValues.push({
          value: terminalMatch,
          type: 'terminal',
          salience: mapSalienceToLevel(detectedValue.salience),  // 0.0-1.0 → high/medium/low
          source: 'semantic_detection',
          polarity: detectedValue.polarity,
          evidence: detectedValue.evidence,
          confidence: detectedValue.salience
        });
      }
    });
  }

  // PRIORITY 2: Keyword-based matching for values not detected by TagTeam
  const detectedValueNames = tagteamResult?.ethicalProfile?.values.map(v => v.name) || [];

  worldviewValues.terminal.forEach(terminalValue => {
    // Skip if already detected by TagTeam
    if (detectedValueNames.includes(terminalValue)) {
      return;
    }

    // Existing keyword matching logic
    if (scenario.context.physicalImpact ||
        scenario.artifacts.some(a => a.type === 'health' || a.type === 'life')) {

      if (terminalValue === 'physical_wellbeing') {
        relevantValues.push({
          value: terminalValue,
          type: 'terminal',
          salience: 'high',
          source: 'keyword_inference'
        });
      }
    }
  });

  return relevantValues;
}

// Helper: Map TagTeam value names to worldview values
function findWorldviewValueMatch(tagteamValueName, worldviewTerminalValues) {
  const valueMap = {
    // TagTeam value → Worldview value mapping
    'Autonomy': 'self_determination',
    'Beneficence': 'physical_wellbeing',
    'Non-maleficence': 'physical_wellbeing',
    'Justice': 'fairness',
    'Compassion': 'empathy',
    'Honesty': 'truthfulness',
    'Integrity': 'moral_coherence',
    // ... complete mapping for all 50 values
  };

  const mappedValue = valueMap[tagteamValueName];

  // Return if worldview contains this value
  return worldviewTerminalValues.includes(mappedValue) ? mappedValue : null;
}

// Helper: Convert TagTeam salience (0.0-1.0) to IEE levels (high/medium/low)
function mapSalienceToLevel(salience) {
  if (salience >= 0.7) return 'high';
  if (salience >= 0.4) return 'medium';
  return 'low';
}
```

**Benefits:**
- Higher confidence value detection
- Source tracking (semantic vs keyword)
- Polarity information from TagTeam (upheld/violated)
- Reduces reliance on keyword patterns

**Testing:**
```javascript
test('matchScenarioToValues: prioritizes TagTeam detections', () => {
  const scenario = { ... };
  const worldviewValues = {
    terminal: ['physical_wellbeing', 'truthfulness'],
    constitutive: [],
    instrumental: []
  };
  const tagteamResult = {
    ethicalProfile: {
      values: [
        { name: 'Beneficence', salience: 0.83, polarity: 1, evidence: [...] }
      ]
    }
  };

  const matched = matchScenarioToValues(scenario, worldviewValues, tagteamResult);

  const semanticMatch = matched.find(v => v.source === 'semantic_detection');
  assert.ok(semanticMatch, 'Should include semantic detection');
  assert.equal(semanticMatch.value, 'physical_wellbeing');
  assert.equal(semanticMatch.salience, 'high');
});
```

---

### 3.3 PRIORITY 3: Conflict Detection Enhancement

**File:** `src/concepts/valueConflictResolver.js`
**Function:** `detectConflicts(evaluations, context)`
**Change Type:** Enhancement (non-breaking)

#### Current Implementation

```javascript
export function detectConflicts(evaluations, context = {}) {
  const conflicts = [];

  // Group evaluations by judgment
  const permissible = evaluations.filter(e => e.judgment === 'permissible');
  const impermissible = evaluations.filter(e => e.judgment === 'impermissible');

  // Conflict exists if both permissible and impermissible judgments
  if (permissible.length > 0 && impermissible.length > 0) {
    conflicts.push({
      type: 'judgment',
      worldviews: evaluations.map(e => e.worldview),
      positions: {
        permissible: permissible.map(e => e.worldview),
        impermissible: impermissible.map(e => e.worldview)
      },
      description: 'Worldviews disagree on judgment'
    });
  }

  return conflicts;
}
```

#### Enhanced Implementation

```javascript
export function detectConflicts(evaluations, context = {}, tagteamResult = null) {
  const conflicts = [];

  // PRIORITY 1: Add TagTeam-detected value conflicts
  if (tagteamResult?.ethicalProfile?.conflicts &&
      tagteamResult.ethicalProfile.conflicts.length > 0) {

    conflicts.push({
      type: 'semantic_value_conflict',
      description: 'TagTeam detected value tensions',
      values: tagteamResult.ethicalProfile.conflicts,
      source: 'semantic_analysis',
      conflictScore: tagteamResult.ethicalProfile.conflictScore
    });
  }

  // PRIORITY 2: Detect conflicts from opposing polarities
  if (tagteamResult?.ethicalProfile?.values) {
    const upheldValues = tagteamResult.ethicalProfile.values.filter(v => v.polarity === 1);
    const violatedValues = tagteamResult.ethicalProfile.values.filter(v => v.polarity === -1);

    if (upheldValues.length > 0 && violatedValues.length > 0) {
      conflicts.push({
        type: 'polarity_conflict',
        description: 'Some values upheld while others violated',
        upheld: upheldValues.map(v => v.name),
        violated: violatedValues.map(v => v.name),
        source: 'semantic_analysis'
      });
    }
  }

  // PRIORITY 3: Existing worldview judgment conflicts
  const permissible = evaluations.filter(e => e.judgment === 'permissible');
  const impermissible = evaluations.filter(e => e.judgment === 'impermissible');

  if (permissible.length > 0 && impermissible.length > 0) {
    conflicts.push({
      type: 'judgment',
      worldviews: evaluations.map(e => e.worldview),
      positions: {
        permissible: permissible.map(e => e.worldview),
        impermissible: impermissible.map(e => e.worldview)
      },
      description: 'Worldviews disagree on judgment',
      source: 'worldview_integration'
    });
  }

  return conflicts;
}
```

**Benefits:**
- Earlier conflict detection (before worldview consultation)
- Richer conflict information (semantic value tensions)
- Can adjust worldview weights based on known conflicts
- Polarity conflicts reveal normative tensions

**Testing:**
```javascript
test('detectConflicts: includes TagTeam conflicts', () => {
  const evaluations = [ ... ];
  const tagteamResult = {
    ethicalProfile: {
      conflicts: [
        { value1: 'Autonomy', value2: 'Beneficence', tension: 0.65 }
      ],
      conflictScore: 0.65
    }
  };

  const conflicts = detectConflicts(evaluations, {}, tagteamResult);

  const semanticConflict = conflicts.find(c => c.type === 'semantic_value_conflict');
  assert.ok(semanticConflict, 'Should include semantic conflicts');
  assert.equal(semanticConflict.conflictScore, 0.65);
});
```

---

### 3.4 PRIORITY 4: Orchestrator Integration

**File:** `src/application/deliberationOrchestrator.js`
**Function:** `deliberateOnScenario(scenario, options)`
**Change Type:** Modification (backward-compatible)

#### Enhanced Implementation

```javascript
export const deliberationOrchestrator = {
  state: {
    deliberations: [],
    currentDeliberationId: null
  },

  actions: {
    async deliberateOnScenario(scenario, options = {}) {
      const startTime = Date.now();

      try {
        // Step 0: Validate input
        const validationResult = validateScenarioInput(scenario);
        if (!validationResult.valid) {
          throw new Error(`Invalid scenario: ${validationResult.errors.join(', ')}`);
        }

        this.emit('deliberationStarted', { scenario });

        // Step 1: NEW - Run TagTeam semantic analysis (if enabled)
        let tagteamResult = null;
        if (options.useSemanticAnalysis !== false) {
          try {
            // Import TagTeam dynamically (allows graceful degradation)
            const TagTeam = await import('../../collaborations/tagteam/dist/tagteam.js');
            tagteamResult = TagTeam.parse(scenario.description);

            this.emit('semanticAnalysisCompleted', {
              tagteamResult,
              detectedValues: tagteamResult.ethicalProfile.values.length,
              dominantDomain: tagteamResult.ethicalProfile.dominantDomain
            });
          } catch (error) {
            console.warn('TagTeam semantic analysis failed, falling back to keywords:', error);
            // Continue without semantic analysis
          }
        }

        // Step 2: Detect domain (enhanced with TagTeam)
        const domain = scenario.domain ||
                       detectDomain(scenario.description, tagteamResult);

        this.emit('domainDetected', { domain });

        // Step 3: Select worldviews
        const worldviews = this.selectWorldviews(scenario, domain, options);
        this.emit('worldviewsSelected', { worldviews: worldviews.map(w => w.name) });

        // Step 4: Generate evaluations (enhanced with TagTeam)
        const evaluations = await this.generateRealEvaluations(
          worldviews,
          scenario,
          domain,
          tagteamResult  // NEW: Pass semantic analysis
        );

        this.emit('evaluationsGenerated', {
          count: evaluations.length,
          hasSemanticEnhancement: !!tagteamResult
        });

        // Step 5: Resolve conflicts (enhanced with TagTeam)
        const resolution = await valueConflictResolver.actions.resolveConflict(
          evaluations,
          {
            domain: domain,
            scenario: scenario,
            tagteamResult: tagteamResult  // NEW: Pass for conflict detection
          }
        );

        this.emit('conflictsResolved', {
          judgment: resolution.judgment,
          confidence: resolution.confidence,
          conflicts: resolution.conflicts.length
        });

        // Step 6: Format result (include semantic metadata)
        const result = this.formatDeliberationResult(
          resolution,
          evaluations,
          domain,
          scenario,
          tagteamResult  // NEW: Include in output
        );

        // Validate output
        const outputValidation = validateDeliberationResult(result);
        if (!outputValidation.valid) {
          throw new Error(`Invalid result: ${outputValidation.errors.join(', ')}`);
        }

        // Save to session
        await sessionManager.actions.saveDeliberation(result);

        const duration = Date.now() - startTime;
        this.emit('deliberationCompleted', {
          id: result.id,
          duration,
          semanticAnalysisUsed: !!tagteamResult
        });

        return result;

      } catch (error) {
        this.emit('deliberationFailed', { error: error.message });
        throw error;
      }
    },

    // ... other methods ...
  }
};
```

**Key Changes:**
1. Added Step 0: TagTeam semantic analysis (optional, with fallback)
2. Pass `tagteamResult` through pipeline
3. Emit new events for semantic analysis tracking
4. Include semantic metadata in final result

---

### 3.5 PRIORITY 5: Result Format Enhancement

**File:** `src/application/deliberationOrchestrator.js`
**Function:** `formatDeliberationResult(resolution, evaluations, domain, scenario, tagteamResult)`
**Change Type:** Enhancement (non-breaking)

#### Enhanced Implementation

```javascript
function formatDeliberationResult(resolution, evaluations, domain, scenario, tagteamResult = null) {
  const result = {
    id: `resolution_${Date.now()}`,
    timestamp: new Date().toISOString(),
    scenario: {
      description: scenario.description,
      domain: domain,
      context: scenario.context || {}
    },
    domain: domain,
    judgment: resolution.judgment,
    confidence: resolution.confidence,
    confidenceLevel: resolution.confidenceLevel,
    worldviews: evaluations,
    conflicts: resolution.conflicts,
    minorityViews: resolution.minorityViews || [],
    supportingWorldviews: resolution.supportingWorldviews || [],
    justification: resolution.justification,
    steps: resolution.steps || [],
    metadata: {
      evaluationsCount: evaluations.length,
      conflictsCount: resolution.conflicts.length,
      minorityViewsCount: (resolution.minorityViews || []).length,
      completedAt: new Date().toISOString()
    }
  };

  // NEW: Add semantic analysis metadata (if available)
  if (tagteamResult) {
    result.semanticAnalysis = {
      source: 'TagTeam',
      version: tagteamResult.version,

      // Semantic roles
      agent: tagteamResult.agent,
      action: tagteamResult.action,
      patient: tagteamResult.patient,
      semanticFrame: tagteamResult.semanticFrame,

      // Context intensity
      contextIntensity: tagteamResult.contextIntensity,

      // Ethical profile
      detectedValues: tagteamResult.ethicalProfile.values.map(v => ({
        name: v.name,
        salience: v.salience,
        polarity: v.polarity,
        domain: v.domain || tagteamResult.ethicalProfile.dominantDomain,
        evidence: v.evidence
      })),
      dominantDomain: tagteamResult.ethicalProfile.dominantDomain,
      valueConflicts: tagteamResult.ethicalProfile.conflicts,
      confidence: tagteamResult.ethicalProfile.confidence
    };

    result.metadata.semanticAnalysisUsed = true;
    result.metadata.semanticValuesDetected = tagteamResult.ethicalProfile.values.length;
  } else {
    result.metadata.semanticAnalysisUsed = false;
  }

  return result;
}
```

**Benefits:**
- Full auditability of semantic input
- Can compare TagTeam's values against worldview results
- Enables validation of integration quality
- Preserves all semantic metadata for future analysis

---

## 4. Value Mapping Specification

### TagTeam 50 Values → IEE Worldview Values

TagTeam detects 50 distinct ethical values. IEE worldviews use different value terminology. We need a mapping layer.

#### Mapping Strategy

**Option A: Direct Mapping (RECOMMENDED)**

Create mapping file: `src/concepts/valueMapper.js`

```javascript
export const tagteamToWorldviewValueMap = {
  // Dignity Domain (10 values)
  'Autonomy': ['self_determination', 'freedom', 'agency'],
  'Justice': ['fairness', 'equality', 'moral_law'],
  'Equality': ['fairness', 'equal_treatment'],
  'Human Rights': ['dignity', 'inherent_worth'],
  'Privacy': ['self_determination', 'personal_boundaries'],
  'Dignity': ['inherent_worth', 'respect'],
  'Freedom': ['liberty', 'self_determination'],
  'Respect': ['dignity', 'recognition'],
  'Consent': ['autonomy', 'self_determination'],
  'Self-determination': ['autonomy', 'agency'],

  // Care Domain (10 values)
  'Compassion': ['empathy', 'benevolence', 'kindness'],
  'Beneficence': ['physical_wellbeing', 'welfare', 'good'],
  'Non-maleficence': ['physical_wellbeing', 'harm_prevention'],
  'Empathy': ['compassion', 'understanding'],
  'Fidelity': ['trustworthiness', 'loyalty', 'faithfulness'],
  'Care': ['compassion', 'concern', 'attentiveness'],
  'Protection': ['safety', 'security', 'harm_prevention'],
  'Safety': ['security', 'protection'],
  'Healing': ['restoration', 'physical_wellbeing'],
  'Nurturance': ['care', 'support'],

  // Virtue Domain (10 values)
  'Integrity': ['moral_coherence', 'wholeness', 'consistency'],
  'Honesty': ['truthfulness', 'transparency', 'candor'],
  'Courage': ['bravery', 'fortitude', 'moral_strength'],
  'Wisdom': ['practical_reason', 'prudence', 'understanding'],
  'Humility': ['modesty', 'self_awareness'],
  'Temperance': ['moderation', 'self_control'],
  'Prudence': ['practical_reason', 'wisdom'],
  'Accountability': ['responsibility', 'answerability'],
  'Excellence': ['virtue', 'flourishing', 'arete'],
  'Character': ['virtue', 'moral_excellence'],

  // Community Domain (10 values)
  'Solidarity': ['fellowship', 'mutual_support', 'community'],
  'Common Good': ['collective_welfare', 'social_flourishing'],
  'Stewardship': ['responsible_management', 'care_for_resources'],
  'Transparency': ['openness', 'accountability', 'honesty'],
  'Civic Duty': ['citizenship', 'social_responsibility'],
  'Social Justice': ['fairness', 'equality', 'distributive_justice'],
  'Sustainability': ['future_care', 'environmental_responsibility'],
  'Reciprocity': ['mutual_exchange', 'fairness'],
  'Cooperation': ['collaboration', 'mutual_assistance'],
  'Inclusion': ['belonging', 'participation', 'equality'],

  // Transcendence Domain (10 values)
  'Faith': ['trust_in_divine', 'religious_commitment'],
  'Hope': ['future_orientation', 'trust', 'optimism'],
  'Meaning': ['purpose', 'significance', 'teleology'],
  'Sacred/Holy': ['divine_value', 'religious_significance'],
  'Spiritual Growth': ['spiritual_development', 'transcendence'],
  'Reverence': ['awe', 'respect_for_sacred'],
  'Gratitude': ['thankfulness', 'appreciation'],
  'Forgiveness': ['mercy', 'pardon', 'reconciliation'],
  'Love': ['agape', 'charity', 'benevolence'],
  'Transcendence': ['beyond_material', 'spiritual_elevation']
};

/**
 * Find worldview values that match a TagTeam-detected value
 */
export function findWorldviewMatches(tagteamValueName, worldviewValues) {
  const mappings = tagteamToWorldviewValueMap[tagteamValueName] || [];

  const matches = [];

  // Check terminal values
  worldviewValues.terminal?.forEach(terminalValue => {
    if (mappings.includes(terminalValue)) {
      matches.push({
        value: terminalValue,
        type: 'terminal',
        matchQuality: 'high'
      });
    }
  });

  // Check constitutive values (lower priority)
  worldviewValues.constitutive?.forEach(constitutiveValue => {
    if (mappings.includes(constitutiveValue)) {
      matches.push({
        value: constitutiveValue,
        type: 'constitutive',
        matchQuality: 'medium'
      });
    }
  });

  return matches;
}
```

**Usage in moralReasoner.js:**

```javascript
import { findWorldviewMatches } from './valueMapper.js';

export function matchScenarioToValues(scenario, worldviewValues, tagteamResult = null) {
  const relevantValues = [];

  if (tagteamResult?.ethicalProfile?.values) {
    tagteamResult.ethicalProfile.values.forEach(detectedValue => {
      const matches = findWorldviewMatches(detectedValue.name, worldviewValues);

      matches.forEach(match => {
        relevantValues.push({
          value: match.value,
          type: match.type,
          salience: mapSalienceToLevel(detectedValue.salience),
          source: 'semantic_detection',
          tagteamValue: detectedValue.name,
          polarity: detectedValue.polarity,
          evidence: detectedValue.evidence,
          confidence: detectedValue.salience
        });
      });
    });
  }

  // ... keyword matching fallback ...

  return relevantValues;
}
```

---

## 5. Implementation Phases

### Phase 1: Foundation (Week 1)
**Goal:** Basic integration infrastructure

**Tasks:**
1. ✅ Create `src/concepts/valueMapper.js` with TagTeam → worldview value mappings
2. ✅ Create `src/concepts/semanticAnalyzer.js` wrapper for TagTeam
3. ✅ Update schemas to support semantic analysis fields
4. ✅ Write unit tests for value mapping

**Deliverables:**
- Value mapping module (150 lines)
- Semantic analyzer wrapper (100 lines)
- Schema updates (50 lines)
- Unit tests (200 lines)

**Success Criteria:**
- All 50 TagTeam values map to worldview values
- TagTeam.parse() callable from IEE codebase
- No regressions in existing tests

---

### Phase 2: Core Integration (Week 2)
**Goal:** Enhance pipeline with semantic analysis

**Tasks:**
1. ✅ Enhance `detectDomain()` with TagTeam suggestions
2. ✅ Enhance `matchScenarioToValues()` with semantic detection
3. ✅ Enhance `detectConflicts()` with TagTeam conflicts
4. ✅ Modify `deliberateOnScenario()` to run TagTeam analysis
5. ✅ Update `formatDeliberationResult()` to include semantic metadata

**Deliverables:**
- Enhanced domain detection (50 lines)
- Enhanced value matching (100 lines)
- Enhanced conflict detection (75 lines)
- Orchestrator modifications (150 lines)
- Result formatting updates (100 lines)

**Success Criteria:**
- TagTeam analysis runs on every deliberation (unless disabled)
- Semantic values appear in worldview evaluations
- Conflicts include semantic tensions
- All existing tests pass

---

### Phase 3: Testing & Validation (Week 3)
**Goal:** Comprehensive validation of integration

**Tasks:**
1. ✅ Create integration test suite (20 scenarios)
2. ✅ Compare TagTeam values vs worldview values
3. ✅ Validate domain detection accuracy
4. ✅ Test performance impact
5. ✅ Test graceful degradation (TagTeam unavailable)

**Deliverables:**
- Integration test suite (500 lines)
- Performance benchmarks
- Validation report
- Documentation updates

**Success Criteria:**
- 90%+ domain detection accuracy
- 80%+ value match agreement
- <50ms TagTeam overhead
- Graceful fallback when TagTeam fails

---

## 6. Testing Strategy

### 6.1 Unit Tests

**File:** `testing/frameworks/unit-tests/tagteam-integration.test.js`

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findWorldviewMatches } from '../../../src/concepts/valueMapper.js';
import { detectDomain } from '../../../src/application/deliberationOrchestrator.js';
import { matchScenarioToValues } from '../../../src/concepts/moralReasoner.js';

test('valueMapper: maps TagTeam values to worldview values', () => {
  const worldviewValues = {
    terminal: ['self_determination', 'fairness', 'truthfulness'],
    constitutive: ['freedom', 'equality'],
    instrumental: []
  };

  const matches = findWorldviewMatches('Autonomy', worldviewValues);

  assert.ok(matches.length > 0, 'Should find matches');
  assert.ok(matches.some(m => m.value === 'self_determination'),
    'Should match self_determination');
});

test('detectDomain: uses TagTeam suggestion', () => {
  const text = "A doctor provides treatment";
  const tagteamResult = {
    ethicalProfile: { dominantDomain: "Care" }
  };

  const domain = detectDomain(text, tagteamResult);
  assert.equal(domain, 'healthcare');
});

test('matchScenarioToValues: includes semantic detections', () => {
  const scenario = {
    description: "A doctor provides treatment",
    context: { physicalImpact: true }
  };
  const worldviewValues = {
    terminal: ['physical_wellbeing'],
    constitutive: [],
    instrumental: []
  };
  const tagteamResult = {
    ethicalProfile: {
      values: [
        { name: 'Beneficence', salience: 0.83, polarity: 1, evidence: ['treatment'] }
      ]
    }
  };

  const matched = matchScenarioToValues(scenario, worldviewValues, tagteamResult);

  const semanticMatch = matched.find(m => m.source === 'semantic_detection');
  assert.ok(semanticMatch, 'Should include semantic detection');
  assert.equal(semanticMatch.tagteamValue, 'Beneficence');
});
```

### 6.2 Integration Tests

**File:** `testing/frameworks/integration-tests/tagteam-deliberation.test.js`

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deliberationOrchestrator } from '../../../src/application/deliberationOrchestrator.js';

test('Integration: Complete deliberation with semantic analysis', async () => {
  const scenario = {
    description: 'A doctor provides evidence-based medical treatment to alleviate patient suffering.'
  };

  const result = await deliberationOrchestrator.actions.deliberateOnScenario(scenario, {
    useSemanticAnalysis: true
  });

  // Verify semantic analysis was used
  assert.ok(result.metadata.semanticAnalysisUsed, 'Should use semantic analysis');
  assert.ok(result.semanticAnalysis, 'Should include semantic analysis');

  // Verify domain detection
  assert.equal(result.domain, 'healthcare');

  // Verify values detected
  assert.ok(result.semanticAnalysis.detectedValues.length > 0, 'Should detect values');

  // Verify worldviews used semantic values
  const hasSemanticValues = result.worldviews.some(wv =>
    wv.values.some(v => v.source === 'semantic_detection')
  );
  assert.ok(hasSemanticValues, 'Worldviews should use semantic values');
});

test('Integration: Graceful fallback when semantic analysis disabled', async () => {
  const scenario = {
    description: 'A doctor provides evidence-based medical treatment to alleviate patient suffering.'
  };

  const result = await deliberationOrchestrator.actions.deliberateOnScenario(scenario, {
    useSemanticAnalysis: false
  });

  // Verify deliberation still works
  assert.ok(result.judgment, 'Should have judgment');
  assert.equal(result.metadata.semanticAnalysisUsed, false);
  assert.ok(!result.semanticAnalysis, 'Should not include semantic analysis');

  // Verify keyword-based fallback worked
  assert.equal(result.domain, 'healthcare');
  assert.ok(result.worldviews.length > 0, 'Should have worldview evaluations');
});
```

### 6.3 Performance Tests

**File:** `testing/frameworks/performance-tests/tagteam-overhead.test.js`

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deliberationOrchestrator } from '../../../src/application/deliberationOrchestrator.js';

test('Performance: TagTeam analysis overhead <50ms', async () => {
  const scenario = {
    description: 'A doctor provides evidence-based medical treatment to alleviate patient suffering.'
  };

  // Measure with semantic analysis
  const start1 = performance.now();
  await deliberationOrchestrator.actions.deliberateOnScenario(scenario, {
    useSemanticAnalysis: true
  });
  const duration1 = performance.now() - start1;

  // Measure without semantic analysis
  const start2 = performance.now();
  await deliberationOrchestrator.actions.deliberateOnScenario(scenario, {
    useSemanticAnalysis: false
  });
  const duration2 = performance.now() - start2;

  const overhead = duration1 - duration2;

  console.log(`Semantic analysis overhead: ${overhead.toFixed(2)}ms`);
  assert.ok(overhead < 50, `Overhead should be <50ms, got ${overhead.toFixed(2)}ms`);
});
```

---

## 7. Configuration & Options

### User-Facing Configuration

**File:** `src/application/deliberationOrchestrator.js`

```javascript
const defaultOptions = {
  // Enable/disable semantic analysis
  useSemanticAnalysis: true,

  // Minimum confidence threshold for using semantic values
  semanticConfidenceThreshold: 0.3,

  // Whether to include semantic metadata in result
  includeSemanticMetadata: true,

  // Fallback behavior if TagTeam fails
  fallbackOnSemanticFailure: true,

  // Which worldviews to consult
  worldviews: 'all',  // or array of specific worldviews

  // Existing options
  includeMinorityViews: true,
  detailedJustification: true
};
```

**Usage:**

```javascript
const result = await deliberationOrchestrator.actions.deliberateOnScenario(scenario, {
  useSemanticAnalysis: true,
  semanticConfidenceThreshold: 0.5,  // Only use high-confidence semantic values
  worldviews: ['Materialism', 'Idealism', 'Rationalism']  // Consult subset
});
```

---

## 8. Error Handling & Graceful Degradation

### Failure Scenarios

1. **TagTeam bundle not available**
   - Fallback: Use keyword-based parsing only
   - Log warning
   - Continue deliberation

2. **TagTeam.parse() throws error**
   - Catch error
   - Fallback to keyword-based parsing
   - Log error details
   - Continue deliberation

3. **TagTeam detects 0 values**
   - Not an error - some scenarios may have no ethical content
   - Fallback to keyword matching
   - Continue deliberation

4. **Value mapping fails (no worldview match)**
   - Use TagTeam value as-is in metadata
   - Don't add to worldview evaluation
   - Log mapping failure for review

### Implementation

```javascript
async function runSemanticAnalysis(scenarioText) {
  try {
    const TagTeam = await import('../../collaborations/tagteam/dist/tagteam.js');
    const result = TagTeam.parse(scenarioText);

    // Validate result structure
    if (!result.ethicalProfile || !result.ethicalProfile.values) {
      throw new Error('Invalid TagTeam result structure');
    }

    return result;

  } catch (error) {
    console.warn('Semantic analysis failed, using keyword fallback:', error.message);
    return null;  // Graceful degradation
  }
}
```

---

## 9. Documentation Requirements

### 9.1 User Documentation

**File:** `docs/semantic-analysis.md`

```markdown
# Semantic Analysis Integration

The Integral Ethics Engine uses TagTeam.js for advanced semantic analysis of ethical scenarios.

## What is Semantic Analysis?

Semantic analysis enhances deliberation by:
- Detecting ethical values directly from text
- Identifying value conflicts automatically
- Suggesting appropriate ethical domains
- Providing richer context understanding

## How It Works

When you submit a scenario, the IEE:
1. Runs TagTeam semantic parser on your text
2. Detects ethical values (e.g., autonomy, justice, compassion)
3. Uses these values to inform worldview evaluations
4. Includes semantic insights in the final result

## Configuration

You can control semantic analysis:

```javascript
const result = await deliberate(scenario, {
  useSemanticAnalysis: true,  // Enable (default)
  semanticConfidenceThreshold: 0.3  // Minimum confidence
});
```

## Interpreting Results

Results include a `semanticAnalysis` section:

```javascript
{
  semanticAnalysis: {
    source: "TagTeam",
    version: "2.0",
    detectedValues: [
      {
        name: "Beneficence",
        salience: 0.83,
        polarity: 1,  // +1 = upheld, -1 = violated
        evidence: ["alleviate", "treatment"]
      }
    ],
    dominantDomain: "Care",
    confidence: 0.83
  }
}
```

## Limitations

- Semantic analysis detects values based on keywords and patterns
- Short scenarios may have fewer detected values
- Analysis works best with explicit ethical language
```

### 9.2 Developer Documentation

**File:** `docs/developer/tagteam-integration.md`

```markdown
# TagTeam Integration - Developer Guide

## Architecture

TagTeam enhances IEE's deliberation pipeline at 4 integration points:
1. Domain detection
2. Value matching
3. Conflict detection
4. Result metadata

See: [TAGTEAM_IEE_INTEGRATION_DESIGN.md](../../collaborations/tagteam/integration/TAGTEAM_IEE_INTEGRATION_DESIGN.md)

## Adding New Value Mappings

To map a new TagTeam value to worldview values:

1. Edit `src/concepts/valueMapper.js`
2. Add mapping to `tagteamToWorldviewValueMap`:

```javascript
export const tagteamToWorldviewValueMap = {
  'NewValue': ['worldview_value_1', 'worldview_value_2'],
  // ...
};
```

3. Write test in `testing/frameworks/unit-tests/value-mapper.test.js`
4. Run `npm test`

## Testing

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# Performance tests
npm run test:performance
```

## Debugging

Enable debug logging:

```javascript
const result = await deliberate(scenario, {
  debug: true,  // Logs semantic analysis steps
  useSemanticAnalysis: true
});
```
```

---

## 10. Success Metrics

### Integration Quality Metrics

1. **Value Detection Agreement**
   - Target: 80%+ overlap between TagTeam and worldview values
   - Measure: `(semantic ∩ worldview) / (semantic ∪ worldview)`

2. **Domain Detection Accuracy**
   - Target: 90%+ correct domain assignment
   - Measure: Manual validation on test corpus

3. **Performance Overhead**
   - Target: <50ms added to deliberation time
   - Measure: Benchmark tests

4. **Graceful Degradation**
   - Target: 100% success rate for keyword fallback
   - Measure: Failure scenario tests

5. **Conflict Detection Enhancement**
   - Target: 50%+ more conflicts detected
   - Measure: Before/after comparison on test scenarios

---

## 11. Appendix A: Complete File List

### New Files (6 files)

1. `src/concepts/valueMapper.js` (300 lines)
   - Maps TagTeam 50 values → worldview values

2. `src/concepts/semanticAnalyzer.js` (150 lines)
   - Wrapper for TagTeam.parse()

3. `testing/frameworks/unit-tests/tagteam-integration.test.js` (200 lines)
   - Unit tests for integration

4. `testing/frameworks/integration-tests/tagteam-deliberation.test.js` (150 lines)
   - End-to-end integration tests

5. `testing/frameworks/performance-tests/tagteam-overhead.test.js` (100 lines)
   - Performance benchmarks

6. `docs/semantic-analysis.md` (200 lines)
   - User documentation

### Modified Files (6 files)

1. `src/application/deliberationOrchestrator.js` (+200 lines)
   - Enhanced with semantic analysis pipeline

2. `src/concepts/moralReasoner.js` (+150 lines)
   - Enhanced value matching

3. `src/concepts/valueConflictResolver.js` (+100 lines)
   - Enhanced conflict detection

4. `src/application/schemas/deliberation-schemas.js` (+75 lines)
   - Added semantic analysis schema fields

5. `src/application/sessionManager.js` (+50 lines)
   - Store semantic metadata

6. `docs/developer/architecture.md` (+100 lines)
   - Updated architecture diagram

### Total Code Impact

- **New Code:** ~900 lines
- **Modified Code:** ~675 lines
- **Total:** ~1,575 lines
- **Test Code:** ~450 lines

---

## 12. Appendix B: Example Scenarios

### Example 1: Healthcare Scenario

**Input:**
```javascript
const scenario = {
  description: "A doctor provides evidence-based medical treatment to alleviate patient suffering."
};
```

**TagTeam Output:**
```javascript
{
  agent: { text: "doctor", type: "professional" },
  action: { verb: "provides" },
  ethicalProfile: {
    values: [
      { name: "Beneficence", salience: 0.83, polarity: 1 },
      { name: "Non-maleficence", salience: 0.53, polarity: 1 }
    ],
    dominantDomain: "Care"
  }
}
```

**IEE Enhanced Scenario:**
```javascript
{
  description: "A doctor provides...",
  domain: "healthcare",  // From TagTeam suggestion

  semanticAnalysis: {
    detectedValues: [
      { name: "Beneficence", salience: 0.83, polarity: 1, domain: "Care" },
      { name: "Non-maleficence", salience: 0.53, polarity: 1, domain: "Care" }
    ],
    dominantDomain: "Care"
  }
}
```

**Worldview Evaluation (Materialism):**
```javascript
{
  worldview: "Materialism",
  judgment: "permissible",
  confidence: 0.9,
  values: [
    {
      value: "physical_wellbeing",
      type: "terminal",
      salience: "high",
      source: "semantic_detection",  // From TagTeam
      tagteamValue: "Beneficence",
      polarity: 1
    }
  ]
}
```

### Example 2: Conflict Scenario

**Input:**
```javascript
const scenario = {
  description: "A patient refuses life-saving treatment, but the family wants the doctor to proceed."
};
```

**TagTeam Output:**
```javascript
{
  ethicalProfile: {
    values: [
      { name: "Autonomy", salience: 0.9, polarity: -1 },  // Violated
      { name: "Beneficence", salience: 0.8, polarity: 1 }   // Upheld
    ],
    conflicts: [
      { value1: "Autonomy", value2: "Beneficence", tension: 0.85 }
    ],
    conflictScore: 0.85
  }
}
```

**IEE Conflict Detection:**
```javascript
{
  conflicts: [
    {
      type: "semantic_value_conflict",
      description: "TagTeam detected value tensions",
      values: [
        { value1: "Autonomy", value2: "Beneficence", tension: 0.85 }
      ],
      source: "semantic_analysis"
    },
    {
      type: "polarity_conflict",
      description: "Some values upheld while others violated",
      upheld: ["Beneficence"],
      violated: ["Autonomy"],
      source: "semantic_analysis"
    },
    {
      type: "judgment",
      worldviews: ["Materialism", "Spiritualism", ...],
      positions: {
        permissible: ["Materialism", ...],
        impermissible: ["Idealism", ...]
      }
    }
  ]
}
```

---

## 13. Next Steps

### Immediate Actions

1. **Review this design** with IEE team
2. **Approve value mappings** (50 TagTeam values → worldview values)
3. **Clarify worldview value terminology** (if needed)
4. **Schedule Phase 1 kickoff**

### Phase 1 Deliverables (Week 1)

- Value mapper module
- Semantic analyzer wrapper
- Unit tests
- Schema updates

### Questions for IEE Team

1. Are the value mappings accurate for IEE worldviews?
2. Should semantic analysis be enabled by default?
3. What confidence threshold for semantic values? (0.3 proposed)
4. Any concerns about 50ms performance overhead?

---

**Status:** Ready for Implementation
**Approval Needed:** IEE Team Review
**Next Milestone:** Phase 1 Kickoff (Week 1)

---

*Document Version: 1.0.0*
*Last Updated: January 18, 2026*
*Author: Integration Design Team*
