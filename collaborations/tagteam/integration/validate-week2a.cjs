/**
 * Week 2a Validation - Context Intensity Analysis
 *
 * Validates TagTeam's Week 2a deliverable against IEE test corpus
 * Tests all 12 context dimensions for accuracy within ±0.2 tolerance
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Load the TagTeam bundle
console.log('================================================================================');
console.log('TagTeam Week 2a - Context Intensity Validation');
console.log('================================================================================\n');

const bundlePath = path.join(__dirname, '../deliverables/week2/tagteam.js');
const bundleCode = fs.readFileSync(bundlePath, 'utf-8');

// Create sandbox and execute bundle
const sandbox = {
  console: console,
  window: {},
  global: {},
  module: { exports: {} },
  exports: {},
  require: require,
  process: process,
  Buffer: Buffer,
  setTimeout: setTimeout,
  setInterval: setInterval,
  clearTimeout: clearTimeout,
  clearInterval: clearInterval
};

vm.createContext(sandbox);
vm.runInContext(bundleCode, sandbox);

const TagTeam = sandbox.TagTeam || sandbox.module.exports || sandbox.exports.TagTeam;

if (!TagTeam || typeof TagTeam.parse !== 'function') {
  console.error('❌ ERROR: TagTeam bundle did not load correctly');
  console.error('Available in sandbox:', Object.keys(sandbox));
  process.exit(1);
}

console.log('✅ TagTeam bundle loaded successfully!');
console.log('   Version:', TagTeam.version || 'unknown');
console.log('');

// Load test corpus
const corpusPath = path.join(__dirname, '../data/test-corpus-week2.json');
const corpus = JSON.parse(fs.readFileSync(corpusPath, 'utf-8'));

// Test first 5 scenarios as specified in WEEK2A_COMPLETE.md
const testScenarios = corpus.scenarios.slice(0, 5);

console.log('Test Corpus: Week 2 - First 5 scenarios');
console.log('Scenarios:', testScenarios.map(s => s.id).join(', '));
console.log('');

// Validation results
const results = {
  totalDimensions: 0,
  passedDimensions: 0,
  failedDimensions: 0,
  scenarios: []
};

const TOLERANCE = 0.2;

/**
 * Check if score is within tolerance
 */
function withinTolerance(actual, expected, tolerance = TOLERANCE) {
  return Math.abs(actual - expected) <= tolerance;
}

/**
 * Format score comparison
 */
function formatScore(actual, expected, passed) {
  const diff = (actual - expected).toFixed(2);
  const diffStr = diff > 0 ? `+${diff}` : diff;
  const symbol = passed ? '✅' : '❌';
  return `${symbol} ${actual.toFixed(2)} (expected ${expected.toFixed(2)}, diff ${diffStr})`;
}

/**
 * Validate a single scenario
 */
