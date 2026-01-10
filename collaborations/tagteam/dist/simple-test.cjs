/**
 * Simplified Node.js test for TagTeam bundle
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('================================================================================');
console.log('TagTeam.js - IEE Test Corpus Validation (Node.js)');
console.log('================================================================================');
console.log();

// Create a sandbox environment with window global
const sandbox = {
  console: console,
  window: {},
  global: {},
  module: { exports: {} },
  exports: {},
  require: require,
  __dirname: __dirname,
  __filename: __filename
};

// Make window reference itself
sandbox.window = sandbox;
sandbox.global = sandbox;

try {
  // Load and execute the TagTeam bundle in sandbox
  const tagteamCode = fs.readFileSync(path.join(__dirname, 'tagteam.js'), 'utf8');
  vm.createContext(sandbox);
  vm.runInContext(tagteamCode, sandbox);

  // Get TagTeam from sandbox
  const TagTeam = sandbox.TagTeam || sandbox.module.exports;

  if (!TagTeam || !TagTeam.parse) {
    console.error('❌ TagTeam bundle did not export correctly');
    console.log('Available in sandbox:', Object.keys(sandbox).filter(k => !k.startsWith('_')));
    process.exit(1);
  }

  console.log(`✅ TagTeam bundle loaded successfully!`);
  console.log(`   Version: ${TagTeam.version || 'unknown'}`);
  console.log();

  // Test scenarios
  const testScenarios = [
    {
      id: "healthcare-001",
      title: "End of Life Decision",
      testSentence: "The family must decide whether to continue treatment",
      expected: { agent: "family", action: "decide", modality: "must", frame: "Deciding" }
    },
    {
      id: "spiritual-001",
      title: "Leaving Faith Community",
      testSentence: "I am questioning core doctrines",
      expected: { agent: "I", action: "question", patient: "doctrines", frame: "Questioning" }
    },
    {
      id: "vocational-001",
      title: "Whistleblowing Decision",
      testSentence: "I discovered that my company is falsifying safety reports",
      expected: { agent: "I", action: "discover", frame: "Becoming_aware" }
    },
    {
      id: "interpersonal-001",
      title: "Friend's Infidelity",
      testSentence: "My best friend is cheating on their spouse",
      expected: { agent: "friend", action: "cheat", patient: "spouse", frame: "Offenses" }
    },
    {
      id: "environmental-001",
      title: "Climate Action vs Economic Impact",
      testSentence: "We must decide whether to allow an extension",
      expected: { agent: "We", action: "decide", modality: "must", frame: "Deciding" }
    }
  ];

  let passed = 0;
  let failed = 0;
  const failures = [];

  testScenarios.forEach((scenario, index) => {
    console.log('='.repeat(80));
    console.log(`Test ${index + 1}/5: ${scenario.id} - ${scenario.title}`);
    console.log('='.repeat(80));
    console.log(`Sentence: "${scenario.testSentence}"`);
    console.log();

    const result = TagTeam.parse(scenario.testSentence);
    const checks = [];

    // Agent check
    if (scenario.expected.agent) {
      const agentText = result.agent ? result.agent.text.toLowerCase() : '';
      const match = agentText.includes(scenario.expected.agent.toLowerCase());
      checks.push({ name: 'Agent', expected: scenario.expected.agent,
                   actual: result.agent ? result.agent.text : 'null', pass: match });
    }

    // Action check
    if (scenario.expected.action) {
      const actionVerb = result.action ? result.action.verb : '';
      const match = actionVerb === scenario.expected.action ||
                   (result.action && result.action.verbOriginal === scenario.expected.action);
      checks.push({ name: 'Action', expected: scenario.expected.action,
                   actual: actionVerb || 'null', pass: match });
    }

    // Modality check
    if (scenario.expected.modality) {
      const modality = result.action ? result.action.modality : null;
      const match = modality === scenario.expected.modality;
      checks.push({ name: 'Modality', expected: scenario.expected.modality,
                   actual: modality || 'null', pass: match });
    }

    // Patient check
    if (scenario.expected.patient) {
      const patientText = result.patient ? result.patient.text.toLowerCase() : '';
      const match = patientText.includes(scenario.expected.patient.toLowerCase());
      checks.push({ name: 'Patient', expected: scenario.expected.patient,
                   actual: result.patient ? result.patient.text : 'null', pass: match });
    }

    // Frame check
    if (scenario.expected.frame) {
      const frame = result.semanticFrame || result.action?.frame;
      const match = frame === scenario.expected.frame;
      checks.push({ name: 'Frame', expected: scenario.expected.frame,
                   actual: frame || 'null', pass: match });
    }

    // Display and count
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
  });

  // Summary
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
  process.exit(passRate >= 75 ? 0 : 1);

} catch (error) {
  console.error('❌ Error running validation:');
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
}
