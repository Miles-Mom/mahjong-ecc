(()=>{var t={3099:t=>{t.exports=function(t){if("function"!=typeof t)throw TypeError(String(t)+" is not a function");return t}},6077:(t,e,r)=>{var n=r(111);t.exports=function(t){if(!n(t)&&null!==t)throw TypeError("Can't set "+String(t)+" as a prototype");return t}},1223:(t,e,r)=>{var n=r(5112),o=r(30),a=r(3070),i=n("unscopables"),u=Array.prototype;null==u[i]&&a.f(u,i,{configurable:!0,value:o(null)}),t.exports=function(t){u[i][t]=!0}},5787:t=>{t.exports=function(t,e,r){if(!(t instanceof e))throw TypeError("Incorrect "+(r?r+" ":"")+"invocation");return t}},9670:(t,e,r)=>{var n=r(111);t.exports=function(t){if(!n(t))throw TypeError(String(t)+" is not an object");return t}},8457:(t,e,r)=>{"use strict";var n=r(9974),o=r(7908),a=r(3411),i=r(7659),u=r(7466),s=r(6135),c=r(1246);t.exports=function(t){var e,r,f,l,p,h,v=o(t),g="function"==typeof this?this:Array,y=arguments.length,d=y>1?arguments[1]:void 0,m=void 0!==d,b=c(v),w=0;if(m&&(d=n(d,y>2?arguments[2]:void 0,2)),null==b||g==Array&&i(b))for(r=new g(e=u(v.length));e>w;w++)h=m?d(v[w],w):v[w],s(r,w,h);else for(p=(l=b.call(v)).next,r=new g;!(f=p.call(l)).done;w++)h=m?a(l,d,[f.value,w],!0):f.value,s(r,w,h);return r.length=w,r}},1318:(t,e,r)=>{var n=r(5656),o=r(7466),a=r(1400),i=function(t){return function(e,r,i){var u,s=n(e),c=o(s.length),f=a(i,c);if(t&&r!=r){for(;c>f;)if((u=s[f++])!=u)return!0}else for(;c>f;f++)if((t||f in s)&&s[f]===r)return t||f||0;return!t&&-1}};t.exports={includes:i(!0),indexOf:i(!1)}},3411:(t,e,r)=>{var n=r(9670),o=r(9212);t.exports=function(t,e,r,a){try{return a?e(n(r)[0],r[1]):e(r)}catch(e){throw o(t),e}}},4326:t=>{var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},648:(t,e,r)=>{var n=r(1694),o=r(4326),a=r(5112)("toStringTag"),i="Arguments"==o(function(){return arguments}());t.exports=n?o:function(t){var e,r,n;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(r=function(t,e){try{return t[e]}catch(t){}}(e=Object(t),a))?r:i?o(e):"Object"==(n=o(e))&&"function"==typeof e.callee?"Arguments":n}},9920:(t,e,r)=>{var n=r(6656),o=r(3887),a=r(1236),i=r(3070);t.exports=function(t,e){for(var r=o(e),u=i.f,s=a.f,c=0;c<r.length;c++){var f=r[c];n(t,f)||u(t,f,s(e,f))}}},8544:(t,e,r)=>{var n=r(7293);t.exports=!n((function(){function t(){}return t.prototype.constructor=null,Object.getPrototypeOf(new t)!==t.prototype}))},4994:(t,e,r)=>{"use strict";var n=r(3383).IteratorPrototype,o=r(30),a=r(9114),i=r(8003),u=r(7497),s=function(){return this};t.exports=function(t,e,r){var c=e+" Iterator";return t.prototype=o(n,{next:a(1,r)}),i(t,c,!1,!0),u[c]=s,t}},8880:(t,e,r)=>{var n=r(9781),o=r(3070),a=r(9114);t.exports=n?function(t,e,r){return o.f(t,e,a(1,r))}:function(t,e,r){return t[e]=r,t}},9114:t=>{t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},6135:(t,e,r)=>{"use strict";var n=r(7593),o=r(3070),a=r(9114);t.exports=function(t,e,r){var i=n(e);i in t?o.f(t,i,a(0,r)):t[i]=r}},654:(t,e,r)=>{"use strict";var n=r(2109),o=r(4994),a=r(9518),i=r(7674),u=r(8003),s=r(8880),c=r(1320),f=r(5112),l=r(1913),p=r(7497),h=r(3383),v=h.IteratorPrototype,g=h.BUGGY_SAFARI_ITERATORS,y=f("iterator"),d="keys",m="values",b="entries",w=function(){return this};t.exports=function(t,e,r,f,h,x,S){o(r,e,f);var L,A,O,k=function(t){if(t===h&&T)return T;if(!g&&t in U)return U[t];switch(t){case d:case m:case b:return function(){return new r(this,t)}}return function(){return new r(this)}},R=e+" Iterator",j=!1,U=t.prototype,P=U[y]||U["@@iterator"]||h&&U[h],T=!g&&P||k(h),E="Array"==e&&U.entries||P;if(E&&(L=a(E.call(new t)),v!==Object.prototype&&L.next&&(l||a(L)===v||(i?i(L,v):"function"!=typeof L[y]&&s(L,y,w)),u(L,R,!0,!0),l&&(p[R]=w))),h==m&&P&&P.name!==m&&(j=!0,T=function(){return P.call(this)}),l&&!S||U[y]===T||s(U,y,T),p[e]=T,h)if(A={values:k(m),keys:x?T:k(d),entries:k(b)},S)for(O in A)(g||j||!(O in U))&&c(U,O,A[O]);else n({target:e,proto:!0,forced:g||j},A);return A}},9781:(t,e,r)=>{var n=r(7293);t.exports=!n((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]}))},317:(t,e,r)=>{var n=r(7854),o=r(111),a=n.document,i=o(a)&&o(a.createElement);t.exports=function(t){return i?a.createElement(t):{}}},8324:t=>{t.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}},5268:(t,e,r)=>{var n=r(4326),o=r(7854);t.exports="process"==n(o.process)},8113:(t,e,r)=>{var n=r(5005);t.exports=n("navigator","userAgent")||""},7392:(t,e,r)=>{var n,o,a=r(7854),i=r(8113),u=a.process,s=u&&u.versions,c=s&&s.v8;c?o=(n=c.split("."))[0]+n[1]:i&&(!(n=i.match(/Edge\/(\d+)/))||n[1]>=74)&&(n=i.match(/Chrome\/(\d+)/))&&(o=n[1]),t.exports=o&&+o},748:t=>{t.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]},2109:(t,e,r)=>{var n=r(7854),o=r(1236).f,a=r(8880),i=r(1320),u=r(3505),s=r(9920),c=r(4705);t.exports=function(t,e){var r,f,l,p,h,v=t.target,g=t.global,y=t.stat;if(r=g?n:y?n[v]||u(v,{}):(n[v]||{}).prototype)for(f in e){if(p=e[f],l=t.noTargetGet?(h=o(r,f))&&h.value:r[f],!c(g?f:v+(y?".":"#")+f,t.forced)&&void 0!==l){if(typeof p==typeof l)continue;s(p,l)}(t.sham||l&&l.sham)&&a(p,"sham",!0),i(r,f,p,t)}}},7293:t=>{t.exports=function(t){try{return!!t()}catch(t){return!0}}},9974:(t,e,r)=>{var n=r(3099);t.exports=function(t,e,r){if(n(t),void 0===e)return t;switch(r){case 0:return function(){return t.call(e)};case 1:return function(r){return t.call(e,r)};case 2:return function(r,n){return t.call(e,r,n)};case 3:return function(r,n,o){return t.call(e,r,n,o)}}return function(){return t.apply(e,arguments)}}},5005:(t,e,r)=>{var n=r(857),o=r(7854),a=function(t){return"function"==typeof t?t:void 0};t.exports=function(t,e){return arguments.length<2?a(n[t])||a(o[t]):n[t]&&n[t][e]||o[t]&&o[t][e]}},1246:(t,e,r)=>{var n=r(648),o=r(7497),a=r(5112)("iterator");t.exports=function(t){if(null!=t)return t[a]||t["@@iterator"]||o[n(t)]}},8554:(t,e,r)=>{var n=r(9670),o=r(1246);t.exports=function(t){var e=o(t);if("function"!=typeof e)throw TypeError(String(t)+" is not iterable");return n(e.call(t))}},7854:(t,e,r)=>{var n=function(t){return t&&t.Math==Math&&t};t.exports=n("object"==typeof globalThis&&globalThis)||n("object"==typeof window&&window)||n("object"==typeof self&&self)||n("object"==typeof r.g&&r.g)||function(){return this}()||Function("return this")()},6656:(t,e,r)=>{var n=r(7908),o={}.hasOwnProperty;t.exports=function(t,e){return o.call(n(t),e)}},3501:t=>{t.exports={}},490:(t,e,r)=>{var n=r(5005);t.exports=n("document","documentElement")},4664:(t,e,r)=>{var n=r(9781),o=r(7293),a=r(317);t.exports=!n&&!o((function(){return 7!=Object.defineProperty(a("div"),"a",{get:function(){return 7}}).a}))},8361:(t,e,r)=>{var n=r(7293),o=r(4326),a="".split;t.exports=n((function(){return!Object("z").propertyIsEnumerable(0)}))?function(t){return"String"==o(t)?a.call(t,""):Object(t)}:Object},2788:(t,e,r)=>{var n=r(5465),o=Function.toString;"function"!=typeof n.inspectSource&&(n.inspectSource=function(t){return o.call(t)}),t.exports=n.inspectSource},9909:(t,e,r)=>{var n,o,a,i=r(8536),u=r(7854),s=r(111),c=r(8880),f=r(6656),l=r(5465),p=r(6200),h=r(3501),v="Object already initialized",g=u.WeakMap;if(i){var y=l.state||(l.state=new g),d=y.get,m=y.has,b=y.set;n=function(t,e){if(m.call(y,t))throw new TypeError(v);return e.facade=t,b.call(y,t,e),e},o=function(t){return d.call(y,t)||{}},a=function(t){return m.call(y,t)}}else{var w=p("state");h[w]=!0,n=function(t,e){if(f(t,w))throw new TypeError(v);return e.facade=t,c(t,w,e),e},o=function(t){return f(t,w)?t[w]:{}},a=function(t){return f(t,w)}}t.exports={set:n,get:o,has:a,enforce:function(t){return a(t)?o(t):n(t,{})},getterFor:function(t){return function(e){var r;if(!s(e)||(r=o(e)).type!==t)throw TypeError("Incompatible receiver, "+t+" required");return r}}}},7659:(t,e,r)=>{var n=r(5112),o=r(7497),a=n("iterator"),i=Array.prototype;t.exports=function(t){return void 0!==t&&(o.Array===t||i[a]===t)}},4705:(t,e,r)=>{var n=r(7293),o=/#|\.prototype\./,a=function(t,e){var r=u[i(t)];return r==c||r!=s&&("function"==typeof e?n(e):!!e)},i=a.normalize=function(t){return String(t).replace(o,".").toLowerCase()},u=a.data={},s=a.NATIVE="N",c=a.POLYFILL="P";t.exports=a},111:t=>{t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},1913:t=>{t.exports=!1},9212:(t,e,r)=>{var n=r(9670);t.exports=function(t){var e=t.return;if(void 0!==e)return n(e.call(t)).value}},3383:(t,e,r)=>{"use strict";var n,o,a,i=r(7293),u=r(9518),s=r(8880),c=r(6656),f=r(5112),l=r(1913),p=f("iterator"),h=!1;[].keys&&("next"in(a=[].keys())?(o=u(u(a)))!==Object.prototype&&(n=o):h=!0);var v=null==n||i((function(){var t={};return n[p].call(t)!==t}));v&&(n={}),l&&!v||c(n,p)||s(n,p,(function(){return this})),t.exports={IteratorPrototype:n,BUGGY_SAFARI_ITERATORS:h}},7497:t=>{t.exports={}},133:(t,e,r)=>{var n=r(5268),o=r(7392),a=r(7293);t.exports=!!Object.getOwnPropertySymbols&&!a((function(){return!Symbol.sham&&(n?38===o:o>37&&o<41)}))},590:(t,e,r)=>{var n=r(7293),o=r(5112),a=r(1913),i=o("iterator");t.exports=!n((function(){var t=new URL("b?a=1&b=2&c=3","http://a"),e=t.searchParams,r="";return t.pathname="c%20d",e.forEach((function(t,n){e.delete("b"),r+=n+t})),a&&!t.toJSON||!e.sort||"http://a/c%20d?a=1&c=3"!==t.href||"3"!==e.get("c")||"a=1"!==String(new URLSearchParams("?a=1"))||!e[i]||"a"!==new URL("https://a@b").username||"b"!==new URLSearchParams(new URLSearchParams("a=b")).get("a")||"xn--e1aybc"!==new URL("http://тест").host||"#%D0%B1"!==new URL("http://a#б").hash||"a1c3"!==r||"x"!==new URL("http://x",void 0).host}))},8536:(t,e,r)=>{var n=r(7854),o=r(2788),a=n.WeakMap;t.exports="function"==typeof a&&/native code/.test(o(a))},1574:(t,e,r)=>{"use strict";var n=r(9781),o=r(7293),a=r(1956),i=r(5181),u=r(5296),s=r(7908),c=r(8361),f=Object.assign,l=Object.defineProperty;t.exports=!f||o((function(){if(n&&1!==f({b:1},f(l({},"a",{enumerable:!0,get:function(){l(this,"b",{value:3,enumerable:!1})}}),{b:2})).b)return!0;var t={},e={},r=Symbol(),o="abcdefghijklmnopqrst";return t[r]=7,o.split("").forEach((function(t){e[t]=t})),7!=f({},t)[r]||a(f({},e)).join("")!=o}))?function(t,e){for(var r=s(t),o=arguments.length,f=1,l=i.f,p=u.f;o>f;)for(var h,v=c(arguments[f++]),g=l?a(v).concat(l(v)):a(v),y=g.length,d=0;y>d;)h=g[d++],n&&!p.call(v,h)||(r[h]=v[h]);return r}:f},30:(t,e,r)=>{var n,o=r(9670),a=r(6048),i=r(748),u=r(3501),s=r(490),c=r(317),f=r(6200),l=f("IE_PROTO"),p=function(){},h=function(t){return"<script>"+t+"</"+"script>"},v=function(){try{n=document.domain&&new ActiveXObject("htmlfile")}catch(t){}var t,e;v=n?function(t){t.write(h("")),t.close();var e=t.parentWindow.Object;return t=null,e}(n):((e=c("iframe")).style.display="none",s.appendChild(e),e.src=String("javascript:"),(t=e.contentWindow.document).open(),t.write(h("document.F=Object")),t.close(),t.F);for(var r=i.length;r--;)delete v.prototype[i[r]];return v()};u[l]=!0,t.exports=Object.create||function(t,e){var r;return null!==t?(p.prototype=o(t),r=new p,p.prototype=null,r[l]=t):r=v(),void 0===e?r:a(r,e)}},6048:(t,e,r)=>{var n=r(9781),o=r(3070),a=r(9670),i=r(1956);t.exports=n?Object.defineProperties:function(t,e){a(t);for(var r,n=i(e),u=n.length,s=0;u>s;)o.f(t,r=n[s++],e[r]);return t}},3070:(t,e,r)=>{var n=r(9781),o=r(4664),a=r(9670),i=r(7593),u=Object.defineProperty;e.f=n?u:function(t,e,r){if(a(t),e=i(e,!0),a(r),o)try{return u(t,e,r)}catch(t){}if("get"in r||"set"in r)throw TypeError("Accessors not supported");return"value"in r&&(t[e]=r.value),t}},1236:(t,e,r)=>{var n=r(9781),o=r(5296),a=r(9114),i=r(5656),u=r(7593),s=r(6656),c=r(4664),f=Object.getOwnPropertyDescriptor;e.f=n?f:function(t,e){if(t=i(t),e=u(e,!0),c)try{return f(t,e)}catch(t){}if(s(t,e))return a(!o.f.call(t,e),t[e])}},8006:(t,e,r)=>{var n=r(6324),o=r(748).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return n(t,o)}},5181:(t,e)=>{e.f=Object.getOwnPropertySymbols},9518:(t,e,r)=>{var n=r(6656),o=r(7908),a=r(6200),i=r(8544),u=a("IE_PROTO"),s=Object.prototype;t.exports=i?Object.getPrototypeOf:function(t){return t=o(t),n(t,u)?t[u]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?s:null}},6324:(t,e,r)=>{var n=r(6656),o=r(5656),a=r(1318).indexOf,i=r(3501);t.exports=function(t,e){var r,u=o(t),s=0,c=[];for(r in u)!n(i,r)&&n(u,r)&&c.push(r);for(;e.length>s;)n(u,r=e[s++])&&(~a(c,r)||c.push(r));return c}},1956:(t,e,r)=>{var n=r(6324),o=r(748);t.exports=Object.keys||function(t){return n(t,o)}},5296:(t,e)=>{"use strict";var r={}.propertyIsEnumerable,n=Object.getOwnPropertyDescriptor,o=n&&!r.call({1:2},1);e.f=o?function(t){var e=n(this,t);return!!e&&e.enumerable}:r},7674:(t,e,r)=>{var n=r(9670),o=r(6077);t.exports=Object.setPrototypeOf||("__proto__"in{}?function(){var t,e=!1,r={};try{(t=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set).call(r,[]),e=r instanceof Array}catch(t){}return function(r,a){return n(r),o(a),e?t.call(r,a):r.__proto__=a,r}}():void 0)},288:(t,e,r)=>{"use strict";var n=r(1694),o=r(648);t.exports=n?{}.toString:function(){return"[object "+o(this)+"]"}},3887:(t,e,r)=>{var n=r(5005),o=r(8006),a=r(5181),i=r(9670);t.exports=n("Reflect","ownKeys")||function(t){var e=o.f(i(t)),r=a.f;return r?e.concat(r(t)):e}},857:(t,e,r)=>{var n=r(7854);t.exports=n},2248:(t,e,r)=>{var n=r(1320);t.exports=function(t,e,r){for(var o in e)n(t,o,e[o],r);return t}},1320:(t,e,r)=>{var n=r(7854),o=r(8880),a=r(6656),i=r(3505),u=r(2788),s=r(9909),c=s.get,f=s.enforce,l=String(String).split("String");(t.exports=function(t,e,r,u){var s,c=!!u&&!!u.unsafe,p=!!u&&!!u.enumerable,h=!!u&&!!u.noTargetGet;"function"==typeof r&&("string"!=typeof e||a(r,"name")||o(r,"name",e),(s=f(r)).source||(s.source=l.join("string"==typeof e?e:""))),t!==n?(c?!h&&t[e]&&(p=!0):delete t[e],p?t[e]=r:o(t,e,r)):p?t[e]=r:i(e,r)})(Function.prototype,"toString",(function(){return"function"==typeof this&&c(this).source||u(this)}))},4488:t=>{t.exports=function(t){if(null==t)throw TypeError("Can't call method on "+t);return t}},3505:(t,e,r)=>{var n=r(7854),o=r(8880);t.exports=function(t,e){try{o(n,t,e)}catch(r){n[t]=e}return e}},8003:(t,e,r)=>{var n=r(3070).f,o=r(6656),a=r(5112)("toStringTag");t.exports=function(t,e,r){t&&!o(t=r?t:t.prototype,a)&&n(t,a,{configurable:!0,value:e})}},6200:(t,e,r)=>{var n=r(2309),o=r(9711),a=n("keys");t.exports=function(t){return a[t]||(a[t]=o(t))}},5465:(t,e,r)=>{var n=r(7854),o=r(3505),a="__core-js_shared__",i=n[a]||o(a,{});t.exports=i},2309:(t,e,r)=>{var n=r(1913),o=r(5465);(t.exports=function(t,e){return o[t]||(o[t]=void 0!==e?e:{})})("versions",[]).push({version:"3.11.0",mode:n?"pure":"global",copyright:"© 2021 Denis Pushkarev (zloirock.ru)"})},8710:(t,e,r)=>{var n=r(9958),o=r(4488),a=function(t){return function(e,r){var a,i,u=String(o(e)),s=n(r),c=u.length;return s<0||s>=c?t?"":void 0:(a=u.charCodeAt(s))<55296||a>56319||s+1===c||(i=u.charCodeAt(s+1))<56320||i>57343?t?u.charAt(s):a:t?u.slice(s,s+2):i-56320+(a-55296<<10)+65536}};t.exports={codeAt:a(!1),charAt:a(!0)}},3197:t=>{"use strict";var e=2147483647,r=/[^\0-\u007E]/,n=/[.\u3002\uFF0E\uFF61]/g,o="Overflow: input needs wider integers to process",a=Math.floor,i=String.fromCharCode,u=function(t){return t+22+75*(t<26)},s=function(t,e,r){var n=0;for(t=r?a(t/700):t>>1,t+=a(t/e);t>455;n+=36)t=a(t/35);return a(n+36*t/(t+38))},c=function(t){var r,n,c=[],f=(t=function(t){for(var e=[],r=0,n=t.length;r<n;){var o=t.charCodeAt(r++);if(o>=55296&&o<=56319&&r<n){var a=t.charCodeAt(r++);56320==(64512&a)?e.push(((1023&o)<<10)+(1023&a)+65536):(e.push(o),r--)}else e.push(o)}return e}(t)).length,l=128,p=0,h=72;for(r=0;r<t.length;r++)(n=t[r])<128&&c.push(i(n));var v=c.length,g=v;for(v&&c.push("-");g<f;){var y=e;for(r=0;r<t.length;r++)(n=t[r])>=l&&n<y&&(y=n);var d=g+1;if(y-l>a((e-p)/d))throw RangeError(o);for(p+=(y-l)*d,l=y,r=0;r<t.length;r++){if((n=t[r])<l&&++p>e)throw RangeError(o);if(n==l){for(var m=p,b=36;;b+=36){var w=b<=h?1:b>=h+26?26:b-h;if(m<w)break;var x=m-w,S=36-w;c.push(i(u(w+x%S))),m=a(x/S)}c.push(i(u(m))),h=s(p,d,g==v),p=0,++g}}++p,++l}return c.join("")};t.exports=function(t){var e,o,a=[],i=t.toLowerCase().replace(n,".").split(".");for(e=0;e<i.length;e++)o=i[e],a.push(r.test(o)?"xn--"+c(o):o);return a.join(".")}},1400:(t,e,r)=>{var n=r(9958),o=Math.max,a=Math.min;t.exports=function(t,e){var r=n(t);return r<0?o(r+e,0):a(r,e)}},5656:(t,e,r)=>{var n=r(8361),o=r(4488);t.exports=function(t){return n(o(t))}},9958:t=>{var e=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:e)(t)}},7466:(t,e,r)=>{var n=r(9958),o=Math.min;t.exports=function(t){return t>0?o(n(t),9007199254740991):0}},7908:(t,e,r)=>{var n=r(4488);t.exports=function(t){return Object(n(t))}},7593:(t,e,r)=>{var n=r(111);t.exports=function(t,e){if(!n(t))return t;var r,o;if(e&&"function"==typeof(r=t.toString)&&!n(o=r.call(t)))return o;if("function"==typeof(r=t.valueOf)&&!n(o=r.call(t)))return o;if(!e&&"function"==typeof(r=t.toString)&&!n(o=r.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},1694:(t,e,r)=>{var n={};n[r(5112)("toStringTag")]="z",t.exports="[object z]"===String(n)},9711:t=>{var e=0,r=Math.random();t.exports=function(t){return"Symbol("+String(void 0===t?"":t)+")_"+(++e+r).toString(36)}},3307:(t,e,r)=>{var n=r(133);t.exports=n&&!Symbol.sham&&"symbol"==typeof Symbol.iterator},5112:(t,e,r)=>{var n=r(7854),o=r(2309),a=r(6656),i=r(9711),u=r(133),s=r(3307),c=o("wks"),f=n.Symbol,l=s?f:f&&f.withoutSetter||i;t.exports=function(t){return a(c,t)&&(u||"string"==typeof c[t])||(u&&a(f,t)?c[t]=f[t]:c[t]=l("Symbol."+t)),c[t]}},6992:(t,e,r)=>{"use strict";var n=r(5656),o=r(1223),a=r(7497),i=r(9909),u=r(654),s="Array Iterator",c=i.set,f=i.getterFor(s);t.exports=u(Array,"Array",(function(t,e){c(this,{type:s,target:n(t),index:0,kind:e})}),(function(){var t=f(this),e=t.target,r=t.kind,n=t.index++;return!e||n>=e.length?(t.target=void 0,{value:void 0,done:!0}):"keys"==r?{value:n,done:!1}:"values"==r?{value:e[n],done:!1}:{value:[n,e[n]],done:!1}}),"values"),a.Arguments=a.Array,o("keys"),o("values"),o("entries")},1539:(t,e,r)=>{var n=r(1694),o=r(1320),a=r(288);n||o(Object.prototype,"toString",a,{unsafe:!0})},8783:(t,e,r)=>{"use strict";var n=r(8710).charAt,o=r(9909),a=r(654),i="String Iterator",u=o.set,s=o.getterFor(i);a(String,"String",(function(t){u(this,{type:i,string:String(t),index:0})}),(function(){var t,e=s(this),r=e.string,o=e.index;return o>=r.length?{value:void 0,done:!0}:(t=n(r,o),e.index+=t.length,{value:t,done:!1})}))},3948:(t,e,r)=>{var n=r(7854),o=r(8324),a=r(6992),i=r(8880),u=r(5112),s=u("iterator"),c=u("toStringTag"),f=a.values;for(var l in o){var p=n[l],h=p&&p.prototype;if(h){if(h[s]!==f)try{i(h,s,f)}catch(t){h[s]=f}if(h[c]||i(h,c,l),o[l])for(var v in a)if(h[v]!==a[v])try{i(h,v,a[v])}catch(t){h[v]=a[v]}}}},1637:(t,e,r)=>{"use strict";r(6992);var n=r(2109),o=r(5005),a=r(590),i=r(1320),u=r(2248),s=r(8003),c=r(4994),f=r(9909),l=r(5787),p=r(6656),h=r(9974),v=r(648),g=r(9670),y=r(111),d=r(30),m=r(9114),b=r(8554),w=r(1246),x=r(5112),S=o("fetch"),L=o("Headers"),A=x("iterator"),O="URLSearchParams",k="URLSearchParamsIterator",R=f.set,j=f.getterFor(O),U=f.getterFor(k),P=/\+/g,T=Array(4),E=function(t){return T[t-1]||(T[t-1]=RegExp("((?:%[\\da-f]{2}){"+t+"})","gi"))},I=function(t){try{return decodeURIComponent(t)}catch(e){return t}},C=function(t){var e=t.replace(P," "),r=4;try{return decodeURIComponent(e)}catch(t){for(;r;)e=e.replace(E(r--),I);return e}},q=/[!'()~]|%20/g,B={"!":"%21","'":"%27","(":"%28",")":"%29","~":"%7E","%20":"+"},F=function(t){return B[t]},_=function(t){return encodeURIComponent(t).replace(q,F)},M=function(t,e){if(e)for(var r,n,o=e.split("&"),a=0;a<o.length;)(r=o[a++]).length&&(n=r.split("="),t.push({key:C(n.shift()),value:C(n.join("="))}))},N=function(t){this.entries.length=0,M(this.entries,t)},G=function(t,e){if(t<e)throw TypeError("Not enough arguments")},D=c((function(t,e){R(this,{type:k,iterator:b(j(t).entries),kind:e})}),"Iterator",(function(){var t=U(this),e=t.kind,r=t.iterator.next(),n=r.value;return r.done||(r.value="keys"===e?n.key:"values"===e?n.value:[n.key,n.value]),r})),z=function(){l(this,z,O);var t,e,r,n,o,a,i,u,s,c=arguments.length>0?arguments[0]:void 0,f=this,h=[];if(R(f,{type:O,entries:h,updateURL:function(){},updateSearchParams:N}),void 0!==c)if(y(c))if("function"==typeof(t=w(c)))for(r=(e=t.call(c)).next;!(n=r.call(e)).done;){if((i=(a=(o=b(g(n.value))).next).call(o)).done||(u=a.call(o)).done||!a.call(o).done)throw TypeError("Expected sequence with length 2");h.push({key:i.value+"",value:u.value+""})}else for(s in c)p(c,s)&&h.push({key:s,value:c[s]+""});else M(h,"string"==typeof c?"?"===c.charAt(0)?c.slice(1):c:c+"")},V=z.prototype;u(V,{append:function(t,e){G(arguments.length,2);var r=j(this);r.entries.push({key:t+"",value:e+""}),r.updateURL()},delete:function(t){G(arguments.length,1);for(var e=j(this),r=e.entries,n=t+"",o=0;o<r.length;)r[o].key===n?r.splice(o,1):o++;e.updateURL()},get:function(t){G(arguments.length,1);for(var e=j(this).entries,r=t+"",n=0;n<e.length;n++)if(e[n].key===r)return e[n].value;return null},getAll:function(t){G(arguments.length,1);for(var e=j(this).entries,r=t+"",n=[],o=0;o<e.length;o++)e[o].key===r&&n.push(e[o].value);return n},has:function(t){G(arguments.length,1);for(var e=j(this).entries,r=t+"",n=0;n<e.length;)if(e[n++].key===r)return!0;return!1},set:function(t,e){G(arguments.length,1);for(var r,n=j(this),o=n.entries,a=!1,i=t+"",u=e+"",s=0;s<o.length;s++)(r=o[s]).key===i&&(a?o.splice(s--,1):(a=!0,r.value=u));a||o.push({key:i,value:u}),n.updateURL()},sort:function(){var t,e,r,n=j(this),o=n.entries,a=o.slice();for(o.length=0,r=0;r<a.length;r++){for(t=a[r],e=0;e<r;e++)if(o[e].key>t.key){o.splice(e,0,t);break}e===r&&o.push(t)}n.updateURL()},forEach:function(t){for(var e,r=j(this).entries,n=h(t,arguments.length>1?arguments[1]:void 0,3),o=0;o<r.length;)n((e=r[o++]).value,e.key,this)},keys:function(){return new D(this,"keys")},values:function(){return new D(this,"values")},entries:function(){return new D(this,"entries")}},{enumerable:!0}),i(V,A,V.entries),i(V,"toString",(function(){for(var t,e=j(this).entries,r=[],n=0;n<e.length;)t=e[n++],r.push(_(t.key)+"="+_(t.value));return r.join("&")}),{enumerable:!0}),s(z,O),n({global:!0,forced:!a},{URLSearchParams:z}),a||"function"!=typeof S||"function"!=typeof L||n({global:!0,enumerable:!0,forced:!0},{fetch:function(t){var e,r,n,o=[t];return arguments.length>1&&(y(e=arguments[1])&&(r=e.body,v(r)===O&&((n=e.headers?new L(e.headers):new L).has("content-type")||n.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"),e=d(e,{body:m(0,String(r)),headers:m(0,n)}))),o.push(e)),S.apply(this,o)}}),t.exports={URLSearchParams:z,getState:j}},285:(t,e,r)=>{"use strict";r(8783);var n,o=r(2109),a=r(9781),i=r(590),u=r(7854),s=r(6048),c=r(1320),f=r(5787),l=r(6656),p=r(1574),h=r(8457),v=r(8710).codeAt,g=r(3197),y=r(8003),d=r(1637),m=r(9909),b=u.URL,w=d.URLSearchParams,x=d.getState,S=m.set,L=m.getterFor("URL"),A=Math.floor,O=Math.pow,k="Invalid scheme",R="Invalid host",j="Invalid port",U=/[A-Za-z]/,P=/[\d+-.A-Za-z]/,T=/\d/,E=/^(0x|0X)/,I=/^[0-7]+$/,C=/^\d+$/,q=/^[\dA-Fa-f]+$/,B=/[\0\t\n\r #%/:?@[\\]]/,F=/[\0\t\n\r #/:?@[\\]]/,_=/^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g,M=/[\t\n\r]/g,N=function(t,e){var r,n,o;if("["==e.charAt(0)){if("]"!=e.charAt(e.length-1))return R;if(!(r=D(e.slice(1,-1))))return R;t.host=r}else if(X(t)){if(e=g(e),B.test(e))return R;if(null===(r=G(e)))return R;t.host=r}else{if(F.test(e))return R;for(r="",n=h(e),o=0;o<n.length;o++)r+=Y(n[o],V);t.host=r}},G=function(t){var e,r,n,o,a,i,u,s=t.split(".");if(s.length&&""==s[s.length-1]&&s.pop(),(e=s.length)>4)return t;for(r=[],n=0;n<e;n++){if(""==(o=s[n]))return t;if(a=10,o.length>1&&"0"==o.charAt(0)&&(a=E.test(o)?16:8,o=o.slice(8==a?1:2)),""===o)i=0;else{if(!(10==a?C:8==a?I:q).test(o))return t;i=parseInt(o,a)}r.push(i)}for(n=0;n<e;n++)if(i=r[n],n==e-1){if(i>=O(256,5-e))return null}else if(i>255)return null;for(u=r.pop(),n=0;n<r.length;n++)u+=r[n]*O(256,3-n);return u},D=function(t){var e,r,n,o,a,i,u,s=[0,0,0,0,0,0,0,0],c=0,f=null,l=0,p=function(){return t.charAt(l)};if(":"==p()){if(":"!=t.charAt(1))return;l+=2,f=++c}for(;p();){if(8==c)return;if(":"!=p()){for(e=r=0;r<4&&q.test(p());)e=16*e+parseInt(p(),16),l++,r++;if("."==p()){if(0==r)return;if(l-=r,c>6)return;for(n=0;p();){if(o=null,n>0){if(!("."==p()&&n<4))return;l++}if(!T.test(p()))return;for(;T.test(p());){if(a=parseInt(p(),10),null===o)o=a;else{if(0==o)return;o=10*o+a}if(o>255)return;l++}s[c]=256*s[c]+o,2!=++n&&4!=n||c++}if(4!=n)return;break}if(":"==p()){if(l++,!p())return}else if(p())return;s[c++]=e}else{if(null!==f)return;l++,f=++c}}if(null!==f)for(i=c-f,c=7;0!=c&&i>0;)u=s[c],s[c--]=s[f+i-1],s[f+--i]=u;else if(8!=c)return;return s},z=function(t){var e,r,n,o;if("number"==typeof t){for(e=[],r=0;r<4;r++)e.unshift(t%256),t=A(t/256);return e.join(".")}if("object"==typeof t){for(e="",n=function(t){for(var e=null,r=1,n=null,o=0,a=0;a<8;a++)0!==t[a]?(o>r&&(e=n,r=o),n=null,o=0):(null===n&&(n=a),++o);return o>r&&(e=n,r=o),e}(t),r=0;r<8;r++)o&&0===t[r]||(o&&(o=!1),n===r?(e+=r?":":"::",o=!0):(e+=t[r].toString(16),r<7&&(e+=":")));return"["+e+"]"}return t},V={},H=p({},V,{" ":1,'"':1,"<":1,">":1,"`":1}),W=p({},H,{"#":1,"?":1,"{":1,"}":1}),$=p({},W,{"/":1,":":1,";":1,"=":1,"@":1,"[":1,"\\":1,"]":1,"^":1,"|":1}),Y=function(t,e){var r=v(t,0);return r>32&&r<127&&!l(e,t)?t:encodeURIComponent(t)},J={ftp:21,file:null,http:80,https:443,ws:80,wss:443},X=function(t){return l(J,t.scheme)},Z=function(t){return""!=t.username||""!=t.password},K=function(t){return!t.host||t.cannotBeABaseURL||"file"==t.scheme},Q=function(t,e){var r;return 2==t.length&&U.test(t.charAt(0))&&(":"==(r=t.charAt(1))||!e&&"|"==r)},tt=function(t){var e;return t.length>1&&Q(t.slice(0,2))&&(2==t.length||"/"===(e=t.charAt(2))||"\\"===e||"?"===e||"#"===e)},et=function(t){var e=t.path,r=e.length;!r||"file"==t.scheme&&1==r&&Q(e[0],!0)||e.pop()},rt=function(t){return"."===t||"%2e"===t.toLowerCase()},nt={},ot={},at={},it={},ut={},st={},ct={},ft={},lt={},pt={},ht={},vt={},gt={},yt={},dt={},mt={},bt={},wt={},xt={},St={},Lt={},At=function(t,e,r,o){var a,i,u,s,c,f=r||nt,p=0,v="",g=!1,y=!1,d=!1;for(r||(t.scheme="",t.username="",t.password="",t.host=null,t.port=null,t.path=[],t.query=null,t.fragment=null,t.cannotBeABaseURL=!1,e=e.replace(_,"")),e=e.replace(M,""),a=h(e);p<=a.length;){switch(i=a[p],f){case nt:if(!i||!U.test(i)){if(r)return k;f=at;continue}v+=i.toLowerCase(),f=ot;break;case ot:if(i&&(P.test(i)||"+"==i||"-"==i||"."==i))v+=i.toLowerCase();else{if(":"!=i){if(r)return k;v="",f=at,p=0;continue}if(r&&(X(t)!=l(J,v)||"file"==v&&(Z(t)||null!==t.port)||"file"==t.scheme&&!t.host))return;if(t.scheme=v,r)return void(X(t)&&J[t.scheme]==t.port&&(t.port=null));v="","file"==t.scheme?f=yt:X(t)&&o&&o.scheme==t.scheme?f=it:X(t)?f=ft:"/"==a[p+1]?(f=ut,p++):(t.cannotBeABaseURL=!0,t.path.push(""),f=xt)}break;case at:if(!o||o.cannotBeABaseURL&&"#"!=i)return k;if(o.cannotBeABaseURL&&"#"==i){t.scheme=o.scheme,t.path=o.path.slice(),t.query=o.query,t.fragment="",t.cannotBeABaseURL=!0,f=Lt;break}f="file"==o.scheme?yt:st;continue;case it:if("/"!=i||"/"!=a[p+1]){f=st;continue}f=lt,p++;break;case ut:if("/"==i){f=pt;break}f=wt;continue;case st:if(t.scheme=o.scheme,i==n)t.username=o.username,t.password=o.password,t.host=o.host,t.port=o.port,t.path=o.path.slice(),t.query=o.query;else if("/"==i||"\\"==i&&X(t))f=ct;else if("?"==i)t.username=o.username,t.password=o.password,t.host=o.host,t.port=o.port,t.path=o.path.slice(),t.query="",f=St;else{if("#"!=i){t.username=o.username,t.password=o.password,t.host=o.host,t.port=o.port,t.path=o.path.slice(),t.path.pop(),f=wt;continue}t.username=o.username,t.password=o.password,t.host=o.host,t.port=o.port,t.path=o.path.slice(),t.query=o.query,t.fragment="",f=Lt}break;case ct:if(!X(t)||"/"!=i&&"\\"!=i){if("/"!=i){t.username=o.username,t.password=o.password,t.host=o.host,t.port=o.port,f=wt;continue}f=pt}else f=lt;break;case ft:if(f=lt,"/"!=i||"/"!=v.charAt(p+1))continue;p++;break;case lt:if("/"!=i&&"\\"!=i){f=pt;continue}break;case pt:if("@"==i){g&&(v="%40"+v),g=!0,u=h(v);for(var m=0;m<u.length;m++){var b=u[m];if(":"!=b||d){var w=Y(b,$);d?t.password+=w:t.username+=w}else d=!0}v=""}else if(i==n||"/"==i||"?"==i||"#"==i||"\\"==i&&X(t)){if(g&&""==v)return"Invalid authority";p-=h(v).length+1,v="",f=ht}else v+=i;break;case ht:case vt:if(r&&"file"==t.scheme){f=mt;continue}if(":"!=i||y){if(i==n||"/"==i||"?"==i||"#"==i||"\\"==i&&X(t)){if(X(t)&&""==v)return R;if(r&&""==v&&(Z(t)||null!==t.port))return;if(s=N(t,v))return s;if(v="",f=bt,r)return;continue}"["==i?y=!0:"]"==i&&(y=!1),v+=i}else{if(""==v)return R;if(s=N(t,v))return s;if(v="",f=gt,r==vt)return}break;case gt:if(!T.test(i)){if(i==n||"/"==i||"?"==i||"#"==i||"\\"==i&&X(t)||r){if(""!=v){var x=parseInt(v,10);if(x>65535)return j;t.port=X(t)&&x===J[t.scheme]?null:x,v=""}if(r)return;f=bt;continue}return j}v+=i;break;case yt:if(t.scheme="file","/"==i||"\\"==i)f=dt;else{if(!o||"file"!=o.scheme){f=wt;continue}if(i==n)t.host=o.host,t.path=o.path.slice(),t.query=o.query;else if("?"==i)t.host=o.host,t.path=o.path.slice(),t.query="",f=St;else{if("#"!=i){tt(a.slice(p).join(""))||(t.host=o.host,t.path=o.path.slice(),et(t)),f=wt;continue}t.host=o.host,t.path=o.path.slice(),t.query=o.query,t.fragment="",f=Lt}}break;case dt:if("/"==i||"\\"==i){f=mt;break}o&&"file"==o.scheme&&!tt(a.slice(p).join(""))&&(Q(o.path[0],!0)?t.path.push(o.path[0]):t.host=o.host),f=wt;continue;case mt:if(i==n||"/"==i||"\\"==i||"?"==i||"#"==i){if(!r&&Q(v))f=wt;else if(""==v){if(t.host="",r)return;f=bt}else{if(s=N(t,v))return s;if("localhost"==t.host&&(t.host=""),r)return;v="",f=bt}continue}v+=i;break;case bt:if(X(t)){if(f=wt,"/"!=i&&"\\"!=i)continue}else if(r||"?"!=i)if(r||"#"!=i){if(i!=n&&(f=wt,"/"!=i))continue}else t.fragment="",f=Lt;else t.query="",f=St;break;case wt:if(i==n||"/"==i||"\\"==i&&X(t)||!r&&("?"==i||"#"==i)){if(".."===(c=(c=v).toLowerCase())||"%2e."===c||".%2e"===c||"%2e%2e"===c?(et(t),"/"==i||"\\"==i&&X(t)||t.path.push("")):rt(v)?"/"==i||"\\"==i&&X(t)||t.path.push(""):("file"==t.scheme&&!t.path.length&&Q(v)&&(t.host&&(t.host=""),v=v.charAt(0)+":"),t.path.push(v)),v="","file"==t.scheme&&(i==n||"?"==i||"#"==i))for(;t.path.length>1&&""===t.path[0];)t.path.shift();"?"==i?(t.query="",f=St):"#"==i&&(t.fragment="",f=Lt)}else v+=Y(i,W);break;case xt:"?"==i?(t.query="",f=St):"#"==i?(t.fragment="",f=Lt):i!=n&&(t.path[0]+=Y(i,V));break;case St:r||"#"!=i?i!=n&&("'"==i&&X(t)?t.query+="%27":t.query+="#"==i?"%23":Y(i,V)):(t.fragment="",f=Lt);break;case Lt:i!=n&&(t.fragment+=Y(i,H))}p++}},Ot=function(t){var e,r,n=f(this,Ot,"URL"),o=arguments.length>1?arguments[1]:void 0,i=String(t),u=S(n,{type:"URL"});if(void 0!==o)if(o instanceof Ot)e=L(o);else if(r=At(e={},String(o)))throw TypeError(r);if(r=At(u,i,null,e))throw TypeError(r);var s=u.searchParams=new w,c=x(s);c.updateSearchParams(u.query),c.updateURL=function(){u.query=String(s)||null},a||(n.href=Rt.call(n),n.origin=jt.call(n),n.protocol=Ut.call(n),n.username=Pt.call(n),n.password=Tt.call(n),n.host=Et.call(n),n.hostname=It.call(n),n.port=Ct.call(n),n.pathname=qt.call(n),n.search=Bt.call(n),n.searchParams=Ft.call(n),n.hash=_t.call(n))},kt=Ot.prototype,Rt=function(){var t=L(this),e=t.scheme,r=t.username,n=t.password,o=t.host,a=t.port,i=t.path,u=t.query,s=t.fragment,c=e+":";return null!==o?(c+="//",Z(t)&&(c+=r+(n?":"+n:"")+"@"),c+=z(o),null!==a&&(c+=":"+a)):"file"==e&&(c+="//"),c+=t.cannotBeABaseURL?i[0]:i.length?"/"+i.join("/"):"",null!==u&&(c+="?"+u),null!==s&&(c+="#"+s),c},jt=function(){var t=L(this),e=t.scheme,r=t.port;if("blob"==e)try{return new Ot(e.path[0]).origin}catch(t){return"null"}return"file"!=e&&X(t)?e+"://"+z(t.host)+(null!==r?":"+r:""):"null"},Ut=function(){return L(this).scheme+":"},Pt=function(){return L(this).username},Tt=function(){return L(this).password},Et=function(){var t=L(this),e=t.host,r=t.port;return null===e?"":null===r?z(e):z(e)+":"+r},It=function(){var t=L(this).host;return null===t?"":z(t)},Ct=function(){var t=L(this).port;return null===t?"":String(t)},qt=function(){var t=L(this),e=t.path;return t.cannotBeABaseURL?e[0]:e.length?"/"+e.join("/"):""},Bt=function(){var t=L(this).query;return t?"?"+t:""},Ft=function(){return L(this).searchParams},_t=function(){var t=L(this).fragment;return t?"#"+t:""},Mt=function(t,e){return{get:t,set:e,configurable:!0,enumerable:!0}};if(a&&s(kt,{href:Mt(Rt,(function(t){var e=L(this),r=String(t),n=At(e,r);if(n)throw TypeError(n);x(e.searchParams).updateSearchParams(e.query)})),origin:Mt(jt),protocol:Mt(Ut,(function(t){var e=L(this);At(e,String(t)+":",nt)})),username:Mt(Pt,(function(t){var e=L(this),r=h(String(t));if(!K(e)){e.username="";for(var n=0;n<r.length;n++)e.username+=Y(r[n],$)}})),password:Mt(Tt,(function(t){var e=L(this),r=h(String(t));if(!K(e)){e.password="";for(var n=0;n<r.length;n++)e.password+=Y(r[n],$)}})),host:Mt(Et,(function(t){var e=L(this);e.cannotBeABaseURL||At(e,String(t),ht)})),hostname:Mt(It,(function(t){var e=L(this);e.cannotBeABaseURL||At(e,String(t),vt)})),port:Mt(Ct,(function(t){var e=L(this);K(e)||(""==(t=String(t))?e.port=null:At(e,t,gt))})),pathname:Mt(qt,(function(t){var e=L(this);e.cannotBeABaseURL||(e.path=[],At(e,t+"",bt))})),search:Mt(Bt,(function(t){var e=L(this);""==(t=String(t))?e.query=null:("?"==t.charAt(0)&&(t=t.slice(1)),e.query="",At(e,t,St)),x(e.searchParams).updateSearchParams(e.query)})),searchParams:Mt(Ft),hash:Mt(_t,(function(t){var e=L(this);""!=(t=String(t))?("#"==t.charAt(0)&&(t=t.slice(1)),e.fragment="",At(e,t,Lt)):e.fragment=null}))}),c(kt,"toJSON",(function(){return Rt.call(this)}),{enumerable:!0}),c(kt,"toString",(function(){return Rt.call(this)}),{enumerable:!0}),b){var Nt=b.createObjectURL,Gt=b.revokeObjectURL;Nt&&c(Ot,"createObjectURL",(function(t){return Nt.apply(b,arguments)})),Gt&&c(Ot,"revokeObjectURL",(function(t){return Gt.apply(b,arguments)}))}y(Ot,"URL"),o({global:!0,forced:!i,sham:!a},{URL:Ot})}},e={};function r(n){var o=e[n];if(void 0!==o)return o.exports;var a=e[n]={exports:{}};return t[n](a,a.exports,r),a.exports}r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),(()=>{r(6992),r(1539),r(8783),r(3948),r(285);try{if(window.Capacitor){var t=function(t){console.log("Current URL: "+window.location.href);var e=new URL(t);e.hash===window.location.hash&&e.pathname===window.location.pathname?console.log("Same URLs. Skipping"):e.pathname===window.location.pathname?(console.log("Same pathname. Setting and reloading. "),window.location.hash=e.hash,window.location.reload()):(console.log("Different pathname. Setting"),window.location.hash=e.hash,window.location.pathname=e.pathname)};Capacitor.Plugins.App.addListener("appUrlOpen",(function(e){console.log("App opened with URL: "+e.url),t(e.url)})),Capacitor.Plugins.App.getLaunchUrl().then((function(e){e&&e.url&&""===document.referrer&&(console.log("Launch url: ",e.url),t(e.url))}))}}catch(t){console.error(t)}})()})();
//# sourceMappingURL=universalLinks.js.map