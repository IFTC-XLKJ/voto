window.workId = ""
const isNew = () => {
    return /^__.*__$/.test(workId)
}

addEventListener("load", () => {
    preview.style.width = `${innerWidth}px`
    preview.style.height = `${(innerWidth / 16) * 9}px`
    const ctx = preview.getContext("2d");
    addEventListener("message", e => {
        if (e.data.origin == "editor" || typeof e.data != "string") {
            console.log("preview", e.data)
            if (e.data.type) {
                console.log(e.data)
                if (e.data.type == "init") {
                    workId = e.data.workId
                    location.search = `?workId=${workId}`
                    postMessage({
                        type: "reply",
                        success: true,
                        origin: "preview",
                    })
                }
                if (e.data.type === "reply") {
                    if (e.data.success) {
                        console.log("success")
                    } else {
                        console.log("fail")
                    }
                }
                if (e.data.type == "run") {
                    preview.dataset.operation = "run"
                    postMessage({
                        type: "reply",
                        workId: workId,
                        success: true,
                        origin: "preview",
                    })
                    postMessage({
                        type: "log",
                        data: "已收到运行指令",
                        origin: "preview",
                    })
                }
                if (e.data.type == "stop") {
                    preview.dataset.operation = "edit"
                    postMessage({
                        type: "reply",
                        workId: workId,
                        success: true,
                        origin: "preview",
                    })
                    postMessage({
                        type: "log",
                        data: "已收到停止指令",
                        origin: "preview",
                    })
                }
                if (e.data.type == "addRole") {
                    addRole(e.data.url, e.data.x, e.data.y, e.data.w, e.data.h)
                    postMessage({
                        type: "log",
                        data: "addRole",
                        origin: "preview",
                    })
                    postMessage({
                        type: "reply",
                        success: true,
                        origin: "preview",
                    })
                }
            }
        }
    })
    function addRole(url, x, y, w, h) {
        var img = new Image();
        img.onload = function () {
            ctx.drawImage(img, x, y, w, h);
        };
        img.src = url;
    }
})

addEventListener("resize", () => {
    preview.style.width = `${innerWidth}px`
    preview.style.height = `${(innerWidth / 16) * 9}px`
})