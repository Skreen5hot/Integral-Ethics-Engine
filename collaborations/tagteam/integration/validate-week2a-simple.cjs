/**
 * Week 2a Validation - Context Intensity Analysis (Simplified)
 * Works with browser-style bundle by wrapping in IIFE
 */

const fs = require('fs');
const path = require('path');

console.log('================================================================================');
console.log('TagTeam Week 2a - Context Intensity Validation');
console.log('================================================================================\n');

// Load and wrap the bundle
const bundlePath = path.join(__dirname, '../dist/tagteam.js');
console.log('Loading bundle from:', bundlePath);
let bundleCode = fs.readFileSync(bundlePath, 'utf-8');

// Create browser-like environment for UMD bundle
global.window = global;
global.document = {
  createElement: () => ({}),
  getElementById: () => null
};

// Execute the bundle - UMD will detect window and assign to global.TagTeam
try {
  eval(bundleCode);
} catch (error) {
  console.error('❌ ERROR during bundle execution:', error.message);
  console.error('Stack:', error.stack);
  process.exit(1);
}

// The UMD pattern assigns to window.TagTeam (which is global.TagTeam)
const TagTeam = global.TagTeam || window.TagTeam;

if (!TagTeam || typeof TagTeam.parse !== 'function') {
  console.error('❌ ERROR: TagTeam bundle did not load correctly');
  console.log('Available in global:', Object.keys(global).filter(k => !k.startsWith('_') && k !== 'console'));
  console.log('typeof window.TagTeam:', typeof window.TagTeam);
  console.log('typeof global.TagTeam:', typeof global.TagTeam);
  process.exit(1);
}

console.log('✅ TagTeam bundle loaded successfully!');
console.log('   Version:', TagTeam.version || 'unknown');
console.log('');

// Test corpus - first 5 scenarios
const testScenarios = [
  {
    id: "healthcare-001",
    title: "End of Life Decision",
    testSentence: "The family must decide whether to continue treatment",
    expectedOutput: {
      contextIntensity: {
        temporal: { urgency: 0.8, duration: 1.0, reversibility: 1.0 },
        relational: { intimacy: 1.0, powerDifferential: 0.3, trust: 0.7 },
        consequential: { harmSeverity: 1.0, benefitMagnitude: 0.4, scope: 0.1 },
        epistemic: { certainty: 0.4, informationCompleteness: 0.5, expertise: 0.3 }
      }
    }
  },
  {
    id: "healthcare-002",
    title: "Triage in Resource Scarcity",
    testSentence: "The doctor must allocate the last ventilator between two critically ill patients",
    expectedOutput: {
      contextIntensity: {
        temporal: { urgency: 1.0, duration: 1.0, reversibility: 1.0 },
        relational: { intimacy: 0.2, powerDifferential: 0.9, trust: 0.8 },
        consequential: { harmSeverity: 1.0, benefitMagnitude: 1.0, scope: 0.2 },
        epistemic: { certainty: 0.6, informationCompleteness: 0.7, expertise: 0.9 }
      }
    }
  },
  {
    id: "spiritual-001",
    title: "Leaving Faith Community",
    testSentence: "I am questioning core doctrines",
    expectedOutput: {
      contextIntensity: {
        temporal: { urgency: 0.3, duration: 0.8, reversibility: 0.5 },
        relational: { intimacy: 0.9, powerDifferential: 0.4, trust: 0.4 },
        consequential: { harmSeverity: 0.6, benefitMagnitude: 0.7, scope: 0.2 },
        epistemic: { certainty: 0.3, informationCompleteness: 0.6, expertise: 0.6 }
      }
    }
  },
  {
    id: "vocational-001",
    title: "Whistleblowing Decision",
    testSentence: "I discovered that my company is falsifying safety reports",
    expectedOutput: {
      contextIntensity: {
        temporal: { urgency: 0.8, duration: 0.8, reversibility: 0.6 },
        relational: { intimacy: 0.3, powerDifferential: 0.8, trust: 0.1 },
        consequential: { harmSeverity: 0.9, benefitMagnitude: 0.9, scope: 0.6 },
        epistemic: { certainty: 0.9, informationCompleteness: 0.8, expertise: 0.7 }
      }
    }
  },
  {
    id: "interpersonal-001",
    title: "Friend's Infidelity",
    testSentence: "My best friend is cheating on their spouse",
    expectedOutput: {
      contextIntensity: {
        temporal: { urgency: 0.5, duration: 0.7, reversibility: 0.6 },
        relational: { intimacy: 0.9, powerDifferential: 0.1, trust: 0.8 },
        consequential: { harmSeverity: 0.8, benefitMagnitude: 0.7, scope: 0.1 },
        epistemic: { certainty: 1.0, informationCompleteness: 0.8, expertise: 0.7 }
      }
    }
  }
];

