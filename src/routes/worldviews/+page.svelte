<script>
	import { WorldviewComparison } from '$lib/components';
	import { base } from '$app/paths';

	const worldviews = [
		{
			name: 'Materialism',
			cluster: 'Material-Empirical',
			foundation: 'matter',
			description: 'Reality is fundamentally physical matter and energy. Ethical value derives from material wellbeing, physical autonomy, and empirical consequences.'
		},
		{
			name: 'Sensationalism',
			cluster: 'Material-Empirical',
			foundation: 'sensation',
			description: 'Knowledge and value derive from sensory experience. Ethics focuses on pleasure, pain, and empirically observable welfare.'
		},
		{
			name: 'Phenomenalism',
			cluster: 'Material-Empirical',
			foundation: 'phenomena',
			description: 'Reality consists of observable phenomena. Ethical judgment is based on experiential consequences and phenomenological analysis.'
		},
		{
			name: 'Realism',
			cluster: 'Material-Empirical',
			foundation: 'external_reality',
			description: 'An objective external reality exists independent of perception. Ethics grounded in objective facts about wellbeing and harm.'
		},
		{
			name: 'Dynamism',
			cluster: 'Process-Individual',
			foundation: 'becoming',
			description: 'Reality is fundamentally process and change. Ethics emphasizes growth, transformation, and dynamic balance.'
		},
		{
			name: 'Monadism',
			cluster: 'Process-Individual',
			foundation: 'individual_monad',
			description: 'Each being is a unique, irreducible individual. Ethics centers on individual autonomy, uniqueness, and self-determination.'
		},
		{
			name: 'Idealism',
			cluster: 'Process-Individual',
			foundation: 'consciousness',
			description: 'Mind and consciousness are primary. Ethical value derives from conscious experience, intention, and mental states.'
		},
		{
			name: 'Rationalism',
			cluster: 'Process-Individual',
			foundation: 'reason',
			description: 'Reason is the foundation of knowledge and value. Ethics based on logical consistency, rational principles, and universal laws.'
		},
		{
			name: 'Psychism',
			cluster: 'Depth-Spiritual',
			foundation: 'psyche',
			description: 'The psyche and unconscious depths shape experience. Ethics involves archetypal patterns, symbolic meaning, and psychological wholeness.'
		},
		{
			name: 'Pneumatism',
			cluster: 'Depth-Spiritual',
			foundation: 'living_spirit',
			description: 'Living spirit permeates all existence (animism). Ethics respects ensouled nature, spirits, and the web of life.'
		},
		{
			name: 'Spiritualism',
			cluster: 'Depth-Spiritual',
			foundation: 'transcendent_spirit',
			description: 'Transcendent divine spirit is ultimate reality. Ethics derives from sacred principles, divine will, and spiritual truth.'
		},
		{
			name: 'Mathematism',
			cluster: 'Depth-Spiritual',
			foundation: 'mathematical_form',
			description: 'Mathematical forms and structures are fundamental. Ethics based on harmony, proportion, and formal beauty (Platonic).'
		}
	];

	const clusters = {
		'Material-Empirical': {
			color: '#10b981',
			description: 'Worldviews grounded in physical reality, empirical observation, and material wellbeing.'
		},
		'Process-Individual': {
			color: '#3b82f6',
			description: 'Worldviews emphasizing process, change, individual uniqueness, and rational principles.'
		},
		'Depth-Spiritual': {
			color: '#8b5cf6',
			description: 'Worldviews exploring psychological depths, spiritual dimensions, and transcendent realities.'
		}
	};

	let selectedCluster = null;

	function filterByCluster(cluster) {
		selectedCluster = selectedCluster === cluster ? null : cluster;
	}

	$: filteredWorldviews = selectedCluster
		? worldviews.filter(wv => wv.cluster === selectedCluster)
		: worldviews;

	// Convert worldviews array to object for comparison component
	$: worldviewsObject = worldviews.reduce((acc, wv) => {
		acc[wv.name] = {
			cluster: wv.cluster,
			foundation: wv.foundation,
			description: wv.description,
			// Add placeholder values and other properties
			values: [], // Will be populated based on worldview type
			keyPhilosophers: [],
			foundationalConcept: wv.foundation,
			weight: 1.0
		};
		return acc;
	}, {});
