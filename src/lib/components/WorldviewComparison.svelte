<script>
	// Props
	export let worldviews = {};

	// Available worldviews for comparison
	$: availableWorldviews = Object.keys(worldviews);

	// Selected worldviews (default to first 2)
	let selectedWorldviews = [];

	// Initialize selected worldviews when available worldviews changes
	$: if (availableWorldviews.length >= 2 && selectedWorldviews.length === 0) {
		selectedWorldviews = [availableWorldviews[0], availableWorldviews[1]];
	}

	// Get worldview data
	function getWorldviewData(name) {
		return worldviews[name] || {};
	}

	// Handle worldview selection change
	function handleWorldviewChange(index, newValue) {
		selectedWorldviews[index] = newValue;
		selectedWorldviews = [...selectedWorldviews]; // Trigger reactivity
	}

	// Add comparison slot
	function addComparison() {
		if (selectedWorldviews.length < 4) {
			selectedWorldviews = [...selectedWorldviews, availableWorldviews[selectedWorldviews.length]];
		}
	}

	// Remove comparison slot
	function removeComparison(index) {
		if (selectedWorldviews.length > 2) {
			selectedWorldviews = selectedWorldviews.filter((_, i) => i !== index);
		}
	}

	// Determine if values are shared across worldviews
	function isSharedValue(value) {
		return selectedWorldviews.every(wvName => {
			const wv = getWorldviewData(wvName);
			return wv.values?.includes(value);
		});
	}

	// Get all unique values across selected worldviews
	$: allValues = [...new Set(
		selectedWorldviews.flatMap(wvName => {
			const wv = getWorldviewData(wvName);
			return wv.values || [];
		})
	)];

	// Computed insights
	$: sharedValues = allValues.filter(v => isSharedValue(v));
	$: uniqueValues = allValues.filter(v => !isSharedValue(v));
	$: clusterDistribution = selectedWorldviews.reduce((acc, wvName) => {
		const cluster = getWorldviewData(wvName).cluster;
		acc[cluster] = (acc[cluster] || 0) + 1;
		return acc;
	}, {});

	// Comparison categories
	const categories = [
		{ key: 'cluster', label: 'Cluster', type: 'badge' },
		{ key: 'description', label: 'Core Essence', type: 'text' },
		{ key: 'values', label: 'Core Values', type: 'list' },
		{ key: 'foundationalConcept', label: 'Foundational Concept', type: 'text' },
		{ key: 'keyPhilosophers', label: 'Key Philosophers', type: 'list' },
		{ key: 'weight', label: 'Default Weight', type: 'number' }
	];

	// Cluster colors
	const clusterColors = {
		'Material': '#10b981',
		'Process': '#3b82f6',
		'Depth': '#8b5cf6'
	};
</script>

