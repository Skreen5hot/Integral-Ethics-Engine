<script>
	import { deliberation, session } from '$lib/stores';
	import {
		ScenarioInput,
		ConflictMap,
		IntegratedJudgment,
		WorldviewCard,
		ScenarioTemplates,
		SemanticAnalysisCard
	} from '$lib/components';

	let scenario = {
		description: '',
		domain: '',
		context: {}
	};

	let isDeliberating = false;
	let error = null;
	let showAllWorldviews = false;
	let showTemplates = false;

	async function handleSubmit() {
		error = null;

		try {
			isDeliberating = true;
			const result = await deliberation.deliberate(scenario);

			// Save to history
			await session.saveDeliberation(result);

			// Scroll to results
			setTimeout(() => {
				document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
			}, 100);
		} catch (err) {
			error = err.message;
		} finally {
			isDeliberating = false;
		}
	}

	function resetForm() {
		scenario = {
			description: '',
			domain: '',
			context: {}
		};
		deliberation.reset();
		error = null;
		showAllWorldviews = false;
	}

	function handleTemplateSelect(event) {
		scenario = {
			description: event.detail.description,
			domain: event.detail.domain,
			context: {}
		};
		showTemplates = false;
	}

	// Reactive statement for current result
	$: result = $deliberation.currentDeliberation;

	// Extract conflicts from result
	$: conflicts = result?.metadata?.conflicts || [];

	// Prepare worldviews data for ConflictMap
	$: worldviewsForChart = result?.worldviews?.map(wv => ({
		worldview: wv.worldview,
		judgment: wv.judgment,
		confidence: wv.confidence,
		weight: wv.weight
	})) || [];

	// Prepare conflicts data for ConflictMap
	$: conflictsForChart = conflicts.map(conflict => ({
		worldviews: conflict.worldviews || conflict.perspectives || [],
		severity: conflict.severity || 'moderate'
	}));
</script>

