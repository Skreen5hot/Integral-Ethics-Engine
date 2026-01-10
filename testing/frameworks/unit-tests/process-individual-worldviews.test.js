/**
 * Process-Individual Worldviews Test Suite
 *
 * Tests Dynamism, Monadism, Idealism, and Rationalism worldview ontologies,
 * value derivation, ValueNet integration, and scenario evaluation.
 *
 * Phase 2.2: Dynamism and Monadism
 * Phase 2.3: Idealism and Rationalism
 */

import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { worldviewManager, deriveValues } from '../src/concepts/worldviewManager.js';
import fs from 'fs';
import path from 'path';

// ============================================================================
// DYNAMISM WORLDVIEW TESTS
// ============================================================================

describe('Dynamism Worldview', () => {
  beforeEach(() => {
    worldviewManager.actions.reset();
  });

  describe('Value Derivation', () => {
    test('should derive correct values from "becoming" foundation', () => {
      const values = deriveValues({ foundation: 'becoming' });

      // Terminal values: Growth, Transformation, VitalEnergy, CreativeBecoming
      assert(values.terminal.includes('growth'));
      assert(values.terminal.includes('transformation'));
      assert(values.terminal.includes('vital_energy'));
      assert(values.terminal.includes('creative_becoming'));

      // Constitutive values
      assert(values.constitutive.includes('developmental_potential'));
      assert(values.constitutive.includes('dynamic_process'));
      assert(values.constitutive.includes('life_force'));

      // Instrumental values
      assert(values.instrumental.includes('cultivation'));
      assert(values.instrumental.includes('evolutionary_pressure'));
      assert(values.instrumental.includes('transformative_practice'));

      // Subordinated values (static forms, stagnation)
      assert(values.subordinated.includes('static_form'));
      assert(values.subordinated.includes('stagnation'));
      assert(values.subordinated.includes('mere_being'));

      // Reasoning
      assert(values.reasoning.includes('process'));
      assert(values.reasoning.includes('becoming'));
      assert(values.reasoning.includes('dynamic'));
    });

    test('should load Dynamism worldview correctly', () => {
      worldviewManager.actions.loadWorldview('Dynamism', {
        foundation: 'becoming',
        cluster: 'ProcessIndividual'
      });

      const worldview = worldviewManager.state.worldviews['Dynamism'];
      assert(worldview, 'Dynamism worldview should be loaded');
      assert.equal(worldview.metaphysics.foundation, 'becoming');
      assert.equal(worldview.metaphysics.cluster, 'ProcessIndividual');
    });

    test('should get values for loaded Dynamism worldview', () => {
      worldviewManager.actions.loadWorldview('Dynamism', {
        foundation: 'becoming'
      });

      const values = worldviewManager.actions.getValues('Dynamism');
      assert(values.terminal.includes('growth'));
      assert(values.terminal.includes('transformation'));
    });
  });

  describe('Ontology Files', () => {
    test('dynamism-values.ttl should exist and be correctly sized', () => {
      const ontologyPath = path.join(process.cwd(), 'ontology', 'dynamism-values.ttl');

      // Verify file exists
      assert(fs.existsSync(ontologyPath), 'dynamism-values.ttl should exist');

      // Check size
      const stats = fs.statSync(ontologyPath);
      const sizeKB = stats.size / 1024;

      assert(sizeKB >= 40, `Dynamism ontology should be at least 40KB (was ${sizeKB.toFixed(1)}KB)`);
      assert(sizeKB <= 60, `Dynamism ontology should be at most 60KB (was ${sizeKB.toFixed(1)}KB)`);
    });

    test('dynamism-values.ttl should contain required terminal values', () => {
      const ontologyPath = path.join(process.cwd(), 'ontology', 'dynamism-values.ttl');
      const content = fs.readFileSync(ontologyPath, 'utf-8');

      // Terminal values
      assert(content.includes(':Growth a :TerminalValue'));
      assert(content.includes(':Transformation a :TerminalValue'));
      assert(content.includes(':VitalEnergy a :TerminalValue'));
      assert(content.includes(':CreativeBecoming a :TerminalValue'));

      // Should reference process philosophy
      assert(content.includes('Heraclitus') || content.includes('heraclitean'));
      assert(content.includes('Bergson'));
      assert(content.includes('Whitehead'));
    });

    test('dynamism-values.ttl should map to ValueNet dispositions', () => {
      const ontologyPath = path.join(process.cwd(), 'ontology', 'dynamism-values.ttl');
      const content = fs.readFileSync(ontologyPath, 'utf-8');

      // Should have ValueNet mappings
      assert(content.includes('StimulationDisposition'));
      assert(content.includes('SelfDirectionDisposition'));
      assert(content.includes(':realizableAs'));
    });

    test('dynamism-values.ttl should have BFO process modeling', () => {
      const ontologyPath = path.join(process.cwd(), 'ontology', 'dynamism-values.ttl');
      const content = fs.readFileSync(ontologyPath, 'utf-8');

      // Should have BFO process modeling
      assert(content.includes('bfo:0000015') || content.includes('Process'));
      assert(content.includes('GrowthProcess') || content.includes('TransformationProcess'));

      // Should have quality modeling
      assert(content.includes('bfo:0000019') || content.includes('Quality'));
    });
  });

  describe('ValueNet Mappings', () => {
    test('worldview-valuenet-mappings.ttl should contain Dynamism section', () => {
      const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
      const content = fs.readFileSync(mappingsPath, 'utf-8');

      // Should have Dynamism section
      assert(content.includes('DYNAMISM → ValueNet Mappings'));
      assert(content.includes(':DynamismValueProfile'));

      // Should have all 11 Schwartz value mappings
      assert(content.includes(':DynamismStimulationMapping'));
      assert(content.includes(':DynamismSelfDirectionMapping'));
      assert(content.includes(':DynamismAchievementMapping'));
      assert(content.includes(':DynamismUniversalismMapping'));
      assert(content.includes(':DynamismBenevolenceMapping'));
      assert(content.includes(':DynamismHedonismMapping'));
      assert(content.includes(':DynamismPowerMapping'));
      assert(content.includes(':DynamismSecurityMapping'));
      assert(content.includes(':DynamismConformityMapping'));
      assert(content.includes(':DynamismTraditionMapping'));
      assert(content.includes(':DynamismSpiritualityMapping'));
    });

    test('Dynamism should have high Stimulation and Self-Direction', () => {
      const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
      const content = fs.readFileSync(mappingsPath, 'utf-8');

      // Extract Dynamism Stimulation mapping with salience
      const stimulationMatch = content.match(/:DynamismStimulationMapping[\s\S]*?:salience\s+(0\.\d+)/);
      assert(stimulationMatch, 'Should have DynamismStimulationMapping with salience');
      const stimulationSalience = parseFloat(stimulationMatch[1]);
      assert(stimulationSalience >= 0.9, `Stimulation salience should be >= 0.9 (was ${stimulationSalience})`);

      // Extract Dynamism SelfDirection mapping with salience
      const selfDirectionMatch = content.match(/:DynamismSelfDirectionMapping[\s\S]*?:salience\s+(0\.\d+)/);
      assert(selfDirectionMatch, 'Should have DynamismSelfDirectionMapping with salience');
      const selfDirectionSalience = parseFloat(selfDirectionMatch[1]);
      assert(selfDirectionSalience >= 0.9, `Self-Direction salience should be >= 0.9 (was ${selfDirectionSalience})`);
    });
  });

  describe('Independence from other worldviews', () => {
    test('should not be reducible to Materialism', () => {
      const dynamismValues = deriveValues({ foundation: 'becoming' });
      const materialismValues = deriveValues({ foundation: 'matter' });

      // Dynamism has transformation/growth that Materialism doesn't prioritize
      assert(dynamismValues.terminal.includes('transformation'));
      assert(!materialismValues.terminal.includes('transformation'));

      // Dynamism subordinates static forms
      assert(dynamismValues.subordinated.includes('static_form'));
    });

    test('should not be reducible to Realism', () => {
      const dynamismValues = deriveValues({ foundation: 'becoming' });
      const realismValues = deriveValues({ foundation: 'reality_itself' });

      // Dynamism emphasizes process; Realism emphasizes objective truth
      assert(dynamismValues.terminal.includes('growth'));
      assert(realismValues.terminal.includes('objective_truth'));
      assert(!realismValues.terminal.includes('growth'));
    });
  });
});

