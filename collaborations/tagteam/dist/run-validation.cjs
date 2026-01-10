/**
 * Node.js script to run TagTeam validation tests
 * Simulates the browser test-iee-bundle.html validation
 */

const fs = require('fs');
const path = require('path');

// Load the TagTeam bundle
const tagteamCode = fs.readFileSync(path.join(__dirname, 'tagteam.js'), 'utf8');

// Create a minimal global environment for the bundle
global.window = global;
global.document = {};

// Execute the bundle
eval(tagteamCode);

// IEE Test Corpus (from test-corpus-week1.json)
const testScenarios = [
  {
    id: "healthcare-001",
    title: "End of Life Decision",
    description: "A 78-year-old patient with terminal cancer is on life support with no chance of recovery. The family must decide whether to continue treatment.",
    testSentence: "The family must decide whether to continue treatment",
    expected: {
      agent: "family",
      action: "decide",
      modality: "must",
      frame: "Deciding"
    }
  },
  {
    id: "spiritual-001",
    title: "Leaving Faith Community",
    description: "After 30 years in a conservative religious community, I am questioning core doctrines and considering leaving.",
    testSentence: "I am questioning core doctrines",
    expected: {
      agent: "I",
      action: "question",
      patient: "doctrines",
      frame: "Questioning"
    }
  },
  {
    id: "vocational-001",
    title: "Whistleblowing Decision",
    description: "I discovered that my company is falsifying safety reports.",
    testSentence: "I discovered that my company is falsifying safety reports",
    expected: {
      agent: "I",
      action: "discover",
      frame: "Becoming_aware"
    }
  },
  {
    id: "interpersonal-001",
    title: "Friend's Infidelity",
    description: "My best friend is cheating on their spouse.",
    testSentence: "My best friend is cheating on their spouse",
    expected: {
      agent: "friend",
      action: "cheat",
      patient: "spouse",
      frame: "Offenses"
    }
  },
  {
    id: "environmental-001",
    title: "Climate Action vs Economic Impact",
    description: "We must decide whether to allow an extension for the coal plant.",
    testSentence: "We must decide whether to allow an extension",
    expected: {
      agent: "We",
      action: "decide",
      modality: "must",
      frame: "Deciding"
    }
  }
];

console.log('='.repeat(80));
console.log('TagTeam.js - IEE Test Corpus Validation');
console.log('='.repeat(80));
console.log();

if (typeof TagTeam === 'undefined') {
  console.error('❌ TagTeam bundle failed to load!');
  process.exit(1);
}

console.log(`✅ TagTeam bundle loaded! Version: ${TagTeam.version || 'unknown'}`);
console.log();

let passed = 0;
let failed = 0;
const failures = [];
const detailedResults = [];

testScenarios.forEach((scenario, index) => {
  console.log(`${'='.repeat(80)}`);
  console.log(`Test ${index + 1}/5: ${scenario.id} - ${scenario.title}`);
  console.log(`${'='.repeat(80)}`);
  console.log(`Description: ${scenario.description}`);
  console.log(`Test Sentence: "${scenario.testSentence}"`);
  console.log();

  const result = TagTeam.parse(scenario.testSentence);

  const checks = [];

  // Agent check
  if (scenario.expected.agent) {
    const agentText = result.agent ? result.agent.text.toLowerCase() : '';
    const match = agentText.includes(scenario.expected.agent.toLowerCase());
    checks.push({
      name: 'Agent',
      expected: scenario.expected.agent,
      actual: result.agent ? result.agent.text : 'null',
      pass: match
    });
  }

  // Action check
  if (scenario.expected.action) {
    const actionVerb = result.action ? result.action.verb : '';
    const match = actionVerb === scenario.expected.action ||
                 (result.action && result.action.verbOriginal === scenario.expected.action);
    checks.push({
      name: 'Action',
      expected: scenario.expected.action,
      actual: actionVerb || 'null',
      pass: match
    });
  }

  // Modality check
  if (scenario.expected.modality) {
    const modality = result.action ? result.action.modality : null;
    const match = modality === scenario.expected.modality;
    checks.push({
      name: 'Modality',
      expected: scenario.expected.modality,
      actual: modality || 'null',
      pass: match
    });
  }

  // Patient check
  if (scenario.expected.patient) {
    const patientText = result.patient ? result.patient.text.toLowerCase() : '';
    const match = patientText.includes(scenario.expected.patient.toLowerCase());
    checks.push({
      name: 'Patient',
      expected: scenario.expected.patient,
      actual: result.patient ? result.patient.text : 'null',
      pass: match
    });
  }

  // Frame check
  if (scenario.expected.frame) {
    const frame = result.semanticFrame || result.action?.frame;
    const match = frame === scenario.expected.frame;
    checks.push({
      name: 'Frame',
      expected: scenario.expected.frame,
      actual: frame || 'null',
      pass: match
    });
  }

  // Display checks
  checks.forEach(check => {
    const symbol = check.pass ? '✅' : '❌';
    console.log(`${symbol} ${check.name}: Expected "${check.expected}", Got "${check.actual}"`);
    if (check.pass) {
      passed++;
    } else {
      failed++;
      failures.push(`${scenario.id} - ${check.name}`);
    }
  });

  console.log();
  console.log('Full Parse Result:');
  console.log(JSON.stringify(result, null, 2));
  console.log();

  detailedResults.push({
    scenario: scenario.id,
    title: scenario.title,
    checks: checks,
    result: result
  });
});

// Display summary
console.log('='.repeat(80));
console.log('📊 TEST SUMMARY');
console.log('='.repeat(80));

const totalChecks = passed + failed;
const passRate = ((passed / totalChecks) * 100).toFixed(1);

console.log(`Total Checks:  ${totalChecks}`);
console.log(`Passed:        ${passed} ✅`);
console.log(`Failed:        ${failed} ❌`);
console.log(`Pass Rate:     ${passRate}%`);
console.log(`Target:        ≥75% (Week 1)`);
console.log();

if (passRate >= 75) {
  console.log('🎉 PASSING - Week 1 target achieved!');
} else {
  console.log('⚠️  NEEDS WORK - Below 75% target');
}

if (failures.length > 0) {
  console.log();
  console.log('Failed Checks:');
  failures.forEach(f => console.log(`  - ${f}`));
}

console.log();
console.log('='.repeat(80));

// Write detailed results to JSON file
const outputPath = path.join(__dirname, 'validation-results.json');
fs.writeFileSync(outputPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  summary: {
    totalChecks,
    passed,
    failed,
    passRate: parseFloat(passRate),
    target: 75,
    status: passRate >= 75 ? 'PASSING' : 'NEEDS_WORK'
  },
  failures,
  detailedResults
}, null, 2));

console.log(`Detailed results written to: ${outputPath}`);
console.log();

process.exit(failed > 0 ? 1 : 0);
