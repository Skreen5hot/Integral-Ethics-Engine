# Hybrid Judgment Integration - Implementation Plan

**Version**: 1.0.0
**Status**: Planning
**Owner**: Development Team
**Created**: 2026-01-18
**Target Completion**: TBD

---

## Executive Summary

### Project Overview
Implement the scientifically-grounded hybrid judgment integration approach as detailed in [hybrid_jusdgemtn_integration.md](../philosophy/hybrid_jusdgemtn_integration.md). This approach preserves categorical distinctions between judgment types while incorporating vector-inspired confidence scaling and contested judgment detection.

### Goals and Objectives
1. **Replace naive weighted averaging** with categorical winner-takes-all scoring among definitive judgments
2. **Implement contested detection** to flag narrow margins (< 15%) and reduce confidence appropriately
3. **Separate uncertainty from disagreement** by excluding "uncertain" judgments from voting
4. **Expose rich metadata** including margin, secondPlace, isContested, and participation quorum
5. **Maintain backward compatibility** with existing UI components and test suites

### Success Criteria
- ✅ Narrow splits (51/49) flagged as "contested" with reduced confidence
- ✅ "Problematic" judgments treated as definitive opinions, not uncertainty
- ✅ Uncertain worldviews excluded from voting but tracked for quorum calculation
- ✅ All existing test scenarios produce more accurate, nuanced results
- ✅ UI displays contested status, margin, and second-place judgment
- ✅ No regressions in existing functionality

---

## Implementation Phases

### Phase 1: Core Integration Logic Enhancement
**Duration**: 2-3 days
**Priority**: CRITICAL
**Dependencies**: None

#### Objectives
Modify `valueConflictResolver.js` to implement the hybrid approach as specified in Section X of the philosophy document.

#### Tasks
1. **Separate Definitive from Uncertain Judgments**
   - Update `integrateJudgments()` to categorize evaluations
   - Definitive: ['permissible', 'impermissible', 'problematic', 'obligatory']
   - Uncertain: ['uncertain']
   - Track both lists separately

2. **Implement Categorical Scoring**
   - Calculate weighted scores ONLY among definitive judgments
   - Use winner-takes-all approach
   - Preserve categorical distinctions (no averaging)

3. **Add Margin Calculation**
   - Track top two judgment scores
   - Calculate margin: `(maxScore - secondMaxScore) / totalDefinitiveWeight`
   - Identify second-place judgment for metadata

4. **Implement Hybrid Confidence Formula**
   ```javascript
   const agreement = maxScore / totalDefinitiveWeight;
   const quorum = Math.sqrt(totalDefinitiveWeight / totalWeight);
   const contestationFactor = isContested ? 0.7 : 1.0;
   confidence = agreement * quorum * contestationFactor;
   ```

#### Acceptance Criteria
- [ ] Code matches Section X implementation from philosophy document
- [ ] Function signature remains `integrateJudgments(evaluations, weights)` for backward compatibility
- [ ] Returns extended metadata: `{ judgment, confidence, margin, isContested, secondPlace, ... }`
- [ ] Unit tests pass for all existing scenarios
- [ ] New unit tests verify categorical scoring behavior
- [ ] "Uncertain" judgments excluded from weighted voting
- [ ] Confidence reduced by sqrt(quorum) when many worldviews uncertain

---

### Phase 2: Contested Detection Implementation
**Duration**: 1-2 days
**Priority**: HIGH
**Dependencies**: Phase 1

#### Objectives
Implement contested judgment detection to flag narrow margins and apply confidence penalty.

#### Tasks
1. **Add Contestation Threshold**
   - Define threshold: 15% margin
   - Make configurable via options parameter
   - Document rationale in code comments

2. **Calculate Contested Flag**
   ```javascript
   const isContested = margin < 0.15;
   ```

3. **Apply Contestation Penalty**
   - 30% confidence reduction (factor of 0.7) when contested
   - Preserve margin value for transparency

4. **Add Metadata Fields**
   - `isContested`: boolean
   - `margin`: number (0-1)
   - `secondPlace`: string (judgment name)
   - `contestationPenalty`: number (0.7 or 1.0)

#### Acceptance Criteria
- [ ] 51/49 splits flagged as contested
- [ ] 60/40 splits NOT flagged as contested
- [ ] Contested judgments have confidence multiplied by 0.7
- [ ] Metadata includes all four new fields
- [ ] Unit tests verify threshold behavior at boundary conditions (14.9%, 15.0%, 15.1%)
- [ ] Documentation explains "Crisis not Victory" philosophy

