import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Preprocess with Vite
	preprocess: vitePreprocess(),

	kit: {
		// Static adapter for PWA (generates static files)
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true
		}),

		// Service worker for offline PWA support
		serviceWorker: {
			register: false // We'll register manually for better control
		}
	}
};

export default config;
