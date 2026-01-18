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
		client: {start:"_app/immutable/entry/start.Be0msCu0.js",app:"_app/immutable/entry/app.CHHK1mfY.js",imports:["_app/immutable/entry/start.Be0msCu0.js","_app/immutable/chunks/CWT5WWfL.js","_app/immutable/chunks/DimSMWNs.js","_app/immutable/chunks/36oPrS4e.js","_app/immutable/chunks/DAan-7yV.js","_app/immutable/chunks/DPPzBaZK.js","_app/immutable/entry/app.CHHK1mfY.js","_app/immutable/chunks/DimSMWNs.js","_app/immutable/chunks/Ccunq4lf.js","_app/immutable/chunks/KzInidiX.js","_app/immutable/chunks/DPPzBaZK.js","_app/immutable/chunks/CQlUKc8l.js","_app/immutable/chunks/BM0enYAg.js","_app/immutable/chunks/D0GrLqM-.js","_app/immutable/chunks/36oPrS4e.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
