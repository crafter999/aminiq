"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
(async () => {
    let ip = await index_1.aminiq({
        hostname: "ipinfo.io",
        path: "/ip",
        method: "GET",
        port: 443,
        fileName: "",
        download: false,
        https: true
    });
    let ip2 = await index_1.aminiq("https://ipinfo.io/ip");
    console.log(ip.data);
    console.log(ip2.data);
})();
