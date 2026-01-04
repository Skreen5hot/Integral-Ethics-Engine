# Phase 4 Project Plan: PWA User Interface

**Status**: 📋 Ready to Start
**Duration**: 7 weeks
**Goal**: Deliver production-ready Progressive Web App with intuitive UI for moral deliberation, architected for future API integration.

---

## Project Overview

### Objectives

**Primary**: Build a Progressive Web App that enables users to:
- Input moral scenarios and receive multi-perspectival analysis
- Understand value conflicts between worldviews visually
- Explore integrated judgments with full transparency
- Review deliberation history and track moral reasoning

**Secondary**: Prepare architecture for future API integration by:
- Separating business logic from presentation layer
- Defining clear interface contracts
- Implementing orchestration layer shared by UI and future API

### Success Criteria

#### Must Have (P0 - Required for Launch)
✅ **Functional**:
- User can input scenario and receive deliberation results
- All 12 worldviews evaluated with reasoning displayed
- Integrated judgment shown with confidence level
- Minority views prominently highlighted
- Deliberations saved to local history
- Application works offline (PWA)

✅ **Technical**:
- Lighthouse PWA score: 100
- Lighthouse Performance score: ≥ 90
- Works offline with service worker
- Installable on desktop and mobile
- 80%+ test coverage on critical paths

✅ **Quality**:
- WCAG 2.1 AA accessibility compliance
- Responsive design (mobile, tablet, desktop)
- No blocking bugs or critical errors
- < 5 seconds from input to results

#### Should Have (P1 - High Priority)
- Domain auto-detection from scenario text
- Conflict visualization (D3.js charts)
- Full justification with markdown rendering
- Weight override capability
- Export deliberations to JSON
- Worldview explorer (educational)

#### Could Have (P2 - Nice to Have)
- Scenario templates library
- Worldview comparison tool
- Advanced visualizations (network graph, Sankey)
- Dark mode theme
- Deliberation sharing (URL encoding)

#### Won't Have (P3 - Future Phases)
- Backend API (Phase 4.5)
- User authentication (Phase 4.5)
- Collaborative deliberation (Phase 5)
- AI-assisted scenario writing (Phase 5)

---

## Project Milestones

### Milestone 1: Foundation (Week 1-2)
**Goal**: Application layer and PWA infrastructure ready

**Deliverables**:
1. Deliberation orchestrator with schema validation
2. Session manager with IndexedDB storage
3. SvelteKit project configured with PWA support
4. Global state stores (Svelte stores)
5. Basic routing structure

**Acceptance Criteria**:
- [ ] `deliberateOnScenario()` function executes full workflow
- [ ] Scenario input validates against JSON schema
- [ ] DeliberationResult formatted correctly
- [ ] IndexedDB saves/retrieves deliberations
- [ ] Service worker registered and caching static assets
- [ ] Web app manifest present (installable)
- [ ] All stores reactive and tested
- [ ] Routes load without errors

**Tests Required**:
- Orchestrator unit tests (20+ tests)
- IndexedDB integration tests (10+ tests)
- Store reactivity tests (5+ tests)

**Definition of Done**:
- Code reviewed and merged
- All tests passing (100%)
- Documentation updated
- No console errors in browser

---

### Milestone 2: Core Components (Week 3)
**Goal**: Reusable UI components for deliberation interface

**Deliverables**:
1. ScenarioInput component
2. WorldviewCard component
3. ConflictMap component (basic bar chart)
4. IntegratedJudgment component
5. HistoryTable component

**Acceptance Criteria**:

**ScenarioInput**:
- [ ] Textarea accepts 10-5000 characters
- [ ] Character count displayed in real-time
- [ ] Domain selector with 7 domains + "Auto-detect"
- [ ] Advanced options expandable (worldview selection, custom weights)
- [ ] Validation errors shown clearly
- [ ] "Start Deliberation" button triggers callback
- [ ] Draft auto-saved to localStorage (optional)

**WorldviewCard**:
- [ ] Displays worldview name, foundation, judgment badge
- [ ] Confidence bar visualized (0-100%)
- [ ] Domain weight displayed (0-100%)
- [ ] Reasoning text expandable/collapsible
- [ ] Values shown as tags
- [ ] Highlight mode for majority/minority distinction
- [ ] Responsive on mobile (stacks vertically)

