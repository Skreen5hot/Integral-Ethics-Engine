export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["collaborations/tagteam/dist/tagteam.js","favicon.png","icon-192.png","icon-512.png","manifest.json"]),
	mimeTypes: {".js":"text/javascript",".png":"image/png",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.DYdMZh09.js",app:"_app/immutable/entry/app.CK47aysi.js",imports:["_app/immutable/entry/start.DYdMZh09.js","_app/immutable/chunks/CymLBvZG.js","_app/immutable/chunks/DoHTLkW9.js","_app/immutable/chunks/7iofg56s.js","_app/immutable/chunks/Bp4liEdJ.js","_app/immutable/chunks/2rQ4z31m.js","_app/immutable/entry/app.CK47aysi.js","_app/immutable/chunks/DoHTLkW9.js","_app/immutable/chunks/CLB9YTXT.js","_app/immutable/chunks/6je7jFEO.js","_app/immutable/chunks/2rQ4z31m.js","_app/immutable/chunks/BJiw7fV6.js","_app/immutable/chunks/CWSxt2h6.js","_app/immutable/chunks/Ms0FWifF.js","_app/immutable/chunks/7iofg56s.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/","/deliberate/","/history/","/settings/","/worldviews/"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
