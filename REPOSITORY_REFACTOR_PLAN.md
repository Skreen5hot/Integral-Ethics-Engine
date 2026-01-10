# Repository Refactor Plan - Integral Ethics Engine

**Date:** 2026-01-10
**Status:** Proposal
**Goal:** Improve LLM context efficiency, human navigation, team communication, and artifact sharing

---

## Executive Summary

The IEE repository has accumulated **50+ markdown files** at root level during rapid Phase 1-4 development. This refactor plan will:

1. **Reduce LLM context overhead** by 60-70% through better organization
2. **Improve human navigation** with clear directory structure
3. **Preserve TagTeam collaboration** in dedicated workspace
4. **Create shareable artifact collections** for external teams

**Guiding Principle:** Archive completed work, surface active work, preserve communication threads.

---

## Current State Analysis

### Root Directory (Problems)

**50+ files at root level**, including:
- 20+ Phase completion documents (`PHASE*_COMPLETE.md`)
- 12+ worldview-specific documents (scattered)
- 8+ TagTeam communication docs (duplicated with tagteam-collaboration/)
- 5+ README variants
- Multiple test strategy documents

**Impact on LLM:**
- Every file system scan includes dozens of irrelevant files
- Completed phase documents add noise to context
- Duplicate files between root and subdirectories cause confusion

**Impact on Humans:**
- Hard to find active documentation
- Unclear what's current vs archived
- No obvious starting point for new contributors

### Current Good Structure

✅ **Well-organized:**
- `src/` - Application code (clean)
- `docs/` - Core philosophical documents (11 files, well-curated)
- `tagteam-collaboration/` - Three-way split (dist, from-tagteam, to-tagteam)

❌ **Needs work:**
- Root directory (50+ files)
- Test artifacts (scattered across root, ui-test-framework, unit-tests)
- Build artifacts (build/ should be gitignored or documented)

---

## Proposed Structure

