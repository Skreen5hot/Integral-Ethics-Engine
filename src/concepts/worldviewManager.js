/**
 * Worldview Manager Concept
 *
 * Manages the twelve archetypal worldviews from Steiner's integral philosophy.
 * Each worldview has distinct metaphysical foundations that ground its value hierarchies.
 *
 * Following Concepts + Synchronizations pattern:
 * - State: worldviews, value hierarchies, active worldviews
 * - Actions: load, activate, derive values
 * - Pure utilities: metaphysics → value derivation (no side effects)
 * - Events: worldviewLoaded, worldviewActivated
 */

// ============================================================================
// PURE UTILITY FUNCTIONS
// These are deterministic, testable, and have no side effects
// ============================================================================

/**
 * Derives terminal and constitutive values from a worldview's metaphysical foundation.
 * This is a PURE FUNCTION - same inputs always produce same outputs.
 *
 * @param {Object} metaphysics - The metaphysical foundation of a worldview
 * @returns {Object} Value hierarchy with terminal, constitutive, and instrumental values
 */
export function deriveValues(metaphysics) {
  if (!metaphysics || !metaphysics.foundation) {
    throw new Error('Invalid metaphysics: must have foundation property');
  }

  const { foundation, primacy, epistemology } = metaphysics;

  // Material-Empirical Cluster
  if (foundation === 'matter') {
    return {
      terminal: ['physical_wellbeing', 'empirical_truth', 'material_security'],
      constitutive: ['health', 'bodily_comfort', 'sensory_function'],
      instrumental: ['technology', 'medicine', 'engineering', 'measurement'],
      subordinated: ['consciousness', 'meaning', 'spirituality', 'beauty'],
      reasoning: 'Materialism grounds value in physical reality. What exists is matter and its properties. Wellbeing reduces to physical states.'
    };
  }

  if (foundation === 'sensation') {
    return {
      terminal: ['experiential_richness', 'hedonic_quality', 'aesthetic_beauty'],
      constitutive: ['pleasure', 'sensory_vividness', 'immediate_experience'],
      instrumental: ['art', 'aesthetics', 'sensory_cultivation'],
      subordinated: ['abstract_principle', 'delayed_gratification', 'asceticism'],
      reasoning: 'Sensationalism grounds value in the quality of immediate experience. Reality is as it appears to sensation.'
    };
  }

  if (foundation === 'phenomena') {
    return {
      terminal: ['interpretive_honesty', 'lived_experience', 'phenomenological_depth'],
      constitutive: ['perspective_acknowledgment', 'hermeneutic_fidelity', 'experiential_validity'],
      instrumental: ['bracketing', 'phenomenological_reduction', 'interpretation'],
      subordinated: ['naive_realism', 'dogmatic_objectivity'],
      reasoning: 'Phenomenalism grounds value in faithful interpretation of how things appear. Reality is perspective-dependent.'
    };
  }

  if (foundation === 'reality_itself') {
    return {
      terminal: ['objective_truth', 'correspondence_to_reality', 'natural_law'],
      constitutive: ['factual_accuracy', 'ontological_fidelity', 'realist_epistemology'],
      instrumental: ['scientific_investigation', 'empirical_verification', 'logical_inference'],
      subordinated: ['subjectivism', 'relativism', 'social_construction'],
      reasoning: 'Realism grounds value in correspondence to mind-independent reality. Truth exists objectively.'
    };
  }

  // Process-Individual Cluster
  if (foundation === 'becoming') {
    return {
      terminal: ['growth', 'transformation', 'vital_energy', 'creative_becoming'],
      constitutive: ['developmental_potential', 'dynamic_process', 'life_force'],
      instrumental: ['cultivation', 'evolutionary_pressure', 'transformative_practice'],
      subordinated: ['static_form', 'stagnation', 'mere_being'],
      reasoning: 'Dynamism grounds value in process and becoming. Reality is fundamentally dynamic, not static.'
    };
  }

  if (foundation === 'individual_monad') {
    return {
      terminal: ['individual_uniqueness', 'personal_dignity', 'authentic_individuality'],
      constitutive: ['irreplaceable_perspective', 'autonomous_agency', 'unique_essence'],
      instrumental: ['self_actualization', 'personal_development', 'authenticity_cultivation'],
      subordinated: ['collectivism', 'conformity', 'replaceability'],
      reasoning: 'Monadism grounds value in the irreducible uniqueness of each individual. Persons are non-interchangeable monads.'
    };
  }

  if (foundation === 'consciousness') {
    return {
      terminal: ['consciousness_development', 'ideas_as_causal', 'meaning_making'],
      constitutive: ['mental_clarity', 'conceptual_understanding', 'intentional_directedness'],
      instrumental: ['education', 'contemplation', 'ideation', 'philosophical_inquiry'],
      subordinated: ['materialism', 'mechanism', 'epiphenomenalism'],
      reasoning: 'Idealism grounds value in consciousness and ideas. Mind is fundamental; matter derivative or illusory.'
    };
  }

  if (foundation === 'reason') {
    return {
      terminal: ['logical_coherence', 'universal_principles', 'systematic_order'],
      constitutive: ['rational_consistency', 'deductive_validity', 'conceptual_clarity'],
      instrumental: ['logic', 'mathematics', 'systematic_philosophy', 'formal_proof'],
      subordinated: ['irrationality', 'contradiction', 'arbitrary_preference'],
      reasoning: 'Rationalism grounds value in reason and logical necessity. Truth is accessed through rational intuition.'
    };
  }

  // Depth-Spiritual Cluster
  if (foundation === 'psyche' || foundation === 'soul') {
    return {
      terminal: ['psychological_wholeness', 'emotional_authenticity', 'soul_depth', 'individuation'],
      constitutive: ['archetypal_awareness', 'symbolic_consciousness', 'shadow_integration', 'psychic_honesty'],
      instrumental: ['dream_work', 'active_imagination', 'psychotherapy', 'mythological_study'],
      subordinated: ['surface_rationalism', 'behavioral_reductionism', 'emotional_repression', 'persona_identification', 'literalism'],
      reasoning: 'Psychism grounds value in soul depth and psychological wholeness. Unconscious is primary; consciousness derivative or surface. Archetypal structures organize experience.'
    };
  }

  if (foundation === 'living_spirit' || foundation === 'spirit' || foundation === 'pneuma') {
    return {
      terminal: ['spiritual_vitality', 'ensouled_cosmos', 'immanent_divinity', 'sacred_presence'],
      constitutive: ['animate_nature', 'spiritual_ecology', 'ritual_participation', 'sacred_awareness'],
      instrumental: ['shamanic_practice', 'ritual_ceremony', 'ecological_reciprocity', 'spirit_encounter'],
      subordinated: ['mechanistic_worldview', 'desacralized_nature', 'spirit_matter_dualism', 'anthropocentrism', 'reductionism'],
      reasoning: 'Pneumatism grounds value in living spirit (pneuma) pervading nature. Cosmos is ensouled, divine is immanent in natural world. Shamanic spirit encounters, animistic perception.'
    };
  }

  if (foundation === 'transcendent_spirit' || foundation === 'transcendent' || foundation === 'divinity') {
    return {
      terminal: ['divine_relationship', 'revealed_truth', 'spiritual_hierarchy', 'transcendent_connection'],
      constitutive: ['worship', 'obedience_to_divine', 'sacred_revelation', 'spiritual_submission'],
      instrumental: ['prayer', 'scripture', 'spiritual_practice', 'religious_community'],
      subordinated: ['secularism', 'immanentism', 'human_autonomy', 'rationalism', 'materialism'],
      reasoning: 'Spiritualism grounds value in relationship to transcendent divinity. Truth is revealed from higher realms, not discovered by unaided reason. Mystical union with divine is highest good.'
    };
  }

  if (foundation === 'mathematical_form' || foundation === 'mathematics' || foundation === 'form') {
    return {
      terminal: ['mathematical_beauty', 'structural_harmony', 'formal_perfection', 'elegant_order'],
      constitutive: ['platonic_realism', 'logical_necessity', 'abstract_thought', 'universal_structure'],
      instrumental: ['rigorous_proof', 'symbolic_notation', 'axiomatic_method', 'mathematical_intuition'],
      subordinated: ['empirical_contingency', 'applied_utility', 'informal_reasoning', 'numerical_approximation', 'constructivism'],
      reasoning: 'Mathematism grounds value in mathematical beauty, structural harmony, formal perfection. Reality is fundamentally mathematical (Platonic Forms). Mathematical truth is eternal, transcendent, discovered not invented. Beauty guides truth.'
    };
  }

  throw new Error(`Unknown metaphysical foundation: ${foundation}`);
}