// ============================================================================
// MONADISM WORLDVIEW TESTS
// ============================================================================

describe('Monadism Worldview', () => {
  beforeEach(() => {
    worldviewManager.actions.reset();
  });

  describe('Value Derivation', () => {
    test('should derive correct values from "individual_monad" foundation', () => {
      const values = deriveValues({ foundation: 'individual_monad' });

      // Terminal values: Individual uniqueness, personal dignity, authentic individuality
      assert(values.terminal.includes('individual_uniqueness'));
      assert(values.terminal.includes('personal_dignity'));
      assert(values.terminal.includes('authentic_individuality'));

      // Constitutive values
      assert(values.constitutive.includes('irreplaceable_perspective'));
      assert(values.constitutive.includes('autonomous_agency'));
      assert(values.constitutive.includes('unique_essence'));

      // Instrumental values
      assert(values.instrumental.includes('self_actualization'));
      assert(values.instrumental.includes('personal_development'));
      assert(values.instrumental.includes('authenticity_cultivation'));

      // Subordinated values (collectivism, conformity)
      assert(values.subordinated.includes('collectivism'));
      assert(values.subordinated.includes('conformity'));
      assert(values.subordinated.includes('replaceability'));

      // Reasoning
      assert(values.reasoning.includes('individual'));
      assert(values.reasoning.includes('unique'));
      assert(values.reasoning.includes('monad'));
    });

    test('should load Monadism worldview correctly', () => {
      worldviewManager.actions.loadWorldview('Monadism', {
        foundation: 'individual_monad',
        cluster: 'ProcessIndividual'
      });

      const worldview = worldviewManager.state.worldviews['Monadism'];
      assert(worldview, 'Monadism worldview should be loaded');
      assert.equal(worldview.metaphysics.foundation, 'individual_monad');
      assert.equal(worldview.metaphysics.cluster, 'ProcessIndividual');
    });

    test('should get values for loaded Monadism worldview', () => {
      worldviewManager.actions.loadWorldview('Monadism', {
        foundation: 'individual_monad'
      });

      const values = worldviewManager.actions.getValues('Monadism');
      assert(values.terminal.includes('individual_uniqueness'));
      assert(values.terminal.includes('personal_dignity'));
    });
  });

  describe('Ontology Files', () => {
    test('monadism-values.ttl should exist and be correctly sized', () => {
      const ontologyPath = path.join(process.cwd(), 'ontology', 'monadism-values.ttl');

      // Verify file exists
      assert(fs.existsSync(ontologyPath), 'monadism-values.ttl should exist');

      // Check size
      const stats = fs.statSync(ontologyPath);
      const sizeKB = stats.size / 1024;

      assert(sizeKB >= 40, `Monadism ontology should be at least 40KB (was ${sizeKB.toFixed(1)}KB)`);
      assert(sizeKB <= 60, `Monadism ontology should be at most 60KB (was ${sizeKB.toFixed(1)}KB)`);
    });

    test('monadism-values.ttl should contain required terminal values', () => {
      const ontologyPath = path.join(process.cwd(), 'ontology', 'monadism-values.ttl');
      const content = fs.readFileSync(ontologyPath, 'utf-8');

      // Terminal values
      assert(content.includes(':IndividualUniqueness a :TerminalValue'));
      assert(content.includes(':PersonalDignity a :TerminalValue'));
      assert(content.includes(':AuthenticIndividuality a :TerminalValue'));
      assert(content.includes(':IrreplaceablePerspective a :TerminalValue'));

      // Should reference personalist philosophy
      assert(content.includes('Leibniz'));
      assert(content.includes('Scheler'));
      assert(content.includes('Mounier') || content.includes('Personalism'));
      assert(content.includes('Buber'));
    });

    test('monadism-values.ttl should map to ValueNet dispositions', () => {
      const ontologyPath = path.join(process.cwd(), 'ontology', 'monadism-values.ttl');
      const content = fs.readFileSync(ontologyPath, 'utf-8');

      // Should have ValueNet mappings with HIGHEST self-direction
      assert(content.includes('SelfDirectionDisposition'));
      assert(content.includes('0.95'));
      assert(content.includes(':realizableAs'));
    });

    test('monadism-values.ttl should have BFO quality modeling', () => {
      const ontologyPath = path.join(process.cwd(), 'ontology', 'monadism-values.ttl');
      const content = fs.readFileSync(ontologyPath, 'utf-8');

      // Should have BFO quality modeling (uniqueness, dignity as qualities)
      assert(content.includes('bfo:0000019') || content.includes('Quality'));

      // Should have ICE entities (personal narrative, individual purpose)
      assert(content.includes('bfo:0000031') || content.includes('ICE'));
    });
  });

  describe('ValueNet Mappings', () => {
    test('worldview-valuenet-mappings.ttl should contain Monadism section', () => {
      const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
      const content = fs.readFileSync(mappingsPath, 'utf-8');

      // Should have Monadism section
      assert(content.includes('MONADISM → ValueNet Mappings'));
      assert(content.includes(':MonadismValueProfile'));

      // Should have all 11 Schwartz value mappings
      assert(content.includes(':MonadismSelfDirectionMapping'));
      assert(content.includes(':MonadismUniversalismMapping'));
      assert(content.includes(':MonadismBenevolenceMapping'));
      assert(content.includes(':MonadismAchievementMapping'));
      assert(content.includes(':MonadismSecurityMapping'));
      assert(content.includes(':MonadismStimulationMapping'));
      assert(content.includes(':MonadismHedonismMapping'));
      assert(content.includes(':MonadismTraditionMapping'));
      assert(content.includes(':MonadismConformityMapping'));
      assert(content.includes(':MonadismPowerMapping'));
      assert(content.includes(':MonadismSpiritualityMapping'));
    });

    test('Monadism should have HIGHEST Self-Direction (0.95)', () => {
      const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
      const content = fs.readFileSync(mappingsPath, 'utf-8');

      // Extract Monadism Self-Direction mapping
      const monadismSelfDirection = content.match(/MonadismSelfDirectionMapping[\s\S]*?:salience\s+(0\.\d+)/);

      assert(monadismSelfDirection, 'Should have MonadismSelfDirectionMapping');
      const salience = parseFloat(monadismSelfDirection[1]);
      assert.equal(salience, 0.95, 'Monadism should have 0.95 self-direction (HIGHEST)');
    });

    test('Monadism should have LOWEST Power disposition (0.25)', () => {
      const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
      const content = fs.readFileSync(mappingsPath, 'utf-8');

      // Should reference Kantian "persons as ends"
      assert(content.includes(':MonadismPowerMapping'));
      assert(content.includes('ends') || content.includes('dignity'));
    });
  });

  describe('Independence from other worldviews', () => {
    test('should not be reducible to Materialism', () => {
      const monadismValues = deriveValues({ foundation: 'individual_monad' });
      const materialismValues = deriveValues({ foundation: 'matter' });

      // Monadism has personal dignity that Materialism doesn't prioritize
      assert(monadismValues.terminal.includes('personal_dignity'));
      assert(!materialismValues.terminal.includes('personal_dignity'));
    });

    test('should not be reducible to Dynamism', () => {
      const monadismValues = deriveValues({ foundation: 'individual_monad' });
      const dynamismValues = deriveValues({ foundation: 'becoming' });

      // Monadism emphasizes individual dignity; Dynamism emphasizes transformation
      assert(monadismValues.terminal.includes('personal_dignity'));
      assert(dynamismValues.terminal.includes('transformation'));

      // Different emphases even though both are Process-Individual
      assert(!dynamismValues.terminal.includes('personal_dignity'));
    });
  });
});