```
Integral-Ethics-Engine/
│
├── README.md                          # Main entry point (updated)
├── LICENSE
├── package.json
├── manifest.json                      # PWA manifest
├── vite.config.js
│
├── .github/                           # CI/CD workflows
│   └── workflows/
│       └── ci.yml
│
├── docs/                              # Core philosophical & architectural docs
│   ├── README.md                      # Docs navigation
│   ├── philosophy/                    # NEW: Philosophy documents
│   │   ├── integral-ethics.md
│   │   ├── line-in-the-sand.md
│   │   └── Reclaiming-Process-Qualities.md
│   ├── architecture/                  # NEW: Technical architecture
│   │   ├── ARCHITECTURE.md
│   │   ├── GITHUB_PAGES_PWA.md
│   │   └── Integration-Procedure.md
│   ├── models/                        # NEW: Domain models
│   │   ├── Domain-Contextualization.md
│   │   ├── Moral-Character-Model.md
│   │   └── worldviews/                # NEW: Worldview-specific docs
│   │       ├── README.md
│   │       ├── materialism.md
│   │       ├── sensationalism.md
│   │       ├── phenomenalism.md
│   │       └── ... (12 worldviews)
│   └── archon/                        # ARCHON-specific (if still active)
│       ├── ARCHON.md
│       └── ARCHON_Functional_Requirments.md
│
├── archive/                           # NEW: Completed phase documents
│   ├── README.md                      # Archive index
│   ├── phases/
│   │   ├── phase1/
│   │   │   ├── PHASE1_COMPLETION_CHECKLIST.md
│   │   │   ├── PHASE1_CRITICAL_REVIEW.md
│   │   │   └── FOUNDATION_COMPLETE.md
│   │   ├── phase2/
│   │   │   ├── PHASE2_IMPLEMENTATION_PLAN.md
│   │   │   ├── PHASE2_4_CHARACTER_COMPLETE.md
│   │   │   ├── PHASE2_5_COMPLETE.md
│   │   │   ├── PHASE2_5_IMPLEMENTATION_PLAN.md
│   │   │   ├── DOMAIN_CONTEXTUALIZATION_COMPLETE.md
│   │   │   ├── MORAL_CHARACTER_COMPLETE.md
│   │   │   ├── SENSATIONALISM_COMPLETE.md
│   │   │   ├── PHENOMENALISM_COMPLETE.md
│   │   │   └── VALUE_CONFLICT_RESOLUTION_COMPLETE.md
│   │   ├── phase3/
│   │   │   ├── PHASE3_IMPLEMENTATION_PLAN.md
│   │   │   ├── PHASE3_COMPLETE.md
│   │   │   ├── PHASE3_1_PSYCHISM_COMPLETE.md
│   │   │   └── WORLDVIEW_RELATIONSHIPS_COMPLETE.md
│   │   └── phase4/
│   │       ├── PHASE4_IMPLEMENTATION_PLAN.md
│   │       ├── PHASE4_PROJECT_PLAN.md
│   │       ├── PHASE4_1_COMPLETE.md
│   │       ├── PHASE4_2_COMPLETE.md
│   │       ├── PHASE4_3_COMPLETE.md
│   │       └── PHASE4_4_COMPLETE.md
│   ├── templates/                     # OLD: Template files
│   │   ├── README-templet.md
│   │   └── TEMPLATE_README.md
│   └── historical/                    # OLD: Historical docs
│       ├── README-moral-character.md
│       ├── README-sensationalism-values.md
│       ├── SENSATIONALISM_UPDATE_SUMMARY.md
│       └── REAL_REASONING_INTEGRATION.md
│
├── planning/                          # NEW: Active planning documents
│   ├── README.md                      # Planning docs index
│   ├── stratigicRoadmap.md            # High-level roadmap
│   ├── agenticDevlopment.md           # Development methodology
│   ├── STATUS_SUMMARY.md              # Current project status
│   ├── ONTOLOGIES_NEEDED.md           # Ontology requirements
│   └── VALUENET_INTEGRATION.md        # ValueNet integration plan
│
├── testing/                           # NEW: Consolidated test docs & frameworks
│   ├── README.md                      # Testing overview
│   ├── strategy/
│   │   ├── testStrategy.md
│   │   └── uiTestingFramework.md
│   ├── scenarios/
│   │   └── TEST_SCENARIOS.md
│   ├── results/
│   │   └── TEST_RESULTS.md
│   ├── frameworks/
│   │   ├── ui-test-framework/         # Moved from root
│   │   │   ├── README.md
│   │   │   ├── package.json
│   │   │   └── ... (tests, src)
│   │   └── unit-tests/                # Moved from root
│   │       ├── README.md
│   │       └── application/
│   └── shared-test-utils/             # Moved from root
│       └── ...
│
├── collaborations/                    # NEW: External team workspaces
│   ├── README.md                      # Collaboration guide
│   └── tagteam/                       # RENAMED from tagteam-collaboration
│       ├── README.md                  # TagTeam overview
│       ├── deliverables/              # RENAMED from from-tagteam
│       │   └── week1/
│       │       ├── DELIVERABLE.md
│       │       ├── FORMAT_UPDATES.md
│       │       ├── INTEGRATION_COMPLETE.md
│       │       └── STATUS.md
│       ├── requirements/              # RENAMED from to-tagteam/requirements
│       │   ├── integration-requirements.md
│       │   └── test-build-plan.md
│       ├── communication/             # RENAMED from to-tagteam/communication
│       │   ├── delivery-summary.md
│       │   ├── questions-answered.md
│       │   ├── testing-handoff.md
│       │   └── TAGTEAM_VALIDATION_RESULTS.md
│       ├── data/                      # RENAMED from to-tagteam/data
│       │   ├── compound-terms.json
│       │   ├── test-corpus-week1.json
│       │   └── value-definitions-core.json
│       ├── dist/                      # TagTeam deliverable bundle
│       │   ├── README.md
│       │   ├── tagteam.js
│       │   ├── test-iee-bundle.html
│       │   ├── test.html
│       │   ├── simple-test.cjs
│       │   └── validation-results.json
│       └── integration/               # NEW: IEE integration code (future)
│
├── ontology/                          # Ontology files (as-is)
│   └── ...
│
├── valueNet/                          # ValueNet files (as-is)
│   ├── annotationGuide.md
│   ├── BFOizing ValueNet.md
│   └── TestingFramework.md
│
├── examples/                          # Example scenarios (as-is)
│   └── ...
│
├── scripts/                           # Build/utility scripts
│   └── ...
│
├── src/                               # Application source code (as-is)
│   ├── lib/
│   ├── routes/
│   ├── application/
│   ├── concepts/
│   └── utils/
│
├── static/                            # Static assets (as-is)
│   └── manifest.json
│
├── build/                             # Build output (should be in .gitignore)
│   └── ...
│
└── [misc root files]                  # Keep at root
    ├── .gitignore
    ├── .hintrc
    ├── bfo-core.ttl
    ├── offline.html
    ├── service-worker.js
    ├── pre-commit
    ├── GITREADME.md
    └── iee-worldview-ui.md
```