</script>

<div class="container" style="padding: var(--spacing-2xl) 0;">
	<header style="margin-bottom: var(--spacing-2xl);">
		<h1>12 Worldviews</h1>
		<p style="color: var(--color-text-muted); max-width: 800px;">
			The Integral Ethics Engine consults 12 distinct worldviews, organized into 3 philosophical clusters.
			Each worldview provides a unique perspective on ethical questions.
		</p>
	</header>

	<!-- Cluster Filter -->
	<section style="margin-bottom: var(--spacing-2xl);">
		<h2>Philosophical Clusters</h2>
		<div class="flex gap-md" style="flex-wrap: wrap; margin-top: var(--spacing-md);">
			{#each Object.entries(clusters) as [cluster, info]}
				<button
					class="button {selectedCluster === cluster ? '' : 'button-secondary'}"
					style="border-left: 4px solid {info.color};"
					on:click={() => filterByCluster(cluster)}
				>
					{cluster}
				</button>
			{/each}
			{#if selectedCluster}
				<button class="button button-secondary" on:click={() => selectedCluster = null}>
					Show All
				</button>
			{/if}
		</div>

		{#if selectedCluster}
			<p style="margin-top: var(--spacing-md); padding: var(--spacing-md); background: var(--color-surface); border-radius: var(--radius-md); border-left: 4px solid {clusters[selectedCluster].color};">
				{clusters[selectedCluster].description}
			</p>
		{/if}
	</section>

	<!-- Worldview Comparison Tool -->
	<section style="margin-bottom: var(--spacing-2xl);">
		<WorldviewComparison worldviews={worldviewsObject} />
	</section>

	<!-- Worldview Cards -->
	<section class="flex-col gap-md">
		{#each filteredWorldviews as worldview}
			<div class="card" style="border-left: 4px solid {clusters[worldview.cluster].color};">
				<div class="flex justify-between items-center" style="margin-bottom: var(--spacing-sm);">
					<h3 style="margin: 0;">{worldview.name}</h3>
					<span style="padding: var(--spacing-xs) var(--spacing-md); background: {clusters[worldview.cluster].color}; color: white; border-radius: var(--radius-md); font-size: var(--font-size-sm);">
						{worldview.cluster}
					</span>
				</div>

				<div style="margin-bottom: var(--spacing-sm);">
					<strong>Foundation:</strong>
					<span style="color: var(--color-text-muted); font-family: var(--font-mono); font-size: var(--font-size-sm);">
						{worldview.foundation}
					</span>
				</div>

				<p style="color: var(--color-text); line-height: var(--line-height-relaxed);">
					{worldview.description}
				</p>
			</div>
		{/each}
	</section>

	<!-- Information Section -->
	<section class="card" style="margin-top: var(--spacing-2xl); background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-background) 100%);">
		<h2>How Worldviews Work in Deliberation</h2>

		<div class="flex-col gap-md" style="margin-top: var(--spacing-lg);">
			<div>
				<h3>1. Multi-Perspectival Analysis</h3>
				<p>Each worldview evaluates your scenario independently, providing its own judgment, confidence level, and reasoning.</p>
			</div>

			<div>
				<h3>2. Domain Weighting</h3>
				<p>Worldviews are weighted differently depending on the domain (e.g., Materialism has high weight in healthcare, Spiritualism in spiritual domains).</p>
			</div>

			<div>
				<h3>3. Conflict Resolution</h3>
				<p>When worldviews disagree, the 7-step integration procedure identifies conflicts, applies domain weights, and synthesizes an integrated judgment.</p>
			</div>

			<div>
				<h3>4. Minority View Preservation</h3>
				<p>Dissenting perspectives are always preserved and presented alongside the integrated judgment, ensuring epistemic humility.</p>
			</div>
		</div>
	</section>

	<!-- Back Button -->
	<div style="margin-top: var(--spacing-2xl); text-align: center;">
		<a href="{base}/" class="button button-secondary">← Back to Home</a>
		<a href="{base}/deliberate" class="button" style="margin-left: var(--spacing-md);">Start Deliberation →</a>
	</div>
</div>

<style>
	.card {
		transition: transform var(--transition-fast), box-shadow var(--transition-fast);
	}

	.card:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}
</style>
