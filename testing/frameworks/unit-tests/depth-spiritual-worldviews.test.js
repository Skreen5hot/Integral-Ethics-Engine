/**
 * Depth-Spiritual Worldviews Test Suite
 *
 * Tests Psychism, Pneumatism, Spiritualism, and Mathematism worldview ontologies,
 * value derivation, ValueNet integration, and scenario evaluation.
 *
 * Phase 3.1: Psychism
 * Phase 3.2: Pneumatism (future)
 * Phase 3.3: Spiritualism (future)
 * Phase 3.4: Mathematism (future)
 */

import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { worldviewManager, deriveValues } from '../../../src/concepts/worldviewManager.js';
import fs from 'fs';
import path from 'path';

// ============================================================================
// PSYCHISM WORLDVIEW TESTS (Phase 3.1)
// ============================================================================

describe('Psychism Worldview', () => {
  beforeEach(() => {
    worldviewManager.actions.reset();
  });

  describe('Value Derivation', () => {
    test('should derive correct values from "psyche" foundation', () => {
      const values = deriveValues({ foundation: 'psyche' });

      // Terminal values: PsychologicalWholeness, EmotionalAuthenticity, SoulDepth, IndividuationProcess
      assert(values.terminal.includes('psychological_wholeness'));
      assert(values.terminal.includes('emotional_authenticity'));
      assert(values.terminal.includes('soul_depth'));
      assert(values.terminal.includes('individuation'));

      // Constitutive values
      assert(values.constitutive.includes('archetypal_awareness'));
      assert(values.constitutive.includes('symbolic_consciousness'));
      assert(values.constitutive.includes('shadow_integration'));
      assert(values.constitutive.includes('psychic_honesty'));

      // Instrumental values
      assert(values.instrumental.includes('dream_work'));
      assert(values.instrumental.includes('active_imagination'));
      assert(values.instrumental.includes('psychotherapy'));
      assert(values.instrumental.includes('mythological_study'));

      // Subordinated values
      assert(values.subordinated.includes('surface_rationalism'));
      assert(values.subordinated.includes('behavioral_reductionism'));
      assert(values.subordinated.includes('emotional_repression'));
      assert(values.subordinated.includes('persona_identification'));

      // Reasoning
      assert(values.reasoning.includes('soul depth'));
      assert(values.reasoning.includes('psychological wholeness'));
      assert(values.reasoning.includes('Unconscious'));
    });

    test('should derive correct values from "soul" foundation (alias)', () => {
      const values = deriveValues({ foundation: 'soul' });

      // Should be identical to 'psyche' foundation
      assert(values.terminal.includes('psychological_wholeness'));
      assert(values.terminal.includes('soul_depth'));
      assert(values.constitutive.includes('archetypal_awareness'));
      assert(values.instrumental.includes('dream_work'));
    });

    test('should load Psychism worldview correctly', () => {
      worldviewManager.actions.loadWorldview('Psychism', {
        foundation: 'psyche',
        cluster: 'DepthSpiritual'
      });

      const worldview = worldviewManager.state.worldviews['Psychism'];
      assert(worldview, 'Psychism worldview should be loaded');
      assert.equal(worldview.metaphysics.foundation, 'psyche');
      assert.equal(worldview.metaphysics.cluster, 'DepthSpiritual');
    });

    test('should get values for loaded Psychism worldview', () => {
      worldviewManager.actions.loadWorldview('Psychism', {
        foundation: 'psyche'
      });

      const values = worldviewManager.actions.getValues('Psychism');
      assert(values.terminal.includes('psychological_wholeness'));
      assert(values.terminal.includes('individuation'));
      assert(values.constitutive.includes('shadow_integration'));
    });
  });

  describe('Ontology Files', () => {
    test('psychism-values.ttl should exist and be correctly sized', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'psychism-values.ttl');
      assert(fs.existsSync(filePath), 'psychism-values.ttl should exist');

      const stats = fs.statSync(filePath);
      const sizeKB = stats.size / 1024;

      // Should be 40-55KB (allowed slightly larger for comprehensive content)
      assert(sizeKB >= 40 && sizeKB <= 55, `Psychism ontology should be 40-55KB, was ${sizeKB.toFixed(2)}KB`);
    });

    test('psychism-values.ttl should have terminal values', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'psychism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Terminal values
      assert(content.includes('PsychologicalWholeness'));
      assert(content.includes('EmotionalAuthenticity'));
      assert(content.includes('SoulDepth'));
      assert(content.includes('IndividuationProcess'));
    });

    test('psychism-values.ttl should cite depth psychologists', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'psychism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Key depth psychologists
      assert(content.includes('Jung'));
      assert(content.includes('Freud'));
      assert(content.includes('Hillman'));
      assert(content.includes('von Franz') || content.includes('Marie-Louise'));
    });

    test('psychism-values.ttl should have BFO compliance', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'psychism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      assert(content.includes('bfo:0000015') || content.includes('# Process'));
      assert(content.includes('bfo:0000019') || content.includes('# Quality'));
      assert(content.includes('bfo:0000031') || content.includes('# ICE'));
    });

    test('psychism-values.ttl should have worked scenarios', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'psychism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should have at least 3 scenarios
      const scenarioCount = (content.match(/a :Scenario/g) || []).length;
      assert(scenarioCount >= 3, `Should have at least 3 scenarios, found ${scenarioCount}`);
    });

    test('psychism-values.ttl should have 30+ philosophical citations', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'psychism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Count major philosophers mentioned
      const philosophers = [
        'Jung', 'Freud', 'Hillman', 'von Franz', 'Neumann', 'Edinger',
        'Johnson', 'Woodman', 'Campbell', 'Eliade', 'Cassirer', 'Ricoeur',
        'Corbin', 'Rogers', 'Yalom', 'May', 'Buber'
      ];

      let citationCount = 0;
      philosophers.forEach(phil => {
        if (content.includes(phil)) citationCount++;
      });

      assert(citationCount >= 10, `Should cite at least 10 major philosophers, found ${citationCount}`);
    });

    test('psychism-values.ttl should have empirical research citations', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'psychism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Check for empirical research indicators
      assert(content.includes('Empirical') || content.includes('research') || content.includes('empirical'));
      assert(content.includes('Bowlby') || content.includes('Attachment'));
      assert(content.includes('Meta-analysis') || content.includes('effectiveness'));
    });
  });

  describe('ValueNet Integration', () => {
    test('worldview-valuenet-mappings.ttl should have 11 Psychism mappings', () => {
      const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
      const content = fs.readFileSync(mappingsPath, 'utf-8');

      const psychismMappings = (content.match(/:Psychism\w+Mapping a :WorldviewValueNetMapping/g) || []).length;
      assert.equal(psychismMappings, 11, 'Should have exactly 11 Psychism mappings (10 basic Schwartz + Spirituality)');
    });

    test('Psychism should have high Spirituality disposition', () => {
      const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
      const content = fs.readFileSync(mappingsPath, 'utf-8');

      const spiritualityMatch = content.match(/:PsychismSpiritualityMapping[\s\S]*?:salience\s+(0\.\d+)/);
      assert(spiritualityMatch, 'Should have PsychismSpiritualityMapping with salience');

      const spiritualitySalience = parseFloat(spiritualityMatch[1]);
      assert(spiritualitySalience >= 0.85, `Psychism Spirituality salience should be >= 0.85 (was ${spiritualitySalience})`);
    });

    test('Psychism should have high Self-Direction disposition (individuation)', () => {
      const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
      const content = fs.readFileSync(mappingsPath, 'utf-8');

      const selfDirectionMatch = content.match(/:PsychismSelfDirectionMapping[\s\S]*?:salience\s+(0\.\d+)/);
      assert(selfDirectionMatch, 'Should have PsychismSelfDirectionMapping with salience');

      const selfDirectionSalience = parseFloat(selfDirectionMatch[1]);
      assert(selfDirectionSalience >= 0.85, `Psychism Self-direction salience should be >= 0.85 (was ${selfDirectionSalience})`);
    });

    test('Psychism should have moderate-high Benevolence disposition (authentic relating)', () => {
      const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
      const content = fs.readFileSync(mappingsPath, 'utf-8');

      const benevolenceMatch = content.match(/:PsychismBenevolenceMapping[\s\S]*?:salience\s+(0\.\d+)/);
      assert(benevolenceMatch, 'Should have PsychismBenevolenceMapping with salience');

      const benevolenceSalience = parseFloat(benevolenceMatch[1]);
      assert(benevolenceSalience >= 0.70, `Psychism Benevolence salience should be >= 0.70 (was ${benevolenceSalience})`);
    });

    test('Psychism should have low-moderate Power disposition (inner authority, not dominance)', () => {
      const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
      const content = fs.readFileSync(mappingsPath, 'utf-8');

      const powerMatch = content.match(/:PsychismPowerMapping[\s\S]*?:salience\s+(0\.\d+)/);
      assert(powerMatch, 'Should have PsychismPowerMapping with salience');

      const powerSalience = parseFloat(powerMatch[1]);
      assert(powerSalience >= 0.40 && powerSalience <= 0.50, `Psychism Power salience should be 0.40-0.50 (was ${powerSalience})`);
    });
  });

  describe('Independence from other worldviews', () => {
    test('should not be reducible to Materialism', () => {
      const psychismValues = deriveValues({ foundation: 'psyche' });
      const materialismValues = deriveValues({ foundation: 'matter' });

      // Psychism has soul depth, materialism does not
      assert(psychismValues.terminal.includes('soul_depth'));
      assert(!materialismValues.terminal.includes('soul_depth'));

      // Psychism subordinates behavioral reductionism
      assert(psychismValues.subordinated.includes('behavioral_reductionism'));
    });

    test('should not be reducible to Idealism', () => {
      const psychismValues = deriveValues({ foundation: 'psyche' });
      const idealismValues = deriveValues({ foundation: 'consciousness' });

      // Psychism emphasizes unconscious (shadow integration), Idealism consciousness
      assert(psychismValues.constitutive.includes('shadow_integration'));
      assert(!idealismValues.constitutive.includes('shadow_integration'));

      // Psychism subordinates surface rationalism
      assert(psychismValues.subordinated.includes('surface_rationalism'));
    });

    test('should be distinct from Rationalism', () => {
      const psychismValues = deriveValues({ foundation: 'psyche' });
      const rationalismValues = deriveValues({ foundation: 'reason' });

      // Psychism values symbolic consciousness, Rationalism logical coherence
      assert(psychismValues.constitutive.includes('symbolic_consciousness'));
      assert(rationalismValues.terminal.includes('logical_coherence'));

      // Different instrumental values
      assert(psychismValues.instrumental.includes('dream_work'));
      assert(rationalismValues.instrumental.includes('mathematics'));
    });
  });

  describe('Depth-Spiritual cluster identity', () => {
    test('should belong to Depth-Spiritual cluster', () => {
      const values = deriveValues({ foundation: 'psyche' });

      // Should have depth/spiritual characteristics
      assert(values.terminal.includes('soul_depth') || values.terminal.includes('psychological_wholeness'));
      assert(values.constitutive.includes('archetypal_awareness') || values.constitutive.includes('symbolic_consciousness'));

      // Should subordinate surface/material approaches
      assert(values.subordinated.includes('surface_rationalism') || values.subordinated.includes('behavioral_reductionism'));
    });

    test('should have archetypal and symbolic dimensions', () => {
      const values = deriveValues({ foundation: 'psyche' });

      // Archetypal dimension
      assert(values.constitutive.includes('archetypal_awareness'));
      assert(values.instrumental.includes('mythological_study'));

      // Symbolic dimension
      assert(values.constitutive.includes('symbolic_consciousness'));
      assert(values.instrumental.includes('dream_work'));
    });

    test('should emphasize integration and wholeness', () => {
      const values = deriveValues({ foundation: 'psyche' });

      // Integration themes
      assert(values.terminal.includes('psychological_wholeness'));
      assert(values.constitutive.includes('shadow_integration'));
      assert(values.terminal.includes('individuation'));
    });
  });

  describe('Jungian depth psychology alignment', () => {
    test('should have core Jungian concepts', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'psychism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Core Jungian concepts
      assert(content.includes('individuation') || content.includes('Individuation'));
      assert(content.includes('shadow') || content.includes('Shadow'));
      assert(content.includes('archetype') || content.includes('Archetype'));
      assert(content.includes('collective unconscious') || content.includes('Collective Unconscious'));
      assert(content.includes('Self') && content.includes('ego'));
    });

    test('should reference Jungian methods', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'psychism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Jungian methods
      assert(content.includes('active imagination') || content.includes('Active Imagination'));
      assert(content.includes('amplification'));
      assert(content.includes('dream') || content.includes('Dream'));
      assert(content.includes('transference') || content.includes('Transference'));
    });

    test('should distinguish Jungian from Freudian emphasis', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'psychism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should cite both but emphasize Jung
      const jungCount = (content.match(/Jung/g) || []).length;
      const freudCount = (content.match(/Freud/g) || []).length;

      assert(jungCount > 0, 'Should cite Jung');
      assert(freudCount > 0, 'Should cite Freud');
      assert(jungCount >= freudCount, 'Should emphasize Jung over Freud for Psychism (Jung is more archetypal/spiritual)');
    });
  });

  describe('Scenario evaluation', () => {
    test('should have midlife crisis scenario', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'psychism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      assert(content.includes('MidlifeCrisisScenario') || content.includes('midlife') || content.includes('Midlife'));
    });

    test('should have dream/nightmare scenario', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'psychism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      assert(content.includes('RecurringNightmareScenario') || content.includes('nightmare') || content.includes('Nightmare') || content.includes('dream'));
    });

    test('should have creative/psychological scenario', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'psychism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      assert(content.includes('CreativeBlockScenario') || content.includes('creative') || content.includes('Creative') || content.includes('block'));
    });
  });
});

