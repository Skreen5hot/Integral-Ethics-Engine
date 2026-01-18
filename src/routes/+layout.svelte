<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { worldviewManager } from '../concepts/worldviewManager.js';

	// Initialize worldviews on app startup
	onMount(() => {
		// Load all 12 worldviews across all clusters
		worldviewManager.actions.loadAllWorldviews();
		console.log('Worldviews loaded:', Object.keys(worldviewManager.state.worldviews));
	});
</script>

<slot />