---

### Phase 3: Metadata Exposure and Validation
**Duration**: 1 day
**Priority**: MEDIUM
**Dependencies**: Phase 2

#### Objectives
Ensure all metadata flows correctly through deliberationOrchestrator to UI layer.

#### Tasks
1. **Update deliberationOrchestrator.js**
   - Verify `formatDeliberationResult()` passes through new metadata
   - Add fields to result object:
     - `margin`
     - `isContested`
     - `secondPlace`
     - `quorum`
     - `contestationPenalty`

2. **Update Schema Validation**
   - Modify `deliberation-schemas.js` to include new fields
   - Make fields optional for backward compatibility
   - Add JSDoc type annotations

3. **Add Logging for Debugging**
   - Log margin and contestation status in deliberationOrchestrator events
   - Emit 'contestedJudgment' event when isContested = true

#### Acceptance Criteria
- [ ] New metadata fields present in final deliberation result
- [ ] Schema validation accepts new fields
- [ ] Backward compatibility: old results without new fields still validate
- [ ] Console logs show contestation warnings when appropriate
- [ ] Events emitted for contested judgments

---

### Phase 4: UI Integration
**Duration**: 2-3 days
**Priority**: MEDIUM
**Dependencies**: Phase 3

#### Objectives
Update UI components to display contested status, margin, and second-place judgment.

#### Tasks
1. **Update ResultCard.svelte**
   - Add "Contested" badge when `isContested = true`
   - Display margin as percentage
   - Show second-place judgment: "Second: Impermissible (42%)"
   - Visual indicator for contested status (warning icon, orange border)

2. **Update ConflictResolutionCard.svelte**
   - Add metadata section showing:
     - Margin: X%
     - Quorum: Y%
     - Contestation penalty applied: Yes/No
   - Explanation tooltip for contested judgments

3. **Update ConflictMap.svelte (D3 Visualization)**
   - Color-code contested judgments (e.g., orange stroke)
   - Add visual indicator for second-place cluster
   - Tooltip shows margin on hover

4. **Add User Education**
   - Tooltip explaining what "contested" means
   - Link to philosophy document for full explanation
   - Clear messaging: "This is a close call, not a clear answer"

#### Acceptance Criteria
- [ ] Contested judgments visually distinct in UI
- [ ] Margin displayed as percentage
- [ ] Second-place judgment shown with score
- [ ] Tooltips explain contested status
- [ ] D3 visualization distinguishes contested from clear judgments
- [ ] User testing confirms clarity of new information
- [ ] No visual regression on existing scenarios

---

### Phase 5: Testing & Validation
**Duration**: 2-3 days
**Priority**: HIGH
**Dependencies**: Phases 1-4

#### Objectives
Comprehensive testing to validate the hybrid approach produces more accurate, nuanced results.

#### Tasks
1. **Create Validation Scenarios**
   - **Scenario A: Clear Consensus**
     - 10 permissible, 2 uncertain
     - Expected: Permissible, high confidence, not contested

   - **Scenario B: Narrow Split**
     - 6 permissible, 5 impermissible, 1 uncertain
     - Expected: Permissible, medium confidence, CONTESTED

   - **Scenario C: Problematic Recognition**
     - 8 problematic, 4 uncertain
     - Expected: Problematic, high confidence, not contested

   - **Scenario D: High Uncertainty**
     - 3 permissible, 9 uncertain
     - Expected: Permissible, LOW confidence (quorum penalty), not contested

   - **Scenario E: Three-Way Split**
     - 4 permissible, 4 impermissible, 4 problematic
     - Expected: One wins, CONTESTED, low confidence

2. **Write Unit Tests**
   - Test categorical scoring logic
   - Test margin calculation
   - Test contestation detection
   - Test confidence formula components
   - Test quorum penalty
   - Test edge cases (all uncertain, single definitive, etc.)

3. **Write Integration Tests**
   - Full deliberation flow with real scenarios
   - Verify metadata propagates correctly
   - Test UI rendering of contested judgments

4. **Regression Testing**
   - Run existing test suite
   - Verify no breaking changes
   - Compare old vs new results for improvement

5. **User Acceptance Testing**
   - Present 5 scenarios to ethics experts
   - Collect feedback on contested flagging accuracy
   - Validate that results "feel right" to domain experts

