<script>
	// Props
	export let deliberation1 = null;
	export let deliberation2 = null;

	// Judgment colors (divergent palette)
	const judgmentColors = {
		permissible: '#4f46e5', // Indigo
		impermissible: '#d97706', // Ochre
		uncertain: '#6b7280' // Gray
	};

	// Helper to get judgment color
	function getJudgmentColor(judgment) {
		return judgmentColors[judgment] || judgmentColors.uncertain;
	}

	// Helper to format timestamp
	function formatDate(timestamp) {
		return new Date(timestamp).toLocaleString();
	}

	// Helper to get scenario preview
	function getScenarioPreview(deliberation) {
		const desc = deliberation?.scenario?.description || '';
		return desc.length > 120 ? desc.slice(0, 120) + '...' : desc;
	}

	// Compare judgments
	$: judgmentsMatch = deliberation1 && deliberation2 &&
		deliberation1.judgment === deliberation2.judgment;

	// Compare confidence levels
	$: confidenceDifference = deliberation1 && deliberation2 ?
		Math.abs(deliberation1.confidence - deliberation2.confidence) : 0;

	// Get shared worldviews
	$: sharedWorldviews = deliberation1 && deliberation2 ?
		deliberation1.supportingWorldviews?.filter(wv =>
			deliberation2.supportingWorldviews?.includes(wv)
		) || [] : [];

	// Get unique worldviews for each deliberation
	$: uniqueWorldviews1 = deliberation1 && deliberation2 ?
		deliberation1.supportingWorldviews?.filter(wv =>
			!deliberation2.supportingWorldviews?.includes(wv)
		) || [] : [];

	$: uniqueWorldviews2 = deliberation1 && deliberation2 ?
		deliberation2.supportingWorldviews?.filter(wv =>
			!deliberation1.supportingWorldviews?.includes(wv)
		) || [] : [];

	// Compare conflicts
	$: conflictDifference = deliberation1 && deliberation2 ?
		(deliberation1.metadata?.conflictsCount || 0) - (deliberation2.metadata?.conflictsCount || 0) : 0;
</script>

