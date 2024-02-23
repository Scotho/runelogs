(()=>{"use strict";var e={3839:(e,t,n)=>{let a=function(e){return e.LOG_VERSION="Log Version",e.LOGGED_IN_PLAYER="Logged In Player",e.BOOSTED_LEVELS="Boosted Levels",e.PLAYER_EQUIPMENT="Player Equipment",e.DEATH="Death",e.TARGET_CHANGE="Target Change",e.DAMAGE="Damage",e}({});let r=function(e){return e[e.BLOCK_ME=12]="BLOCK_ME",e[e.DAMAGE_ME=16]="DAMAGE_ME",e[e.DAMAGE_ME_CYAN=18]="DAMAGE_ME_CYAN",e[e.DAMAGE_ME_ORANGE=20]="DAMAGE_ME_ORANGE",e[e.DAMAGE_ME_YELLOW=22]="DAMAGE_ME_YELLOW",e[e.DAMAGE_ME_WHITE=24]="DAMAGE_ME_WHITE",e[e.SPLASH_ME=69]="SPLASH_ME",e}({}),o=function(e){return e[e.DAMAGE_MAX_ME=43]="DAMAGE_MAX_ME",e[e.DAMAGE_MAX_ME_CYAN=44]="DAMAGE_MAX_ME_CYAN",e[e.DAMAGE_MAX_ME_ORANGE=45]="DAMAGE_MAX_ME_ORANGE",e[e.DAMAGE_MAX_ME_YELLOW=46]="DAMAGE_MAX_ME_YELLOW",e[e.DAMAGE_MAX_ME_WHITE=47]="DAMAGE_MAX_ME_WHITE",e}({});const i=e=>{const[t,n,a]=e.split(":").map(Number);return 36e5*t+6e4*n+1e3*a};function s(e){const t=Math.floor(e%1e3);let n=Math.floor(e/1e3%60),a=Math.floor(e/6e4%60),r=Math.floor(e/36e5%24);r=r<10?"0"+r:r,a=a<10?"0"+a:a,n=n<10?"0"+n:n;return r+":"+a+":"+n+"."+(t<10?"00"+t:t<100?"0"+t:t)}var c=n(3380),l=n.n(c);const E=["Scurrius","Kree'arra","Commander Zilyana","General Graardor","K'ril Tsutsaroth","Nex","Kalphite Queen","Sarachnis","Scorpia","Abyssal Sire","Kraken","Dagannoth Rex","Dagannoth Supreme","Dagannoth Prime"];function m(e){return Object.values(r).includes(e.hitsplatName)||Object.values(o).includes(e.hitsplatName)||"BLOCK_ME"===e.hitsplatName}const p=e=>{const t=".*",n="[^\\t]*",r=new RegExp("^(".concat("\\d{2}-\\d{2}-\\d{4}",") (").concat("\\d{2}:\\d{2}:\\d{2}\\.\\d{3}",") (").concat("\\w+",")\t(").concat(t,")"));let o=e.match(r);if(!o)return console.error("Invalid log line format:",e),null;const[,i,s,c,l]=o,E=new RegExp("Log Version (".concat(t,")"));if(o=l.match(E),o){const[,e]=o;return console.log("Log Version ".concat(e)),{type:a.LOG_VERSION,date:i,time:s,timezone:c,logVersion:e}}const m=new RegExp("Logged in player is (".concat(t,")"));if(o=l.match(m),o){const[,e]=o;return{type:a.LOGGED_IN_PLAYER,date:i,time:s,timezone:c,loggedInPlayer:e}}const p=new RegExp("Boosted levels are \\[(\\d+), (\\d+), (\\d+), (\\d+), (\\d+), (\\d+), (\\d+)\\]");if(o=l.match(p),o){const[,e,t,n,r,l,E,m]=o.map(Number);return{type:a.BOOSTED_LEVELS,date:i,time:s,timezone:c,boostedLevels:{attack:e,strength:t,defence:n,ranged:r,magic:l,hitpoints:E,prayer:m}}}const u=new RegExp("Player equipment is (".concat(t,")"));if(o=l.match(u),o){const[,e]=o,t=JSON.parse(e).map((e=>e.toString()));return{type:a.PLAYER_EQUIPMENT,date:i,time:s,timezone:c,playerEquipment:t}}const g=new RegExp("^(".concat(t,") dies"));if(o=l.match(g),o){const[,e]=o;return{type:a.DEATH,date:i,time:s,timezone:c,target:e}}const A=new RegExp("^(".concat(t,") changes target to (").concat(t,")"));if(o=l.match(A),o){const[,e,t]=o;return{type:a.TARGET_CHANGE,date:i,time:s,timezone:c,source:e,target:t}}const d=new RegExp("^(".concat(n,")\t(").concat(n,")\t(").concat(n,")"));if(o=l.match(d),!o)return console.error("Invalid log line format:",e),null;const[,M,h,_]=o;return{type:a.DAMAGE,date:i,time:s,timezone:c,target:M,hitsplatName:h,damageAmount:parseInt(_,10)}};function u(e,t){try{const n=e.split("\n");let r=0,o=[];for(const e of n){const a=p(e.trim());if(a&&o.push(a),r++,t&&r%200===0){t(r/n.length*50)}}let c=function(e,t){const n=e.length;let r=0;const o=[];let c,p,u,g=null,A="",d=null;for(const h of e){if(h.type===a.LOGGED_IN_PLAYER&&(A=h.loggedInPlayer),h.type===a.BOOSTED_LEVELS&&(c=h.boostedLevels),h.type===a.PLAYER_EQUIPMENT&&(p=h.playerEquipment),g&&d&&i(h.time)-i(d.time)>6e4&&(g.data=g.data.filter(((e,t)=>t<=d.index)),g.name+=" - Incomplete",g.lastLine=g.data[g.data.length-1],o.push(g),g=null,d=null),!g&&h.type===a.DAMAGE&&m(h)&&h.target!==A){u=l()("".concat(h.date," ").concat(h.time),"MM-DD-YYYY HH:mm:ss.SSS").toDate(),h.fightTime=s(0);const e=[];c&&e.push({type:a.BOOSTED_LEVELS,date:h.date,time:h.time,timezone:h.timezone,boostedLevels:c,fightTime:s(0)}),p&&e.push({type:a.PLAYER_EQUIPMENT,date:h.date,time:h.time,timezone:h.timezone,playerEquipment:p,fightTime:s(0)}),g={name:h.target,enemies:[h.target],data:[...e,h],loggedInPlayer:A,firstLine:h,lastLine:h}}else if(g){"target"in h&&E.includes(h.target)&&g.name!==h.target&&(g.name=h.target),h.type===a.DAMAGE&&m(h)&&h.target!==A&&!g.enemies.includes(h.target)&&g.enemies.push(h.target);const e=l()("".concat(h.date," ").concat(h.time),"MM-DD-YYYY HH:mm:ss.SSS").toDate();h.fightTime=s(e.getTime()-u.getTime()),g.data.push(h)}g&&h.type===a.DAMAGE&&m(h)&&(d={time:h.time,index:g.data.length-1}),h.type===a.DEATH&&h.target&&(!g||h.target!==g.name&&h.target!==g.loggedInPlayer||(g.lastLine=h,o.push(g),g=null)),r++,t&&r%200===0&&t(50+r/n*50)}g&&(g.lastLine=g.data[g.data.length-1],o.push(g));const M=new Map;return o.filter((e=>{if(!e.data.some((e=>e.type===a.DAMAGE&&m(e))))return!1;let t=1;return M.has(e.name)&&(t=M.get(e.name)+1),M.set(e.name,t),e.name="".concat(e.name," - ").concat(t),!0}))}(o,t);return c}catch(n){return console.error("Error parsing file content:",n),null}}var g=n(340);const A=n.n(g)().createInstance({name:"myFightData"});onmessage=e=>{const{type:t,fileContent:n,index:a}=e.data;"parse"===t?function(e){const t=u(e,(e=>{postMessage({type:"progress",progress:e})})),n={fightNames:(null===t||void 0===t?void 0:t.map((e=>e.name)))||[],firstResult:t[0]};postMessage({type:"parseResult",parseResultMessage:n}),A.setItem("fightData",t)}(n):"getItem"===t&&function(e){A.getItem("fightData").then((t=>t&&e>=0&&e<t.length?t[e]:null)).then((e=>{postMessage({type:"item",item:e})})).catch((e=>{console.error("Error getting specific item:",e)}))}(a)}}},t={};function n(a){var r=t[a];if(void 0!==r)return r.exports;var o=t[a]={id:a,loaded:!1,exports:{}};return e[a].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}n.m=e,n.x=()=>{var e=n.O(void 0,[200],(()=>n(3839)));return e=n.O(e)},(()=>{var e=[];n.O=(t,a,r,o)=>{if(!a){var i=1/0;for(E=0;E<e.length;E++){a=e[E][0],r=e[E][1],o=e[E][2];for(var s=!0,c=0;c<a.length;c++)(!1&o||i>=o)&&Object.keys(n.O).every((e=>n.O[e](a[c])))?a.splice(c--,1):(s=!1,o<i&&(i=o));if(s){e.splice(E--,1);var l=r();void 0!==l&&(t=l)}}return t}o=o||0;for(var E=e.length;E>0&&e[E-1][2]>o;E--)e[E]=e[E-1];e[E]=[a,r,o]}})(),n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var a in t)n.o(t,a)&&!n.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},n.f={},n.e=e=>Promise.all(Object.keys(n.f).reduce(((t,a)=>(n.f[a](e,t),t)),[])),n.u=e=>"static/js/"+e+".d42d81b7.chunk.js",n.miniCssF=e=>{},n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),n.p="/",(()=>{var e={220:1};n.f.i=(t,a)=>{e[t]||importScripts(n.p+n.u(t))};var t=self.webpackChunkrunelogs=self.webpackChunkrunelogs||[],a=t.push.bind(t);t.push=t=>{var r=t[0],o=t[1],i=t[2];for(var s in o)n.o(o,s)&&(n.m[s]=o[s]);for(i&&i(n);r.length;)e[r.pop()]=1;a(t)}})(),(()=>{var e=n.x;n.x=()=>n.e(200).then(e)})();n.x()})();
//# sourceMappingURL=220.66054929.chunk.js.map