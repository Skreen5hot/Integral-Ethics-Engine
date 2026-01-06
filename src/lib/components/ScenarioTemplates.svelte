<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let show = false;

	// Template scenarios organized by domain
	const templates = {
		healthcare: [
			{
				title: 'End-of-Life Care Decision',
				description: 'A 78-year-old patient with terminal cancer is on life support with no chance of recovery. The family must decide whether to continue aggressive treatment or transition to comfort care. The patient left no advance directive, but had previously mentioned preferring quality of life over prolonged suffering.',
				tags: ['end-of-life', 'family decision', 'terminal illness']
			},
			{
				title: 'Experimental Treatment Access',
				description: 'A pharmaceutical company offers a patient access to an experimental drug that shows promise but has not completed clinical trials. The treatment could extend life by 6-12 months but carries unknown risks. Insurance will not cover the $200,000 cost.',
				tags: ['experimental', 'cost', 'risk-benefit']
			},
			{
				title: 'Organ Donation Priority',
				description: 'Two patients need a liver transplant. One is a 45-year-old parent of three who developed liver disease through no fault of their own. The other is a 28-year-old with self-inflicted damage from alcohol abuse but has been sober for 2 years. Only one liver is available.',
				tags: ['allocation', 'fairness', 'desert']
			}
		],
		spiritual: [
			{
				title: 'Leaving Faith Community',
				description: 'After 30 years in a conservative religious community, I\'m questioning core doctrines and considering leaving. This would mean losing my entire social network and possibly estrangement from family. However, staying feels intellectually dishonest and emotionally suffocating.',
				tags: ['faith', 'community', 'authenticity']
			},
			{
				title: 'Interfaith Marriage',
				description: 'I\'m in love with someone from a different religious tradition. Both families expect us to convert to their faith. We\'re considering creating our own spiritual practice that honors both traditions, but this may alienate both families.',
				tags: ['marriage', 'tradition', 'family']
			},
			{
				title: 'Religious Practice vs Career',
				description: 'My career requires working on my faith\'s holy day. The job is a once-in-a-lifetime opportunity that could support my family for years. My religious community views working on this day as a serious violation of sacred obligations.',
				tags: ['work', 'observance', 'obligation']
			}
		],
		education: [
			{
				title: 'Academic Dishonesty Dilemma',
				description: 'I discovered that several students in my class are using AI to write their essays. I\'m struggling to keep up while doing my own work. Reporting them might make me a social outcast, but not reporting feels unfair to honest students.',
				tags: ['cheating', 'fairness', 'social pressure']
			},
			{
				title: 'Competitive vs Collaborative Learning',
				description: 'Our school is switching from a competitive grading system (curve-based) to a collaborative learning model where students are evaluated on group projects and peer teaching. Some high-achieving students are protesting, fearing it will hurt their college admissions.',
				tags: ['grading', 'competition', 'cooperation']
			}
		],
		vocational: [
			{
				title: 'High-Paying Unethical Work',
				description: 'I\'ve been offered a $300,000/year position at a company whose primary client is developing weapons systems. The money would eliminate my family\'s debt and secure our future, but the work conflicts with my values around peace and non-violence.',
				tags: ['money', 'values', 'weapons']
			},
			{
				title: 'Work-Life Balance Crisis',
				description: 'My employer expects 60-80 hour work weeks. I\'m missing my children\'s milestones and my marriage is suffering. However, I\'m the sole income earner, and stepping back could mean losing the promotion I\'ve worked toward for five years.',
				tags: ['family', 'career', 'time']
			},
			{
				title: 'Whistleblowing Decision',
				description: 'I\'ve discovered my company is falsifying safety reports to avoid recalls. Reporting this could save lives but will certainly cost me my job and make me unemployable in my industry. I have a family depending on my income.',
				tags: ['safety', 'employment', 'public good']
			}
		],
		environmental: [
			{
				title: 'Wilderness vs Economic Development',
				description: 'Our town has an opportunity to approve a lithium mining operation that would create 500 jobs and fund schools for a decade. However, it would destroy 50,000 acres of pristine wilderness and threaten several endangered species. The region has high unemployment.',
				tags: ['jobs', 'conservation', 'community']
			},
			{
				title: 'Personal Carbon Footprint',
				description: 'My dream job requires flying internationally twice a month. I\'m deeply concerned about climate change and have been a climate activist. Taking this job would increase my carbon footprint tenfold, but I could use the platform to advocate for environmental policies.',
				tags: ['climate', 'hypocrisy', 'advocacy']
			}
		],
		interpersonal: [
			{
				title: 'Truth vs Kindness',
				description: 'My best friend is about to marry someone I believe is manipulative and emotionally abusive. I\'ve seen red flags that my friend dismisses as "misunderstandings." Should I speak up and risk ending our friendship, or stay silent and potentially watch them suffer?',
				tags: ['friendship', 'honesty', 'protection']
			},
			{
				title: 'Family Duty vs Independence',
				description: 'My parents expect me to live with them and care for them as they age, as is traditional in our culture. However, I\'ve received a fellowship opportunity across the country that could define my career. Declining feels like abandoning family duty; accepting feels selfish.',
				tags: ['family', 'culture', 'career']
			}
		],
		intellectual: [
			{
				title: 'Controversial Research Publication',
				description: 'I have data suggesting a controversial conclusion that contradicts mainstream scientific consensus and could be misused by political groups. Publishing could advance knowledge but might cause social harm. Not publishing violates scientific integrity.',
				tags: ['research', 'politics', 'integrity']
			},
			{
				title: 'Authorship Dispute',
				description: 'My advisor is listed as first author on a paper despite me doing 90% of the work. This is standard in my field but feels unjust. Challenging this could damage my career prospects and violate academic hierarchy norms.',
				tags: ['credit', 'power', 'norms']
			}
		],
		general: [
			{
				title: 'Found Wallet Dilemma',
				description: 'I found a wallet with $500 cash and no ID. There\'s a gym membership card but the gym is closed for renovation. I could really use the money for rent, but it clearly belongs to someone who might also need it.',
				tags: ['honesty', 'need', 'property']
			},
			{
				title: 'White Lie to Protect Feelings',
				description: 'My partner asks if I like their new haircut, which I honestly find unflattering. Telling the truth might hurt their feelings and they can\'t change it now. Should I be honest or tell a kind lie?',
				tags: ['honesty', 'kindness', 'relationships']
			}
		]
	};

	let selectedDomain = 'healthcare';
	let selectedTemplate = null;

	function selectTemplate(template) {
		selectedTemplate = template;
	}

	function loadTemplate() {
		if (selectedTemplate) {
			dispatch('select', {
				description: selectedTemplate.description,
				domain: selectedDomain
			});
			close();
		}
	}

	function close() {
		show = false;
		selectedTemplate = null;
	}

	// Get all unique tags across all templates
	$: allTemplates = Object.values(templates).flat();
	$: domainTemplates = templates[selectedDomain] || [];
