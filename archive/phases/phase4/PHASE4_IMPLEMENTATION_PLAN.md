# Phase 4 Implementation Plan: PWA User Interface

**Status**: 📋 Planning
**Start Date**: TBD
**Goal**: Build Progressive Web App (PWA) with intuitive UI for users to interact with the Integral Ethics Engine, architected to support future API integration for systems.

---

## Overview

Phase 4 delivers a **user-facing Progressive Web App** that makes the Integral Ethics Engine accessible, transparent, and engaging. The architecture is designed from the ground up to support both:

1. **Direct User Interaction** - Web-based UI for human deliberation
2. **Future API Integration** - RESTful/GraphQL API for system-to-system integration

**Key Design Principle**: Separate business logic from presentation layer to enable multiple interfaces (web UI, API, CLI, mobile) to share the same core.

---

## Architecture Strategy

### Three-Layer Architecture

```
┌─────────────────────────────────────────────────┐
│          PRESENTATION LAYER                      │
│  (PWA UI, Future API, Future Mobile, CLI)       │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          APPLICATION LAYER                       │
│  (Orchestration, Validation, Session Management) │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│          DOMAIN LAYER                            │
│  (Concepts: valueConflictResolver, moralReasoner,│
│   worldviewManager, ontologyLoader, etc.)        │
└─────────────────────────────────────────────────┘
```

**Benefits**:
- PWA and API share same business logic
- Core concepts remain framework-agnostic
- Easy to add new interfaces (mobile, voice, etc.)
- Testable in isolation

---

## Phase 4 Objectives

### Primary Objective

Build a **Progressive Web App** that allows users to:
1. Input moral scenarios in natural language
2. Select domain context (or auto-detect)
3. View worldview evaluations and reasoning
4. Explore value conflicts visually
5. Understand integrated judgments with full transparency
6. Examine minority perspectives
7. Override domain weights or worldview priorities
8. Track deliberation history

### Secondary Objective

**Prepare for API Integration** by:
1. Separating business logic from UI
2. Defining clear interface contracts
3. Implementing orchestration layer for API endpoints
4. Designing schema for request/response formats
5. Planning authentication and rate limiting

---

## Technology Stack

### Frontend (PWA)

**Framework**: **Svelte + SvelteKit**
- Rationale: Lightweight, reactive, excellent PWA support
- Alternative considered: React (heavier, more boilerplate)
- File size: ~10-15KB runtime vs React's ~40KB

**UI Components**: **Custom + Tailwind CSS**
- Rationale: Full control, accessibility-first, lightweight
- Alternative: Component library (heavier, less flexible)

**PWA Features**:
- Service Worker for offline support
- IndexedDB for local storage
- Web App Manifest for installability
- Push notifications (future feature)

**Visualization**: **D3.js** (for conflict maps, value hierarchies)
- Rationale: Flexible, powerful, standard for data viz
- Alternative: Chart.js (less flexible for custom viz)

**State Management**: **Svelte Stores**
- Rationale: Built-in, reactive, simple
- Global stores for session, history, preferences

### Backend (Future API Preparation)

**API Framework**: **Fastify** (Node.js)
- Rationale: Fast, low overhead, TypeScript support, schema validation
- Alternative: Express (slower, less modern)

**API Style**: **RESTful + GraphQL** (hybrid approach)
- REST for simple CRUD operations
- GraphQL for complex queries (e.g., "get all resolutions with minority views in healthcare domain")

**Schema Validation**: **JSON Schema** (via Fastify)
- Ensures request/response contract enforcement
- Auto-generates API documentation

**Authentication** (future): **JWT tokens**
- Stateless, scalable
- Support for API keys (for system integration)

### Application Layer (Shared)

**Orchestrator Module**: Pure JavaScript/TypeScript
- Location: `/src/application/deliberationOrchestrator.js`
- Responsibility: Coordinate concepts, validate inputs, manage sessions
- Used by both PWA and future API

**Session Management**: In-memory + optional persistence
- PWA: IndexedDB
- API: Redis (future)

### Data Layer

**Local Storage** (PWA): IndexedDB via `idb` library
- Deliberation history
- User preferences
- Cached worldview data

**Future Database** (API): PostgreSQL
- User accounts
- Shared deliberations
- Usage analytics

---

## Implementation Tasks

### Phase 4.1: Application Layer (Orchestration) - Week 1

**Goal**: Create orchestration layer that both UI and future API can use

#### Task 1.1: Create Deliberation Orchestrator

**File**: `/src/application/deliberationOrchestrator.js`

**Responsibilities**:
1. Coordinate multi-step deliberation workflow
2. Validate scenario inputs
3. Call worldview evaluations
4. Invoke conflict resolution
5. Format responses for consumption
6. Manage deliberation sessions

