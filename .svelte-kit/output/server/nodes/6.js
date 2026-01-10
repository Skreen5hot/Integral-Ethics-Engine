

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/worldviews/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.9MgjBFIm.js"];
export const stylesheets = [];
export const fonts = [];
