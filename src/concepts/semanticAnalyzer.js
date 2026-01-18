/**
 * Semantic Analyzer - Wrapper for TagTeam.js integration
 *
 * @module concepts/semanticAnalyzer
 * @description Provides a clean interface for running TagTeam semantic analysis
 *              within the IEE deliberation pipeline. Handles TagTeam.parse() calls,
 *              error handling, graceful degradation, and result caching.
 *
 * @version 1.0.0
 * @date 2026-01-18
 */

import {
  findWorldviewMatches,
  mapSalienceToLevel,
  mapTagteamDomainToIEEDomain
} from './valueMapper.js';

/**
 * Semantic Analyzer State
 */
export const semanticAnalyzer = {
  state: {
    lastAnalysis: null,
    analysisCount: 0,
    failureCount: 0,
    avgAnalysisTime: 0,
    tagteamAvailable: null  // null = unknown, true/false = checked
  },

  actions: {
    /**
     * Analyze scenario text using TagTeam semantic parser
     *
     * @param {string} scenarioText - Natural language scenario description
     * @param {Object} options - Analysis options
     * @param {number} options.confidenceThreshold - Minimum confidence for values (default: 0.3)
     * @param {boolean} options.includeMetadata - Include full TagTeam metadata (default: true)
     * @param {boolean} options.cache - Cache result in state (default: true)
     * @returns {Promise<Object|null>} Semantic analysis result or null if failed
     *
     * @example
     * const analysis = await semanticAnalyzer.actions.analyzeScenario(
     *   "A doctor provides evidence-based medical treatment to alleviate patient suffering.",
     *   { confidenceThreshold: 0.5 }
     * );
     */
    async analyzeScenario(scenarioText, options = {}) {
      const {
        confidenceThreshold = 0.3,
        includeMetadata = true,
        cache = true
      } = options;

      const startTime = performance.now();

      try {
        // Check if TagTeam is available (lazy check)
        if (semanticAnalyzer.state.tagteamAvailable === null) {
          semanticAnalyzer.state.tagteamAvailable = await semanticAnalyzer.actions.checkTagteamAvailability();
        }

        if (!semanticAnalyzer.state.tagteamAvailable) {
          console.warn('TagTeam not available, skipping semantic analysis');
          return null;
        }

        // Get TagTeam (browser global or Node.js import)
        let TagTeam;
        if (typeof window !== 'undefined' && window.TagTeam) {
          TagTeam = window.TagTeam;
        } else {
          TagTeam = await import('../../../collaborations/tagteam/dist/tagteam.js');
        }

        // Run semantic parsing
        const rawResult = TagTeam.parse(scenarioText);

        // Validate result structure
        if (!semanticAnalyzer.actions.validateTagteamResult(rawResult)) {
          console.error('TagTeam result validation failed. Result structure:', {
            hasResult: !!rawResult,
            hasVersion: !!rawResult?.version,
            version: rawResult?.version,
            hasEthicalProfile: !!rawResult?.ethicalProfile,
            hasValues: Array.isArray(rawResult?.ethicalProfile?.values),
            valuesCount: rawResult?.ethicalProfile?.values?.length,
            keys: rawResult ? Object.keys(rawResult) : []
          });
          throw new Error('Invalid TagTeam result structure');
        }

        // Filter values by confidence threshold
        const filteredValues = rawResult.ethicalProfile.values.filter(
          v => v.salience >= confidenceThreshold
        );

        // Build clean semantic analysis result
        const analysis = {
          source: 'TagTeam',
          version: rawResult.version,
          timestamp: new Date().toISOString(),

          // Semantic roles
          agent: rawResult.agent,
          action: rawResult.action,
          patient: rawResult.patient,
          semanticFrame: rawResult.semanticFrame,

          // Context intensity (12 dimensions)
          contextIntensity: rawResult.contextIntensity,

          // Ethical profile (filtered by confidence)
          detectedValues: filteredValues.map(v => ({
            name: v.name,
            salience: v.salience,
            polarity: v.polarity,
            evidence: v.evidence || [],
            domain: semanticAnalyzer.actions.getValueDomain(v.name, rawResult.ethicalProfile),
            breakdown: includeMetadata ? v.breakdown : undefined
          })),

          // Domain analysis
          dominantDomain: rawResult.ethicalProfile.dominantDomain,
          suggestedIEEDomain: mapTagteamDomainToIEEDomain(
            rawResult.ethicalProfile.dominantDomain
          ),

          // Conflicts
          valueConflicts: rawResult.ethicalProfile.conflicts || [],
          conflictScore: rawResult.ethicalProfile.conflictScore || 0,

          // Confidence
          confidence: rawResult.ethicalProfile.confidence || 0,

          // Metadata
          metadata: includeMetadata ? {
            valueSummary: rawResult.ethicalProfile.valueSummary,
            domainScores: rawResult.ethicalProfile.domainScores,
            topValues: rawResult.ethicalProfile.topValues,
            rawResultAvailable: true
          } : undefined
        };

        // Update state
        const duration = performance.now() - startTime;
        semanticAnalyzer.state.analysisCount++;
        semanticAnalyzer.state.avgAnalysisTime = (
          (semanticAnalyzer.state.avgAnalysisTime * (semanticAnalyzer.state.analysisCount - 1) + duration) /
          semanticAnalyzer.state.analysisCount
        );

        if (cache) {
          semanticAnalyzer.state.lastAnalysis = {
            scenarioText,
            analysis,
            rawResult: includeMetadata ? rawResult : null,
            timestamp: new Date().toISOString()
          };
        }

        return analysis;

      } catch (error) {
        semanticAnalyzer.state.failureCount++;
        console.warn('Semantic analysis failed:', error.message);

        if (options.throwOnError) {
          throw error;
        }

        return null;  // Graceful degradation
      }
    },

    /**
     * Check if TagTeam is available in the environment
     *
     * @returns {Promise<boolean>} True if TagTeam can be imported
     */
    async checkTagteamAvailability() {
      // In browser, TagTeam is loaded as global via UMD bundle
      if (typeof window !== 'undefined' && window.TagTeam && typeof window.TagTeam.parse === 'function') {
        return true;
      }

      // In Node.js, try dynamic import
      try {
        const TagTeam = await import('../../../collaborations/tagteam/dist/tagteam.js');
        return typeof TagTeam.parse === 'function';
      } catch (error) {
        console.warn('TagTeam bundle not found:', error.message);
        return false;
      }
    },

    /**
     * Validate TagTeam result structure
     *
     * @param {Object} result - TagTeam.parse() result
     * @returns {boolean} True if valid
     */
    validateTagteamResult(result) {
      if (!result) return false;
      if (!result.version) return false;
      if (!result.ethicalProfile) return false;
      if (!Array.isArray(result.ethicalProfile.values)) return false;
      return true;
    },

    /**
     * Get domain for a specific value
     *
     * @param {string} valueName - TagTeam value name
     * @param {Object} ethicalProfile - TagTeam ethical profile
     * @returns {string} Domain name
     */
    getValueDomain(valueName, ethicalProfile) {
      // Check if value has domain metadata
      const value = ethicalProfile.values.find(v => v.name === valueName);
      if (value && value.domain) {
        return value.domain;
      }

      // Fall back to dominant domain
      return ethicalProfile.dominantDomain || 'Unknown';
    },

    /**
     * Enhance IEE scenario with semantic analysis
     *
     * @param {Object} scenario - IEE scenario object
     * @param {Object} semanticAnalysis - Result from analyzeScenario()
     * @returns {Object} Enhanced scenario
     *
     * @example
     * const scenario = { description: "...", domain: "healthcare" };
     * const analysis = await semanticAnalyzer.actions.analyzeScenario(scenario.description);
     * const enhanced = semanticAnalyzer.actions.enhanceScenario(scenario, analysis);
     */
    enhanceScenario(scenario, semanticAnalysis) {
      if (!semanticAnalysis) {
        return scenario;  // No enhancement if analysis failed
      }

      return {
        ...scenario,

        // Use semantic domain suggestion if scenario doesn't have one
        domain: scenario.domain || semanticAnalysis.suggestedIEEDomain,

        // Add semantic analysis as new field
        semanticAnalysis: {
          source: semanticAnalysis.source,
          version: semanticAnalysis.version,

          // Semantic roles
          semanticAgent: semanticAnalysis.agent,
          semanticAction: semanticAnalysis.action,
          semanticPatient: semanticAnalysis.patient,
          semanticFrame: semanticAnalysis.semanticFrame,

          // Context
          contextIntensity: semanticAnalysis.contextIntensity,

          // Values
          detectedValues: semanticAnalysis.detectedValues,
          dominantDomain: semanticAnalysis.dominantDomain,

          // Conflicts
          valueConflicts: semanticAnalysis.valueConflicts,
          conflictScore: semanticAnalysis.conflictScore,

          // Confidence
          confidence: semanticAnalysis.confidence,

          // Metadata
          metadata: semanticAnalysis.metadata
        }
      };
    },

    /**
     * Map semantic values to worldview values
     *
     * @param {Array} detectedValues - Array of TagTeam value detections
     * @param {Object} worldviewValues - Worldview's value hierarchy
     * @returns {Array} Array of matched values for worldview evaluation
     *
     * @example
     * const detectedValues = [
     *   { name: 'Autonomy', salience: 0.8, polarity: 1 },
     *   { name: 'Beneficence', salience: 0.6, polarity: 1 }
     * ];
     * const worldviewValues = { terminal: ['self_determination', 'physical_wellbeing'], ... };
     * const matched = semanticAnalyzer.actions.mapToWorldviewValues(detectedValues, worldviewValues);
     */
    mapToWorldviewValues(detectedValues, worldviewValues) {
      const mappedValues = [];

      for (const detected of detectedValues) {
        const matches = findWorldviewMatches(detected.name, worldviewValues);

        for (const match of matches) {
          mappedValues.push({
            value: match.value,
            type: match.type,
            salience: mapSalienceToLevel(detected.salience),
            source: 'semantic_detection',
            tagteamValue: detected.name,
            tagteamSalience: detected.salience,
            polarity: detected.polarity,
            evidence: detected.evidence,
            matchQuality: match.matchQuality
          });
        }
      }

      return mappedValues;
    },

    /**
     * Get semantic analysis statistics
     *
     * @returns {Object} Statistics about semantic analysis usage
     */
    getStatistics() {
      return {
        analysisCount: semanticAnalyzer.state.analysisCount,
        failureCount: semanticAnalyzer.state.failureCount,
        successRate: semanticAnalyzer.state.analysisCount > 0
          ? ((semanticAnalyzer.state.analysisCount - semanticAnalyzer.state.failureCount) / semanticAnalyzer.state.analysisCount * 100).toFixed(2) + '%'
          : 'N/A',
        avgAnalysisTime: semanticAnalyzer.state.avgAnalysisTime.toFixed(2) + 'ms',
        tagteamAvailable: semanticAnalyzer.state.tagteamAvailable,
        lastAnalysisTimestamp: semanticAnalyzer.state.lastAnalysis?.timestamp || 'Never'
      };
    },

    /**
     * Clear cached analysis
     */
    clearCache() {
      semanticAnalyzer.state.lastAnalysis = null;
    },

    /**
     * Reset all statistics
     */
    resetStatistics() {
      semanticAnalyzer.state.analysisCount = 0;
      semanticAnalyzer.state.failureCount = 0;
      semanticAnalyzer.state.avgAnalysisTime = 0;
      semanticAnalyzer.state.lastAnalysis = null;
    },

    /**
     * Get last analysis result (for debugging)
     *
     * @returns {Object|null} Last analysis or null
     */
    getLastAnalysis() {
      return semanticAnalyzer.state.lastAnalysis;
    }
  }
};

