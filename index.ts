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
   method: string,
   headers?: any
}

export interface IGetResult {
   data: string;
   response: httpRequest.IncomingMessage
}

export function aminiq(go: GetOptions | string, postDataObj: ParsedUrlQueryInput = {}): Promise<IGetResult> {
   return new Promise((resProm, rejProm) => {
      let opts: GetOptions = typeof go === "string" ? {} as GetOptions : go
      if (typeof go === "string"){
         const parsedUrl = new URL(go)
         if (parsedUrl.protocol.includes("https:")){
            opts.https = true
            opts.port = 443
            
         } else if (parsedUrl.protocol.includes("http:")){
            opts.https = false
            opts.port = 80
         }
         if (parsedUrl.port !==""){
            opts.port = parseInt(parsedUrl.port)
         }
         opts.hostname = parsedUrl.hostname
         opts.path = parsedUrl.pathname + parsedUrl.search
         opts.method = Object.keys(postDataObj).length === 0 ? "GET" : "POST"
         opts.download = false
         opts.fileName = ""
      }

      let chunk = "";
      // progress bar vars
      let total = 0;
      let received = 0;
      let postData = ""


      if (!opts.headers){
         opts.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0"
         }
      }

      // request stuff
      const options: RequestOptions = {
         hostname: opts.hostname,
         port: opts.port,
         path: opts.path,
         method: opts.method,
         timeout: 10000,
         headers: opts.headers
      };

      // support POST
      if (options.method === "POST") {
         postData = stringify(postDataObj)

         // TODO: don't override
         options.headers!!["Content-Type"] = "application/x-www-form-urlencoded"
         options.headers!!["Content-Length"] = Buffer.byteLength(postData)
      }

      let request = opts.https ? httpsRequest.request : httpRequest.request;
      let req = request(options, (res: httpRequest.IncomingMessage) => {
         if (opts.download) {
            res.pipe(createWriteStream(opts.fileName));
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
      if (opts.download) {
         req.on("response", (data: any) => {
            total = data.headers["content-length"];
         });
      }
      req.on("error", (e: any) => {
         rejProm(e);
      });
      req.on("timeout", (e: any) => rejProm(new Error(
         `Connection to ${opts.hostname}:${opts.port}${opts.path} timed out`
      )));

      if (options.method === "POST") {
         // Write data to request body
         req.write(postData);
      }

      req.end();
   });
}