#### Acceptance Criteria
- [ ] All 5 validation scenarios produce expected results
- [ ] Unit test coverage > 90% for new code
- [ ] All existing tests pass
- [ ] Integration tests verify end-to-end flow
- [ ] No regressions identified
- [ ] Ethics experts validate approach improves over naive averaging
- [ ] Documentation includes test scenario explanations

---

## Technical Requirements

### Code Changes

#### Files to Modify
1. **src/concepts/valueConflictResolver.js** (CRITICAL)
   - Replace `integrateJudgments()` function
   - ~100 lines of changes
   - Breaking changes: return value includes new metadata

2. **src/application/deliberationOrchestrator.js** (MEDIUM)
   - Update `formatDeliberationResult()` to pass metadata
   - ~20 lines of changes
   - Non-breaking: adds optional fields

3. **src/application/schemas/deliberation-schemas.js** (LOW)
   - Add new optional fields to schema
   - ~10 lines of changes
   - Non-breaking: fields are optional

4. **src/lib/components/ResultCard.svelte** (MEDIUM)
   - Add contested badge and margin display
   - ~50 lines of changes
   - Visual changes only

5. **src/lib/components/ConflictResolutionCard.svelte** (LOW)
   - Add metadata section
   - ~30 lines of changes
   - Visual changes only

6. **src/lib/components/ConflictMap.svelte** (MEDIUM)
   - Add contested visual indicators
   - ~40 lines of changes
   - Visual changes only

#### New Files
1. **tests/unit/valueConflictResolver.hybrid.test.js**
   - Comprehensive unit tests for hybrid approach
   - ~300 lines

2. **tests/integration/hybrid-deliberation.test.js**
   - End-to-end tests for hybrid integration
   - ~200 lines

3. **docs/architecture/contested-judgment-design.md**
   - Design document explaining contestation detection
   - Reference to philosophy document

### Dependencies
- No new npm packages required
- Uses existing Math.sqrt() for quorum calculation
- Compatible with current Svelte 5 + Vite setup

### Breaking Changes
**None** - All changes are backward compatible:
- New metadata fields are optional
- Function signatures unchanged
- Existing test scenarios will receive enhanced results
- UI gracefully handles missing metadata (old results)

---

## Testing Strategy

### Unit Tests
**Location**: `tests/unit/`

1. **Categorical Scoring Tests**
   ```javascript
   test('definitive judgments use winner-takes-all, not averaging', () => {
     const evaluations = [
       { judgment: 'permissible', worldview: 'materialism' },
       { judgment: 'permissible', worldview: 'realism' },
       { judgment: 'impermissible', worldview: 'idealism' }
     ];
     const result = integrateJudgments(evaluations, defaultWeights);
     expect(result.judgment).toBe('permissible'); // Winner
     expect(result.confidence).toBeGreaterThan(0.5); // Not averaged to neutral
   });
   ```

2. **Contestation Detection Tests**
   ```javascript
   test('51/49 split flagged as contested', () => {
     // Setup: 6 permissible (weight 0.51), 5 impermissible (weight 0.49)
     const result = integrateJudgments(evaluations, weights);
     expect(result.isContested).toBe(true);
     expect(result.margin).toBeLessThan(0.15);
   });
   ```

3. **Quorum Penalty Tests**
   ```javascript
   test('high uncertainty reduces confidence via quorum', () => {
     // 3 definitive, 9 uncertain
     const result = integrateJudgments(evaluations, defaultWeights);
     const expectedQuorum = Math.sqrt(3/12); // ~0.5
     expect(result.confidence).toBeLessThan(0.6); // Penalized
   });
   ```

4. **Problematic as Definitive Tests**
   ```javascript
   test('problematic judgments count as definitive, not uncertain', () => {
     const evaluations = [
       { judgment: 'problematic', worldview: 'materialism' },
       { judgment: 'problematic', worldview: 'idealism' },
       { judgment: 'uncertain', worldview: 'realism' }
     ];
     const result = integrateJudgments(evaluations, defaultWeights);
     expect(result.judgment).toBe('problematic');
     // Uncertain worldview excluded from voting
   });
   ```

### Integration Tests
**Location**: `tests/integration/`

1. **Full Deliberation Flow**
   - Submit scenario with known judgment distribution
   - Verify deliberationOrchestrator returns correct metadata
   - Check that TagTeam integration doesn't break hybrid logic

