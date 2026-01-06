<script>
	/**
	 * IntegratedJudgment Component
	 *
	 * Displays the integrated judgment from multi-perspectival deliberation
	 * Follows MDI v2.0 principles:
	 * - No "optimal" or "recommended" language (forbidden terms)
	 * - Uses "Partner" language ("the tension appears to be...")
	 * - Preserves minority views prominently
	 * - Shows epistemic humility
	 */

	// Props
	export let judgment = 'uncertain'; // permissible | impermissible | uncertain
	export let confidence = 0.5;
	export let confidenceLevel = 'moderate'; // low | moderate | high
	export let justification = '';
	export let supportingWorldviews = [];
	export let minorityViews = [];
	export let domain = '';
	export let conflictsCount = 0;

	// Judgment colors (divergent palette)
	const judgmentColors = {
		permissible: '#4f46e5', // Indigo
		impermissible: '#d97706', // Ochre
		uncertain: '#6b7280' // Gray
	};

	// Judgment labels (using MDI "Partner" language)
	const judgmentLabels = {
		permissible: 'The integrated perspective tends toward affirmation',
		impermissible: 'The integrated perspective identifies significant concerns',
		uncertain: 'The integrated perspective remains uncertain'
	};

	// Confidence level descriptors
	const confidenceLevelDescriptors = {
		low: 'There is significant uncertainty across worldviews',
		moderate: 'There is moderate agreement among worldviews',
		high: 'There is substantial convergence among worldviews'
	};

	// Format justification text into HTML-safe structured content
	function formatJustification(text) {
		if (!text) return '';

		// Split into lines and wrap in appropriate HTML
		return text
			.split('\n')
			.map(line => {
				line = line.trim();
				if (!line) return '';

				// H1 headers
				if (line.startsWith('# ')) {
					return `<h3 class="just-h1">${line.substring(2)}</h3>`;
				}
				// H2 headers
				else if (line.startsWith('## ')) {
					return `<h4 class="just-h2">${line.substring(3)}</h4>`;
				}
				// H3 headers
				else if (line.startsWith('### ')) {
					return `<h5 class="just-h3">${line.substring(4)}</h5>`;
				}
				// Bold text (**text**)
				else if (line.match(/^\*\*.*\*\*:?\s*/)) {
					return `<p class="just-bold">${line.replace(/\*\*/g, '<strong>').replace(/<strong>/g, '').replace(/<\/strong>/g, '')}</strong></p>`;
				}
				// List items (-)
				else if (line.startsWith('- ')) {
					return `<li>${line.substring(2)}</li>`;
				}
				// Regular paragraphs
				else {
					return `<p class="just-p">${line}</p>`;
				}
			})
			.filter(line => line)
			.join('');
	}

	$: formattedJustification = formatJustification(justification);
</script>

