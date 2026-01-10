# Testing - Test Strategy & Frameworks

Consolidated testing documentation, strategies, scenarios, and frameworks.

## Directory Structure

```
testing/
├── strategy/          # Test strategies and methodologies
├── scenarios/         # Test scenario definitions
├── results/          # Test execution results
├── frameworks/       # Test framework implementations
│   ├── ui-test-framework/
│   └── unit-tests/
└── shared-test-utils/ # Shared testing utilities
```

## Quick Links

**Strategy:**
- [strategy/testStrategy.md](strategy/testStrategy.md) - Overall testing approach
- [strategy/uiTestingFramework.md](strategy/uiTestingFramework.md) - UI testing framework

**Scenarios:**
- [scenarios/TEST_SCENARIOS.md](scenarios/TEST_SCENARIOS.md) - Ethical dilemma test cases

**Results:**
- [results/TEST_RESULTS.md](results/TEST_RESULTS.md) - Latest test execution results

**Frameworks:**
- [frameworks/ui-test-framework/](frameworks/ui-test-framework/) - Playwright UI tests
- [frameworks/unit-tests/](frameworks/unit-tests/) - Unit test suite

## Running Tests

### UI Tests
```bash
cd testing/frameworks/ui-test-framework
npm install
npm test
```

### Unit Tests
```bash
cd testing/frameworks/unit-tests
npm install
npm test
```

## Test Coverage

Current focus areas:
- Worldview perspective generation
- Value conflict resolution
- Domain contextualization
- Integration procedure execution
- Offline PWA functionality
