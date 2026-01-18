# Repository Cleanup Plan - Phase 2 Completion

**Date**: 2026-01-18
**Purpose**: Organize repository before committing Phase 2 TagTeam integration to main
**Status**: Pre-commit review

---

## Executive Summary

**Files to commit**: 46
**Current state**: Phase 2 TagTeam integration complete (108/108 tests passing)
**Main issues**:
1. Communication files scattered across collaboration folders
2. Duplicate/versioned documentation files
3. Root README doesn't reflect current project state
4. Missing integration documentation in main docs
5. Uncommitted new features and tests

---

## 1. Communication Files Organization

### Current State
- 34 communication files in `collaborations/tagteam/communication/`
- Mix of checkpoints, feedback, planning, and completion docs
- Some duplicate content with versioning (v2 suffixes)

### Cleanup Actions

#### Archive Completed Communications
Move to `collaborations/tagteam/communication/archive/week2/`:
```bash
# Week 2A completion docs
WEEK2A_ACCEPTANCE.md
WEEK2A_COMPLETE.md
WEEK2A_IEE_RESPONSE.md

# Week 2B planning/feedback (superseded by final docs)
WEEK2B_PLANNING_SESSION_AGENDA.md
WEEK2B_PLANNING_SUMMARY.md
WEEK2B_PLANNING_RESPONSES.md
WEEK2B_TECHNICAL_QUESTIONS.md
WEEK2B_IEE_DECISIONS.md
WEEK2B_KICKOFF.md
WEEK2_FEEDBACK.md
WEEK2_IEE_RESPONSE.md
```

#### Keep Active in Root Communication Folder
```bash
# Current reference docs
README.md                          # Communication overview
WEEK2B_FINAL_ACCEPTANCE.md        # Final acceptance criteria
WEEK2B_COMPLETE.md                # Completion status
WEEK2B_IMPLEMENTATION_PLAN.md     # Implementation reference
WEEK2B_ARCHITECTURE.md            # Architecture decisions
WEEK2B_API_MOCKUPS.md             # API reference

# Integration guides
BUNDLE_VERIFICATION.md
HOW_TO_VERIFY.md

# Checkpoint tracking
CHECKPOINT_1_STATUS.md
CHECKPOINT_1_IEE_REVIEW.md
CHECKPOINT_2_STATUS.md
```

#### Remove Duplicates
Delete versioned duplicates (keep latest):
```bash
# Old versions (Week 1)
delivery-summary-v2.md          # Keep delivery-summary.md
questions-answered-v2.md        # Keep questions-answered.md
testing-handoff-v2.md           # Keep testing-handoff.md
```

---

## 2. Documentation Consolidation

### Current Documentation Structure
```
docs/
├── ARCHITECTURE.md                         # Main architecture
├── Integration-Procedure.md                # General integration guide
├── tagteam-integration-phase2-complete.md  # NEW - Phase 2 summary
├── README.md                               # Docs index
├── architecture/
│   ├── GITHUB_PAGES_PWA.md
│   └── SEMANTIC_ROADMAP.md
├── models/
│   ├── Domain-Contextualization.md
│   └── Moral-Character-Model.md
└── philosophy/
    ├── bfo-intentionality.md
    ├── integral-ethics.md
    ├── line-in-the-sand.md
    ├── middle-layer-shml.md
    └── Reclaiming-Process-Qualities.md
```

### Actions

#### 1. Create Integration Documentation Section
```bash
mkdir -p docs/integrations/tagteam/
```

Move and organize:
```bash
# Move Phase 2 completion doc
mv docs/tagteam-integration-phase2-complete.md \
   docs/integrations/tagteam/phase2-completion.md

# Create integration index
# (new file - see below)
docs/integrations/tagteam/README.md
```