function validateScenario(scenario) {
  console.log('================================================================================');
  console.log(`Test: ${scenario.id} - ${scenario.title}`);
  console.log('================================================================================');
  console.log(`Sentence: "${scenario.testSentence}"`);
  console.log('');

  const result = TagTeam.parse(scenario.testSentence);

  // Check if contextIntensity exists
  if (!result.contextIntensity) {
    console.error('❌ ERROR: No contextIntensity property in result!');
    console.log('Available properties:', Object.keys(result));
    return {
      scenarioId: scenario.id,
      passed: 0,
      failed: 12,
      details: 'Missing contextIntensity property'
    };
  }

  const expected = scenario.expectedOutput.contextIntensity;
  const actual = result.contextIntensity;

  let passed = 0;
  let failed = 0;
  const details = [];

  // Validate Temporal dimensions
  console.log('Temporal Context:');
  ['urgency', 'duration', 'reversibility'].forEach(dim => {
    results.totalDimensions++;
    const exp = expected.temporal[dim];
    const act = actual.temporal ? actual.temporal[dim] : undefined;

    if (act === undefined) {
      console.log(`  ❌ ${dim}: MISSING`);
      failed++;
      results.failedDimensions++;
      details.push({ dimension: `temporal.${dim}`, status: 'MISSING' });
    } else {
      const isPassing = withinTolerance(act, exp);
      console.log(`  ${formatScore(act, exp, isPassing)} - ${dim}`);
      if (isPassing) {
        passed++;
        results.passedDimensions++;
      } else {
        failed++;
        results.failedDimensions++;
      }
      details.push({
        dimension: `temporal.${dim}`,
        expected: exp,
        actual: act,
        status: isPassing ? 'PASS' : 'FAIL'
      });
    }
  });

  // Validate Relational dimensions
  console.log('\nRelational Context:');
  ['intimacy', 'powerDifferential', 'trust'].forEach(dim => {
    results.totalDimensions++;
    const exp = expected.relational[dim];
    const act = actual.relational ? actual.relational[dim] : undefined;

    if (act === undefined) {
      console.log(`  ❌ ${dim}: MISSING`);
      failed++;
      results.failedDimensions++;
      details.push({ dimension: `relational.${dim}`, status: 'MISSING' });
    } else {
      const isPassing = withinTolerance(act, exp);
      console.log(`  ${formatScore(act, exp, isPassing)} - ${dim}`);
      if (isPassing) {
        passed++;
        results.passedDimensions++;
      } else {
        failed++;
        results.failedDimensions++;
      }
      details.push({
        dimension: `relational.${dim}`,
        expected: exp,
        actual: act,
        status: isPassing ? 'PASS' : 'FAIL'
      });
    }
  });

  // Validate Consequential dimensions
  console.log('\nConsequential Context:');
  ['harmSeverity', 'benefitMagnitude', 'scope'].forEach(dim => {
    results.totalDimensions++;
    const exp = expected.consequential[dim];
    const act = actual.consequential ? actual.consequential[dim] : undefined;

    if (act === undefined) {
      console.log(`  ❌ ${dim}: MISSING`);
      failed++;
      results.failedDimensions++;
      details.push({ dimension: `consequential.${dim}`, status: 'MISSING' });
    } else {
      const isPassing = withinTolerance(act, exp);
      console.log(`  ${formatScore(act, exp, isPassing)} - ${dim}`);
      if (isPassing) {
        passed++;
        results.passedDimensions++;
      } else {
        failed++;
        results.failedDimensions++;
      }
      details.push({
        dimension: `consequential.${dim}`,
        expected: exp,
        actual: act,
        status: isPassing ? 'PASS' : 'FAIL'
      });
    }
  });

  // Validate Epistemic dimensions
  console.log('\nEpistemic Context:');
  ['certainty', 'informationCompleteness', 'expertise'].forEach(dim => {
    results.totalDimensions++;
    const exp = expected.epistemic[dim];
    const act = actual.epistemic ? actual.epistemic[dim] : undefined;

    if (act === undefined) {
      console.log(`  ❌ ${dim}: MISSING`);
      failed++;
      results.failedDimensions++;
      details.push({ dimension: `epistemic.${dim}`, status: 'MISSING' });
    } else {
      const isPassing = withinTolerance(act, exp);
      console.log(`  ${formatScore(act, exp, isPassing)} - ${dim}`);
      if (isPassing) {
        passed++;
        results.passedDimensions++;
      } else {
        failed++;
        results.failedDimensions++;
      }
      details.push({
        dimension: `epistemic.${dim}`,
        expected: exp,
        actual: act,
        status: isPassing ? 'PASS' : 'FAIL'
      });
    }
  });

  console.log('');
  console.log(`📊 Scenario Result: ${passed}/12 dimensions passed (${((passed/12)*100).toFixed(1)}%)`);
  console.log('');

  return {
    scenarioId: scenario.id,
    passed: passed,
    failed: failed,
    details: details
  };
}

// Run validation on all test scenarios
testScenarios.forEach(scenario => {
  const scenarioResult = validateScenario(scenario);
  results.scenarios.push(scenarioResult);
});

// Print summary
console.log('================================================================================');
console.log('📊 VALIDATION SUMMARY');
console.log('================================================================================');
console.log('');

results.scenarios.forEach(sr => {
  const percentage = ((sr.passed / 12) * 100).toFixed(1);
  const status = sr.passed === 12 ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${sr.scenarioId}: ${sr.passed}/12 (${percentage}%)`);
});

console.log('');
console.log('Overall Results:');
console.log(`  Total Dimensions Tested: ${results.totalDimensions}`);
console.log(`  Passed: ${results.passedDimensions} ✅`);
console.log(`  Failed: ${results.failedDimensions} ❌`);
console.log(`  Accuracy: ${((results.passedDimensions / results.totalDimensions) * 100).toFixed(1)}%`);
console.log('');

const TARGET_ACCURACY = 0.80;
const actualAccuracy = results.passedDimensions / results.totalDimensions;

if (actualAccuracy >= TARGET_ACCURACY) {
  console.log(`🎉 SUCCESS - Exceeds ${(TARGET_ACCURACY * 100).toFixed(0)}% target!`);
  console.log('');
  console.log('Week 2a deliverable VALIDATED ✅');
} else {
  console.log(`❌ FAILED - Below ${(TARGET_ACCURACY * 100).toFixed(0)}% target`);
  console.log('');
  console.log('Week 2a deliverable REJECTED ❌');
}

console.log('');
console.log('================================================================================');

// Exit with appropriate code
process.exit(actualAccuracy >= TARGET_ACCURACY ? 0 : 1);
