<script>
	/**
	 * HistoryTable Component
	 *
	 * Displays deliberation history with sorting, filtering, and navigation
	 * Features: sortable columns, domain filtering, clickable rows
	 */

	import { createEventDispatcher } from 'svelte';

	// Props
	export let history = []; // Array of history entries
	export let loading = false;

	const dispatch = createEventDispatcher();

	// Sorting state
	let sortBy = 'timestamp';
	let sortOrder = 'desc';

	// Filtering state
	let filterDomain = '';
	let filterJudgment = '';

	// Pagination state
	let currentPage = 1;
	let itemsPerPage = 10;

	// Sort options
	const sortOptions = [
		{ value: 'timestamp', label: 'Date' },
		{ value: 'domain', label: 'Domain' },
		{ value: 'judgment', label: 'Judgment' },
		{ value: 'confidence', label: 'Confidence' }
	];

	// Domain options
	const domainOptions = [
		{ value: '', label: 'All Domains' },
		{ value: 'healthcare', label: 'Healthcare' },
		{ value: 'spiritual', label: 'Spiritual' },
		{ value: 'education', label: 'Education' },
		{ value: 'vocational', label: 'Vocational' },
		{ value: 'environmental', label: 'Environmental' },
		{ value: 'interpersonal', label: 'Interpersonal' },
		{ value: 'intellectual', label: 'Intellectual' },
		{ value: 'general', label: 'General' }
	];

	// Judgment options
	const judgmentOptions = [
		{ value: '', label: 'All Judgments' },
		{ value: 'permissible', label: 'Permissible' },
		{ value: 'impermissible', label: 'Impermissible' },
		{ value: 'uncertain', label: 'Uncertain' }
	];

	// Filter and sort history
	$: filteredHistory = history
		.filter(entry => {
			if (filterDomain && entry.domain !== filterDomain) return false;
			if (filterJudgment && entry.judgment !== filterJudgment) return false;
			return true;
		})
		.sort((a, b) => {
			let compareA, compareB;

			switch (sortBy) {
				case 'timestamp':
					compareA = new Date(a.timestamp).getTime();
					compareB = new Date(b.timestamp).getTime();
					break;
				case 'domain':
					compareA = a.domain;
					compareB = b.domain;
					break;
				case 'judgment':
					compareA = a.judgment;
					compareB = b.judgment;
					break;
				case 'confidence':
					compareA = a.confidence;
					compareB = b.confidence;
					break;
				default:
					compareA = new Date(a.timestamp).getTime();
					compareB = new Date(b.timestamp).getTime();
			}

			if (sortOrder === 'asc') {
				return compareA > compareB ? 1 : compareA < compareB ? -1 : 0;
			} else {
				return compareA < compareB ? 1 : compareA > compareB ? -1 : 0;
			}
		});

	// Pagination
	$: totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
	$: paginatedHistory = filteredHistory.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	// Update current page when filters change
	$: if (filterDomain || filterJudgment) {
		currentPage = 1;
	}

	function handleSort(newSortBy) {
		if (sortBy === newSortBy) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = newSortBy;
			sortOrder = 'desc';
		}
	}

	function handleRowClick(entry) {
		dispatch('select', entry);
	}

	function formatDate(timestamp) {
		return new Date(timestamp).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatJudgment(judgment) {
		return judgment.charAt(0).toUpperCase() + judgment.slice(1);
	}
</script>

<div class="history-table-container">
	<!-- Filters and Controls -->
	<div class="controls-bar">
		<div class="filters">
			<select bind:value={filterDomain}>
				{#each domainOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>

			<select bind:value={filterJudgment}>
				{#each judgmentOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>

		<div class="stats">
			Showing {paginatedHistory.length} of {filteredHistory.length} deliberations
		</div>
	</div>

	<!-- Table -->
	{#if loading}
		<div class="loading-state">
			<p>Loading history...</p>
		</div>
	{:else if filteredHistory.length === 0}
		<div class="empty-state">
			<p>No deliberations found</p>
			{#if filterDomain || filterJudgment}
				<button
					class="button button-secondary"
					on:click={() => { filterDomain = ''; filterJudgment = ''; }}
				>
					Clear Filters
				</button>
			{/if}
		</div>
	{:else}
		<div class="table-wrapper">
			<table class="history-table">
				<thead>
					<tr>
						<th on:click={() => handleSort('timestamp')} class="sortable">
							Date
							{#if sortBy === 'timestamp'}
								<span class="sort-indicator">{sortOrder === 'asc' ? '▲' : '▼'}</span>
							{/if}
						</th>
						<th class="scenario-column">Scenario</th>
						<th on:click={() => handleSort('domain')} class="sortable">
							Domain
							{#if sortBy === 'domain'}
								<span class="sort-indicator">{sortOrder === 'asc' ? '▲' : '▼'}</span>
							{/if}
						</th>
						<th on:click={() => handleSort('judgment')} class="sortable">
							Judgment
							{#if sortBy === 'judgment'}
								<span class="sort-indicator">{sortOrder === 'asc' ? '▲' : '▼'}</span>
							{/if}
						</th>
						<th on:click={() => handleSort('confidence')} class="sortable">
							Confidence
							{#if sortBy === 'confidence'}
								<span class="sort-indicator">{sortOrder === 'asc' ? '▲' : '▼'}</span>
							{/if}
						</th>
						<th>Conflicts</th>
					</tr>
				</thead>
				<tbody>
					{#each paginatedHistory as entry (entry.id)}
						<tr
							class="history-row"
							on:click={() => handleRowClick(entry)}
							on:keypress={(e) => e.key === 'Enter' && handleRowClick(entry)}
							tabindex="0"
							role="button"
						>
							<td class="timestamp-cell">{formatDate(entry.timestamp)}</td>
							<td class="scenario-cell">
								<span class="scenario-preview">
									{entry.scenario.substring(0, 80)}{entry.scenario.length > 80 ? '...' : ''}
								</span>
							</td>
							<td>
								<span class="domain-badge">{entry.domain}</span>
							</td>
							<td>
								<span class="judgment-badge judgment-{entry.judgment}">
									{formatJudgment(entry.judgment)}
								</span>
							</td>
							<td>
								<div class="confidence-bar-container">
									<div class="confidence-bar" style="width: {entry.confidence * 100}%;" />
									<span class="confidence-text">{(entry.confidence * 100).toFixed(0)}%</span>
								</div>
							</td>
							<td class="conflicts-cell">
								{entry.conflictsCount || 0}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="pagination">
				<button
					class="pagination-button"
					on:click={() => currentPage = Math.max(1, currentPage - 1)}
					disabled={currentPage === 1}
				>
					← Previous
				</button>

				<span class="page-indicator">
					Page {currentPage} of {totalPages}
				</span>

				<button
					class="pagination-button"
					on:click={() => currentPage = Math.min(totalPages, currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					Next →
				</button>
			</div>
		{/if}
	{/if}
</div>

<style>
	.history-table-container {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-md);
	}

	.controls-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: var(--spacing-md);
	}

	.filters {
		display: flex;
		gap: var(--spacing-sm);
	}

	.filters select {
		padding: var(--spacing-sm) var(--spacing-md);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--font-size-sm);
	}

	.stats {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.table-wrapper {
		overflow-x: auto;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.history-table {
		width: 100%;
		border-collapse: collapse;
		background: var(--color-background);
	}

	.history-table thead {
		background: var(--color-surface);
		border-bottom: 2px solid var(--color-border);
	}

	.history-table th {
		padding: var(--spacing-md);
		text-align: left;
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
	}

	.history-table th.sortable {
		cursor: pointer;
		user-select: none;
		transition: background var(--transition-fast);
	}

	.history-table th.sortable:hover {
		background: var(--color-border);
	}

	.sort-indicator {
		margin-left: var(--spacing-xs);
		color: var(--color-primary);
	}

	.history-row {
		cursor: pointer;
		transition: background var(--transition-fast);
		border-bottom: 1px solid var(--color-border);
	}

	.history-row:hover {
		background: var(--color-surface);
	}

	.history-table td {
		padding: var(--spacing-md);
		font-size: var(--font-size-sm);
	}

	.scenario-column {
		min-width: 250px;
	}

	.scenario-preview {
		color: var(--color-text-muted);
		line-height: var(--line-height-normal);
	}

	.timestamp-cell {
		white-space: nowrap;
		color: var(--color-text-muted);
	}

	.domain-badge {
		padding: var(--spacing-xs) var(--spacing-sm);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-xs);
		text-transform: capitalize;
	}

	.judgment-badge {
		padding: var(--spacing-xs) var(--spacing-sm);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		color: white;
	}

	.judgment-badge.judgment-permissible {
		background: #4f46e5; /* Indigo */
	}

	.judgment-badge.judgment-impermissible {
		background: #d97706; /* Ochre */
	}

	.judgment-badge.judgment-uncertain {
		background: #6b7280; /* Gray */
	}

	.confidence-bar-container {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		min-width: 100px;
	}

	.confidence-bar {
		height: 6px;
		background: var(--color-primary);
		border-radius: var(--radius-sm);
		transition: width var(--transition-slow);
	}

	.confidence-text {
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		white-space: nowrap;
	}

	.conflicts-cell {
		text-align: center;
		color: var(--color-text-muted);
	}

	.loading-state,
	.empty-state {
		padding: var(--spacing-2xl);
		text-align: center;
		color: var(--color-text-muted);
	}

	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--spacing-md);
		padding: var(--spacing-md);
	}

	.pagination-button {
		padding: var(--spacing-sm) var(--spacing-md);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--font-size-sm);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.pagination-button:hover:not(:disabled) {
		background: var(--color-border);
	}

	.pagination-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.page-indicator {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}
</style>