2. **UI Rendering Tests**
   - Mock deliberation result with contested=true
   - Verify ResultCard displays contested badge
   - Verify ConflictMap shows visual indicator

### Validation Scenarios
**Location**: `tests/validation/hybrid-scenarios.json`

Pre-defined scenarios with expected outcomes:

```json
{
  "clearConsensus": {
    "description": "Patient requests life-saving treatment",
    "expectedJudgment": "permissible",
    "expectedContested": false,
    "minConfidence": 0.8
  },
  "narrowSplit": {
    "description": "Physician-assisted suicide in terminal illness",
    "expectedJudgment": "problematic OR contested",
    "expectedContested": true,
    "maxConfidence": 0.7
  }
}
```

### Regression Testing
- Run full test suite (`npm test`)
- Compare results before/after implementation
- Document any scenarios where results change significantly
- Validate that changes represent improvements, not degradations

---

## Rollout Plan

### Pre-Deployment
1. **Code Review**
   - Two-person review of valueConflictResolver.js changes
   - Focus on logic correctness and edge case handling

2. **Documentation Review**
   - Ensure inline comments explain hybrid approach
   - Link to philosophy document in code comments
   - Update README with contestation detection explanation

3. **Stakeholder Sign-Off**
   - Present validation results to ethics advisors
   - Demonstrate contested judgment detection with examples
   - Get approval from project lead

### Deployment Strategy
**Approach**: Feature flag with gradual rollout

1. **Stage 1: Internal Testing (Week 1)**
   - Deploy to development environment
   - Team uses application with hybrid approach
   - Collect feedback on contested flagging accuracy

2. **Stage 2: Beta Testing (Week 2)**
   - Deploy to staging environment
   - Invite ethics experts to test with real scenarios
   - Monitor for unexpected results

3. **Stage 3: Production Rollout (Week 3)**
   - Deploy to production
   - Monitor error rates and user feedback
   - Keep old integration logic as fallback (feature flag)

4. **Stage 4: Cleanup (Week 4)**
   - Remove old integration logic if no issues
   - Remove feature flag
   - Mark hybrid approach as stable

### Monitoring Approach
1. **Metrics to Track**
   - Percentage of judgments flagged as contested
   - Average confidence scores (before vs after)
   - User engagement with contested judgment explanations
   - Error rates in valueConflictResolver

2. **Alerts**
   - Error rate > 1% in integration logic
   - > 50% of judgments contested (indicates threshold may be wrong)
   - Confidence scores all below 0.3 (indicates formula issue)

3. **Logging**
   - Log all contested judgments with margin and scores
   - Log quorum penalty when > 50% uncertain
   - Log unexpected edge cases (all uncertain, single judgment, etc.)

### Rollback Procedures
**Trigger Conditions**:
- Error rate > 5% in integration logic
- Ethics experts flag incorrect contested detection
- Confidence scores produce nonsensical results

**Rollback Steps**:
1. Set feature flag to use old integration logic
2. Deploy immediately (no review required)
3. Investigate root cause in development environment
4. Fix issue and restart rollout plan

**Rollback Time**: < 5 minutes (feature flag toggle)

---

## Risk Assessment

### High Risk
1. **Contested Threshold Too Sensitive**
   - **Risk**: 15% threshold flags too many judgments as contested
   - **Mitigation**: Make threshold configurable, monitor percentage in production
   - **Fallback**: Adjust threshold to 10% or 20% based on data

2. **Confidence Formula Edge Cases**
   - **Risk**: Edge cases (all uncertain, single judgment) produce NaN or Infinity
   - **Mitigation**: Comprehensive unit tests for edge cases
   - **Fallback**: Clamp confidence to [0, 1] range

### Medium Risk
1. **Performance Degradation**
   - **Risk**: Additional calculations slow down deliberation
   - **Mitigation**: Profile code, optimize if necessary
   - **Fallback**: Cache intermediate calculations

2. **UI Overwhelm**
   - **Risk**: Too much metadata confuses users
   - **Mitigation**: User testing, progressive disclosure (tooltips)
   - **Fallback**: Hide advanced metadata by default

### Low Risk
1. **Backward Compatibility**
   - **Risk**: Old results break new UI
   - **Mitigation**: Optional metadata fields, graceful handling of undefined
   - **Fallback**: None needed (already mitigated)

---

## Success Metrics

