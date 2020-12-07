## AMINIQ

Another asynchronous mini request client for **Node.js** with 0 dependencies.


## Install
``npm install aminiq``

## Example
```typescript
import {aminiq} from "aminiq"

(async ()=>{
   let ip = await aminiq({
      hostname: "ipinfo.io",
      path: "/ip",
      method: "GET",
      port: 443,
      fileName: "",
      download: false,
      https: true
   })

   let ip2 = await aminiq("https://ipinfo.io/ip")

   console.log(ip.data)
   console.log(ip2.data)
})()
```