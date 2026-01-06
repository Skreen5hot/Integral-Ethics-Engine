<script>
	import { onMount } from 'svelte';
	import { session } from '$lib/stores';

	// Settings state
	let preferences = {
		defaultWorldviews: [],
		customWeights: {},
		theme: 'light',
		enableNotifications: false,
		saveHistory: true,
		maxHistoryItems: 100
	};

	let allWorldviews = [
		{ name: 'Materialism', cluster: 'Material-Empirical' },
		{ name: 'Sensationalism', cluster: 'Material-Empirical' },
		{ name: 'Phenomenalism', cluster: 'Material-Empirical' },
		{ name: 'Realism', cluster: 'Material-Empirical' },
		{ name: 'Dynamism', cluster: 'Process-Individual' },
		{ name: 'Monadism', cluster: 'Process-Individual' },
		{ name: 'Idealism', cluster: 'Process-Individual' },
		{ name: 'Rationalism', cluster: 'Process-Individual' },
		{ name: 'Psychism', cluster: 'Depth-Spiritual' },
		{ name: 'Pneumatism', cluster: 'Depth-Spiritual' },
		{ name: 'Spiritualism', cluster: 'Depth-Spiritual' },
		{ name: 'Mathematism', cluster: 'Depth-Spiritual' }
	];

	let isSaving = false;
	let saveMessage = null;
	let showExportSuccess = false;
	let showImportError = null;

	onMount(async () => {
		// Load preferences from session store
		const unsubscribe = session.subscribe(state => {
			if (state.preferences) {
				preferences = { ...preferences, ...state.preferences };
			}
		});

		return unsubscribe;
	});

	async function handleSaveSettings() {
		isSaving = true;
		saveMessage = null;

		try {
			await session.updatePreferences(preferences);
			saveMessage = { type: 'success', text: 'Settings saved successfully!' };
		} catch (error) {
			saveMessage = { type: 'error', text: `Error saving settings: ${error.message}` };
		} finally {
			isSaving = false;
			// Clear message after 3 seconds
			setTimeout(() => {
				saveMessage = null;
			}, 3000);
		}
	}

	function handleResetToDefaults() {
		if (confirm('Reset all settings to defaults? This cannot be undone.')) {
			preferences = {
				defaultWorldviews: [],
				customWeights: {},
				theme: 'light',
				enableNotifications: false,
				saveHistory: true,
				maxHistoryItems: 100
			};
		}
	}

	function toggleWorldview(worldviewName) {
		const index = preferences.defaultWorldviews.indexOf(worldviewName);
		if (index > -1) {
			preferences.defaultWorldviews = preferences.defaultWorldviews.filter(w => w !== worldviewName);
		} else {
			preferences.defaultWorldviews = [...preferences.defaultWorldviews, worldviewName];
		}
	}

	function handleCustomWeightChange(worldviewName, value) {
		const weight = parseFloat(value);
		if (isNaN(weight) || weight < 0 || weight > 1) {
			return;
		}

		if (weight === 0) {
			// Remove custom weight if set to 0
			const { [worldviewName]: _, ...rest } = preferences.customWeights;
			preferences.customWeights = rest;
		} else {
			preferences.customWeights = {
				...preferences.customWeights,
				[worldviewName]: weight
			};
		}
	}

	async function handleExportSettings() {
		const data = {
			preferences: preferences,
			exportDate: new Date().toISOString(),
			version: '1.0'
		};

		const dataStr = JSON.stringify(data, null, 2);
		const dataBlob = new Blob([dataStr], { type: 'application/json' });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `iee-settings-${new Date().toISOString().split('T')[0]}.json`;
		link.click();
		URL.revokeObjectURL(url);

		showExportSuccess = true;
		setTimeout(() => {
			showExportSuccess = false;
		}, 3000);
	}

	async function handleImportSettings(event) {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();
			const data = JSON.parse(text);

			if (data.preferences) {
				preferences = { ...preferences, ...data.preferences };
				showImportError = null;
				saveMessage = { type: 'success', text: 'Settings imported successfully!' };
				setTimeout(() => {
					saveMessage = null;
				}, 3000);
			} else {
				throw new Error('Invalid settings file format');
			}
		} catch (error) {
			showImportError = `Error importing settings: ${error.message}`;
			setTimeout(() => {
				showImportError = null;
			}, 5000);
		}

		// Reset file input
		event.target.value = '';
	}

	async function handleClearAllData() {
		if (confirm('Clear ALL data including history and settings? This cannot be undone!')) {
			try {
				await session.reset();
				preferences = {
					defaultWorldviews: [],
					customWeights: {},
					theme: 'light',
					enableNotifications: false,
					saveHistory: true,
					maxHistoryItems: 100
				};
				saveMessage = { type: 'success', text: 'All data cleared successfully!' };
			} catch (error) {
				saveMessage = { type: 'error', text: `Error clearing data: ${error.message}` };
			}
		}
	}
