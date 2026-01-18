# TagTeam Integration Documentation

## Overview

TagTeam v2.0.0 semantic analysis integration with the Integral Ethics Engine deliberation pipeline.

## Status

- **Phase 2**: Complete ✅
- **Version**: TagTeam v2.0.0
- **Integration Date**: 2026-01-18
- **Tests**: 108/108 passing (100%)
- **Production Ready**: Yes

## Key Documents

### Completion & Status
- [Phase 2 Completion Summary](./phase2-completion.md) - Complete integration documentation
- [Final Acceptance](../../../collaborations/tagteam/communication/WEEK2B_FINAL_ACCEPTANCE.md) - Acceptance criteria met
- [Week 2B Complete](../../../collaborations/tagteam/communication/WEEK2B_COMPLETE.md) - Delivery status

### Technical Reference
- [Architecture Decisions](../../../collaborations/tagteam/communication/WEEK2B_ARCHITECTURE.md) - Design decisions
- [Implementation Plan](../../../collaborations/tagteam/communication/WEEK2B_IMPLEMENTATION_PLAN.md) - Implementation guide
- [API Reference](../../../collaborations/tagteam/communication/WEEK2B_API_MOCKUPS.md) - API documentation

### Verification
- [How to Verify](../../../collaborations/tagteam/communication/HOW_TO_VERIFY.md) - Verification guide
- [Bundle Verification](../../../collaborations/tagteam/communication/BUNDLE_VERIFICATION.md) - Bundle validation

## Integration Points

### 1. Domain Detection Enhancement
- **File**: [src/application/deliberationOrchestrator.js](../../../src/application/deliberationOrchestrator.js)
- **Tests**: 25/25 passing
- **Features**: TagTeam domain suggestion with fallback to keyword detection

### 2. Value Matching Enhancement
- **File**: [src/concepts/moralReasoner.js](../../../src/concepts/moralReasoner.js)
- **Tests**: 16/16 passing
- **Features**: Semantic value detection (50-value ontology) with worldview mapping

### 3. Conflict Detection Enhancement
- **File**: [src/concepts/valueConflictResolver.js](../../../src/concepts/valueConflictResolver.js)
- **Tests**: 25/25 passing
- **Features**: Pre-computed value conflicts + worldview judgment conflicts

### 4. Semantic Analyzer Wrapper
- **File**: [src/concepts/semanticAnalyzer.js](../../../src/concepts/semanticAnalyzer.js) (NEW)
- **Features**: TagTeam wrapper with error handling and graceful degradation

### 5. Value Mapper
- **File**: [src/concepts/valueMapper.js](../../../src/concepts/valueMapper.js) (NEW)
- **Features**: 50-value ontology mapping to worldview values

## Technical Components

### TagTeam Bundle
- **Location**: [collaborations/tagteam/dist/tagteam.js](../../../collaborations/tagteam/dist/)
- **Version**: 2.0.0
- **Format**: UMD (browser + Node.js)

### Integration Tests
- **Unit Tests**: [testing/frameworks/unit-tests/](../../../testing/frameworks/unit-tests/)
  - domain-detection.test.js
  - value-matching.test.js
  - conflict-detection.test.js
- **Integration Test**: [full-deliberation-test.html](../../../testing/frameworks/integration-tests/full-deliberation-test.html)

## Usage

### Basic Deliberation (Automatic)
```javascript
import { deliberationOrchestrator } from './src/application/deliberationOrchestrator.js';

const result = await deliberationOrchestrator.actions.deliberateOnScenario({
  description: "A doctor provides treatment to alleviate patient suffering."
});

// Semantic analysis runs automatically
console.log(result.semanticAnalysis.detectedValues);
```

### Disable Semantic Analysis
```javascript
const result = await deliberationOrchestrator.actions.deliberateOnScenario(
  scenario,
  { useSemanticAnalysis: false }
);
```

### Manual Semantic Analysis
```javascript
import { semanticAnalyzer } from './src/concepts/semanticAnalyzer.js';

const analysis = await semanticAnalyzer.actions.analyzeScenario(
  "A doctor provides treatment...",
  { confidenceThreshold: 0.5 }
);
```

## Architecture

### Augmentation Pattern
TagTeam **enhances** existing IEE logic without replacing it:

```
Priority System:
- TagTeam semantic detection > IEE keyword inference
- TagTeam value conflicts + IEE judgment conflicts (both included)
- TagTeam domain suggestion > keyword detection > default
```

### Graceful Degradation
- System works with or without TagTeam
- `null` tagteamResult triggers fallback to IEE-only logic
- No errors if TagTeam unavailable

## Performance

- **Semantic Analysis**: ~12-15ms per scenario
- **Full Deliberation**: ~50-70ms (with semantic analysis)
- **Memory**: Minimal overhead
- **Graceful**: Zero overhead when TagTeam unavailable

## Communication Archive

Historical communication documents are archived in:
- `collaborations/tagteam/communication/archive/week1/` - Week 1 documentation
- `collaborations/tagteam/communication/archive/week2/` - Week 2 planning documents

## Next Steps

Phase 2 integration is complete. Future enhancements may include:
- Context intensity integration
- Multi-agent scenarios
- Temporal tracking with semantic roles
- Custom value ontologies

## Support

For questions about the TagTeam integration, see:
- [Phase 2 Completion Summary](./phase2-completion.md)
- [Architecture Decisions](../../../collaborations/tagteam/communication/WEEK2B_ARCHITECTURE.md)
- [Implementation Plan](../../../collaborations/tagteam/communication/WEEK2B_IMPLEMENTATION_PLAN.md)

---

**Last Updated**: 2026-01-18
**Status**: Production Ready ✅