#### 2. Create Integration Index
Create `docs/integrations/tagteam/README.md`:
```markdown
# TagTeam Integration Documentation

## Overview
TagTeam v2.0.0 semantic analysis integration with IEE deliberation pipeline.

## Phase 2: Complete ✅
- **Status**: Production ready
- **Tests**: 108/108 passing (100%)
- **Completion Date**: 2026-01-18

### Key Documents
- [Phase 2 Completion Summary](./phase2-completion.md)
- [Architecture Decisions](../../../collaborations/tagteam/communication/WEEK2B_ARCHITECTURE.md)
- [Implementation Plan](../../../collaborations/tagteam/communication/WEEK2B_IMPLEMENTATION_PLAN.md)
- [API Reference](../../../collaborations/tagteam/communication/WEEK2B_API_MOCKUPS.md)

### Technical Reference
- [Bundle Location](../../../collaborations/tagteam/dist/)
- [Integration Tests](../../../testing/frameworks/integration-tests/)
- [Unit Tests](../../../testing/frameworks/unit-tests/)
```

#### 3. Update Main Docs README
Update `docs/README.md` to include integrations section.

---

## 3. Root README Update

### Current State
`GITREADME.md` describes a "Mermaid Project IDE" - **not the current project**

### Action
**Option A: Replace GITREADME.md** (Recommended)
- Replace with proper IEE project README
- Rename `GITREADME.md` → `README.md`
- Archive old Mermaid content if needed

**Option B: Create New README.md**
- Create comprehensive project README
- Keep GITREADME.md for historical reference

### Proposed README.md Content
```markdown
# Integral Ethics Engine (IEE)

A multi-worldview moral deliberation system that integrates semantic analysis for comprehensive ethical reasoning.

## Overview
The Integral Ethics Engine provides transparent, multi-perspective moral deliberation by consulting 12 philosophical worldviews and integrating semantic analysis from TagTeam v2.0.0.

## Features
- Multi-worldview consultation (12 philosophical perspectives)
- Semantic value detection (50-value ontology)
- Domain-specific contextualization
- Conflict detection and resolution
- Transparent reasoning chains
- Epistemic humility

## Quick Start
[Installation and usage]

## Architecture
See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Integration
- **TagTeam v2.0.0**: Semantic analysis (Phase 2 complete)
- See [docs/integrations/](docs/integrations/)

## Testing
```bash
npm test  # Run all tests (108 tests, 100% passing)
```

## Documentation
- [Main Documentation](docs/)
- [Integration Guide](docs/Integration-Procedure.md)
- [Philosophy](docs/philosophy/)

## License
[Current license]
```

---

## 4. Source Code Organization

### New Files to Commit (Phase 2)
```bash
# Core integration
src/concepts/semanticAnalyzer.js       # NEW - TagTeam wrapper
src/concepts/valueMapper.js            # NEW - 50-value mapping

# Enhanced existing files
src/application/deliberationOrchestrator.js  # MODIFIED
src/concepts/moralReasoner.js               # MODIFIED
src/concepts/valueConflictResolver.js       # MODIFIED

# TagTeam bundle
collaborations/tagteam/dist/tagteam.js  # UPDATED to v2.0.0

# Tests
testing/frameworks/unit-tests/domain-detection.test.js     # NEW (25 tests)
testing/frameworks/unit-tests/value-matching.test.js       # NEW (16 tests)
testing/frameworks/unit-tests/conflict-detection.test.js   # NEW (25 tests)
testing/frameworks/integration-tests/full-deliberation-test.html  # MODIFIED
```

### Files Status
- **3 new core files**: semanticAnalyzer.js, valueMapper.js, docs
- **3 modified core files**: deliberationOrchestrator.js, moralReasoner.js, valueConflictResolver.js
- **3 new test files**: 66 new tests total
- **1 modified test file**: full-deliberation-test.html
- **1 updated bundle**: tagteam.js v2.0.0

---

## 5. Collaboration Folder Organization

### Current Structure
```
collaborations/tagteam/
├── communication/        # 34 files (needs cleanup)
├── data/                # Supporting data
├── deliverables/        # Week deliverables
├── dist/                # Production bundle
├── integration/         # Integration work
├── requirements/        # Requirements docs
├── README.md
├── WEEK2_FEEDBACK.md
└── WEEK2_PLANNING_SUMMARY.md
```

