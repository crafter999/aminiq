import { ParsedUrlQueryInput, stringify } from "querystring";
import { RequestOptions } from "http";
import httpsRequest from "https";
import httpRequest from "http";
import { createWriteStream } from "fs";

export interface GetOptions {
   hostname: string
   port: number
   path: string
   download: boolean
   fileName: string
   https: boolean
   method: string
}

export interface IGetResult {
   data: string;
   response: httpRequest.IncomingMessage
}

export function megaRequest(go: GetOptions, postDataObj: ParsedUrlQueryInput = {}): Promise<IGetResult> {
   return new Promise((resProm, rejProm) => {
      let chunk = "";
      // progress bar vars
      let total = 0;
      let received = 0;
      let postData = ""
      // request stuff
      const options: RequestOptions = {
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
         postData = stringify(postDataObj)

         options.headers!!["Content-Type"] = "application/x-www-form-urlencoded"
         options.headers!!["Content-Length"] = Buffer.byteLength(postData)
      }

      let request = go.https ? httpsRequest.request : httpRequest.request;
      let req = request(options, (res: httpRequest.IncomingMessage) => {
         if (go.download) {
            res.pipe(createWriteStream(go.fileName));
            res.on("end", () => {
               resProm({data: "downloaded", response: res});
            });
            // while getting data calculate and print out the percentage
            res.on("data", (chunk: any) => {
               received += chunk.length;
               // print out the percentage
               process.stdout.write("\r" +
                  Math.floor(received * 100 / total) + "%"
               );
            });
            res.on("error", (e: any) => rejProm(e));
         } else {
            res.setEncoding("utf8");
            res.on("data", (data: any) => {
               // fill the chunk with data
               chunk += data;
            });
            res.on("end", () => resProm({data: chunk.toString(), response: res}));
            res.on("error", (e: any) => rejProm(e));
         }
      });
      req.setTimeout(10000)
      // get the total size for the progress bar
      if (go.download) {
         req.on("response", (data: any) => {
            total = data.headers["content-length"];
         });
      }
      req.on("error", (e: any) => {
         rejProm(e);
      });
      req.on("timeout", (e: any) => rejProm(new Error(
         `Connection to ${go.hostname}:${go.port}${go.path} timed out`
      )));

      if (options.method === "POST") {
         // Write data to request body
         req.write(postData);
      }

      req.end();
   });
}