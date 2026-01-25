<script>
	/**
	 * WorldviewCard Component
	 *
	 * Displays a single worldview's evaluation with judgment, confidence, reasoning
	 * Follows MDI v2.0 principles: no "scores", emphasis on tension and perspective
	 */

	// Props
	export let worldview = '';
	export let judgment = 'uncertain'; // permissible | impermissible | uncertain
	export let confidence = 0.5;
	export let reasoning = '';
	export let values = [];
	export let conflicts = []; // Value conflicts detected for this worldview
	export let weight = 0.5; // Domain weight
	export let cluster = ''; // Material-Empirical | Process-Individual | Depth-Spiritual
	export let expanded = false;

	// Cluster colors (subtle, non-prescriptive)
	const clusterColors = {
		'Material-Empirical': '#10b981',
		'Process-Individual': '#3b82f6',
		'Depth-Spiritual': '#8b5cf6'
	};

	// Judgment colors (divergent palette - NOT red/green per MDI v2.0)
	const judgmentColors = {
		permissible: '#4f46e5', // Indigo (Affirming)
		impermissible: '#d97706', // Ochre (Concerning)
		uncertain: '#6b7280' // Gray (Ambiguous)
	};

	// Judgment labels (using MDI v2.0 "Partner" language)
	const judgmentLabels = {
		permissible: 'Affirming',
		impermissible: 'Concerning',
		uncertain: 'Uncertain'
	};

	function toggleExpanded() {
		expanded = !expanded;
	}

	// Calculate uncertainty (inverse of confidence)
	$: uncertainty = 1 - confidence;
	$: isHighUncertainty = uncertainty > 0.4;

	// Visual opacity based on uncertainty (per MDI v2.0)
	$: cardOpacity = 1 - (uncertainty * 0.3); // Max 30% opacity reduction
</script>

<div
	class="worldview-card"
	class:expanded
	style="border-left-color: {clusterColors[cluster] || '#6b7280'}; opacity: {cardOpacity};"