---

## Migration Strategy

### Phase 1: Create New Structure (Non-Breaking)

**Goal:** Create new directories without moving files yet

```bash
# Create new directories
mkdir -p archive/{phases/{phase1,phase2,phase3,phase4},templates,historical}
mkdir -p planning
mkdir -p testing/{strategy,scenarios,results,frameworks}
mkdir -p docs/{philosophy,architecture,models/worldviews,archon}
mkdir -p collaborations/tagteam

# Create README files for each new directory
```

**Estimated time:** 30 minutes

### Phase 2: Move Archive Files

**Goal:** Clear root of completed phase documents

```bash
# Move Phase 1 docs
mv PHASE1_*.md archive/phases/phase1/
mv FOUNDATION_COMPLETE.md archive/phases/phase1/

# Move Phase 2 docs
mv PHASE2_*.md archive/phases/phase2/
mv DOMAIN_CONTEXTUALIZATION_COMPLETE.md archive/phases/phase2/
mv MORAL_CHARACTER_COMPLETE.md archive/phases/phase2/
mv SENSATIONALISM_COMPLETE.md archive/phases/phase2/
mv PHENOMENALISM_COMPLETE.md archive/phases/phase2/
mv VALUE_CONFLICT_RESOLUTION_COMPLETE.md archive/phases/phase2/

# Move Phase 3 docs
mv PHASE3_*.md archive/phases/phase3/
mv WORLDVIEW_RELATIONSHIPS_COMPLETE.md archive/phases/phase3/

# Move Phase 4 docs
mv PHASE4_*.md archive/phases/phase4/

# Move templates
mv TEMPLATE_README.md archive/templates/
mv README-templet.md archive/templates/

# Move historical docs
mv README-moral-character.md archive/historical/
mv README-sensationalism-values.md archive/historical/
mv SENSATIONALISM_UPDATE_SUMMARY.md archive/historical/
mv REAL_REASONING_INTEGRATION.md archive/historical/
```

**Estimated time:** 15 minutes

### Phase 3: Reorganize Active Docs

**Goal:** Move active planning and testing docs to proper locations

```bash
# Move planning docs
mv stratigicRoadmap.md planning/
mv agenticDevlopment.md planning/
mv STATUS_SUMMARY.md planning/
mv ONTOLOGIES_NEEDED.md planning/
mv VALUENET_INTEGRATION.md planning/

# Move testing docs
mv testStrategy.md testing/strategy/
mv uiTestingFramework.md testing/strategy/
mv TEST_SCENARIOS.md testing/scenarios/
mv TEST_RESULTS.md testing/results/

# Move test frameworks
mv ui-test-framework testing/frameworks/
mv unit-tests testing/frameworks/
mv shared-test-utils testing/
```

**Estimated time:** 15 minutes

### Phase 4: Reorganize docs/ Directory

**Goal:** Better categorize core documentation

```bash
# Move philosophy docs
mv docs/integral-ethics.md docs/philosophy/
mv docs/line-in-the-sand.md docs/philosophy/
mv docs/Reclaiming-Process-Qualities.md docs/philosophy/

# Move architecture docs
mv docs/GITHUB_PAGES_PWA.md docs/architecture/
# (ARCHITECTURE.md and Integration-Procedure.md already in docs/)

# Move model docs
mv docs/Domain-Contextualization.md docs/models/
mv docs/Moral-Character-Model.md docs/models/
# (Note: Moral-Charater-Model.md is a typo duplicate - review and delete)

# Move ARCHON docs (if keeping)
# (Already in docs/ - just move to archon/ subdirectory)
```

