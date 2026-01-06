/**
 * Session Manager Concept
 *
 * Architecture: Concepts + Synchronizations pattern
 *
 * Responsibilities:
 * - Manage user session state (current deliberation, preferences)
 * - Persist deliberation history across sessions
 * - Store and retrieve user preferences (default worldviews, custom weights)
 * - Abstract storage layer (IndexedDB for PWA, future API persistence)
 *
 * NOTE: This follows the Concepts pattern with pure functions + stateful actions
 */

// ============================================================================
// STORAGE ADAPTER INTERFACE
// ============================================================================

/**
 * Storage Adapter Interface
 *
 * Implementations:
 * - MemoryStorageAdapter (in-memory, for testing)
 * - LocalStorageAdapter (browser localStorage, simple persistence)
 * - IndexedDBAdapter (browser IndexedDB, for PWA)
 * - APIStorageAdapter (future remote API)
 */
export class StorageAdapter {
  async getItem(key) {
    throw new Error('getItem not implemented');
  }

  async setItem(key, value) {
    throw new Error('setItem not implemented');
  }

  async removeItem(key) {
    throw new Error('removeItem not implemented');
  }

  async getAllKeys() {
    throw new Error('getAllKeys not implemented');
  }

  async clear() {
    throw new Error('clear not implemented');
  }
}

/**
 * In-Memory Storage Adapter (for testing and development)
 */
export class MemoryStorageAdapter extends StorageAdapter {
  constructor() {
    super();
    this.store = new Map();
  }

  async getItem(key) {
    const value = this.store.get(key);
    return value !== undefined ? JSON.parse(JSON.stringify(value)) : null;
  }

  async setItem(key, value) {
    this.store.set(key, JSON.parse(JSON.stringify(value)));
  }

  async removeItem(key) {
    this.store.delete(key);
  }

  async getAllKeys() {
    return Array.from(this.store.keys());
  }

  async clear() {
    this.store.clear();
  }
}

/**
 * LocalStorage Adapter (browser localStorage)
 */
export class LocalStorageAdapter extends StorageAdapter {
  constructor(prefix = 'iee_') {
    super();
    this.prefix = prefix;
  }

  _getKey(key) {
    return `${this.prefix}${key}`;
  }

  async getItem(key) {
    const item = localStorage.getItem(this._getKey(key));
    return item ? JSON.parse(item) : null;
  }

  async setItem(key, value) {
    localStorage.setItem(this._getKey(key), JSON.stringify(value));
  }

  async removeItem(key) {
    localStorage.removeItem(this._getKey(key));
  }

  async getAllKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length));
      }
    }
    return keys;
  }

  async clear() {
    const keys = await this.getAllKeys();
    for (const key of keys) {
      await this.removeItem(key);
    }
  }
}

// ============================================================================
// PURE FUNCTIONS - Data Transformations
// ============================================================================

/**
 * Create session ID
 * @returns {string} Unique session ID
 */
export function createSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create session object
 * @param {string} userId - User identifier
 * @param {Object} preferences - User preferences
 * @returns {Object} Session object
 */
export function createSession(userId, preferences = {}) {
  return {
    id: createSessionId(),
    userId: userId,
    createdAt: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    preferences: {
      defaultWorldviews: preferences.defaultWorldviews || [],
      customWeights: preferences.customWeights || {},
      theme: preferences.theme || 'light',
      ...preferences
    }
  };
}

/**
 * Update session activity timestamp
 * @param {Object} session - Session object
 * @returns {Object} Updated session object
 */
export function touchSession(session) {
  return {
    ...session,
    lastActivity: new Date().toISOString()
  };
}

/**
 * Merge user preferences
 * @param {Object} currentPreferences - Current preferences
 * @param {Object} newPreferences - New preferences to merge
 * @returns {Object} Merged preferences
 */