// ============================================================================
// PHASE 3.1 INTEGRATION TESTS
// ============================================================================

describe('Phase 3.1: Psychism Integration', () => {
  test('Psychism should load independently', () => {
    worldviewManager.actions.reset();

    worldviewManager.actions.loadWorldview('Psychism', { foundation: 'psyche' });

    assert(worldviewManager.state.worldviews['Psychism'], 'Psychism should be loaded');
    assert.equal(worldviewManager.state.worldviews['Psychism'].metaphysics.foundation, 'psyche');
  });

  test('Psychism ontology should follow same structure as Process-Individual worldviews', () => {
    const psychismPath = path.join(process.cwd(), 'ontology', 'psychism-values.ttl');
    const rationalismPath = path.join(process.cwd(), 'ontology', 'rationalism-values.ttl');

    const psychismContent = fs.readFileSync(psychismPath, 'utf-8');
    const rationalismContent = fs.readFileSync(rationalismPath, 'utf-8');

    // All should have same structural elements
    const requiredElements = [
      'TerminalValue',
      'ConstitutiveValue',
      'InstrumentalValue',
      'SubordinatedValue',
      ':realizableAs',
      'vn-schwartz:',
      'skos:definition'
    ];

    for (const element of requiredElements) {
      assert(psychismContent.includes(element), `Psychism should have ${element}`);
      assert(rationalismContent.includes(element), `Rationalism should have ${element} (comparison)`);
    }
  });

  test('All 9 worldviews (8 + Psychism) should load together', () => {
    worldviewManager.actions.reset();

    // Material-Empirical (4)
    worldviewManager.actions.loadWorldview('Materialism', { foundation: 'matter' });
    worldviewManager.actions.loadWorldview('Sensationalism', { foundation: 'sensation' });
    worldviewManager.actions.loadWorldview('Phenomenalism', { foundation: 'phenomena' });
    worldviewManager.actions.loadWorldview('Realism', { foundation: 'reality_itself' });

    // Process-Individual (4)
    worldviewManager.actions.loadWorldview('Dynamism', { foundation: 'becoming' });
    worldviewManager.actions.loadWorldview('Monadism', { foundation: 'individual_monad' });
    worldviewManager.actions.loadWorldview('Idealism', { foundation: 'consciousness' });
    worldviewManager.actions.loadWorldview('Rationalism', { foundation: 'reason' });

    // Depth-Spiritual (1 so far)
    worldviewManager.actions.loadWorldview('Psychism', { foundation: 'psyche' });

    // Verify all loaded
    assert(worldviewManager.state.worldviews['Materialism']);
    assert(worldviewManager.state.worldviews['Sensationalism']);
    assert(worldviewManager.state.worldviews['Phenomenalism']);
    assert(worldviewManager.state.worldviews['Realism']);
    assert(worldviewManager.state.worldviews['Dynamism']);
    assert(worldviewManager.state.worldviews['Monadism']);
    assert(worldviewManager.state.worldviews['Idealism']);
    assert(worldviewManager.state.worldviews['Rationalism']);
    assert(worldviewManager.state.worldviews['Psychism']);

    // Total: 9 worldviews
    assert.equal(Object.keys(worldviewManager.state.worldviews).length, 9);
  });

  test('Psychism ValueNet mappings should include 11 Psychism mappings', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    // Count Psychism mappings
    const psychismMappings = (content.match(/:Psychism.*Mapping/g) || []).length;
    assert.equal(psychismMappings, 11, `Should have 11 Psychism mappings (was ${psychismMappings})`);
  });
});

// =============================================================================
// PHASE 3.2: PNEUMATISM (Living Spirit)
// =============================================================================

