"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = require("querystring");
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const fs_1 = require("fs");
function megaRequest(go, postDataObj = {}) {
    return new Promise((resProm, rejProm) => {
        let chunk = "";
        // progress bar vars
        let total = 0;
        let received = 0;
        let postData = "";
        // request stuff
        const options = {
            hostname: go.hostname,
            port: go.port,
            path: go.path,
            method: go.method,
            timeout: 10000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0"
            }
        };
        // support POST
        if (options.method === "POST") {
            postData = querystring_1.stringify(postDataObj);
            options.headers["Content-Type"] = "application/x-www-form-urlencoded";
            options.headers["Content-Length"] = Buffer.byteLength(postData);
        }
        let request = go.https ? https_1.default.request : http_1.default.request;
        let req = request(options, (res) => {
            if (go.download) {
                res.pipe(fs_1.createWriteStream(go.fileName));
                res.on("end", () => {
                    resProm({ data: "downloaded", response: res });
                });
                // while getting data calculate and print out the percentage
                res.on("data", (chunk) => {
                    received += chunk.length;
                    // print out the percentage
                    process.stdout.write("\r" +
                        Math.floor(received * 100 / total) + "%");
                });
                res.on("error", (e) => rejProm(e));
            }
            else {
                res.setEncoding("utf8");
                res.on("data", (data) => {
                    // fill the chunk with data
                    chunk += data;
                });
                res.on("end", () => resProm({ data: chunk.toString(), response: res }));
                res.on("error", (e) => rejProm(e));
            }
        });
        req.setTimeout(10000);
        // get the total size for the progress bar
        if (go.download) {
            req.on("response", (data) => {
                total = data.headers["content-length"];
            });
        }
        req.on("error", (e) => {
            rejProm(e);
        });
        req.on("timeout", (e) => rejProm(new Error(`Connection to ${go.hostname}:${go.port}${go.path} timed out`)));
        if (options.method === "POST") {
            // Write data to request body
            req.write(postData);
        }
        req.end();
    });
}
exports.megaRequest = megaRequest;
