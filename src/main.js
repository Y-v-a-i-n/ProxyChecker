const request = require("request"),
    geoip = require("geoip-lite"),
    check = (list, t) => {
        var types = ["http", "https", "socks4", "socks5"],
            urls = ["https://www.fbi.gov/", "https://www.nsa.gov/", "https://www.cia.gov/", "https://www.nasa.gov", "https://www.usa.gov/", "https://www.defense.gov/"];
        proxyRegex = /([0-9A-F]{0,4}\:[0-9A-F]{0,4}\:[0-9A-F]{0,4}\:[0-9A-F]{0,4}\:[0-9A-F]{0,4}\:[0-9A-F]{0,4}\:[0-9A-F]{0,4}\:[0-9A-F]{0,4}|([0-9]{1,2}|1[0-9]{1,2}|2[0-5]{2})\.([0-9]{1,2}|1[0-9]{1,2}|2[0-5]{2})\.([0-9]{1,2}|1[0-9]{1,2}|2[0-5]{2})\.([0-9]{1,2}|1[0-9]{1,2}|2[0-5]{2}))\:([0-9]{1,5})/gi, t < 3 && (types = [types[t]]), list.match(proxyRegex) ? (document.getElementById("outputA").value = "", document.getElementById("outputB").value = "", types.forEach((type => {
            list.match(proxyRegex).forEach((proxy => {
                if (Number(proxy.split("").reverse().join("").split(":")[0].split("").reverse().join("")) <= 65535) {
                    const {country,city} = geoip.lookup(proxy.split("").reverse().join("").split(":").slice(1).join(":").split("").reverse().join("")), url = urls[Math.floor(Math.random() * urls.length)];
                    require("throttled-queue")(15, 1e3)((function () {
                        request({url: String(url),method: "GET",proxy: String(`${type}://${proxy}`)}, ((err, res) => {
                            var response = {type: type,proxy: proxy,url: url,country: country,city: city,status: null,valid: null};
                            err ? (response.status = 500, response.valid = !1, document.getElementById("outputA").value += `${JSON.stringify(response)}\n`) : 200 == res.statusCode ? (response.status = res.statusCode, response.valid = !0, document.getElementById("outputA").value += `${JSON.stringify(response)}\n`, document.getElementById("outputB").value += proxy + "\n") : (response.status = res.statusCode, response.valid = !1, document.getElementById("outputA").value += `${JSON.stringify(response)}\n`)
                        }))
                    }))
                } else document.getElementById("outputA").value += `${JSON.stringify({type: type,proxy: proxy,error: "Invalid Port."})}\n`
            }))
        }))) : (msg = "No valid proxy was found.",document.getElementById("outputA").value = msg, document.getElementById("outputB").value = msg)
    };