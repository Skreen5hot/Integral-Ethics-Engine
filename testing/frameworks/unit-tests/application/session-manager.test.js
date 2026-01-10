/**
 * Unit Tests for Session Manager
 *
 * Tests the session management concept including:
 * - Session lifecycle (create, update, end)
 * - Deliberation history management
 * - User preferences persistence
 * - Storage adapter abstraction
 * - Pure functions for data transformations
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  createSessionId,
  createSession,
  touchSession,
  mergePreferences,
  formatHistoryEntry,
  filterHistory,
  sortHistory,
  sessionManager,
  MemoryStorageAdapter,
  LocalStorageAdapter
} from '../../src/application/sessionManager.js';

// ============================================================================
// PURE FUNCTION TESTS - Session Creation and Manipulation
// ============================================================================

describe('createSessionId', () => {
  it('should create unique session IDs', () => {
    const id1 = createSessionId();
    const id2 = createSessionId();

    assert.ok(id1.startsWith('session_'));
    assert.ok(id2.startsWith('session_'));
    assert.notEqual(id1, id2);
  });

  it('should create session IDs in correct format', () => {
    const id = createSessionId();
    assert.match(id, /^session_\d+_[a-z0-9]+$/);
  });
});

describe('createSession', () => {
  it('should create session with required fields', () => {
    const session = createSession('user-123');

    assert.ok(session.id.startsWith('session_'));
    assert.equal(session.userId, 'user-123');
    assert.ok(session.createdAt);
    assert.ok(session.lastActivity);
    assert.ok(session.preferences);
  });

  it('should create session with default preferences', () => {
    const session = createSession('user-123');

    assert.deepEqual(session.preferences.defaultWorldviews, []);
    assert.deepEqual(session.preferences.customWeights, {});
    assert.equal(session.preferences.theme, 'light');
  });

  it('should create session with custom preferences', () => {
    const preferences = {
      defaultWorldviews: ['Materialism', 'Spiritualism'],
      customWeights: { 'Materialism': 0.8 },
      theme: 'dark'
    };

    const session = createSession('user-123', preferences);

    assert.deepEqual(session.preferences.defaultWorldviews, ['Materialism', 'Spiritualism']);
    assert.deepEqual(session.preferences.customWeights, { 'Materialism': 0.8 });
    assert.equal(session.preferences.theme, 'dark');
  });

  it('should set timestamps in ISO format', () => {
    const session = createSession('user-123');

    assert.ok(Date.parse(session.createdAt));
    assert.ok(Date.parse(session.lastActivity));
  });
});

describe('touchSession', () => {
  it('should update lastActivity timestamp', (t) => {
    const session = createSession('user-123');
    const originalActivity = session.lastActivity;

    // Wait a tiny bit to ensure timestamp changes
    setTimeout(() => {
      const touched = touchSession(session);

      assert.notEqual(touched.lastActivity, originalActivity);
      assert.ok(new Date(touched.lastActivity) > new Date(originalActivity));
    }, 10);
  });

  it('should preserve other session fields', () => {
    const session = createSession('user-123', { theme: 'dark' });
    const touched = touchSession(session);

    assert.equal(touched.id, session.id);
    assert.equal(touched.userId, session.userId);
    assert.equal(touched.createdAt, session.createdAt);
    assert.equal(touched.preferences.theme, 'dark');
  });
});

describe('mergePreferences', () => {
  it('should merge preferences correctly', () => {
    const current = {
      defaultWorldviews: ['Materialism'],
      customWeights: { 'Materialism': 0.8 },
      theme: 'light'
    };

    const newPrefs = {
      defaultWorldviews: ['Spiritualism'],
      theme: 'dark'
    };

    const merged = mergePreferences(current, newPrefs);

    assert.deepEqual(merged.defaultWorldviews, ['Spiritualism']);
    assert.equal(merged.theme, 'dark');
  });

  it('should merge customWeights deeply', () => {
    const current = {
      customWeights: {
        'Materialism': 0.8,
        'Realism': 0.7
      }
    };

    const newPrefs = {
      customWeights: {
        'Spiritualism': 0.9
      }
    };

    const merged = mergePreferences(current, newPrefs);

    assert.equal(merged.customWeights['Materialism'], 0.8);
    assert.equal(merged.customWeights['Realism'], 0.7);
    assert.equal(merged.customWeights['Spiritualism'], 0.9);
  });

  it('should handle empty current preferences', () => {
    const merged = mergePreferences({}, { theme: 'dark' });

    assert.equal(merged.theme, 'dark');
  });
});

// ============================================================================
// PURE FUNCTION TESTS - History Management
// ============================================================================

describe('formatHistoryEntry', () => {
  const deliberation = {
    id: 'delib-123',
    timestamp: '2024-01-01T12:00:00Z',
    scenario: {
      description: 'A patient is on life support',
      domain: 'healthcare'
    },
    domain: 'healthcare',
    judgment: 'permissible',
    confidence: 0.75,
    confidenceLevel: 'moderate',
    worldviews: [
      { worldview: 'Materialism' },
      { worldview: 'Spiritualism' }
    ],
    metadata: {
      conflictsCount: 1
    }
  };

  it('should format deliberation into history entry', () => {
    const entry = formatHistoryEntry(deliberation);

    assert.equal(entry.id, 'delib-123');
    assert.equal(entry.timestamp, '2024-01-01T12:00:00Z');
    assert.equal(entry.scenario, 'A patient is on life support');
    assert.equal(entry.domain, 'healthcare');
    assert.equal(entry.judgment, 'permissible');
    assert.equal(entry.confidence, 0.75);
    assert.equal(entry.confidenceLevel, 'moderate');
    assert.equal(entry.worldviewsCount, 2);
    assert.equal(entry.conflictsCount, 1);
  });

  it('should include only summary fields', () => {
    const entry = formatHistoryEntry(deliberation);

    const fields = Object.keys(entry);
    assert.ok(fields.includes('id'));
    assert.ok(fields.includes('timestamp'));
    assert.ok(fields.includes('scenario'));
    assert.ok(fields.includes('domain'));
    assert.ok(fields.includes('judgment'));
    assert.ok(fields.includes('confidence'));
    assert.ok(fields.includes('confidenceLevel'));
    assert.ok(fields.includes('worldviewsCount'));
    assert.ok(fields.includes('conflictsCount'));

    // Should NOT include full worldviews array
    assert.ok(!entry.worldviews);
  });
});

describe('filterHistory', () => {
  const history = [
    { id: '1', timestamp: '2024-01-01T12:00:00Z', domain: 'healthcare', judgment: 'permissible', confidence: 0.8, confidenceLevel: 'high' },
    { id: '2', timestamp: '2024-01-02T12:00:00Z', domain: 'spiritual', judgment: 'impermissible', confidence: 0.7, confidenceLevel: 'moderate' },
    { id: '3', timestamp: '2024-01-03T12:00:00Z', domain: 'healthcare', judgment: 'uncertain', confidence: 0.5, confidenceLevel: 'low' },
    { id: '4', timestamp: '2024-01-04T12:00:00Z', domain: 'education', judgment: 'permissible', confidence: 0.9, confidenceLevel: 'high' }
  ];

  it('should filter by domain', () => {
    const filtered = filterHistory(history, { domain: 'healthcare' });

    assert.equal(filtered.length, 2);
    assert.ok(filtered.every(entry => entry.domain === 'healthcare'));
  });

  it('should filter by judgment', () => {
    const filtered = filterHistory(history, { judgment: 'permissible' });

    assert.equal(filtered.length, 2);
    assert.ok(filtered.every(entry => entry.judgment === 'permissible'));
  });

  it('should filter by date range (startDate)', () => {
    const filtered = filterHistory(history, { startDate: '2024-01-02T00:00:00Z' });

    assert.equal(filtered.length, 3);
    assert.ok(filtered.every(entry => new Date(entry.timestamp) >= new Date('2024-01-02T00:00:00Z')));
  });

  it('should filter by date range (endDate)', () => {
    const filtered = filterHistory(history, { endDate: '2024-01-02T23:59:59Z' });

    assert.equal(filtered.length, 2);
    assert.ok(filtered.every(entry => new Date(entry.timestamp) <= new Date('2024-01-02T23:59:59Z')));
  });

  it('should filter by confidence level', () => {
    const filtered = filterHistory(history, { confidenceLevel: 'high' });

    assert.equal(filtered.length, 2);
    assert.ok(filtered.every(entry => entry.confidenceLevel === 'high'));
  });

  it('should apply limit', () => {
    const filtered = filterHistory(history, { limit: 2 });

    assert.equal(filtered.length, 2);
  });

  it('should combine multiple filters', () => {
    const filtered = filterHistory(history, {
      domain: 'healthcare',
      judgment: 'permissible'
    });

    assert.equal(filtered.length, 1);
    assert.equal(filtered[0].id, '1');
  });

  it('should return empty array for no matches', () => {
    const filtered = filterHistory(history, { domain: 'nonexistent' });

    assert.equal(filtered.length, 0);
  });

  it('should return empty array for empty history', () => {
    const filtered = filterHistory([], { domain: 'healthcare' });

    assert.equal(filtered.length, 0);
  });
});

describe('sortHistory', () => {
  const history = [
    { id: '1', timestamp: '2024-01-03T12:00:00Z', confidence: 0.5, domain: 'healthcare' },
    { id: '2', timestamp: '2024-01-01T12:00:00Z', confidence: 0.9, domain: 'spiritual' },
    { id: '3', timestamp: '2024-01-02T12:00:00Z', confidence: 0.7, domain: 'education' }
  ];

  it('should sort by timestamp descending (default)', () => {
    const sorted = sortHistory(history);

    assert.equal(sorted[0].id, '1'); // 2024-01-03
    assert.equal(sorted[1].id, '3'); // 2024-01-02
    assert.equal(sorted[2].id, '2'); // 2024-01-01
  });

  it('should sort by timestamp ascending', () => {
    const sorted = sortHistory(history, 'timestamp', 'asc');

    assert.equal(sorted[0].id, '2'); // 2024-01-01
    assert.equal(sorted[1].id, '3'); // 2024-01-02
    assert.equal(sorted[2].id, '1'); // 2024-01-03
  });

  it('should sort by confidence descending', () => {
    const sorted = sortHistory(history, 'confidence', 'desc');

    assert.equal(sorted[0].confidence, 0.9);
    assert.equal(sorted[1].confidence, 0.7);
    assert.equal(sorted[2].confidence, 0.5);
  });

  it('should sort by confidence ascending', () => {
    const sorted = sortHistory(history, 'confidence', 'asc');

    assert.equal(sorted[0].confidence, 0.5);
    assert.equal(sorted[1].confidence, 0.7);
    assert.equal(sorted[2].confidence, 0.9);
  });

  it('should sort by domain alphabetically', () => {
    const sorted = sortHistory(history, 'domain', 'asc');

    assert.equal(sorted[0].domain, 'education');
    assert.equal(sorted[1].domain, 'healthcare');
    assert.equal(sorted[2].domain, 'spiritual');
  });

  it('should return empty array for empty history', () => {
    const sorted = sortHistory([]);

    assert.equal(sorted.length, 0);
  });
});

// ============================================================================
// STORAGE ADAPTER TESTS
// ============================================================================

describe('MemoryStorageAdapter', () => {
  let adapter;

  beforeEach(() => {
    adapter = new MemoryStorageAdapter();
  });

  it('should store and retrieve items', async () => {
    await adapter.setItem('key1', { value: 'test' });
    const item = await adapter.getItem('key1');

    assert.deepEqual(item, { value: 'test' });
  });

  it('should return null for non-existent keys', async () => {
    const item = await adapter.getItem('nonexistent');

    assert.equal(item, null);
  });

  it('should remove items', async () => {
    await adapter.setItem('key1', { value: 'test' });
    await adapter.removeItem('key1');
    const item = await adapter.getItem('key1');

    assert.equal(item, null);
  });

  it('should get all keys', async () => {
    await adapter.setItem('key1', { value: '1' });
    await adapter.setItem('key2', { value: '2' });

    const keys = await adapter.getAllKeys();

    assert.equal(keys.length, 2);
    assert.ok(keys.includes('key1'));
    assert.ok(keys.includes('key2'));
  });

  it('should clear all items', async () => {
    await adapter.setItem('key1', { value: '1' });
    await adapter.setItem('key2', { value: '2' });
    await adapter.clear();

    const keys = await adapter.getAllKeys();

    assert.equal(keys.length, 0);
  });

  it('should deep clone values (no reference sharing)', async () => {
    const original = { nested: { value: 'test' } };
    await adapter.setItem('key1', original);

    original.nested.value = 'modified';

    const retrieved = await adapter.getItem('key1');

    assert.equal(retrieved.nested.value, 'test'); // Should not be 'modified'
  });
});

// ============================================================================
// SESSION MANAGER ACTIONS TESTS
// ============================================================================

describe('sessionManager.actions.initialize', () => {
  beforeEach(async () => {
    await sessionManager.actions.reset();
  });

  it('should initialize with default memory adapter', async () => {
    await sessionManager.actions.initialize();

    assert.equal(sessionManager.state.isInitialized, true);
    assert.ok(sessionManager.state.storageAdapter);
  });

  it('should initialize with custom adapter', async () => {
    const customAdapter = new MemoryStorageAdapter();
    await sessionManager.actions.initialize(customAdapter);

    assert.equal(sessionManager.state.storageAdapter, customAdapter);
  });

  it('should restore saved session from storage', async () => {
    const adapter = new MemoryStorageAdapter();
    const savedSession = createSession('user-123');
    await adapter.setItem('current_session', savedSession);

    await sessionManager.actions.initialize(adapter);

    assert.ok(sessionManager.state.currentSession);
    assert.equal(sessionManager.state.currentSession.userId, 'user-123');
  });

  it('should restore history from storage', async () => {
    const adapter = new MemoryStorageAdapter();
    const savedHistory = [
      { id: '1', scenario: 'Test 1' },
      { id: '2', scenario: 'Test 2' }
    ];
    await adapter.setItem('deliberation_history', savedHistory);

    await sessionManager.actions.initialize(adapter);

    assert.equal(sessionManager.state.history.length, 2);
  });

  it('should emit initialized event', async () => {
    let eventData = null;

    sessionManager.on('initialized', (data) => {
      eventData = data;
    });

    await sessionManager.actions.initialize();

    assert.ok(eventData);
    assert.equal(eventData.hasSession, false);
    assert.equal(eventData.historyCount, 0);
  });
});

describe('sessionManager.actions.createSession', () => {
  beforeEach(async () => {
    await sessionManager.actions.reset();
    await sessionManager.actions.initialize();
  });

  it('should create new session', async () => {
    const session = await sessionManager.actions.createSession('user-123');

    assert.ok(session);
    assert.equal(session.userId, 'user-123');
    assert.equal(sessionManager.state.currentSession.userId, 'user-123');
  });

  it('should create session with preferences', async () => {
    const preferences = { theme: 'dark' };
    const session = await sessionManager.actions.createSession('user-123', preferences);

    assert.equal(session.preferences.theme, 'dark');
  });

  it('should persist session to storage', async () => {
    await sessionManager.actions.createSession('user-123');

    const stored = await sessionManager.state.storageAdapter.getItem('current_session');

    assert.ok(stored);
    assert.equal(stored.userId, 'user-123');
  });

  it('should emit sessionCreated event', async () => {
    let eventData = null;

    sessionManager.on('sessionCreated', (data) => {
      eventData = data;
    });

    await sessionManager.actions.createSession('user-123');

    assert.ok(eventData);
    assert.ok(eventData.session);
    assert.equal(eventData.session.userId, 'user-123');
  });

  it('should throw error if not initialized', async () => {
    await sessionManager.actions.reset();

    await assert.rejects(
      async () => {
        await sessionManager.actions.createSession('user-123');
      },
      {
        message: /not initialized/
      }
    );
  });
});

describe('sessionManager.actions.endSession', () => {
  beforeEach(async () => {
    await sessionManager.actions.reset();
    await sessionManager.actions.initialize();
  });

  it('should end current session', async () => {
    await sessionManager.actions.createSession('user-123');
    await sessionManager.actions.endSession();

    assert.equal(sessionManager.state.currentSession, null);
    assert.equal(sessionManager.state.currentDeliberation, null);
  });

  it('should remove session from storage', async () => {
    await sessionManager.actions.createSession('user-123');
    await sessionManager.actions.endSession();

    const stored = await sessionManager.state.storageAdapter.getItem('current_session');

    assert.equal(stored, null);
  });

  it('should emit sessionEnded event', async () => {
    let eventData = null;

    sessionManager.on('sessionEnded', (data) => {
      eventData = data;
    });

    await sessionManager.actions.createSession('user-123');
    await sessionManager.actions.endSession();

    assert.ok(eventData);
    assert.ok(eventData.session);
  });

  it('should handle ending non-existent session gracefully', async () => {
    await sessionManager.actions.endSession(); // Should not throw
  });
});

describe('sessionManager.actions.updatePreferences', () => {
  beforeEach(async () => {
    await sessionManager.actions.reset();
    await sessionManager.actions.initialize();
    await sessionManager.actions.createSession('user-123', { theme: 'light' });
  });

  it('should update preferences', async () => {
    const updated = await sessionManager.actions.updatePreferences({ theme: 'dark' });

    assert.equal(updated.theme, 'dark');
    assert.equal(sessionManager.state.currentSession.preferences.theme, 'dark');
  });

  it('should merge with existing preferences', async () => {
    await sessionManager.actions.updatePreferences({ defaultWorldviews: ['Materialism'] });
    const updated = await sessionManager.actions.updatePreferences({ theme: 'dark' });

    assert.deepEqual(updated.defaultWorldviews, ['Materialism']);
    assert.equal(updated.theme, 'dark');
  });

  it('should persist updated preferences', async () => {
    await sessionManager.actions.updatePreferences({ theme: 'dark' });

    const stored = await sessionManager.state.storageAdapter.getItem('current_session');

    assert.equal(stored.preferences.theme, 'dark');
  });

  it('should emit preferencesUpdated event', async () => {
    let eventData = null;

    sessionManager.on('preferencesUpdated', (data) => {
      eventData = data;
    });

    await sessionManager.actions.updatePreferences({ theme: 'dark' });

    assert.ok(eventData);
    assert.equal(eventData.preferences.theme, 'dark');
  });

  it('should throw error if no active session', async () => {
    await sessionManager.actions.endSession();

    await assert.rejects(
      async () => {
        await sessionManager.actions.updatePreferences({ theme: 'dark' });
      },
      {
        message: /No active session/
      }
    );
  });
});

describe('sessionManager.actions.getPreferences', () => {
  beforeEach(async () => {
    await sessionManager.actions.reset();
    await sessionManager.actions.initialize();
  });

  it('should return session preferences when session exists', async () => {
    await sessionManager.actions.createSession('user-123', { theme: 'dark' });

    const preferences = sessionManager.actions.getPreferences();

    assert.equal(preferences.theme, 'dark');
  });

  it('should return defaults when no session exists', () => {
    const preferences = sessionManager.actions.getPreferences();

    assert.deepEqual(preferences.defaultWorldviews, []);
    assert.deepEqual(preferences.customWeights, {});
    assert.equal(preferences.theme, 'light');
  });
});

describe('sessionManager.actions.saveDeliberation', () => {
  beforeEach(async () => {
    await sessionManager.actions.reset();
    await sessionManager.actions.initialize();
  });

  const mockDeliberation = {
    id: 'delib-123',
    timestamp: '2024-01-01T12:00:00Z',
    scenario: { description: 'Test scenario', domain: 'healthcare' },
    domain: 'healthcare',
    judgment: 'permissible',
    confidence: 0.75,
    confidenceLevel: 'moderate',
    worldviews: [{ worldview: 'Materialism' }],
    metadata: { conflictsCount: 0 }
  };

  it('should save deliberation to history', async () => {
    await sessionManager.actions.saveDeliberation(mockDeliberation);

    assert.equal(sessionManager.state.history.length, 1);
    assert.equal(sessionManager.state.history[0].id, 'delib-123');
  });

  it('should add to beginning of history (most recent first)', async () => {
    const delib1 = { ...mockDeliberation, id: 'delib-1' };
    const delib2 = { ...mockDeliberation, id: 'delib-2' };

    await sessionManager.actions.saveDeliberation(delib1);
    await sessionManager.actions.saveDeliberation(delib2);

    assert.equal(sessionManager.state.history[0].id, 'delib-2');
    assert.equal(sessionManager.state.history[1].id, 'delib-1');
  });

  it('should limit history to 100 entries', async () => {
    for (let i = 0; i < 105; i++) {
      await sessionManager.actions.saveDeliberation({
        ...mockDeliberation,
        id: `delib-${i}`
      });
    }

    assert.equal(sessionManager.state.history.length, 100);
  });

  it('should update current deliberation', async () => {
    await sessionManager.actions.saveDeliberation(mockDeliberation);

    assert.equal(sessionManager.state.currentDeliberation.id, 'delib-123');
  });

  it('should persist history to storage', async () => {
    await sessionManager.actions.saveDeliberation(mockDeliberation);

    const stored = await sessionManager.state.storageAdapter.getItem('deliberation_history');

    assert.equal(stored.length, 1);
    assert.equal(stored[0].id, 'delib-123');
  });

  it('should emit deliberationSaved event', async () => {
    let eventData = null;

    sessionManager.on('deliberationSaved', (data) => {
      eventData = data;
    });

    await sessionManager.actions.saveDeliberation(mockDeliberation);

    assert.ok(eventData);
    assert.ok(eventData.deliberation);
  });
});

describe('sessionManager.actions.getHistory', () => {
  beforeEach(async () => {
    await sessionManager.actions.reset();
    await sessionManager.actions.initialize();

    // Add some test data
    const history = [
      { id: '1', timestamp: '2024-01-01T12:00:00Z', domain: 'healthcare', judgment: 'permissible', confidence: 0.8, confidenceLevel: 'high', scenario: { description: 'Test 1', domain: 'healthcare' }, worldviews: [], metadata: { conflictsCount: 0 } },
      { id: '2', timestamp: '2024-01-02T12:00:00Z', domain: 'spiritual', judgment: 'impermissible', confidence: 0.7, confidenceLevel: 'moderate', scenario: { description: 'Test 2', domain: 'spiritual' }, worldviews: [], metadata: { conflictsCount: 1 } },
      { id: '3', timestamp: '2024-01-03T12:00:00Z', domain: 'healthcare', judgment: 'uncertain', confidence: 0.5, confidenceLevel: 'low', scenario: { description: 'Test 3', domain: 'healthcare' }, worldviews: [], metadata: { conflictsCount: 0 } }
    ];

    for (const entry of history) {
      await sessionManager.actions.saveDeliberation(entry);
    }
  });

  it('should return all history when no criteria provided', () => {
    const history = sessionManager.actions.getHistory();

    assert.equal(history.length, 3);
  });

  it('should filter by domain', () => {
    const history = sessionManager.actions.getHistory({ domain: 'healthcare' });

    assert.equal(history.length, 2);
    assert.ok(history.every(entry => entry.domain === 'healthcare'));
  });

  it('should sort by timestamp', () => {
    const history = sessionManager.actions.getHistory({ sortBy: 'timestamp', order: 'asc' });

    assert.equal(history[0].id, '1');
    assert.equal(history[2].id, '3');
  });

  it('should apply limit', () => {
    const history = sessionManager.actions.getHistory({ limit: 2 });

    assert.equal(history.length, 2);
  });
});

describe('sessionManager.actions.getDeliberationById', () => {
  beforeEach(async () => {
    await sessionManager.actions.reset();
    await sessionManager.actions.initialize();

    await sessionManager.actions.saveDeliberation({
      id: 'delib-123',
      timestamp: '2024-01-01T12:00:00Z',
      scenario: { description: 'Test', domain: 'healthcare' },
      domain: 'healthcare',
      judgment: 'permissible',
      confidence: 0.75,
      confidenceLevel: 'moderate',
      worldviews: [],
      metadata: { conflictsCount: 0 }
    });
  });

  it('should return deliberation by ID', () => {
    const deliberation = sessionManager.actions.getDeliberationById('delib-123');

    assert.ok(deliberation);
    assert.equal(deliberation.id, 'delib-123');
  });

  it('should return null for non-existent ID', () => {
    const deliberation = sessionManager.actions.getDeliberationById('nonexistent');

    assert.equal(deliberation, null);
  });
});

describe('sessionManager.actions.clearHistory', () => {
  beforeEach(async () => {
    await sessionManager.actions.reset();
    await sessionManager.actions.initialize();
  });

  it('should clear all history', async () => {
    await sessionManager.actions.saveDeliberation({
      id: 'delib-1',
      timestamp: '2024-01-01T12:00:00Z',
      scenario: { description: 'Test', domain: 'healthcare' },
      domain: 'healthcare',
      judgment: 'permissible',
      confidence: 0.75,
      confidenceLevel: 'moderate',
      worldviews: [],
      metadata: { conflictsCount: 0 }
    });

    await sessionManager.actions.clearHistory();

    assert.equal(sessionManager.state.history.length, 0);
    assert.equal(sessionManager.state.currentDeliberation, null);
  });

  it('should emit historyCleared event', async () => {
    let eventEmitted = false;

    sessionManager.on('historyCleared', () => {
      eventEmitted = true;
    });

    await sessionManager.actions.clearHistory();

    assert.equal(eventEmitted, true);
  });
});

describe('sessionManager.actions.exportSessionData', () => {
  beforeEach(async () => {
    await sessionManager.actions.reset();
    await sessionManager.actions.initialize();
    await sessionManager.actions.createSession('user-123');
  });

  it('should export complete session data', () => {
    const exported = sessionManager.actions.exportSessionData();

    assert.ok(exported.session);
    assert.ok(Array.isArray(exported.history));
    assert.ok(exported.exportedAt);
  });

  it('should include session and history', async () => {
    await sessionManager.actions.saveDeliberation({
      id: 'delib-1',
      timestamp: '2024-01-01T12:00:00Z',
      scenario: { description: 'Test', domain: 'healthcare' },
      domain: 'healthcare',
      judgment: 'permissible',
      confidence: 0.75,
      confidenceLevel: 'moderate',
      worldviews: [],
      metadata: { conflictsCount: 0 }
    });

    const exported = sessionManager.actions.exportSessionData();

    assert.equal(exported.session.userId, 'user-123');
    assert.equal(exported.history.length, 1);
  });
});

describe('sessionManager.actions.importSessionData', () => {
  beforeEach(async () => {
    await sessionManager.actions.reset();
    await sessionManager.actions.initialize();
  });

  it('should import session data', async () => {
    const data = {
      session: createSession('user-456'),
      history: [
        { id: '1', scenario: 'Test 1' }
      ]
    };

    await sessionManager.actions.importSessionData(data);

    assert.equal(sessionManager.state.currentSession.userId, 'user-456');
    assert.equal(sessionManager.state.history.length, 1);
  });

  it('should emit sessionDataImported event', async () => {
    let eventData = null;

    sessionManager.on('sessionDataImported', (data) => {
      eventData = data;
    });

    await sessionManager.actions.importSessionData({
      session: createSession('user-456'),
      history: []
    });

    assert.ok(eventData);
    assert.equal(eventData.hasSession, true);
  });
});
