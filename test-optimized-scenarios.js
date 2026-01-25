/**
 * Test Optimized Demo Scenarios
 *
 * This script simulates what TagTeam v3.0 SHOULD return for the optimized
 * scenarios and verifies the moral reasoner produces correct judgments.
 *
 * Run with: node test-optimized-scenarios.js
 */

// Copy of evaluateAgainstValues logic from moralReasoner.js
function evaluateAgainstValues(terminalValues) {
  const valuesWithPolarity = terminalValues.filter(v => v.polarity !== undefined && v.polarity !== 0);
  const neutralValues = terminalValues.filter(v => v.polarity === 0);
  const allHavePolarity = terminalValues.every(v => v.polarity !== undefined);

  // CASE 1: We have clear positive or negative polarities
  if (valuesWithPolarity.length > 0) {
    const upheld = valuesWithPolarity.filter(v => v.polarity === 1);
    const violated = valuesWithPolarity.filter(v => v.polarity === -1);

    if (violated.length > 0 && upheld.length === 0) {
      return 'wrong';
    }

    if (upheld.length > 0 && violated.length === 0) {
      return 'right';
    }

    if (violated.length > 0 && upheld.length > 0) {
      return 'complex';
    }
  }

  // CASE 2: All values have polarity 0
  if (allHavePolarity && neutralValues.length === terminalValues.length) {
    if (terminalValues.length >= 2) {
      return 'complex';
    }
    return 'neutral';
  }

  // CASE 3: Fallback
  return 'complex';
}

function mapJudgmentToPermissibility(judgment) {
  const mapping = {
    'right': 'permissible',
    'wrong': 'impermissible',
    'complex': 'problematic',
    'neutral': 'uncertain'
  };
  return mapping[judgment] || 'uncertain';
}

// ============================================
// OPTIMIZED SCENARIO 1: Medical Care with Consent
// ============================================
console.log('\n' + '='.repeat(60));
console.log('SCENARIO 1: Medical Care with Full Consent');
console.log('='.repeat(60));
console.log('\nScenario: "A physician seeks permission from the patient and');
console.log('obtains informed consent before treatment. The doctor helps');
console.log('the patient understand risks, respects their wishes, and');
console.log('promotes their welfare while ensuring safety."');
console.log('\n--- Expected TagTeam Detection ---');

const scenario1Values = [
  { name: 'Consent', polarity: 1, type: 'terminal', salience: 'high' },
  { name: 'Autonomy', polarity: 1, type: 'terminal', salience: 'high' },
  { name: 'Beneficence', polarity: 1, type: 'terminal', salience: 'high' },
  { name: 'Non-maleficence', polarity: 1, type: 'terminal', salience: 'medium' },
  { name: 'Respect for Persons', polarity: 1, type: 'terminal', salience: 'medium' }
];

scenario1Values.forEach(v => {
  const polaritySymbol = v.polarity === 1 ? '+1 (upheld)' : v.polarity === -1 ? '-1 (violated)' : '0 (neutral)';
  console.log(`  ${v.name}: ${polaritySymbol}`);
});

const judgment1 = evaluateAgainstValues(scenario1Values);
const permissibility1 = mapJudgmentToPermissibility(judgment1);
console.log(`\n--- Moral Reasoner Output ---`);
console.log(`Judgment: ${judgment1}`);
console.log(`Permissibility: ${permissibility1.toUpperCase()}`);
console.log(`Expected: PERMISSIBLE`);
console.log(`Status: ${permissibility1 === 'permissible' ? '✅ PASS' : '❌ FAIL'}`);

// ============================================
// OPTIMIZED SCENARIO 2: Ethical Violation
// ============================================
console.log('\n' + '='.repeat(60));
console.log('SCENARIO 2: Ethical Violation');
console.log('='.repeat(60));
console.log('\nScenario: "A company coerces employees to work overtime');
console.log('without consent. They cause harm by ignoring safety concerns,');
console.log('discriminate in hiring, and refuse assistance to injured workers."');
console.log('\n--- Expected TagTeam Detection ---');

const scenario2Values = [
  { name: 'Autonomy', polarity: -1, type: 'terminal', salience: 'high' },
  { name: 'Consent', polarity: -1, type: 'terminal', salience: 'high' },
  { name: 'Non-maleficence', polarity: -1, type: 'terminal', salience: 'high' },
  { name: 'Equality', polarity: -1, type: 'terminal', salience: 'medium' },
  { name: 'Beneficence', polarity: -1, type: 'terminal', salience: 'medium' }
];

scenario2Values.forEach(v => {
  const polaritySymbol = v.polarity === 1 ? '+1 (upheld)' : v.polarity === -1 ? '-1 (violated)' : '0 (neutral)';
  console.log(`  ${v.name}: ${polaritySymbol}`);
});