export function mergePreferences(currentPreferences, newPreferences) {
  return {
    ...currentPreferences,
    ...newPreferences,
    customWeights: {
      ...(currentPreferences.customWeights || {}),
      ...(newPreferences.customWeights || {})
    }
  };
}

/**
 * Format deliberation for history
 * @param {Object} deliberation - Deliberation result
 * @returns {Object} History entry
 */
export function formatHistoryEntry(deliberation) {
  return {
    id: deliberation.id,
    timestamp: deliberation.timestamp,
    scenario: deliberation.scenario.description,
    domain: deliberation.domain,
    judgment: deliberation.judgment,
    confidence: deliberation.confidence,
    confidenceLevel: deliberation.confidenceLevel,
    worldviewsCount: deliberation.worldviews.length,
    conflictsCount: deliberation.metadata.conflictsCount
  };
}

/**
 * Filter history by criteria
 * @param {Array} history - Full history
 * @param {Object} criteria - Filter criteria
 * @returns {Array} Filtered history
 */
export function filterHistory(history, criteria = {}) {
  if (!history || history.length === 0) {
    return [];
  }

  let filtered = [...history];

  // Filter by domain
  if (criteria.domain) {
    filtered = filtered.filter(entry => entry.domain === criteria.domain);
  }

  // Filter by judgment
  if (criteria.judgment) {
    filtered = filtered.filter(entry => entry.judgment === criteria.judgment);
  }

  // Filter by date range
  if (criteria.startDate) {
    const startTime = new Date(criteria.startDate).getTime();
    filtered = filtered.filter(entry => new Date(entry.timestamp).getTime() >= startTime);
  }

  if (criteria.endDate) {
    const endTime = new Date(criteria.endDate).getTime();
    filtered = filtered.filter(entry => new Date(entry.timestamp).getTime() <= endTime);
  }

  // Filter by confidence level
  if (criteria.confidenceLevel) {
    filtered = filtered.filter(entry => entry.confidenceLevel === criteria.confidenceLevel);
  }

  // Limit results
  if (criteria.limit && criteria.limit > 0) {
    filtered = filtered.slice(0, criteria.limit);
  }

  return filtered;
}

/**
 * Sort history by criteria
 * @param {Array} history - History to sort
 * @param {string} sortBy - Sort field (timestamp, confidence, domain)
 * @param {string} order - Sort order (asc, desc)
 * @returns {Array} Sorted history
 */
export function sortHistory(history, sortBy = 'timestamp', order = 'desc') {
  if (!history || history.length === 0) {
    return [];
  }

  const sorted = [...history];

  sorted.sort((a, b) => {
    let compareA, compareB;

    switch (sortBy) {
      case 'timestamp':
        compareA = new Date(a.timestamp).getTime();
        compareB = new Date(b.timestamp).getTime();
        break;
      case 'confidence':
        compareA = a.confidence;
        compareB = b.confidence;
        break;
      case 'domain':
        compareA = a.domain;
        compareB = b.domain;
        break;
      default:
        compareA = new Date(a.timestamp).getTime();
        compareB = new Date(b.timestamp).getTime();
    }

    if (order === 'asc') {
      return compareA > compareB ? 1 : compareA < compareB ? -1 : 0;
    } else {
      return compareA < compareB ? 1 : compareA > compareB ? -1 : 0;
    }
  });

  return sorted;
}

// ============================================================================
// SESSION MANAGER CONCEPT
// ============================================================================

