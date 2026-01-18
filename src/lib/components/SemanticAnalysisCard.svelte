<!--
  SemanticAnalysisCard.svelte

  Displays TagTeam semantic analysis results with detected values,
  semantic roles, context intensity, and value conflicts.

  @component
  @version 1.0.0
-->

<script>
	/**
	 * @type {Object} semanticAnalysis - TagTeam semantic analysis result from deliberationOrchestrator
	 * @property {string} source - Analysis source ('TagTeam')
	 * @property {string} version - TagTeam version
	 * @property {string} agent - Semantic agent (who acts)
	 * @property {string} action - Semantic action (what happens)
	 * @property {string} patient - Semantic patient (who is affected)
	 * @property {string} semanticFrame - Frame category
	 * @property {Object} contextIntensity - 12-dimensional context scores
	 * @property {Array} detectedValues - Detected ethical values
	 * @property {string} dominantDomain - TagTeam's dominant domain
	 * @property {string} suggestedIEEDomain - IEE domain suggestion
	 * @property {Array} valueConflicts - Detected conflicts
	 * @property {number} conflictScore - Overall conflict intensity
	 * @property {number} confidence - Analysis confidence (0-1)
	 */
	export let semanticAnalysis = null;

	let expanded = false;

	// Domain badge colors
	const domainColors = {
		'Care': '#e3f2fd',
		'Dignity': '#f3e5f5',
		'Virtue': '#fff3e0',
		'Community': '#e8f5e9',
		'Transcendence': '#fce4ec'
	};

	// Polarity labels
	const polarityLabels = {
		1: 'Upheld',
		0: 'Neutral',
		'-1': 'Violated'
	};

	const polarityColors = {
		1: 'var(--color-success)',
		0: 'var(--color-text-muted)',
		'-1': 'var(--color-error)'
	};

	// Format salience score for display
	function formatSalience(salience) {
		return (salience * 100).toFixed(0) + '%';
	}

	// Get top context dimensions
	function getTopContextDimensions(contextIntensity, limit = 5) {
		if (!contextIntensity) return [];

		return Object.entries(contextIntensity)
			.sort((a, b) => b[1] - a[1])
			.slice(0, limit)
			.map(([dimension, intensity]) => ({
				dimension: dimension.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
				intensity
			}));
	}

	// Extract text from TagTeam semantic role objects
	function extractRoleText(role) {
		if (!role) return 'Unknown';
		if (typeof role === 'string') return role;
		if (typeof role === 'object') {
			// TagTeam returns objects like { text: "...", lemma: "...", ... }
			return role.text || role.lemma || role.word || JSON.stringify(role);
		}
		return String(role);
	}
</script>