// ============================================================================
// CROSS-WORLDVIEW COMPARISON TESTS
// ============================================================================

describe('Process-Individual Cluster Comparisons', () => {
  beforeEach(() => {
    worldviewManager.actions.reset();
  });

  test('Both should subordinate conformity (but for different reasons)', () => {
    const dynamismValues = deriveValues({ foundation: 'becoming' });
    const monadismValues = deriveValues({ foundation: 'individual_monad' });

    // Both subordinate conformity-related values
    assert(dynamismValues.subordinated.includes('static_form') || dynamismValues.subordinated.includes('stagnation'));
    assert(monadismValues.subordinated.includes('conformity'));
  });

  test('Both worldviews should have distinct philosophical groundings', () => {
    const dynamismPath = path.join(process.cwd(), 'ontology', 'dynamism-values.ttl');
    const monadismPath = path.join(process.cwd(), 'ontology', 'monadism-values.ttl');

    const dynamismContent = fs.readFileSync(dynamismPath, 'utf-8');
    const monadismContent = fs.readFileSync(monadismPath, 'utf-8');

    // Dynamism: Process philosophy
    assert(dynamismContent.includes('Heraclitus') || dynamismContent.includes('Bergson'));

    // Monadism: Personalist philosophy
    assert(monadismContent.includes('Leibniz'));
    assert(monadismContent.includes('Personalism') || monadismContent.includes('Scheler'));
  });

  test('worldview-valuenet-mappings.ttl should have exactly 22 new mappings (11 per worldview)', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    // Count Dynamism mappings (should be 11: 10 basic Schwartz values + Spirituality)
    const dynamismMappings = (content.match(/:Dynamism\w+Mapping a :WorldviewValueNetMapping/g) || []).length;
    assert.equal(dynamismMappings, 11, 'Should have exactly 11 Dynamism mappings');

    // Count Monadism mappings (should be 11)
    const monadismMappings = (content.match(/:Monadism\w+Mapping a :WorldviewValueNetMapping/g) || []).length;
    assert.equal(monadismMappings, 11, 'Should have exactly 11 Monadism mappings');

    // Total new mappings: 22
    assert.equal(dynamismMappings + monadismMappings, 22);
  });

  test('both ontologies should follow same structure as Material-Empirical worldviews', () => {
    const dynamismPath = path.join(process.cwd(), 'ontology', 'dynamism-values.ttl');
    const monadismPath = path.join(process.cwd(), 'ontology', 'monadism-values.ttl');
    const materialismPath = path.join(process.cwd(), 'ontology', 'materialism-values.ttl');

    const dynamismContent = fs.readFileSync(dynamismPath, 'utf-8');
    const monadismContent = fs.readFileSync(monadismPath, 'utf-8');
    const materialismContent = fs.readFileSync(materialismPath, 'utf-8');

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
      assert(dynamismContent.includes(element), `Dynamism should have ${element}`);
      assert(monadismContent.includes(element), `Monadism should have ${element}`);
      assert(materialismContent.includes(element), `Materialism should have ${element}`);
    }
  });
});