**Key Functions**:
```javascript
// High-level orchestration
async function deliberateOnScenario(scenario, options) {
  // 1. Validate scenario input
  // 2. Detect or validate domain
  // 3. Select relevant worldviews
  // 4. Generate worldview evaluations
  // 5. Resolve conflicts
  // 6. Format complete deliberation result
  return deliberationResult;
}

// Domain detection
function detectDomain(scenarioText) {
  // Keyword analysis, ML classification (future)
  return 'healthcare' | 'spiritual' | 'education' | etc.
}

// Worldview selection
function selectWorldviews(scenario, domain, options) {
  // All 12 by default, or user-specified subset
  return ['Materialism', 'Spiritualism', ...];
}

// Result formatting
function formatDeliberationResult(resolution, evaluations, domain) {
  // Transform internal data structures to API/UI format
  return {
    scenario: { ... },
    domain: 'healthcare',
    judgment: 'permissible',
    confidence: 0.85,
    worldviews: [ ... ],
    conflicts: [ ... ],
    minorityViews: [ ... ],
    justification: '...',
    metadata: { ... }
  };
}
```

**Tests**: `/unit-tests/application/deliberation-orchestrator.test.js`
- Input validation
- Domain detection accuracy
- End-to-end deliberation flow
- Error handling

---

#### Task 1.2: Define API Schemas

**File**: `/src/application/schemas/deliberation-schemas.js`

**Purpose**: Define request/response contracts for both UI and future API

**Schemas**:

1. **ScenarioInput Schema**:
```javascript
{
  type: 'object',
  required: ['description'],
  properties: {
    description: { type: 'string', minLength: 10, maxLength: 5000 },
    domain: { type: 'string', enum: ['healthcare', 'spiritual', ...] },
    context: { type: 'object', additionalProperties: true },
    worldviews: { type: 'array', items: { type: 'string' } },
    customWeights: { type: 'object', additionalProperties: { type: 'number', minimum: 0, maximum: 1 } }
  }
}
```

2. **DeliberationResult Schema**:
```javascript
{
  type: 'object',
  required: ['id', 'scenario', 'judgment', 'confidence', 'worldviews'],
  properties: {
    id: { type: 'string' },
    timestamp: { type: 'string', format: 'date-time' },
    scenario: { type: 'object' },
    domain: { type: 'string' },
    judgment: { type: 'string' },
    confidence: { type: 'number', minimum: 0, maximum: 1 },
    confidenceLevel: { type: 'string', enum: ['very-low', 'low', 'moderate', 'high', 'very-high'] },
    worldviews: { type: 'array', items: { type: 'object' } },
    conflicts: { type: 'array' },
    minorityViews: { type: 'array' },
    justification: { type: 'string' },
    steps: { type: 'array' }
  }
}
```

3. **WorldviewEvaluation Schema**:
```javascript
{
  type: 'object',
  required: ['worldview', 'judgment', 'confidence', 'reasoning'],
  properties: {
    worldview: { type: 'string' },
    judgment: { type: 'string' },
    confidence: { type: 'number', minimum: 0, maximum: 1 },
    reasoning: { type: 'string' },
    values: { type: 'array', items: { type: 'string' } },
    weight: { type: 'number', minimum: 0, maximum: 1 }
  }
}
```

**Benefits**:
- UI knows exact data structure to expect
- Future API has validation built-in
- Auto-generates API documentation
- Type safety (if using TypeScript)

---

#### Task 1.3: Create Session Manager

**File**: `/src/application/sessionManager.js`

**Responsibilities**:
1. Track active deliberations
2. Store deliberation history
3. Manage user preferences (PWA: localStorage, API: Redis/DB)
4. Provide deliberation retrieval and search

**Key Functions**:
```javascript
// Session management
function createSession(userId) { /* ... */ }
function getSession(sessionId) { /* ... */ }
function closeSession(sessionId) { /* ... */ }

// History management
function saveDeliberation(deliberationResult) { /* ... */ }
function getDeliberationHistory(userId, filters) { /* ... */ }
function getDeliberationById(deliberationId) { /* ... */ }

// Preferences
function savePreferences(userId, preferences) { /* ... */ }
function getPreferences(userId) { /* ... */ }
```

**Storage Adapters**:
- `IndexedDBAdapter` (for PWA)
- `RedisAdapter` (for future API)
- `PostgreSQLAdapter` (for future API)

**Interface**:
```javascript
class StorageAdapter {
  async save(key, value) { /* ... */ }
  async get(key) { /* ... */ }
  async query(filters) { /* ... */ }
  async delete(key) { /* ... */ }
}
```

---

### Phase 4.2: PWA Foundation - Week 2

**Goal**: Set up SvelteKit PWA with routing, offline support, and data layer

#### Task 2.1: SvelteKit Project Setup

**Actions**:
1. Initialize SvelteKit project with TypeScript
2. Configure PWA adapter (service worker, manifest)
3. Set up Tailwind CSS
4. Configure build for static export (optional API later)

**File Structure**:
```
/src
  /lib
    /components      # Svelte components
    /stores          # Svelte stores (global state)
    /utils           # UI utilities
  /routes
    /                # Home page
    /deliberate      # Main deliberation interface
    /history         # Deliberation history
    /worldviews      # Worldview explorer
    /settings        # User preferences
  /application       # Orchestration layer (shared with API)
  /concepts          # Domain logic (existing)
  /domain-data       # Ontologies, mappings (existing)
```