<div class="worldview-comparison">
	<div class="comparison-header">
		<h2>Worldview Comparison</h2>
		<p class="subtitle">
			Compare foundational perspectives side-by-side to illuminate philosophical differences
		</p>
	</div>

	<!-- Worldview Selector Controls -->
	<div class="selector-controls">
		{#each selectedWorldviews as selectedWv, index}
			<div class="selector-group">
				<label for="worldview-{index}">
					Worldview {index + 1}
				</label>
				<div class="selector-input">
					<select
						id="worldview-{index}"
						bind:value={selectedWorldviews[index]}
						on:change={(e) => handleWorldviewChange(index, e.target.value)}
					>
						{#each availableWorldviews as wv}
							<option value={wv}>{wv}</option>
						{/each}
					</select>
					{#if selectedWorldviews.length > 2}
						<button
							type="button"
							class="button-icon"
							on:click={() => removeComparison(index)}
							aria-label="Remove comparison"
						>
							×
						</button>
					{/if}
				</div>
			</div>
		{/each}

		{#if selectedWorldviews.length < 4}
			<button
				type="button"
				class="button button-secondary"
				on:click={addComparison}
			>
				+ Add Worldview
			</button>
		{/if}
	</div>

	<!-- Comparison Table -->
	<div class="comparison-grid">
		<div class="comparison-table">
			<!-- Header Row -->
			<div class="table-header">
				<div class="category-cell">Category</div>
				{#each selectedWorldviews as wvName}
					<div class="worldview-header-cell">
						{wvName}
					</div>
				{/each}
			</div>

			<!-- Data Rows -->
			{#each categories as category}
				<div class="table-row">
					<div class="category-cell">
						<strong>{category.label}</strong>
					</div>
					{#each selectedWorldviews as wvName}
						{@const wv = getWorldviewData(wvName)}
						<div class="data-cell">
							{#if category.type === 'badge'}
								<span
									class="cluster-badge"
									style="background: {clusterColors[wv[category.key]] || '#6b7280'};"
								>
									{wv[category.key] || 'N/A'}
								</span>
							{:else if category.type === 'list'}
								{#if wv[category.key] && wv[category.key].length > 0}
									<ul class="value-list">
										{#each wv[category.key] as item}
											<li
												class:shared={category.key === 'values' && isSharedValue(item)}
											>
												{item}
												{#if category.key === 'values' && isSharedValue(item)}
													<span class="shared-indicator" title="Shared across all worldviews">★</span>
												{/if}
											</li>
										{/each}
									</ul>
								{:else}
									<span class="empty-value">—</span>
								{/if}
							{:else if category.type === 'number'}
								<span class="weight-value">
									{wv[category.key] || 1.0}
								</span>
							{:else}
								<p class="text-value">
									{wv[category.key] || 'N/A'}
								</p>
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<!-- Insights Section -->
	{#if allValues.length > 0}
		<div class="insights-section">
			<h3>Comparative Insights</h3>

			<div class="insights-grid">
				<!-- Shared Values -->
				{#if sharedValues.length > 0}
					<div class="insight-card convergence">
						<h4>Convergence Points</h4>
						<p class="insight-description">
							Values shared across all {selectedWorldviews.length} worldviews:
						</p>
						<div class="value-badges">
							{#each sharedValues as value}
								<span class="value-badge shared">{value}</span>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Unique Values -->
				{#if uniqueValues.length > 0}
					<div class="insight-card divergence">
						<h4>Divergence Points</h4>
						<p class="insight-description">
							Values unique to specific worldviews:
						</p>
						<div class="value-badges">
							{#each uniqueValues as value}
								<span class="value-badge unique">{value}</span>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Cluster Distribution -->
				<div class="insight-card clusters">
					<h4>Cluster Distribution</h4>
					<p class="insight-description">
						Representation across philosophical clusters:
					</p>
					<div class="cluster-distribution">
						{#each Object.entries(clusterDistribution) as [cluster, count]}
							<div class="cluster-item">
								<span
									class="cluster-badge"
									style="background: {clusterColors[cluster]};"
								>
									{cluster}
								</span>
								<span class="cluster-count">{count} worldview{count !== 1 ? 's' : ''}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.worldview-comparison {
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

	.selector-controls {
		display: flex;
		gap: var(--spacing-md);
		flex-wrap: wrap;
		align-items: flex-end;
	}

	.selector-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
		flex: 1;
		min-width: 200px;
	}

	.selector-group label {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text);
	}

	.selector-input {
		display: flex;
		gap: var(--spacing-xs);
	}

	.selector-input select {
		flex: 1;
		padding: var(--spacing-sm) var(--spacing-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		color: var(--color-text);
		font-size: var(--font-size-sm);
	}

	.button-icon {
		padding: var(--spacing-sm);
		background: var(--color-error);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		font-size: var(--font-size-lg);
		line-height: 1;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all var(--transition-fast);
	}

	.button-icon:hover {
		background: #dc2626;
	}

	.comparison-grid {
		overflow-x: auto;
	}

	.comparison-table {
		display: flex;
		flex-direction: column;
		min-width: 600px;
	}

	.table-header,
	.table-row {
		display: grid;
		grid-template-columns: 200px repeat(auto-fit, minmax(250px, 1fr));
		gap: 1px;
		background: var(--color-border);
	}

	.table-header {
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.category-cell,
	.worldview-header-cell,
	.data-cell {
		padding: var(--spacing-md);
		background: var(--color-background);
	}

	.category-cell {
		background: var(--color-surface);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
		display: flex;
		align-items: center;
	}

	.worldview-header-cell {
		background: var(--color-primary);
		color: white;
		font-weight: var(--font-weight-semibold);
		font-size: var(--font-size-md);
		text-align: center;
	}

	.data-cell {
		display: flex;
		align-items: center;
		color: var(--color-text);
	}

	.cluster-badge {
		display: inline-block;
		padding: var(--spacing-xs) var(--spacing-md);
		color: white;
		border-radius: var(--radius-md);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
	}

	.value-list {
		margin: 0;
		padding-left: var(--spacing-lg);
		list-style: disc;
	}

	.value-list li {
		margin: var(--spacing-xs) 0;
		line-height: var(--line-height-relaxed);
		color: var(--color-text);
	}

	.value-list li.shared {
		font-weight: var(--font-weight-semibold);
		color: var(--color-success);
	}

	.shared-indicator {
		margin-left: var(--spacing-xs);
		color: var(--color-warning);
	}

	.empty-value {
		color: var(--color-text-muted);
		font-style: italic;
	}

	.weight-value {
		font-family: monospace;
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
	}

	.text-value {
		margin: 0;
		line-height: var(--line-height-relaxed);
		font-size: var(--font-size-sm);
	}

	.insights-section {
		padding: var(--spacing-lg);
		background: var(--color-surface);
		border-radius: var(--radius-md);
	}

	.insights-section h3 {
		margin: 0 0 var(--spacing-md) 0;
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

	.insight-card.clusters {
		background: rgba(59, 130, 246, 0.05);
		border-color: var(--color-primary);
	}

	.insight-card h4 {
		margin: 0 0 var(--spacing-sm) 0;
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
	}

	.insight-description {
		margin: 0 0 var(--spacing-md) 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.value-badges {
		display: flex;
		flex-wrap: wrap;
		gap: var(--spacing-xs);
	}

	.value-badge {
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
	}

	.value-badge.shared {
		background: var(--color-success);
		color: white;
	}

	.value-badge.unique {
		background: var(--color-warning);
		color: white;
	}

	.cluster-distribution {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.cluster-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.cluster-count {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.selector-controls {
			flex-direction: column;
		}

		.selector-group {
			min-width: 100%;
		}

		.table-header,
		.table-row {
			grid-template-columns: 150px repeat(auto-fit, minmax(200px, 1fr));
		}

		.insights-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