export const sessionManager = {
  /**
   * State
   */
  state: {
    currentSession: null,
    currentDeliberation: null,
    history: [],
    storageAdapter: null,
    isInitialized: false,
    lastError: null
  },

  /**
   * Actions (stateful operations)
   */
  actions: {
    /**
     * Initialize session manager with storage adapter
     * @param {StorageAdapter} adapter - Storage adapter instance
     */
    async initialize(adapter = null) {
      try {
        const storageAdapter = adapter || new MemoryStorageAdapter();
        sessionManager.state.storageAdapter = storageAdapter;

        // Try to restore session from storage
        const savedSession = await storageAdapter.getItem('current_session');
        if (savedSession) {
          sessionManager.state.currentSession = touchSession(savedSession);
          sessionManager.emit('sessionRestored', { session: sessionManager.state.currentSession });
        }

        // Load history from storage
        const savedHistory = await storageAdapter.getItem('deliberation_history');
        if (savedHistory && Array.isArray(savedHistory)) {
          sessionManager.state.history = savedHistory;
        }

        sessionManager.state.isInitialized = true;
        sessionManager.state.lastError = null;

        sessionManager.emit('initialized', {
          hasSession: !!sessionManager.state.currentSession,
          historyCount: sessionManager.state.history.length
        });

      } catch (error) {
        sessionManager.state.lastError = error.message;
        sessionManager.emit('error', { error: error.message, action: 'initialize' });
        throw error;
      }
    },

    /**
     * Create new session
     * @param {string} userId - User identifier
     * @param {Object} preferences - Initial preferences
     */
    async createSession(userId, preferences = {}) {
      if (!sessionManager.state.isInitialized) {
        throw new Error('SessionManager not initialized. Call initialize() first.');
      }

      try {
        const session = createSession(userId, preferences);
        sessionManager.state.currentSession = session;

        // Persist to storage
        await sessionManager.state.storageAdapter.setItem('current_session', session);

        sessionManager.emit('sessionCreated', { session });

        return session;
      } catch (error) {
        sessionManager.state.lastError = error.message;
        sessionManager.emit('error', { error: error.message, action: 'createSession' });
        throw error;
      }
    },

    /**
     * End current session
     */
    async endSession() {
      if (!sessionManager.state.currentSession) {
        return;
      }

      try {
        const endedSession = sessionManager.state.currentSession;
        sessionManager.state.currentSession = null;
        sessionManager.state.currentDeliberation = null;

        await sessionManager.state.storageAdapter.removeItem('current_session');

        sessionManager.emit('sessionEnded', { session: endedSession });
      } catch (error) {
        sessionManager.state.lastError = error.message;
        sessionManager.emit('error', { error: error.message, action: 'endSession' });
        throw error;
      }
    },

    /**
     * Update user preferences
     * @param {Object} newPreferences - Preferences to update
     */
    async updatePreferences(newPreferences) {
      if (!sessionManager.state.currentSession) {
        throw new Error('No active session');
      }

      try {
        const mergedPreferences = mergePreferences(
          sessionManager.state.currentSession.preferences,
          newPreferences
        );

        sessionManager.state.currentSession = {
          ...sessionManager.state.currentSession,
          preferences: mergedPreferences,
          lastActivity: new Date().toISOString()
        };

        await sessionManager.state.storageAdapter.setItem('current_session', sessionManager.state.currentSession);

        sessionManager.emit('preferencesUpdated', { preferences: mergedPreferences });

        return mergedPreferences;
      } catch (error) {
        sessionManager.state.lastError = error.message;
        sessionManager.emit('error', { error: error.message, action: 'updatePreferences' });
        throw error;
      }
    },

    /**
     * Get current preferences
     * @returns {Object} Current preferences or defaults
     */
    getPreferences() {
      if (sessionManager.state.currentSession) {
        return sessionManager.state.currentSession.preferences;
      }

      // Return defaults if no session
      return {
        defaultWorldviews: [],
        customWeights: {},
        theme: 'light'
      };
    },

    /**
     * Save deliberation to history
     * @param {Object} deliberation - Deliberation result
     */
    async saveDeliberation(deliberation) {
      if (!sessionManager.state.isInitialized) {
        throw new Error('SessionManager not initialized');
      }

      try {
        const historyEntry = formatHistoryEntry(deliberation);

        // Add to history (most recent first)
        sessionManager.state.history.unshift(historyEntry);

        // Limit history size (keep last 100)
        if (sessionManager.state.history.length > 100) {
          sessionManager.state.history = sessionManager.state.history.slice(0, 100);
        }

        // Update current deliberation
        sessionManager.state.currentDeliberation = deliberation;

        // Persist to storage
        await sessionManager.state.storageAdapter.setItem('deliberation_history', sessionManager.state.history);

        // Touch session if exists
        if (sessionManager.state.currentSession) {
          sessionManager.state.currentSession = touchSession(sessionManager.state.currentSession);
          await sessionManager.state.storageAdapter.setItem('current_session', sessionManager.state.currentSession);
        }

        sessionManager.emit('deliberationSaved', { deliberation: historyEntry });

        return historyEntry;
      } catch (error) {
        sessionManager.state.lastError = error.message;
        sessionManager.emit('error', { error: error.message, action: 'saveDeliberation' });
        throw error;
      }
    },

    /**
     * Get deliberation history
     * @param {Object} criteria - Filter and sort criteria
     * @returns {Array} Filtered and sorted history
     */
    getHistory(criteria = {}) {
      let history = [...sessionManager.state.history];

      // Apply filters
      if (criteria.domain || criteria.judgment || criteria.startDate || criteria.endDate || criteria.confidenceLevel || criteria.limit) {
        history = filterHistory(history, criteria);
      }

      // Apply sorting
      if (criteria.sortBy || criteria.order) {
        history = sortHistory(history, criteria.sortBy, criteria.order);
      }

      return history;
    },

    /**
     * Get deliberation by ID
     * @param {string} id - Deliberation ID
     * @returns {Object|null} History entry or null
     */
    getDeliberationById(id) {
      return sessionManager.state.history.find(entry => entry.id === id) || null;
    },

    /**
     * Clear deliberation history
     */
    async clearHistory() {
      if (!sessionManager.state.isInitialized) {
        throw new Error('SessionManager not initialized');
      }

      try {
        sessionManager.state.history = [];
        sessionManager.state.currentDeliberation = null;

        await sessionManager.state.storageAdapter.setItem('deliberation_history', []);

        sessionManager.emit('historyCleared');
      } catch (error) {
        sessionManager.state.lastError = error.message;
        sessionManager.emit('error', { error: error.message, action: 'clearHistory' });
        throw error;
      }
    },

    /**
     * Export session data (for backup or migration)
     * @returns {Object} Complete session data
     */
    exportSessionData() {
      return {
        session: sessionManager.state.currentSession,
        history: sessionManager.state.history,
        exportedAt: new Date().toISOString()
      };
    },

    /**
     * Import session data (from backup or migration)
     * @param {Object} data - Session data to import
     */
    async importSessionData(data) {
      if (!sessionManager.state.isInitialized) {
        throw new Error('SessionManager not initialized');
      }

      try {
        if (data.session) {
          sessionManager.state.currentSession = touchSession(data.session);
          await sessionManager.state.storageAdapter.setItem('current_session', sessionManager.state.currentSession);
        }

        if (data.history && Array.isArray(data.history)) {
          sessionManager.state.history = data.history;
          await sessionManager.state.storageAdapter.setItem('deliberation_history', data.history);
        }

        sessionManager.emit('sessionDataImported', {
          hasSession: !!data.session,
          historyCount: data.history?.length || 0
        });
      } catch (error) {
        sessionManager.state.lastError = error.message;
        sessionManager.emit('error', { error: error.message, action: 'importSessionData' });
        throw error;
      }
    },

    /**
     * Reset session manager (for testing)
     */
    async reset() {
      sessionManager.state.currentSession = null;
      sessionManager.state.currentDeliberation = null;
      sessionManager.state.history = [];
      sessionManager.state.lastError = null;
      sessionManager.state.isInitialized = false;

      if (sessionManager.state.storageAdapter) {
        await sessionManager.state.storageAdapter.clear();
      }

      sessionManager.emit('reset');
    }
  },

  /**
   * Event emitter
   */
  listeners: {},

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  },

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
};

export default sessionManager;
