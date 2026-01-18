// Diagnostic script to understand judgment calculation
// Run with: node debug-judgment.js

// Simulating the exact scenario
const terminalValues = [
  { name: 'Consent', polarity: 1, type: 'terminal', salience: 'high' },
  { name: 'Autonomy', polarity: 1, type: 'terminal', salience: 'high' },
  { name: 'Compassion', polarity: 0, type: 'terminal', salience: 'medium' },
  { name: 'Patience', polarity: 0, type: 'terminal', salience: 'low' }
];

// Copy of evaluateAgainstValues logic
function evaluateAgainstValues(terminalValues) {
  const valuesWithPolarity = terminalValues.filter(v => v.polarity !== undefined && v.polarity !== 0);
  const neutralValues = terminalValues.filter(v => v.polarity === 0);
  const allHavePolarity = terminalValues.every(v => v.polarity !== undefined);

  console.log('Terminal values:', terminalValues.length);
  console.log('Values with non-zero polarity:', valuesWithPolarity.length);
  console.log('Neutral values:', neutralValues.length);
  console.log('All have polarity:', allHavePolarity);

  // CASE 1: We have clear positive or negative polarities
  if (valuesWithPolarity.length > 0) {
    const upheld = valuesWithPolarity.filter(v => v.polarity === 1);
    const violated = valuesWithPolarity.filter(v => v.polarity === -1);

    console.log('\nCASE 1 triggered:');
    console.log('Upheld values:', upheld.length, upheld.map(v => v.name));
    console.log('Violated values:', violated.length, violated.map(v => v.name));

    if (violated.length > 0 && upheld.length === 0) {
      console.log('→ Returning: wrong (only violations)');
      return 'wrong';
    }

    if (upheld.length > 0 && violated.length === 0) {
      console.log('→ Returning: right (only upholding, no violations)');
      return 'right';
    }

    if (violated.length > 0 && upheld.length > 0) {
      console.log('→ Returning: complex (mixed)');
      return 'complex';
    }
  }

  // CASE 2: All values have polarity 0
  if (allHavePolarity && neutralValues.length === terminalValues.length) {
    console.log('\nCASE 2 triggered: All neutral');
    if (terminalValues.length >= 2) {
      console.log('→ Returning: complex (multiple neutral values)');
      return 'complex';
    }
    console.log('→ Returning: neutral (single neutral value)');
    return 'neutral';
  }

  console.log('\nFalling through to CASE 3 (fallback logic)');
  return 'complex';
}

const judgment = evaluateAgainstValues(terminalValues);
console.log('\n=== FINAL JUDGMENT:', judgment.toUpperCase(), '===');
console.log('Maps to:', judgment === 'right' ? 'permissible' : judgment === 'complex' ? 'problematic' : judgment);
