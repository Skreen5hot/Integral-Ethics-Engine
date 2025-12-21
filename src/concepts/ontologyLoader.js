/**
 * Ontology Loader Concept
 *
 * Loads and manages RDF/TTL ontology files for worldview value systems.
 * Provides simple triple store and SPARQL-like querying.
 *
 * Following Concepts + Synchronizations pattern:
 * - State: loaded ontologies, triple store, namespaces
 * - Actions: load TTL files, query triples, materialize patterns
 * - Pure utilities: TTL parsing, triple matching (no side effects)
 * - Events: ontologyLoaded, queryExecuted
 *
 * Note: This is a simplified implementation for Phase 1.
 * Full RDF/OWL reasoning will be added in later phases.
 */

import { readFile } from 'fs/promises';
import { resolve } from 'path';

// ============================================================================
// PURE UTILITY FUNCTIONS
// These are deterministic, testable, and have no side effects
// ============================================================================

/**
 * Parses a simple Turtle (TTL) string into triples.
 * PURE FUNCTION - deterministic parsing.
 *
 * This is a SIMPLIFIED parser for Phase 1. It handles:
 * - Basic triple patterns (subject predicate object .)
 * - Prefix declarations (@prefix)
 * - Comments (#)
 *
 * Full Turtle spec compliance will be added later.
 *
 * @param {string} ttlText - Turtle format text
 * @returns {Object} Parsed result with namespaces and triples
 */
export function parseTTL(ttlText) {
  const namespaces = {};
  const triples = [];
  const lines = ttlText.split('\n');

  let currentSubject = null;

  for (let line of lines) {
    // Remove comments
    const commentIndex = line.indexOf('#');
    if (commentIndex !== -1) {
      line = line.substring(0, commentIndex);
    }

    line = line.trim();

    if (line.length === 0) continue;

    // Parse prefix declarations
    if (line.startsWith('@prefix')) {
      const match = line.match(/@prefix\s+(\w+):\s+<([^>]+)>/);
      if (match) {
        namespaces[match[1]] = match[2];
      }
      continue;
    }

    // Parse triples (simplified)
    // Format: subject predicate object .
    const parts = line.split(/\s+/);

    if (parts.length >= 3) {
      let subject = parts[0];
      let predicate = parts[1];
      let object = parts.slice(2).join(' ').replace(/\s*\.\s*$/, '');

      // Handle semicolon (same subject continuation)
      if (predicate === ';') {
        subject = currentSubject;
        predicate = parts[2];
        object = parts.slice(3).join(' ').replace(/\s*\.\s*$/, '');
      } else {
        currentSubject = subject;
      }

      triples.push({
        subject: expandPrefix(subject, namespaces),
        predicate: expandPrefix(predicate, namespaces),
        object: expandPrefix(object, namespaces)
      });
    }
  }

  return { namespaces, triples };
}

/**
 * Expands a prefixed URI to full URI.
 * PURE FUNCTION.
 *
 * @param {string} term - Term possibly with prefix (e.g., "rdf:type")
 * @param {Object} namespaces - Namespace mappings
 * @returns {string} Expanded URI or original term
 */
export function expandPrefix(term, namespaces) {
  if (term.startsWith('<') && term.endsWith('>')) {
    return term.slice(1, -1); // Already a full URI
  }

  if (term.startsWith('"')) {
    return term; // Literal value
  }

  const colonIndex = term.indexOf(':');
  if (colonIndex !== -1) {
    const prefix = term.substring(0, colonIndex);
    const localName = term.substring(colonIndex + 1);

    if (namespaces[prefix]) {
      return namespaces[prefix] + localName;
    }
  }

  return term; // No expansion needed
}

/**
 * Matches triples against a pattern.
 * PURE FUNCTION - deterministic matching.
 *
 * Pattern can use null/undefined as wildcards.
 * Example: { subject: "http://example.org/Person1", predicate: null, object: null }
 * Returns all triples with that subject.
 *
 * @param {Object} pattern - Pattern to match (s, p, o can be null for wildcard)
 * @param {Array} tripleStore - Array of triples
 * @returns {Array} Matching triples
 */
export function matchTriples(pattern, tripleStore) {
  return tripleStore.filter(triple => {
    if (pattern.subject && triple.subject !== pattern.subject) return false;
    if (pattern.predicate && triple.predicate !== pattern.predicate) return false;
    if (pattern.object && triple.object !== pattern.object) return false;
    return true;
  });
}

/**
 * Materializes a worldview definition from triples.
 * PURE FUNCTION - converts RDF to worldview object.
 *
 * @param {Array} triples - Triples about a worldview
 * @param {string} worldviewURI - URI of the worldview
 * @returns {Object} Worldview definition
 */
