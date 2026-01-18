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
		client: {start:"_app/immutable/entry/start.D8Kg6cwo.js",app:"_app/immutable/entry/app.DseUNo_Y.js",imports:["_app/immutable/entry/start.D8Kg6cwo.js","_app/immutable/chunks/rwRut_gH.js","_app/immutable/chunks/kfStWTRK.js","_app/immutable/chunks/CzHinwsD.js","_app/immutable/chunks/Dp4WYZur.js","_app/immutable/chunks/BoVXLz8J.js","_app/immutable/entry/app.DseUNo_Y.js","_app/immutable/chunks/kfStWTRK.js","_app/immutable/chunks/Cr1iQsZf.js","_app/immutable/chunks/D1ATb3b7.js","_app/immutable/chunks/BoVXLz8J.js","_app/immutable/chunks/C9mbOshn.js","_app/immutable/chunks/BFtNj20_.js","_app/immutable/chunks/BdgLcHm5.js","_app/immutable/chunks/CzHinwsD.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
