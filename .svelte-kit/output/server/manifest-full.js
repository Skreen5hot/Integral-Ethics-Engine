export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","icon-192.png","icon-512.png","lib/tagteam.js","manifest.json"]),
	mimeTypes: {".png":"image/png",".js":"text/javascript",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.D5YO0Q9o.js",app:"_app/immutable/entry/app.Cb_5m6tQ.js",imports:["_app/immutable/entry/start.D5YO0Q9o.js","_app/immutable/chunks/FT3Q7z0p.js","_app/immutable/chunks/DimSMWNs.js","_app/immutable/chunks/36oPrS4e.js","_app/immutable/chunks/U2luCqQX.js","_app/immutable/chunks/DPPzBaZK.js","_app/immutable/entry/app.Cb_5m6tQ.js","_app/immutable/chunks/DimSMWNs.js","_app/immutable/chunks/Ccunq4lf.js","_app/immutable/chunks/KzInidiX.js","_app/immutable/chunks/DPPzBaZK.js","_app/immutable/chunks/CQlUKc8l.js","_app/immutable/chunks/BM0enYAg.js","_app/immutable/chunks/D0GrLqM-.js","_app/immutable/chunks/36oPrS4e.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/deliberate",
				pattern: /^\/deliberate\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/history",
				pattern: /^\/history\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/settings",
				pattern: /^\/settings\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/worldviews",
				pattern: /^\/worldviews\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
