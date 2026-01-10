# TagTeam Semantic Parser Integration

Workspace for collaboration between IEE and TagTeam on NLP semantic role labeling.

## Project Overview

**TagTeam** is a deterministic JavaScript semantic parser that extracts agent-action-patient structures from natural language ethical scenarios. This integration enables automated semantic analysis for the Integral Ethics Engine's deliberation process.

## Directory Structure

```
tagteam/
├── deliverables/          # Work products received from TagTeam
│   └── week1/            # Week 1 semantic parser + test results
├── requirements/          # Specifications and requirements from IEE
├── communication/         # Correspondence and status updates
├── data/                 # Shared data artifacts
│   ├── compound-terms.json         # 150 multi-word entities
│   ├── test-corpus-week1.json      # 5 annotated test scenarios
│   └── value-definitions-core.json # 20 core values
├── dist/                 # Distributable bundles
│   ├── tagteam.js                  # 4.15MB single-file bundle
│   ├── test-iee-bundle.html        # One-click validation
│   └── simple-test.cjs             # Node.js test runner
└── integration/          # IEE integration code
    └── tagteam-validator.js        # Validation suite
```

## Current Status

**Phase:** Week 1 Validation Complete
**Pass Rate:** 63.2% (12/19 checks)
**Target:** ≥75% for Week 1 acceptance
**Status:** ⚠️ Fixes needed before acceptance

### Key Issues Identified
1. Progressive aspect handling ("am questioning" → extracts "am" instead of "questioning")
2. Frame mapping incomplete (Questioning, Becoming_aware, Offenses → Generic_action)
3. Lemmatization needs work ("discovered" → should be "discover")

See [communication/TAGTEAM_VALIDATION_RESULTS.md](communication/TAGTEAM_VALIDATION_RESULTS.md) for detailed analysis.

## Quick Links

**Latest Communication:**
- [TAGTEAM_VALIDATION_RESULTS.md](communication/TAGTEAM_VALIDATION_RESULTS.md) - Week 1 validation results
- [testing-handoff.md](communication/testing-handoff.md) - Testing handoff document
- [questions-answered.md](communication/questions-answered.md) - Q&A with TagTeam

**Requirements:**
- [integration-requirements.md](requirements/integration-requirements.md) - Integration specifications
- [test-build-plan.md](requirements/test-build-plan.md) - Test and build requirements

**Data Artifacts:**
- [data/compound-terms.json](data/compound-terms.json) - 150 multi-word entities
- [data/test-corpus-week1.json](data/test-corpus-week1.json) - 5 annotated scenarios
- [data/value-definitions-core.json](data/value-definitions-core.json) - 20 core values

**Deliverables:**
- [deliverables/week1/](deliverables/week1/) - Week 1 semantic parser bundle
- [dist/tagteam.js](dist/tagteam.js) - Single-file distributable (4.15MB)

## Running Validation Tests

### Browser Test (Easiest)
1. Open `dist/test-iee-bundle.html` in browser
2. Click "▶️ Run All Tests"
3. Review pass/fail results

### Node.js Test
```bash
cd dist/
node simple-test.cjs
```

Expected output: Pass rate percentage and detailed results

## Integration Timeline

### Week 1 (Jan 10-17, 2026)
- ✅ IEE delivers test corpus, compound terms, validator
- ✅ TagTeam delivers single-file bundle
- ✅ IEE runs validation (63.2% pass rate)
- ⏳ TagTeam fixes critical issues
- ⏳ IEE re-validates (target ≥75%)

### Week 2 (Jan 20-24, 2026)
- Context intensity analysis (12 dimensions)
- Value matching engine (20 core values)
- Expand to 20 test scenarios

### Week 3 (Jan 27-31, 2026)
- Conflict detection
- Salience scoring
- Expand to 50 test scenarios

## TagTeam API Usage

### Basic Parsing
```javascript
// Load bundle
<script src="dist/tagteam.js"></script>

// Parse sentence
const result = TagTeam.parse("The family must decide whether to continue treatment");

// Access roles
console.log(result.agent);      // { text: "family", entity: "family" }
console.log(result.action);     // { verb: "decide", modality: "must" }
console.log(result.semanticFrame); // "Deciding"
```

### Batch Parsing
```javascript
const results = TagTeam.parseMany([
  "I love my best friend",
  "The doctor recommended treatment"
]);
```

See [dist/README.md](dist/README.md) for complete API documentation.

## Contact & Communication

**Handoff Method:** Asynchronous via shared directory structure
- IEE places requirements/questions in `requirements/` and `communication/`
- TagTeam places deliverables in `deliverables/` and `dist/`
- Both teams update communication docs with status

**Next Action Items:**
1. TagTeam: Fix progressive aspect handling + frame mappings
2. TagTeam: Re-deliver updated bundle in `dist/`
3. IEE: Re-run validation tests
4. Both: Proceed to Week 2 if ≥75% pass rate achieved

## Archive

This collaboration workspace will be preserved as-is for:
- Future reference
- Handoff documentation patterns
- Validation methodology examples
