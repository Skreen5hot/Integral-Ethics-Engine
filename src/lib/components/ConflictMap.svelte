<script>
	/**
	 * ConflictMap Component - Twelve-Worldview Radial Chart
	 *
	 * Implements MDI v2.0 specification:
	 * - Radial Distance = Moral Salience (domain weight)
	 * - Color Hue = Judgment Polarity (Indigo/Ochre, NOT red/green)
	 * - Opacity = Uncertainty (high uncertainty = fuzzy/transparent)
	 * - Texture = Internal Tension (dashed arcs)
	 * - Void Center = "Space of Freedom" (NO single verdict)
	 * - Constellation Overlay = Lines connecting tensions
	 */

	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	// Props
	export let worldviews = []; // Array of worldview evaluations
	export let conflicts = []; // Array of conflict pairs
	export let width = 600;
	export let height = 600;

	// PHASE 4: Contested judgment visualization
	export let isContested = false;
	export let winningJudgment = null; // The winning judgment (permissible/impermissible/uncertain)
	export let secondPlace = null; // The second-place judgment
	export let margin = null; // Absolute margin
	export let marginPercent = null; // Margin as percentage

	let svgElement;

	// Cluster definitions (for subtle background shading)
	const clusters = [
		{
			name: 'Material-Empirical',
			worldviews: ['materialism', 'sensationalism', 'phenomenalism', 'realism'],
			color: '#10b981'
		},
		{
			name: 'Process-Individual',
			worldviews: ['dynamism', 'monadism', 'idealism', 'rationalism'],
			color: '#3b82f6'
		},
		{
			name: 'Depth-Spiritual',
			worldviews: ['psychism', 'pneumatism', 'spiritualism', 'mathematism'],
			color: '#8b5cf6'
		}
	];

	// Judgment colors (divergent palette per MDI v2.0)
	const judgmentColors = {
		permissible: '#4f46e5', // Indigo (Affirming)
		impermissible: '#d97706', // Ochre (Concerning)
		uncertain: '#6b7280' // Gray (Ambiguous)
	};

	// Worldview order (fixed positions) - lowercase to match worldviewManager
	const worldviewOrder = [
		'materialism', 'sensationalism', 'phenomenalism', 'realism', // Material-Empirical
		'dynamism', 'monadism', 'idealism', 'rationalism', // Process-Individual
		'psychism', 'pneumatism', 'spiritualism', 'mathematism' // Depth-Spiritual
	];

	function renderChart() {
		if (!svgElement || !worldviews || worldviews.length === 0) return;

		// Clear previous render
		d3.select(svgElement).selectAll('*').remove();

		const margin = 80;
		const radius = Math.min(width, height) / 2 - margin;
		const centerX = width / 2;
		const centerY = height / 2;

		const svg = d3.select(svgElement)
			.attr('width', width)
			.attr('height', height);

		const g = svg.append('g')
			.attr('transform', `translate(${centerX}, ${centerY})`);

		// Calculate angles for each worldview
		const angleStep = (2 * Math.PI) / 12;

		// Draw cluster background shading
		clusters.forEach((cluster, clusterIdx) => {
			const startIdx = clusterIdx * 4;
			const startAngle = startIdx * angleStep - Math.PI / 2;
			const endAngle = (startIdx + 4) * angleStep - Math.PI / 2;

			const arc = d3.arc()
				.innerRadius(0)
				.outerRadius(radius)
				.startAngle(startAngle)
				.endAngle(endAngle);

			g.append('path')
				.attr('d', arc)
				.attr('fill', cluster.color)
				.attr('opacity', 0.05)
				.attr('class', 'cluster-background');
		});

		// Draw worldview arcs
		worldviews.forEach((wv, idx) => {
			const worldviewIdx = worldviewOrder.indexOf(wv.worldview.toLowerCase());
			if (worldviewIdx === -1) {
				console.warn(`Worldview ${wv.worldview} not found in worldviewOrder`);
				return;
			}

			const angle = worldviewIdx * angleStep - Math.PI / 2;
			const nextAngle = (worldviewIdx + 1) * angleStep - Math.PI / 2;

			// Moral Salience = Radial Distance (using domain weight)
			const salience = wv.weight || 0.5;
			const arcRadius = radius * salience;

			// Uncertainty affects opacity
			const uncertainty = 1 - wv.confidence;
			const opacity = 1 - (uncertainty * 0.5); // Max 50% opacity reduction

			// Judgment determines color
			const color = judgmentColors[wv.judgment] || judgmentColors.uncertain;

			// High uncertainty creates dashed arcs (internal tension)
			const isDashed = uncertainty > 0.4;

			// PHASE 4: Contested judgment styling
			const isWinningJudgment = isContested && wv.judgment === winningJudgment;
			const isSecondPlaceJudgment = isContested && wv.judgment === secondPlace;

			// Draw arc
			const arc = d3.arc()
				.innerRadius(radius * 0.3) // Inner ring
				.outerRadius(arcRadius)
				.startAngle(angle)
				.endAngle(nextAngle - 0.05); // Small gap between arcs

			const path = g.append('path')
				.attr('d', arc)
				.attr('fill', color)
				.attr('opacity', opacity)
				.attr('stroke', isWinningJudgment ? '#fb923c' : (isSecondPlaceJudgment ? '#fbbf24' : color)) // Orange for winner, amber for second
				.attr('stroke-width', isWinningJudgment ? 4 : (isSecondPlaceJudgment ? 3 : 2))
				.attr('class', `worldview-arc ${isWinningJudgment ? 'contested-winner' : ''} ${isSecondPlaceJudgment ? 'contested-second' : ''}`);

			if (isDashed) {
				path.attr('stroke-dasharray', '5,5');
			}

			// PHASE 4: Add tooltip on hover
			path.append('title')
				.text(() => {
					let tooltip = `${wv.worldview}\nJudgment: ${wv.judgment}\nConfidence: ${(wv.confidence * 100).toFixed(0)}%\nWeight: ${(wv.weight * 100).toFixed(0)}%`;
					if (isContested) {
						tooltip += `\n\nContested Judgment:`;
						tooltip += `\nMargin: ${marginPercent !== null ? (marginPercent * 100).toFixed(1) : '~'}%`;
						if (isWinningJudgment) {
							tooltip += `\n(Winner by narrow margin)`;
						} else if (isSecondPlaceJudgment) {
							tooltip += `\n(Second place)`;
						}
					}
					return tooltip;
				});

			// Worldview label
			const labelAngle = angle + (angleStep / 2);
			const labelRadius = radius + 20;
			const labelX = Math.cos(labelAngle) * labelRadius;
			const labelY = Math.sin(labelAngle) * labelRadius;

			g.append('text')
				.attr('x', labelX)
				.attr('y', labelY)
				.attr('text-anchor', 'middle')
				.attr('dominant-baseline', 'middle')
				.attr('font-size', '12px')
				.attr('font-weight', '600')
				.attr('fill', '#374151')
				.text(wv.worldview);
		});

		// Draw "Constellation Overlay" - lines connecting conflicts
		if (conflicts && conflicts.length > 0) {
			conflicts.forEach(conflict => {
				const idx1 = worldviewOrder.indexOf(conflict.worldviews?.[0]);
				const idx2 = worldviewOrder.indexOf(conflict.worldviews?.[1]);

				if (idx1 === -1 || idx2 === -1) return;

				const angle1 = idx1 * angleStep - Math.PI / 2;
				const angle2 = idx2 * angleStep - Math.PI / 2;

				// Connect at inner radius
				const connectRadius = radius * 0.35;

				const x1 = Math.cos(angle1 + angleStep / 2) * connectRadius;
				const y1 = Math.sin(angle1 + angleStep / 2) * connectRadius;
				const x2 = Math.cos(angle2 + angleStep / 2) * connectRadius;
				const y2 = Math.sin(angle2 + angleStep / 2) * connectRadius;

				g.append('line')
					.attr('x1', x1)
					.attr('y1', y1)
					.attr('x2', x2)
					.attr('y2', y2)
					.attr('stroke', '#ef4444')
					.attr('stroke-width', 1.5)
					.attr('stroke-dasharray', '3,3')
					.attr('opacity', 0.6)
					.attr('class', 'conflict-line');
			});
		}

		// "Void Center" - The Space of Freedom (per MDI v2.0)
		g.append('circle')
			.attr('r', radius * 0.25)
			.attr('fill', 'none')
			.attr('stroke', '#d1d5db')
			.attr('stroke-width', 2)
			.attr('stroke-dasharray', '2,2')
			.attr('opacity', 0.5);

		g.append('text')
			.attr('text-anchor', 'middle')
			.attr('dominant-baseline', 'middle')
			.attr('font-size', '11px')
			.attr('font-style', 'italic')
			.attr('fill', '#9ca3af')
			.text('Space of Freedom');
	}

	onMount(() => {
		renderChart();
	});

	// Re-render when props change
	$: if (worldviews && svgElement) {
		renderChart();
	}