**PWA Configuration**:
- Service worker for caching strategies
- Offline page fallback
- Background sync for future features
- Web app manifest (name, icons, theme)

---

#### Task 2.2: IndexedDB Integration

**File**: `/src/lib/storage/indexedDBClient.js`

**Purpose**: Store deliberations, history, preferences locally

**Schema**:
```javascript
// Database: IntegralEthicsDB
// Object Stores:
//   - deliberations (keyPath: 'id')
//   - preferences (keyPath: 'key')
//   - cache (keyPath: 'key', for ontology data)

const schema = {
  deliberations: {
    keyPath: 'id',
    indexes: [
      { name: 'timestamp', keyPath: 'timestamp' },
      { name: 'domain', keyPath: 'domain' },
      { name: 'judgment', keyPath: 'judgment' }
    ]
  },
  preferences: {
    keyPath: 'key'
  },
  cache: {
    keyPath: 'key',
    expires: true // For cache invalidation
  }
};
```

**Functions**:
```javascript
async function saveDeliberation(deliberation) { /* ... */ }
async function getAllDeliberations(filters) { /* ... */ }
async function getDeliberationById(id) { /* ... */ }
async function deleteDeliberation(id) { /* ... */ }
async function clearHistory() { /* ... */ }
```

---

#### Task 2.3: Global State Management (Svelte Stores)

**File**: `/src/lib/stores/deliberationStore.js`

**Stores**:

1. **Current Deliberation Store**:
```javascript
import { writable, derived } from 'svelte/store';

export const currentDeliberation = writable(null);
export const isDeliberating = writable(false);
export const deliberationProgress = writable(0); // 0-100%
```

2. **History Store**:
```javascript
export const deliberationHistory = writable([]);
export const historyFilters = writable({ domain: 'all', judgment: 'all' });
export const filteredHistory = derived(
  [deliberationHistory, historyFilters],
  ([$history, $filters]) => {
    // Filter logic
    return $history.filter(/* ... */);
  }
);
```

3. **Preferences Store**:
```javascript
export const preferences = writable({
  theme: 'light',
  defaultDomain: 'general',
  worldviewSubset: 'all', // or specific worldviews
  visualizationStyle: 'detailed',
  notifications: true
});
```

4. **Worldview Data Store** (cached ontology data):
```javascript
export const worldviewData = writable({
  loaded: false,
  worldviews: [],
  valueMappings: {}
});
```

---

### Phase 4.3: Core UI Components - Week 3

**Goal**: Build reusable UI components for deliberation interface

#### Task 3.1: Scenario Input Component

**File**: `/src/lib/components/ScenarioInput.svelte`

**Features**:
- Large textarea for scenario description
- Character count (10-5000 chars)
- Domain selector (auto-detect or manual)
- Advanced options (expandable):
  - Worldview selection
  - Custom weights
  - Context parameters
- Input validation with helpful error messages
- Save draft functionality

**UI Design**:
```
┌─────────────────────────────────────────────────┐
│  Describe your moral scenario                   │
│  ┌───────────────────────────────────────────┐  │
│  │                                           │  │
│  │  A terminal patient is requesting...     │  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│  Characters: 245 / 5000                         │
│                                                  │
│  Domain: [Healthcare ▼]  [Auto-detect]          │
│                                                  │
│  [Advanced Options ▼]                            │
│                                                  │
│  [Start Deliberation →]                          │
└─────────────────────────────────────────────────┘
```

**Props**:
```javascript
export let initialScenario = '';
export let onSubmit = (scenario) => {};
export let allowDraft = true;
```

---

#### Task 3.2: Worldview Card Component

**File**: `/src/lib/components/WorldviewCard.svelte`

**Purpose**: Display individual worldview evaluation with reasoning

**Features**:
- Worldview name and foundation
- Judgment badge (permissible/impermissible/uncertain)
- Confidence score (visual bar)
- Reasoning text (expandable)
- Values emphasized (tags)
- Domain weight indicator

**UI Design**:
```
┌─────────────────────────────────────────────────┐
│  MATERIALISM                      [Permissible] │
│  Foundation: Physical Matter                    │
│  ──────────────────────────────────────────────│
│  Confidence: ████████░░ 85%                     │
│  Weight in Healthcare: ████████░░ 90%           │
│  ──────────────────────────────────────────────│
│  Reasoning:                                     │
│  Physical suffering should be minimized.       │
│  Patient autonomy over their own body is       │
│  paramount in medical decisions.               │
│                                                 │
│  Values: minimize_suffering, bodily_autonomy   │
└─────────────────────────────────────────────────┘
```

**Props**:
```javascript
export let worldview = 'Materialism';
export let evaluation = { judgment, confidence, reasoning, values };
export let weight = 0.90;
export let domain = 'healthcare';
export let expandable = true;
export let highlight = false; // For majority/minority indication
```

