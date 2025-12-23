/**
 * Basic Usage Example - Integral Ethics Engine
 *
 * Demonstrates how to use the foundational IEE architecture to evaluate
 * moral scenarios from multiple worldview perspectives.
 */

import { worldviewManager } from '../src/concepts/worldviewManager.js';
import { moralReasoner } from '../src/concepts/moralReasoner.js';
import { initializeSynchronizations } from '../src/synchronizations.js';

// ============================================================================
// SETUP
// ============================================================================

console.log('='.repeat(80));
console.log('Integral Ethics Engine - Basic Usage Example');
console.log('='.repeat(80));
console.log();

// Initialize event-driven coordination (loads ValueNet automatically)
await initializeSynchronizations();

// Load the Material-Empirical worldviews (Phase 1)
console.log('Loading Material-Empirical worldviews...');
worldviewManager.actions.loadMaterialEmpiricalWorldviews();
console.log(`✓ Loaded ${worldviewManager.state.activeWorldviews.length} worldviews:`,
            worldviewManager.state.activeWorldviews.join(', '));
console.log();

// ============================================================================
// EXAMPLE 1: Classic Moral Dilemma - The Found Wallet
// ============================================================================

console.log('='.repeat(80));
console.log('EXAMPLE 1: The Found Wallet Scenario');
console.log('='.repeat(80));
console.log();

const walletScenario = {
  action: 'keep_wallet',
  context: {
    artifact: 'wallet',
    situation: 'found_on_street',
    contents: ['cash', 'credit_cards', 'identification'],
    personsInvolved: true,
    physicalImpact: false,
    factsInvolved: false
  },
  agents: ['finder', 'original_owner'],
  description: 'A person finds a wallet on the street containing cash and identification. Should they keep it or return it?'
};

console.log('Scenario:', walletScenario.description);
console.log();

// Gather active worldviews
const worldviews = worldviewManager.state.activeWorldviews.map(name => ({
  name,
  values: worldviewManager.state.valueHierarchies[name]
}));

// Evaluate from all perspectives
const walletEvaluation = moralReasoner.actions.evaluate(walletScenario, worldviews);

console.log('Multi-Perspectival Evaluation Results:');
console.log('-'.repeat(80));

// Display each worldview's judgment
Object.entries(walletEvaluation.judgments).forEach(([worldview, judgment]) => {
  console.log();
  console.log(`${worldview.toUpperCase()}:`);
  console.log(`  Judgment: ${judgment.judgment}`);
  console.log(`  Confidence: ${(judgment.confidence * 100).toFixed(0)}%`);
  console.log(`  Reasoning: ${judgment.reasoning}`);
  console.log(`  Relevant Values: ${judgment.relevantValues.map(v => v.value).join(', ') || 'none'}`);
});

console.log();
console.log('-'.repeat(80));
console.log(`Consulted ${walletEvaluation.worldviewsConsulted.length} worldviews`);
console.log();

// ============================================================================
// EXAMPLE 2: Medical Ethics - Providing Treatment
// ============================================================================

console.log('='.repeat(80));
console.log('EXAMPLE 2: Medical Treatment Scenario');
console.log('='.repeat(80));
console.log();

const medicalScenario = {
  action: 'provide_medical_treatment',
  context: {
    physicalImpact: true,
    factsInvolved: true,
    empiricalKnowledge: true,
    healthAtStake: true,
    professional: true
  },
  agents: ['doctor', 'patient'],
  description: 'A doctor provides evidence-based medical treatment to alleviate patient suffering.'
};

console.log('Scenario:', medicalScenario.description);
console.log();

const medicalEvaluation = moralReasoner.actions.evaluate(medicalScenario, worldviews);

console.log('Multi-Perspectival Evaluation Results:');
console.log('-'.repeat(80));

Object.entries(medicalEvaluation.judgments).forEach(([worldview, judgment]) => {
  console.log();
  console.log(`${worldview.toUpperCase()}:`);
  console.log(`  Judgment: ${judgment.judgment}`);
  console.log(`  Confidence: ${(judgment.confidence * 100).toFixed(0)}%`);
  console.log(`  Reasoning: ${judgment.reasoning}`);

  // Highlight high-salience values
  const highSalience = judgment.relevantValues.filter(v => v.salience === 'high');
  if (highSalience.length > 0) {
    console.log(`  High-Salience Values: ${highSalience.map(v => v.value).join(', ')}`);
  }
});

console.log();
console.log('-'.repeat(80));
console.log();

// ============================================================================
// EXAMPLE 3: Aesthetic Choice - Creating Art
// ============================================================================

console.log('='.repeat(80));
console.log('EXAMPLE 3: Artistic Creation Scenario');
console.log('='.repeat(80));
console.log();

const artScenario = {
  action: 'create_artwork',
  context: {
    aesthetic: true,
    sensory: true,
    experiential: true,
    physicalImpact: false,
    factsInvolved: false
  },
  agents: ['artist'],
  artifacts: ['artwork'],
  description: 'An artist creates a beautiful artwork that provides rich aesthetic experience.'
};

console.log('Scenario:', artScenario.description);
console.log();

const artEvaluation = moralReasoner.actions.evaluate(artScenario, worldviews);

console.log('Multi-Perspectival Evaluation Results:');
console.log('-'.repeat(80));

