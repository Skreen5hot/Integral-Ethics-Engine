export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","icon-192.png","icon-512.png","manifest.json"]),
	mimeTypes: {".png":"image/png",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.DXy0Fp2V.js",app:"_app/immutable/entry/app.DpamZtAy.js",imports:["_app/immutable/entry/start.DXy0Fp2V.js","_app/immutable/chunks/DAv8_IeV.js","_app/immutable/chunks/BKIGzYeV.js","_app/immutable/chunks/VaD-4maY.js","_app/immutable/chunks/C2HaRx2w.js","_app/immutable/entry/app.DpamZtAy.js","_app/immutable/chunks/BKIGzYeV.js","_app/immutable/chunks/8l2V8yXD.js","_app/immutable/chunks/MFRMx3eT.js","_app/immutable/chunks/C2HaRx2w.js","_app/immutable/chunks/DHZ_poO4.js","_app/immutable/chunks/CQSk8hLr.js","_app/immutable/chunks/Bw8-_Lx_.js","_app/immutable/chunks/VaD-4maY.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