---

#### Task 3.3: Conflict Visualization Component

**File**: `/src/lib/components/ConflictMap.svelte`

**Purpose**: Visual representation of worldview conflicts

**Visualization Options**:

1. **Grouped Bar Chart** (simple):
   - X-axis: Judgment categories (permissible, impermissible, uncertain)
   - Y-axis: Weighted score
   - Bars colored by worldview

2. **Network Graph** (advanced, using D3.js):
   - Nodes: Worldviews (sized by weight)
   - Edges: Agreement (green) / Disagreement (red)
   - Clusters: Judgment groups

3. **Sankey Diagram** (flow-based):
   - Left: Worldviews
   - Middle: Judgments
   - Right: Integrated judgment
   - Flow width: Weight

**UI Design** (Network Graph):
```
┌─────────────────────────────────────────────────┐
│  Value Conflict Map                              │
│                                                  │
│         (Materialism)───────┐                   │
│                │            │                   │
│                │        (Monadism)              │
│         agreement          │                    │
│                │            │                   │
│            (Psychism)───────┘                   │
│                                                  │
│                                                  │
│                │ disagreement                   │
│                │                                 │
│          (Spiritualism)                         │
│                                                  │
│  Legend: ● Size = Domain Weight                 │
│          ─ Green = Agreement                    │
│          ─ Red = Disagreement                   │
└─────────────────────────────────────────────────┘
```

**Props**:
```javascript
export let evaluations = [];
export let weights = {};
export let conflicts = [];
export let visualizationType = 'network'; // 'network' | 'bar' | 'sankey'
```

---

#### Task 3.4: Integrated Judgment Display

**File**: `/src/lib/components/IntegratedJudgment.svelte`

**Purpose**: Show final judgment with confidence, supporting worldviews, minority views

**Features**:
- Large, clear judgment badge
- Confidence score with visual representation
- Supporting worldviews (collapsible list)
- Minority views section (expandable, highlighted)
- Full justification (expandable markdown)
- Epistemic humility statement
- Override controls (button to adjust weights)

**UI Design**:
```
┌─────────────────────────────────────────────────┐
│  INTEGRATED JUDGMENT                             │
│                                                  │
│         ┌────────────────┐                      │
│         │  PERMISSIBLE   │   Confidence: High   │
│         └────────────────┘   ████████░░ 85%    │
│                                                  │
│  Supporting Worldviews (3) ▼                    │
│    • Materialism (90% weight)                   │
│    • Monadism (70% weight)                      │
│    • Psychism (55% weight)                      │
│                                                  │
│  ⚠️ Minority Perspectives (1) ▼                 │
│    • Spiritualism (40% weight) - Impermissible  │
│      Even though weighted lower in healthcare   │
│      domain, this perspective emphasizes...     │
│                                                  │
│  [View Full Justification ▼]                    │
│  [Adjust Weights ⚙️]                            │
└─────────────────────────────────────────────────┘
```

**Props**:
```javascript
export let resolution = { judgment, confidence, supportingWorldviews, minorityViews, justification };
export let onOverride = () => {}; // Open override modal
```

---

#### Task 3.5: Deliberation History Table

**File**: `/src/lib/components/HistoryTable.svelte`

**Purpose**: Browsable table of past deliberations

**Features**:
- Sortable columns (date, domain, judgment, confidence)
- Filters (domain, judgment, date range)
- Search (scenario text)
- Row click to view full deliberation
- Delete individual deliberations
- Export to JSON/CSV

**UI Design**:
```
┌─────────────────────────────────────────────────────────────┐
│  Deliberation History                         [Export ▼]     │
│                                                               │
│  Filters: Domain [All ▼] Judgment [All ▼]  🔍 Search        │
│                                                               │
│  Date ▲    Domain        Scenario              Judgment      │
│  ─────────────────────────────────────────────────────────  │
│  Jan 4    Healthcare     End-of-life care     Permissible    │
│  Jan 4    Vocational     Career vs family     Uncertain      │
│  Jan 3    Environmental  Resource extract...  Impermissible  │
│  ...                                                          │
│                                                               │
│  Showing 15 of 47 deliberations                              │
└─────────────────────────────────────────────────────────────┘
```

**Props**:
```javascript
export let deliberations = [];
export let onSelect = (deliberation) => {}; // View details
export let onDelete = (id) => {};
```

---

### Phase 4.4: Main Application Pages - Week 4

**Goal**: Assemble components into full application pages

#### Task 4.1: Home Page (`/routes/+page.svelte`)

**Purpose**: Landing page with introduction and quick start

**Sections**:
1. **Hero Section**:
   - Title: "Integral Ethics Engine"
   - Tagline: "Multi-perspectival moral deliberation grounded in 12 philosophical worldviews"
   - CTA: "Start Deliberation" button

2. **What is IEE?**:
   - Brief explanation (3-4 sentences)
   - Key features (bullets):
     - 12 worldview perspectives
     - Domain-sensitive reasoning
     - Transparent conflict resolution
     - Minority view preservation
     - Epistemic humility

