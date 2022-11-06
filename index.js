const {
    app: app,
    BrowserWindow: BrowserWindow
} = require("electron");
const createWindow = () => {
    let window = new BrowserWindow({
        titleBarStyle: "defaut",
        title: "Proxy Checker",
        frame: !0,
        width: 1e3,
        height: 600,
        resizable: !1,
        icon: __dirname + "\\img\\351-01-1024-13999035.png",
        show: !0,
        autoHideMenuBar: !0,
        webPreferences: {
            nodeIntegration: !0,
            contextIsolation: !1,
            enableRemoteModule: !0
        }
    });
    window.loadFile("src/index.html")
    window.on("closed", (() => {
        window = null
    }))
};
app.on("ready", createWindow), app.on("window-all-closed", (() => {
    if ("darwin" !== process.platform) return app.quit()
})), app.on("activate", (() => {
    if (null === win) return createWindow()
}));