<div class="comparison-container">
	<div class="comparison-header">
		<h2>Deliberation Comparison</h2>
		<p class="subtitle">
			Side-by-side analysis illuminating differences in multi-perspectival judgments
		</p>
	</div>

	{#if !deliberation1 || !deliberation2}
		<div class="empty-state">
			<p>Select two deliberations to compare</p>
		</div>
	{:else}
		<!-- Comparison Summary -->
		<div class="comparison-summary">
			<div class="summary-item" class:divergent={!judgmentsMatch}>
				<h4>Judgment Agreement</h4>
				{#if judgmentsMatch}
					<p class="status-convergent">✓ Both deliberations reached the same judgment</p>
				{:else}
					<p class="status-divergent">⚡ Deliberations reached different judgments</p>
				{/if}
			</div>

			<div class="summary-item">
				<h4>Confidence Difference</h4>
				<p class:high-difference={confidenceDifference > 0.3}>
					{(confidenceDifference * 100).toFixed(1)}% difference
				</p>
			</div>

			<div class="summary-item">
				<h4>Worldview Alignment</h4>
				<p>
					{sharedWorldviews.length} shared,
					{uniqueWorldviews1.length + uniqueWorldviews2.length} unique
				</p>
			</div>
		</div>

		<!-- Side-by-Side Comparison -->
		<div class="comparison-grid">
			<!-- Deliberation 1 Column -->
			<div class="deliberation-column">
				<div class="column-header" style="background: {getJudgmentColor(deliberation1.judgment)};">
					<h3>Deliberation 1</h3>
					<span class="timestamp">{formatDate(deliberation1.timestamp)}</span>
				</div>

				<!-- Scenario -->
				<div class="section">
					<h4>Scenario</h4>
					<p class="scenario-preview">{getScenarioPreview(deliberation1)}</p>
					<div class="meta">
						<span class="domain-badge">{deliberation1.domain}</span>
					</div>
				</div>

				<!-- Judgment -->
				<div class="section">
					<h4>Integrated Judgment</h4>
					<div class="judgment-badge" style="background: {getJudgmentColor(deliberation1.judgment)};">
						{deliberation1.judgment}
					</div>
					<div class="confidence-bar-container">
						<div
							class="confidence-bar"
							style="width: {deliberation1.confidence * 100}%; background: {getJudgmentColor(deliberation1.judgment)};"
						></div>
					</div>
					<p class="confidence-text">
						{(deliberation1.confidence * 100).toFixed(0)}% confidence
					</p>
				</div>

				<!-- Supporting Worldviews -->
				<div class="section">
					<h4>Supporting Worldviews ({deliberation1.supportingWorldviews?.length || 0})</h4>
					<div class="worldview-badges">
						{#each deliberation1.supportingWorldviews || [] as wv}
							<span
								class="worldview-badge"
								class:shared={sharedWorldviews.includes(wv)}
								style="background: {sharedWorldviews.includes(wv) ? '#10b981' : getJudgmentColor(deliberation1.judgment)};"
							>
								{wv}
								{#if sharedWorldviews.includes(wv)}★{/if}
							</span>
						{/each}
					</div>
				</div>

				<!-- Minority Views -->
				{#if deliberation1.minorityViews && deliberation1.minorityViews.length > 0}
					<div class="section">
						<h4>Dissenting Views ({deliberation1.minorityViews.length})</h4>
						<div class="minority-views">
							{#each deliberation1.minorityViews as view}
								<div class="minority-view-item">
									<strong>{view.worldview}</strong>: {view.judgment}
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Conflicts -->
				<div class="section">
					<h4>Tensions Identified</h4>
					<p class="conflict-count">
						{deliberation1.metadata?.conflictsCount || 0} conflicts
					</p>
				</div>
			</div>

			<!-- Deliberation 2 Column -->
			<div class="deliberation-column">
				<div class="column-header" style="background: {getJudgmentColor(deliberation2.judgment)};">
					<h3>Deliberation 2</h3>
					<span class="timestamp">{formatDate(deliberation2.timestamp)}</span>
				</div>

				<!-- Scenario -->
				<div class="section">
					<h4>Scenario</h4>
					<p class="scenario-preview">{getScenarioPreview(deliberation2)}</p>
					<div class="meta">
						<span class="domain-badge">{deliberation2.domain}</span>
					</div>
				</div>

				<!-- Judgment -->
				<div class="section">
					<h4>Integrated Judgment</h4>
					<div class="judgment-badge" style="background: {getJudgmentColor(deliberation2.judgment)};">
						{deliberation2.judgment}
					</div>
					<div class="confidence-bar-container">
						<div
							class="confidence-bar"
							style="width: {deliberation2.confidence * 100}%; background: {getJudgmentColor(deliberation2.judgment)};"
						></div>
					</div>
					<p class="confidence-text">
						{(deliberation2.confidence * 100).toFixed(0)}% confidence
					</p>
				</div>

				<!-- Supporting Worldviews -->
				<div class="section">
					<h4>Supporting Worldviews ({deliberation2.supportingWorldviews?.length || 0})</h4>
					<div class="worldview-badges">
						{#each deliberation2.supportingWorldviews || [] as wv}
							<span
								class="worldview-badge"
								class:shared={sharedWorldviews.includes(wv)}
								style="background: {sharedWorldviews.includes(wv) ? '#10b981' : getJudgmentColor(deliberation2.judgment)};"
							>
								{wv}
								{#if sharedWorldviews.includes(wv)}★{/if}
							</span>
						{/each}
					</div>
				</div>

				<!-- Minority Views -->
				{#if deliberation2.minorityViews && deliberation2.minorityViews.length > 0}
					<div class="section">
						<h4>Dissenting Views ({deliberation2.minorityViews.length})</h4>
						<div class="minority-views">
							{#each deliberation2.minorityViews as view}
								<div class="minority-view-item">
									<strong>{view.worldview}</strong>: {view.judgment}
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Conflicts -->
				<div class="section">
					<h4>Tensions Identified</h4>
					<p class="conflict-count">
						{deliberation2.metadata?.conflictsCount || 0} conflicts
					</p>
				</div>
			</div>
		</div>

		<!-- Comparative Insights -->
		<div class="insights-section">
			<h3>Comparative Insights</h3>

			<div class="insights-grid">
				<!-- Convergence Points -->
				{#if sharedWorldviews.length > 0}
					<div class="insight-card convergence">
						<h4>Convergence ({sharedWorldviews.length} worldviews)</h4>
						<p>These worldviews agreed across both deliberations:</p>
						<div class="insight-badges">
							{#each sharedWorldviews as wv}
								<span class="insight-badge">{wv}</span>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Divergence Points -->
				{#if uniqueWorldviews1.length > 0 || uniqueWorldviews2.length > 0}
					<div class="insight-card divergence">
						<h4>Divergence</h4>
						<p><strong>Deliberation 1 unique:</strong></p>
						<div class="insight-badges">
							{#each uniqueWorldviews1 as wv}
								<span class="insight-badge unique-1">{wv}</span>
							{/each}
						</div>
						<p style="margin-top: var(--spacing-sm);"><strong>Deliberation 2 unique:</strong></p>
						<div class="insight-badges">
							{#each uniqueWorldviews2 as wv}
								<span class="insight-badge unique-2">{wv}</span>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Tension Analysis -->
				<div class="insight-card tensions">
					<h4>Tension Analysis</h4>
					{#if conflictDifference > 0}
						<p>Deliberation 1 had <strong>{Math.abs(conflictDifference)} more</strong> conflicts</p>
					{:else if conflictDifference < 0}
						<p>Deliberation 2 had <strong>{Math.abs(conflictDifference)} more</strong> conflicts</p>
					{:else}
						<p>Both deliberations identified the <strong>same number</strong> of conflicts</p>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.comparison-container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xl);
		padding: var(--spacing-lg);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.comparison-header {
		text-align: center;
		padding-bottom: var(--spacing-md);
		border-bottom: 2px solid var(--color-border);
	}

	.comparison-header h2 {
		margin: 0 0 var(--spacing-sm) 0;
		font-size: var(--font-size-2xl);
		font-weight: var(--font-weight-bold);
		color: var(--color-text);
	}

	.subtitle {
		margin: 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		font-style: italic;
	}

	.empty-state {
		text-align: center;
		padding: var(--spacing-2xl);
		color: var(--color-text-muted);
		font-style: italic;
	}

	.comparison-summary {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: var(--spacing-md);
		padding: var(--spacing-lg);
		background: var(--color-surface);
		border-radius: var(--radius-md);
	}

	.summary-item {
		padding: var(--spacing-md);
		border-radius: var(--radius-sm);
		background: var(--color-background);
	}

	.summary-item.divergent {
		border: 2px solid var(--color-warning);
	}

	.summary-item h4 {
		margin: 0 0 var(--spacing-sm) 0;
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-muted);
		text-transform: uppercase;
	}

	.summary-item p {
		margin: 0;
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
	}

	.status-convergent {
		color: var(--color-success);
	}

	.status-divergent {
		color: var(--color-warning);
	}

	.high-difference {
		color: var(--color-error);
	}

	.comparison-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--spacing-lg);
	}

	.deliberation-column {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.column-header {
		padding: var(--spacing-lg);
		color: white;
		text-align: center;
	}

	.column-header h3 {
		margin: 0 0 var(--spacing-xs) 0;
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-bold);
	}

	.timestamp {
		font-size: var(--font-size-xs);
		opacity: 0.9;
	}

	.section {
		padding: var(--spacing-md);
	}

	.section h4 {
		margin: 0 0 var(--spacing-sm) 0;
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
	}

	.scenario-preview {
		margin: 0 0 var(--spacing-sm) 0;
		font-size: var(--font-size-sm);
		line-height: var(--line-height-relaxed);
		color: var(--color-text);
	}

	.meta {
		display: flex;
		gap: var(--spacing-sm);
		flex-wrap: wrap;
	}

	.domain-badge {
		padding: var(--spacing-xs) var(--spacing-sm);
		background: var(--color-primary);
		color: white;
		border-radius: var(--radius-sm);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
	}

	.judgment-badge {
		display: inline-block;
		padding: var(--spacing-sm) var(--spacing-md);
		color: white;
		border-radius: var(--radius-md);
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		text-transform: capitalize;
		margin-bottom: var(--spacing-md);
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

	.worldview-badges {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-xs);
	}

	.worldview-badge {
		padding: var(--spacing-xs) var(--spacing-sm);
		color: white;
		border-radius: var(--radius-sm);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
	}

	.worldview-badge.shared {
		border: 2px solid var(--color-success);
	}

	.minority-views {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.minority-view-item {
		padding: var(--spacing-sm);
		background: var(--color-surface);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-sm);
	}

	.conflict-count {
		margin: 0;
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
	}

	.insights-section {
		padding: var(--spacing-lg);
		background: var(--color-surface);
		border-radius: var(--radius-md);
	}

	.insights-section h3 {
		margin: 0 0 var(--spacing-lg) 0;
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
	}

	.insights-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--spacing-md);
	}

	.insight-card {
		padding: var(--spacing-md);
		border-radius: var(--radius-md);
		border: 2px solid;
	}

	.insight-card.convergence {
		background: rgba(16, 185, 129, 0.05);
		border-color: var(--color-success);
	}

	.insight-card.divergence {
		background: rgba(239, 68, 68, 0.05);
		border-color: var(--color-error);
	}

	.insight-card.tensions {
		background: rgba(245, 158, 11, 0.05);
		border-color: var(--color-warning);
	}

	.insight-card h4 {
		margin: 0 0 var(--spacing-sm) 0;
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
	}

	.insight-card p {
		margin: 0 0 var(--spacing-sm) 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.insight-badges {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-xs);
	}

	.insight-badge {
		padding: var(--spacing-xs) var(--spacing-sm);
		background: var(--color-success);
		color: white;
		border-radius: var(--radius-sm);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
	}

	.insight-badge.unique-1 {
		background: #4f46e5;
	}

	.insight-badge.unique-2 {
		background: #d97706;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.comparison-grid {
			grid-template-columns: 1fr;
		}

		.comparison-summary {
			grid-template-columns: 1fr;
		}

		.insights-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