</script>

<div class="conflict-map-container">
	<!-- MDI v2.0 Agent Status Indicator (persistent) -->
	<div class="agent-status">
		<strong>Model Output:</strong> Multi-perspectival Analysis.
		<span style="font-style: italic;">
			This system bears no moral cost for this evaluation. Action requires human agency.
		</span>
	</div>

	<!-- SVG Chart -->
	<svg bind:this={svgElement} class="conflict-map-svg"></svg>

	<!-- Legend -->
	<div class="legend">
		<div class="legend-title">Visual Encoding</div>
		<div class="legend-items">
			<div class="legend-item">
				<div class="legend-swatch" style="background: linear-gradient(to right, transparent, {judgmentColors.permissible});"></div>
				<span>Radial Distance = Moral Salience</span>
			</div>
			<div class="legend-item">
				<div class="legend-swatch" style="background: {judgmentColors.permissible};"></div>
				<span>Indigo = Affirming</span>
			</div>
			<div class="legend-item">
				<div class="legend-swatch" style="background: {judgmentColors.impermissible};"></div>
				<span>Ochre = Concerning</span>
			</div>
			<div class="legend-item">
				<div class="legend-swatch" style="background: {judgmentColors.uncertain};"></div>
				<span>Gray = Uncertain</span>
			</div>
			<div class="legend-item">
				<div class="legend-swatch dashed"></div>
				<span>Dashed = High Uncertainty</span>
			</div>
			<div class="legend-item">
				<div class="legend-swatch" style="background: #ef4444; opacity: 0.6;"></div>
				<span>Red Lines = Conflicts</span>
			</div>
			{#if isContested}
				<div class="legend-item contested-indicator">
					<div class="legend-swatch" style="background: #fb923c; border: 3px solid #fb923c;"></div>
					<span>Orange Stroke = Winner (Contested)</span>
				</div>
				<div class="legend-item contested-indicator">
					<div class="legend-swatch" style="background: #fbbf24; border: 2px solid #fbbf24;"></div>
					<span>Amber Stroke = Second Place</span>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.conflict-map-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-lg);
		padding: var(--spacing-lg);
		background: var(--color-surface);
		border-radius: var(--radius-lg);
	}

	.agent-status {
		width: 100%;
		padding: var(--spacing-md);
		background: rgba(239, 68, 68, 0.05);
		border: 1px solid rgba(239, 68, 68, 0.2);
		border-radius: var(--radius-md);
		font-size: 14px;
		text-align: center;
		color: var(--color-text);
	}

	.agent-status strong {
		font-weight: var(--font-weight-semibold);
	}

	.conflict-map-svg {
		display: block;
	}

	.legend {
		width: 100%;
		padding: var(--spacing-md);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.legend-title {
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-semibold);
		margin-bottom: var(--spacing-sm);
		color: var(--color-text);
	}

	.legend-items {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--spacing-sm);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.legend-swatch {
		width: 24px;
		height: 16px;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
	}

	.legend-swatch.dashed {
		background: linear-gradient(to right, #6b7280 50%, transparent 50%);
		background-size: 8px 100%;
	}

	:global(.worldview-arc) {
		cursor: pointer;
		transition: opacity var(--transition-fast);
	}

	:global(.worldview-arc:hover) {
		opacity: 1 !important;
	}

	:global(.cluster-background) {
		pointer-events: none;
	}

	:global(.conflict-line) {
		pointer-events: none;
	}

	/* PHASE 4: Contested judgment styles */
	:global(.contested-winner) {
		stroke: #fb923c !important;
		stroke-width: 4px !important;
		filter: drop-shadow(0 0 4px rgba(251, 146, 60, 0.6));
	}

	:global(.contested-second) {
		stroke: #fbbf24 !important;
		stroke-width: 3px !important;
		filter: drop-shadow(0 0 3px rgba(251, 191, 36, 0.5));
	}

	.contested-indicator {
		font-weight: var(--font-weight-semibold);
		color: #ea580c;
	}
</style>