### Proposed Structure
```
collaborations/tagteam/
├── communication/
│   ├── README.md                         # Overview
│   ├── WEEK2B_FINAL_ACCEPTANCE.md       # Current state
│   ├── WEEK2B_COMPLETE.md
│   ├── WEEK2B_ARCHITECTURE.md           # Key references
│   ├── WEEK2B_IMPLEMENTATION_PLAN.md
│   ├── WEEK2B_API_MOCKUPS.md
│   ├── BUNDLE_VERIFICATION.md
│   ├── HOW_TO_VERIFY.md
│   ├── CHECKPOINT_2_STATUS.md
│   └── archive/
│       ├── week1/                        # Week 1 docs
│       └── week2/                        # Week 2 planning docs
├── data/                                 # Keep as-is
├── deliverables/                         # Keep as-is
├── dist/                                 # Production bundle
│   ├── tagteam.js                       # v2.0.0
│   └── README.md
├── integration/                          # Keep as-is
├── requirements/                         # Keep as-is
└── README.md                             # Project overview
```

---

## 6. Test Organization

### Current Test Files (30 total)
```
testing/frameworks/unit-tests/
├── application/
│   ├── deliberation-orchestrator.test.js
│   ├── deliberation-schemas.test.js
│   └── session-manager.test.js
├── comprehensive-scenarios.test.js
├── conflict-detection.test.js             # NEW - Phase 2
├── depth-spiritual-worldviews.test.js
├── domain-contextualization.test.js
├── domain-detection.test.js               # NEW - Phase 2
├── example.test.js
├── integration-procedures.test.js
├── moralReasoner.test.js
├── process-individual-worldviews.test.js
├── scenario-evaluation.test.js
├── storageConcept.test.js
├── temporal-tracking.test.js
├── value-mapper.test.js
├── value-matching.test.js                 # NEW - Phase 2
├── valuenet-integration.test.js
└── worldviewManager.test.js
```

### Action
✅ **No changes needed** - Test organization is clean

---

## 7. Git Ignore Review

### Check .gitignore
Current exclusions should include:
- `node_modules/`
- `.claude/` (user-specific)
- `build/`
- `.svelte-kit/`
- `*.log`

### Action
Review `.gitignore` to ensure:
- User-specific files excluded
- Build artifacts excluded
- Development files excluded
- **Include**: All Phase 2 source and tests

---

## 8. Commit Strategy

### Recommended Commit Sequence

#### Commit 1: Documentation Cleanup (Pre-integration)
```bash
# Archive old communication files
mkdir -p collaborations/tagteam/communication/archive/week{1,2}

# Move Week 1 docs to archive
git mv collaborations/tagteam/communication/WEEK1_*.md \
       collaborations/tagteam/communication/archive/week1/

# Move Week 2 planning docs to archive
git mv collaborations/tagteam/communication/WEEK2B_PLANNING_*.md \
       collaborations/tagteam/communication/archive/week2/
# ... (other planning docs)

# Remove duplicate versioned files
git rm collaborations/tagteam/communication/*-v2.md

# Commit
git commit -m "docs: organize TagTeam communication archives

- Archive Week 1 completed documentation
- Archive Week 2 planning documents
- Remove duplicate versioned files
- Prepare for Phase 2 integration commit"
```

#### Commit 2: Phase 2 Integration - Core
```bash
# Stage new core files
git add src/concepts/semanticAnalyzer.js
git add src/concepts/valueMapper.js

# Stage modified core files
git add src/application/deliberationOrchestrator.js
git add src/concepts/moralReasoner.js
git add src/concepts/valueConflictResolver.js

# Stage TagTeam bundle update
git add collaborations/tagteam/dist/tagteam.js

# Commit
git commit -m "feat: integrate TagTeam v2.0.0 semantic analysis (Phase 2)

Core Integration:
- Add semanticAnalyzer.js wrapper for TagTeam integration
- Add valueMapper.js for 50-value ontology mapping
- Enhance deliberationOrchestrator with semantic analysis pipeline
- Enhance moralReasoner with semantic value detection
- Enhance valueConflictResolver with TagTeam conflicts
- Update TagTeam bundle to v2.0.0

Features:
- Semantic value detection (50-value ontology)
- Domain detection enhancement
- Value matching with salience scoring
- Pre-computed conflict detection
- Graceful degradation (works with/without TagTeam)
- Full backward compatibility

Architecture:
- Augmentation pattern (TagTeam enhances, doesn't replace)
- Priority system (semantic > keyword)
- Source tracking (semantic_detection vs keyword_inference)
- Optional parameter threading

Closes: Phase 2 TagTeam Integration
See: docs/integrations/tagteam/phase2-completion.md"
```