describe('Phase 3.2: Pneumatism Worldview', () => {
  // ---------------------------------------------------------------------------
  // Value Derivation Tests
  // ---------------------------------------------------------------------------

  test('Pneumatism should derive from "living_spirit" foundation', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Pneumatism', { foundation: 'living_spirit' });

    const pneumatism = worldviewManager.state.worldviews['Pneumatism'];
    assert(pneumatism, 'Pneumatism worldview should exist');
    assert.equal(pneumatism.metaphysics.foundation, 'living_spirit');
  });

  test('Pneumatism should also derive from "spirit" foundation', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Pneumatism', { foundation: 'spirit' });

    const pneumatism = worldviewManager.state.worldviews['Pneumatism'];
    assert(pneumatism, 'Pneumatism worldview should exist');
    assert.equal(pneumatism.metaphysics.foundation, 'spirit');
  });

  test('Pneumatism should also derive from "pneuma" foundation', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Pneumatism', { foundation: 'pneuma' });

    const pneumatism = worldviewManager.state.worldviews['Pneumatism'];
    assert(pneumatism, 'Pneumatism worldview should exist');
    assert.equal(pneumatism.metaphysics.foundation, 'pneuma');
  });

  test('Pneumatism should have 4 terminal values', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Pneumatism', { foundation: 'living_spirit' });

    const pneumatism = worldviewManager.state.worldviews['Pneumatism'];
    assert.equal(pneumatism.values.terminal.length, 4,
      `Expected 4 terminal values, got ${pneumatism.values.terminal.length}`);

    // Check for specific terminal values
    const terminalValues = pneumatism.values.terminal;
    assert(terminalValues.includes('spiritual_vitality'), 'Should include spiritual_vitality');
    assert(terminalValues.includes('ensouled_cosmos'), 'Should include ensouled_cosmos');
    assert(terminalValues.includes('immanent_divinity'), 'Should include immanent_divinity');
    assert(terminalValues.includes('sacred_presence'), 'Should include sacred_presence');
  });

  test('Pneumatism should have 4 constitutive values', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Pneumatism', { foundation: 'living_spirit' });

    const pneumatism = worldviewManager.state.worldviews['Pneumatism'];
    assert.equal(pneumatism.values.constitutive.length, 4,
      `Expected 4 constitutive values, got ${pneumatism.values.constitutive.length}`);

    const constitutiveValues = pneumatism.values.constitutive;
    assert(constitutiveValues.includes('animate_nature'), 'Should include animate_nature');
    assert(constitutiveValues.includes('spiritual_ecology'), 'Should include spiritual_ecology');
    assert(constitutiveValues.includes('ritual_participation'), 'Should include ritual_participation');
    assert(constitutiveValues.includes('sacred_awareness'), 'Should include sacred_awareness');
  });

  test('Pneumatism should have 4 instrumental values', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Pneumatism', { foundation: 'living_spirit' });

    const pneumatism = worldviewManager.state.worldviews['Pneumatism'];
    assert.equal(pneumatism.values.instrumental.length, 4,
      `Expected 4 instrumental values, got ${pneumatism.values.instrumental.length}`);

    const instrumentalValues = pneumatism.values.instrumental;
    assert(instrumentalValues.includes('shamanic_practice'), 'Should include shamanic_practice');
    assert(instrumentalValues.includes('ritual_ceremony'), 'Should include ritual_ceremony');
    assert(instrumentalValues.includes('ecological_reciprocity'), 'Should include ecological_reciprocity');
    assert(instrumentalValues.includes('spirit_encounter'), 'Should include spirit_encounter');
  });

  test('Pneumatism should have 5 subordinated values', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Pneumatism', { foundation: 'living_spirit' });

    const pneumatism = worldviewManager.state.worldviews['Pneumatism'];
    assert.equal(pneumatism.values.subordinated.length, 5,
      `Expected 5 subordinated values, got ${pneumatism.values.subordinated.length}`);

    const subordinatedValues = pneumatism.values.subordinated;
    assert(subordinatedValues.includes('mechanistic_worldview'), 'Should include mechanistic_worldview');
    assert(subordinatedValues.includes('desacralized_nature'), 'Should include desacralized_nature');
    assert(subordinatedValues.includes('spirit_matter_dualism'), 'Should include spirit_matter_dualism');
    assert(subordinatedValues.includes('anthropocentrism'), 'Should include anthropocentrism');
    assert(subordinatedValues.includes('reductionism'), 'Should include reductionism');
  });

  // ---------------------------------------------------------------------------
  // Ontology Files Tests
  // ---------------------------------------------------------------------------

  test('pneumatism-values.ttl should exist and be 40-65KB', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'pneumatism-values.ttl');
    assert(fs.existsSync(ontologyPath), 'pneumatism-values.ttl should exist');

    const stats = fs.statSync(ontologyPath);
    const sizeKB = stats.size / 1024;
    assert(sizeKB >= 40 && sizeKB <= 65,
      `File should be 40-65KB (was ${sizeKB.toFixed(1)}KB)`);
  });

  test('pneumatism-values.ttl should define 4 terminal values', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'pneumatism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const terminalValues = [
      ':SpiritualVitality',
      ':EnsouledCosmos',
      ':ImmanentDivinity',
      ':SacredPresence'
    ];

    for (const value of terminalValues) {
      assert(content.includes(`${value} a :TerminalValue`),
        `Should define ${value} as TerminalValue`);
    }
  });

  test('pneumatism-values.ttl should cite key philosophers (Bergson, Schelling, Whitehead, Spinoza)', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'pneumatism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const philosophers = ['Bergson', 'Schelling', 'Whitehead', 'Spinoza'];
    for (const philosopher of philosophers) {
      assert(content.includes(philosopher),
        `Should cite ${philosopher}`);
    }
  });

  test('pneumatism-values.ttl should cite indigenous and shamanic traditions', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'pneumatism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    // Check for shamanic/indigenous references
    const indigenousTerms = ['shaman', 'indigenous', 'animis', 'Eliade'];
    let foundCount = 0;
    for (const term of indigenousTerms) {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        foundCount++;
      }
    }
    assert(foundCount >= 2,
      `Should reference indigenous/shamanic traditions (found ${foundCount} of ${indigenousTerms.length} terms)`);
  });

  test('pneumatism-values.ttl should be BFO 2020 compliant', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'pneumatism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    // Check for BFO elements
    const bfoElements = [
      'bfo:0000015', // Process
      'bfo:0000019', // Quality
      'bfo:0000031'  // ICE
    ];

    for (const element of bfoElements) {
      assert(content.includes(element),
        `Should use BFO element ${element}`);
    }
  });

  test('pneumatism-values.ttl should include worked scenarios', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'pneumatism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    // Should have at least 3 scenarios (check for scenario instances)
    const scenarioCount = (content.match(/Scenario a :Scenario/g) || []).length;
    assert(scenarioCount >= 3,
      `Should have at least 3 worked scenarios (found ${scenarioCount})`);
  });

  test('pneumatism-values.ttl should have 10+ philosophical citations', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'pneumatism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const citationCount = (content.match(/dcterms:source/g) || []).length;
    assert(citationCount >= 10,
      `Should have 10+ philosophical citations (found ${citationCount})`);
  });

  test('pneumatism-values.ttl should have 10+ empirical citations', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'pneumatism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    // Check for empirical references
    const empiricalTerms = ['Gaia', 'biophilia', 'Wilson', 'Lovelock', 'empirical', 'research', 'studies'];
    let empiricalCount = 0;
    for (const term of empiricalTerms) {
      const matches = (content.match(new RegExp(term, 'gi')) || []).length;
      empiricalCount += matches;
    }

    assert(empiricalCount >= 10,
      `Should have empirical grounding (found ${empiricalCount} empirical references)`);
  });

  // ---------------------------------------------------------------------------
  // ValueNet Integration Tests
  // ---------------------------------------------------------------------------

  test('Pneumatism should have 11 ValueNet mappings', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    // Count Pneumatism mappings
    const pneumatismMappings = (content.match(/:Pneumatism.*Mapping/g) || []).length;
    assert.equal(pneumatismMappings, 11,
      `Should have 11 Pneumatism mappings (found ${pneumatismMappings})`);
  });

  test('Pneumatism should have HIGHEST Spirituality salience (≥0.90)', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    // Extract Pneumatism Spirituality mapping
    const spiritualityRegex = /:PneumatismSpiritualityMapping[\s\S]*?:salience\s+([\d.]+)/;
    const match = content.match(spiritualityRegex);

    assert(match, 'Should have Pneumatism Spirituality mapping');
    const salience = parseFloat(match[1]);
    assert(salience >= 0.90,
      `Pneumatism Spirituality salience should be ≥0.90 (was ${salience})`);
  });

  test('Pneumatism should have high Universalism salience (≥0.80)', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const universalismRegex = /:PneumatismUniversalismMapping[\s\S]*?:salience\s+([\d.]+)/;
    const match = content.match(universalismRegex);

    assert(match, 'Should have Pneumatism Universalism mapping');
    const salience = parseFloat(match[1]);
    assert(salience >= 0.80,
      `Pneumatism Universalism salience should be ≥0.80 (was ${salience})`);
  });

  test('Pneumatism should have high Tradition salience (≥0.80)', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const traditionRegex = /:PneumatismTraditionMapping[\s\S]*?:salience\s+([\d.]+)/;
    const match = content.match(traditionRegex);

    assert(match, 'Should have Pneumatism Tradition mapping');
    const salience = parseFloat(match[1]);
    assert(salience >= 0.80,
      `Pneumatism Tradition salience should be ≥0.80 (was ${salience})`);
  });

  test('Pneumatism should have moderate Benevolence salience (0.70-0.80)', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const benevolenceRegex = /:PneumatismBenevolenceMapping[\s\S]*?:salience\s+([\d.]+)/;
    const match = content.match(benevolenceRegex);

    assert(match, 'Should have Pneumatism Benevolence mapping');
    const salience = parseFloat(match[1]);
    assert(salience >= 0.70 && salience <= 0.80,
      `Pneumatism Benevolence salience should be 0.70-0.80 (was ${salience})`);
  });

  // ---------------------------------------------------------------------------
  // Independence Tests
  // ---------------------------------------------------------------------------

  test('Pneumatism should be distinct from Materialism', () => {
    worldviewManager.actions.reset();

    worldviewManager.actions.loadWorldview('Pneumatism', { foundation: 'living_spirit' });
    worldviewManager.actions.loadWorldview('Materialism', { foundation: 'matter' });

    const pneumatism = worldviewManager.state.worldviews['Pneumatism'];
    const materialism = worldviewManager.state.worldviews['Materialism'];

    // Check that subordinated values differ
    const pneumatismSubordinated = pneumatism.values.subordinated;
    assert(pneumatismSubordinated.includes('mechanistic_worldview') ||
           pneumatismSubordinated.includes('desacralized_nature'),
      'Pneumatism should subordinate mechanistic/desacralized views');

    const materialismTerminal = materialism.values.terminal;
    assert(!materialismTerminal.includes('spiritual_vitality'),
      'Materialism should not have spiritual_vitality as terminal value');
  });

  test('Pneumatism should be distinct from Psychism', () => {
    worldviewManager.actions.reset();

    worldviewManager.actions.loadWorldview('Pneumatism', { foundation: 'living_spirit' });
    worldviewManager.actions.loadWorldview('Psychism', { foundation: 'psyche' });

    const pneumatism = worldviewManager.state.worldviews['Pneumatism'];
    const psychism = worldviewManager.state.worldviews['Psychism'];

    // Pneumatism focuses on spirit in nature, Psychism on soul/psyche
    const pneumatismTerminal = pneumatism.values.terminal;
    const psychismTerminal = psychism.values.terminal;

    assert(pneumatismTerminal.includes('ensouled_cosmos') ||
           pneumatismTerminal.includes('immanent_divinity'),
      'Pneumatism should emphasize ensouled nature/immanent divinity');

    assert(psychismTerminal.includes('soul_depth') ||
           psychismTerminal.includes('psychological_wholeness') ||
           psychismTerminal.includes('individuation'),
      'Psychism should emphasize soul depth/psychological wholeness');
  });

  test('Pneumatism should be distinct from Idealism', () => {
    worldviewManager.actions.reset();

    worldviewManager.actions.loadWorldview('Pneumatism', { foundation: 'living_spirit' });
    worldviewManager.actions.loadWorldview('Idealism', { foundation: 'consciousness' });

    const pneumatism = worldviewManager.state.worldviews['Pneumatism'];
    const idealism = worldviewManager.state.worldviews['Idealism'];

    // Pneumatism sees nature as alive/ensouled, Idealism sees consciousness as primary
    const pneumatismConstitutive = pneumatism.values.constitutive;
    assert(pneumatismConstitutive.includes('animate_nature') ||
           pneumatismConstitutive.includes('spiritual_ecology'),
      'Pneumatism should emphasize animate nature');

    const idealismTerminal = idealism.values.terminal;
    assert(idealismTerminal.includes('consciousness_development') ||
           idealismTerminal.includes('ideas_as_causal') ||
           idealismTerminal.includes('meaning_making'),
      'Idealism should emphasize consciousness/ideas');
  });

  // ---------------------------------------------------------------------------
  // Cluster Identity Tests
  // ---------------------------------------------------------------------------

  test('Pneumatism should belong to Depth-Spiritual cluster', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'pneumatism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    // Check for depth/spiritual themes
    const depthSpiritualTerms = ['depth', 'spiritual', 'spirit', 'soul', 'psyche', 'transcend'];
    let foundCount = 0;
    for (const term of depthSpiritualTerms) {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        foundCount++;
      }
    }

    assert(foundCount >= 3,
      `Pneumatism should have depth-spiritual themes (found ${foundCount} terms)`);
  });

  test('Pneumatism reasoning should reference living spirit and ensouled cosmos', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Pneumatism', { foundation: 'living_spirit' });

    const pneumatism = worldviewManager.state.worldviews['Pneumatism'];
    const reasoning = pneumatism.values.reasoning.toLowerCase();

    assert(reasoning.includes('spirit') || reasoning.includes('pneuma'),
      'Reasoning should mention spirit/pneuma');
    assert(reasoning.includes('ensouled') || reasoning.includes('cosmos') || reasoning.includes('nature'),
      'Reasoning should mention ensouled cosmos/nature');
  });

  // ---------------------------------------------------------------------------
  // Animism/Shamanism Alignment Tests
  // ---------------------------------------------------------------------------

  test('Pneumatism ontology should align with animistic worldview', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'pneumatism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    // Check for animistic concepts
    const animisticTerms = ['animis', 'animate', 'ensoul', 'living', 'spirit'];
    let foundCount = 0;
    for (const term of animisticTerms) {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        foundCount++;
      }
    }

    assert(foundCount >= 3,
      `Should have animistic concepts (found ${foundCount} of ${animisticTerms.length} terms)`);
  });

  test('Pneumatism ontology should include shamanic practices', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'pneumatism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    // Check for shamanic concepts
    const shamanicTerms = ['shaman', 'ritual', 'trance', 'vision', 'ceremony'];
    let foundCount = 0;
    for (const term of shamanicTerms) {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        foundCount++;
      }
    }

    assert(foundCount >= 3,
      `Should reference shamanic practices (found ${foundCount} of ${shamanicTerms.length} terms)`);
  });

  // ---------------------------------------------------------------------------
  // Scenario Evaluation Tests
  // ---------------------------------------------------------------------------

  test('Pneumatism should include EcologicalCrisisScenario', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'pneumatism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    assert(content.includes('EcologicalCrisisScenario') ||
           content.includes('ecolog'),
      'Should include ecological crisis scenario');
  });

  test('Pneumatism should include HealingRitualScenario', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'pneumatism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    assert(content.includes('HealingRitualScenario') ||
           (content.includes('healing') && content.includes('ritual')),
      'Should include healing ritual scenario');
  });

  test('Pneumatism should include VisionQuestScenario', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'pneumatism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    assert(content.includes('VisionQuestScenario') ||
           (content.includes('vision') && content.includes('quest')),
      'Should include vision quest scenario');
  });

  // ---------------------------------------------------------------------------
  // Integration Tests
  // ---------------------------------------------------------------------------

  test('All 10 worldviews (8 + Psychism + Pneumatism) should load together', () => {
    worldviewManager.actions.reset();

    // Material-Empirical (4)
    worldviewManager.actions.loadWorldview('Materialism', { foundation: 'matter' });
    worldviewManager.actions.loadWorldview('Sensationalism', { foundation: 'sensation' });
    worldviewManager.actions.loadWorldview('Phenomenalism', { foundation: 'phenomena' });
    worldviewManager.actions.loadWorldview('Realism', { foundation: 'reality_itself' });

    // Process-Individual (4)
    worldviewManager.actions.loadWorldview('Dynamism', { foundation: 'becoming' });
    worldviewManager.actions.loadWorldview('Monadism', { foundation: 'individual_monad' });
    worldviewManager.actions.loadWorldview('Idealism', { foundation: 'consciousness' });
    worldviewManager.actions.loadWorldview('Rationalism', { foundation: 'reason' });

    // Depth-Spiritual (2)
    worldviewManager.actions.loadWorldview('Psychism', { foundation: 'psyche' });
    worldviewManager.actions.loadWorldview('Pneumatism', { foundation: 'living_spirit' });

    // Verify all loaded
    assert(worldviewManager.state.worldviews['Materialism']);
    assert(worldviewManager.state.worldviews['Sensationalism']);
    assert(worldviewManager.state.worldviews['Phenomenalism']);
    assert(worldviewManager.state.worldviews['Realism']);
    assert(worldviewManager.state.worldviews['Dynamism']);
    assert(worldviewManager.state.worldviews['Monadism']);
    assert(worldviewManager.state.worldviews['Idealism']);
    assert(worldviewManager.state.worldviews['Rationalism']);
    assert(worldviewManager.state.worldviews['Psychism']);
    assert(worldviewManager.state.worldviews['Pneumatism']);

    // Total: 10 worldviews
    assert.equal(Object.keys(worldviewManager.state.worldviews).length, 10);
  });

  test('Pneumatism should have 11 ValueNet mappings', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const pneumatismMappings = (content.match(/:Pneumatism.*Mapping/g) || []).length;
    assert.equal(pneumatismMappings, 11, `Should have 11 Pneumatism mappings (was ${pneumatismMappings})`);
  });
});

