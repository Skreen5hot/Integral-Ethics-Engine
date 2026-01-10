import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.Dh8Z8H7d.js","_app/immutable/chunks/rSK1Klio.js","_app/immutable/chunks/yy-X4gVo.js","_app/immutable/chunks/DbL4GYPF.js","_app/immutable/chunks/BbdfUIKr.js"];
export const stylesheets = ["_app/immutable/assets/0.uU2iDjhK.css"];
export const fonts = [];
