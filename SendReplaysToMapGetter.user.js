// ==UserScript==
// @name         SendReplaysToMapGetter
// @namespace    http://tampermonkey.net/
// @version      2024-09-21
// @description  Send map data to other tab
// @author       Iodized Salt
// @match        https://tagpro.koalabeast.com/game?replay=*
// ==/UserScript==

tagpro.ready( function waitForMap() {
    if (!tagpro.map) {
        return setTimeout(waitForMap, 100);
    }
    window.opener.postMessage({ map: tagpro.map }, "*");
});