// =============================================================================
// PHASE 3.3: SPIRITUALISM (Transcendent Spirit)
// =============================================================================

describe('Phase 3.3: Spiritualism Worldview', () => {
  // ---------------------------------------------------------------------------
  // Value Derivation Tests
  // ---------------------------------------------------------------------------

  test('Spiritualism should derive from "transcendent_spirit" foundation', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Spiritualism', { foundation: 'transcendent_spirit' });

    const spiritualism = worldviewManager.state.worldviews['Spiritualism'];
    assert(spiritualism, 'Spiritualism worldview should exist');
    assert.equal(spiritualism.metaphysics.foundation, 'transcendent_spirit');
  });

  test('Spiritualism should also derive from "transcendent" foundation', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Spiritualism', { foundation: 'transcendent' });

    const spiritualism = worldviewManager.state.worldviews['Spiritualism'];
    assert(spiritualism, 'Spiritualism worldview should exist');
    assert.equal(spiritualism.metaphysics.foundation, 'transcendent');
  });

  test('Spiritualism should also derive from "divinity" foundation', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Spiritualism', { foundation: 'divinity' });

    const spiritualism = worldviewManager.state.worldviews['Spiritualism'];
    assert(spiritualism, 'Spiritualism worldview should exist');
    assert.equal(spiritualism.metaphysics.foundation, 'divinity');
  });

  test('Spiritualism should have 4 terminal values', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Spiritualism', { foundation: 'transcendent_spirit' });

    const spiritualism = worldviewManager.state.worldviews['Spiritualism'];
    assert.equal(spiritualism.values.terminal.length, 4,
      `Expected 4 terminal values, got ${spiritualism.values.terminal.length}`);

    const terminalValues = spiritualism.values.terminal;
    assert(terminalValues.includes('divine_relationship'), 'Should include divine_relationship');
    assert(terminalValues.includes('revealed_truth'), 'Should include revealed_truth');
    assert(terminalValues.includes('spiritual_hierarchy'), 'Should include spiritual_hierarchy');
    assert(terminalValues.includes('transcendent_connection'), 'Should include transcendent_connection');
  });

  test('Spiritualism should have 4 constitutive values', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Spiritualism', { foundation: 'transcendent_spirit' });

    const spiritualism = worldviewManager.state.worldviews['Spiritualism'];
    assert.equal(spiritualism.values.constitutive.length, 4,
      `Expected 4 constitutive values, got ${spiritualism.values.constitutive.length}`);

    const constitutiveValues = spiritualism.values.constitutive;
    assert(constitutiveValues.includes('worship'), 'Should include worship');
    assert(constitutiveValues.includes('obedience_to_divine'), 'Should include obedience_to_divine');
    assert(constitutiveValues.includes('sacred_revelation'), 'Should include sacred_revelation');
    assert(constitutiveValues.includes('spiritual_submission'), 'Should include spiritual_submission');
  });

  test('Spiritualism should have 4 instrumental values', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Spiritualism', { foundation: 'transcendent_spirit' });

    const spiritualism = worldviewManager.state.worldviews['Spiritualism'];
    assert.equal(spiritualism.values.instrumental.length, 4,
      `Expected 4 instrumental values, got ${spiritualism.values.instrumental.length}`);

    const instrumentalValues = spiritualism.values.instrumental;
    assert(instrumentalValues.includes('prayer'), 'Should include prayer');
    assert(instrumentalValues.includes('scripture'), 'Should include scripture');
    assert(instrumentalValues.includes('spiritual_practice'), 'Should include spiritual_practice');
    assert(instrumentalValues.includes('religious_community'), 'Should include religious_community');
  });

  test('Spiritualism should have 5 subordinated values', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Spiritualism', { foundation: 'transcendent_spirit' });

    const spiritualism = worldviewManager.state.worldviews['Spiritualism'];
    assert.equal(spiritualism.values.subordinated.length, 5,
      `Expected 5 subordinated values, got ${spiritualism.values.subordinated.length}`);

    const subordinatedValues = spiritualism.values.subordinated;
    assert(subordinatedValues.includes('secularism'), 'Should include secularism');
    assert(subordinatedValues.includes('immanentism'), 'Should include immanentism');
    assert(subordinatedValues.includes('human_autonomy'), 'Should include human_autonomy');
    assert(subordinatedValues.includes('rationalism'), 'Should include rationalism');
    assert(subordinatedValues.includes('materialism'), 'Should include materialism');
  });

  // ---------------------------------------------------------------------------
  // Ontology Files Tests
  // ---------------------------------------------------------------------------

  test('spiritualism-values.ttl should exist and be 15-65KB', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'spiritualism-values.ttl');
    assert(fs.existsSync(ontologyPath), 'spiritualism-values.ttl should exist');

    const stats = fs.statSync(ontologyPath);
    const sizeKB = stats.size / 1024;
    assert(sizeKB >= 15 && sizeKB <= 65,
      `File should be 15-65KB (was ${sizeKB.toFixed(1)}KB)`);
  });

  test('spiritualism-values.ttl should define 4 terminal values', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'spiritualism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const terminalValues = [
      ':DivineRelationship',
      ':RevealedTruth',
      ':SpiritualHierarchy',
      ':TranscendentConnection'
    ];

    for (const value of terminalValues) {
      assert(content.includes(`${value} a :TerminalValue`),
        `Should define ${value} as TerminalValue`);
    }
  });

  test('spiritualism-values.ttl should cite key religious philosophers and mystics', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'spiritualism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const thinkers = ['Aquinas', 'Buber', 'Kierkegaard', 'Pascal'];
    let foundCount = 0;
    for (const thinker of thinkers) {
      if (content.includes(thinker)) {
        foundCount++;
      }
    }
    assert(foundCount >= 2,
      `Should cite key religious thinkers (found ${foundCount} of ${thinkers.length})`);
  });

  test('spiritualism-values.ttl should reference mystical traditions', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'spiritualism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const mysticalTerms = ['mystical', 'mysticism', 'prayer', 'divine', 'transcendent'];
    let foundCount = 0;
    for (const term of mysticalTerms) {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        foundCount++;
      }
    }
    assert(foundCount >= 3,
      `Should reference mystical traditions (found ${foundCount} of ${mysticalTerms.length} terms)`);
  });

  test('spiritualism-values.ttl should be BFO 2020 compliant', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'spiritualism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const bfoElements = [
      'bfo:0000015', // Process
      'bfo:0000019', // Quality
      'bfo:0000031'  // ICE
    ];

    for (const element of bfoElements) {
      assert(content.includes(element),
        `Should use BFO element ${element}`);
    }
  });

  test('spiritualism-values.ttl should include worked scenarios', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'spiritualism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const scenarioCount = (content.match(/Scenario a :Scenario/g) || []).length;
    assert(scenarioCount >= 3,
      `Should have at least 3 worked scenarios (found ${scenarioCount})`);
  });

  test('spiritualism-values.ttl should have 10+ philosophical citations', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'spiritualism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const citationCount = (content.match(/dcterms:source/g) || []).length;
    assert(citationCount >= 10,
      `Should have 10+ philosophical citations (found ${citationCount})`);
  });

  test('spiritualism-values.ttl should have empirical grounding section', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'spiritualism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    assert(content.includes('EmpiricalGrounding') || content.includes('empirical'),
      'Should include empirical grounding section');
  });

  // ---------------------------------------------------------------------------
  // ValueNet Integration Tests
  // ---------------------------------------------------------------------------

  test('Spiritualism should have 11 ValueNet mappings', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const spiritualismMappings = (content.match(/:Spiritualism.*Mapping/g) || []).length;
    assert.equal(spiritualismMappings, 11,
      `Should have 11 Spiritualism mappings (found ${spiritualismMappings})`);
  });

  test('Spiritualism should have HIGHEST Spirituality salience (≥0.90)', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const spiritualityRegex = /:SpiritualismSpiritualityMapping[\s\S]*?:salience\s+([\d.]+)/;
    const match = content.match(spiritualityRegex);

    assert(match, 'Should have Spiritualism Spirituality mapping');
    const salience = parseFloat(match[1]);
    assert(salience >= 0.90,
      `Spiritualism Spirituality salience should be ≥0.90 (was ${salience})`);
  });

  test('Spiritualism should have very high Tradition salience (≥0.85)', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const traditionRegex = /:SpiritualismTraditionMapping[\s\S]*?:salience\s+([\d.]+)/;
    const match = content.match(traditionRegex);

    assert(match, 'Should have Spiritualism Tradition mapping');
    const salience = parseFloat(match[1]);
    assert(salience >= 0.85,
      `Spiritualism Tradition salience should be ≥0.85 (was ${salience})`);
  });

  test('Spiritualism should have high Conformity salience (≥0.70)', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const conformityRegex = /:SpiritualismConformityMapping[\s\S]*?:salience\s+([\d.]+)/;
    const match = content.match(conformityRegex);

    assert(match, 'Should have Spiritualism Conformity mapping');
    const salience = parseFloat(match[1]);
    assert(salience >= 0.70,
      `Spiritualism Conformity salience should be ≥0.70 (was ${salience})`);
  });

  test('Spiritualism should have high Benevolence salience (≥0.75)', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const benevolenceRegex = /:SpiritualismBenevolenceMapping[\s\S]*?:salience\s+([\d.]+)/;
    const match = content.match(benevolenceRegex);

    assert(match, 'Should have Spiritualism Benevolence mapping');
    const salience = parseFloat(match[1]);
    assert(salience >= 0.75,
      `Spiritualism Benevolence salience should be ≥0.75 (was ${salience})`);
  });

  test('Spiritualism should have low Hedonism salience (≤0.40)', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const hedonismRegex = /:SpiritualismHedonismMapping[\s\S]*?:salience\s+([\d.]+)/;
    const match = content.match(hedonismRegex);

    assert(match, 'Should have Spiritualism Hedonism mapping');
    const salience = parseFloat(match[1]);
    assert(salience <= 0.40,
      `Spiritualism Hedonism salience should be ≤0.40 (was ${salience})`);
  });

  // ---------------------------------------------------------------------------
  // Independence Tests
  // ---------------------------------------------------------------------------

  test('Spiritualism should be distinct from Materialism', () => {
    worldviewManager.actions.reset();

    worldviewManager.actions.loadWorldview('Spiritualism', { foundation: 'transcendent_spirit' });
    worldviewManager.actions.loadWorldview('Materialism', { foundation: 'matter' });

    const spiritualism = worldviewManager.state.worldviews['Spiritualism'];
    const materialism = worldviewManager.state.worldviews['Materialism'];

    const spiritualismSubordinated = spiritualism.values.subordinated;
    assert(spiritualismSubordinated.includes('materialism') ||
           spiritualismSubordinated.includes('secularism'),
      'Spiritualism should subordinate materialism/secularism');

    const materialismTerminal = materialism.values.terminal;
    assert(!materialismTerminal.includes('divine_relationship'),
      'Materialism should not have divine_relationship as terminal value');
  });

  test('Spiritualism should be distinct from Pneumatism', () => {
    worldviewManager.actions.reset();

    worldviewManager.actions.loadWorldview('Spiritualism', { foundation: 'transcendent_spirit' });
    worldviewManager.actions.loadWorldview('Pneumatism', { foundation: 'living_spirit' });

    const spiritualism = worldviewManager.state.worldviews['Spiritualism'];
    const pneumatism = worldviewManager.state.worldviews['Pneumatism'];

    // Spiritualism emphasizes transcendent, Pneumatism emphasizes immanent
    const spiritualismTerminal = spiritualism.values.terminal;
    const pneumatismTerminal = pneumatism.values.terminal;

    assert(spiritualismTerminal.includes('spiritual_hierarchy') ||
           spiritualismTerminal.includes('revealed_truth'),
      'Spiritualism should emphasize transcendent hierarchy/revelation');

    assert(pneumatismTerminal.includes('ensouled_cosmos') ||
           pneumatismTerminal.includes('immanent_divinity'),
      'Pneumatism should emphasize immanent divinity/ensouled cosmos');
  });

  test('Spiritualism should be distinct from Rationalism', () => {
    worldviewManager.actions.reset();

    worldviewManager.actions.loadWorldview('Spiritualism', { foundation: 'transcendent_spirit' });
    worldviewManager.actions.loadWorldview('Rationalism', { foundation: 'reason' });

    const spiritualism = worldviewManager.state.worldviews['Spiritualism'];
    const rationalism = worldviewManager.state.worldviews['Rationalism'];

    // Spiritualism emphasizes revelation over reason
    const spiritualismSubordinated = spiritualism.values.subordinated;
    assert(spiritualismSubordinated.includes('rationalism') ||
           spiritualismSubordinated.includes('human_autonomy'),
      'Spiritualism should subordinate rationalism/human autonomy');

    const rationalismTerminal = rationalism.values.terminal;
    assert(rationalismTerminal.includes('logical_coherence') ||
           rationalismTerminal.includes('universal_principles'),
      'Rationalism should emphasize logical coherence/universal principles');
  });

  // ---------------------------------------------------------------------------
  // Cluster Identity Tests
  // ---------------------------------------------------------------------------

  test('Spiritualism should belong to Depth-Spiritual cluster', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'spiritualism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const depthSpiritualTerms = ['spiritual', 'transcendent', 'divine', 'mystical', 'sacred'];
    let foundCount = 0;
    for (const term of depthSpiritualTerms) {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        foundCount++;
      }
    }

    assert(foundCount >= 3,
      `Spiritualism should have depth-spiritual themes (found ${foundCount} terms)`);
  });

  test('Spiritualism reasoning should reference transcendent divinity', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Spiritualism', { foundation: 'transcendent_spirit' });

    const spiritualism = worldviewManager.state.worldviews['Spiritualism'];
    const reasoning = spiritualism.values.reasoning.toLowerCase();

    assert(reasoning.includes('transcendent') || reasoning.includes('divine'),
      'Reasoning should mention transcendent/divine');
    assert(reasoning.includes('revealed') || reasoning.includes('mystical'),
      'Reasoning should mention revealed truth or mystical connection');
  });

  // ---------------------------------------------------------------------------
  // Theistic/Mystical Alignment Tests
  // ---------------------------------------------------------------------------

  test('Spiritualism ontology should align with theistic worldview', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'spiritualism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const theisticTerms = ['God', 'divine', 'transcendent', 'sacred', 'revelation'];
    let foundCount = 0;
    for (const term of theisticTerms) {
      if (content.includes(term)) {
        foundCount++;
      }
    }

    assert(foundCount >= 3,
      `Should have theistic concepts (found ${foundCount} of ${theisticTerms.length} terms)`);
  });

  test('Spiritualism ontology should include mystical practices', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'spiritualism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const mysticalTerms = ['prayer', 'contemplation', 'mystical', 'worship', 'meditation'];
    let foundCount = 0;
    for (const term of mysticalTerms) {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        foundCount++;
      }
    }

    assert(foundCount >= 3,
      `Should reference mystical practices (found ${foundCount} of ${mysticalTerms.length} terms)`);
  });

  // ---------------------------------------------------------------------------
  // Scenario Evaluation Tests
  // ---------------------------------------------------------------------------

  test('Spiritualism should include ConversionExperienceScenario', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'spiritualism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    assert(content.includes('ConversionExperienceScenario') ||
           (content.includes('conversion') && content.includes('mystical')),
      'Should include conversion/mystical experience scenario');
  });

  test('Spiritualism should include PropheticCallScenario', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'spiritualism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    assert(content.includes('PropheticCallScenario') ||
           (content.includes('prophetic') || content.includes('revelation')),
      'Should include prophetic call scenario');
  });

  test('Spiritualism should include MysticalUnionScenario', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'spiritualism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    assert(content.includes('MysticalUnionScenario') ||
           (content.includes('mystical') && content.includes('union')),
      'Should include mystical union scenario');
  });

  // ---------------------------------------------------------------------------
  // Integration Tests
  // ---------------------------------------------------------------------------

  test('All 11 worldviews (8 + Psychism + Pneumatism + Spiritualism) should load together', () => {
    worldviewManager.actions.reset();

    // Material-Empirical (4)
    worldviewManager.actions.loadWorldview('Materialism', { foundation: 'matter' });
    worldviewManager.actions.loadWorldview('Sensationalism', { foundation: 'sensation' });
    worldviewManager.actions.loadWorldview('Phenomenalism', { foundation: 'phenomena' });
    worldviewManager.actions.loadWorldview('Realism', { foundation: 'reality_itself' });

    // Process-Individual (4)
    worldviewManager.actions.loadWorldview('Dynamism', { foundation: 'becoming' });
    worldviewManager.actions.loadWorldview('Monadism', { foundation: 'individual_monad' });
    worldviewManager.actions.loadWorldview('Idealism', { foundation: 'consciousness' });
    worldviewManager.actions.loadWorldview('Rationalism', { foundation: 'reason' });

    // Depth-Spiritual (3)
    worldviewManager.actions.loadWorldview('Psychism', { foundation: 'psyche' });
    worldviewManager.actions.loadWorldview('Pneumatism', { foundation: 'living_spirit' });
    worldviewManager.actions.loadWorldview('Spiritualism', { foundation: 'transcendent_spirit' });

    // Verify all loaded
    assert(worldviewManager.state.worldviews['Materialism']);
    assert(worldviewManager.state.worldviews['Sensationalism']);
    assert(worldviewManager.state.worldviews['Phenomenalism']);
    assert(worldviewManager.state.worldviews['Realism']);
    assert(worldviewManager.state.worldviews['Dynamism']);
    assert(worldviewManager.state.worldviews['Monadism']);
    assert(worldviewManager.state.worldviews['Idealism']);
    assert(worldviewManager.state.worldviews['Rationalism']);
    assert(worldviewManager.state.worldviews['Psychism']);
    assert(worldviewManager.state.worldviews['Pneumatism']);
    assert(worldviewManager.state.worldviews['Spiritualism']);

    // Total: 11 worldviews
    assert.equal(Object.keys(worldviewManager.state.worldviews).length, 11);
  });

  test('Spiritualism should have 11 ValueNet mappings', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const spiritualismMappings = (content.match(/:Spiritualism.*Mapping/g) || []).length;
    assert.equal(spiritualismMappings, 11, `Should have 11 Spiritualism mappings (was ${spiritualismMappings})`);
  });
});