{#if semanticAnalysis}
	<div class="card semantic-analysis-card">
		<div class="card-header">
			<div style="display: flex; align-items: center; gap: var(--spacing-sm);">
				<span style="font-size: 1.5rem;">🧠</span>
				<div>
					<h3 style="margin: 0;">Semantic Analysis</h3>
					<p style="margin: 0; font-size: var(--font-size-sm); color: var(--color-text-muted);">
						Powered by TagTeam v{semanticAnalysis.version} · Confidence: {formatSalience(semanticAnalysis.confidence)}
					</p>
				</div>
			</div>
			<button
				type="button"
				class="button button-secondary"
				on:click={() => expanded = !expanded}
				style="font-size: var(--font-size-sm);"
			>
				{expanded ? 'Collapse' : 'Expand Details'}
			</button>
		</div>

		<!-- Semantic Roles -->
		<div class="semantic-section">
			<h4>Semantic Structure</h4>
			<div class="semantic-roles">
				<div class="role-item">
					<span class="role-label">Agent:</span>
					<span class="role-value">{extractRoleText(semanticAnalysis.agent)}</span>
				</div>
				<div class="role-item">
					<span class="role-label">Action:</span>
					<span class="role-value">{extractRoleText(semanticAnalysis.action)}</span>
				</div>
				<div class="role-item">
					<span class="role-label">Patient:</span>
					<span class="role-value">{extractRoleText(semanticAnalysis.patient)}</span>
				</div>
				<div class="role-item">
					<span class="role-label">Frame:</span>
					<span class="role-value">{semanticAnalysis.semanticFrame || 'Unknown'}</span>
				</div>
			</div>
		</div>

		<!-- Detected Values -->
		<div class="semantic-section">
			<h4>
				Detected Values ({semanticAnalysis.detectedValues?.length || 0})
				<span class="domain-badge" style="background: {domainColors[semanticAnalysis.dominantDomain] || '#f5f5f5'};">
					{semanticAnalysis.dominantDomain || 'Unknown'} Domain
				</span>
			</h4>

			{#if semanticAnalysis.detectedValues && semanticAnalysis.detectedValues.length > 0}
				<div class="values-grid">
					{#each semanticAnalysis.detectedValues as value}
						<div class="value-card">
							<div class="value-header">
								<span class="value-name">{value.name}</span>
								<span
									class="polarity-badge"
									style="color: {polarityColors[value.polarity] || 'var(--color-text-muted)'};"
								>
									{polarityLabels[value.polarity] || 'Unknown'}
								</span>
							</div>
							<div class="value-meta">
								<span class="salience">Salience: {formatSalience(value.salience)}</span>
								{#if value.domain}
									<span class="domain-tag">{value.domain}</span>
								{/if}
							</div>
							{#if value.evidence && value.evidence.length > 0}
								<div class="evidence">
									<span class="evidence-label">Evidence:</span>
									<span class="evidence-text">"{value.evidence.join('", "')}"</span>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{:else}
				<p style="color: var(--color-text-muted); font-style: italic;">
					No values detected above confidence threshold
				</p>
			{/if}
		</div>

		<!-- Value Conflicts -->
		{#if semanticAnalysis.valueConflicts && semanticAnalysis.valueConflicts.length > 0}
			<div class="semantic-section conflict-section">
				<h4>
					Value Conflicts Detected ({semanticAnalysis.valueConflicts.length})
					<span style="font-size: var(--font-size-sm); font-weight: normal; color: var(--color-text-muted);">
						Conflict Score: {(semanticAnalysis.conflictScore * 100).toFixed(0)}%
					</span>
				</h4>
				<div class="conflicts-list">
					{#each semanticAnalysis.valueConflicts as conflict}
						<div class="conflict-item">
							<span class="conflict-values">{conflict.values?.join(' ↔ ') || 'Unknown'}</span>
							<span class="conflict-severity">{conflict.severity || 'moderate'}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Expanded Details -->
		{#if expanded}
			<div class="semantic-section expanded-section">
				<h4>Context Intensity Analysis</h4>
				<p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: var(--spacing-sm);">
					Top contextual dimensions detected (12-dimensional analysis)
				</p>
				<div class="context-bars">
					{#each getTopContextDimensions(semanticAnalysis.contextIntensity) as { dimension, intensity }}
						<div class="context-item">
							<span class="context-label">{dimension}</span>
							<div class="context-bar-container">
								<div class="context-bar" style="width: {intensity * 100}%;"></div>
								<span class="context-value">{formatSalience(intensity)}</span>
							</div>
						</div>
					{/each}
				</div>

				<!-- Domain Mapping -->
				<div style="margin-top: var(--spacing-md); padding: var(--spacing-sm); background: var(--color-surface); border-radius: var(--radius-sm);">
					<p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin: 0;">
						<strong>Domain Mapping:</strong>
						TagTeam detected <strong>{semanticAnalysis.dominantDomain}</strong> domain,
						mapped to IEE's <strong>{semanticAnalysis.suggestedIEEDomain || 'general'}</strong> domain
					</p>
				</div>
			</div>
		{/if}
	</div>
{:else}
	<!-- Semantic Analysis Not Available -->
	<div class="card" style="background: var(--color-surface); border: 1px dashed var(--color-border); padding: var(--spacing-md);">
		<p style="color: var(--color-text-muted); font-size: var(--font-size-sm); margin: 0; text-align: center;">
			ℹ️ Semantic analysis not available (TagTeam not loaded or disabled)
		</p>
	</div>
{/if}

<style>
	.semantic-analysis-card {
		background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
		border: 2px solid var(--color-primary);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-lg);
		padding-bottom: var(--spacing-md);
		border-bottom: 1px solid var(--color-border);
	}

	h3 {
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-bold);
		color: var(--color-text);
	}

	h4 {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
		margin-bottom: var(--spacing-sm);
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.semantic-section {
		margin-bottom: var(--spacing-lg);
	}

	.semantic-roles {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--spacing-md);
		padding: var(--spacing-md);
		background: var(--color-surface);
		border-radius: var(--radius-md);
	}

	.role-item {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.role-label {
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.role-value {
		font-size: var(--font-size-md);
		color: var(--color-text);
		font-weight: var(--font-weight-medium);
	}

	.domain-badge {
		display: inline-block;
		padding: 2px 8px;
		border-radius: var(--radius-sm);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-medium);
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	.values-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: var(--spacing-md);
	}

	.value-card {
		padding: var(--spacing-md);
		background: white;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		transition: box-shadow 0.2s ease;
	}

	.value-card:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.value-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-xs);
	}

	.value-name {
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
	}

	.polarity-badge {
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		padding: 2px 6px;
		border-radius: var(--radius-sm);
		background: rgba(255, 255, 255, 0.8);
	}

	.value-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--spacing-xs);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.domain-tag {
		padding: 2px 6px;
		background: var(--color-surface);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-xs);
	}

	.evidence {
		margin-top: var(--spacing-xs);
		padding: var(--spacing-xs);
		background: var(--color-surface);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-xs);
	}

	.evidence-label {
		font-weight: var(--font-weight-semibold);
		color: var(--color-text-muted);
	}

	.evidence-text {
		color: var(--color-text);
		font-style: italic;
	}

	.conflict-section {
		padding: var(--spacing-md);
		background: #fff3e0;
		border-radius: var(--radius-md);
		border: 1px solid #ffb74d;
	}

	.conflicts-list {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.conflict-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-xs) var(--spacing-sm);
		background: white;
		border-radius: var(--radius-sm);
		font-size: var(--font-size-sm);
	}

	.conflict-values {
		font-weight: var(--font-weight-medium);
		color: var(--color-text);
	}

	.conflict-severity {
		padding: 2px 6px;
		background: #ffe0b2;
		border-radius: var(--radius-sm);
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		text-transform: uppercase;
	}

	.expanded-section {
		padding: var(--spacing-md);
		background: var(--color-surface);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.context-bars {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.context-item {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
	}

	.context-label {
		flex: 0 0 150px;
		font-size: var(--font-size-sm);
		color: var(--color-text);
		font-weight: var(--font-weight-medium);
	}

	.context-bar-container {
		flex: 1;
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		background: white;
		border-radius: var(--radius-sm);
		overflow: hidden;
		height: 24px;
		position: relative;
	}

	.context-bar {
		height: 100%;
		background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 100%);
		transition: width 0.3s ease;
	}

	.context-value {
		position: absolute;
		right: 8px;
		font-size: var(--font-size-xs);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
	}
</style>