export function materializeWorldview(triples, worldviewURI) {
  const worldview = {
    uri: worldviewURI,
    name: null,
    metaphysics: {},
    values: {
      terminal: [],
      constitutive: [],
      instrumental: [],
      subordinated: []
    }
  };

  // Extract properties from triples
  triples.forEach(triple => {
    if (triple.subject !== worldviewURI) return;

    const predicate = triple.predicate.split(/[/#]/).pop();
    const object = triple.object;

    // Map predicates to worldview properties
    if (predicate === 'name') {
      worldview.name = object.replace(/"/g, '');
    }

    if (predicate === 'foundation') {
      worldview.metaphysics.foundation = object.replace(/"/g, '');
    }

    if (predicate === 'primacy') {
      worldview.metaphysics.primacy = object.replace(/"/g, '');
    }

    if (predicate === 'epistemology') {
      worldview.metaphysics.epistemology = object.replace(/"/g, '');
    }

    if (predicate === 'terminalValue') {
      worldview.values.terminal.push(object.replace(/"/g, ''));
    }

    if (predicate === 'constitutiveValue') {
      worldview.values.constitutive.push(object.replace(/"/g, ''));
    }

    if (predicate === 'instrumentalValue') {
      worldview.values.instrumental.push(object.replace(/"/g, ''));
    }

    if (predicate === 'subordinatedValue') {
      worldview.values.subordinated.push(object.replace(/"/g, ''));
    }
  });

  return worldview;
}

// ============================================================================
// ONTOLOGY LOADER CONCEPT (Singleton)
// ============================================================================

export const ontologyLoader = {
  /**
   * State - All mutable data
   * Reset this in test beforeEach hooks
   */
  state: {
    loadedOntologies: [],      // URIs of loaded ontologies
    tripleStore: [],            // All triples from loaded ontologies
    namespaces: {},             // Namespace prefix mappings
    worldviewDefinitions: {}    // Materialized worldview objects
  },

  /**
   * Actions - Business logic that may mutate state
   */
  actions: {
    /**
     * Loads a Turtle (TTL) file from disk.
     *
     * @param {string} filePath - Path to TTL file (relative to project root)
     * @returns {Promise<Object>} Parsed ontology data
     */
    async loadTTL(filePath) {
      const self = ontologyLoader;

      try {
        const fullPath = resolve(process.cwd(), filePath);
        const ttlText = await readFile(fullPath, 'utf-8');

        const parsed = parseTTL(ttlText);

        // Merge namespaces
        Object.assign(self.state.namespaces, parsed.namespaces);

        // Add triples to store
        self.state.tripleStore.push(...parsed.triples);

        // Track loaded ontology
        if (!self.state.loadedOntologies.includes(filePath)) {
          self.state.loadedOntologies.push(filePath);
        }

        self.notify('ontologyLoaded', {
          filePath,
          tripleCount: parsed.triples.length,
          namespaceCount: Object.keys(parsed.namespaces).length
        });

        return parsed;
      } catch (error) {
        self.notify('ontologyLoadFailed', { filePath, error: error.message });
        throw error;
      }
    },

    /**
     * Queries the triple store with a pattern.
     *
     * @param {Object} pattern - Pattern with subject, predicate, object (nulls = wildcards)
     * @returns {Array} Matching triples
     */
    query(pattern) {
      const self = ontologyLoader;

      const results = matchTriples(pattern, self.state.tripleStore);

      self.notify('queryExecuted', { pattern, resultCount: results.length });

      return results;
    },

    /**
     * Materializes a worldview from the triple store.
     *
     * @param {string} worldviewURI - URI of worldview to materialize
     * @returns {Object} Worldview definition
     */
    materialize(worldviewURI) {
      const self = ontologyLoader;

      // Get all triples about this worldview
      const triples = self.actions.query({ subject: worldviewURI, predicate: null, object: null });

      if (triples.length === 0) {
        throw new Error(`No triples found for worldview: ${worldviewURI}`);
      }

      const worldview = materializeWorldview(triples, worldviewURI);

      self.state.worldviewDefinitions[worldviewURI] = worldview;

      self.notify('worldviewMaterialized', { worldviewURI, worldview });

      return worldview;
    },

    /**
     * Gets all loaded ontology URIs.
     *
     * @returns {Array} Loaded ontology URIs
     */
    getLoadedOntologies() {
      return ontologyLoader.state.loadedOntologies;
    },

    /**
     * Gets the complete triple store.
     *
     * @returns {Array} All triples
     */
    getTripleStore() {
      return ontologyLoader.state.tripleStore;
    },

    /**
     * Resets all state (for testing).
     */
    reset() {
      const self = ontologyLoader;
      self.state.loadedOntologies = [];
      self.state.tripleStore = [];
      self.state.namespaces = {};
      self.state.worldviewDefinitions = {};
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