>
	<!-- Header -->
	<div class="card-header" on:click={toggleExpanded} on:keypress={toggleExpanded} role="button" tabindex="0">
		<div class="header-left">
			<h4>{worldview}</h4>
			{#if cluster}
				<span class="cluster-badge" style="background: {clusterColors[cluster]};">
					{cluster}
				</span>
			{/if}
		</div>
		<div class="header-right">
			<button class="expand-toggle" aria-label="Toggle details">
				{expanded ? '▼' : '▶'}
			</button>
		</div>
	</div>

	<!-- Quick Summary -->
	<div class="card-summary">
		<!-- Judgment (using MDI "Partner" language) -->
		<div class="summary-item">
			<span class="label">This perspective:</span>
			<span
				class="judgment-badge"
				class:uncertain={isHighUncertainty}
				style="background: {judgmentColors[judgment]}; opacity: {cardOpacity};"
			>
				{judgmentLabels[judgment]}
			</span>
		</div>

		<!-- Confidence (shown as certainty/uncertainty per MDI v2.0) -->
		<div class="summary-item">
			<span class="label">Certainty:</span>
			<div class="confidence-bar-container">
				<div
					class="confidence-bar"
					style="width: {confidence * 100}%; background: {judgmentColors[judgment]};"
				/>
				<span class="confidence-text">
					{#if isHighUncertainty}
						<span style="color: var(--color-warning);">
							Significant uncertainty ({(confidence * 100).toFixed(0)}%)
						</span>
					{:else}
						{(confidence * 100).toFixed(0)}%
					{/if}
				</span>
			</div>
		</div>

		<!-- Domain Weight (salience) -->
		<div class="summary-item">
			<span class="label">Moral Salience:</span>
			<span class="weight-text">
				{(weight * 100).toFixed(0)}% in this domain
			</span>
		</div>
	</div>

	<!-- Expanded Details -->
	{#if expanded}
		<div class="card-details">
			<!-- Reasoning (using MDI v2.0 "Natural Language Ontological Path") -->
			<div class="reasoning-section">
				<h5>Reasoning</h5>
				<p class="reasoning-text">{reasoning}</p>
			</div>

			<!-- Values -->
			{#if values && values.length > 0}
				<div class="values-section">
					<h5>Values Emphasized</h5>
					<div class="values-list">
						{#each values as value}
							<span class="value-tag">{value.replace(/_/g, ' ')}</span>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Value Conflicts -->
			{#if conflicts && conflicts.length > 0}
				<div class="conflicts-section">
					<h5>Value Conflicts to Resolve</h5>
					<div class="conflicts-list">
						{#each conflicts as conflict}
							<div class="conflict-item">
								<div class="conflict-values">
									{#if conflict.values && conflict.values.length > 0}
										{conflict.values.map(v => v.replace(/_/g, ' ')).join(' ↔ ')}
									{:else}
										{conflict.type || 'Unknown conflict'}
									{/if}
								</div>
								{#if conflict.description}
									<div class="conflict-description">{conflict.description}</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Epistemic Indicators -->
			{#if isHighUncertainty}
				<div class="uncertainty-notice">
					<p>
						⚠️ <strong>Epistemic Notice:</strong> There is significant uncertainty regarding this perspective's evaluation.
						{#if uncertainty > 0.6}
							This may indicate limited grounding data for this worldview in this context.
						{/if}
					</p>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.worldview-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-left: 4px solid var(--color-primary);
		border-radius: var(--radius-lg);
		padding: var(--spacing-md);
		transition: all var(--transition-base);
		cursor: pointer;
	}

	.worldview-card:hover {
		box-shadow: var(--shadow-md);
		transform: translateY(-2px);
	}

	.worldview-card.expanded {
		cursor: default;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-sm);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: var(--spacing-md);
	}

	.header-left h4 {
		margin: 0;
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
	}

	.cluster-badge {
		padding: var(--spacing-xs) var(--spacing-sm);
		font-size: var(--font-size-xs);
		color: white;
		border-radius: var(--radius-sm);
		font-weight: var(--font-weight-medium);
	}

	.expand-toggle {
		background: none;
		border: none;
		font-size: var(--font-size-lg);
		color: var(--color-text-muted);
		cursor: pointer;
		padding: var(--spacing-xs);
		transition: transform var(--transition-fast);
	}

	.worldview-card.expanded .expand-toggle {
		transform: rotate(0deg);
	}

	.card-summary {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.summary-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.label {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		min-width: 120px;
	}

	.judgment-badge {
		padding: var(--spacing-xs) var(--spacing-md);
		color: white;
		border-radius: var(--radius-md);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
	}

	.judgment-badge.uncertain {
		border: 2px dashed var(--color-border);
	}

	.confidence-bar-container {
		flex: 1;
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.confidence-bar {
		height: 8px;
		background: var(--color-primary);
		border-radius: var(--radius-sm);
		transition: width var(--transition-slow);
		min-width: 20px;
	}

	.confidence-text {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		white-space: nowrap;
	}

	.weight-text {
		font-size: var(--font-size-sm);
		color: var(--color-text);
	}

	.card-details {
		margin-top: var(--spacing-lg);
		padding-top: var(--spacing-lg);
		border-top: 1px solid var(--color-border);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.reasoning-section h5,
	.values-section h5 {
		margin: 0 0 var(--spacing-sm) 0;
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
	}

	.reasoning-text {
		margin: 0;
		line-height: var(--line-height-relaxed);
		color: var(--color-text);
	}

	.values-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-xs);
	}

	.value-tag {
		padding: var(--spacing-xs) var(--spacing-sm);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--font-size-sm);
		text-transform: capitalize;
	}

	.uncertainty-notice {
		padding: var(--spacing-md);
		background: rgba(245, 158, 11, 0.1);
		border: 1px solid var(--color-warning);
		border-radius: var(--radius-md);
	}

	.uncertainty-notice p {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--color-text);
	}

	/* Value Conflicts Section */
	.conflicts-section {
		padding: var(--spacing-md);
		background: rgba(239, 68, 68, 0.05);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: var(--radius-md);
	}

	.conflicts-section h5 {
		margin: 0 0 var(--spacing-sm) 0;
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		color: #dc2626;
	}

	.conflicts-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.conflict-item {
		padding: var(--spacing-sm);
		background: white;
		border-radius: var(--radius-sm);
		border-left: 3px solid #ef4444;
	}

	.conflict-values {
		font-weight: var(--font-weight-medium);
		color: var(--color-text);
		text-transform: capitalize;
	}

	.conflict-description {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		margin-top: var(--spacing-xs);
		font-style: italic;
	}
</style>