/**
 * Determines which worldview cluster a foundation belongs to.
 * PURE FUNCTION - no side effects.
 *
 * @param {string} foundation - The metaphysical foundation
 * @returns {string} The cluster name
 */
export function determineCluster(foundation) {
  const clusters = {
    material_empirical: ['matter', 'sensation', 'phenomena', 'reality_itself'],
    process_individual: ['becoming', 'individual_monad', 'consciousness', 'reason'],
    depth_spiritual: ['psyche', 'living_spirit', 'transcendent_spirit', 'mathematical_form']
  };

  for (const [cluster, foundations] of Object.entries(clusters)) {
    if (foundations.includes(foundation)) {
      return cluster;
    }
  }

  return 'unknown';
}

/**
 * Generates a comprehensive worldview definition from minimal metadata.
 * PURE FUNCTION - deterministic generation.
 *
 * @param {string} name - Worldview name
 * @param {Object} metaphysics - Metaphysical foundation
 * @returns {Object} Complete worldview definition
 */
export function generateWorldview(name, metaphysics) {
  const values = deriveValues(metaphysics);
  const cluster = determineCluster(metaphysics.foundation);

  return {
    name,
    metaphysics,
    values,
    cluster,
    timestamp: new Date().toISOString()
  };
}

// ============================================================================
// WORLDVIEW MANAGER CONCEPT (Singleton)
// ============================================================================