**ConflictMap**:
- [ ] Bar chart visualization using D3.js
- [ ] X-axis: judgment categories (permissible, impermissible, etc.)
- [ ] Y-axis: weighted score
- [ ] Bars colored by worldview
- [ ] Legend showing worldview → color mapping
- [ ] Tooltip on hover showing details
- [ ] Responsive (scales to container)

**IntegratedJudgment**:
- [ ] Large judgment badge (permissible/impermissible/uncertain)
- [ ] Confidence score with visual bar (0-100%)
- [ ] Supporting worldviews list (collapsible)
- [ ] Minority views section (expandable, highlighted)
- [ ] Full justification (markdown rendered, collapsible)
- [ ] "Adjust Weights" button opens override modal
- [ ] Epistemic humility statement visible

**HistoryTable**:
- [ ] Table with sortable columns (date, domain, judgment, confidence)
- [ ] Filter by domain dropdown
- [ ] Filter by judgment dropdown
- [ ] Search box (filters scenario text)
- [ ] Row click opens deliberation details
- [ ] Delete button per row (with confirmation)
- [ ] Export all button (JSON format)
- [ ] Pagination (show 15 per page)

**Tests Required**:
- Component tests for each (50+ total tests)
- Visual regression tests (Storybook snapshots)
- Accessibility tests (axe-core)

**Definition of Done**:
- All components render without errors
- Props validated and documented
- Storybook stories created for each component
- Accessibility audit passed (axe-core)
- Responsive on mobile/tablet/desktop
- Code reviewed and merged

---

### Milestone 3: Main Application (Week 4)
**Goal**: Assemble components into functional pages

**Deliverables**:
1. Home page (`/`)
2. Deliberation page (`/deliberate`)
3. History page (`/history`)
4. Worldviews explorer (`/worldviews`)
5. Settings page (`/settings`)

**Acceptance Criteria**:

**Home Page**:
- [ ] Hero section with title and tagline
- [ ] "Start Deliberation" CTA button (links to `/deliberate`)
- [ ] "What is IEE?" section (3-4 sentences)
- [ ] Key features bullets (5 items)
- [ ] Quick example preview
- [ ] Links to worldviews explorer and documentation
- [ ] Responsive layout

**Deliberation Page**:
- [ ] Step 1: ScenarioInput visible on load
- [ ] User inputs scenario and clicks "Start Deliberation"
- [ ] Loading indicator shows progress (0-100%)
- [ ] Step 2: Worldview cards appear (animated entrance)
- [ ] Step 3: Conflict visualization appears
- [ ] Step 4: Integrated judgment appears
- [ ] "Save to History" button works
- [ ] "Start New Deliberation" button resets form
- [ ] Error handling for failed deliberations
- [ ] Results scrollable on mobile

**History Page**:
- [ ] HistoryTable shows all saved deliberations
- [ ] Filters work (domain, judgment)
- [ ] Search filters scenario text
- [ ] Clicking row opens modal with full details
- [ ] Modal shows: scenario, worldviews, judgment, justification
- [ ] "Re-deliberate" button loads scenario into deliberation page
- [ ] "Delete" button removes from history (with confirmation)
- [ ] "Export" button downloads JSON
- [ ] Empty state shown if no history

**Worldviews Explorer**:
- [ ] 12 worldview cards displayed
- [ ] Filter buttons: Material-Empirical, Process-Individual, Depth-Spiritual, All
- [ ] Each card shows: name, foundation, terminal values (summary)
- [ ] "View Details" opens modal with full info
- [ ] Modal shows: all values, philosophers, sample scenarios
- [ ] "Compare" mode: select 2-3 worldviews for side-by-side (P2 feature)
- [ ] Responsive grid (3 cols desktop, 2 cols tablet, 1 col mobile)

**Settings Page**:
- [ ] Appearance section: theme selector (light/dark/auto)
- [ ] Deliberation defaults: domain selector, worldview subset
- [ ] Data management: "Export All History" button
- [ ] "Import History" file upload (JSON)
- [ ] "Clear All History" button (with double confirmation)
- [ ] About section: version, GitHub link, docs link
- [ ] Settings persist to localStorage
- [ ] Changes apply immediately (reactive)

**Tests Required**:
- E2E tests for each page (25+ scenarios)
- Navigation flow tests
- Error state tests

**Definition of Done**:
- All pages accessible via routing
- Navigation works (header, footer, breadcrumbs)
- Page transitions smooth
- E2E tests passing
- No runtime errors
- Code reviewed and merged