### Quantitative Metrics
1. **Accuracy Improvement**
   - Validation scenarios produce expected results: **100%**
   - Ethics experts rate results as "more accurate": **> 80%**

2. **Contested Detection**
   - Narrow splits (< 15% margin) flagged: **100%**
   - False positive rate (clear wins flagged): **< 5%**

3. **Confidence Calibration**
   - High uncertainty (> 50%) reduces confidence: **✓**
   - Contested judgments have confidence < 0.7: **✓**
   - Clear consensus has confidence > 0.8: **✓**

4. **Performance**
   - Deliberation time increase: **< 10%**
   - Integration logic time: **< 50ms per scenario**

### Qualitative Metrics
1. **User Feedback**
   - Ethics experts understand contested status: **> 90%**
   - Users find metadata helpful: **> 75%**
   - No complaints about confusing results: **✓**

2. **Code Quality**
   - Code review approvals: **2/2**
   - Test coverage: **> 90%**
   - Documentation completeness: **100%**

---

## Timeline Estimate

| Phase | Duration | Dependencies | Deliverables |
|-------|----------|--------------|--------------|
| Phase 1: Core Logic | 2-3 days | None | Updated valueConflictResolver.js, unit tests |
| Phase 2: Contested Detection | 1-2 days | Phase 1 | Contestation logic, metadata fields |
| Phase 3: Metadata Exposure | 1 day | Phase 2 | Schema updates, orchestrator changes |
| Phase 4: UI Integration | 2-3 days | Phase 3 | Updated UI components, visual indicators |
| Phase 5: Testing & Validation | 2-3 days | Phases 1-4 | Test suite, validation report |
| **Total** | **8-12 days** | - | Production-ready hybrid integration |

### Critical Path
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5

All phases must be completed sequentially. Phase 4 (UI) and Phase 5 (Testing) can partially overlap.

---

## Acceptance Criteria Summary

### Overall Project Acceptance
Project is complete when ALL of the following are true:

1. ✅ **Functional Requirements**
   - [ ] Narrow splits (< 15% margin) flagged as contested
   - [ ] Contested judgments have 30% confidence reduction
   - [ ] "Problematic" treated as definitive judgment
   - [ ] "Uncertain" excluded from voting
   - [ ] Quorum penalty applied when many worldviews uncertain
   - [ ] Metadata includes: margin, isContested, secondPlace, quorum

2. ✅ **Testing Requirements**
   - [ ] All 5 validation scenarios pass
   - [ ] Unit test coverage > 90%
   - [ ] Integration tests pass
   - [ ] No regressions in existing tests
   - [ ] Ethics experts validate results

3. ✅ **UI Requirements**
   - [ ] Contested badge displayed when appropriate
   - [ ] Margin shown as percentage
   - [ ] Second-place judgment displayed
   - [ ] Tooltips explain contested status
   - [ ] D3 visualization distinguishes contested judgments

4. ✅ **Documentation Requirements**
   - [ ] Inline code comments reference philosophy document
   - [ ] README updated with contested detection explanation
   - [ ] Architecture document created
   - [ ] Test scenarios documented

5. ✅ **Non-Functional Requirements**
   - [ ] Performance impact < 10%
   - [ ] Backward compatibility maintained
   - [ ] No breaking changes
   - [ ] Rollback plan tested

---

## Appendix

### References
1. [Hybrid Judgment Integration Philosophy](../philosophy/hybrid_jusdgemtn_integration.md)
2. [Current valueConflictResolver.js](../../src/concepts/valueConflictResolver.js)
3. [Delphi Method Research](https://doi.org/10.1016/0040-1625(75)90040-X)
4. [Greene et al. Cognitive Science](https://doi.org/10.1016/j.neuron.2009.09.008)

### Key Formulas
```javascript
// Hybrid Confidence Formula
confidence = agreement × √quorum × contestationPenalty

// Where:
agreement = maxScore / totalDefinitiveWeight
quorum = √(totalDefinitiveWeight / totalWeight)
contestationPenalty = isContested ? 0.7 : 1.0

// Margin Calculation
margin = (maxScore - secondMaxScore) / totalDefinitiveWeight

// Contestation Detection
isContested = margin < 0.15
```

### Contact Information
- **Project Lead**: TBD
- **Technical Lead**: TBD
- **Ethics Advisor**: TBD

---

**Document Status**: Draft v1.0
**Next Review**: After Phase 1 completion
**Approval Required From**: Project Lead, Ethics Advisor
