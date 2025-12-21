/**
 * Unit Tests for WorldviewManager Concept
 *
 * Tests the pure value derivation functions and worldview management logic.
 * Following the process-isolated testing strategy from testStrategy.md.
 */

import { describe, test, beforeEach } from './test-utils.js';
import { strictEqual, deepStrictEqual, ok, throws } from '../src/assert.js';
import {
  deriveValues,
  determineCluster,
  generateWorldview,
  worldviewManager
} from '../src/concepts/worldviewManager.js';

// ============================================================================
// PURE FUNCTION TESTS
// These test deterministic value derivation without side effects
// ============================================================================

describe('Pure Value Derivation Functions', () => {
  test('deriveValues: materialism generates correct value hierarchy', () => {
    const metaphysics = {
      foundation: 'matter',
      primacy: 'physical_reality',
      epistemology: 'empirical_observation'
    };

    const values = deriveValues(metaphysics);

    // Terminal values
    ok(values.terminal.includes('physical_wellbeing'), 'Should include physical_wellbeing');
    ok(values.terminal.includes('empirical_truth'), 'Should include empirical_truth');
    ok(values.terminal.includes('material_security'), 'Should include material_security');

    // Subordinated values
    ok(values.subordinated.includes('consciousness'), 'Should subordinate consciousness');
    ok(values.subordinated.includes('spirituality'), 'Should subordinate spirituality');

    // Reasoning provided
    ok(values.reasoning.includes('matter'), 'Should explain grounding in matter');
  });

  test('deriveValues: realism generates correct value hierarchy', () => {
    const metaphysics = {
      foundation: 'reality_itself',
      primacy: 'mind_independent_reality',
      epistemology: 'scientific_realism'
    };

    const values = deriveValues(metaphysics);

    // Terminal values
    ok(values.terminal.includes('objective_truth'), 'Should include objective_truth');
    ok(values.terminal.includes('natural_law'), 'Should include natural_law');

    // Subordinated values
    ok(values.subordinated.includes('subjectivism'), 'Should subordinate subjectivism');
    ok(values.subordinated.includes('relativism'), 'Should subordinate relativism');
  });

  test('deriveValues: sensationalism generates correct value hierarchy', () => {
    const metaphysics = {
      foundation: 'sensation',
      primacy: 'immediate_experience',
      epistemology: 'sensory_perception'
    };

    const values = deriveValues(metaphysics);

    // Terminal values
    ok(values.terminal.includes('experiential_richness'), 'Should include experiential_richness');
    ok(values.terminal.includes('hedonic_quality'), 'Should include hedonic_quality');
    ok(values.terminal.includes('aesthetic_beauty'), 'Should include aesthetic_beauty');

    // Subordinated values
    ok(values.subordinated.includes('abstract_principle'), 'Should subordinate abstract principles');
  });

  test('deriveValues: phenomenalism generates correct value hierarchy', () => {
    const metaphysics = {
      foundation: 'phenomena',
      primacy: 'lived_experience',
      epistemology: 'phenomenological_reduction'
    };

    const values = deriveValues(metaphysics);

    // Terminal values
    ok(values.terminal.includes('interpretive_honesty'), 'Should include interpretive_honesty');
    ok(values.terminal.includes('lived_experience'), 'Should include lived_experience');

    // Subordinated values
    ok(values.subordinated.includes('naive_realism'), 'Should subordinate naive_realism');
  });

  test('deriveValues: deterministic - same input produces same output', () => {
    const metaphysics = { foundation: 'matter', primacy: 'physical_reality' };

    const values1 = deriveValues(metaphysics);
    const values2 = deriveValues(metaphysics);

    deepStrictEqual(values1, values2, 'Should produce identical results for same input');
  });

  test('deriveValues: throws error for invalid metaphysics', () => {
    throws(
      () => deriveValues({}),
      Error,
      'Should throw error for missing foundation'
    );

    throws(
      () => deriveValues({ foundation: 'invalid' }),
      Error,
      'Should throw error for unknown foundation'
    );
  });

  test('determineCluster: correctly identifies material-empirical cluster', () => {
    strictEqual(determineCluster('matter'), 'material_empirical');
    strictEqual(determineCluster('sensation'), 'material_empirical');
    strictEqual(determineCluster('phenomena'), 'material_empirical');
    strictEqual(determineCluster('reality_itself'), 'material_empirical');
  });

  test('determineCluster: correctly identifies process-individual cluster', () => {
    strictEqual(determineCluster('becoming'), 'process_individual');
    strictEqual(determineCluster('individual_monad'), 'process_individual');
    strictEqual(determineCluster('consciousness'), 'process_individual');
    strictEqual(determineCluster('reason'), 'process_individual');
  });

  test('determineCluster: correctly identifies depth-spiritual cluster', () => {
    strictEqual(determineCluster('psyche'), 'depth_spiritual');
    strictEqual(determineCluster('living_spirit'), 'depth_spiritual');
    strictEqual(determineCluster('transcendent_spirit'), 'depth_spiritual');
    strictEqual(determineCluster('mathematical_form'), 'depth_spiritual');
  });

  test('determineCluster: returns unknown for invalid foundation', () => {
    strictEqual(determineCluster('invalid'), 'unknown');
  });

  test('generateWorldview: creates complete worldview definition', () => {
    const metaphysics = {
      foundation: 'matter',
      primacy: 'physical_reality',
      epistemology: 'empirical_observation'
    };

    const worldview = generateWorldview('materialism', metaphysics);

    strictEqual(worldview.name, 'materialism');
    strictEqual(worldview.cluster, 'material_empirical');
    ok(worldview.values.terminal.length > 0, 'Should have terminal values');
    ok(worldview.timestamp, 'Should have timestamp');
  });
});

