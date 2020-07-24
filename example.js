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
    console.log(ip.data);
})();
