export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "Integral-Ethics-Engine/_app",
	assets: new Set(["favicon.png","icon-192.png","icon-512.png","manifest.json"]),
	mimeTypes: {".png":"image/png",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.BEcAGnee.js",app:"_app/immutable/entry/app.idvYhMZ2.js",imports:["_app/immutable/entry/start.BEcAGnee.js","_app/immutable/chunks/C-d51nL9.js","_app/immutable/chunks/kfStWTRK.js","_app/immutable/chunks/CzHinwsD.js","_app/immutable/chunks/BmMTTphw.js","_app/immutable/chunks/BoVXLz8J.js","_app/immutable/entry/app.idvYhMZ2.js","_app/immutable/chunks/kfStWTRK.js","_app/immutable/chunks/Cr1iQsZf.js","_app/immutable/chunks/D1ATb3b7.js","_app/immutable/chunks/BoVXLz8J.js","_app/immutable/chunks/C9mbOshn.js","_app/immutable/chunks/BFtNj20_.js","_app/immutable/chunks/BdgLcHm5.js","_app/immutable/chunks/CzHinwsD.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
