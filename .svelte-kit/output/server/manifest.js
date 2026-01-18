export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","icon-192.png","icon-512.png","lib/tagteam.js","lib/tagteam.v2.0.backup.js","manifest.json"]),
	mimeTypes: {".png":"image/png",".js":"text/javascript",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.Dy_qVPwq.js",app:"_app/immutable/entry/app.Bcg204-X.js",imports:["_app/immutable/entry/start.Dy_qVPwq.js","_app/immutable/chunks/Ckzj8C7d.js","_app/immutable/chunks/CCMFVUdF.js","_app/immutable/chunks/BnPjzk99.js","_app/immutable/chunks/DKrGR2SJ.js","_app/immutable/chunks/COCKnQ0O.js","_app/immutable/entry/app.Bcg204-X.js","_app/immutable/chunks/CCMFVUdF.js","_app/immutable/chunks/B_Eww-A_.js","_app/immutable/chunks/DEje7VYS.js","_app/immutable/chunks/COCKnQ0O.js","_app/immutable/chunks/o6eeKhFx.js","_app/immutable/chunks/DjY7mxmK.js","_app/immutable/chunks/AVHD6OBG.js","_app/immutable/chunks/BnPjzk99.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
