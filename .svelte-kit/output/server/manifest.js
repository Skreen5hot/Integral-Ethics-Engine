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
		client: {start:"_app/immutable/entry/start.CGLikhjZ.js",app:"_app/immutable/entry/app.D7ukM5-l.js",imports:["_app/immutable/entry/start.CGLikhjZ.js","_app/immutable/chunks/CSsrruTB.js","_app/immutable/chunks/yy-X4gVo.js","_app/immutable/chunks/mZxf8JCc.js","_app/immutable/chunks/DI32C8Y0.js","_app/immutable/chunks/B5EIaqTz.js","_app/immutable/entry/app.D7ukM5-l.js","_app/immutable/chunks/yy-X4gVo.js","_app/immutable/chunks/Gi9er-sy.js","_app/immutable/chunks/rSK1Klio.js","_app/immutable/chunks/B5EIaqTz.js","_app/immutable/chunks/DmsG_J6d.js","_app/immutable/chunks/O5FhpEwr.js","_app/immutable/chunks/Bo6tmEsf.js","_app/immutable/chunks/mZxf8JCc.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