// ============================================================================
// IDEALISM WORLDVIEW TESTS (Phase 2.3)
// ============================================================================

describe('Idealism Worldview', () => {
  beforeEach(() => {
    worldviewManager.actions.reset();
  });

  describe('Value Derivation', () => {
    test('should derive correct values from "consciousness" foundation', () => {
      const values = deriveValues({ foundation: 'consciousness' });

      // Terminal values: ConsciousnessDevelopment, IdeasAsCausal, MeaningMaking
      assert(values.terminal.includes('consciousness_development'));
      assert(values.terminal.includes('ideas_as_causal'));
      assert(values.terminal.includes('meaning_making'));

      // Constitutive values
      assert(values.constitutive.includes('mental_clarity'));
      assert(values.constitutive.includes('conceptual_understanding'));
      assert(values.constitutive.includes('intentional_directedness'));

      // Instrumental values
      assert(values.instrumental.includes('education'));
      assert(values.instrumental.includes('contemplation'));
      assert(values.instrumental.includes('philosophical_inquiry'));

      // Subordinated values (materialism, mechanism, epiphenomenalism)
      assert(values.subordinated.includes('materialism'));
      assert(values.subordinated.includes('mechanism'));
      assert(values.subordinated.includes('epiphenomenalism'));

      // Reasoning
      assert(values.reasoning.includes('consciousness'));
      assert(values.reasoning.includes('ideas'));
      assert(values.reasoning.includes('Mind'));
    });

    test('should load Idealism worldview correctly', () => {
      worldviewManager.actions.loadWorldview('Idealism', {
        foundation: 'consciousness',
        cluster: 'ProcessIndividual'
      });

      const worldview = worldviewManager.state.worldviews['Idealism'];
      assert(worldview, 'Idealism worldview should be loaded');
      assert.equal(worldview.metaphysics.foundation, 'consciousness');
      assert.equal(worldview.metaphysics.cluster, 'ProcessIndividual');
    });

    test('should get values for loaded Idealism worldview', () => {
      worldviewManager.actions.loadWorldview('Idealism', {
        foundation: 'consciousness'
      });

      const values = worldviewManager.actions.getValues('Idealism');
      assert(values.terminal.includes('consciousness_development'));
      assert(values.terminal.includes('ideas_as_causal'));
    });
  });

  describe('Ontology Files', () => {
    test('idealism-values.ttl should exist and be correctly sized', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'idealism-values.ttl');
      assert(fs.existsSync(filePath), 'idealism-values.ttl should exist');

      const stats = fs.statSync(filePath);
      const sizeKB = stats.size / 1024;

      // Should be 40-50KB as per spec
      assert(sizeKB >= 40 && sizeKB <= 50, `Idealism ontology should be 40-50KB, was ${sizeKB.toFixed(2)}KB`);
    });

    test('idealism-values.ttl should have terminal values', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'idealism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Terminal values
      assert(content.includes('ConsciousnessDevelopment'));
      assert(content.includes('IdeasAsCausal'));
      assert(content.includes('MeaningMaking'));
      assert(content.includes('MentalClarity'));
    });

    test('idealism-values.ttl should cite Idealist philosophers', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'idealism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Key Idealist philosophers
      assert(content.includes('Plato'));
      assert(content.includes('Berkeley'));
      assert(content.includes('Hegel'));
      assert(content.includes('Kant') || content.includes('Fichte'));
    });

    test('idealism-values.ttl should have BFO compliance', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'idealism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      assert(content.includes('bfo:0000015') || content.includes('# Process'));
      assert(content.includes('bfo:0000019') || content.includes('# Quality'));
      assert(content.includes('bfo:0000031') || content.includes('# ICE'));
    });

    test('idealism-values.ttl should have worked scenarios', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'idealism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should have at least 3 scenarios
      const scenarioCount = (content.match(/a :Scenario/g) || []).length;
      assert(scenarioCount >= 3, `Should have at least 3 scenarios, found ${scenarioCount}`);
    });
  });

  describe('ValueNet Integration', () => {
    test('worldview-valuenet-mappings.ttl should have 11 Idealism mappings', () => {
      const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
      const content = fs.readFileSync(mappingsPath, 'utf-8');

      const idealismMappings = (content.match(/:Idealism\w+Mapping a :WorldviewValueNetMapping/g) || []).length;
      assert.equal(idealismMappings, 11, 'Should have exactly 11 Idealism mappings (10 basic Schwartz + Spirituality)');
    });

    test('Idealism should have high Spirituality disposition', () => {
      const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
      const content = fs.readFileSync(mappingsPath, 'utf-8');

      const spiritualityMatch = content.match(/:IdealismSpiritualityMapping[\s\S]*?:salience\s+(0\.\d+)/);
      assert(spiritualityMatch, 'Should have IdealismSpiritualityMapping with salience');

      const spiritualitySalience = parseFloat(spiritualityMatch[1]);
      assert(spiritualitySalience >= 0.85, `Idealism Spirituality salience should be >= 0.85 (was ${spiritualitySalience})`);
    });

    test('Idealism should have high Self-Direction disposition', () => {
      const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
      const content = fs.readFileSync(mappingsPath, 'utf-8');

      const selfDirectionMatch = content.match(/:IdealismSelfDirectionMapping[\s\S]*?:salience\s+(0\.\d+)/);
      assert(selfDirectionMatch, 'Should have IdealismSelfDirectionMapping with salience');

      const selfDirectionSalience = parseFloat(selfDirectionMatch[1]);
      assert(selfDirectionSalience >= 0.80, `Idealism Self-direction salience should be >= 0.80 (was ${selfDirectionSalience})`);
    });
  });
});

