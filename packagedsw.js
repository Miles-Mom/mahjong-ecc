(()=>{var t={8222:(t,e,r)=>{r(3123),r(4916);var n=["packages/index.js","packages/index.css","assets/edit.svg","assets/exit-full-screen.svg","assets/go-full-screen.svg","assets/reload-icon.svg","assets/tiles/joker.png","assets/tiles/face-down.png","assets/tiles/tile-outline.png"];"north east south west".split(" ").forEach((function(t){n.push("assets/compass-".concat(t,".svg")),n.push("assets/tiles/winds/".concat(t,".png"))})),[1,2,3,4].forEach((function(t){n.push("assets/tiles/flowers/".concat(t,".png")),n.push("assets/tiles/seasons/".concat(t,".png"))})),"red green white".split(" ").forEach((function(t){n.push("assets/tiles/dragons/".concat(t,".png"))})),[1,2,3,4,5,6,7,8,9].forEach((function(t){n.push("assets/tiles/circles/".concat(t,".png")),n.push("assets/tiles/bamboos/".concat(t,".png")),n.push("assets/tiles/characters/".concat(t,".png"))})),t.exports=n},3099:t=>{t.exports=function(t){if("function"!=typeof t)throw TypeError(String(t)+" is not a function");return t}},1530:(t,e,r)=>{"use strict";var n=r(8710).charAt;t.exports=function(t,e,r){return e+(r?n(t,e).length:1)}},5787:t=>{t.exports=function(t,e,r){if(!(t instanceof e))throw TypeError("Incorrect "+(r?r+" ":"")+"invocation");return t}},9670:(t,e,r)=>{var n=r(111);t.exports=function(t){if(!n(t))throw TypeError(String(t)+" is not an object");return t}},8533:(t,e,r)=>{"use strict";var n=r(2092).forEach,o=r(9341)("forEach");t.exports=o?[].forEach:function(t){return n(this,t,arguments.length>1?arguments[1]:void 0)}},1318:(t,e,r)=>{var n=r(5656),o=r(7466),i=r(1400),a=function(t){return function(e,r,a){var c,u=n(e),s=o(u.length),f=i(a,s);if(t&&r!=r){for(;s>f;)if((c=u[f++])!=c)return!0}else for(;s>f;f++)if((t||f in u)&&u[f]===r)return t||f||0;return!t&&-1}};t.exports={includes:a(!0),indexOf:a(!1)}},2092:(t,e,r)=>{var n=r(9974),o=r(8361),i=r(7908),a=r(7466),c=r(5417),u=[].push,s=function(t){var e=1==t,r=2==t,s=3==t,f=4==t,l=6==t,p=7==t,h=5==t||l;return function(v,d,g,y){for(var x,m,w=i(v),b=o(w),E=n(d,g,3),S=a(b.length),L=0,j=y||c,T=e?j(v,S):r||p?j(v,0):void 0;S>L;L++)if((h||L in b)&&(m=E(x=b[L],L,w),t))if(e)T[L]=m;else if(m)switch(t){case 3:return!0;case 5:return x;case 6:return L;case 2:u.call(T,x)}else switch(t){case 4:return!1;case 7:u.call(T,x)}return l?-1:s||f?f:T}};t.exports={forEach:s(0),map:s(1),filter:s(2),some:s(3),every:s(4),find:s(5),findIndex:s(6),filterOut:s(7)}},1194:(t,e,r)=>{var n=r(7293),o=r(5112),i=r(7392),a=o("species");t.exports=function(t){return i>=51||!n((function(){var e=[];return(e.constructor={})[a]=function(){return{foo:1}},1!==e[t](Boolean).foo}))}},9341:(t,e,r)=>{"use strict";var n=r(7293);t.exports=function(t,e){var r=[][t];return!!r&&n((function(){r.call(null,e||function(){throw 1},1)}))}},5417:(t,e,r)=>{var n=r(111),o=r(3157),i=r(5112)("species");t.exports=function(t,e){var r;return o(t)&&("function"!=typeof(r=t.constructor)||r!==Array&&!o(r.prototype)?n(r)&&null===(r=r[i])&&(r=void 0):r=void 0),new(void 0===r?Array:r)(0===e?0:e)}},7072:(t,e,r)=>{var n=r(5112)("iterator"),o=!1;try{var i=0,a={next:function(){return{done:!!i++}},return:function(){o=!0}};a[n]=function(){return this},Array.from(a,(function(){throw 2}))}catch(t){}t.exports=function(t,e){if(!e&&!o)return!1;var r=!1;try{var i={};i[n]=function(){return{next:function(){return{done:r=!0}}}},t(i)}catch(t){}return r}},4326:t=>{var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},648:(t,e,r)=>{var n=r(1694),o=r(4326),i=r(5112)("toStringTag"),a="Arguments"==o(function(){return arguments}());t.exports=n?o:function(t){var e,r,n;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(r=function(t,e){try{return t[e]}catch(t){}}(e=Object(t),i))?r:a?o(e):"Object"==(n=o(e))&&"function"==typeof e.callee?"Arguments":n}},9920:(t,e,r)=>{var n=r(6656),o=r(3887),i=r(1236),a=r(3070);t.exports=function(t,e){for(var r=o(e),c=a.f,u=i.f,s=0;s<r.length;s++){var f=r[s];n(t,f)||c(t,f,u(e,f))}}},8880:(t,e,r)=>{var n=r(9781),o=r(3070),i=r(9114);t.exports=n?function(t,e,r){return o.f(t,e,i(1,r))}:function(t,e,r){return t[e]=r,t}},9114:t=>{t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},6135:(t,e,r)=>{"use strict";var n=r(7593),o=r(3070),i=r(9114);t.exports=function(t,e,r){var a=n(e);a in t?o.f(t,a,i(0,r)):t[a]=r}},9781:(t,e,r)=>{var n=r(7293);t.exports=!n((function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]}))},317:(t,e,r)=>{var n=r(7854),o=r(111),i=n.document,a=o(i)&&o(i.createElement);t.exports=function(t){return a?i.createElement(t):{}}},8324:t=>{t.exports={CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}},6833:(t,e,r)=>{var n=r(8113);t.exports=/(iphone|ipod|ipad).*applewebkit/i.test(n)},5268:(t,e,r)=>{var n=r(4326),o=r(7854);t.exports="process"==n(o.process)},1036:(t,e,r)=>{var n=r(8113);t.exports=/web0s(?!.*chrome)/i.test(n)},8113:(t,e,r)=>{var n=r(5005);t.exports=n("navigator","userAgent")||""},7392:(t,e,r)=>{var n,o,i=r(7854),a=r(8113),c=i.process,u=c&&c.versions,s=u&&u.v8;s?o=(n=s.split("."))[0]+n[1]:a&&(!(n=a.match(/Edge\/(\d+)/))||n[1]>=74)&&(n=a.match(/Chrome\/(\d+)/))&&(o=n[1]),t.exports=o&&+o},748:t=>{t.exports=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"]},2109:(t,e,r)=>{var n=r(7854),o=r(1236).f,i=r(8880),a=r(1320),c=r(3505),u=r(9920),s=r(4705);t.exports=function(t,e){var r,f,l,p,h,v=t.target,d=t.global,g=t.stat;if(r=d?n:g?n[v]||c(v,{}):(n[v]||{}).prototype)for(f in e){if(p=e[f],l=t.noTargetGet?(h=o(r,f))&&h.value:r[f],!s(d?f:v+(g?".":"#")+f,t.forced)&&void 0!==l){if(typeof p==typeof l)continue;u(p,l)}(t.sham||l&&l.sham)&&i(p,"sham",!0),a(r,f,p,t)}}},7293:t=>{t.exports=function(t){try{return!!t()}catch(t){return!0}}},7007:(t,e,r)=>{"use strict";r(4916);var n=r(1320),o=r(7293),i=r(5112),a=r(2261),c=r(8880),u=i("species"),s=!o((function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")})),f="$0"==="a".replace(/./,"$0"),l=i("replace"),p=!!/./[l]&&""===/./[l]("a","$0"),h=!o((function(){var t=/(?:)/,e=t.exec;t.exec=function(){return e.apply(this,arguments)};var r="ab".split(t);return 2!==r.length||"a"!==r[0]||"b"!==r[1]}));t.exports=function(t,e,r,l){var v=i(t),d=!o((function(){var e={};return e[v]=function(){return 7},7!=""[t](e)})),g=d&&!o((function(){var e=!1,r=/a/;return"split"===t&&((r={}).constructor={},r.constructor[u]=function(){return r},r.flags="",r[v]=/./[v]),r.exec=function(){return e=!0,null},r[v](""),!e}));if(!d||!g||"replace"===t&&(!s||!f||p)||"split"===t&&!h){var y=/./[v],x=r(v,""[t],(function(t,e,r,n,o){return e.exec===a?d&&!o?{done:!0,value:y.call(e,r,n)}:{done:!0,value:t.call(r,e,n)}:{done:!1}}),{REPLACE_KEEPS_$0:f,REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE:p}),m=x[0],w=x[1];n(String.prototype,t,m),n(RegExp.prototype,v,2==e?function(t,e){return w.call(t,this,e)}:function(t){return w.call(t,this)})}l&&c(RegExp.prototype[v],"sham",!0)}},9974:(t,e,r)=>{var n=r(3099);t.exports=function(t,e,r){if(n(t),void 0===e)return t;switch(r){case 0:return function(){return t.call(e)};case 1:return function(r){return t.call(e,r)};case 2:return function(r,n){return t.call(e,r,n)};case 3:return function(r,n,o){return t.call(e,r,n,o)}}return function(){return t.apply(e,arguments)}}},5005:(t,e,r)=>{var n=r(857),o=r(7854),i=function(t){return"function"==typeof t?t:void 0};t.exports=function(t,e){return arguments.length<2?i(n[t])||i(o[t]):n[t]&&n[t][e]||o[t]&&o[t][e]}},1246:(t,e,r)=>{var n=r(648),o=r(7497),i=r(5112)("iterator");t.exports=function(t){if(null!=t)return t[i]||t["@@iterator"]||o[n(t)]}},7854:(t,e,r)=>{var n=function(t){return t&&t.Math==Math&&t};t.exports=n("object"==typeof globalThis&&globalThis)||n("object"==typeof window&&window)||n("object"==typeof self&&self)||n("object"==typeof r.g&&r.g)||function(){return this}()||Function("return this")()},6656:t=>{var e={}.hasOwnProperty;t.exports=function(t,r){return e.call(t,r)}},3501:t=>{t.exports={}},842:(t,e,r)=>{var n=r(7854);t.exports=function(t,e){var r=n.console;r&&r.error&&(1===arguments.length?r.error(t):r.error(t,e))}},490:(t,e,r)=>{var n=r(5005);t.exports=n("document","documentElement")},4664:(t,e,r)=>{var n=r(9781),o=r(7293),i=r(317);t.exports=!n&&!o((function(){return 7!=Object.defineProperty(i("div"),"a",{get:function(){return 7}}).a}))},8361:(t,e,r)=>{var n=r(7293),o=r(4326),i="".split;t.exports=n((function(){return!Object("z").propertyIsEnumerable(0)}))?function(t){return"String"==o(t)?i.call(t,""):Object(t)}:Object},2788:(t,e,r)=>{var n=r(5465),o=Function.toString;"function"!=typeof n.inspectSource&&(n.inspectSource=function(t){return o.call(t)}),t.exports=n.inspectSource},9909:(t,e,r)=>{var n,o,i,a=r(8536),c=r(7854),u=r(111),s=r(8880),f=r(6656),l=r(5465),p=r(6200),h=r(3501),v=c.WeakMap;if(a){var d=l.state||(l.state=new v),g=d.get,y=d.has,x=d.set;n=function(t,e){return e.facade=t,x.call(d,t,e),e},o=function(t){return g.call(d,t)||{}},i=function(t){return y.call(d,t)}}else{var m=p("state");h[m]=!0,n=function(t,e){return e.facade=t,s(t,m,e),e},o=function(t){return f(t,m)?t[m]:{}},i=function(t){return f(t,m)}}t.exports={set:n,get:o,has:i,enforce:function(t){return i(t)?o(t):n(t,{})},getterFor:function(t){return function(e){var r;if(!u(e)||(r=o(e)).type!==t)throw TypeError("Incompatible receiver, "+t+" required");return r}}}},7659:(t,e,r)=>{var n=r(5112),o=r(7497),i=n("iterator"),a=Array.prototype;t.exports=function(t){return void 0!==t&&(o.Array===t||a[i]===t)}},3157:(t,e,r)=>{var n=r(4326);t.exports=Array.isArray||function(t){return"Array"==n(t)}},4705:(t,e,r)=>{var n=r(7293),o=/#|\.prototype\./,i=function(t,e){var r=c[a(t)];return r==s||r!=u&&("function"==typeof e?n(e):!!e)},a=i.normalize=function(t){return String(t).replace(o,".").toLowerCase()},c=i.data={},u=i.NATIVE="N",s=i.POLYFILL="P";t.exports=i},111:t=>{t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},1913:t=>{t.exports=!1},7850:(t,e,r)=>{var n=r(111),o=r(4326),i=r(5112)("match");t.exports=function(t){var e;return n(t)&&(void 0!==(e=t[i])?!!e:"RegExp"==o(t))}},408:(t,e,r)=>{var n=r(9670),o=r(7659),i=r(7466),a=r(9974),c=r(1246),u=r(9212),s=function(t,e){this.stopped=t,this.result=e};t.exports=function(t,e,r){var f,l,p,h,v,d,g,y=r&&r.that,x=!(!r||!r.AS_ENTRIES),m=!(!r||!r.IS_ITERATOR),w=!(!r||!r.INTERRUPTED),b=a(e,y,1+x+w),E=function(t){return f&&u(f),new s(!0,t)},S=function(t){return x?(n(t),w?b(t[0],t[1],E):b(t[0],t[1])):w?b(t,E):b(t)};if(m)f=t;else{if("function"!=typeof(l=c(t)))throw TypeError("Target is not iterable");if(o(l)){for(p=0,h=i(t.length);h>p;p++)if((v=S(t[p]))&&v instanceof s)return v;return new s(!1)}f=l.call(t)}for(d=f.next;!(g=d.call(f)).done;){try{v=S(g.value)}catch(t){throw u(f),t}if("object"==typeof v&&v&&v instanceof s)return v}return new s(!1)}},9212:(t,e,r)=>{var n=r(9670);t.exports=function(t){var e=t.return;if(void 0!==e)return n(e.call(t)).value}},7497:t=>{t.exports={}},5948:(t,e,r)=>{var n,o,i,a,c,u,s,f,l=r(7854),p=r(1236).f,h=r(261).set,v=r(6833),d=r(1036),g=r(5268),y=l.MutationObserver||l.WebKitMutationObserver,x=l.document,m=l.process,w=l.Promise,b=p(l,"queueMicrotask"),E=b&&b.value;E||(n=function(){var t,e;for(g&&(t=m.domain)&&t.exit();o;){e=o.fn,o=o.next;try{e()}catch(t){throw o?a():i=void 0,t}}i=void 0,t&&t.enter()},v||g||d||!y||!x?w&&w.resolve?(s=w.resolve(void 0),f=s.then,a=function(){f.call(s,n)}):a=g?function(){m.nextTick(n)}:function(){h.call(l,n)}:(c=!0,u=x.createTextNode(""),new y(n).observe(u,{characterData:!0}),a=function(){u.data=c=!c})),t.exports=E||function(t){var e={fn:t,next:void 0};i&&(i.next=e),o||(o=e,a()),i=e}},3366:(t,e,r)=>{var n=r(7854);t.exports=n.Promise},133:(t,e,r)=>{var n=r(5268),o=r(7392),i=r(7293);t.exports=!!Object.getOwnPropertySymbols&&!i((function(){return!Symbol.sham&&(n?38===o:o>37&&o<41)}))},8536:(t,e,r)=>{var n=r(7854),o=r(2788),i=n.WeakMap;t.exports="function"==typeof i&&/native code/.test(o(i))},8523:(t,e,r)=>{"use strict";var n=r(3099),o=function(t){var e,r;this.promise=new t((function(t,n){if(void 0!==e||void 0!==r)throw TypeError("Bad Promise constructor");e=t,r=n})),this.resolve=n(e),this.reject=n(r)};t.exports.f=function(t){return new o(t)}},3070:(t,e,r)=>{var n=r(9781),o=r(4664),i=r(9670),a=r(7593),c=Object.defineProperty;e.f=n?c:function(t,e,r){if(i(t),e=a(e,!0),i(r),o)try{return c(t,e,r)}catch(t){}if("get"in r||"set"in r)throw TypeError("Accessors not supported");return"value"in r&&(t[e]=r.value),t}},1236:(t,e,r)=>{var n=r(9781),o=r(5296),i=r(9114),a=r(5656),c=r(7593),u=r(6656),s=r(4664),f=Object.getOwnPropertyDescriptor;e.f=n?f:function(t,e){if(t=a(t),e=c(e,!0),s)try{return f(t,e)}catch(t){}if(u(t,e))return i(!o.f.call(t,e),t[e])}},8006:(t,e,r)=>{var n=r(6324),o=r(748).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return n(t,o)}},5181:(t,e)=>{e.f=Object.getOwnPropertySymbols},6324:(t,e,r)=>{var n=r(6656),o=r(5656),i=r(1318).indexOf,a=r(3501);t.exports=function(t,e){var r,c=o(t),u=0,s=[];for(r in c)!n(a,r)&&n(c,r)&&s.push(r);for(;e.length>u;)n(c,r=e[u++])&&(~i(s,r)||s.push(r));return s}},5296:(t,e)=>{"use strict";var r={}.propertyIsEnumerable,n=Object.getOwnPropertyDescriptor,o=n&&!r.call({1:2},1);e.f=o?function(t){var e=n(this,t);return!!e&&e.enumerable}:r},288:(t,e,r)=>{"use strict";var n=r(1694),o=r(648);t.exports=n?{}.toString:function(){return"[object "+o(this)+"]"}},3887:(t,e,r)=>{var n=r(5005),o=r(8006),i=r(5181),a=r(9670);t.exports=n("Reflect","ownKeys")||function(t){var e=o.f(a(t)),r=i.f;return r?e.concat(r(t)):e}},857:(t,e,r)=>{var n=r(7854);t.exports=n},2534:t=>{t.exports=function(t){try{return{error:!1,value:t()}}catch(t){return{error:!0,value:t}}}},9478:(t,e,r)=>{var n=r(9670),o=r(111),i=r(8523);t.exports=function(t,e){if(n(t),o(e)&&e.constructor===t)return e;var r=i.f(t);return(0,r.resolve)(e),r.promise}},2248:(t,e,r)=>{var n=r(1320);t.exports=function(t,e,r){for(var o in e)n(t,o,e[o],r);return t}},1320:(t,e,r)=>{var n=r(7854),o=r(8880),i=r(6656),a=r(3505),c=r(2788),u=r(9909),s=u.get,f=u.enforce,l=String(String).split("String");(t.exports=function(t,e,r,c){var u,s=!!c&&!!c.unsafe,p=!!c&&!!c.enumerable,h=!!c&&!!c.noTargetGet;"function"==typeof r&&("string"!=typeof e||i(r,"name")||o(r,"name",e),(u=f(r)).source||(u.source=l.join("string"==typeof e?e:""))),t!==n?(s?!h&&t[e]&&(p=!0):delete t[e],p?t[e]=r:o(t,e,r)):p?t[e]=r:a(e,r)})(Function.prototype,"toString",(function(){return"function"==typeof this&&s(this).source||c(this)}))},7651:(t,e,r)=>{var n=r(4326),o=r(2261);t.exports=function(t,e){var r=t.exec;if("function"==typeof r){var i=r.call(t,e);if("object"!=typeof i)throw TypeError("RegExp exec method returned something other than an Object or null");return i}if("RegExp"!==n(t))throw TypeError("RegExp#exec called on incompatible receiver");return o.call(t,e)}},2261:(t,e,r)=>{"use strict";var n,o,i=r(7066),a=r(2999),c=r(2309),u=RegExp.prototype.exec,s=c("native-string-replace",String.prototype.replace),f=u,l=(n=/a/,o=/b*/g,u.call(n,"a"),u.call(o,"a"),0!==n.lastIndex||0!==o.lastIndex),p=a.UNSUPPORTED_Y||a.BROKEN_CARET,h=void 0!==/()??/.exec("")[1];(l||h||p)&&(f=function(t){var e,r,n,o,a=this,c=p&&a.sticky,f=i.call(a),v=a.source,d=0,g=t;return c&&(-1===(f=f.replace("y","")).indexOf("g")&&(f+="g"),g=String(t).slice(a.lastIndex),a.lastIndex>0&&(!a.multiline||a.multiline&&"\n"!==t[a.lastIndex-1])&&(v="(?: "+v+")",g=" "+g,d++),r=new RegExp("^(?:"+v+")",f)),h&&(r=new RegExp("^"+v+"$(?!\\s)",f)),l&&(e=a.lastIndex),n=u.call(c?r:a,g),c?n?(n.input=n.input.slice(d),n[0]=n[0].slice(d),n.index=a.lastIndex,a.lastIndex+=n[0].length):a.lastIndex=0:l&&n&&(a.lastIndex=a.global?n.index+n[0].length:e),h&&n&&n.length>1&&s.call(n[0],r,(function(){for(o=1;o<arguments.length-2;o++)void 0===arguments[o]&&(n[o]=void 0)})),n}),t.exports=f},7066:(t,e,r)=>{"use strict";var n=r(9670);t.exports=function(){var t=n(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.dotAll&&(e+="s"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}},2999:(t,e,r)=>{"use strict";var n=r(7293);function o(t,e){return RegExp(t,e)}e.UNSUPPORTED_Y=n((function(){var t=o("a","y");return t.lastIndex=2,null!=t.exec("abcd")})),e.BROKEN_CARET=n((function(){var t=o("^r","gy");return t.lastIndex=2,null!=t.exec("str")}))},4488:t=>{t.exports=function(t){if(null==t)throw TypeError("Can't call method on "+t);return t}},3505:(t,e,r)=>{var n=r(7854),o=r(8880);t.exports=function(t,e){try{o(n,t,e)}catch(r){n[t]=e}return e}},6340:(t,e,r)=>{"use strict";var n=r(5005),o=r(3070),i=r(5112),a=r(9781),c=i("species");t.exports=function(t){var e=n(t),r=o.f;a&&e&&!e[c]&&r(e,c,{configurable:!0,get:function(){return this}})}},8003:(t,e,r)=>{var n=r(3070).f,o=r(6656),i=r(5112)("toStringTag");t.exports=function(t,e,r){t&&!o(t=r?t:t.prototype,i)&&n(t,i,{configurable:!0,value:e})}},6200:(t,e,r)=>{var n=r(2309),o=r(9711),i=n("keys");t.exports=function(t){return i[t]||(i[t]=o(t))}},5465:(t,e,r)=>{var n=r(7854),o=r(3505),i="__core-js_shared__",a=n[i]||o(i,{});t.exports=a},2309:(t,e,r)=>{var n=r(1913),o=r(5465);(t.exports=function(t,e){return o[t]||(o[t]=void 0!==e?e:{})})("versions",[]).push({version:"3.10.0",mode:n?"pure":"global",copyright:"© 2021 Denis Pushkarev (zloirock.ru)"})},6707:(t,e,r)=>{var n=r(9670),o=r(3099),i=r(5112)("species");t.exports=function(t,e){var r,a=n(t).constructor;return void 0===a||null==(r=n(a)[i])?e:o(r)}},8710:(t,e,r)=>{var n=r(9958),o=r(4488),i=function(t){return function(e,r){var i,a,c=String(o(e)),u=n(r),s=c.length;return u<0||u>=s?t?"":void 0:(i=c.charCodeAt(u))<55296||i>56319||u+1===s||(a=c.charCodeAt(u+1))<56320||a>57343?t?c.charAt(u):i:t?c.slice(u,u+2):a-56320+(i-55296<<10)+65536}};t.exports={codeAt:i(!1),charAt:i(!0)}},261:(t,e,r)=>{var n,o,i,a=r(7854),c=r(7293),u=r(9974),s=r(490),f=r(317),l=r(6833),p=r(5268),h=a.location,v=a.setImmediate,d=a.clearImmediate,g=a.process,y=a.MessageChannel,x=a.Dispatch,m=0,w={},b="onreadystatechange",E=function(t){if(w.hasOwnProperty(t)){var e=w[t];delete w[t],e()}},S=function(t){return function(){E(t)}},L=function(t){E(t.data)},j=function(t){a.postMessage(t+"",h.protocol+"//"+h.host)};v&&d||(v=function(t){for(var e=[],r=1;arguments.length>r;)e.push(arguments[r++]);return w[++m]=function(){("function"==typeof t?t:Function(t)).apply(void 0,e)},n(m),m},d=function(t){delete w[t]},p?n=function(t){g.nextTick(S(t))}:x&&x.now?n=function(t){x.now(S(t))}:y&&!l?(i=(o=new y).port2,o.port1.onmessage=L,n=u(i.postMessage,i,1)):a.addEventListener&&"function"==typeof postMessage&&!a.importScripts&&h&&"file:"!==h.protocol&&!c(j)?(n=j,a.addEventListener("message",L,!1)):n=b in f("script")?function(t){s.appendChild(f("script")).onreadystatechange=function(){s.removeChild(this),E(t)}}:function(t){setTimeout(S(t),0)}),t.exports={set:v,clear:d}},1400:(t,e,r)=>{var n=r(9958),o=Math.max,i=Math.min;t.exports=function(t,e){var r=n(t);return r<0?o(r+e,0):i(r,e)}},5656:(t,e,r)=>{var n=r(8361),o=r(4488);t.exports=function(t){return n(o(t))}},9958:t=>{var e=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:e)(t)}},7466:(t,e,r)=>{var n=r(9958),o=Math.min;t.exports=function(t){return t>0?o(n(t),9007199254740991):0}},7908:(t,e,r)=>{var n=r(4488);t.exports=function(t){return Object(n(t))}},7593:(t,e,r)=>{var n=r(111);t.exports=function(t,e){if(!n(t))return t;var r,o;if(e&&"function"==typeof(r=t.toString)&&!n(o=r.call(t)))return o;if("function"==typeof(r=t.valueOf)&&!n(o=r.call(t)))return o;if(!e&&"function"==typeof(r=t.toString)&&!n(o=r.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},1694:(t,e,r)=>{var n={};n[r(5112)("toStringTag")]="z",t.exports="[object z]"===String(n)},9711:t=>{var e=0,r=Math.random();t.exports=function(t){return"Symbol("+String(void 0===t?"":t)+")_"+(++e+r).toString(36)}},3307:(t,e,r)=>{var n=r(133);t.exports=n&&!Symbol.sham&&"symbol"==typeof Symbol.iterator},5112:(t,e,r)=>{var n=r(7854),o=r(2309),i=r(6656),a=r(9711),c=r(133),u=r(3307),s=o("wks"),f=n.Symbol,l=u?f:f&&f.withoutSetter||a;t.exports=function(t){return i(s,t)&&(c||"string"==typeof s[t])||(c&&i(f,t)?s[t]=f[t]:s[t]=l("Symbol."+t)),s[t]}},2222:(t,e,r)=>{"use strict";var n=r(2109),o=r(7293),i=r(3157),a=r(111),c=r(7908),u=r(7466),s=r(6135),f=r(5417),l=r(1194),p=r(5112),h=r(7392),v=p("isConcatSpreadable"),d=9007199254740991,g="Maximum allowed index exceeded",y=h>=51||!o((function(){var t=[];return t[v]=!1,t.concat()[0]!==t})),x=l("concat"),m=function(t){if(!a(t))return!1;var e=t[v];return void 0!==e?!!e:i(t)};n({target:"Array",proto:!0,forced:!y||!x},{concat:function(t){var e,r,n,o,i,a=c(this),l=f(a,0),p=0;for(e=-1,n=arguments.length;e<n;e++)if(m(i=-1===e?a:arguments[e])){if(p+(o=u(i.length))>d)throw TypeError(g);for(r=0;r<o;r++,p++)r in i&&s(l,p,i[r])}else{if(p>=d)throw TypeError(g);s(l,p++,i)}return l.length=p,l}})},1539:(t,e,r)=>{var n=r(1694),o=r(1320),i=r(288);n||o(Object.prototype,"toString",i,{unsafe:!0})},8674:(t,e,r)=>{"use strict";var n,o,i,a,c=r(2109),u=r(1913),s=r(7854),f=r(5005),l=r(3366),p=r(1320),h=r(2248),v=r(8003),d=r(6340),g=r(111),y=r(3099),x=r(5787),m=r(2788),w=r(408),b=r(7072),E=r(6707),S=r(261).set,L=r(5948),j=r(9478),T=r(842),O=r(8523),R=r(2534),P=r(9909),I=r(4705),k=r(5112),A=r(5268),_=r(7392),M=k("species"),N="Promise",C=P.get,F=P.set,G=P.getterFor(N),D=l,U=s.TypeError,V=s.document,B=s.process,$=f("fetch"),q=O.f,z=q,H=!!(V&&V.createEvent&&s.dispatchEvent),K="function"==typeof PromiseRejectionEvent,W="unhandledrejection",Y=I(N,(function(){if(!(m(D)!==String(D))){if(66===_)return!0;if(!A&&!K)return!0}if(u&&!D.prototype.finally)return!0;if(_>=51&&/native code/.test(D))return!1;var t=D.resolve(1),e=function(t){t((function(){}),(function(){}))};return(t.constructor={})[M]=e,!(t.then((function(){}))instanceof e)})),X=Y||!b((function(t){D.all(t).catch((function(){}))})),J=function(t){var e;return!(!g(t)||"function"!=typeof(e=t.then))&&e},Q=function(t,e){if(!t.notified){t.notified=!0;var r=t.reactions;L((function(){for(var n=t.value,o=1==t.state,i=0;r.length>i;){var a,c,u,s=r[i++],f=o?s.ok:s.fail,l=s.resolve,p=s.reject,h=s.domain;try{f?(o||(2===t.rejection&&rt(t),t.rejection=1),!0===f?a=n:(h&&h.enter(),a=f(n),h&&(h.exit(),u=!0)),a===s.promise?p(U("Promise-chain cycle")):(c=J(a))?c.call(a,l,p):l(a)):p(n)}catch(t){h&&!u&&h.exit(),p(t)}}t.reactions=[],t.notified=!1,e&&!t.rejection&&tt(t)}))}},Z=function(t,e,r){var n,o;H?((n=V.createEvent("Event")).promise=e,n.reason=r,n.initEvent(t,!1,!0),s.dispatchEvent(n)):n={promise:e,reason:r},!K&&(o=s["on"+t])?o(n):t===W&&T("Unhandled promise rejection",r)},tt=function(t){S.call(s,(function(){var e,r=t.facade,n=t.value;if(et(t)&&(e=R((function(){A?B.emit("unhandledRejection",n,r):Z(W,r,n)})),t.rejection=A||et(t)?2:1,e.error))throw e.value}))},et=function(t){return 1!==t.rejection&&!t.parent},rt=function(t){S.call(s,(function(){var e=t.facade;A?B.emit("rejectionHandled",e):Z("rejectionhandled",e,t.value)}))},nt=function(t,e,r){return function(n){t(e,n,r)}},ot=function(t,e,r){t.done||(t.done=!0,r&&(t=r),t.value=e,t.state=2,Q(t,!0))},it=function(t,e,r){if(!t.done){t.done=!0,r&&(t=r);try{if(t.facade===e)throw U("Promise can't be resolved itself");var n=J(e);n?L((function(){var r={done:!1};try{n.call(e,nt(it,r,t),nt(ot,r,t))}catch(e){ot(r,e,t)}})):(t.value=e,t.state=1,Q(t,!1))}catch(e){ot({done:!1},e,t)}}};Y&&(D=function(t){x(this,D,N),y(t),n.call(this);var e=C(this);try{t(nt(it,e),nt(ot,e))}catch(t){ot(e,t)}},(n=function(t){F(this,{type:N,done:!1,notified:!1,parent:!1,reactions:[],rejection:!1,state:0,value:void 0})}).prototype=h(D.prototype,{then:function(t,e){var r=G(this),n=q(E(this,D));return n.ok="function"!=typeof t||t,n.fail="function"==typeof e&&e,n.domain=A?B.domain:void 0,r.parent=!0,r.reactions.push(n),0!=r.state&&Q(r,!1),n.promise},catch:function(t){return this.then(void 0,t)}}),o=function(){var t=new n,e=C(t);this.promise=t,this.resolve=nt(it,e),this.reject=nt(ot,e)},O.f=q=function(t){return t===D||t===i?new o(t):z(t)},u||"function"!=typeof l||(a=l.prototype.then,p(l.prototype,"then",(function(t,e){var r=this;return new D((function(t,e){a.call(r,t,e)})).then(t,e)}),{unsafe:!0}),"function"==typeof $&&c({global:!0,enumerable:!0,forced:!0},{fetch:function(t){return j(D,$.apply(s,arguments))}}))),c({global:!0,wrap:!0,forced:Y},{Promise:D}),v(D,N,!1,!0),d(N),i=f(N),c({target:N,stat:!0,forced:Y},{reject:function(t){var e=q(this);return e.reject.call(void 0,t),e.promise}}),c({target:N,stat:!0,forced:u||Y},{resolve:function(t){return j(u&&this===i?D:this,t)}}),c({target:N,stat:!0,forced:X},{all:function(t){var e=this,r=q(e),n=r.resolve,o=r.reject,i=R((function(){var r=y(e.resolve),i=[],a=0,c=1;w(t,(function(t){var u=a++,s=!1;i.push(void 0),c++,r.call(e,t).then((function(t){s||(s=!0,i[u]=t,--c||n(i))}),o)})),--c||n(i)}));return i.error&&o(i.value),r.promise},race:function(t){var e=this,r=q(e),n=r.reject,o=R((function(){var o=y(e.resolve);w(t,(function(t){o.call(e,t).then(r.resolve,n)}))}));return o.error&&n(o.value),r.promise}})},4916:(t,e,r)=>{"use strict";var n=r(2109),o=r(2261);n({target:"RegExp",proto:!0,forced:/./.exec!==o},{exec:o})},4723:(t,e,r)=>{"use strict";var n=r(7007),o=r(9670),i=r(7466),a=r(4488),c=r(1530),u=r(7651);n("match",1,(function(t,e,r){return[function(e){var r=a(this),n=null==e?void 0:e[t];return void 0!==n?n.call(e,r):new RegExp(e)[t](String(r))},function(t){var n=r(e,t,this);if(n.done)return n.value;var a=o(t),s=String(this);if(!a.global)return u(a,s);var f=a.unicode;a.lastIndex=0;for(var l,p=[],h=0;null!==(l=u(a,s));){var v=String(l[0]);p[h]=v,""===v&&(a.lastIndex=c(s,i(a.lastIndex),f)),h++}return 0===h?null:p}]}))},3123:(t,e,r)=>{"use strict";var n=r(7007),o=r(7850),i=r(9670),a=r(4488),c=r(6707),u=r(1530),s=r(7466),f=r(7651),l=r(2261),p=r(7293),h=[].push,v=Math.min,d=4294967295,g=!p((function(){return!RegExp(d,"y")}));n("split",2,(function(t,e,r){var n;return n="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||".".split(/()()/).length>1||"".split(/.?/).length?function(t,r){var n=String(a(this)),i=void 0===r?d:r>>>0;if(0===i)return[];if(void 0===t)return[n];if(!o(t))return e.call(n,t,i);for(var c,u,s,f=[],p=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),v=0,g=new RegExp(t.source,p+"g");(c=l.call(g,n))&&!((u=g.lastIndex)>v&&(f.push(n.slice(v,c.index)),c.length>1&&c.index<n.length&&h.apply(f,c.slice(1)),s=c[0].length,v=u,f.length>=i));)g.lastIndex===c.index&&g.lastIndex++;return v===n.length?!s&&g.test("")||f.push(""):f.push(n.slice(v)),f.length>i?f.slice(0,i):f}:"0".split(void 0,0).length?function(t,r){return void 0===t&&0===r?[]:e.call(this,t,r)}:e,[function(e,r){var o=a(this),i=null==e?void 0:e[t];return void 0!==i?i.call(e,o,r):n.call(String(o),e,r)},function(t,o){var a=r(n,t,this,o,n!==e);if(a.done)return a.value;var l=i(t),p=String(this),h=c(l,RegExp),y=l.unicode,x=(l.ignoreCase?"i":"")+(l.multiline?"m":"")+(l.unicode?"u":"")+(g?"y":"g"),m=new h(g?l:"^(?:"+l.source+")",x),w=void 0===o?d:o>>>0;if(0===w)return[];if(0===p.length)return null===f(m,p)?[p]:[];for(var b=0,E=0,S=[];E<p.length;){m.lastIndex=g?E:0;var L,j=f(m,g?p:p.slice(E));if(null===j||(L=v(s(m.lastIndex+(g?0:E)),p.length))===b)E=u(p,E,y);else{if(S.push(p.slice(b,E)),S.length===w)return S;for(var T=1;T<=j.length-1;T++)if(S.push(j[T]),S.length===w)return S;E=b=L}}return S.push(p.slice(b)),S}]}),!g)},4747:(t,e,r)=>{var n=r(7854),o=r(8324),i=r(8533),a=r(8880);for(var c in o){var u=n[c],s=u&&u.prototype;if(s&&s.forEach!==i)try{a(s,"forEach",i)}catch(t){s.forEach=i}}},5666:t=>{var e=function(t){"use strict";var e,r=Object.prototype,n=r.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},i=o.iterator||"@@iterator",a=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function u(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"")}catch(t){u=function(t,e,r){return t[e]=r}}function s(t,e,r,n){var o=e&&e.prototype instanceof g?e:g,i=Object.create(o.prototype),a=new R(n||[]);return i._invoke=function(t,e,r){var n=l;return function(o,i){if(n===h)throw new Error("Generator is already running");if(n===v){if("throw"===o)throw i;return I()}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var c=j(a,r);if(c){if(c===d)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if(n===l)throw n=v,r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n=h;var u=f(t,e,r);if("normal"===u.type){if(n=r.done?v:p,u.arg===d)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n=v,r.method="throw",r.arg=u.arg)}}}(t,r,a),i}function f(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}t.wrap=s;var l="suspendedStart",p="suspendedYield",h="executing",v="completed",d={};function g(){}function y(){}function x(){}var m={};m[i]=function(){return this};var w=Object.getPrototypeOf,b=w&&w(w(P([])));b&&b!==r&&n.call(b,i)&&(m=b);var E=x.prototype=g.prototype=Object.create(m);function S(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}))}))}function L(t,e){function r(o,i,a,c){var u=f(t[o],t,i);if("throw"!==u.type){var s=u.arg,l=s.value;return l&&"object"==typeof l&&n.call(l,"__await")?e.resolve(l.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(l).then((function(t){s.value=t,a(s)}),(function(t){return r("throw",t,a,c)}))}c(u.arg)}var o;this._invoke=function(t,n){function i(){return new e((function(e,o){r(t,n,e,o)}))}return o=o?o.then(i,i):i()}}function j(t,r){var n=t.iterator[r.method];if(n===e){if(r.delegate=null,"throw"===r.method){if(t.iterator.return&&(r.method="return",r.arg=e,j(t,r),"throw"===r.method))return d;r.method="throw",r.arg=new TypeError("The iterator does not provide a 'throw' method")}return d}var o=f(n,t.iterator,r.arg);if("throw"===o.type)return r.method="throw",r.arg=o.arg,r.delegate=null,d;var i=o.arg;return i?i.done?(r[t.resultName]=i.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,d):i:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,d)}function T(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function O(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function R(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(T,this),this.reset(!0)}function P(t){if(t){var r=t[i];if(r)return r.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,a=function r(){for(;++o<t.length;)if(n.call(t,o))return r.value=t[o],r.done=!1,r;return r.value=e,r.done=!0,r};return a.next=a}}return{next:I}}function I(){return{value:e,done:!0}}return y.prototype=E.constructor=x,x.constructor=y,y.displayName=u(x,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===y||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,x):(t.__proto__=x,u(t,c,"GeneratorFunction")),t.prototype=Object.create(E),t},t.awrap=function(t){return{__await:t}},S(L.prototype),L.prototype[a]=function(){return this},t.AsyncIterator=L,t.async=function(e,r,n,o,i){void 0===i&&(i=Promise);var a=new L(s(e,r,n,o),i);return t.isGeneratorFunction(r)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},S(E),u(E,c,"Generator"),E[i]=function(){return this},E.toString=function(){return"[object Generator]"},t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=P,R.prototype={constructor:R,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(O),!t)for(var r in this)"t"===r.charAt(0)&&n.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function o(n,o){return c.type="throw",c.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var i=this.tryEntries.length-1;i>=0;--i){var a=this.tryEntries[i],c=a.completion;if("root"===a.tryLoc)return o("end");if(a.tryLoc<=this.prev){var u=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(u&&s){if(this.prev<a.catchLoc)return o(a.catchLoc,!0);if(this.prev<a.finallyLoc)return o(a.finallyLoc)}else if(u){if(this.prev<a.catchLoc)return o(a.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return o(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,d):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),d},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),O(r),d}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;O(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:P(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),d}},t}(t.exports);try{regeneratorRuntime=e}catch(t){Function("r","regeneratorRuntime = r")(e)}}},e={};function r(n){var o=e[n];if(void 0!==o)return o.exports;var i=e[n]={exports:{}};return t[n](i,i.exports,r),i.exports}r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),(()=>{function t(t,e,r,n,o,i,a){try{var c=t[i](a),u=c.value}catch(t){return void r(t)}c.done?e(u):Promise.resolve(u).then(n,o)}function e(e){return function(){var r=this,n=arguments;return new Promise((function(o,i){var a=e.apply(r,n);function c(e){t(a,o,i,c,u,"next",e)}function u(e){t(a,o,i,c,u,"throw",e)}c(void 0)}))}}function n(){return o.apply(this,arguments)}function o(){return(o=e(regeneratorRuntime.mark((function t(){var e;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return"Mahjong4Friends",t.next=3,caches.open("Mahjong4Friends");case 3:return e=t.sent,t.abrupt("return",e);case 5:case"end":return t.stop()}}),t)})))).apply(this,arguments)}r(5666),r(2222),r(4747),r(8674),r(1539),r(4723),r(4916),self.addEventListener("install",(function(){self.skipWaiting()})),self.addEventListener("activate",e(regeneratorRuntime.mark((function t(){var e;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n();case 2:e=t.sent,[registration.scope].concat(r(8222)).forEach((function(t){e.add(t).catch((function(e){console.log(t,e)}))}));case 5:case"end":return t.stop()}}),t)})))),self.addEventListener("fetch",function(){var t=e(regeneratorRuntime.mark((function t(r){var o;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:o=r.request.url,r.respondWith(e(regeneratorRuntime.mark((function t(){var e,i,a;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n();case 2:return e=t.sent,t.prev=3,t.next=6,fetch(r.request);case 6:i=t.sent;try{e.put(o,i.clone())}catch(t){console.error(t)}return t.abrupt("return",i);case 11:return t.prev=11,t.t0=t.catch(3),t.next=15,e.match(o);case 15:if(!(a=t.sent)){t.next=18;break}return t.abrupt("return",a);case 18:case"end":return t.stop()}}),t,null,[[3,11]])})))());case 2:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())})()})();
//# sourceMappingURL=packagedsw.js.map