---

### Milestone 4: Advanced Features (Week 5)
**Goal**: Polish, interactivity, edge cases

**Deliverables**:
1. Weight override modal
2. Advanced conflict visualization (network graph)
3. Scenario templates
4. Loading and error states
5. Accessibility audit fixes

**Acceptance Criteria**:

**Weight Override Modal**:
- [ ] Opens when "Adjust Weights" clicked
- [ ] Shows slider for each of 12 worldviews (0-1 range)
- [ ] Current weights pre-populated
- [ ] Slider changes update preview in real-time
- [ ] Preview shows: new judgment, new confidence
- [ ] "Reset to Defaults" button restores domain weights
- [ ] "Apply" button re-runs deliberation with custom weights
- [ ] "Cancel" button closes without changes
- [ ] Modal accessible (keyboard navigation, ARIA)

**Network Graph Visualization** (P1):
- [ ] Toggle between bar chart and network graph
- [ ] Nodes represent worldviews (sized by weight)
- [ ] Edges represent agreement (green) or disagreement (red)
- [ ] Layout algorithm positions nodes clearly
- [ ] Zoom and pan enabled
- [ ] Click node to highlight connected edges
- [ ] Legend explains node size, edge colors
- [ ] Performant with 12 nodes (< 1s to render)

**Scenario Templates** (P1):
- [ ] "Load Template" button in ScenarioInput
- [ ] Modal shows 20+ templates organized by domain
- [ ] Templates include: title, description, suggested domain
- [ ] Click template loads text into scenario input
- [ ] User can edit before deliberating
- [ ] Templates cover all 7 domains (3+ per domain)
- [ ] Search/filter templates by domain or keyword

**Loading & Error States**:
- [ ] Loading: Skeleton screens for components
- [ ] Loading: Progress bar for deliberation (0-100%)
- [ ] Loading: Spinner for async operations
- [ ] Error: Friendly error messages (no stack traces)
- [ ] Error: Retry button for failed operations
- [ ] Error: Fallback UI if component crashes (error boundary)
- [ ] Error: Offline indicator when no network
- [ ] Empty states: "No history yet" with CTA to start

**Accessibility**:
- [ ] All interactive elements keyboard navigable
- [ ] Focus visible (outline on tab)
- [ ] ARIA labels on all buttons, inputs, regions
- [ ] Screen reader announces state changes
- [ ] Color contrast ≥ 4.5:1 (WCAG AA)
- [ ] Skip to main content link
- [ ] No keyboard traps
- [ ] Axe-core audit: 0 violations

**Tests Required**:
- Component tests for new features (20+ tests)
- Accessibility tests (axe-core on all pages)
- Visual regression tests

**Definition of Done**:
- All features working on desktop and mobile
- Accessibility audit passed (0 violations)
- Loading states smooth (no jarring transitions)
- Error messages user-friendly
- Code reviewed and merged

---

### Milestone 5: API Preparation (Week 6)
**Goal**: Document and architect for future API

**Deliverables**:
1. API specification document
2. API client abstraction layer
3. Authentication placeholder
4. GraphQL schema (optional)
5. API migration guide

**Acceptance Criteria**:

**API Specification** (`docs/API_SPECIFICATION.md`):
- [ ] All REST endpoints documented (10+ endpoints)
- [ ] Request/response schemas defined (JSON Schema)
- [ ] Authentication scheme specified (JWT)
- [ ] Rate limiting policy documented
- [ ] Error codes and messages defined
- [ ] Example requests/responses provided
- [ ] GraphQL schema included (if applicable)
- [ ] Versioning strategy (v1, v2, etc.)

**API Client Abstraction** (`src/lib/api/apiClient.js`):
- [ ] Interface matches future API exactly
- [ ] Current implementation uses local orchestrator
- [ ] Easy to swap for fetch() calls later
- [ ] All CRUD operations supported
- [ ] Error handling consistent
- [ ] Loading states managed
- [ ] TypeScript types defined (if using TS)

**Authentication Placeholder** (`src/lib/auth/authManager.js`):
- [ ] Interface defined (login, logout, getUser, isAuthenticated)
- [ ] Current implementation returns mock user
- [ ] Ready for JWT integration later
- [ ] API key placeholder (for system integration)