Object.entries(artEvaluation.judgments).forEach(([worldview, judgment]) => {
  console.log();
  console.log(`${worldview.toUpperCase()}:`);
  console.log(`  Judgment: ${judgment.judgment}`);
  console.log(`  Confidence: ${(judgment.confidence * 100).toFixed(0)}%`);
  console.log(`  Reasoning: ${judgment.reasoning}`);
});

console.log();
console.log('-'.repeat(80));
console.log();

// ============================================================================
// DEMONSTRATION: Worldview Independence
// ============================================================================

console.log('='.repeat(80));
console.log('DEMONSTRATION: Worldview Independence');
console.log('='.repeat(80));
console.log();

console.log('Key Insight: Each worldview evaluates independently based on its own values.');
console.log();

// Show materialism's values
console.log('MATERIALISM Values:');
const materialismValues = worldviewManager.state.valueHierarchies['materialism'];
console.log('  Terminal:', materialismValues.terminal.join(', '));
console.log('  Subordinated:', materialismValues.subordinated.join(', '));
console.log();

// Show realism's values
console.log('REALISM Values:');
const realismValues = worldviewManager.state.valueHierarchies['realism'];
console.log('  Terminal:', realismValues.terminal.join(', '));
console.log('  Subordinated:', realismValues.subordinated.join(', '));
console.log();

console.log('Notice: Each worldview has distinct terminal and subordinated values.');
console.log('This ensures no worldview reduces to another.');
console.log();

// ============================================================================
// DEMONSTRATION: ValueNet Integration
// ============================================================================

console.log('='.repeat(80));
console.log('DEMONSTRATION: ValueNet Integration (BFO-Aligned Value Ontology)');
console.log('='.repeat(80));
console.log();

console.log('ValueNet provides BFO-aligned value dispositions:');
console.log();

import { ontologyLoader } from '../src/concepts/ontologyLoader.js';

const dispositions = ontologyLoader.actions.getValueNetDispositions();
if (dispositions.length > 0) {
  console.log(`Loaded ${dispositions.length} ValueNet dispositions:`);
  console.log();

  // Show Schwartz's values
  const schwartzDispositions = dispositions.filter(d =>
    d.uri && d.uri.includes('schwartz')
  ).slice(0, 5);

  schwartzDispositions.forEach(d => {
    console.log(`  • ${d.label || d.name}`);
    if (d.definition) {
      const shortDef = d.definition.substring(0, 80) + '...';
      console.log(`    ${shortDef}`);
    }
  });

  console.log();
  console.log('Key Insight: Same ValueNet disposition (e.g., SecurityDisposition) has');
  console.log('different meanings across worldviews:');
  console.log('  - Materialism: Security = Physical safety, material resources');
  console.log('  - Phenomenalism: Security = Subjective certainty, stable perceptions');
  console.log();
  console.log('This demonstrates multi-perspectival value interpretation using');
  console.log('shared BFO-aligned ontological vocabulary.');
} else {
  console.log('ValueNet dispositions not loaded (files may not be available).');
}

console.log();

// ============================================================================
// REASONING HISTORY
// ============================================================================

console.log('='.repeat(80));
console.log('REASONING HISTORY');
console.log('='.repeat(80));
console.log();

const history = moralReasoner.actions.getReasoningHistory();
console.log(`Total evaluations performed: ${history.length}`);
console.log();

history.forEach((evaluation, index) => {
  console.log(`${index + 1}. ${evaluation.scenario.description || evaluation.scenario.action}`);
  console.log(`   Worldviews consulted: ${evaluation.worldviewsConsulted.length}`);
  console.log(`   Timestamp: ${evaluation.timestamp}`);
});

console.log();

// ============================================================================
// TRANSPARENCY DEMONSTRATION
// ============================================================================

console.log('='.repeat(80));
console.log('TRANSPARENCY FEATURES');
console.log('='.repeat(80));
console.log();

console.log('Every evaluation includes:');
console.log('  ✓ Scenario details');
console.log('  ✓ All worldviews consulted');
console.log('  ✓ Each worldview\'s judgment');
console.log('  ✓ Complete reasoning chains');
console.log('  ✓ Relevant values identified');
console.log('  ✓ Confidence levels');
console.log('  ✓ Detected value conflicts');
console.log('  ✓ Timestamp for auditability');
console.log();

console.log('This ensures:');
console.log('  - No hidden moral judgments');
console.log('  - All perspectives visible');
console.log('  - Complete traceability');
console.log('  - User can audit reasoning');
console.log();

// ============================================================================
// CONCLUSION
// ============================================================================

console.log('='.repeat(80));
console.log('CONCLUSION');
console.log('='.repeat(80));
console.log();

console.log('The Integral Ethics Engine foundation provides:');
console.log();
console.log('✅ Multi-perspectival moral reasoning (4 worldviews in Phase 1)');
console.log('✅ Pure functional core (deterministic, testable)');
console.log('✅ Complete transparency (all reasoning visible)');
console.log('✅ Worldview independence (no reduction or dominance)');
console.log('✅ Ethical integrity (no commodification of moral evaluation)');
console.log();

console.log('Phase 2 will add:');
console.log('  - 4 more worldviews (Dynamism, Monadism, Idealism, Rationalism)');
console.log('  - Temporal process tracking');
console.log('  - Moral character modeling');
console.log('  - Value conflict resolution procedures');
console.log();

console.log('Phase 3 will complete:');
console.log('  - Final 4 worldviews (Psychism, Pneumatism, Spiritualism, Mathematism)');
console.log('  - Domain contextualization');
console.log('  - Complete 12-worldview integral reasoning');
console.log();

console.log('='.repeat(80));
