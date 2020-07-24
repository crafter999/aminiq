## AMINIQ

Another asynchronous mini request client for **Node.js** with 0 dependencies.


## Install
``npm install aminiq``

## Example
```typescript
import {megaRequest} from "aminiq"

(async ()=>{
   let ip = await megaRequest({
      hostname: "ipinfo.io",
      path: "/ip",
      method: "GET",
      port: 443,
      fileName: "",
      download: false,
      https: true
   })

   console.log(ip.data)
})()
```