// ============================================================================
// WORLDVIEW MANAGER CONCEPT TESTS
// These test the stateful concept behavior
// ============================================================================

describe('WorldviewManager Concept', () => {
  // THE GOLDEN RULE: Reset state before each test
  beforeEach(() => {
    worldviewManager.state.worldviews = {};
    worldviewManager.state.valueHierarchies = {};
    worldviewManager.state.activeWorldviews = [];
    worldviewManager.state.loaded = false;
    worldviewManager._subscribers = [];
  });

  test('loadWorldview: loads and stores worldview', () => {
    const metaphysics = {
      foundation: 'matter',
      primacy: 'physical_reality',
      epistemology: 'empirical_observation'
    };

    const worldview = worldviewManager.actions.loadWorldview('materialism', metaphysics);

    strictEqual(worldview.name, 'materialism');
    ok(worldviewManager.state.worldviews['materialism'], 'Should store in worldviews');
    ok(worldviewManager.state.valueHierarchies['materialism'], 'Should store value hierarchy');
  });

  test('loadWorldview: emits worldviewLoaded event', () => {
    let eventEmitted = false;

    worldviewManager.subscribe((event, payload) => {
      if (event === 'worldviewLoaded') {
        eventEmitted = true;
        strictEqual(payload.name, 'realism');
      }
    });

    worldviewManager.actions.loadWorldview('realism', {
      foundation: 'reality_itself',
      primacy: 'mind_independent_reality'
    });

    ok(eventEmitted, 'Should emit worldviewLoaded event');
  });

  test('activateWorldview: activates loaded worldview', () => {
    worldviewManager.actions.loadWorldview('materialism', {
      foundation: 'matter',
      primacy: 'physical_reality'
    });

    worldviewManager.actions.activateWorldview('materialism');

    ok(worldviewManager.state.activeWorldviews.includes('materialism'),
       'Should add to active worldviews');
  });

  test('activateWorldview: throws error for unloaded worldview', () => {
    throws(
      () => worldviewManager.actions.activateWorldview('nonexistent'),
      Error,
      'Should throw error for unloaded worldview'
    );
  });

  test('activateWorldview: does not duplicate activation', () => {
    worldviewManager.actions.loadWorldview('materialism', {
      foundation: 'matter',
      primacy: 'physical_reality'
    });

    worldviewManager.actions.activateWorldview('materialism');
    worldviewManager.actions.activateWorldview('materialism');

    strictEqual(
      worldviewManager.state.activeWorldviews.filter(w => w === 'materialism').length,
      1,
      'Should only appear once in active worldviews'
    );
  });

  test('deactivateWorldview: removes from active worldviews', () => {
    worldviewManager.actions.loadWorldview('materialism', {
      foundation: 'matter',
      primacy: 'physical_reality'
    });

    worldviewManager.actions.activateWorldview('materialism');
    worldviewManager.actions.deactivateWorldview('materialism');

    ok(!worldviewManager.state.activeWorldviews.includes('materialism'),
       'Should remove from active worldviews');
  });

  test('getValues: returns value hierarchy for loaded worldview', () => {
    worldviewManager.actions.loadWorldview('materialism', {
      foundation: 'matter',
      primacy: 'physical_reality'
    });

    const values = worldviewManager.actions.getValues('materialism');

    ok(values.terminal.includes('physical_wellbeing'), 'Should return correct values');
  });

  test('getValues: throws error for unloaded worldview', () => {
    throws(
      () => worldviewManager.actions.getValues('nonexistent'),
      Error,
      'Should throw error for unloaded worldview'
    );
  });

  test('loadMaterialEmpiricalWorldviews: loads all 4 Phase 1 worldviews', () => {
    worldviewManager.actions.loadMaterialEmpiricalWorldviews();

    strictEqual(Object.keys(worldviewManager.state.worldviews).length, 4,
                'Should load 4 worldviews');
    ok(worldviewManager.state.worldviews['materialism'], 'Should load materialism');
    ok(worldviewManager.state.worldviews['sensationalism'], 'Should load sensationalism');
    ok(worldviewManager.state.worldviews['phenomenalism'], 'Should load phenomenalism');
    ok(worldviewManager.state.worldviews['realism'], 'Should load realism');
  });

  test('loadMaterialEmpiricalWorldviews: activates all loaded worldviews', () => {
    worldviewManager.actions.loadMaterialEmpiricalWorldviews();

    strictEqual(worldviewManager.state.activeWorldviews.length, 4,
                'Should activate all 4 worldviews');
  });

  test('loadMaterialEmpiricalWorldviews: sets loaded flag', () => {
    worldviewManager.actions.loadMaterialEmpiricalWorldviews();

    strictEqual(worldviewManager.state.loaded, true, 'Should set loaded flag');
  });

  test('reset: clears all state', () => {
    worldviewManager.actions.loadMaterialEmpiricalWorldviews();
    worldviewManager.actions.reset();

    strictEqual(Object.keys(worldviewManager.state.worldviews).length, 0,
                'Should clear worldviews');
    strictEqual(worldviewManager.state.activeWorldviews.length, 0,
                'Should clear active worldviews');
    strictEqual(worldviewManager.state.loaded, false, 'Should clear loaded flag');
  });
});

