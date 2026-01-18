import{H as S,C,a as Y,g as A,b as U,c as W,e as $,d as O,s as z,r as tt,u as et,i as j,q as V,f as b,h as nt,j as m,B as x,p as N,k as G,l as P,m as y,n as L,o as st,t as D,v as J,w as rt,x as it,y as F,z as B,A as at,E as ot,D as lt,F as ht,G as I,I as ct,J as ut,K as ft,L as dt,M as pt,N as _t,O as mt,P as gt,Q as vt,R as yt,S as bt,T as wt}from"./index2.js";import{d as K,a as Et,s as kt}from"./context.js";import"clsx";import"./environment.js";import"./server.js";let xt={};function Jt(s){}function Kt(s){xt=s}function Q(s){console.warn("https://svelte.dev/e/hydration_mismatch")}function Tt(){console.warn("https://svelte.dev/e/svelte_boundary_reset_noop")}let p=!1;function T(s){p=s}let f;function E(s){if(s===null)throw Q(),S;return f=s}function Rt(){return E(A(f))}function St(s=1){if(p){for(var t=s,e=f;t--;)e=A(e);f=e}}function Ot(s=!0){for(var t=0,e=f;;){if(e.nodeType===C){var i=e.data;if(i===Y){if(t===0)return e;t-=1}else(i===U||i===W)&&(t+=1)}var a=A(e);s&&e.remove(),e=a}}function Pt(s){let t=0,e=z(0),i;return()=>{$()&&(O(e),tt(()=>(t===0&&(i=et(()=>s(()=>j(e)))),t+=1,()=>{V(()=>{t-=1,t===0&&(i?.(),i=void 0,j(e))})})))}}var Ct=ot|lt|ht;function At(s,t,e){new Nt(s,t,e)}class Nt{parent;#e=!1;#t;#m=p?f:null;#r;#u;#i;#s=null;#n=null;#a=null;#o=null;#l=null;#f=0;#h=0;#d=!1;#c=null;#y=Pt(()=>(this.#c=z(this.#f),()=>{this.#c=null}));constructor(t,e,i){this.#t=t,this.#r=e,this.#u=i,this.parent=b.b,this.#e=!!this.#r.pending,this.#i=nt(()=>{if(b.b=this,p){const n=this.#m;Rt(),n.nodeType===C&&n.data===W?this.#w():this.#b()}else{var a=this.#g();try{this.#s=m(()=>i(a))}catch(n){this.error(n)}this.#h>0?this.#_():this.#e=!1}return()=>{this.#l?.remove()}},Ct),p&&(this.#t=f)}#b(){try{this.#s=m(()=>this.#u(this.#t))}catch(t){this.error(t)}this.#e=!1}#w(){const t=this.#r.pending;t&&(this.#n=m(()=>t(this.#t)),x.enqueue(()=>{var e=this.#g();this.#s=this.#p(()=>(x.ensure(),m(()=>this.#u(e)))),this.#h>0?this.#_():(N(this.#n,()=>{this.#n=null}),this.#e=!1)}))}#g(){var t=this.#t;return this.#e&&(this.#l=G(),this.#t.before(this.#l),t=this.#l),t}is_pending(){return this.#e||!!this.parent&&this.parent.is_pending()}has_pending_snippet(){return!!this.#r.pending}#p(t){var e=b,i=D,a=J;P(this.#i),y(this.#i),L(this.#i.ctx);try{return t()}catch(n){return st(n),null}finally{P(e),y(i),L(a)}}#_(){const t=this.#r.pending;this.#s!==null&&(this.#o=document.createDocumentFragment(),this.#o.append(this.#l),rt(this.#s,this.#o)),this.#n===null&&(this.#n=m(()=>t(this.#t)))}#v(t){if(!this.has_pending_snippet()){this.parent&&this.parent.#v(t);return}this.#h+=t,this.#h===0&&(this.#e=!1,this.#n&&N(this.#n,()=>{this.#n=null}),this.#o&&(this.#t.before(this.#o),this.#o=null))}update_pending_count(t){this.#v(t),this.#f+=t,this.#c&&it(this.#c,this.#f)}get_effect_pending(){return this.#y(),O(this.#c)}error(t){var e=this.#r.onerror;let i=this.#r.failed;if(this.#d||!e&&!i)throw t;this.#s&&(F(this.#s),this.#s=null),this.#n&&(F(this.#n),this.#n=null),this.#a&&(F(this.#a),this.#a=null),p&&(E(this.#m),St(),E(Ot()));var a=!1,n=!1;const r=()=>{if(a){Tt();return}a=!0,n&&at(),x.ensure(),this.#f=0,this.#a!==null&&N(this.#a,()=>{this.#a=null}),this.#e=this.has_pending_snippet(),this.#s=this.#p(()=>(this.#d=!1,m(()=>this.#u(this.#t)))),this.#h>0?this.#_():this.#e=!1};var o=D;try{y(null),n=!0,e?.(t,r),n=!1}catch(h){B(h,this.#i&&this.#i.parent)}finally{y(o)}i&&V(()=>{this.#a=this.#p(()=>{x.ensure(),this.#d=!0;try{return m(()=>{i(this.#t,()=>t,()=>r)})}catch(h){return B(h,this.#i.parent),null}finally{this.#d=!1}})})}}const Ft=new Set,q=new Set;let H=null;function R(s){var t=this,e=t.ownerDocument,i=s.type,a=s.composedPath?.()||[],n=a[0]||s.target;H=s;var r=0,o=H===s&&s.__root;if(o){var h=a.indexOf(o);if(h!==-1&&(t===document||t===window)){s.__root=t;return}var d=a.indexOf(t);if(d===-1)return;h<=d&&(r=h)}if(n=a[r]||s.target,n!==t){K(s,"currentTarget",{configurable:!0,get(){return n||e}});var _=D,u=b;y(null),P(null);try{for(var l,c=[];n!==null;){var g=n.assignedSlot||n.parentNode||n.host||null;try{var w=n["__"+i];w!=null&&(!n.disabled||s.target===n)&&w.call(n,s)}catch(k){l?c.push(k):l=k}if(s.cancelBubble||g===t||g===null)break;n=g}if(l){for(let k of c)queueMicrotask(()=>{throw k});throw l}}finally{s.__root=t,delete s.currentTarget,y(_),P(u)}}}function Dt(s,t){var e=b;e.nodes===null&&(e.nodes={start:s,end:t,a:null,t:null})}function X(s,t){return Z(s,t)}function It(s,t){I(),t.intro=t.intro??!1;const e=t.target,i=p,a=f;try{for(var n=ct(e);n&&(n.nodeType!==C||n.data!==U);)n=A(n);if(!n)throw S;T(!0),E(n);const r=Z(s,{...t,anchor:n});return T(!1),r}catch(r){if(r instanceof Error&&r.message.split(`
`).some(o=>o.startsWith("https://svelte.dev/e/")))throw r;return r!==S&&console.warn("Failed to hydrate: ",r),t.recover===!1&&ut(),I(),ft(e),T(!1),X(s,t)}finally{T(i),E(a)}}const v=new Map;function Z(s,{target:t,anchor:e,props:i={},events:a,context:n,intro:r=!0}){I();var o=new Set,h=u=>{for(var l=0;l<u.length;l++){var c=u[l];if(!o.has(c)){o.add(c);var g=pt(c);t.addEventListener(c,R,{passive:g});var w=v.get(c);w===void 0?(document.addEventListener(c,R,{passive:g}),v.set(c,1)):v.set(c,w+1)}}};h(Et(Ft)),q.add(h);var d=void 0,_=dt(()=>{var u=e??t.appendChild(G());return At(u,{pending:()=>{}},l=>{if(n){_t({});var c=J;c.c=n}if(a&&(i.$$events=a),p&&Dt(l,null),d=s(l,i)||{},p&&(b.nodes.end=f,f===null||f.nodeType!==C||f.data!==Y))throw Q(),S;n&&mt()}),()=>{for(var l of o){t.removeEventListener(l,R);var c=v.get(l);--c===0?(document.removeEventListener(l,R),v.delete(l)):v.set(l,c)}q.delete(h),u!==e&&u.parentNode?.removeChild(u)}});return M.set(d,_),d}let M=new WeakMap;function Mt(s,t){const e=M.get(s);return e?(M.delete(s),e(t)):Promise.resolve()}function jt(s){return class extends Lt{constructor(t){super({component:s,...t})}}}class Lt{#e;#t;constructor(t){var e=new Map,i=(n,r)=>{var o=bt(r,!1,!1);return e.set(n,o),o};const a=new Proxy({...t.props||{},$$events:{}},{get(n,r){return O(e.get(r)??i(r,Reflect.get(n,r)))},has(n,r){return r===vt?!0:(O(e.get(r)??i(r,Reflect.get(n,r))),Reflect.has(n,r))},set(n,r,o){return gt(e.get(r)??i(r,o),o),Reflect.set(n,r,o)}});this.#t=(t.hydrate?It:X)(t.component,{target:t.target,anchor:t.anchor,props:a,context:t.context,intro:t.intro??!1,recover:t.recover}),(!t?.props?.$$host||t.sync===!1)&&yt(),this.#e=a.$$events;for(const n of Object.keys(this.#t))n==="$set"||n==="$destroy"||n==="$on"||K(this,n,{get(){return this.#t[n]},set(r){this.#t[n]=r},enumerable:!0});this.#t.$set=n=>{Object.assign(a,n)},this.#t.$destroy=()=>{Mt(this.#t)}}$set(t){this.#t.$set(t)}$on(t,e){this.#e[t]=this.#e[t]||[];const i=(...a)=>e.call(this,...a);return this.#e[t].push(i),()=>{this.#e[t]=this.#e[t].filter(a=>a!==i)}}$destroy(){this.#t.$destroy()}}let Bt=null;function Qt(s){Bt=s}function Xt(s){}function qt(s){const t=jt(s),e=(i,{context:a,csp:n}={})=>{const r=wt(s,{props:i,context:a,csp:n}),o=Object.defineProperties({},{css:{value:{code:"",map:null}},head:{get:()=>r.head},html:{get:()=>r.body},then:{value:(h,d)=>{{const _=h({css:o.css,head:o.head,html:o.html});return Promise.resolve(_)}}}});return o};return t.render=e,t}function Ht(s,t){s.component(e=>{let{stores:i,page:a,constructors:n,components:r=[],form:o,data_0:h=null,data_1:d=null}=t;kt("__svelte__",i),i.page.set(a);const _=n[1];if(n[1]){e.push("<!--[-->");const u=n[0];e.push("<!---->"),u(e,{data:h,form:o,params:a.params,children:l=>{l.push("<!---->"),_(l,{data:d,form:o,params:a.params}),l.push("<!---->")},$$slots:{default:!0}}),e.push("<!---->")}else{e.push("<!--[!-->");const u=n[0];e.push("<!---->"),u(e,{data:h,form:o,params:a.params}),e.push("<!---->")}e.push("<!--]--> "),e.push("<!--[!-->"),e.push("<!--]-->")})}const Yt=qt(Ht),Zt={app_template_contains_nonce:!1,async:!1,csp:{mode:"auto",directives:{"upgrade-insecure-requests":!1,"block-all-mixed-content":!1},reportOnly:{"upgrade-insecure-requests":!1,"block-all-mixed-content":!1}},csrf_check_origin:!0,csrf_trusted_origins:[],embedded:!1,env_public_prefix:"PUBLIC_",env_private_prefix:"",hash_routing:!1,hooks:null,preload_strategy:"modulepreload",root:Yt,service_worker:!1,service_worker_options:void 0,templates:{app:({head:s,body:t,assets:e,nonce:i,env:a})=>`<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="`+e+`/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />

		<!-- PWA Meta Tags -->
		<meta name="description" content="Integral Ethics Engine - Multi-perspectival ethical deliberation framework" />
		<meta name="theme-color" content="#2563eb" />
		<link rel="manifest" href="`+e+`/manifest.json" />

		<!-- Apple PWA Support -->
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-status-bar-style" content="default" />
		<meta name="apple-mobile-web-app-title" content="IEE" />
		<link rel="apple-touch-icon" href="`+e+`/icon-192.png" />

		<!-- TagTeam v2.0.0 Semantic Analysis (Phase 2 Integration) -->
		<script src="`+e+`/lib/tagteam.js"><\/script>

		`+s+`
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">`+t+`</div>
	</body>
</html>
`,error:({status:s,message:t})=>`<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<title>`+t+`</title>

		<style>
			body {
				--bg: white;
				--fg: #222;
				--divider: #ccc;
				background: var(--bg);
				color: var(--fg);
				font-family:
					system-ui,
					-apple-system,
					BlinkMacSystemFont,
					'Segoe UI',
					Roboto,
					Oxygen,
					Ubuntu,
					Cantarell,
					'Open Sans',
					'Helvetica Neue',
					sans-serif;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100vh;
				margin: 0;
			}

			.error {
				display: flex;
				align-items: center;
				max-width: 32rem;
				margin: 0 1rem;
			}

			.status {
				font-weight: 200;
				font-size: 3rem;
				line-height: 1;
				position: relative;
				top: -0.05rem;
			}

			.message {
				border-left: 1px solid var(--divider);
				padding: 0 0 0 1rem;
				margin: 0 0 0 1rem;
				min-height: 2.5rem;
				display: flex;
				align-items: center;
			}

			.message h1 {
				font-weight: 400;
				font-size: 1em;
				margin: 0;
			}

			@media (prefers-color-scheme: dark) {
				body {
					--bg: #222;
					--fg: #ddd;
					--divider: #666;
				}
			}
		</style>
	</head>
	<body>
		<div class="error">
			<span class="status">`+s+`</span>
			<div class="message">
				<h1>`+t+`</h1>
			</div>
		</div>
	</body>
</html>
`},version_hash:"rf6ym4"};async function $t(){return{handle:void 0,handleFetch:void 0,handleError:void 0,handleValidationError:void 0,init:void 0,reroute:void 0,transport:void 0}}export{Kt as a,Qt as b,Xt as c,$t as g,Zt as o,xt as p,Bt as r,Jt as s};