</script>

<div class="container" style="padding: var(--spacing-2xl) 0;">
	<header style="margin-bottom: var(--spacing-2xl);">
		<h1>Settings</h1>
		<p style="color: var(--color-text-muted);">
			Configure your preferences and customize the deliberation experience
		</p>
	</header>

	<main class="flex-col gap-lg">
		<!-- General Settings -->
		<section class="card">
			<h2 style="margin-bottom: var(--spacing-lg);">General Settings</h2>

			<div class="settings-group">
				<!-- Theme Selection -->
				<div class="setting-item">
					<label for="theme">
						<strong>Theme</strong>
						<span style="display: block; color: var(--color-text-muted); font-size: var(--font-size-sm); font-weight: normal;">
							Choose your preferred color scheme
						</span>
					</label>
					<select id="theme" bind:value={preferences.theme}>
						<option value="light">Light</option>
						<option value="dark">Dark</option>
						<option value="auto">Auto (System)</option>
					</select>
				</div>

				<!-- Save History -->
				<div class="setting-item">
					<label for="save-history" style="display: flex; align-items: center; gap: var(--spacing-md); cursor: pointer;">
						<input
							type="checkbox"
							id="save-history"
							bind:checked={preferences.saveHistory}
							style="width: auto; cursor: pointer;"
						/>
						<div>
							<strong>Save Deliberation History</strong>
							<span style="display: block; color: var(--color-text-muted); font-size: var(--font-size-sm); font-weight: normal;">
								Store past deliberations in browser storage
							</span>
						</div>
					</label>
				</div>

				<!-- Max History Items -->
				{#if preferences.saveHistory}
					<div class="setting-item">
						<label for="max-history">
							<strong>Maximum History Items</strong>
							<span style="display: block; color: var(--color-text-muted); font-size: var(--font-size-sm); font-weight: normal;">
								Automatically remove oldest items when limit is reached
							</span>
						</label>
						<input
							type="number"
							id="max-history"
							bind:value={preferences.maxHistoryItems}
							min="10"
							max="1000"
							step="10"
						/>
					</div>
				{/if}

				<!-- Enable Notifications -->
				<div class="setting-item">
					<label for="notifications" style="display: flex; align-items: center; gap: var(--spacing-md); cursor: pointer;">
						<input
							type="checkbox"
							id="notifications"
							bind:checked={preferences.enableNotifications}
							style="width: auto; cursor: pointer;"
						/>
						<div>
							<strong>Enable Notifications</strong>
							<span style="display: block; color: var(--color-text-muted); font-size: var(--font-size-sm); font-weight: normal;">
								Receive notifications when deliberations complete
							</span>
						</div>
					</label>
				</div>
			</div>
		</section>

		<!-- Worldview Selection -->
		<section class="card">
			<h2 style="margin-bottom: var(--spacing-md);">Default Worldviews</h2>
			<p style="color: var(--color-text-muted); font-size: var(--font-size-sm); margin-bottom: var(--spacing-lg);">
				Select which worldviews to consult by default. Leave empty to use all 12 worldviews.
			</p>

			<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--spacing-md);">
				{#each allWorldviews as worldview}
					<label
						class="worldview-checkbox"
						class:selected={preferences.defaultWorldviews.includes(worldview.name)}
					>
						<input
							type="checkbox"
							checked={preferences.defaultWorldviews.includes(worldview.name)}
							on:change={() => toggleWorldview(worldview.name)}
						/>
						<span class="worldview-name">{worldview.name}</span>
						<span class="worldview-cluster">{worldview.cluster}</span>
					</label>
				{/each}
			</div>

			{#if preferences.defaultWorldviews.length > 0}
				<div style="margin-top: var(--spacing-md); padding: var(--spacing-md); background: var(--color-surface); border-radius: var(--radius-md);">
					<p style="font-size: var(--font-size-sm); color: var(--color-text-muted);">
						<strong>{preferences.defaultWorldviews.length}</strong> worldview{preferences.defaultWorldviews.length !== 1 ? 's' : ''} selected
					</p>
				</div>
			{/if}
		</section>

		<!-- Custom Weights -->
		<section class="card">
			<h2 style="margin-bottom: var(--spacing-md);">Custom Domain Weights</h2>
			<p style="color: var(--color-text-muted); font-size: var(--font-size-sm); margin-bottom: var(--spacing-lg);">
				Override default domain weights for specific worldviews (0.0 - 1.0). Leave at 0 to use default weights.
			</p>

			<div class="weight-overrides">
				{#each allWorldviews as worldview}
					<div class="weight-item">
						<label for="weight-{worldview.name}">
							<strong>{worldview.name}</strong>
							<span style="font-size: var(--font-size-sm); color: var(--color-text-muted);">
								({worldview.cluster})
							</span>
						</label>
						<input
							type="number"
							id="weight-{worldview.name}"
							value={preferences.customWeights[worldview.name] || 0}
							on:change={(e) => handleCustomWeightChange(worldview.name, e.target.value)}
							min="0"
							max="1"
							step="0.1"
							style="max-width: 100px;"
						/>
					</div>
				{/each}
			</div>

			{#if Object.keys(preferences.customWeights).length > 0}
				<div style="margin-top: var(--spacing-md); padding: var(--spacing-md); background: var(--color-surface); border-radius: var(--radius-md);">
					<p style="font-size: var(--font-size-sm); color: var(--color-text-muted);">
						<strong>{Object.keys(preferences.customWeights).length}</strong> custom weight{Object.keys(preferences.customWeights).length !== 1 ? 's' : ''} defined
					</p>
				</div>
			{/if}
		</section>

		<!-- Data Management -->
		<section class="card">
			<h2 style="margin-bottom: var(--spacing-lg);">Data Management</h2>

			<div class="flex-col gap-md">
				<!-- Export Settings -->
				<div>
					<button class="button button-secondary" on:click={handleExportSettings}>
						Export Settings
					</button>
					{#if showExportSuccess}
						<span style="margin-left: var(--spacing-md); color: var(--color-success);">
							✓ Settings exported!
						</span>
					{/if}
					<p style="margin-top: var(--spacing-xs); color: var(--color-text-muted); font-size: var(--font-size-sm);">
						Download your settings as a JSON file
					</p>
				</div>

				<!-- Import Settings -->
				<div>
					<label for="import-file" class="button button-secondary" style="cursor: pointer;">
						Import Settings
					</label>
					<input
						type="file"
						id="import-file"
						accept=".json"
						on:change={handleImportSettings}
						style="display: none;"
					/>
					{#if showImportError}
						<div style="margin-top: var(--spacing-xs); color: var(--color-error); font-size: var(--font-size-sm);">
							{showImportError}
						</div>
					{/if}
					<p style="margin-top: var(--spacing-xs); color: var(--color-text-muted); font-size: var(--font-size-sm);">
						Load settings from a JSON file
					</p>
				</div>

				<!-- Clear All Data -->
				<div style="margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border);">
					<button
						class="button"
						style="background: var(--color-error); color: white;"
						on:click={handleClearAllData}
					>
						Clear All Data
					</button>
					<p style="margin-top: var(--spacing-xs); color: var(--color-text-muted); font-size: var(--font-size-sm);">
						⚠️ This will delete all history and reset settings. This action cannot be undone.
					</p>
				</div>
			</div>
		</section>

		<!-- Actions -->
		<section class="card" style="background: var(--color-surface);">
			<div style="display: flex; gap: var(--spacing-md); flex-wrap: wrap; align-items: center;">
				<button class="button" on:click={handleSaveSettings} disabled={isSaving}>
					{isSaving ? 'Saving...' : 'Save Settings'}
				</button>

				<button class="button button-secondary" on:click={handleResetToDefaults}>
					Reset to Defaults
				</button>

				{#if saveMessage}
					<div
						style="padding: var(--spacing-sm) var(--spacing-md); border-radius: var(--radius-md); font-size: var(--font-size-sm);"
						style:background={saveMessage.type === 'success' ? '#d1fae5' : '#fee'}
						style:color={saveMessage.type === 'success' ? 'var(--color-success)' : 'var(--color-error)'}
					>
						{saveMessage.text}
					</div>
				{/if}
			</div>
		</section>
	</main>
</div>

<style>
	h2 {
		font-size: var(--font-size-xl);
		font-weight: var(--font-weight-bold);
		color: var(--color-text);
	}

	.settings-group {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-lg);
	}

	.setting-item {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-sm);
	}

	.setting-item label {
		display: flex;
		flex-direction: column;
		gap: var(--spacing-xs);
	}

	.setting-item input[type="number"],
	.setting-item select {
		max-width: 300px;
	}

	.worldview-checkbox {
		display: flex;
		align-items: center;
		gap: var(--spacing-sm);
		padding: var(--spacing-md);
		background: var(--color-surface);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-fast);
	}

	.worldview-checkbox:hover {
		border-color: var(--color-primary);
		background: var(--color-background);
	}

	.worldview-checkbox.selected {
		border-color: var(--color-primary);
		background: rgba(37, 99, 235, 0.05);
	}

	.worldview-checkbox input[type="checkbox"] {
		width: auto;
		margin: 0;
		cursor: pointer;
	}

	.worldview-name {
		flex: 1;
		font-weight: var(--font-weight-semibold);
		color: var(--color-text);
	}

	.worldview-cluster {
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.weight-overrides {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: var(--spacing-md);
	}

	.weight-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--spacing-sm);
		background: var(--color-surface);
		border-radius: var(--radius-md);
	}

	.weight-item label {
		flex: 1;
	}
</style>