// ============================================================================
// WORLDVIEW INDEPENDENCE TESTS
// Critical: Each worldview must be independent, no reduction
// ============================================================================

describe('Worldview Independence', () => {
  beforeEach(() => {
    worldviewManager.actions.reset();
  });

  test('materialism and realism produce distinct value hierarchies', () => {
    const materialismValues = deriveValues({ foundation: 'matter' });
    const realismValues = deriveValues({ foundation: 'reality_itself' });

    // They should share some material-empirical characteristics
    // but have distinct terminal values
    ok(materialismValues.terminal.includes('physical_wellbeing'), 'Materialism values physical wellbeing');
    ok(realismValues.terminal.includes('objective_truth'), 'Realism values objective truth');

    // Reasoning should be distinct
    ok(materialismValues.reasoning.includes('matter'), 'Materialism reasoning references matter');
    ok(realismValues.reasoning.includes('reality'), 'Realism reasoning references reality');
  });

  test('no worldview reduces to another', () => {
    const materialEmpirical = ['matter', 'sensation', 'phenomena', 'reality_itself'];

    const allValues = materialEmpirical.map(foundation => deriveValues({ foundation }));

    // Each should have unique combination of terminal values
    const terminalSets = allValues.map(v => v.terminal.sort().join(','));
    const uniqueSets = new Set(terminalSets);

    strictEqual(uniqueSets.size, 4, 'All 4 worldviews should have distinct terminal value sets');
  });

  test('all Phase 1 worldviews belong to material-empirical cluster', () => {
    worldviewManager.actions.loadMaterialEmpiricalWorldviews();

    Object.values(worldviewManager.state.worldviews).forEach(worldview => {
      strictEqual(worldview.cluster, 'material_empirical',
                  `${worldview.name} should be in material_empirical cluster`);
    });
  });
});
