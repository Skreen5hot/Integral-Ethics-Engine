<script>
	import { onMount } from 'svelte';
	import { session } from '$lib/stores';
	import { HistoryTable, DeliberationComparison } from '$lib/components';
	import { base } from '$app/paths';

	let history = [];
	let selectedDeliberation = null;
	let isLoading = true;
	let comparisonMode = false;
	let comparisonDeliberation1 = null;
	let comparisonDeliberation2 = null;

	onMount(async () => {
		// Load history from session store
		const unsubscribe = session.subscribe(state => {
			history = state.history || [];
			isLoading = false;
		});

		// Clean up subscription on component destroy
		return unsubscribe;
	});

	function handleSelectDeliberation(event) {
		if (comparisonMode) {
			// In comparison mode, add to next available slot
			if (!comparisonDeliberation1) {
				comparisonDeliberation1 = event.detail;
			} else if (!comparisonDeliberation2) {
				comparisonDeliberation2 = event.detail;
				// Scroll to comparison view when both are selected
				setTimeout(() => {
					document.querySelector('.comparison-slot')?.scrollIntoView({ behavior: 'smooth' });
				}, 100);
			}
		} else {
			// Normal detail view mode
			selectedDeliberation = event.detail;
			// Scroll to detail view
			setTimeout(() => {
				document.getElementById('detail-view')?.scrollIntoView({ behavior: 'smooth' });
			}, 100);
		}
	}

	function closeDetailView() {
		selectedDeliberation = null;
	}

	async function handleDelete(deliberationId) {
		if (confirm('Are you sure you want to delete this deliberation?')) {
			// TODO: Implement delete functionality in sessionManager
			console.log('Delete deliberation:', deliberationId);
		}
	}

	async function handleExportAll() {
		// Export history as JSON
		const dataStr = JSON.stringify(history, null, 2);
		const dataBlob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `iee-history-${new Date().toISOString().split('T')[0]}.json`;
		link.click();
		URL.revokeObjectURL(url);
	}

	function toggleComparisonMode() {
		comparisonMode = !comparisonMode;
		if (!comparisonMode) {
			// Reset comparison selections
			comparisonDeliberation1 = null;
			comparisonDeliberation2 = null;
		}
	}

	function selectForComparison(deliberation, slot) {
		if (slot === 1) {
			comparisonDeliberation1 = deliberation;
		} else {
			comparisonDeliberation2 = deliberation;
		}
	}
</script>

