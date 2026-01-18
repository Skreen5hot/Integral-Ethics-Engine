<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { worldviewManager } from '../concepts/worldviewManager.js';

	// Initialize worldviews on app startup
	onMount(() => {
		// Load all Material-Empirical worldviews (Phase 1)
		worldviewManager.actions.loadMaterialEmpiricalWorldviews();
		console.log('Worldviews loaded:', Object.keys(worldviewManager.state.worldviews));
	});
</script>

<slot />
