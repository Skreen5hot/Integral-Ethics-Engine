

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/deliberate/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.C9v4VdNo.js"];
export const stylesheets = [];
export const fonts = [];