**Migration Guide**:
- [ ] Step-by-step plan to add backend
- [ ] Database schema defined (PostgreSQL)
- [ ] Migration scripts prepared
- [ ] Deployment strategy outlined

**Tests Required**:
- API client integration tests (15+ tests)
- Schema validation tests

**Definition of Done**:
- API spec complete and reviewed
- API client works with PWA
- Documentation clear for future developers
- Code reviewed and merged

---

### Milestone 6: Testing & Optimization (Week 7)
**Goal**: 100% passing tests, performance optimized, production-ready

**Deliverables**:
1. Complete test suite (unit, integration, E2E)
2. Performance optimizations
3. Lighthouse audits (100 PWA, 90+ Performance)
4. Production build
5. Deployment to staging and production

**Acceptance Criteria**:

**Test Suite**:
- [ ] Unit tests: 80%+ coverage on critical code
- [ ] Component tests: All components tested
- [ ] Integration tests: API client, stores, IndexedDB
- [ ] E2E tests: 15+ critical user flows
- [ ] Accessibility tests: All pages audited
- [ ] Visual regression tests: Screenshots match baseline
- [ ] All tests passing (0 failures)

**Performance Optimizations**:
- [ ] Bundle size < 200KB (gzipped JS)
- [ ] Code splitting implemented (route-based)
- [ ] Lazy loading for heavy components (D3.js, etc.)
- [ ] Images optimized (WebP, responsive sizes)
- [ ] Service worker caching aggressive
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] No render-blocking resources

**Lighthouse Audits**:
- [ ] PWA score: 100
- [ ] Performance score: ≥ 90
- [ ] Accessibility score: 100
- [ ] Best Practices score: ≥ 95
- [ ] SEO score: ≥ 90

**Production Build**:
- [ ] Build succeeds without errors
- [ ] No console warnings in production mode
- [ ] Source maps generated for debugging
- [ ] Environment variables configured
- [ ] robots.txt and sitemap.xml included

**Deployment**:
- [ ] Deployed to staging (Vercel/Netlify)
- [ ] E2E tests run on staging (all passing)
- [ ] Manual QA on staging (desktop, mobile)
- [ ] Deployed to production
- [ ] Custom domain configured (if applicable)
- [ ] HTTPS enabled
- [ ] Monitoring set up (error tracking, analytics)

**Tests Required**:
- All test suites run successfully
- Playwright E2E tests on staging/production
- Performance testing (Lighthouse CI)

**Definition of Done**:
- Production deployment live and stable
- All tests passing in CI/CD
- Lighthouse scores meet criteria
- No critical bugs or errors
- Monitoring active
- Rollback plan tested

---

## Acceptance Criteria Summary

### Functional Acceptance Criteria

#### User Can Deliberate on Scenario
- [ ] Input scenario (10-5000 chars) in textarea
- [ ] Select domain (or auto-detect)
- [ ] Submit and see loading indicator
- [ ] View worldview evaluations (all 12 worldviews)
- [ ] See conflict visualization
- [ ] View integrated judgment with confidence
- [ ] Read minority views with full reasoning
- [ ] Expand full justification (markdown)
- [ ] Save deliberation to history
- [ ] Start new deliberation (form resets)

#### User Can Browse History
- [ ] See table of past deliberations
- [ ] Sort by date, domain, judgment, confidence
- [ ] Filter by domain
- [ ] Filter by judgment
- [ ] Search scenario text
- [ ] Click row to view full details
- [ ] Re-deliberate on past scenario
- [ ] Delete individual deliberation
- [ ] Export all history to JSON

#### User Can Explore Worldviews
- [ ] See all 12 worldviews with descriptions
- [ ] Filter by cluster (Material-Empirical, etc.)
- [ ] View detailed worldview info (values, philosophers)
- [ ] Understand how worldviews differ

#### User Can Customize
- [ ] Override domain weights with sliders
- [ ] Preview how judgment changes
- [ ] Apply custom weights to deliberation
- [ ] Set theme preference (light/dark)
- [ ] Set default domain
- [ ] Export/import history
- [ ] Clear all history

#### PWA Features Work
- [ ] App installable on desktop (Chrome, Edge, Safari)
- [ ] App installable on mobile (iOS Safari, Android Chrome)
- [ ] App works offline (service worker caches assets)
- [ ] App shows offline indicator when no network
- [ ] App updates automatically when new version deployed

---