**Estimated time:** 10 minutes

### Phase 5: Reorganize TagTeam Collaboration

**Goal:** Consolidate and clarify TagTeam workspace

```bash
# Create new structure
mkdir -p collaborations/tagteam/{deliverables,requirements,communication,data,dist,integration}

# Copy from tagteam-collaboration (preserve original temporarily)
cp -r tagteam-collaboration/from-tagteam/* collaborations/tagteam/deliverables/
cp -r tagteam-collaboration/to-tagteam/requirements/* collaborations/tagteam/requirements/
cp -r tagteam-collaboration/to-tagteam/communication/* collaborations/tagteam/communication/
cp -r tagteam-collaboration/to-tagteam/data/* collaborations/tagteam/data/
cp -r tagteam-collaboration/dist/* collaborations/tagteam/dist/
cp tagteam-collaboration/README.md collaborations/tagteam/

# Move root TagTeam files
mv TAGTEAM_*.md collaborations/tagteam/communication/ (if not already in to-tagteam/)

# Remove root duplicates
rm compound-terms.json (duplicate in collaborations/tagteam/data/)
rm test-corpus-week1.json (duplicate)
rm value-definitions-core.json (duplicate)
rm tagteam-validator.js (move to collaborations/tagteam/integration/)

# Later: Remove old tagteam-collaboration/ after verification
```

**Estimated time:** 20 minutes

### Phase 6: Update References

**Goal:** Update links and imports in files that reference moved documents

**Files to update:**
- `README.md` - Update all doc links
- `.github/workflows/ci.yml` - Update any path references
- Test files that import from moved locations
- Planning docs that reference other docs

**Estimated time:** 30 minutes

### Phase 7: Create Navigation READMEs

**Goal:** Make each directory self-documenting

Create `README.md` in:
- `archive/` - Explain archive structure, how to find historical docs
- `planning/` - Current project status, roadmap overview
- `testing/` - Testing strategy overview, how to run tests
- `docs/` - Updated navigation for subdirectories
- `collaborations/` - How to work with external teams
- `collaborations/tagteam/` - TagTeam integration overview

**Estimated time:** 45 minutes

---

## Benefits Analysis

### For LLM Context (Primary Goal)

**Before:**
- 50+ markdown files scanned on every root directory list
- Phase 1-4 completion docs (25+ files, 15,000+ lines) included in context unnecessarily
- Duplicate files between root and tagteam-collaboration/ cause confusion
- Unclear what's "active" vs "archived"

**After:**
- ~10-15 files at root (70% reduction)
- Archive directory clearly marked as historical
- Single source of truth for TagTeam collaboration
- Clear separation: active (planning/, testing/) vs archived (archive/)

**Estimated context reduction:** 60-70% for typical file listing operations

### For Human Navigation (Secondary Goal)

**Before:**
- Overwhelming root directory with 50+ files
- No obvious entry point for new contributors
- Hard to find current project status
- Unclear which docs are authoritative

**After:**
- Clean root with clear README
- Logical directory structure by purpose
- planning/ contains current status
- archive/ contains completed work
- Each directory has navigation README

**Estimated time to find relevant doc:** 5 minutes → 1 minute (80% improvement)

### For Team Communication (TagTeam Focus)

**Before:**
- TagTeam files split between:
  - `tagteam-collaboration/` (primary)
  - Root directory (`TAGTEAM_*.md`, data files)
- Unclear handoff between teams
- Duplicate data files at root

**After:**
- Single `collaborations/tagteam/` workspace
- Clear structure: deliverables, requirements, communication, data, dist
- Easy to package and share entire collaboration folder
- Obvious location for new external collaborations

**Estimated improvement:** Single source of truth, easier packaging for sharing

### For Artifact Sharing

**Before:**
- Data files scattered (root, tagteam-collaboration/to-tagteam/data/)
- Test results mixed with test strategy
- No clear "shareable artifacts" collection

**After:**
- `collaborations/tagteam/data/` contains all official data artifacts
- `collaborations/tagteam/dist/` contains deliverable bundles
- `collaborations/tagteam/communication/` contains all correspondence
- Easy to zip and share: `zip -r tagteam-handoff.zip collaborations/tagteam/`