</script>

{#if show}
	<div class="modal-backdrop" on:click={close}>
		<div class="modal-content" on:click|stopPropagation>
			<div class="modal-header">
				<h2>Scenario Templates</h2>
				<button class="close-button" on:click={close} aria-label="Close">×</button>
			</div>

			<div class="modal-body">
				<!-- Domain Selector -->
				<div class="domain-tabs">
					<button
						class="tab"
						class:active={selectedDomain === 'healthcare'}
						on:click={() => selectedDomain = 'healthcare'}
					>
						Healthcare
					</button>
					<button
						class="tab"
						class:active={selectedDomain === 'spiritual'}
						on:click={() => selectedDomain = 'spiritual'}
					>
						Spiritual
					</button>
					<button
						class="tab"
						class:active={selectedDomain === 'education'}
						on:click={() => selectedDomain = 'education'}
					>
						Education
					</button>
					<button
						class="tab"
						class:active={selectedDomain === 'vocational'}
						on:click={() => selectedDomain = 'vocational'}
					>
						Vocational
					</button>
					<button
						class="tab"
						class:active={selectedDomain === 'environmental'}
						on:click={() => selectedDomain = 'environmental'}
					>
						Environmental
					</button>
					<button
						class="tab"
						class:active={selectedDomain === 'interpersonal'}
						on:click={() => selectedDomain = 'interpersonal'}
					>
						Interpersonal
					</button>
					<button
						class="tab"
						class:active={selectedDomain === 'intellectual'}
						on:click={() => selectedDomain = 'intellectual'}
					>
						Intellectual
					</button>
					<button
						class="tab"
						class:active={selectedDomain === 'general'}
						on:click={() => selectedDomain = 'general'}
					>
						General
					</button>
				</div>

				<!-- Template List -->
				<div class="template-list">
					{#each domainTemplates as template}
						<button
							class="template-card"
							class:selected={selectedTemplate === template}
							on:click={() => selectTemplate(template)}
						>
							<h3>{template.title}</h3>
							<p class="template-preview">
								{template.description.slice(0, 150)}...
							</p>
							<div class="template-tags">
								{#each template.tags as tag}
									<span class="tag">{tag}</span>
								{/each}
							</div>
						</button>
					{/each}
				</div>

				{#if selectedTemplate}
					<div class="template-detail">
						<h3>{selectedTemplate.title}</h3>
						<p class="description">{selectedTemplate.description}</p>
						<div class="template-tags">
							{#each selectedTemplate.tags as tag}
								<span class="tag">{tag}</span>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<div class="modal-footer">
				<button class="button button-secondary" on:click={close}>
					Cancel
				</button>
				<button
					class="button"
					on:click={loadTemplate}
					disabled={!selectedTemplate}
				>
					Load Template
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: var(--spacing-md);
	}

	.modal-content {
		background: var(--color-background);
		border-radius: var(--radius-lg);
		max-width: 900px;
		width: 100%;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-lg);
		border-bottom: 1px solid var(--color-border);
	}

	.modal-header h2 {
		margin: 0;
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-bold);
		color: var(--color-text);
	}

	.close-button {
		background: none;
		border: none;
		font-size: 2rem;
		color: var(--color-text-muted);
		cursor: pointer;
		padding: 0;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		transition: all var(--transition-fast);
	}

	.close-button:hover {
		background: var(--color-surface);
		color: var(--color-text);
	}

	.modal-body {
		flex: 1;
		overflow-y: auto;
		padding: var(--spacing-lg);
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.domain-tabs {
		display: flex;
		gap: var(--spacing-xs);
		flex-wrap: wrap;
	}

	.tab {
		padding: var(--spacing-sm) var(--spacing-md);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-muted);
		transition: all var(--transition-fast);
	}

	.tab:hover {
		background: var(--color-background);
		border-color: var(--color-primary);
		color: var(--color-text);
	}

	.tab.active {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
	}

	.template-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: var(--spacing-md);
	}

	.template-card {
		background: var(--color-surface);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--spacing-md);
		cursor: pointer;
		text-align: left;
		transition: all var(--transition-fast);
	}

	.template-card:hover {
		border-color: var(--color-primary);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		transform: translateY(-1px);
	}

	.template-card.selected {
		border-color: var(--color-primary);
		background: rgba(37, 99, 235, 0.05);
	}

	.template-card h3 {
		margin: 0 0 var(--spacing-sm) 0;
		font-size: var(--font-size-md);
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
	}

	.template-preview {
		margin: 0 0 var(--spacing-sm) 0;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		line-height: var(--line-height-relaxed);
	}

	.template-tags {
		display: flex;
		gap: var(--spacing-xs);
		flex-wrap: wrap;
	}

	.tag {
		display: inline-block;
		padding: 2px 8px;
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
	}

	.template-detail {
		padding: var(--spacing-lg);
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.template-detail h3 {
		margin: 0 0 var(--spacing-md) 0;
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-bold);
		color: var(--color-text);
	}

	.template-detail .description {
		margin: 0 0 var(--spacing-md) 0;
		font-size: var(--font-size-md);
		color: var(--color-text);
		line-height: var(--line-height-relaxed);
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: var(--spacing-md);
		padding: var(--spacing-lg);
		border-top: 1px solid var(--color-border);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.domain-tabs {
			gap: var(--spacing-xs);
		}

		.tab {
			font-size: var(--font-size-xs);
			padding: var(--spacing-xs) var(--spacing-sm);
		}

		.template-list {
			grid-template-columns: 1fr;
		}
	}
</style>
