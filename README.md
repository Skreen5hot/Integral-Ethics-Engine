# Integral Ethics Engine (IEE)

A multi-worldview moral deliberation system that integrates semantic analysis for comprehensive ethical reasoning across diverse philosophical perspectives.

## Overview

The Integral Ethics Engine provides transparent, multi-perspective moral deliberation by consulting 12 philosophical worldviews and integrating semantic analysis from TagTeam v2.0.0. The system helps users explore complex ethical scenarios through systematic integration of diverse moral frameworks.

## Key Features

- **Multi-Worldview Consultation**: Evaluates scenarios through 12 distinct philosophical perspectives
- **Semantic Value Detection**: Automatic detection of 50 ethical values using TagTeam v2.0.0
- **Domain-Specific Contextualization**: Adapts reasoning to 7 life domains
- **Conflict Detection**: Identifies both value conflicts (TagTeam) and worldview judgment conflicts (IEE)
- **Transparent Reasoning**: Complete justification chains showing how judgments were reached
- **Epistemic Humility**: Acknowledges limitations and preserves minority perspectives
- **Graceful Degradation**: Works with or without semantic analysis

## Quick Start

### Installation

```bash
git clone https://github.com/yourusername/integral-ethics-engine.git
cd integral-ethics-engine
npm install
```

### Running Tests

```bash
npm test  # Run all 108 tests
```

### Browser Integration Test

```bash
npx http-server -p 8080
# Open: http://localhost:8080/testing/frameworks/integration-tests/full-deliberation-test.html
```

## Documentation

- [Main Documentation](docs/) - Comprehensive documentation
- [Architecture Guide](docs/ARCHITECTURE.md) - System architecture
- [TagTeam Integration](docs/integrations/tagteam/) - Phase 2 semantic analysis
- [Philosophy](docs/philosophy/) - Philosophical foundations

## Test Coverage

**Total**: 108 tests (100% passing)
- Domain detection: 25 tests
- Value matching: 16 tests
- Conflict detection: 25 tests
- Full integration suite

## TagTeam Integration (Phase 2 Complete) ✅

**Version**: TagTeam v2.0.0
**Status**: Production ready
**Completion**: 2026-01-18

See [Phase 2 Completion](docs/integrations/tagteam/phase2-completion.md)

## License

See [LICENSE](LICENSE) file for details.

## Status

**Version**: 0.2.0-phase2
**Tests**: 108/108 passing (100%)
**Last Updated**: 2026-01-18
