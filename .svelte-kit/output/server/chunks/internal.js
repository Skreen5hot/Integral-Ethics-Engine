import{H as S,C as A,a as W,g as C,b as V,c as z,e as et,d as O,s as G,r as nt,u as st,i as Y,q as J,f as b,h as it,j as m,B as T,p as N,k as K,l as rt,m as P,n as y,o as j,t as at,v as F,w as Q,x as ot,y as B,D as lt,z as L,M as ht,A as ct,E as D,F as q,G as ft,I as ut,J as dt,K as _t,L as I,N as pt,O as mt,P as gt,Q as vt,R as yt,S as bt,T as wt,U as Et,V as kt,W as Tt,X as xt,Y as Rt}from"./index2.js";import{d as X,a as St,s as Ot}from"./context.js";import"clsx";import"./environment.js";import"./server.js";let Pt={};function $t(s){}function te(s){Pt=s}function Z(s){console.warn("https://svelte.dev/e/hydration_mismatch")}function At(){console.warn("https://svelte.dev/e/svelte_boundary_reset_noop")}let _=!1;function x(s){_=s}let u;function E(s){if(s===null)throw Z(),S;return u=s}function Ct(){return E(C(u))}function Nt(s=1){if(_){for(var t=s,e=u;t--;)e=C(e);u=e}}function Dt(s=!0){for(var t=0,e=u;;){if(e.nodeType===A){var r=e.data;if(r===W){if(t===0)return e;t-=1}else(r===V||r===z)&&(t+=1)}var a=C(e);s&&e.remove(),e=a}}function Ft(s){let t=0,e=G(0),r;return()=>{et()&&(O(e),nt(()=>(t===0&&(r=st(()=>s(()=>Y(e)))),t+=1,()=>{J(()=>{t-=1,t===0&&(r?.(),r=void 0,Y(e))})})))}}var It=ut|dt|_t;function Mt(s,t,e){new Yt(s,t,e)}class Yt{parent;is_pending=!1;#t;#e=_?u:null;#i;#f;#r;#s=null;#n=null;#a=null;#o=null;#h=null;#u=0;#l=0;#d=!1;#_=new Set;#p=new Set;#c=null;#b=Ft(()=>(this.#c=G(this.#u),()=>{this.#c=null}));constructor(t,e,r){this.#t=t,this.#i=e,this.#f=r,this.parent=b.b,this.is_pending=!!this.#i.pending,this.#r=it(()=>{if(b.b=this,_){const n=this.#e;Ct(),n.nodeType===A&&n.data===z?this.#E():(this.#w(),this.#l===0&&(this.is_pending=!1))}else{var a=this.#v();try{this.#s=m(()=>r(a))}catch(n){this.error(n)}this.#l>0?this.#g():this.is_pending=!1}return()=>{this.#h?.remove()}},It),_&&(this.#t=u)}#w(){try{this.#s=m(()=>this.#f(this.#t))}catch(t){this.error(t)}}#E(){const t=this.#i.pending;t&&(this.#n=m(()=>t(this.#t)),T.enqueue(()=>{var e=this.#v();this.#s=this.#m(()=>(T.ensure(),m(()=>this.#f(e)))),this.#l>0?this.#g():(N(this.#n,()=>{this.#n=null}),this.is_pending=!1)}))}#v(){var t=this.#t;return this.is_pending&&(this.#h=K(),this.#t.before(this.#h),t=this.#h),t}defer_effect(t){rt(t,this.#_,this.#p)}is_rendered(){return!this.is_pending&&(!this.parent||this.parent.is_rendered())}has_pending_snippet(){return!!this.#i.pending}#m(t){var e=b,r=F,a=Q;P(this.#r),y(this.#r),j(this.#r.ctx);try{return t()}catch(n){return at(n),null}finally{P(e),y(r),j(a)}}#g(){const t=this.#i.pending;this.#s!==null&&(this.#o=document.createDocumentFragment(),this.#o.append(this.#h),ot(this.#s,this.#o)),this.#n===null&&(this.#n=m(()=>t(this.#t)))}#y(t){if(!this.has_pending_snippet()){this.parent&&this.parent.#y(t);return}if(this.#l+=t,this.#l===0){this.is_pending=!1;for(const e of this.#_)B(e,lt),L(e);for(const e of this.#p)B(e,ht),L(e);this.#_.clear(),this.#p.clear(),this.#n&&N(this.#n,()=>{this.#n=null}),this.#o&&(this.#t.before(this.#o),this.#o=null)}}update_pending_count(t){this.#y(t),this.#u+=t,this.#c&&ct(this.#c,this.#u)}get_effect_pending(){return this.#b(),O(this.#c)}error(t){var e=this.#i.onerror;let r=this.#i.failed;if(this.#d||!e&&!r)throw t;this.#s&&(D(this.#s),this.#s=null),this.#n&&(D(this.#n),this.#n=null),this.#a&&(D(this.#a),this.#a=null),_&&(E(this.#e),Nt(),E(Dt()));var a=!1,n=!1;const i=()=>{if(a){At();return}a=!0,n&&ft(),T.ensure(),this.#u=0,this.#a!==null&&N(this.#a,()=>{this.#a=null}),this.is_pending=this.has_pending_snippet(),this.#s=this.#m(()=>(this.#d=!1,m(()=>this.#f(this.#t)))),this.#l>0?this.#g():this.is_pending=!1};var o=F;try{y(null),n=!0,e?.(t,i),n=!1}catch(h){q(h,this.#r&&this.#r.parent)}finally{y(o)}r&&J(()=>{this.#a=this.#m(()=>{T.ensure(),this.#d=!0;try{return m(()=>{r(this.#t,()=>t,()=>i)})}catch(h){return q(h,this.#r.parent),null}finally{this.#d=!1}})})}}const jt=new Set,H=new Set;let U=null;function R(s){var t=this,e=t.ownerDocument,r=s.type,a=s.composedPath?.()||[],n=a[0]||s.target;U=s;var i=0,o=U===s&&s.__root;if(o){var h=a.indexOf(o);if(h!==-1&&(t===document||t===window)){s.__root=t;return}var d=a.indexOf(t);if(d===-1)return;h<=d&&(i=h)}if(n=a[i]||s.target,n!==t){X(s,"currentTarget",{configurable:!0,get(){return n||e}});var p=F,f=b;y(null),P(null);try{for(var l,c=[];n!==null;){var g=n.assignedSlot||n.parentNode||n.host||null;try{var w=n["__"+r];w!=null&&(!n.disabled||s.target===n)&&w.call(n,s)}catch(k){l?c.push(k):l=k}if(s.cancelBubble||g===t||g===null)break;n=g}if(l){for(let k of c)queueMicrotask(()=>{throw k});throw l}}finally{s.__root=t,delete s.currentTarget,y(p),P(f)}}}function Bt(s,t){var e=b;e.nodes===null&&(e.nodes={start:s,end:t,a:null,t:null})}function $(s,t){return tt(s,t)}function Lt(s,t){I(),t.intro=t.intro??!1;const e=t.target,r=_,a=u;try{for(var n=pt(e);n&&(n.nodeType!==A||n.data!==V);)n=C(n);if(!n)throw S;x(!0),E(n);const i=tt(s,{...t,anchor:n});return x(!1),i}catch(i){if(i instanceof Error&&i.message.split(`
`).some(o=>o.startsWith("https://svelte.dev/e/")))throw i;return i!==S&&console.warn("Failed to hydrate: ",i),t.recover===!1&&mt(),I(),gt(e),x(!1),$(s,t)}finally{x(r),E(a)}}const v=new Map;function tt(s,{target:t,anchor:e,props:r={},events:a,context:n,intro:i=!0}){I();var o=new Set,h=f=>{for(var l=0;l<f.length;l++){var c=f[l];if(!o.has(c)){o.add(c);var g=yt(c);t.addEventListener(c,R,{passive:g});var w=v.get(c);w===void 0?(document.addEventListener(c,R,{passive:g}),v.set(c,1)):v.set(c,w+1)}}};h(St(jt)),H.add(h);var d=void 0,p=vt(()=>{var f=e??t.appendChild(K());return Mt(f,{pending:()=>{}},l=>{if(n){bt({});var c=Q;c.c=n}if(a&&(r.$$events=a),_&&Bt(l,null),d=s(l,r)||{},_&&(b.nodes.end=u,u===null||u.nodeType!==A||u.data!==W))throw Z(),S;n&&wt()}),()=>{for(var l of o){t.removeEventListener(l,R);var c=v.get(l);--c===0?(document.removeEventListener(l,R),v.delete(l)):v.set(l,c)}H.delete(h),f!==e&&f.parentNode?.removeChild(f)}});return M.set(d,p),d}let M=new WeakMap;function qt(s,t){const e=M.get(s);return e?(M.delete(s),e(t)):Promise.resolve()}function Ht(s){return class extends Ut{constructor(t){super({component:s,...t})}}}class Ut{#t;#e;constructor(t){var e=new Map,r=(n,i)=>{var o=xt(i,!1,!1);return e.set(n,o),o};const a=new Proxy({...t.props||{},$$events:{}},{get(n,i){return O(e.get(i)??r(i,Reflect.get(n,i)))},has(n,i){return i===kt?!0:(O(e.get(i)??r(i,Reflect.get(n,i))),Reflect.has(n,i))},set(n,i,o){return Et(e.get(i)??r(i,o),o),Reflect.set(n,i,o)}});this.#e=(t.hydrate?Lt:$)(t.component,{target:t.target,anchor:t.anchor,props:a,context:t.context,intro:t.intro??!1,recover:t.recover}),(!t?.props?.$$host||t.sync===!1)&&Tt(),this.#t=a.$$events;for(const n of Object.keys(this.#e))n==="$set"||n==="$destroy"||n==="$on"||X(this,n,{get(){return this.#e[n]},set(i){this.#e[n]=i},enumerable:!0});this.#e.$set=n=>{Object.assign(a,n)},this.#e.$destroy=()=>{qt(this.#e)}}$set(t){this.#e.$set(t)}$on(t,e){this.#t[t]=this.#t[t]||[];const r=(...a)=>e.call(this,...a);return this.#t[t].push(r),()=>{this.#t[t]=this.#t[t].filter(a=>a!==r)}}$destroy(){this.#e.$destroy()}}let Wt=null;function ee(s){Wt=s}function ne(s){}function Vt(s){const t=Ht(s),e=(r,{context:a,csp:n}={})=>{const i=Rt(s,{props:r,context:a,csp:n}),o=Object.defineProperties({},{css:{value:{code:"",map:null}},head:{get:()=>i.head},html:{get:()=>i.body},then:{value:(h,d)=>{{const p=h({css:o.css,head:o.head,html:o.html});return Promise.resolve(p)}}}});return o};return t.render=e,t}function zt(s,t){s.component(e=>{let{stores:r,page:a,constructors:n,components:i=[],form:o,data_0:h=null,data_1:d=null}=t;Ot("__svelte__",r),r.page.set(a);const p=n[1];if(n[1]){e.push("<!--[-->");const f=n[0];e.push("<!---->"),f(e,{data:h,form:o,params:a.params,children:l=>{l.push("<!---->"),p(l,{data:d,form:o,params:a.params}),l.push("<!---->")},$$slots:{default:!0}}),e.push("<!---->")}else{e.push("<!--[!-->");const f=n[0];e.push("<!---->"),f(e,{data:h,form:o,params:a.params}),e.push("<!---->")}e.push("<!--]--> "),e.push("<!--[!-->"),e.push("<!--]-->")})}const Gt=Vt(zt),se={app_template_contains_nonce:!1,async:!1,csp:{mode:"auto",directives:{"upgrade-insecure-requests":!1,"block-all-mixed-content":!1},reportOnly:{"upgrade-insecure-requests":!1,"block-all-mixed-content":!1}},csrf_check_origin:!0,csrf_trusted_origins:[],embedded:!1,env_public_prefix:"PUBLIC_",env_private_prefix:"",hash_routing:!1,hooks:null,preload_strategy:"modulepreload",root:Gt,service_worker:!1,service_worker_options:void 0,templates:{app:({head:s,body:t,assets:e,nonce:r,env:a})=>`<!doctype html>
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
		<script src="/collaborations/tagteam/dist/tagteam.js"><\/script>

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
`},version_hash:"1bhgiri"};async function ie(){return{handle:void 0,handleFetch:void 0,handleError:void 0,handleValidationError:void 0,init:void 0,reroute:void 0,transport:void 0}}export{te as a,ee as b,ne as c,ie as g,se as o,Pt as p,Wt as r,$t as s};
