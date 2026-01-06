/**
 * Quick test script for scenarioParser
 * Run with: node test-parser.js
 */

import { parseScenario } from './src/concepts/scenarioParser.js';

console.log('=== Scenario Parser Test ===\n');

// Test Case 1: Healthcare scenario
const test1 = {
  description: 'A 78-year-old patient with terminal cancer is on life support with no chance of recovery. The family must decide whether to continue aggressive treatment or transition to comfort care. The patient left no advance directive, but had previously mentioned preferring quality of life over prolonged suffering.',
  domain: 'healthcare',
  context: {}
};

console.log('Test 1: End-of-Life Decision');
console.log('Input:', test1.description.substring(0, 80) + '...');
try {
  const result1 = parseScenario(test1);
  console.log('\nParsed Result:');
  console.log('  Action:', result1.action);
  console.log('  Context flags:', Object.entries(result1.context).filter(([_, v]) => v).map(([k]) => k).join(', '));
  console.log('  Agents:', result1.agents.map(a => a.role).join(', '));
  console.log('  Artifacts:', result1.artifacts.map(a => a.type).join(', '));
  console.log('  Complexity:', result1.meta.complexity.toFixed(2));
} catch (error) {
  console.error('ERROR:', error.message);
}

console.log('\n' + '='.repeat(60) + '\n');

// Test Case 2: Spiritual scenario
const test2 = {
  description: 'After 30 years in a conservative religious community, I\'m questioning core doctrines and considering leaving. This would mean losing my entire social network and possibly estrangement from family. However, staying feels intellectually dishonest and emotionally suffocating.',
  domain: 'spiritual',
  context: {}
};

console.log('Test 2: Leaving Faith Community');
console.log('Input:', test2.description.substring(0, 80) + '...');
try {
  const result2 = parseScenario(test2);
  console.log('\nParsed Result:');
  console.log('  Action:', result2.action);
  console.log('  Context flags:', Object.entries(result2.context).filter(([_, v]) => v).map(([k]) => k).join(', '));
  console.log('  Agents:', result2.agents.map(a => a.role).join(', '));
  console.log('  Artifacts:', result2.artifacts.map(a => a.type).join(', '));
  console.log('  Complexity:', result2.meta.complexity.toFixed(2));
} catch (error) {
  console.error('ERROR:', error.message);
}

console.log('\n' + '='.repeat(60) + '\n');

// Test Case 3: Vocational scenario
const test3 = {
  description: 'I\'ve been offered a $300,000/year position at a company whose primary client is developing weapons systems. The money would eliminate my family\'s debt and secure our future, but the work conflicts with my values around peace and non-violence.',
  domain: 'vocational',
  context: {}
};

console.log('Test 3: High-Paying Unethical Work');
console.log('Input:', test3.description.substring(0, 80) + '...');
try {
  const result3 = parseScenario(test3);
  console.log('\nParsed Result:');
  console.log('  Action:', result3.action);
  console.log('  Context flags:', Object.entries(result3.context).filter(([_, v]) => v).map(([k]) => k).join(', '));
  console.log('  Agents:', result3.agents.map(a => a.role).join(', '));
  console.log('  Artifacts:', result3.artifacts.map(a => a.type).join(', '));
  console.log('  Complexity:', result3.meta.complexity.toFixed(2));
} catch (error) {
  console.error('ERROR:', error.message);
}

console.log('\n' + '='.repeat(60));
console.log('\n✓ Parser test complete\n');