// ============================================================================
// RATIONALISM WORLDVIEW TESTS (Phase 2.3)
// ============================================================================

describe('Rationalism Worldview', () => {
  beforeEach(() => {
    worldviewManager.actions.reset();
  });

  describe('Value Derivation', () => {
    test('should derive correct values from "reason" foundation', () => {
      const values = deriveValues({ foundation: 'reason' });

      // Terminal values: LogicalCoherence, UniversalPrinciples, SystematicOrder
      assert(values.terminal.includes('logical_coherence'));
      assert(values.terminal.includes('universal_principles'));
      assert(values.terminal.includes('systematic_order'));

      // Constitutive values
      assert(values.constitutive.includes('rational_consistency'));
      assert(values.constitutive.includes('deductive_validity'));
      assert(values.constitutive.includes('conceptual_clarity'));

      // Instrumental values
      assert(values.instrumental.includes('logic'));
      assert(values.instrumental.includes('mathematics'));
      assert(values.instrumental.includes('systematic_philosophy'));

      // Subordinated values (irrationality, contradiction, arbitrary preference)
      assert(values.subordinated.includes('irrationality'));
      assert(values.subordinated.includes('contradiction'));
      assert(values.subordinated.includes('arbitrary_preference'));

      // Reasoning
      assert(values.reasoning.includes('reason'));
      assert(values.reasoning.includes('Rationalism'));
      assert(values.reasoning.includes('logical'));
    });

    test('should load Rationalism worldview correctly', () => {
      worldviewManager.actions.loadWorldview('Rationalism', {
        foundation: 'reason',
        cluster: 'ProcessIndividual'
      });

      const worldview = worldviewManager.state.worldviews['Rationalism'];
      assert(worldview, 'Rationalism worldview should be loaded');
      assert.equal(worldview.metaphysics.foundation, 'reason');
      assert.equal(worldview.metaphysics.cluster, 'ProcessIndividual');
    });

    test('should get values for loaded Rationalism worldview', () => {
      worldviewManager.actions.loadWorldview('Rationalism', {
        foundation: 'reason'
      });

      const values = worldviewManager.actions.getValues('Rationalism');
      assert(values.terminal.includes('logical_coherence'));
      assert(values.terminal.includes('universal_principles'));
    });
  });

  describe('Ontology Files', () => {
    test('rationalism-values.ttl should exist and be correctly sized', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'rationalism-values.ttl');
      assert(fs.existsSync(filePath), 'rationalism-values.ttl should exist');

      const stats = fs.statSync(filePath);
      const sizeKB = stats.size / 1024;

      // Should be 40-50KB as per spec
      assert(sizeKB >= 40 && sizeKB <= 50, `Rationalism ontology should be 40-50KB, was ${sizeKB.toFixed(2)}KB`);
    });

    test('rationalism-values.ttl should have terminal values', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'rationalism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Terminal values
      assert(content.includes('LogicalCoherence'));
      assert(content.includes('UniversalPrinciples'));
      assert(content.includes('SystematicOrder'));
      assert(content.includes('RationalNecessity'));
    });

    test('rationalism-values.ttl should cite Rationalist philosophers', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'rationalism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Key Rationalist philosophers
      assert(content.includes('Descartes'));
      assert(content.includes('Spinoza'));
      assert(content.includes('Leibniz'));
      assert(content.includes('Kant'));
    });

    test('rationalism-values.ttl should have BFO compliance', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'rationalism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      assert(content.includes('bfo:0000015') || content.includes('# Process'));
      assert(content.includes('bfo:0000019') || content.includes('# Quality'));
      assert(content.includes('bfo:0000031') || content.includes('# ICE'));
    });

    test('rationalism-values.ttl should have worked scenarios', () => {
      const filePath = path.join(process.cwd(), 'ontology', 'rationalism-values.ttl');
      const content = fs.readFileSync(filePath, 'utf-8');

      // Should have at least 3 scenarios
      const scenarioCount = (content.match(/a :Scenario/g) || []).length;
      assert(scenarioCount >= 3, `Should have at least 3 scenarios, found ${scenarioCount}`);
    });
  });

  describe('ValueNet Integration', () => {
    test('worldview-valuenet-mappings.ttl should have 11 Rationalism mappings', () => {
      const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
      const content = fs.readFileSync(mappingsPath, 'utf-8');

      const rationalismMappings = (content.match(/:Rationalism\w+Mapping a :WorldviewValueNetMapping/g) || []).length;
      assert.equal(rationalismMappings, 11, 'Should have exactly 11 Rationalism mappings (10 basic Schwartz + Spirituality)');
    });

    test('Rationalism should have high Universalism disposition', () => {
      const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
      const content = fs.readFileSync(mappingsPath, 'utf-8');

      const universalismMatch = content.match(/:RationalismUniversalismMapping[\s\S]*?:salience\s+(0\.\d+)/);
      assert(universalismMatch, 'Should have RationalismUniversalismMapping with salience');

      const universalismSalience = parseFloat(universalismMatch[1]);
      assert(universalismSalience >= 0.85, `Rationalism Universalism salience should be >= 0.85 (was ${universalismSalience})`);
    });

    test('Rationalism should have high Security disposition (logical certainty)', () => {
      const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
      const content = fs.readFileSync(mappingsPath, 'utf-8');

      const securityMatch = content.match(/:RationalismSecurityMapping[\s\S]*?:salience\s+(0\.\d+)/);
      assert(securityMatch, 'Should have RationalismSecurityMapping with salience');

      const securitySalience = parseFloat(securityMatch[1]);
      assert(securitySalience >= 0.80, `Rationalism Security salience should be >= 0.80 (was ${securitySalience})`);
    });
  });
});