/**
 * Convenience function: Analyze and enhance in one call
 *
 * @param {Object} scenario - IEE scenario
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} Enhanced scenario
 *
 * @example
 * const enhanced = await analyzeAndEnhanceScenario(
 *   { description: "A doctor..." },
 *   { confidenceThreshold: 0.5 }
 * );
 */
export async function analyzeAndEnhanceScenario(scenario, options = {}) {
  const analysis = await semanticAnalyzer.actions.analyzeScenario(
    scenario.description,
    options
  );

  return semanticAnalyzer.actions.enhanceScenario(scenario, analysis);
}

/**
 * Convenience function: Check if semantic analysis should be used
 *
 * @param {Object} options - Deliberation options
 * @returns {boolean} True if semantic analysis should run
 */
export function shouldUseSemanticAnalysis(options = {}) {
  // Check user preference
  if (options.useSemanticAnalysis === false) {
    return false;
  }

  // Check if TagTeam is available (cached check)
  if (semanticAnalyzer.state.tagteamAvailable === false) {
    return false;
  }

  // Default: use semantic analysis
  return true;
}

// Module metadata
export const metadata = {
  module: 'semanticAnalyzer',
  version: '1.0.0',
  description: 'Wrapper for TagTeam.js semantic analysis integration',
  dependencies: ['TagTeam.js v2.0.0', 'valueMapper.js'],
  features: [
    'Semantic role extraction',
    'Ethical value detection (50 values)',
    'Context intensity analysis (12 dimensions)',
    'Value conflict detection',
    'Domain suggestion',
    'Graceful degradation'
  ]
};