3. **Quick Example**:
   - Sample scenario with mini-visualization
   - "Try it yourself" link

4. **Learn More**:
   - Links to worldview explorer, documentation

---

#### Task 4.2: Deliberation Page (`/routes/deliberate/+page.svelte`)

**Purpose**: Main deliberation interface

**Layout** (responsive):
```
┌────────────────────────────────────────────────┐
│  Navigation Bar                                 │
├────────────────────────────────────────────────┤
│                                                 │
│  [1] Input Scenario                            │
│  ┌──────────────────────────────────────────┐ │
│  │  ScenarioInput component                 │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  ↓ (after submission)                          │
│                                                 │
│  [2] Worldview Evaluations                     │
│  ┌──────────────────────────────────────────┐ │
│  │  WorldviewCard components (grid)         │ │
│  │  [Materialism] [Spiritualism] [Monadism] │ │
│  │  ...                                     │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  [3] Conflict Visualization                    │
│  ┌──────────────────────────────────────────┐ │
│  │  ConflictMap component                   │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  [4] Integrated Judgment                       │
│  ┌──────────────────────────────────────────┐ │
│  │  IntegratedJudgment component            │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  [Save to History] [Start New Deliberation]    │
└────────────────────────────────────────────────┘
```

**Workflow**:
1. User inputs scenario
2. System deliberates (with loading indicator)
3. Results appear in sequence (animated)
4. User can explore, override, save

---

#### Task 4.3: History Page (`/routes/history/+page.svelte`)

**Purpose**: Browse and review past deliberations

**Layout**:
```
┌────────────────────────────────────────────────┐
│  Navigation Bar                                 │
├────────────────────────────────────────────────┤
│                                                 │
│  Deliberation History                          │
│                                                 │
│  ┌──────────────────────────────────────────┐ │
│  │  HistoryTable component                  │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  (on row click)                                │
│  ┌──────────────────────────────────────────┐ │
│  │  Modal/Side Panel:                       │ │
│  │  Full deliberation details               │ │
│  │  - Scenario                              │ │
│  │  - Worldview evaluations                 │ │
│  │  - Integrated judgment                   │ │
│  │  [Re-deliberate] [Delete] [Export]       │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
```

---

#### Task 4.4: Worldviews Explorer (`/routes/worldviews/+page.svelte`)

**Purpose**: Educational page to explore the 12 worldviews

**Layout**:
```
┌────────────────────────────────────────────────┐
│  Navigation Bar                                 │
├────────────────────────────────────────────────┤
│                                                 │
│  Explore the 12 Worldviews                     │
│                                                 │
│  [Material-Empirical] [Process-Individual]     │
│  [Depth-Spiritual]    [All]                    │
│                                                 │
│  ┌──────────────────────────────────────────┐ │
│  │  Materialism                             │ │
│  │  Foundation: Physical matter             │ │
│  │  Terminal Values: Physical wellbeing,... │ │
│  │  Key Philosophers: Democritus, Hobbes... │ │
│  │  [View Details →]                        │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  ┌──────────────────────────────────────────┐ │
│  │  Spiritualism                            │ │
│  │  ...                                     │ │
│  └──────────────────────────────────────────┘ │
│                                                 │
│  (12 worldview cards)                          │
└────────────────────────────────────────────────┘
```

**Features**:
- Filter by cluster
- Click for detailed modal (values, philosophers, sample scenarios)
- Compare worldviews side-by-side

---

#### Task 4.5: Settings Page (`/routes/settings/+page.svelte`)

**Purpose**: User preferences and customization

**Sections**:
1. **Appearance**:
   - Theme (light/dark/auto)
   - Visualization style (simple/detailed)

2. **Deliberation Defaults**:
   - Default domain
   - Worldview subset (all 12 or custom selection)
   - Auto-save to history

3. **Data Management**:
   - Export all history (JSON/CSV)
   - Import history
   - Clear all history (with confirmation)
   - Download app data (PWA offline mode)

4. **About**:
   - Version info
   - Documentation links
   - GitHub repository

---

### Phase 4.5: Advanced Features - Week 5

**Goal**: Add polish, interactivity, and advanced capabilities

#### Task 5.1: Weight Override Modal

**File**: `/src/lib/components/WeightOverrideModal.svelte`

**Purpose**: Allow users to customize domain weights

**Features**:
- Slider for each worldview (0-1 range)
- Live preview of how judgment changes
- Reset to domain defaults
- Save custom weight profile
- Apply to current deliberation

**UI Design**:
```
┌────────────────────────────────────────────────┐
│  Customize Domain Weights                      │
│                                                 │
│  Domain: Healthcare                            │
│                                                 │
│  Materialism      ████████░░ 0.90              │
│  Realism          ████████░░ 0.90              │
│  Rationalism      ████████░  0.85              │
│  Monadism         ██████░░░ 0.70              │
│  ...                                            │
│                                                 │
│  ⚠️ Preview: Judgment changes to Uncertain     │
│             Confidence decreases to 62%        │
│                                                 │
│  [Reset to Defaults] [Apply] [Cancel]          │
└────────────────────────────────────────────────┘
```

