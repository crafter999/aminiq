## AMINIQ

Another asynchronous mini request client for **Node.js** with 0 dependencies.


## Install
``npm install aminiq``

## Example GET
```typescript
import {aminiq} from "aminiq"

(async ()=>{
   // use object....
   let ip = await aminiq({
      hostname: "ipinfo.io",
      path: "/ip",
      method: "GET",
      port: 443,
      fileName: "",
      download: false,
      https: true
   })

   // ...or just a string
   let ip2 = await aminiq("https://ipinfo.io/ip")

   console.log(ip.data)
   console.log(ip2.data)
})()
```

## Example POST
```typescript
aminiq({
   // options
   download: false,
   fileName: "",
   hostname: this.hostname,
   https: true,
   method: this.method,
   path: this.url,
   port: 443,
   headers: this.headers
   },{
      // post data
      "param1": "value",
      "param2": "value",
      "param3": "value"
   }
})
```

## Notes
- Post requests only work with `application/x-www-form-urlencoded`