<div class="integrated-judgment-container">
	<!-- MDI v2.0 Header: No "Final Verdict" -->
	<div class="judgment-header">
		<h3>Integrated Multi-Perspectival Analysis</h3>
		<p class="header-subtitle">
			Synthesis across {supportingWorldviews.length + minorityViews.length} worldview perspectives
			{#if domain}
				in the <strong>{domain}</strong> domain
			{/if}
		</p>
	</div>

	<!-- Primary Judgment (using "Partner" language) -->
	<div class="judgment-primary" style="border-left-color: {judgmentColors[judgment]};">
		<div class="judgment-label">
			{judgmentLabels[judgment]}
		</div>

		<!-- Confidence Level (NOT a score) -->
		<div class="confidence-indicator">
			<div class="confidence-bar-container">
				<div
					class="confidence-bar"
					style="width: {confidence * 100}%; background: {judgmentColors[judgment]};"
				/>
			</div>
			<p class="confidence-text">
				<strong>Epistemic Status:</strong> {confidenceLevelDescriptors[confidenceLevel]}
				({(confidence * 100).toFixed(0)}% confidence)
			</p>
		</div>

		<!-- Conflicts Notice (tension highlighting per MDI v2.0) -->
		{#if conflictsCount > 0}
			<div class="tension-notice">
				<p>
					⚡ <strong>Tension Identified:</strong> {conflictsCount} {conflictsCount === 1 ? 'conflict' : 'conflicts'} detected between worldviews.
					See minority views below for dissenting perspectives.
				</p>
			</div>
		{/if}
	</div>

	<!-- Justification -->
	<div class="justification-section">
		<h4>Multi-Perspectival Reasoning</h4>
		<div class="justification-content">
			{@html formattedJustification}
		</div>
	</div>

	<!-- Supporting Worldviews -->
	{#if supportingWorldviews && supportingWorldviews.length > 0}
		<div class="supporting-section">
			<h4>Aligned Perspectives ({supportingWorldviews.length})</h4>
			<p class="section-description">
				The following worldviews converge on this judgment:
			</p>
			<div class="worldview-badges">
				{#each supportingWorldviews as worldview}
					<span class="worldview-badge supporting" style="background: {judgmentColors[judgment]};">
						{worldview}
					</span>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Minority Views (MUST be prominently displayed per MDI v2.0) -->
	{#if minorityViews && minorityViews.length > 0}
		<div class="minority-section">
			<h4>Dissenting Perspectives ({minorityViews.length})</h4>
			<p class="section-description">
				<strong>Epistemic Humility:</strong> These worldviews reached different conclusions.
				Their perspectives are preserved to avoid premature consensus.
			</p>

			<div class="minority-views-list">
				{#each minorityViews as view}
					<div class="minority-view-card">
						<div class="minority-header">
							<strong>{view.worldview}</strong>
							<span class="minority-judgment-badge">
								{view.judgment}
							</span>
						</div>
						{#if view.reasoning}
							<p class="minority-reasoning">
								"{view.reasoning}"
							</p>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Epistemic Notice (per MDI v2.0 "The Gap") -->
	<div class="epistemic-notice">
		<p>
			<strong>Note:</strong> This analysis illuminates the structural complexity of the choice
			but does not prescribe action. The final decision remains with the moral agent who bears
			the existential responsibility for this choice.
		</p>
	</div>
</div>

<style>
	.integrated-judgment-container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
		padding: var(--spacing-lg);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.judgment-header {
		text-align: center;
		padding-bottom: var(--spacing-md);
		border-bottom: 2px solid var(--color-border);
	}

	.judgment-header h3 {
		margin: 0 0 var(--spacing-sm) 0;
		font-size: var(--font-size-2xl);
		font-weight: var(--font-weight-semibold);
	}

	.header-subtitle {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.judgment-primary {
		padding: var(--spacing-xl);
		background: var(--color-surface);
		border-left: 6px solid var(--color-primary);
		border-radius: var(--radius-lg);
	}

	.judgment-label {
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-semibold);
		margin-bottom: var(--spacing-md);
		color: var(--color-text);
	}

	.confidence-indicator {
		margin-top: var(--spacing-lg);
	}

	.confidence-bar-container {
		height: 12px;
		background: var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
		margin-bottom: var(--spacing-sm);
	}

	.confidence-bar {
		height: 100%;
		transition: width var(--transition-slow);
	}

	.confidence-text {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.tension-notice {
		margin-top: var(--spacing-md);
		padding: var(--spacing-md);
		background: rgba(239, 68, 68, 0.05);
		border: 1px solid rgba(239, 68, 68, 0.2);
		border-radius: var(--radius-md);
	}

	.tension-notice p {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--color-text);
	}

	.justification-section h4,
	.supporting-section h4,
	.minority-section h4 {
		margin: 0 0 var(--spacing-sm) 0;
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
	}

	.section-description {
		margin: 0 0 var(--spacing-md) 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.justification-content {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.justification-content :global(.just-h1) {
		margin: var(--spacing-md) 0 var(--spacing-sm) 0;
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
	}

	.justification-content :global(.just-h2) {
		margin: var(--spacing-sm) 0 var(--spacing-xs) 0;
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
	}

	.justification-content :global(.just-h3) {
		margin: var(--spacing-sm) 0 var(--spacing-xs) 0;
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text);
	}

	.justification-content :global(.just-bold) {
		margin: var(--spacing-xs) 0;
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
	}

	.justification-content :global(.just-p) {
		margin: var(--spacing-xs) 0;
		line-height: var(--line-height-relaxed);
		color: var(--color-text);
	}

	.justification-content :global(li) {
		margin-left: var(--spacing-lg);
		line-height: var(--line-height-relaxed);
		color: var(--color-text);
	}

	.worldview-badges {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-sm);
	}

	.worldview-badge {
		padding: var(--spacing-xs) var(--spacing-md);
		color: white;
		border-radius: var(--radius-md);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
	}

	.minority-section {
		padding: var(--spacing-lg);
		background: rgba(245, 158, 11, 0.05);
		border: 2px solid var(--color-warning);
		border-radius: var(--radius-lg);
	}

	.minority-views-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.minority-view-card {
		padding: var(--spacing-md);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.minority-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-sm);
	}

	.minority-judgment-badge {
		padding: var(--spacing-xs) var(--spacing-sm);
		background: var(--color-warning);
		color: white;
		border-radius: var(--radius-sm);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		text-transform: capitalize;
	}

	.minority-reasoning {
		margin: 0;
		font-style: italic;
		line-height: var(--line-height-relaxed);
		color: var(--color-text-muted);
	}

	.epistemic-notice {
		padding: var(--spacing-md);
		background: rgba(59, 130, 246, 0.05);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: var(--radius-md);
		font-size: var(--font-size-sm);
		font-style: italic;
		color: var(--color-text-muted);
		text-align: center;
	}

	.epistemic-notice p {
		margin: 0;
	}
</style>