#### Commit 3: Phase 2 Integration - Tests
```bash
# Stage new test files
git add testing/frameworks/unit-tests/domain-detection.test.js
git add testing/frameworks/unit-tests/value-matching.test.js
git add testing/frameworks/unit-tests/conflict-detection.test.js
git add testing/frameworks/integration-tests/full-deliberation-test.html

# Commit
git commit -m "test: add comprehensive Phase 2 integration tests

Test Coverage:
- Domain detection: 25 tests (TagTeam + fallback)
- Value matching: 16 tests (semantic + keyword)
- Conflict detection: 25 tests (value + judgment)
- Browser integration: Full deliberation pipeline

Total: 66 new tests, all passing (100%)
Overall: 108/108 tests passing

Features Tested:
- TagTeam semantic analysis integration
- Domain suggestion priority system
- Value detection and mapping
- Conflict detection (TagTeam + IEE)
- Graceful degradation
- With/without TagTeam comparison"
```

#### Commit 4: Documentation
```bash
# Stage documentation
git add docs/integrations/tagteam/
git add docs/README.md

# Stage project README
git add README.md  # New comprehensive README
git mv GITREADME.md archive/GITREADME_MERMAID.md  # Archive old

# Stage collaboration docs
git add collaborations/tagteam/communication/WEEK2B_COMPLETE.md
git add collaborations/tagteam/communication/WEEK2B_FINAL_ACCEPTANCE.md

# Commit
git commit -m "docs: add Phase 2 completion documentation

Integration Documentation:
- Add docs/integrations/tagteam/ section
- Add Phase 2 completion summary
- Add integration index and guides

Project Documentation:
- Update main README with current project description
- Archive old Mermaid IDE README
- Update docs index with integration section

Communication:
- Finalize Week 2B completion status
- Document final acceptance criteria

Status: Phase 2 complete, production ready"
```

#### Commit 5: Cleanup Settings (Optional)
```bash
# Only if .claude/settings.local.json should be committed
git add .claude/settings.local.json

git commit -m "chore: update Claude Code settings"
```

---

## 9. Pre-Commit Checklist

### Code Quality
- [ ] All tests passing (108/108) ✅ Already verified
- [ ] No console errors in browser test ✅ Already verified
- [ ] ESLint clean (if configured)
- [ ] No commented-out code in new files
- [ ] JSDoc comments complete ✅ Already done

### Documentation
- [ ] README.md reflects current project
- [ ] Integration docs complete
- [ ] CHANGELOG.md updated (if exists)
- [ ] API documentation current

### Git Hygiene
- [ ] .gitignore properly configured
- [ ] No sensitive data in commits
- [ ] No large binary files
- [ ] Commit messages descriptive

### File Organization
- [ ] Communication files archived
- [ ] Duplicate files removed
- [ ] Test files organized
- [ ] Documentation hierarchical

---

## 10. Post-Commit Actions

### After Committing to Main

#### 1. Tag Release
```bash
git tag -a v0.2.0-phase2 -m "TagTeam v2.0.0 Integration Complete

- Semantic value detection (50-value ontology)
- Domain detection enhancement
- Conflict detection with value conflicts
- 66 new tests (100% passing)
- Full backward compatibility
- Production ready"

git push origin v0.2.0-phase2
```

#### 2. Create GitHub Release
- Title: "Phase 2: TagTeam v2.0.0 Integration"
- Body: Summary from `docs/integrations/tagteam/phase2-completion.md`
- Attach: Any relevant artifacts

#### 3. Update Project Board
- Close Phase 2 integration tickets
- Update status to "Complete"
- Create Phase 3 planning tickets

#### 4. Notify Stakeholders
- Share completion summary
- Provide demo link (browser test)
- Share test results

---

## 11. Rollback Plan

### If Issues Arise After Merge

#### Quick Rollback
```bash
# Revert to previous state
git revert HEAD~4..HEAD  # Revert last 4 commits

# Or hard reset (if no one else pulled)
git reset --hard <commit-before-phase2>
git push --force origin main
```

#### Selective Revert
```bash
# Revert specific files
git checkout <previous-commit> -- src/concepts/semanticAnalyzer.js
git commit -m "revert: remove semanticAnalyzer temporarily"
```

---

## 12. File Actions Summary

