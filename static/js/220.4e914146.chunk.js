(()=>{"use strict";var e={3839:(e,t,n)=>{let r=function(e){return e.LOG_VERSION="Log Version",e.LOGGED_IN_PLAYER="Logged In Player",e.BOOSTED_LEVELS="Boosted Levels",e.PLAYER_EQUIPMENT="Player Equipment",e.DEATH="Death",e.TARGET_CHANGE="Target Change",e.DAMAGE="Damage",e}({});let a=function(e){return e[e.BLOCK_ME=12]="BLOCK_ME",e[e.DAMAGE_ME=16]="DAMAGE_ME",e[e.DAMAGE_ME_CYAN=18]="DAMAGE_ME_CYAN",e[e.DAMAGE_ME_ORANGE=20]="DAMAGE_ME_ORANGE",e[e.DAMAGE_ME_YELLOW=22]="DAMAGE_ME_YELLOW",e[e.DAMAGE_ME_WHITE=24]="DAMAGE_ME_WHITE",e[e.SPLASH_ME=69]="SPLASH_ME",e}({}),o=function(e){return e[e.DAMAGE_MAX_ME=43]="DAMAGE_MAX_ME",e[e.DAMAGE_MAX_ME_CYAN=44]="DAMAGE_MAX_ME_CYAN",e[e.DAMAGE_MAX_ME_ORANGE=45]="DAMAGE_MAX_ME_ORANGE",e[e.DAMAGE_MAX_ME_YELLOW=46]="DAMAGE_MAX_ME_YELLOW",e[e.DAMAGE_MAX_ME_WHITE=47]="DAMAGE_MAX_ME_WHITE",e}({});const i=e=>{const[t,n,r]=e.split(":").map(Number);return 36e5*t+6e4*n+1e3*r};function s(e){const t=Math.floor(e%1e3);let n=Math.floor(e/1e3%60),r=Math.floor(e/6e4%60),a=Math.floor(e/36e5%24);a=a<10?"0"+a:a,r=r<10?"0"+r:r,n=n<10?"0"+n:n;return a+":"+r+":"+n+"."+(t<10?"00"+t:t<100?"0"+t:t)}const c=["Scurrius","Kree'arra","Commander Zilyana","General Graardor","K'ril Tsutsaroth","Nex","Kalphite Queen","Sarachnis","Scorpia","Abyssal Sire","Kraken"];function l(e){return Object.values(a).includes(e.hitsplatName)||Object.values(o).includes(e.hitsplatName)||"BLOCK_ME"===e.hitsplatName}const E=e=>{const t=".*",n="[^\\t]*",a=new RegExp("^(".concat("\\d{2}-\\d{2}-\\d{4}",") (").concat("\\d{2}:\\d{2}:\\d{2}\\.\\d{3}",") (").concat("\\w+",")\t(").concat(t,")"));let o=e.match(a);if(!o)return console.error("Invalid log line format:",e),null;const[,i,s,c,l]=o,E=new RegExp("Log Version (".concat(t,")"));if(o=l.match(E),o){const[,e]=o;return console.log("Log Version ".concat(e)),{type:r.LOG_VERSION,date:i,time:s,timezone:c,logVersion:e}}const p=new RegExp("Logged in player is (".concat(t,")"));if(o=l.match(p),o){const[,e]=o;return{type:r.LOGGED_IN_PLAYER,date:i,time:s,timezone:c,loggedInPlayer:e}}const u=new RegExp("Boosted levels are \\[(\\d+), (\\d+), (\\d+), (\\d+), (\\d+), (\\d+), (\\d+)\\]");if(o=l.match(u),o){const[,e,t,n,a,l,E,p]=o.map(Number);return{type:r.BOOSTED_LEVELS,date:i,time:s,timezone:c,boostedLevels:{attack:e,strength:t,defence:n,ranged:a,magic:l,hitpoints:E,prayer:p}}}const m=new RegExp("Player equipment is (".concat(t,")"));if(o=l.match(m),o){const[,e]=o,t=JSON.parse(e).map((e=>e.toString()));return{type:r.PLAYER_EQUIPMENT,date:i,time:s,timezone:c,playerEquipment:t}}const g=new RegExp("^(".concat(t,") dies"));if(o=l.match(g),o){const[,e]=o;return{type:r.DEATH,date:i,time:s,timezone:c,target:e}}const A=new RegExp("^(".concat(t,") changes target to (").concat(t,")"));if(o=l.match(A),o){const[,e,t]=o;return{type:r.TARGET_CHANGE,date:i,time:s,timezone:c,source:e,target:t}}const d=new RegExp("^(".concat(n,")\t(").concat(n,")\t(").concat(n,")"));if(o=l.match(d),!o)return console.error("Invalid log line format:",e),null;const[,M,_,f]=o;return{type:r.DAMAGE,date:i,time:s,timezone:c,target:M,hitsplatName:_,damageAmount:parseInt(f,10)}};function p(e,t){try{const n=e.split("\n");let a=0,o=[];for(const e of n){const r=E(e.trim());if(r&&o.push(r),a++,t&&a%200===0){t(a/n.length*50)}}let p=function(e,t){const n=e.length;let a=0;const o=[];let E,p,u=null,m="",g=null,A=0;for(const d of e){if(d.type===r.LOGGED_IN_PLAYER&&(m=d.loggedInPlayer),d.type===r.BOOSTED_LEVELS&&(E=d.boostedLevels),d.type===r.PLAYER_EQUIPMENT&&(p=d.playerEquipment),u&&g&&i(d.time)-i(g.time)>6e4&&(u.data=u.data.filter(((e,t)=>t<=g.index)),u.name+=" - Incomplete",u.lastLine=u.data[u.data.length-1],o.push(u),u=null,g=null),!u&&d.type===r.DAMAGE&&l(d)&&d.target!==m){A=i(d.time),d.fightTime=s(0);const e=[];E&&e.push({type:r.BOOSTED_LEVELS,date:d.date,time:d.time,timezone:d.timezone,boostedLevels:E,fightTime:s(0)}),p&&e.push({type:r.PLAYER_EQUIPMENT,date:d.date,time:d.time,timezone:d.timezone,playerEquipment:p,fightTime:s(0)}),u={name:d.target,enemies:[d.target],data:[...e,d],loggedInPlayer:m,firstLine:d,lastLine:d}}else if(u){"target"in d&&c.includes(d.target)&&u.name!==d.target&&(u.name=d.target),d.type===r.DAMAGE&&l(d)&&d.target!==m&&!u.enemies.includes(d.target)&&u.enemies.push(d.target);const e=i(d.time);d.fightTime=s(e-A),u.data.push(d)}u&&d.type===r.DAMAGE&&l(d)&&(g={time:d.time,index:u.data.length-1}),d.type===r.DEATH&&d.target&&(!u||d.target!==u.name&&d.target!==u.loggedInPlayer||(u.lastLine=d,o.push(u),u=null)),a++,t&&a%200===0&&t(50+a/n*50)}return u&&(u.lastLine=u.data[u.data.length-1],o.push(u)),o.filter((e=>e.data.some((e=>e.type===r.DAMAGE&&l(e)))))}(o,t);return p}catch(n){return console.error("Error parsing file content:",n),null}}var u=n(340);const m=n.n(u)().createInstance({name:"myFightData"});onmessage=e=>{const{type:t,fileContent:n,index:r}=e.data;"parse"===t?function(e){const t=p(e,(e=>{postMessage({type:"progress",progress:e})})),n={fightNames:(null===t||void 0===t?void 0:t.map((e=>e.name)))||[],firstResult:t[0]};postMessage({type:"parseResult",parseResultMessage:n}),m.setItem("fightData",t)}(n):"getItem"===t&&function(e){m.getItem("fightData").then((t=>t&&e>=0&&e<t.length?t[e]:null)).then((e=>{postMessage({type:"item",item:e})})).catch((e=>{console.error("Error getting specific item:",e)}))}(r)}}},t={};function n(r){var a=t[r];if(void 0!==a)return a.exports;var o=t[r]={exports:{}};return e[r](o,o.exports,n),o.exports}n.m=e,n.x=()=>{var e=n.O(void 0,[340],(()=>n(3839)));return e=n.O(e)},(()=>{var e=[];n.O=(t,r,a,o)=>{if(!r){var i=1/0;for(E=0;E<e.length;E++){r=e[E][0],a=e[E][1],o=e[E][2];for(var s=!0,c=0;c<r.length;c++)(!1&o||i>=o)&&Object.keys(n.O).every((e=>n.O[e](r[c])))?r.splice(c--,1):(s=!1,o<i&&(i=o));if(s){e.splice(E--,1);var l=a();void 0!==l&&(t=l)}}return t}o=o||0;for(var E=e.length;E>0&&e[E-1][2]>o;E--)e[E]=e[E-1];e[E]=[r,a,o]}})(),n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.f={},n.e=e=>Promise.all(Object.keys(n.f).reduce(((t,r)=>(n.f[r](e,t),t)),[])),n.u=e=>"static/js/"+e+".5989bce5.chunk.js",n.miniCssF=e=>{},n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.p="/",(()=>{var e={220:1};n.f.i=(t,r)=>{e[t]||importScripts(n.p+n.u(t))};var t=self.webpackChunkrunelogs=self.webpackChunkrunelogs||[],r=t.push.bind(t);t.push=t=>{var a=t[0],o=t[1],i=t[2];for(var s in o)n.o(o,s)&&(n.m[s]=o[s]);for(i&&i(n);a.length;)e[a.pop()]=1;r(t)}})(),(()=>{var e=n.x;n.x=()=>n.e(340).then(e)})();n.x()})();
//# sourceMappingURL=220.4e914146.chunk.js.map