---

#### Task 5.2: Worldview Comparison Tool

**File**: `/src/lib/components/WorldviewComparison.svelte`

**Purpose**: Side-by-side comparison of 2-3 worldviews

**Features**:
- Select worldviews to compare
- Show values, foundations, philosophers side-by-side
- Highlight differences
- Show how they evaluate the same scenario differently

**Use Case**: Educational tool, understanding minority views

---

#### Task 5.3: Scenario Templates

**File**: `/src/lib/components/ScenarioTemplates.svelte`

**Purpose**: Pre-written scenarios for quick start and education

**Templates** (20-30 scenarios across domains):
- Healthcare: End-of-life care, organ donation, vaccine mandates
- Spiritual: Leaving religion, religious conversion, mystical experiences
- Education: Cheating, teaching controversial topics, grading fairness
- Vocational: Whistleblowing, career change, work-life balance
- Environmental: Climate action, animal rights, conservation
- Interpersonal: Marriage, friendship betrayal, family conflicts
- Intellectual: Research ethics, AI safety, censorship

**UI**:
- Dropdown or modal with template browser
- Click to load template into scenario input
- Edit before deliberating

---

#### Task 5.4: Deliberation Sharing (Future API Preview)

**File**: `/src/lib/components/ShareDeliberation.svelte`

**Purpose**: Generate shareable link to deliberation (prepares for API)

**Features**:
1. **Local Sharing** (PWA):
   - Export deliberation as JSON
   - Copy to clipboard
   - Generate shareable URL hash (encodes scenario in URL)

2. **Future API Sharing**:
   - Save deliberation to server
   - Generate short link (e.g., `iee.app/d/abc123`)
   - QR code for mobile sharing
   - Privacy options (public/unlisted/private)

**Implementation**:
- For now: URL hash encoding (limited by URL length)
- Later: API endpoint `POST /api/deliberations/share`

---

#### Task 5.5: Progressive Enhancement

**Features**:
1. **Loading States**: Skeleton screens, progress indicators
2. **Error Handling**: Graceful degradation, helpful error messages
3. **Accessibility**: ARIA labels, keyboard navigation, screen reader support
4. **Performance**: Lazy loading, code splitting, image optimization
5. **Offline Support**: Service worker caching, offline indicator

---

### Phase 4.6: API Foundation (Preparation) - Week 6

**Goal**: Lay groundwork for future API without building full backend yet

#### Task 6.1: API Route Definitions

**File**: `/docs/API_SPECIFICATION.md`

**Purpose**: Document future API endpoints for reference

**REST Endpoints**:

```
POST   /api/v1/deliberations              # Create new deliberation
GET    /api/v1/deliberations/:id          # Get deliberation by ID
GET    /api/v1/deliberations              # List deliberations (with filters)
DELETE /api/v1/deliberations/:id          # Delete deliberation
PUT    /api/v1/deliberations/:id/weights  # Update weights

GET    /api/v1/worldviews                 # List all worldviews
GET    /api/v1/worldviews/:name           # Get worldview details

GET    /api/v1/domains                    # List domains
GET    /api/v1/domains/:name/weights      # Get domain weights

POST   /api/v1/detect-domain              # Auto-detect domain from text
POST   /api/v1/evaluate                   # Quick evaluation (stateless)
```

**GraphQL Schema** (alternative/complementary):
```graphql
type Query {
  deliberation(id: ID!): Deliberation
  deliberations(filter: DeliberationFilter): [Deliberation!]!
  worldviews: [Worldview!]!
  worldview(name: String!): Worldview
  domains: [Domain!]!
}

type Mutation {
  createDeliberation(input: DeliberationInput!): Deliberation!
  deleteDeliberation(id: ID!): Boolean!
  updateWeights(id: ID!, weights: WeightsInput!): Deliberation!
}

type Deliberation {
  id: ID!
  timestamp: DateTime!
  scenario: Scenario!
  domain: String!
  judgment: String!
  confidence: Float!
  worldviews: [WorldviewEvaluation!]!
  conflicts: [Conflict!]!
  minorityViews: [MinorityView!]!
  justification: String!
}

# ... more types
```

---

#### Task 6.2: API Client Abstraction

**File**: `/src/lib/api/apiClient.js`

**Purpose**: Abstract API calls to support future backend

**Current Implementation** (PWA only):
```javascript
// All operations are local (using orchestrator + IndexedDB)
export const apiClient = {
  async createDeliberation(scenario) {
    // Call deliberationOrchestrator.deliberateOnScenario()
    // Save to IndexedDB
    return result;
  },

  async getDeliberation(id) {
    // Retrieve from IndexedDB
    return deliberation;
  },

  // ... other methods
};
```