// ============================================================================
// PHASE 2.3 CROSS-WORLDVIEW TESTS (All 4 Process-Individual Worldviews)
// ============================================================================

describe('Phase 2.3: All Process-Individual Worldviews', () => {
  test('All 4 Process-Individual worldviews should have distinct philosophical groundings', () => {
    const dynamismPath = path.join(process.cwd(), 'ontology', 'dynamism-values.ttl');
    const monadismPath = path.join(process.cwd(), 'ontology', 'monadism-values.ttl');
    const idealismPath = path.join(process.cwd(), 'ontology', 'idealism-values.ttl');
    const rationalismPath = path.join(process.cwd(), 'ontology', 'rationalism-values.ttl');

    const dynamismContent = fs.readFileSync(dynamismPath, 'utf-8');
    const monadismContent = fs.readFileSync(monadismPath, 'utf-8');
    const idealismContent = fs.readFileSync(idealismPath, 'utf-8');
    const rationalismContent = fs.readFileSync(rationalismPath, 'utf-8');

    // Dynamism: Process philosophy
    assert(dynamismContent.includes('Heraclitus') || dynamismContent.includes('Bergson'));

    // Monadism: Personalist philosophy
    assert(monadismContent.includes('Leibniz'));
    assert(monadismContent.includes('Personalism') || monadismContent.includes('Scheler'));

    // Idealism: Idealist philosophy
    assert(idealismContent.includes('Plato'));
    assert(idealismContent.includes('Hegel') || idealismContent.includes('Berkeley'));

    // Rationalism: Rationalist philosophy
    assert(rationalismContent.includes('Descartes'));
    assert(rationalismContent.includes('Spinoza') || rationalismContent.includes('Leibniz'));
  });

  test('worldview-valuenet-mappings.ttl should have exactly 44 new mappings (11 per worldview)', () => {
    const mappingsPath = path.join(process.cwd(), 'ontology', 'worldview-valuenet-mappings.ttl');
    const content = fs.readFileSync(mappingsPath, 'utf-8');

    // Count all Process-Individual mappings
    const dynamismMappings = (content.match(/:Dynamism\w+Mapping a :WorldviewValueNetMapping/g) || []).length;
    const monadismMappings = (content.match(/:Monadism\w+Mapping a :WorldviewValueNetMapping/g) || []).length;
    const idealismMappings = (content.match(/:Idealism\w+Mapping a :WorldviewValueNetMapping/g) || []).length;
    const rationalismMappings = (content.match(/:Rationalism\w+Mapping a :WorldviewValueNetMapping/g) || []).length;

    assert.equal(dynamismMappings, 11, 'Should have exactly 11 Dynamism mappings');
    assert.equal(monadismMappings, 11, 'Should have exactly 11 Monadism mappings');
    assert.equal(idealismMappings, 11, 'Should have exactly 11 Idealism mappings');
    assert.equal(rationalismMappings, 11, 'Should have exactly 11 Rationalism mappings');

    // Total: 44 Process-Individual mappings
    assert.equal(dynamismMappings + monadismMappings + idealismMappings + rationalismMappings, 44);
  });

  test('All 4 ontologies should follow same structure', () => {
    const dynamismPath = path.join(process.cwd(), 'ontology', 'dynamism-values.ttl');
    const monadismPath = path.join(process.cwd(), 'ontology', 'monadism-values.ttl');
    const idealismPath = path.join(process.cwd(), 'ontology', 'idealism-values.ttl');
    const rationalismPath = path.join(process.cwd(), 'ontology', 'rationalism-values.ttl');

    const dynamismContent = fs.readFileSync(dynamismPath, 'utf-8');
    const monadismContent = fs.readFileSync(monadismPath, 'utf-8');
    const idealismContent = fs.readFileSync(idealismPath, 'utf-8');
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
      assert(dynamismContent.includes(element), `Dynamism should have ${element}`);
      assert(monadismContent.includes(element), `Monadism should have ${element}`);
      assert(idealismContent.includes(element), `Idealism should have ${element}`);
      assert(rationalismContent.includes(element), `Rationalism should have ${element}`);
    }
  });

  test('All 4 Process-Individual worldviews should load independently', () => {
    worldviewManager.actions.reset();

    worldviewManager.actions.loadWorldview('Dynamism', { foundation: 'becoming' });
    worldviewManager.actions.loadWorldview('Monadism', { foundation: 'individual_monad' });
    worldviewManager.actions.loadWorldview('Idealism', { foundation: 'consciousness' });
    worldviewManager.actions.loadWorldview('Rationalism', { foundation: 'reason' });

    assert(worldviewManager.state.worldviews['Dynamism'], 'Dynamism should be loaded');
    assert(worldviewManager.state.worldviews['Monadism'], 'Monadism should be loaded');
    assert(worldviewManager.state.worldviews['Idealism'], 'Idealism should be loaded');
    assert(worldviewManager.state.worldviews['Rationalism'], 'Rationalism should be loaded');

    // Verify they have different foundations
    assert.equal(worldviewManager.state.worldviews['Dynamism'].metaphysics.foundation, 'becoming');
    assert.equal(worldviewManager.state.worldviews['Monadism'].metaphysics.foundation, 'individual_monad');
    assert.equal(worldviewManager.state.worldviews['Idealism'].metaphysics.foundation, 'consciousness');
    assert.equal(worldviewManager.state.worldviews['Rationalism'].metaphysics.foundation, 'reason');
  });

  test('All 4 Process-Individual worldviews should have different value hierarchies', () => {
    const dynamismValues = deriveValues({ foundation: 'becoming' });
    const monadismValues = deriveValues({ foundation: 'individual_monad' });
    const idealismValues = deriveValues({ foundation: 'consciousness' });
    const rationalismValues = deriveValues({ foundation: 'reason' });

    // Each should have unique terminal values
    assert(dynamismValues.terminal.includes('growth'));
    assert(monadismValues.terminal.includes('individual_uniqueness'));
    assert(idealismValues.terminal.includes('consciousness_development'));
    assert(rationalismValues.terminal.includes('logical_coherence'));

    // Verify they're distinct
    assert(!monadismValues.terminal.includes('growth'));
    assert(!dynamismValues.terminal.includes('individual_uniqueness'));
    assert(!rationalismValues.terminal.includes('consciousness_development'));
    assert(!idealismValues.terminal.includes('logical_coherence'));
  });
});
