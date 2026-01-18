import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],

	// Optimize dependencies
	optimizeDeps: {
		include: []
	},

	// Build configuration
	build: {
		target: 'esnext',
		minify: 'esbuild'
	},

	// SSR configuration - exclude TagTeam (browser-only UMD bundle)
	ssr: {
		noExternal: [],
		external: ['../../../collaborations/tagteam/dist/tagteam.js']
	},

	// Development server
	server: {
		port: 5173,
		strictPort: false
	},

	// Test configuration (for future Vitest integration)
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