**Future Implementation** (with backend):
```javascript
export const apiClient = {
  async createDeliberation(scenario) {
    // POST to /api/v1/deliberations
    const response = await fetch('/api/v1/deliberations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scenario)
    });
    return response.json();
  },

  // ... other methods
};
```

**Benefits**:
- UI code doesn't change when API is added
- Easy to switch between local/remote mode
- Can add hybrid mode (local first, sync to server)

---

#### Task 6.3: Authentication Placeholder

**File**: `/src/lib/auth/authManager.js`

**Purpose**: Prepare for future authentication (API keys, user accounts)

**Current Implementation** (PWA only):
```javascript
// No authentication needed for local PWA
export const authManager = {
  isAuthenticated: () => true,
  getCurrentUser: () => ({ id: 'local-user', name: 'Local User' }),
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
};
```

**Future Implementation**:
```javascript
export const authManager = {
  isAuthenticated: () => !!localStorage.getItem('jwt_token'),
  getCurrentUser: async () => {
    // GET /api/v1/auth/me
  },
  login: async (email, password) => {
    // POST /api/v1/auth/login
    // Store JWT
  },
  logout: () => {
    localStorage.removeItem('jwt_token');
  },
  getApiKey: () => localStorage.getItem('api_key') // For system integration
};
```

---

### Phase 4.7: Testing & Deployment - Week 7

**Goal**: Test PWA thoroughly and deploy

#### Task 7.1: Component Testing

**Framework**: Vitest + @testing-library/svelte

**Test Coverage**:
- All components render correctly
- User interactions work (clicks, inputs)
- Stores update properly
- Edge cases handled (empty states, errors)

**Example Test**:
```javascript
import { render, fireEvent } from '@testing-library/svelte';
import ScenarioInput from '$lib/components/ScenarioInput.svelte';

test('ScenarioInput validates minimum length', async () => {
  const { getByText, getByRole } = render(ScenarioInput);

  const textarea = getByRole('textbox');
  await fireEvent.input(textarea, { target: { value: 'Too short' } });

  const submitButton = getByText('Start Deliberation');
  await fireEvent.click(submitButton);

  expect(getByText('Scenario must be at least 10 characters')).toBeInTheDocument();
});
```

---

#### Task 7.2: End-to-End Testing

**Framework**: Playwright

**Test Scenarios**:
1. Complete deliberation flow (input → results → save)
2. History browsing and filtering
3. Weight override and preview
4. Offline functionality
5. PWA installation

**Example Test**:
```javascript
import { test, expect } from '@playwright/test';

test('complete deliberation flow', async ({ page }) => {
  await page.goto('/deliberate');

  // Input scenario
  await page.fill('textarea', 'A patient requests withdrawal of life support...');
  await page.selectOption('select[name="domain"]', 'healthcare');
  await page.click('button:has-text("Start Deliberation")');

  // Wait for results
  await expect(page.locator('text=PERMISSIBLE')).toBeVisible({ timeout: 10000 });

  // Verify minority views
  await expect(page.locator('text=Minority Perspectives')).toBeVisible();

  // Save to history
  await page.click('button:has-text("Save to History")');
  await expect(page.locator('text=Saved successfully')).toBeVisible();
});
```

---

#### Task 7.3: Performance Optimization

**Actions**:
1. **Lighthouse Audit**: Aim for 90+ scores
2. **Bundle Size**: Keep JavaScript < 200KB (gzipped)
3. **Lazy Loading**: Load D3.js only when needed
4. **Image Optimization**: WebP format, responsive images
5. **Service Worker Caching**: Aggressive caching for static assets

**Metrics**:
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse PWA score: 100

---

#### Task 7.4: Deployment

**Hosting Options**:

1. **Vercel** (recommended for SvelteKit):
   - Zero-config deployment
   - Automatic HTTPS
   - Edge functions (for future API)
   - Free tier available

2. **Netlify** (alternative):
   - Similar to Vercel
   - Good PWA support
   - Edge functions

3. **GitHub Pages** (static export):
   - Free
   - Requires static adapter
   - No server-side features

**Deployment Steps**:
1. Configure SvelteKit adapter (Vercel/Netlify)
2. Set up GitHub Actions for CI/CD
3. Deploy to staging environment
4. Run E2E tests on staging
5. Deploy to production
6. Set up monitoring (error tracking, analytics)

**Custom Domain** (optional):
- Register domain (e.g., `integralethics.app`)
- Configure DNS
- Enable HTTPS

---

## Phase 4.8: Future API Implementation (Post-PWA)

**Timeline**: After PWA is stable and tested

### Backend Architecture

**Framework**: Fastify (Node.js)

**File Structure**:
```
/api
  /routes
    /deliberations.js    # Deliberation endpoints
    /worldviews.js       # Worldview data endpoints
    /auth.js             # Authentication
  /middleware
    /auth.js             # JWT verification
    /rateLimit.js        # Rate limiting
    /validation.js       # Schema validation
  /database
    /migrations          # DB schema migrations
    /models              # Data models
  server.js              # Main server entry
```

**Database**: PostgreSQL
- Users table
- Deliberations table (with foreign key to users)
- API keys table
- Audit log table

