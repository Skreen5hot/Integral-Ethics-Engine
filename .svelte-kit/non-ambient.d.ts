
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/deliberate" | "/history" | "/settings" | "/worldviews";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/deliberate": Record<string, never>;
			"/history": Record<string, never>;
			"/settings": Record<string, never>;
			"/worldviews": Record<string, never>
		};
		Pathname(): "/" | "/deliberate" | "/deliberate/" | "/history" | "/history/" | "/settings" | "/settings/" | "/worldviews" | "/worldviews/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.png" | "/icon-192.png" | "/icon-512.png" | "/manifest.json" | string & {};
	}
}