### Files to Archive
```bash
collaborations/tagteam/communication/archive/week1/
├── WEEK1_ACCEPTANCE.md
└── WEEK1_VALIDATION_RESULTS.md

collaborations/tagteam/communication/archive/week2/
├── WEEK2_FEEDBACK.md
├── WEEK2_IEE_RESPONSE.md
├── WEEK2A_ACCEPTANCE.md
├── WEEK2A_COMPLETE.md
├── WEEK2A_IEE_RESPONSE.md
├── WEEK2B_KICKOFF.md
├── WEEK2B_PLANNING_SESSION_AGENDA.md
├── WEEK2B_PLANNING_SUMMARY.md
├── WEEK2B_PLANNING_RESPONSES.md
├── WEEK2B_TECHNICAL_QUESTIONS.md
├── WEEK2B_IEE_DECISIONS.md
└── WEEK2B_READY_TO_START.md
```

### Files to Delete
```bash
# Duplicate versioned files
collaborations/tagteam/communication/delivery-summary-v2.md
collaborations/tagteam/communication/questions-answered-v2.md
collaborations/tagteam/communication/testing-handoff-v2.md
```

### Files to Keep Active
```bash
collaborations/tagteam/communication/
├── README.md
├── WEEK2B_FINAL_ACCEPTANCE.md
├── WEEK2B_COMPLETE.md
├── WEEK2B_ARCHITECTURE.md
├── WEEK2B_IMPLEMENTATION_PLAN.md
├── WEEK2B_API_MOCKUPS.md
├── WEEK2B_FINAL_ALIGNMENT.md
├── BUNDLE_VERIFICATION.md
├── HOW_TO_VERIFY.md
├── CHECKPOINT_1_STATUS.md
├── CHECKPOINT_1_IEE_REVIEW.md
└── CHECKPOINT_2_STATUS.md
```

### Files to Create
```bash
# New project README
README.md

# Integration documentation
docs/integrations/tagteam/README.md
docs/integrations/tagteam/phase2-completion.md  # (move from docs/)
```

### Files to Move
```bash
# Archive old README
GITREADME.md → archive/GITREADME_MERMAID.md

# Organize integration docs
docs/tagteam-integration-phase2-complete.md →
  docs/integrations/tagteam/phase2-completion.md
```

---

## 13. Estimated Time

### Cleanup Tasks
- Archive communication files: **15 min**
- Delete duplicates: **5 min**
- Create new README: **30 min**
- Create integration docs section: **20 min**
- Update docs/README.md: **10 min**
- Review .gitignore: **5 min**

### Commit Tasks
- Prepare commit messages: **15 min**
- Stage and commit (4 commits): **20 min**
- Create tag and release: **15 min**
- Post-commit verification: **10 min**

**Total Estimated Time**: ~2.5 hours

---

## 14. Risk Assessment

### Low Risk
- ✅ All tests passing
- ✅ Backward compatible
- ✅ No breaking changes
- ✅ Graceful degradation

### Medium Risk
- ⚠️ Large number of files (46) - Review carefully
- ⚠️ Documentation reorganization - Ensure links work
- ⚠️ README replacement - Archive old content

### Mitigation
- Review each commit before pushing
- Test browser integration after each commit
- Keep feature branch as backup
- Tag commits for easy rollback

---

## 15. Success Criteria

### Pre-Merge
- [ ] All 108 tests passing
- [ ] Browser integration test working
- [ ] No lint errors
- [ ] Documentation complete
- [ ] Communication files organized
- [ ] Commit messages descriptive

### Post-Merge
- [ ] CI/CD passing (if configured)
- [ ] Browser test accessible
- [ ] Documentation links working
- [ ] No reported issues within 24h
- [ ] Stakeholders notified

---

## Next Steps

1. **Review this plan** - Get approval on approach
2. **Execute cleanup** - Archive, delete, organize
3. **Create new docs** - README, integration guides
4. **Execute commits** - Follow 4-commit strategy
5. **Tag release** - v0.2.0-phase2
6. **Verify** - All tests, docs, browser test
7. **Notify** - Stakeholders, update boards

---

**Status**: Ready for execution pending approval
**Prepared by**: Claude Code
**Review required**: Yes
**Estimated effort**: 2.5 hours