export const worldviewManager = {
  /**
   * State - All mutable data
   * Reset this in test beforeEach hooks
   */
  state: {
    worldviews: {},           // All loaded worldview definitions
    valueHierarchies: {},     // Cached value hierarchies by worldview name
    activeWorldviews: [],     // Currently active worldview names
    loaded: false
  },

  /**
   * Actions - Business logic that may mutate state
   */
  actions: {
    /**
     * Loads a worldview from its metaphysical foundation.
     * This action wraps the pure deriveValues function.
     *
     * @param {string} name - Worldview name (e.g., 'materialism')
     * @param {Object} metaphysics - Metaphysical foundation
     */
    loadWorldview(name, metaphysics) {
      const self = worldviewManager;

      try {
        const worldview = generateWorldview(name, metaphysics);

        self.state.worldviews[name] = worldview;
        self.state.valueHierarchies[name] = worldview.values;

        self.notify('worldviewLoaded', { name, worldview });

        return worldview;
      } catch (error) {
        self.notify('worldviewLoadFailed', { name, error: error.message });
        throw error;
      }
    },

    /**
     * Activates a worldview for use in moral reasoning.
     *
     * @param {string} name - Worldview name to activate
     */
    activateWorldview(name) {
      const self = worldviewManager;

      if (!self.state.worldviews[name]) {
        throw new Error(`Worldview '${name}' not loaded. Load it first.`);
      }

      if (!self.state.activeWorldviews.includes(name)) {
        self.state.activeWorldviews.push(name);
        self.notify('worldviewActivated', { name });
      }
    },

    /**
     * Deactivates a worldview.
     *
     * @param {string} name - Worldview name to deactivate
     */
    deactivateWorldview(name) {
      const self = worldviewManager;
      const index = self.state.activeWorldviews.indexOf(name);

      if (index > -1) {
        self.state.activeWorldviews.splice(index, 1);
        self.notify('worldviewDeactivated', { name });
      }
    },

    /**
     * Gets the value hierarchy for a worldview.
     *
     * @param {string} name - Worldview name
     * @returns {Object} Value hierarchy
     */
    getValues(name) {
      const self = worldviewManager;

      if (!self.state.valueHierarchies[name]) {
        throw new Error(`Worldview '${name}' not loaded`);
      }

      return self.state.valueHierarchies[name];
    },

    /**
     * Loads all Material-Empirical worldviews (Phase 1).
     */
    loadMaterialEmpiricalWorldviews() {
      const self = worldviewManager;

      const worldviews = [
        {
          name: 'materialism',
          metaphysics: {
            foundation: 'matter',
            primacy: 'physical_reality',
            epistemology: 'empirical_observation'
          }
        },
        {
          name: 'sensationalism',
          metaphysics: {
            foundation: 'sensation',
            primacy: 'immediate_experience',
            epistemology: 'sensory_perception'
          }
        },
        {
          name: 'phenomenalism',
          metaphysics: {
            foundation: 'phenomena',
            primacy: 'lived_experience',
            epistemology: 'phenomenological_reduction'
          }
        },
        {
          name: 'realism',
          metaphysics: {
            foundation: 'reality_itself',
            primacy: 'mind_independent_reality',
            epistemology: 'scientific_realism'
          }
        }
      ];

      worldviews.forEach(({ name, metaphysics }) => {
        self.actions.loadWorldview(name, metaphysics);
        self.actions.activateWorldview(name);
      });

      self.state.loaded = true;
      self.notify('materialEmpiricalLoaded', { count: worldviews.length });
    },

    /**
     * Resets all state (for testing).
     */
    reset() {
      const self = worldviewManager;
      self.state.worldviews = {};
      self.state.valueHierarchies = {};
      self.state.activeWorldviews = [];
      self.state.loaded = false;
      self.notify('reset');
    }
  },

  /**
   * Event System - Pub/Sub for loose coupling
   */
  _subscribers: [],

  notify(event, payload = {}) {
    this._subscribers.forEach(fn => fn(event, payload));
  },

  subscribe(fn) {
    this._subscribers.push(fn);
  },

  unsubscribe(fn) {
    this._subscribers = this._subscribers.filter(sub => sub !== fn);
  }
};
