import {aminiq} from "./index"

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

   console.log(ip.data)
})()