import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.CUphnrfb.js","_app/immutable/chunks/DEje7VYS.js","_app/immutable/chunks/CCMFVUdF.js","_app/immutable/chunks/BeHn0zvA.js","_app/immutable/chunks/COCKnQ0O.js","_app/immutable/chunks/Cu22nZau.js","_app/immutable/chunks/D1IRS1Zc.js"];
export const stylesheets = ["_app/immutable/assets/0.uU2iDjhK.css"];
export const fonts = [];
