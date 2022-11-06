const request = require("request"),
    urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi,
    proxyRegex = /([0-9A-F]{0,4}\:[0-9A-F]{0,4}\:[0-9A-F]{0,4}\:[0-9A-F]{0,4}\:[0-9A-F]{0,4}\:[0-9A-F]{0,4}\:[0-9A-F]{0,4}\:[0-9A-F]{0,4}|([0-9]{1,2}|1[0-9]{1,2}|2[0-5]{2})\.([0-9]{1,2}|1[0-9]{1,2}|2[0-5]{2})\.([0-9]{1,2}|1[0-9]{1,2}|2[0-5]{2})\.([0-9]{1,2}|1[0-9]{1,2}|2[0-5]{2}))\:([0-9]{1,5})/gi,
    check = (list, t) => {
        var types = ["http", "https", "socks4", "socks5"],
            urls = ["https://www.fbi.gov/", "https://www.nsa.gov/", "https://www.cia.gov/", "https://www.nasa.gov", "https://www.usa.gov/", "https://www.defense.gov/"],
            outputA = document.getElementById("outputA"), outputB = document.getElementById("outputB");
        t < 3 && (types = [types[t]]), list.match(proxyRegex) ? types.forEach((type => {
            list.match(proxyRegex).forEach((proxy => {
                if (Number(proxy.split("").reverse().join("").split(":")[0].split("").reverse().join("")) <= 65535) {
                    const {country: country,city: city} = require("geoip-lite").lookup(proxy.split("").reverse().join("").split(":").slice(1).join(":").split("").reverse().join("")), url = urls[Math.floor(Math.random() * urls.length)];
                    require("throttled-queue")(15, 1e3)(function () {
                        request({url: String(url),method: "GET",proxy: String(`${type}://${proxy}`)}, ((err, res) => {
                            var response = {type: type,proxy: proxy,url: url,country: country,city: city,status: null,valid: null};
                            err ? (response.status = 500, response.valid = !1, outputA.value += `${JSON.stringify(response)}\n`) : 200 == res.statusCode ? (response.status = res.statusCode, response.valid = !0, outputA.value += `${JSON.stringify(response)}\n`, outputB.value += proxy + "\n") : (response.status = res.statusCode, response.valid = !1, outputA.value += `${JSON.stringify(response)}\n`)
                            outputA.scrollTop = outputA.scrollHeight, inputB.scrollTop = inputB.scrollHeight
                        }))
                    })
                } else (outputA.value += `${JSON.stringify({type:type,proxy:proxy,error:"Invalid Port."})}\n`,outputA.scrollTop = outputA.scrollHeight)
            }))
        })) : (outputA.value = `${JSON.stringify({error:"No valid proxy was found."})}\n`, outputA.scrollTop = outputA.scrollHeight)
    },
    scrap = list => {
        inputB = document.getElementById("inputB"), outputA = document.getElementById("outputA");
        list.match(urlRegex) ? list.match(urlRegex).forEach((url => {
            request({url: String(url),method: "GET"}, ((err, res, body) => {
                if (err) outputA.value += `${JSON.stringify({url:url,status:500,error:!0,found:0})}\n`;
                else if (body && body.match(proxyRegex)) {
                    const proxys = body.match(proxyRegex);
                    inputB.value += proxys.join("\n"), outputA.value += `${JSON.stringify({url:url,status:res.statusCode,error:!1,found:proxys.length})}\n`
                }
                outputA.scrollTop = outputA.scrollHeight, inputB.scrollTop = inputB.scrollHeight
            }))
        })) : (outputA.value = `${JSON.stringify({error:"No valid proxy was found."})}\n`,outputA.scrollTop = outputA.scrollHeight)
    };