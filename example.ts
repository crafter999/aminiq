import {megaRequest} from "./index"

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