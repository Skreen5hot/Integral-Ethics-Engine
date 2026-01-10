<script>
	import { onMount } from 'svelte';
	import { session } from '$lib/stores';
	import { base } from '$app/paths';

	let recentHistory = [];
	let isLoading = true;

	onMount(() => {
		// Load recent history from session store
		const unsubscribe = session.subscribe(state => {
			// Get the 3 most recent deliberations
			recentHistory = (state.history || [])
				.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
				.slice(0, 3);
			isLoading = false;
		});

		return unsubscribe;
	});

	// Format timestamp
	function formatTimestamp(timestamp) {
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
		if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
		if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
		return date.toLocaleDateString();
	}

	// Get judgment color
	function getJudgmentColor(judgment) {
		if (judgment === 'permissible') return '#4f46e5';
		if (judgment === 'impermissible') return '#d97706';
		return '#6b7280';
	}
</script>

<div class="container">
	<header style="padding: var(--spacing-2xl) 0;">
		<h1>Integral Ethics Engine</h1>
		<p style="font-size: var(--font-size-lg); color: var(--color-text-muted);">
			Multi-perspectival ethical deliberation framework
		</p>
	</header>

	<main class="flex-col gap-lg">
		<section class="card">
			<h2>Welcome</h2>
			<p>
				The Integral Ethics Engine helps you deliberate on ethical scenarios by consulting
				12 distinct worldviews, identifying value conflicts, and synthesizing integrated judgments.
			</p>
			<p>
				This application follows a 7-step integration procedure to provide transparent,
				philosophically-grounded ethical deliberation.
			</p>
		</section>

		<!-- Recent History Preview -->
		{#if !isLoading && recentHistory.length > 0}
			<section class="card" style="background: var(--color-surface);">
				<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
					<h3 style="margin: 0;">Recent Deliberations</h3>
					<a href="{base}/history" style="font-size: var(--font-size-sm); color: var(--color-primary);">
						View All →
					</a>
				</div>

				<div class="flex-col gap-sm">
					{#each recentHistory as deliberation}
						<a href="{base}/history" class="recent-item">
							<div class="recent-header">
								<span
									class="judgment-badge"
									style="background-color: {getJudgmentColor(deliberation.judgment)};"
								>
									{deliberation.judgment}
								</span>
								<span class="timestamp">{formatTimestamp(deliberation.timestamp)}</span>
							</div>
							<p class="scenario-preview">
								{deliberation.scenario?.description?.slice(0, 120) || 'No description'}
								{#if deliberation.scenario?.description?.length > 120}...{/if}
							</p>
							<div class="metadata">
								<span class="domain">{deliberation.domain || 'Unknown'}</span>
								<span class="confidence">
									{((deliberation.confidence || 0) * 100).toFixed(0)}% confidence
								</span>
								{#if deliberation.metadata?.conflictsCount > 0}
									<span class="conflicts">
										{deliberation.metadata.conflictsCount} conflict{deliberation.metadata.conflictsCount !== 1 ? 's' : ''}
									</span>
								{/if}
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		<section class="card">
			<h3>Features</h3>
			<ul style="list-style: disc; margin-left: var(--spacing-lg); line-height: var(--line-height-relaxed);">
				<li>12 worldview perspectives (Materialism, Spiritualism, Rationalism, etc.)</li>
				<li>Domain-specific contextualization (Healthcare, Spiritual, Education, etc.)</li>
				<li>Transparent conflict resolution with minority view preservation</li>
				<li>Epistemic humility - acknowledging uncertainty and limitations</li>
				<li>Offline-capable Progressive Web App</li>
			</ul>
		</section>

		<section class="flex gap-md" style="margin-top: var(--spacing-lg);">
			<a href="{base}/deliberate" class="button">
				Start Deliberation
			</a>
			<a href="{base}/worldviews" class="button button-secondary">
				Explore Worldviews
			</a>
			{#if recentHistory.length > 0}
				<a href="{base}/history" class="button button-secondary">
					View History
				</a>
			{/if}
		</section>
	</main>
</div>

<style>
	header {
		text-align: center;
		border-bottom: 2px solid var(--color-border);
	}

	main {
		padding-bottom: var(--spacing-2xl);
	}

	ul {
		color: var(--color-text);
	}

	.recent-item {
		display: block;
		padding: var(--spacing-md);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		text-decoration: none;
		color: var(--color-text);
		transition: all var(--transition-fast);
	}

	.recent-item:hover {
		border-color: var(--color-primary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transform: translateY(-1px);
	}

	.recent-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-sm);
		gap: var(--spacing-sm);
	}

	.judgment-badge {
		display: inline-block;
		padding: var(--spacing-xs) var(--spacing-md);
		border-radius: var(--radius-md);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		color: white;
		text-transform: uppercase;
	}

	.timestamp {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.scenario-preview {
		margin: var(--spacing-sm) 0;
		font-size: var(--font-size-sm);
		color: var(--color-text);
		line-height: var(--line-height-relaxed);
	}

	.metadata {
		display: flex;
		gap: var(--spacing-md);
		flex-wrap: wrap;
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
	}

	.metadata span {
		display: inline-flex;
		align-items: center;
	}

	.domain {
		font-weight: var(--font-weight-medium);
		color: var(--color-primary);
	}

	.conflicts {
		color: #d97706;
	}
</style>
