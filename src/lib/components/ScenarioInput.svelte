<script>
	/**
	 * ScenarioInput Component
	 *
	 * Reusable form component for ethical scenario input
	 * Features: validation, domain selection, optional context fields
	 */

	import { validateScenarioInput } from '../../application/schemas/deliberation-schemas.js';

	// Props
	export let scenario = {
		description: '',
		domain: '',
		context: {}
	};

	export let onSubmit = null;
	export let disabled = false;

	// Validation state
	let errors = [];
	let touched = {
		description: false
	};

	// Domain options
	const domains = [
		{ value: '', label: 'Auto-detect domain' },
		{ value: 'healthcare', label: 'Healthcare' },
		{ value: 'spiritual', label: 'Spiritual / Religious' },
		{ value: 'education', label: 'Education' },
		{ value: 'vocational', label: 'Vocational / Career' },
		{ value: 'environmental', label: 'Environmental' },
		{ value: 'interpersonal', label: 'Interpersonal' },
		{ value: 'intellectual', label: 'Intellectual / Research' },
		{ value: 'general', label: 'General' }
	];

	// Validate on input
	function validate() {
		const validation = validateScenarioInput(scenario);
		errors = validation.valid ? [] : validation.errors;
		return validation.valid;
	}

	// Handle blur (mark field as touched)
	function handleBlur(field) {
		touched[field] = true;
		validate();
	}

	// Handle form submission
	function handleSubmit(event) {
		event.preventDefault();

		// Mark all fields as touched
		touched.description = true;

		// Validate
		if (!validate()) {
			return;
		}

		// Call parent's onSubmit if provided
		if (onSubmit) {
			onSubmit(scenario);
		}
	}

	// Reactive validation
	$: if (scenario.description) {
		validate();
	}

	// Show errors only for touched fields
	$: displayErrors = touched.description ? errors : [];
</script>

<form on:submit={handleSubmit} class="scenario-input">
	<!-- Description Field -->
	<div class="form-group">
		<label for="scenario-description">
			Scenario Description <span class="required">*</span>
		</label>
		<p class="help-text">
			Describe the ethical dilemma or decision in detail (minimum 10 characters)
		</p>
		<textarea
			id="scenario-description"
			bind:value={scenario.description}
			on:blur={() => handleBlur('description')}
			placeholder="Example: A patient is on life support with no chance of recovery. The family must decide whether to continue treatment or withdraw support..."
			rows="6"
			{disabled}
			class:error={displayErrors.length > 0}
			required
		/>
		{#if displayErrors.length > 0}
			<div class="error-messages">
				{#each displayErrors as error}
					<p class="error-message">⚠️ {error}</p>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Domain Selection -->
	<div class="form-group">
		<label for="scenario-domain">
			Domain
		</label>
		<p class="help-text">
			Specify the domain or leave blank for automatic detection
		</p>
		<select
			id="scenario-domain"
			bind:value={scenario.domain}
			{disabled}
		>
			{#each domains as domain}
				<option value={domain.value}>{domain.label}</option>
			{/each}
		</select>
	</div>

	<!-- Context (Optional) -->
	<details class="context-section">
		<summary>Additional Context (Optional)</summary>
		<div class="context-fields">
			<p class="help-text">
				Add any additional context that might be relevant to the deliberation
			</p>
			<!-- Future: Add dynamic context fields here -->
			<p style="color: var(--color-text-muted); font-style: italic;">
				Context fields coming soon
			</p>
		</div>
	</details>

	<!-- Submit Button -->
	<div class="form-actions">
		<slot name="actions">
			<button type="submit" class="button" disabled={disabled || displayErrors.length > 0}>
				{#if disabled}
					Processing...
				{:else}
					Begin Deliberation
				{/if}
			</button>
		</slot>
	</div>

	<!-- Character Count -->
	{#if scenario.description}
		<div class="character-count">
			{scenario.description.length} characters
			{#if scenario.description.length < 10}
				<span style="color: var(--color-error);">(minimum 10)</span>
			{:else if scenario.description.length > 4900}
				<span style="color: var(--color-warning);">(approaching limit of 5000)</span>
			{/if}
		</div>
	{/if}
</form>

<style>
	.scenario-input {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	label {
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		color: var(--color-text);
	}

	.required {
		color: var(--color-error);
	}

	.help-text {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		margin: 0;
	}

	textarea {
		width: 100%;
		padding: var(--spacing-md);
		font-family: inherit;
		font-size: var(--font-size-base);
		line-height: var(--line-height-normal);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		resize: vertical;
		transition: border-color var(--transition-fast);
	}

	textarea:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	textarea.error {
		border-color: var(--color-error);
	}

	textarea.error:focus {
		box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
	}

	select {
		width: 100%;
		padding: var(--spacing-sm) var(--spacing-md);
		font-family: inherit;
		font-size: var(--font-size-base);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background-color: var(--color-background);
		transition: border-color var(--transition-fast);
	}

	select:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
	}

	.error-messages {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.error-message {
		margin: 0;
		padding: var(--spacing-sm) var(--spacing-md);
		background-color: #fee;
		border: 1px solid var(--color-error);
		border-radius: var(--radius-md);
		color: var(--color-error);
		font-size: var(--font-size-sm);
	}

	.context-section {
		margin-top: var(--spacing-md);
	}

	.context-section summary {
		cursor: pointer;
		font-weight: var(--font-weight-medium);
		padding: var(--spacing-sm);
		border-radius: var(--radius-md);
		user-select: none;
	}

	.context-section summary:hover {
		background-color: var(--color-surface);
	}

	.context-fields {
		padding: var(--spacing-md);
		margin-top: var(--spacing-sm);
		background-color: var(--color-surface);
		border-radius: var(--radius-md);
	}

	.form-actions {
		display: flex;
		gap: var(--spacing-md);
	}

	.character-count {
		text-align: right;
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}
</style>
