"use strict";var precacheConfig=[["./index.html","17023d17db3ff79a0f917b77d480f321"],["./static/css/main.b8f04e00.css","81fb73576dc2842d3743241a5ea70322"],["./static/js/main.facf2a3f.js","bc2256d653f44f7a1f1e5ae38f1c30f6"],["./static/media/fa-brands-400.6814d0e8.woff2","6814d0e8136d34e313623eb7129d538e"],["./static/media/fa-brands-400.83e6c29f.svg","83e6c29fb363b2f0ea6cc18fefff729c"],["./static/media/fa-brands-400.da408238.woff","da408238128b876cbda6424391f1566f"],["./static/media/fa-brands-400.e8019d50.eot","e8019d507e8cb51d169ab4f94a0cda12"],["./static/media/fa-brands-400.fdf44bc4.ttf","fdf44bc43e8fa2358bbb7d9165d78455"],["./static/media/fa-regular-400.8d220c79.ttf","8d220c793e2612bd131ed8522c54669f"],["./static/media/fa-regular-400.8d9ab84b.woff2","8d9ab84bfe87a3f77112a6698cf639fb"],["./static/media/fa-regular-400.ba2a91dc.svg","ba2a91dc95e6cfdc4b2a186a7ba83e29"],["./static/media/fa-regular-400.dad90637.woff","dad90637f797356bbc70d2664832e0b6"],["./static/media/fa-regular-400.e6c93cb4.eot","e6c93cb47e716b579264a5fdfbf7e84d"],["./static/media/fa-solid-900.132e9759.ttf","132e9759d93e4eefd7cdde0d7a322991"],["./static/media/fa-solid-900.2d0415fa.woff","2d0415fa29ea596b7a02c78eddeede20"],["./static/media/fa-solid-900.b75b4bfe.woff2","b75b4bfe0d58faeced5006c785eaae23"],["./static/media/fa-solid-900.de1d242d.svg","de1d242d8acb26ec43c0d071fe78e72d"],["./static/media/fa-solid-900.ea363ed4.eot","ea363ed422723673917901680be9b37c"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var a=new URL(e);return"/"===a.pathname.slice(-1)&&(a.pathname+=t),a.toString()},cleanResponse=function(t){return t.redirected?("body"in t?Promise.resolve(t.body):t.blob()).then(function(e){return new Response(e,{headers:t.headers,status:t.status,statusText:t.statusText})}):Promise.resolve(t)},createCacheKey=function(e,t,a,n){var r=new URL(e);return n&&r.pathname.match(n)||(r.search+=(r.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(a)),r.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var a=new URL(t).pathname;return e.some(function(e){return a.match(e)})},stripIgnoredUrlParameters=function(e,a){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(t){return a.every(function(e){return!e.test(t[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],a=e[1],n=new URL(t,self.location),r=createCacheKey(n,hashParamName,a,/\.\w{8}\./);return[n.toString(),r]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(n){return setOfCachedUrls(n).then(function(a){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!a.has(t)){var e=new Request(t,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+t+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return n.put(t,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var a=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(t){return t.keys().then(function(e){return Promise.all(e.map(function(e){if(!a.has(e.url))return t.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(t){if("GET"===t.request.method){var e,a=stripIgnoredUrlParameters(t.request.url,ignoreUrlParametersMatching),n="index.html";(e=urlsToCacheKeys.has(a))||(a=addDirectoryIndex(a,n),e=urlsToCacheKeys.has(a));var r="./index.html";!e&&"navigate"===t.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],t.request.url)&&(a=new URL(r,self.location).toString(),e=urlsToCacheKeys.has(a)),e&&t.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(a)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',t.request.url,e),fetch(t.request)}))}});