

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/history/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.BhOe5cFd.js"];
export const stylesheets = [];
export const fonts = [];