**Features**:
1. User registration and authentication (JWT)
2. API key generation for system integration
3. Rate limiting (100 req/min for free, 1000 for paid)
4. Usage analytics
5. Deliberation sharing (public URLs)
6. Webhook support (notify external systems of deliberation results)

**Monetization** (optional):
- Free tier: 100 deliberations/month
- Pro tier: Unlimited deliberations, API access
- Enterprise: Custom deployment, support

---

## Success Criteria

### Phase 4 (PWA) Success Metrics

**Technical**:
- ✅ Lighthouse PWA score: 100
- ✅ Lighthouse Performance score: 90+
- ✅ All components tested (80%+ coverage)
- ✅ E2E tests passing (10+ critical flows)
- ✅ Works offline (service worker caching)
- ✅ Installable as PWA on desktop and mobile

**User Experience**:
- ✅ Scenario input to results: < 5 seconds
- ✅ Intuitive UI (user testing with 5+ people)
- ✅ Accessible (WCAG 2.1 AA compliance)
- ✅ Responsive (works on mobile, tablet, desktop)

**Functionality**:
- ✅ Complete deliberation workflow
- ✅ History management (save, browse, delete)
- ✅ Worldview explorer
- ✅ Weight override
- ✅ Conflict visualization
- ✅ Export capabilities

### Future API Success Metrics

**Technical**:
- ✅ API response time: < 500ms (p95)
- ✅ API uptime: 99.9%
- ✅ API documentation (OpenAPI/GraphQL schema)
- ✅ Rate limiting and authentication working

**Adoption**:
- ✅ 3+ external systems integrated
- ✅ API usage metrics tracked
- ✅ Developer documentation complete

---

## Risk Mitigation

### Risks and Mitigation Strategies

1. **Risk**: PWA complexity overwhelming users
   - **Mitigation**: Progressive disclosure (advanced features hidden by default)
   - **Mitigation**: Onboarding tutorial, example scenarios

2. **Risk**: Deliberation takes too long (performance)
   - **Mitigation**: Optimize worldview evaluation (parallel processing)
   - **Mitigation**: Show progressive results (worldviews appear as they complete)
   - **Mitigation**: Web Workers for heavy computation

3. **Risk**: Mobile usability issues
   - **Mitigation**: Mobile-first design approach
   - **Mitigation**: Test on real devices (iOS Safari, Android Chrome)

4. **Risk**: IndexedDB quota limits (storage)
   - **Mitigation**: Implement history pagination
   - **Mitigation**: Warn user when approaching quota
   - **Mitigation**: Export/import functionality

5. **Risk**: API future-proofing doesn't work
   - **Mitigation**: API client abstraction layer
   - **Mitigation**: Schema validation on both sides
   - **Mitigation**: Versioned API (v1, v2)

---

## Timeline Summary

| Week | Phase | Deliverable |
|------|-------|-------------|
| 1 | 4.1 Application Layer | Orchestrator, schemas, session manager |
| 2 | 4.2 PWA Foundation | SvelteKit setup, IndexedDB, stores |
| 3 | 4.3 Core Components | ScenarioInput, WorldviewCard, ConflictMap, IntegratedJudgment, HistoryTable |
| 4 | 4.4 Main Pages | Home, Deliberate, History, Worldviews, Settings |
| 5 | 4.5 Advanced Features | Weight override, comparison, templates, sharing |
| 6 | 4.6 API Foundation | API specs, client abstraction, auth placeholder |
| 7 | 4.7 Testing & Deployment | Tests, optimization, deploy to production |

**Total Duration**: 7 weeks (for PWA)
**Future API**: Additional 4-6 weeks after PWA is stable

---

## Next Steps After Phase 4

With PWA complete and API foundation laid:

1. **Gather User Feedback**: Beta test with philosophers, ethicists, general users
2. **Iterate on UX**: Refine based on actual usage patterns
3. **Build API Backend**: Implement Fastify server, PostgreSQL database
4. **System Integrations**: Partner with organizations to integrate IEE into their systems
5. **Mobile App**: React Native or Flutter app (shares same API)
6. **Advanced Features**:
   - AI-assisted scenario description
   - Collaborative deliberation (multiple users)
   - Deliberation templates and workflows
   - Integration with decision management systems

---

## Conclusion

Phase 4 delivers a **production-ready Progressive Web App** that makes the Integral Ethics Engine accessible to users while preparing for future **API integration** for systems.

**Key Achievements**:
✅ Intuitive UI for moral deliberation
✅ Offline-capable PWA
✅ Complete transparency (worldviews, conflicts, reasoning)
✅ Educational worldview explorer
✅ History management and export
✅ Architecture ready for API layer
✅ Scalable, testable, maintainable codebase

**Foundation**: Solid for both user-facing and system-facing interfaces ✅

---

**Phase 4 Status**: 📋 **READY TO BEGIN**
**Recommended Start Date**: After Phase 2.5 adoption and feedback
**Target Completion**: 7 weeks after start