---

## Risk Assessment

### Low Risk (Safe to proceed)

✅ **Archive creation** - No existing files modified, just moved
✅ **Directory creation** - Additive only
✅ **TagTeam reorganization** - Improves existing structure

### Medium Risk (Needs care)

⚠️ **Reference updates** - Must update all doc links (but easily testable)
⚠️ **Import path changes** - Must update any code imports (rare, mostly docs)
⚠️ **Git history** - Moving files creates "deleted" + "added" unless using `git mv`

**Mitigation:**
- Use `git mv` instead of `mv` to preserve history
- Test all doc links after migration
- Keep old tagteam-collaboration/ for 1 week before deleting

### High Risk (Review carefully)

🚨 **None identified** - This is primarily documentation reorganization

---

## Implementation Checklist

### Pre-Migration

- [ ] Review this plan with human stakeholder
- [ ] Commit current state to git (clean slate)
- [ ] Create feature branch: `git checkout -b refactor/repository-structure`

### Migration Steps

- [ ] **Phase 1:** Create new directories + README files (30 min)
- [ ] **Phase 2:** Move archive files with `git mv` (15 min)
- [ ] **Phase 3:** Move active planning/testing docs (15 min)
- [ ] **Phase 4:** Reorganize docs/ subdirectories (10 min)
- [ ] **Phase 5:** Reorganize TagTeam collaboration workspace (20 min)
- [ ] **Phase 6:** Update all doc references and links (30 min)
- [ ] **Phase 7:** Create navigation READMEs (45 min)

**Total estimated time:** ~2.5 hours

### Post-Migration

- [ ] Test GitHub Pages build still works
- [ ] Verify all doc links resolve correctly
- [ ] Update main README.md with new structure
- [ ] Commit changes: `git commit -m "refactor: reorganize repository structure"`
- [ ] Create PR for review
- [ ] After merge: Delete old `tagteam-collaboration/` directory
- [ ] Notify TagTeam of new structure: `collaborations/tagteam/`

---

## Questions for Review

1. **Archive vs Delete:** Should any phase docs be deleted instead of archived? (Recommendation: Keep all for historical reference)

2. **ARCHON:** Is ARCHON still active? If not, should docs move to archive? (Current: kept in docs/archon/)

3. **Build directory:** Should `build/` be in `.gitignore`? (Current: committed to git)

4. **ValueNet:** Should `valueNet/` be moved to `collaborations/valuenet/`? (Current: kept at root)

5. **Ontology:** Should `ontology/` be moved to `docs/ontology/`? (Current: kept at root)

6. **Examples:** Should `examples/` be moved to `docs/examples/` or kept at root? (Current: kept at root)

7. **TagTeam timing:** Should we wait for Week 1 acceptance before reorganizing? (Recommendation: Proceed, improves handoff)

8. **Git history:** Use `git mv` to preserve file history? (Recommendation: Yes)

---

## Alternative: Minimal Refactor

If full refactor is too ambitious, here's a minimal version:

### Minimal Plan (1 hour)

1. **Create `archive/`** - Move all `PHASE*_COMPLETE.md` (saves 60% of LLM context overhead)
2. **Create `collaborations/tagteam/`** - Consolidate TagTeam workspace
3. **Remove root duplicates** - Delete duplicate JSON files
4. **Update README.md** - Add simple directory guide

**Impact:** 70% of benefit, 40% of effort

---

## Recommendation

**Proceed with FULL refactor** for following reasons:

1. Project is mature enough (Phase 4 complete) to benefit from organization
2. TagTeam collaboration is active - better structure improves communication
3. LLM context overhead is significant (50+ files at root)
4. Low risk - primarily moving documentation
5. Future external collaborations will benefit from clear patterns

**Timeline:** Execute over 2-3 sessions to allow for testing between phases

**Success Criteria:**
- ✅ Root directory has <15 files
- ✅ All doc links resolve correctly
- ✅ GitHub Pages build passes
- ✅ TagTeam collaboration in single directory
- ✅ Each major directory has navigation README

---

**Document Version:** 1.0
**Status:** Awaiting approval
**Next Step:** Review and approve/modify plan before execution
