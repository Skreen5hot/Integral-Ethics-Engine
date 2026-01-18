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
		client: {start:"_app/immutable/entry/start.GVpaDq6F.js",app:"_app/immutable/entry/app.Ds9bBn8l.js",imports:["_app/immutable/entry/start.GVpaDq6F.js","_app/immutable/chunks/D4N1vKiJ.js","_app/immutable/chunks/DoHTLkW9.js","_app/immutable/chunks/7iofg56s.js","_app/immutable/chunks/EDiWmki5.js","_app/immutable/chunks/2rQ4z31m.js","_app/immutable/entry/app.Ds9bBn8l.js","_app/immutable/chunks/DoHTLkW9.js","_app/immutable/chunks/CLB9YTXT.js","_app/immutable/chunks/6je7jFEO.js","_app/immutable/chunks/2rQ4z31m.js","_app/immutable/chunks/BJiw7fV6.js","_app/immutable/chunks/CWSxt2h6.js","_app/immutable/chunks/Ms0FWifF.js","_app/immutable/chunks/7iofg56s.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