### Technical Acceptance Criteria

#### Architecture
- [ ] Three-layer architecture implemented (Domain, Application, Presentation)
- [ ] Business logic separated from UI
- [ ] Pure functions for all core logic
- [ ] Stateful actions isolated in concepts
- [ ] API client abstraction ready for backend

#### Performance
- [ ] Lighthouse Performance score ≥ 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Bundle size < 200KB (gzipped)
- [ ] Scenario input to results < 5s
- [ ] No memory leaks (tested with dev tools)

#### PWA Compliance
- [ ] Lighthouse PWA score: 100
- [ ] Service worker registered and active
- [ ] Web app manifest valid
- [ ] Offline page shown when network unavailable
- [ ] App installable (Add to Home Screen prompt)
- [ ] HTTPS enabled (required for PWA)

#### Accessibility
- [ ] Lighthouse Accessibility score: 100
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigable (all features accessible)
- [ ] Screen reader compatible (tested with NVDA/JAWS)
- [ ] Focus indicators visible
- [ ] Color contrast ≥ 4.5:1
- [ ] No axe-core violations
- [ ] ARIA labels on all interactive elements

#### Responsiveness
- [ ] Works on mobile (320px width minimum)
- [ ] Works on tablet (768px - 1024px)
- [ ] Works on desktop (1024px+)
- [ ] Touch interactions work (no hover-only features)
- [ ] Viewport meta tag configured
- [ ] Layout doesn't break at any width