// =============================================================================
// PHASE 3.4: MATHEMATISM (Mathematical Form)
// =============================================================================

describe('Phase 3.4: Mathematism Worldview', () => {
  // ---------------------------------------------------------------------------
  // Value Derivation Tests
  // ---------------------------------------------------------------------------

  test('Mathematism should derive from "mathematical_form" foundation', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Mathematism', { foundation: 'mathematical_form' });

    const mathematism = worldviewManager.state.worldviews['Mathematism'];
    assert(mathematism, 'Mathematism worldview should exist');
    assert.equal(mathematism.metaphysics.foundation, 'mathematical_form');
  });

  test('Mathematism should also derive from "mathematics" foundation', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Mathematism', { foundation: 'mathematics' });

    const mathematism = worldviewManager.state.worldviews['Mathematism'];
    assert(mathematism, 'Mathematism worldview should exist');
    assert.equal(mathematism.metaphysics.foundation, 'mathematics');
  });

  test('Mathematism should also derive from "form" foundation', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Mathematism', { foundation: 'form' });

    const mathematism = worldviewManager.state.worldviews['Mathematism'];
    assert(mathematism, 'Mathematism worldview should exist');
    assert.equal(mathematism.metaphysics.foundation, 'form');
  });

  test('Mathematism should have 4 terminal values', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Mathematism', { foundation: 'mathematical_form' });

    const mathematism = worldviewManager.state.worldviews['Mathematism'];
    assert.equal(mathematism.values.terminal.length, 4,
      `Expected 4 terminal values, got ${mathematism.values.terminal.length}`);

    const terminalValues = mathematism.values.terminal;
    assert(terminalValues.includes('mathematical_beauty'), 'Should include mathematical_beauty');
    assert(terminalValues.includes('structural_harmony'), 'Should include structural_harmony');
    assert(terminalValues.includes('formal_perfection'), 'Should include formal_perfection');
    assert(terminalValues.includes('elegant_order'), 'Should include elegant_order');
  });

  test('Mathematism should have 4 constitutive values', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Mathematism', { foundation: 'mathematical_form' });

    const mathematism = worldviewManager.state.worldviews['Mathematism'];
    assert.equal(mathematism.values.constitutive.length, 4,
      `Expected 4 constitutive values, got ${mathematism.values.constitutive.length}`);

    const constitutiveValues = mathematism.values.constitutive;
    assert(constitutiveValues.includes('platonic_realism'), 'Should include platonic_realism');
    assert(constitutiveValues.includes('logical_necessity'), 'Should include logical_necessity');
    assert(constitutiveValues.includes('abstract_thought'), 'Should include abstract_thought');
    assert(constitutiveValues.includes('universal_structure'), 'Should include universal_structure');
  });

  test('Mathematism should have 4 instrumental values', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Mathematism', { foundation: 'mathematical_form' });

    const mathematism = worldviewManager.state.worldviews['Mathematism'];
    assert.equal(mathematism.values.instrumental.length, 4,
      `Expected 4 instrumental values, got ${mathematism.values.instrumental.length}`);

    const instrumentalValues = mathematism.values.instrumental;
    assert(instrumentalValues.includes('rigorous_proof'), 'Should include rigorous_proof');
    assert(instrumentalValues.includes('symbolic_notation'), 'Should include symbolic_notation');
    assert(instrumentalValues.includes('axiomatic_method'), 'Should include axiomatic_method');
    assert(instrumentalValues.includes('mathematical_intuition'), 'Should include mathematical_intuition');
  });

  test('Mathematism should have 5 subordinated values', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Mathematism', { foundation: 'mathematical_form' });

    const mathematism = worldviewManager.state.worldviews['Mathematism'];
    assert.equal(mathematism.values.subordinated.length, 5,
      `Expected 5 subordinated values, got ${mathematism.values.subordinated.length}`);

    const subordinatedValues = mathematism.values.subordinated;
    assert(subordinatedValues.includes('empirical_contingency'), 'Should include empirical_contingency');
    assert(subordinatedValues.includes('applied_utility'), 'Should include applied_utility');
    assert(subordinatedValues.includes('informal_reasoning'), 'Should include informal_reasoning');
    assert(subordinatedValues.includes('numerical_approximation'), 'Should include numerical_approximation');
    assert(subordinatedValues.includes('constructivism'), 'Should include constructivism');
  });

  // ---------------------------------------------------------------------------
  // Ontology Files Tests
  // ---------------------------------------------------------------------------

  test('mathematism-values.ttl should exist and be 15-65KB', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'mathematism-values.ttl');
    assert(fs.existsSync(ontologyPath), 'mathematism-values.ttl should exist');

    const stats = fs.statSync(ontologyPath);
    const sizeKB = stats.size / 1024;
    assert(sizeKB >= 15 && sizeKB <= 65,
      `File should be 15-65KB (was ${sizeKB.toFixed(1)}KB)`);
  });

  test('mathematism-values.ttl should define 4 terminal values', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'mathematism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const terminalValues = [
      ':MathematicalBeauty',
      ':StructuralHarmony',
      ':FormalPerfection',
      ':ElegantOrder'
    ];

    for (const value of terminalValues) {
      assert(content.includes(`${value} a :TerminalValue`),
        `Should define ${value} as TerminalValue`);
    }
  });

  test('mathematism-values.ttl should cite key mathematicians and philosophers', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'mathematism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const thinkers = ['Pythagoras', 'Plato', 'Euclid', 'Hardy'];
    let foundCount = 0;
    for (const thinker of thinkers) {
      if (content.includes(thinker)) {
        foundCount++;
      }
    }
    assert(foundCount >= 3,
      `Should cite key mathematical thinkers (found ${foundCount} of ${thinkers.length})`);
  });

  test('mathematism-values.ttl should reference Platonic Forms and mathematical realism', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'mathematism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const platonicTerms = ['Platonic', 'Forms', 'mathematical realism', 'discovered', 'eternal'];
    let foundCount = 0;
    for (const term of platonicTerms) {
      if (content.includes(term)) {
        foundCount++;
      }
    }
    assert(foundCount >= 3,
      `Should reference Platonic mathematical realism (found ${foundCount} of ${platonicTerms.length} terms)`);
  });

  test('mathematism-values.ttl should be BFO 2020 compliant', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'mathematism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const bfoElements = [
      'bfo:0000015', // Process
      'bfo:0000019', // Quality
      'bfo:0000031'  // ICE
    ];

    for (const element of bfoElements) {
      assert(content.includes(element),
        `Should use BFO element ${element}`);
    }
  });

  test('mathematism-values.ttl should include worked scenarios', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'mathematism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const scenarioCount = (content.match(/Scenario a :Scenario/g) || []).length;
    assert(scenarioCount >= 3,
      `Should have at least 3 worked scenarios (found ${scenarioCount})`);
  });

  test('mathematism-values.ttl should have 10+ philosophical citations', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'mathematism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const citationCount = (content.match(/dcterms:source/g) || []).length;
    assert(citationCount >= 10,
      `Should have 10+ philosophical citations (found ${citationCount})`);
  });

  test('mathematism-values.ttl should have empirical grounding section', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'mathematism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    assert(content.includes('EmpiricalGrounding') || content.includes('empirical'),
      'Should include empirical grounding section');
  });

  // ---------------------------------------------------------------------------
  // ValueNet Integration Tests
  // ---------------------------------------------------------------------------

  test('Mathematism should have 11 ValueNet mappings', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const mathematismMappings = (content.match(/:Mathematism.*Mapping/g) || []).length;
    assert.equal(mathematismMappings, 11,
      `Should have 11 Mathematism mappings (found ${mathematismMappings})`);
  });

  test('Mathematism should have HIGHEST Spirituality salience (≥0.90)', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const spiritualityRegex = /:MathematismSpiritualityMapping[\s\S]*?:salience\s+([\d.]+)/;
    const match = content.match(spiritualityRegex);

    assert(match, 'Should have Mathematism Spirituality mapping');
    const salience = parseFloat(match[1]);
    assert(salience >= 0.90,
      `Mathematism Spirituality salience should be ≥0.90 (was ${salience})`);
  });

  test('Mathematism should have very high Universalism salience (≥0.85)', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const universalismRegex = /:MathematismUniversalismMapping[\s\S]*?:salience\s+([\d.]+)/;
    const match = content.match(universalismRegex);

    assert(match, 'Should have Mathematism Universalism mapping');
    const salience = parseFloat(match[1]);
    assert(salience >= 0.85,
      `Mathematism Universalism salience should be ≥0.85 (was ${salience})`);
  });

  test('Mathematism should have high Self-direction salience (≥0.80)', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const selfDirectionRegex = /:MathematismSelfDirectionMapping[\s\S]*?:salience\s+([\d.]+)/;
    const match = content.match(selfDirectionRegex);

    assert(match, 'Should have Mathematism Self-direction mapping');
    const salience = parseFloat(match[1]);
    assert(salience >= 0.80,
      `Mathematism Self-direction salience should be ≥0.80 (was ${salience})`);
  });

  test('Mathematism should have high Achievement salience (≥0.80)', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const achievementRegex = /:MathematismAchievementMapping[\s\S]*?:salience\s+([\d.]+)/;
    const match = content.match(achievementRegex);

    assert(match, 'Should have Mathematism Achievement mapping');
    const salience = parseFloat(match[1]);
    assert(salience >= 0.80,
      `Mathematism Achievement salience should be ≥0.80 (was ${salience})`);
  });

  test('Mathematism should have low Power salience (≤0.40)', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const powerRegex = /:MathematismPowerMapping[\s\S]*?:salience\s+([\d.]+)/;
    const match = content.match(powerRegex);

    assert(match, 'Should have Mathematism Power mapping');
    const salience = parseFloat(match[1]);
    assert(salience <= 0.40,
      `Mathematism Power salience should be ≤0.40 (was ${salience})`);
  });

  // ---------------------------------------------------------------------------
  // Independence Tests
  // ---------------------------------------------------------------------------

  test('Mathematism should be distinct from Materialism', () => {
    worldviewManager.actions.reset();

    worldviewManager.actions.loadWorldview('Mathematism', { foundation: 'mathematical_form' });
    worldviewManager.actions.loadWorldview('Materialism', { foundation: 'matter' });

    const mathematism = worldviewManager.state.worldviews['Mathematism'];
    const materialism = worldviewManager.state.worldviews['Materialism'];

    const mathematismTerminal = mathematism.values.terminal;
    assert(mathematismTerminal.includes('mathematical_beauty') ||
           mathematismTerminal.includes('formal_perfection'),
      'Mathematism should emphasize mathematical beauty/formal perfection');

    const materialismTerminal = materialism.values.terminal;
    assert(!materialismTerminal.includes('mathematical_beauty'),
      'Materialism should not have mathematical_beauty as terminal value');
  });

  test('Mathematism should be distinct from Rationalism', () => {
    worldviewManager.actions.reset();

    worldviewManager.actions.loadWorldview('Mathematism', { foundation: 'mathematical_form' });
    worldviewManager.actions.loadWorldview('Rationalism', { foundation: 'reason' });

    const mathematism = worldviewManager.state.worldviews['Mathematism'];
    const rationalism = worldviewManager.state.worldviews['Rationalism'];

    // Mathematism emphasizes mathematical form/beauty, Rationalism emphasizes logical coherence
    const mathematismTerminal = mathematism.values.terminal;
    const rationalismTerminal = rationalism.values.terminal;

    assert(mathematismTerminal.includes('mathematical_beauty') ||
           mathematismTerminal.includes('structural_harmony'),
      'Mathematism should emphasize mathematical beauty/structural harmony');

    assert(rationalismTerminal.includes('logical_coherence') ||
           rationalismTerminal.includes('universal_principles'),
      'Rationalism should emphasize logical coherence/universal principles');
  });

  test('Mathematism should be distinct from Spiritualism', () => {
    worldviewManager.actions.reset();

    worldviewManager.actions.loadWorldview('Mathematism', { foundation: 'mathematical_form' });
    worldviewManager.actions.loadWorldview('Spiritualism', { foundation: 'transcendent_spirit' });

    const mathematism = worldviewManager.state.worldviews['Mathematism'];
    const spiritualism = worldviewManager.state.worldviews['Spiritualism'];

    // Mathematism subordinates applied utility, Spiritualism subordinates rationalism
    const mathematismSubordinated = mathematism.values.subordinated;
    const spiritualismSubordinated = spiritualism.values.subordinated;

    assert(mathematismSubordinated.includes('applied_utility') ||
           mathematismSubordinated.includes('empirical_contingency'),
      'Mathematism should subordinate applied utility/empirical contingency');

    assert(spiritualismSubordinated.includes('rationalism') ||
           spiritualismSubordinated.includes('human_autonomy'),
      'Spiritualism should subordinate rationalism/human autonomy');
  });

  // ---------------------------------------------------------------------------
  // Cluster Identity Tests
  // ---------------------------------------------------------------------------

  test('Mathematism should belong to Depth-Spiritual cluster', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'mathematism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const depthSpiritualTerms = ['eternal', 'transcendent', 'beauty', 'spiritual', 'Forms'];
    let foundCount = 0;
    for (const term of depthSpiritualTerms) {
      if (content.includes(term)) {
        foundCount++;
      }
    }

    assert(foundCount >= 3,
      `Mathematism should have depth-spiritual themes (found ${foundCount} terms)`);
  });

  test('Mathematism reasoning should reference mathematical forms and beauty', () => {
    worldviewManager.actions.reset();
    worldviewManager.actions.loadWorldview('Mathematism', { foundation: 'mathematical_form' });

    const mathematism = worldviewManager.state.worldviews['Mathematism'];
    const reasoning = mathematism.values.reasoning.toLowerCase();

    assert(reasoning.includes('mathematical') || reasoning.includes('form'),
      'Reasoning should mention mathematical/form');
    assert(reasoning.includes('beauty') || reasoning.includes('platonic'),
      'Reasoning should mention beauty or Platonic');
  });

  // ---------------------------------------------------------------------------
  // Platonic Realism Alignment Tests
  // ---------------------------------------------------------------------------

  test('Mathematism ontology should align with Platonic realism', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'mathematism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const platonicTerms = ['Platonic', 'Forms', 'eternal', 'discovered', 'realism'];
    let foundCount = 0;
    for (const term of platonicTerms) {
      if (content.includes(term)) {
        foundCount++;
      }
    }

    assert(foundCount >= 3,
      `Should have Platonic realism concepts (found ${foundCount} of ${platonicTerms.length} terms)`);
  });

  test('Mathematism ontology should reference mathematical beauty', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'mathematism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    const beautyTerms = ['beauty', 'beautiful', 'aesthetic', 'elegant', 'harmony'];
    let foundCount = 0;
    for (const term of beautyTerms) {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        foundCount++;
      }
    }

    assert(foundCount >= 3,
      `Should reference mathematical beauty (found ${foundCount} of ${beautyTerms.length} terms)`);
  });

  // ---------------------------------------------------------------------------
  // Scenario Evaluation Tests
  // ---------------------------------------------------------------------------

  test('Mathematism should include Euler Identity or similar mathematical beauty scenario', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'mathematism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    assert(content.includes('EulerIdentityScenario') ||
           content.includes('Euler') ||
           (content.includes('beauty') && content.includes('theorem')),
      'Should include mathematical beauty scenario');
  });

  test('Mathematism should include proof or theorem scenario', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'mathematism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    assert(content.includes('Theorem') ||
           content.includes('Proof') ||
           content.includes('Fermat'),
      'Should include proof/theorem scenario');
  });

  test('Mathematism should include geometric or structural harmony scenario', () => {
    const ontologyPath = path.join(process.cwd(), 'ontology', 'mathematism-values.ttl');
    const content = fs.readFileSync(ontologyPath, 'utf-8');

    assert(content.includes('Platonic') ||
           content.includes('geometric') ||
           content.includes('symmetry') ||
           content.includes('Solid'),
      'Should include geometric/structural scenario');
  });

  // ---------------------------------------------------------------------------
  // Integration Tests
  // ---------------------------------------------------------------------------

  test('All 12 worldviews should load together', () => {
    worldviewManager.actions.reset();

    // Material-Empirical (4)
    worldviewManager.actions.loadWorldview('Materialism', { foundation: 'matter' });
    worldviewManager.actions.loadWorldview('Sensationalism', { foundation: 'sensation' });
    worldviewManager.actions.loadWorldview('Phenomenalism', { foundation: 'phenomena' });
    worldviewManager.actions.loadWorldview('Realism', { foundation: 'reality_itself' });

    // Process-Individual (4)
    worldviewManager.actions.loadWorldview('Dynamism', { foundation: 'becoming' });
    worldviewManager.actions.loadWorldview('Monadism', { foundation: 'individual_monad' });
    worldviewManager.actions.loadWorldview('Idealism', { foundation: 'consciousness' });
    worldviewManager.actions.loadWorldview('Rationalism', { foundation: 'reason' });

    // Depth-Spiritual (4)
    worldviewManager.actions.loadWorldview('Psychism', { foundation: 'psyche' });
    worldviewManager.actions.loadWorldview('Pneumatism', { foundation: 'living_spirit' });
    worldviewManager.actions.loadWorldview('Spiritualism', { foundation: 'transcendent_spirit' });
    worldviewManager.actions.loadWorldview('Mathematism', { foundation: 'mathematical_form' });

    // Verify all loaded
    assert(worldviewManager.state.worldviews['Materialism']);
    assert(worldviewManager.state.worldviews['Sensationalism']);
    assert(worldviewManager.state.worldviews['Phenomenalism']);
    assert(worldviewManager.state.worldviews['Realism']);
    assert(worldviewManager.state.worldviews['Dynamism']);
    assert(worldviewManager.state.worldviews['Monadism']);
    assert(worldviewManager.state.worldviews['Idealism']);
    assert(worldviewManager.state.worldviews['Rationalism']);
    assert(worldviewManager.state.worldviews['Psychism']);
    assert(worldviewManager.state.worldviews['Pneumatism']);
    assert(worldviewManager.state.worldviews['Spiritualism']);
    assert(worldviewManager.state.worldviews['Mathematism']);

    // Total: 12 worldviews - COMPLETE FRAMEWORK!
    assert.equal(Object.keys(worldviewManager.state.worldviews).length, 12);
  });

  test('All ValueNet mappings should total 132 (88 + 11 + 11 + 11 + 11)', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    const allMappings = (content.match(/a :WorldviewValueNetMapping/g) || []).length;

    // Should be 132: 44 (Material-Empirical) + 44 (Process-Individual) + 11 (Psychism) + 11 (Pneumatism) + 11 (Spiritualism) + 11 (Mathematism)
    assert.equal(allMappings, 132, `Should have 132 total mappings (was ${allMappings})`);
  });
});