console.log('Test Corpus: First 5 scenarios from Week 2');
console.log('Scenarios:', testScenarios.map(s => s.id).join(', '));
console.log('');

const TOLERANCE = 0.2;
const results = {
  totalDimensions: 0,
  passedDimensions: 0,
  failedDimensions: 0,
  scenarios: []
};

function withinTolerance(actual, expected) {
  return Math.abs(actual - expected) <= TOLERANCE;
}

function formatScore(actual, expected, passed) {
  const diff = (actual - expected).toFixed(2);
  const diffStr = diff >= 0 ? `+${diff}` : diff;
  const symbol = passed ? '✅' : '❌';
  return `${symbol} ${actual.toFixed(2)} (expected ${expected.toFixed(2)}, diff ${diffStr})`;
}

testScenarios.forEach(scenario => {
  console.log('================================================================================');
  console.log(`Test: ${scenario.id} - ${scenario.title}`);
  console.log('================================================================================');
  console.log(`Sentence: "${scenario.testSentence}"`);
  console.log('');

  const result = TagTeam.parse(scenario.testSentence);

  if (!result.contextIntensity) {
    console.error('❌ ERROR: No contextIntensity property in result!');
    console.log('Available properties:', Object.keys(result));
    results.scenarios.push({ id: scenario.id, passed: 0, failed: 12 });
    results.totalDimensions += 12;
    results.failedDimensions += 12;
    return;
  }

  const expected = scenario.expectedOutput.contextIntensity;
  const actual = result.contextIntensity;

  let passed = 0;
  let failed = 0;

  // Temporal
  console.log('Temporal Context:');
  ['urgency', 'duration', 'reversibility'].forEach(dim => {
    results.totalDimensions++;
    const exp = expected.temporal[dim];
    const act = actual.temporal ? actual.temporal[dim] : undefined;

    if (act === undefined) {
      console.log(`  ❌ ${dim}: MISSING`);
      failed++;
      results.failedDimensions++;
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
    }
  });

  // Relational
  console.log('\nRelational Context:');
  ['intimacy', 'powerDifferential', 'trust'].forEach(dim => {
    results.totalDimensions++;
    const exp = expected.relational[dim];
    const act = actual.relational ? actual.relational[dim] : undefined;

    if (act === undefined) {
      console.log(`  ❌ ${dim}: MISSING`);
      failed++;
      results.failedDimensions++;
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
    }
  });

  // Consequential
  console.log('\nConsequential Context:');
  ['harmSeverity', 'benefitMagnitude', 'scope'].forEach(dim => {
    results.totalDimensions++;
    const exp = expected.consequential[dim];
    const act = actual.consequential ? actual.consequential[dim] : undefined;

    if (act === undefined) {
      console.log(`  ❌ ${dim}: MISSING`);
      failed++;
      results.failedDimensions++;
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
    }
  });

  // Epistemic
  console.log('\nEpistemic Context:');
  ['certainty', 'informationCompleteness', 'expertise'].forEach(dim => {
    results.totalDimensions++;
    const exp = expected.epistemic[dim];
    const act = actual.epistemic ? actual.epistemic[dim] : undefined;

    if (act === undefined) {
      console.log(`  ❌ ${dim}: MISSING`);
      failed++;
      results.failedDimensions++;
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
    }
  });

  console.log('');
  console.log(`📊 Scenario Result: ${passed}/12 dimensions (${((passed/12)*100).toFixed(1)}%)`);
  console.log('');

  results.scenarios.push({ id: scenario.id, passed, failed });
});

// Summary
console.log('================================================================================');
console.log('📊 VALIDATION SUMMARY');
console.log('================================================================================');
console.log('');

results.scenarios.forEach(sr => {
  const percentage = ((sr.passed / 12) * 100).toFixed(1);
  const status = sr.passed === 12 ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${sr.id}: ${sr.passed}/12 (${percentage}%)`);
});

console.log('');
console.log('Overall Results:');
console.log(`  Total Dimensions: ${results.totalDimensions}`);
console.log(`  Passed: ${results.passedDimensions} ✅`);
console.log(`  Failed: ${results.failedDimensions} ❌`);
console.log(`  Accuracy: ${((results.passedDimensions / results.totalDimensions) * 100).toFixed(1)}%`);
console.log('');

const TARGET = 80;
const accuracy = (results.passedDimensions / results.totalDimensions) * 100;

if (accuracy >= TARGET) {
  console.log(`🎉 SUCCESS - Exceeds ${TARGET}% target!`);
  console.log('');
  console.log('Week 2a deliverable VALIDATED ✅');
} else {
  console.log(`❌ FAILED - Below ${TARGET}% target`);
  console.log('');
  console.log('Week 2a deliverable REJECTED ❌');
}

console.log('');
console.log('================================================================================');

process.exit(accuracy >= TARGET ? 0 : 1);