#### Browser Compatibility
- [ ] Chrome/Edge (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari desktop (latest 2 versions)
- [ ] Safari iOS (latest 2 versions)
- [ ] Chrome Android (latest version)
- [ ] Graceful degradation for older browsers

#### Code Quality
- [ ] ESLint: 0 errors
- [ ] Prettier: All files formatted
- [ ] TypeScript (if used): 0 type errors
- [ ] No console.log in production
- [ ] No TODO/FIXME comments unaddressed
- [ ] All functions documented (JSDoc)
- [ ] Code reviewed by at least 1 person

#### Testing
- [ ] Unit tests: 80%+ coverage on critical paths
- [ ] Component tests: All components tested
- [ ] Integration tests: API client, stores, IndexedDB
- [ ] E2E tests: 15+ critical flows
- [ ] All tests passing (0 failures)
- [ ] CI/CD pipeline green

#### Documentation
- [ ] README with setup instructions
- [ ] API specification complete
- [ ] Component documentation (Storybook)
- [ ] User guide (how to use the app)
- [ ] Developer guide (how to contribute)
- [ ] Architecture diagram
- [ ] Deployment guide

---

### Quality Acceptance Criteria

#### Usability
- [ ] User can complete deliberation without instructions (5/5 test users succeed)
- [ ] UI is intuitive (average SUS score ≥ 70)
- [ ] Loading states inform user (no "blank screen" moments)
- [ ] Error messages are actionable ("Try again" vs "Error 500")
- [ ] Results are understandable (no jargon without explanation)

#### Reliability
- [ ] No critical bugs (P0)
- [ ] No high-priority bugs (P1) blocking launch
- [ ] App recovers gracefully from errors
- [ ] No data loss (deliberations always saved if user clicks "Save")
- [ ] IndexedDB quota warnings shown before hitting limit

#### Security
- [ ] No XSS vulnerabilities (input sanitized)
- [ ] No exposed secrets in client code
- [ ] HTTPS enforced (no mixed content)
- [ ] Service worker only serves app origin
- [ ] CSP headers configured

#### Maintainability
- [ ] Code follows style guide
- [ ] Components < 300 lines each
- [ ] Functions < 50 lines each
- [ ] DRY principle followed (no duplicate logic)
- [ ] Clear separation of concerns
- [ ] Easy to add new features (extensible)

---

## Risk Acceptance Criteria

### Risk Mitigation Validation

#### Risk: PWA complexity overwhelming users
- [ ] Onboarding tutorial tested with 5 users (4/5 understand)
- [ ] Advanced features hidden by default
- [ ] Example scenarios help users get started
- [ ] "What is IEE?" section clarifies purpose

#### Risk: Performance issues (deliberation too slow)
- [ ] Deliberation completes in < 5s (tested with 12 worldviews)
- [ ] Web Workers tested for heavy computation (P2 feature)
- [ ] Progressive results tested (worldviews appear as ready)

#### Risk: Mobile usability issues
- [ ] Tested on real iOS device (iPhone)
- [ ] Tested on real Android device
- [ ] Touch targets ≥ 44x44 pixels
- [ ] No horizontal scrolling required
- [ ] Text readable without zooming (16px minimum)

#### Risk: IndexedDB quota limits
- [ ] Warning shown at 80% quota usage
- [ ] Export functionality tested (users can backup)
- [ ] Pagination implemented (history doesn't load all at once)

#### Risk: API future-proofing doesn't work
- [ ] API client abstraction tested (can switch implementation)
- [ ] Schemas validated (UI consumes correct format)
- [ ] Migration guide reviewed by backend developer

---

## Test Plan

### Test Coverage Requirements

| Test Type | Coverage Target | Tool | Milestone |
|-----------|----------------|------|-----------|
| Unit Tests | 80%+ on critical paths | Vitest | M1-M6 |
| Component Tests | 100% of components | @testing-library/svelte | M2-M4 |
| Integration Tests | All API client, stores, IndexedDB | Vitest | M1, M5 |
| E2E Tests | 15+ critical flows | Playwright | M3-M6 |
| Accessibility | 0 axe-core violations | axe-core | M4 |
| Visual Regression | All pages/components | Playwright screenshots | M2-M4 |
| Performance | Lighthouse ≥ 90 | Lighthouse CI | M6 |

### Critical Test Scenarios (E2E)

1. **Happy Path: Complete Deliberation**
   - User inputs scenario
   - Selects domain
   - Clicks "Start Deliberation"
   - Views results (worldviews, conflict, judgment)
   - Saves to history
   - **Expected**: Deliberation saved, shows in history

2. **Deliberation with Auto-Detect Domain**
   - User inputs healthcare scenario
   - Selects "Auto-detect"
   - System detects "healthcare" domain
   - **Expected**: Healthcare weights applied

3. **Override Domain Weights**
   - User completes deliberation
   - Clicks "Adjust Weights"
   - Changes Materialism weight from 0.90 to 0.50
   - Applies changes
   - **Expected**: Judgment recalculated, preview accurate

4. **Browse and Delete History**
   - User has 5 deliberations in history
   - Filters by domain "healthcare"
   - Sees only healthcare deliberations
   - Deletes one deliberation
   - **Expected**: Deliberation removed from table

5. **Offline Mode**
   - User completes deliberation while online
   - Goes offline (network disabled)
   - Refreshes page
   - **Expected**: App loads, history still accessible

6. **Error Recovery: Invalid Scenario**
   - User inputs 5-character scenario (too short)
   - Clicks "Start Deliberation"
   - **Expected**: Validation error shown, button disabled

7. **Worldview Explorer**
   - User navigates to `/worldviews`
   - Clicks "Material-Empirical" filter
   - Sees only 4 worldviews
   - Clicks Materialism card
   - **Expected**: Modal opens with full details

8. **Export History**
   - User has 10 deliberations in history
   - Clicks "Export All"
   - **Expected**: JSON file downloads, contains 10 deliberations

9. **Re-deliberate from History**
   - User opens past deliberation from history
   - Clicks "Re-deliberate"
   - **Expected**: Scenario loaded into deliberation page

10. **Mobile: Complete Deliberation**
    - User on mobile device (375px width)
    - Inputs scenario, deliberates
    - Scrolls through results
    - **Expected**: All elements visible, no horizontal scroll

11. **Keyboard Navigation**
    - User navigates app using only keyboard (Tab, Enter, Arrow keys)
    - Can complete deliberation
    - Can browse history
    - **Expected**: All features accessible

12. **Screen Reader: Deliberation Results**
    - User with screen reader (NVDA/JAWS)
    - Completes deliberation
    - Screen reader announces results
    - **Expected**: All key info announced (judgment, confidence, minority views)

13. **PWA Installation**
    - User on desktop Chrome
    - Clicks "Install" button (or address bar prompt)
    - **Expected**: App installs, opens in standalone window

14. **Service Worker Update**
    - User has app open (old version)
    - New version deployed
    - Service worker detects update
    - **Expected**: Update notification shown, user can refresh

15. **Long Scenario Input**
    - User inputs 5000-character scenario (maximum)
    - Deliberates successfully
    - **Expected**: No performance degradation

---

## Definition of Done (Phase 4 Complete)

### Functional Completeness
- [x] All P0 (Must Have) features implemented and tested
- [x] All P1 (Should Have) features implemented and tested
- [x] P2 features documented for future phases

### Technical Quality
- [x] All acceptance criteria met (see sections above)
- [x] All tests passing (unit, component, integration, E2E)
- [x] Lighthouse scores: PWA 100, Performance ≥ 90, Accessibility 100
- [x] Code quality: ESLint 0 errors, Prettier formatted, documented

### User Validation
- [x] 5 user testing sessions completed
- [x] Average SUS score ≥ 70 (usability)
- [x] Critical user flows work without confusion
- [x] Feedback incorporated into final release

### Documentation
- [x] User guide complete (how to use app)
- [x] Developer guide complete (how to contribute)
- [x] API specification complete (for future backend)
- [x] README with setup instructions
- [x] Architecture documented

### Deployment
- [x] Deployed to production (Vercel/Netlify)
- [x] HTTPS enabled
- [x] Custom domain configured (if applicable)
- [x] Monitoring active (error tracking, analytics)
- [x] Backup/rollback plan tested
- [x] Performance stable (no degradation after 1 week)

### Handoff Readiness
- [x] API foundation ready (client abstraction, schemas, auth placeholder)
- [x] Backend migration guide prepared
- [x] Future Phase 4.5 (API Backend) plan documented

---

## Success Metrics (Post-Launch)

### Technical Metrics (Week 1-4 after launch)
- Uptime: ≥ 99.5%
- Average page load time: < 2s
- Error rate: < 0.1% of sessions
- PWA install rate: ≥ 5% of visitors
- Offline usage: ≥ 10% of deliberations happen offline

### User Engagement Metrics
- Deliberations per user: ≥ 3 (indicates value)
- Return rate: ≥ 30% (users come back)
- Completion rate: ≥ 80% (users finish deliberations they start)
- Export rate: ≥ 10% (users find value worth saving)

### Quality Metrics
- Critical bugs: 0
- High-priority bugs: < 3
- User-reported issues: < 10 per week
- Accessibility complaints: 0

---

## Project Timeline

| Week | Milestone | Key Deliverables | Team Focus |
|------|-----------|------------------|------------|
| 1 | M1: Foundation (Part 1) | Orchestrator, schemas, session manager | Backend logic |
| 2 | M1: Foundation (Part 2) | SvelteKit setup, IndexedDB, stores | Frontend infrastructure |
| 3 | M2: Core Components | 5 key components built and tested | UI development |
| 4 | M3: Main Application | 5 pages assembled, navigation working | Page assembly |
| 5 | M4: Advanced Features | Weight override, visualizations, templates | Polish |
| 6 | M5: API Preparation | API specs, client abstraction, auth placeholder | Architecture |
| 7 | M6: Testing & Deployment | All tests, optimization, production deployment | QA & Launch |

---

## Resources Required

### Team
- **1 Full-Stack Developer** (Svelte, JavaScript, PWA expertise)
- **1 UX/UI Designer** (Part-time, Week 1-3 for mockups, Week 5 for polish)
- **1 QA Tester** (Part-time, Week 6-7 for E2E testing)

### Tools & Services
- **Development**: VS Code, Git, GitHub
- **Testing**: Vitest, Playwright, axe-core
- **Deployment**: Vercel or Netlify (free tier)
- **Monitoring**: Sentry (error tracking), Vercel Analytics
- **Design**: Figma (optional, for mockups)

### Infrastructure
- **Hosting**: Vercel/Netlify (free tier sufficient for Phase 4)
- **Database**: None (IndexedDB local storage)
- **CDN**: Included with Vercel/Netlify

---

## Phase 4 Completion Criteria

**Phase 4 is complete when**:
1. All acceptance criteria met (see sections above)
2. Production deployment live and stable for 1 week
3. No P0 or P1 bugs outstanding
4. User testing completed with positive feedback (SUS ≥ 70)
5. Documentation complete and reviewed
6. API foundation ready for Phase 4.5

**Ready for Phase 4.5 (API Backend) when**:
- User adoption validated (≥ 100 deliberations in first month)
- Feature requests indicate API need
- Backend team available

---

**Status**: 📋 **READY TO START**
**Next Step**: Begin Milestone 1 (Foundation) - Week 1
**Owner**: [Assign developer/team]
**Kickoff Date**: [TBD]