<div class="container" style="padding: var(--spacing-2xl) 0;">
	<header style="margin-bottom: var(--spacing-2xl);">
		<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--spacing-md);">
			<div>
				<h1>Deliberation History</h1>
				<p style="color: var(--color-text-muted);">
					Review past ethical deliberations and their multi-perspectival analyses
				</p>
			</div>
			{#if history.length > 0}
				<div style="display: flex; gap: var(--spacing-md);">
					<button
						class="button"
						class:button-secondary={!comparisonMode}
						on:click={toggleComparisonMode}
					>
						{comparisonMode ? '✓ Comparison Mode' : 'Compare Deliberations'}
					</button>
					<button class="button button-secondary" on:click={handleExportAll}>
						Export All as JSON
					</button>
				</div>
			{/if}
		</div>
	</header>

	<main class="flex-col gap-lg">
		<!-- History Table -->
		<section>
			{#if isLoading}
				<div class="card" style="text-align: center; padding: var(--spacing-2xl);">
					<p style="color: var(--color-text-muted);">Loading history...</p>
				</div>
			{:else if history.length === 0}
				<div class="card" style="text-align: center; padding: var(--spacing-2xl);">
					<h2 style="margin-bottom: var(--spacing-md);">No Deliberations Yet</h2>
					<p style="color: var(--color-text-muted); margin-bottom: var(--spacing-lg);">
						You haven't performed any ethical deliberations yet.
						Start by describing a scenario on the Deliberate page.
					</p>
					<a href="{base}/deliberate" class="button">
						Begin Deliberation
					</a>
				</div>
			{:else}
				<HistoryTable
					history={history}
					on:select={handleSelectDeliberation}
				/>
			{/if}
		</section>

		<!-- Detail View (shown when a deliberation is selected) -->
		{#if selectedDeliberation}
			<section id="detail-view" class="card">
				<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-lg);">
					<h2>Deliberation Details</h2>
					<button class="button button-secondary" on:click={closeDetailView}>
						Close
					</button>
				</div>

				<!-- Scenario -->
				<div style="margin-bottom: var(--spacing-lg);">
					<h3 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-sm);">Scenario</h3>
					<div style="padding: var(--spacing-md); background: var(--color-surface); border-radius: var(--radius-md); border-left: 3px solid var(--color-primary);">
						<p style="line-height: var(--line-height-relaxed);">
							{selectedDeliberation.scenario?.description || 'No description available'}
						</p>
					</div>
				</div>

				<!-- Judgment Summary -->
				<div style="margin-bottom: var(--spacing-lg);">
					<h3 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-sm);">Integrated Judgment</h3>
					<div style="padding: var(--spacing-lg); background: var(--color-surface); border-radius: var(--radius-md);">
						<div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); margin-bottom: var(--spacing-sm);">
							<span style="color: {
								selectedDeliberation.judgment === 'permissible' ? '#4f46e5' :
								selectedDeliberation.judgment === 'impermissible' ? '#d97706' :
								'#6b7280'
							};">
								{selectedDeliberation.judgment?.toUpperCase() || 'UNCERTAIN'}
							</span>
						</div>
						<div style="margin-bottom: var(--spacing-sm);">
							<strong>Confidence:</strong>
							{((selectedDeliberation.confidence || 0) * 100).toFixed(0)}%
							({selectedDeliberation.confidenceLevel || 'unknown'})
						</div>
						<div style="margin-bottom: var(--spacing-sm);">
							<strong>Domain:</strong> {selectedDeliberation.domain || 'unknown'}
						</div>
						<div>
							<strong>Worldviews Consulted:</strong>
							{selectedDeliberation.metadata?.evaluationsCount || selectedDeliberation.worldviews?.length || 0}
						</div>
					</div>
				</div>

				<!-- Justification -->
				<div style="margin-bottom: var(--spacing-lg);">
					<h3 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-sm);">Justification</h3>
					<div style="padding: var(--spacing-md); background: var(--color-surface); border-radius: var(--radius-md);">
						<p style="line-height: var(--line-height-relaxed); color: var(--color-text);">
							{selectedDeliberation.justification || 'No justification available'}
						</p>
					</div>
				</div>

				<!-- Supporting Worldviews -->
				{#if selectedDeliberation.supportingWorldviews && selectedDeliberation.supportingWorldviews.length > 0}
					<div style="margin-bottom: var(--spacing-lg);">
						<h3 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-sm);">
							Supporting Worldviews ({selectedDeliberation.supportingWorldviews.length})
						</h3>
						<div class="flex gap-sm" style="flex-wrap: wrap;">
							{#each selectedDeliberation.supportingWorldviews as worldview}
								<span class="badge badge-success">
									{worldview}
								</span>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Minority Views -->
				{#if selectedDeliberation.minorityViews && selectedDeliberation.minorityViews.length > 0}
					<div style="margin-bottom: var(--spacing-lg);">
						<h3 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-sm);">
							Dissenting Perspectives ({selectedDeliberation.minorityViews.length})
						</h3>
						<p style="color: var(--color-text-muted); font-size: var(--font-size-sm); margin-bottom: var(--spacing-md);">
							These worldviews reached different conclusions. Their perspectives are preserved for epistemic humility.
						</p>
						<div class="flex-col gap-sm">
							{#each selectedDeliberation.minorityViews as view}
								<div style="padding: var(--spacing-md); background: var(--color-surface); border-left: 3px solid #d97706; border-radius: var(--radius-md);">
									<div style="margin-bottom: var(--spacing-xs);">
										<strong>{view.worldview}:</strong>
										<span class="badge badge-warning" style="margin-left: var(--spacing-xs);">
											{view.judgment}
										</span>
									</div>
									{#if view.reasoning}
										<p style="color: var(--color-text-muted); font-size: var(--font-size-sm); line-height: var(--line-height-relaxed);">
											{view.reasoning}
										</p>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Metadata -->
				<div style="padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border);">
					<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-md); color: var(--color-text-muted); font-size: var(--font-size-sm);">
						<div>
							<strong style="color: var(--color-text);">Deliberation ID:</strong><br>
							<code style="font-size: var(--font-size-xs);">{selectedDeliberation.id}</code>
						</div>
						<div>
							<strong style="color: var(--color-text);">Completed:</strong><br>
							{new Date(selectedDeliberation.timestamp).toLocaleString()}
						</div>
						<div>
							<strong style="color: var(--color-text);">Conflicts:</strong><br>
							{selectedDeliberation.metadata?.conflictsCount || 0}
						</div>
					</div>
				</div>

				<!-- Actions -->
				<div style="margin-top: var(--spacing-lg); display: flex; gap: var(--spacing-md); flex-wrap: wrap;">
					<a href="{base}/deliberate" class="button button-secondary">
						New Deliberation
					</a>
					<button
						class="button button-secondary"
						style="background: var(--color-error); color: white;"
						on:click={() => handleDelete(selectedDeliberation.id)}
					>
						Delete
					</button>
				</div>
			</section>
		{/if}

		<!-- Comparison Mode Interface -->
		{#if comparisonMode}
			<section class="card">
				<div style="margin-bottom: var(--spacing-lg);">
					<h2 style="margin-bottom: var(--spacing-sm);">Select Deliberations to Compare</h2>
					<p style="color: var(--color-text-muted); font-size: var(--font-size-sm);">
						Click on two deliberations from the table above to see a side-by-side comparison
					</p>
				</div>

				<!-- Comparison Selection -->
				<div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg); margin-bottom: var(--spacing-lg);">
					<div class="comparison-slot" class:selected={comparisonDeliberation1}>
						<h4>Deliberation 1</h4>
						{#if comparisonDeliberation1}
							<div class="selected-preview">
								<p><strong>Domain:</strong> {comparisonDeliberation1.domain}</p>
								<p><strong>Judgment:</strong> <span class="badge badge-{comparisonDeliberation1.judgment}">{comparisonDeliberation1.judgment}</span></p>
								<p><strong>Date:</strong> {new Date(comparisonDeliberation1.timestamp).toLocaleDateString()}</p>
								<button
									class="button button-secondary"
									style="margin-top: var(--spacing-sm);"
									on:click={() => comparisonDeliberation1 = null}
								>
									Clear
								</button>
							</div>
						{:else}
							<p style="color: var(--color-text-muted); font-style: italic;">
								Select a deliberation from the table
							</p>
						{/if}
					</div>

					<div class="comparison-slot" class:selected={comparisonDeliberation2}>
						<h4>Deliberation 2</h4>
						{#if comparisonDeliberation2}
							<div class="selected-preview">
								<p><strong>Domain:</strong> {comparisonDeliberation2.domain}</p>
								<p><strong>Judgment:</strong> <span class="badge badge-{comparisonDeliberation2.judgment}">{comparisonDeliberation2.judgment}</span></p>
								<p><strong>Date:</strong> {new Date(comparisonDeliberation2.timestamp).toLocaleDateString()}</p>
								<button
									class="button button-secondary"
									style="margin-top: var(--spacing-sm);"
									on:click={() => comparisonDeliberation2 = null}
								>
									Clear
								</button>
							</div>
						{:else}
							<p style="color: var(--color-text-muted); font-style: italic;">
								Select a deliberation from the table
							</p>
						{/if}
					</div>
				</div>
			</section>

			<!-- Deliberation Comparison Component -->
			{#if comparisonDeliberation1 && comparisonDeliberation2}
				<section>
					<DeliberationComparison
						deliberation1={comparisonDeliberation1}
						deliberation2={comparisonDeliberation2}
					/>
				</section>
			{/if}
		{/if}
	</main>
</div>

<style>
	.badge {
		display: inline-block;
		padding: var(--spacing-xs) var(--spacing-md);
		border-radius: var(--radius-md);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		white-space: nowrap;
	}

	.badge-success {
		background: #4f46e5;
		color: white;
	}

	.badge-warning {
		background: #d97706;
		color: white;
	}

	code {
		padding: 2px 6px;
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-family: 'Courier New', monospace;
		font-size: 0.9em;
	}

	h2 {
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-bold);
		color: var(--color-text);
	}

	h3 {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
	}

	.comparison-slot {
		padding: var(--spacing-lg);
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-surface);
		transition: all var(--transition-fast);
	}

	.comparison-slot.selected {
		border-color: var(--color-primary);
		border-style: solid;
		background: rgba(37, 99, 235, 0.05);
	}

	.comparison-slot h4 {
		margin: 0 0 var(--spacing-md) 0;
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
	}

	.selected-preview p {
		margin: 0 0 var(--spacing-xs) 0;
		font-size: var(--font-size-sm);
		color: var(--color-text);
	}
</style>
