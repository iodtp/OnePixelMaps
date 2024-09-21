// ==UserScript==
// @name         1pxMapGetter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show 1 pixel per tile version of maps
// @author       Iodized Salt
// @match        https://tagpro.koalabeast.com/mapGetter/*
// ==/UserScript==

(function() {
    'use strict';
    const header = document.getElementById('header');

    document.body.innerHTML = '';
    document.body.appendChild(header);
    let urlparts = window.location.href.split('/');
    const map = urlparts[urlparts.length-1];

    fetch("https://tagpro.koalabeast.com/replays/data?page=0&pageSize=1&mapName="+map)
        .then((response) => response.json())
        .then((json) => {
        const userId = json.userId;
        const id = json.games[0].id;
        getData(id, userId);
    });



})();
function getData(id, userId){
    const replayUrl = "https://tagpro.koalabeast.com/game?replay=" + replayKey(id, userId);
    const tagproWindow = window.open(replayUrl, '_blank');

    window.addEventListener('message', function(event) {
        if (event.data && event.data.map) {
            tagproWindow.close();
        }
        makeImage(event.data.map);
    });
}
function replayKey(e, t) { //e = id, t = userId
    return btoa((e + (t || "")).match(/\w{2}/g).map((e => String.fromCharCode(parseInt(e, 16)))).join("")).replaceAll("+", "_");
}
function makeImage(map) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = map.length;
    canvas.height = map[0].length;
    const tileColors = {
        0: "#000000", // Empty space
        1: "#8B8B8B", // Square Wall
        1.1: "#A9A9A9", // 45 degree wall (◣)
        1.2: "#A9A9A9", // 45 degree wall (◤)
        1.3: "#A9A9A9", // 45 degree wall (◥)
        1.4: "#A9A9A9", // 45 degree wall (◢)
        2: "#D3D3D3", // Regular floor
        3: "#FF0000", // Red flag
        3.1: "#FF7F7F", // Red flag (taken)
        4: "#0000FF", // Blue flag
        4.1: "#7F7FFF", // Blue flag (taken)
        5: "#f0e929", // Speedpad (active)
        5.1: "#f0e929", // Speedpad (inactive)
        5.11: "#f0e929", // Speedpad (respawn warning)
        6: "#FFA500", // Powerup subgroup
        6.1: "#FFD700", // Jukejuice/grip
        6.11: "#FFBFFF", // Jukejuice/grip (respawn warning)
        6.12: "#FFBFFF", // Jukejuice/grip (preview)
        6.2: "#8B0000", // Rolling bomb
        6.21: "#CD5C5C", // Rolling bomb (respawn warning)
        6.22: "#FF6347", // Rolling bomb (preview)
        6.3: "#FF4500", // TagPro
        6.31: "#FF6347", // TagPro (respawn warning)
        6.32: "#FF6347", // TagPro (preview)
        6.4: "#00FF7F", // Max speed
        6.41: "#ADFF2F", // Max speed (respawn warning)
        6.42: "#ADFF2F", // Max speed (preview)
        7: "#020714", // Spike
        8: "#3b2215", // Button
        9: "#434445", // Inactive gate
        9.1: "#228B22", // Green gate
        9.2: "#FF0000", // Red gate
        9.3: "#0000FF", // Blue gate
        10: "#09112b", // Bomb
        10.1: "#09112b", // Inactive bomb
        10.11: "#09112b", // Bomb (respawn warning)
        11: "#eb5255", // Red teamtile
        12: "#3473fa", // Blue teamtile
        13: "#FFD700", // Active portal
        13.1: "#A9A9A9", // Inactive portal
        13.11: "#FFBFFF", // Inactive portal (respawn warning)
        24: "#FF4500", // Active red portal
        24.1: "#A9A9A9", // Inactive red portal
        24.11: "#FFBFFF", // Inactive red portal (respawn warning)
        25: "#0000FF", // Active blue portal
        25.1: "#A9A9A9", // Inactive blue portal
        25.11: "#FFBFFF", // Inactive blue portal (respawn warning)
        14: "#d65e56", // Speedpad (red) (active)
        14.1: "#d65e56", // Speedpad (red) (inactive)
        14.11: "#d65e56", // Speedpad (red) (respawn warning)
        15: "#6498d9", // Speedpad (blue) (active)
        15.1: "#6498d9", // Speedpad (blue) (inactive)
        15.11: "#6498d9", // Speedpad (blue) (respawn warning)
        16: "#FFFF00", // Yellow flag
        16.1: "#FFD700", // Yellow flag (taken)
        17: "#e3818e", // Red endzone
        18: "#6e9cff", // Blue endzone
        19: "#FF4500", // Red potato
        19.1: "#FF6347", // Red potato taken
        20: "#0000FF", // Blue potato
        20.1: "#7F7FFF", // Blue potato taken
        21: "#FFFF00", // Yellow potato
        21.1: "#FFD700", // Yellow potato taken
        22: "#A9A9A9", // Gravity well
        23: "#FFFF00", // Yellow teamtile
        "redball": "#FF0000", // Red ball
        "blueball": "#0000FF", // Blue ball
        "redflag": "#FF0000", // Red flag shown on FC and under score
        "blueflag": "#0000FF", // Blue flag shown on FC and under score
        "marsball": "#FFA500" // Mars Ball
    };

    document.body.appendChild(canvas);

    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[x].length; y++) {
            const tileValue = map[x][y];
            const color = tileColors[tileValue];

            ctx.fillStyle = color || "#FFFFFF"; // default to white if color is not found
            ctx.fillRect(x, y, 1, 1);
        }
    }
}