<div class="container" style="padding: var(--spacing-2xl) 0;">
	<header style="margin-bottom: var(--spacing-2xl);">
		<div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: var(--spacing-md);">
			<div>
				<h1>Ethical Deliberation</h1>
				<p style="color: var(--color-text-muted); max-width: 800px;">
					Describe an ethical scenario to receive multi-perspectival analysis from 12 worldviews.
					The interface illuminates complexity rather than simplifying it.
				</p>
			</div>
			<button
				class="button button-secondary"
				on:click={() => showTemplates = true}
				style="white-space: nowrap;"
			>
				Browse Templates
			</button>
		</div>
	</header>

	<main class="flex-col gap-lg">
		<!-- Scenario Input Component -->
		<section>
			<ScenarioInput
				bind:scenario={scenario}
				onSubmit={handleSubmit}
				disabled={isDeliberating}
			>
				<!-- Custom action buttons slot -->
				<div class="flex gap-md">
					<button type="submit" class="button" disabled={isDeliberating}>
						{#if isDeliberating}
							Deliberating...
						{:else}
							Begin Deliberation
						{/if}
					</button>

					{#if result}
						<button type="button" class="button button-secondary" on:click={resetForm}>
							New Deliberation
						</button>
					{/if}
				</div>
			</ScenarioInput>

			<!-- Error Display -->
			{#if error}
				<div style="margin-top: var(--spacing-md); padding: var(--spacing-md); background: #fee; border: 1px solid var(--color-error); border-radius: var(--radius-md); color: var(--color-error);">
					⚠️ {error}
				</div>
			{/if}
		</section>

		<!-- Loading State -->
		{#if isDeliberating}
			<section class="card" style="text-align: center; padding: var(--spacing-2xl);">
				<div style="font-size: var(--font-size-lg); color: var(--color-text-muted);">
					⏳ Deliberating across 12 worldviews...
				</div>
				<p style="margin-top: var(--spacing-md); color: var(--color-text-muted);">
					Gathering perspectives, identifying tensions, and resolving value conflicts.<br>
					<span style="font-style: italic; font-size: var(--font-size-sm);">
						This deliberative pacing is intentional—gravity befits the subject matter.
					</span>
				</p>
			</section>
		{/if}

		<!-- Results Section -->
		{#if result && !isDeliberating}
			<div id="results" class="flex-col gap-lg">
				<!-- Integrated Judgment Component (MDI v2.0 compliant) -->
				<section>
					<IntegratedJudgment
						judgment={result.judgment}
						confidence={result.confidence}
						confidenceLevel={result.confidenceLevel}
						justification={result.justification}
						domain={result.domain}
						supportingWorldviews={result.supportingWorldviews || []}
						minorityViews={result.minorityViews || []}
						worldviewsConsulted={result.metadata?.evaluationsCount || result.worldviews?.length || 0}
						conflictsDetected={result.metadata?.conflictsCount || conflicts.length}
						isContested={result.isContested || false}
						margin={result.margin}
						marginPercent={result.marginPercent}
						secondPlace={result.secondPlace}
						secondPlaceScore={result.secondPlaceScore}
						agreement={result.agreement}
						quorum={result.quorum}
					/>
				</section>

				<!-- Semantic Analysis (TagTeam Detection) -->
				{#if result.semanticAnalysis}
					<section>
						<SemanticAnalysisCard semanticAnalysis={result.semanticAnalysis} />
					</section>
				{/if}

				<!-- Conflict Map Visualization (Radial Chart - MDI v2.0 compliant) -->
				{#if worldviewsForChart.length > 0}
					<section>
						<ConflictMap
							worldviews={worldviewsForChart}
							conflicts={conflictsForChart}
							width={700}
							height={700}
							isContested={result.isContested || false}
							winningJudgment={result.judgment}
							secondPlace={result.secondPlace}
							margin={result.margin}
							marginPercent={result.marginPercent}
						/>
					</section>
				{/if}

				<!-- Individual Worldview Evaluations (Expandable) -->
				<section class="card">
					<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--spacing-md);">
						<h2 style="margin: 0;">Individual Worldview Evaluations</h2>
						<button
							type="button"
							class="button button-secondary"
							on:click={() => showAllWorldviews = !showAllWorldviews}
							style="font-size: var(--font-size-sm);"
						>
							{showAllWorldviews ? 'Collapse All' : `View All ${result.worldviews.length} Worldviews`}
						</button>
					</div>

					<p style="color: var(--color-text-muted); font-size: var(--font-size-sm); margin-bottom: var(--spacing-lg);">
						Each worldview provides a unique lens through which to examine the scenario.
						Differences illuminate the structural geometry of the moral problem.
					</p>

					{#if showAllWorldviews}
						<div class="flex-col gap-md">
							{#each result.worldviews as evaluation}
								<WorldviewCard
									worldview={evaluation.worldview}
									judgment={evaluation.judgment}
									confidence={evaluation.confidence}
									weight={evaluation.weight}
									reasoning={evaluation.reasoning}
									values={evaluation.values || []}
									isExpanded={false}
								/>
							{/each}
						</div>
					{:else}
						<!-- Show only minority views by default (per MDI v2.0 delta highlighting) -->
						{#if result.minorityViews && result.minorityViews.length > 0}
							<div style="margin-bottom: var(--spacing-lg);">
								<h3 style="font-size: var(--font-size-lg); margin-bottom: var(--spacing-sm);">
									Dissenting Perspectives
									<span style="font-size: var(--font-size-sm); font-weight: normal; color: var(--color-text-muted);">
										(Highlighted per MDI v2.0 Delta Principle)
									</span>
								</h3>
								<div class="flex-col gap-md">
									{#each result.worldviews.filter(wv => result.minorityViews?.some(mv => mv.worldview === wv.worldview)) as evaluation}
										<WorldviewCard
											worldview={evaluation.worldview}
											judgment={evaluation.judgment}
											confidence={evaluation.confidence}
											weight={evaluation.weight}
											reasoning={evaluation.reasoning}
											values={evaluation.values || []}
											isExpanded={true}
										/>
									{/each}
								</div>
							</div>
						{/if}

						<div style="text-align: center; padding: var(--spacing-md); background: var(--color-surface); border-radius: var(--radius-md);">
							<p style="color: var(--color-text-muted); font-size: var(--font-size-sm);">
								Click "View All {result.worldviews.length} Worldviews" above to see the complete multi-perspectival analysis
							</p>
						</div>
					{/if}
				</section>

				<!-- Metadata Footer -->
				<section class="card" style="background: var(--color-surface); border: 1px solid var(--color-border);">
					<div style="color: var(--color-text-muted); font-size: var(--font-size-sm);">
						<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-md);">
							<div>
								<strong style="color: var(--color-text);">Deliberation ID:</strong><br>
								<code style="font-size: var(--font-size-xs);">{result.id}</code>
							</div>
							<div>
								<strong style="color: var(--color-text);">Completed:</strong><br>
								{new Date(result.timestamp).toLocaleString()}
							</div>
							<div>
								<strong style="color: var(--color-text);">Domain:</strong><br>
								{result.domain}
							</div>
							<div>
								<strong style="color: var(--color-text);">Conflicts Identified:</strong><br>
								{result.metadata?.conflictsCount || 0}
							</div>
						</div>
					</div>
				</section>
			</div>
		{/if}
	</main>

	<!-- Scenario Templates Modal -->
	<ScenarioTemplates bind:show={showTemplates} on:select={handleTemplateSelect} />
</div>

<style>
	/* Component-specific styles */
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
		margin-bottom: var(--spacing-sm);
	}
</style>