const judgment2 = evaluateAgainstValues(scenario2Values);
const permissibility2 = mapJudgmentToPermissibility(judgment2);
console.log(`\n--- Moral Reasoner Output ---`);
console.log(`Judgment: ${judgment2}`);
console.log(`Permissibility: ${permissibility2.toUpperCase()}`);
console.log(`Expected: IMPERMISSIBLE`);
console.log(`Status: ${permissibility2 === 'impermissible' ? '✅ PASS' : '❌ FAIL'}`);

// ============================================
// OPTIMIZED SCENARIO 3: Community Fair Distribution
// ============================================
console.log('\n' + '='.repeat(60));
console.log('SCENARIO 3: Community Fair Distribution');
console.log('='.repeat(60));
console.log('\nScenario: "A local council ensures fair distribution of');
console.log('emergency supplies. They maintain transparency in decision-making,');
console.log('protect human rights, and show equal treatment for all residents."');
console.log('\n--- Expected TagTeam Detection ---');

const scenario3Values = [
  { name: 'Justice', polarity: 1, type: 'terminal', salience: 'high' },
  { name: 'Transparency', polarity: 1, type: 'terminal', salience: 'medium' },
  { name: 'Human Rights', polarity: 1, type: 'terminal', salience: 'medium' },
  { name: 'Equality', polarity: 1, type: 'terminal', salience: 'medium' }
];

scenario3Values.forEach(v => {
  const polaritySymbol = v.polarity === 1 ? '+1 (upheld)' : v.polarity === -1 ? '-1 (violated)' : '0 (neutral)';
  console.log(`  ${v.name}: ${polaritySymbol}`);
});

const judgment3 = evaluateAgainstValues(scenario3Values);
const permissibility3 = mapJudgmentToPermissibility(judgment3);
console.log(`\n--- Moral Reasoner Output ---`);
console.log(`Judgment: ${judgment3}`);
console.log(`Permissibility: ${permissibility3.toUpperCase()}`);
console.log(`Expected: PERMISSIBLE`);
console.log(`Status: ${permissibility3 === 'permissible' ? '✅ PASS' : '❌ FAIL'}`);

// ============================================
// OPTIMIZED SCENARIO 4: Mixed Ethical Dilemma
// ============================================
console.log('\n' + '='.repeat(60));
console.log('SCENARIO 4: Mixed Ethical Dilemma');
console.log('='.repeat(60));
console.log('\nScenario: "To promote the welfare of the community and ensure');
console.log('safety, a health authority mandates vaccination. While this may');
console.log('override individual decision for some who object, it protects');
console.log('vulnerable populations and shows compassion for those at risk."');
console.log('\n--- Expected TagTeam Detection ---');

const scenario4Values = [
  { name: 'Beneficence', polarity: 1, type: 'terminal', salience: 'high' },
  { name: 'Non-maleficence', polarity: 1, type: 'terminal', salience: 'high' },
  { name: 'Autonomy', polarity: -1, type: 'terminal', salience: 'medium' },
  { name: 'Protection', polarity: 1, type: 'terminal', salience: 'medium' },
  { name: 'Compassion', polarity: 1, type: 'terminal', salience: 'medium' }
];

scenario4Values.forEach(v => {
  const polaritySymbol = v.polarity === 1 ? '+1 (upheld)' : v.polarity === -1 ? '-1 (violated)' : '0 (neutral)';
  console.log(`  ${v.name}: ${polaritySymbol}`);
});

const judgment4 = evaluateAgainstValues(scenario4Values);
const permissibility4 = mapJudgmentToPermissibility(judgment4);
console.log(`\n--- Moral Reasoner Output ---`);
console.log(`Judgment: ${judgment4}`);
console.log(`Permissibility: ${permissibility4.toUpperCase()}`);
console.log(`Expected: PROBLEMATIC (mixed values)`);
console.log(`Status: ${permissibility4 === 'problematic' ? '✅ PASS' : '❌ FAIL'}`);

// ============================================
// SUMMARY
// ============================================
console.log('\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));

const results = [
  { name: 'Medical Care', expected: 'permissible', actual: permissibility1 },
  { name: 'Ethical Violation', expected: 'impermissible', actual: permissibility2 },
  { name: 'Fair Distribution', expected: 'permissible', actual: permissibility3 },
  { name: 'Mixed Dilemma', expected: 'problematic', actual: permissibility4 }
];

let passed = 0;
results.forEach(r => {
  const status = r.expected === r.actual ? '✅' : '❌';
  if (r.expected === r.actual) passed++;
  console.log(`${status} ${r.name}: ${r.actual} (expected: ${r.expected})`);
});

console.log(`\nTotal: ${passed}/${results.length} scenarios pass`);
console.log('\nNOTE: These results assume TagTeam correctly detects values');
console.log('with the polarities shown above. The optimized scenarios use');
console.log('TagTeam\'s exact phrase patterns to maximize detection accuracy.');
