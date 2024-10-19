window.workId = ""
const isNew = () => {
    return /^__.*__$/.test(workId)
}
window.message = {
    time: Date.now(),
}
window.parentWindow = parent || top
const sendMessage = (data) => {
    parentWindow.message = data
}
window.workdata = {}
addEventListener("load", () => {
    preview.style.width = `${innerWidth}px`
    preview.style.height = `${(innerWidth / 16) * 9}px`
    const ctx = preview.getContext("2d");
    function Processing(e) {
        console.log("preview", e)
        if (e.type == "init") {
            workId = e.workId
            location.search = `?workId=${workId}`
            sendMessage({
                type: "reply",
                success: true,
                origin: "preview",
            })
        }
        if (e.type === "reply") {
            if (e.data.success) {
                console.log("success")
            } else {
                console.log("fail")
            }
        }
        if (e.type == "run") {
            preview.dataset.operation = "run"
            sendMessage({
                type: "reply",
                workId: workId,
                success: true,
                origin: "preview",
            })
            workdata = parentWindow.workdata;
            parentWindow.Csl.log("已收到运行指令")
            const roles = workdata.roleData;
            ctx.clearRect(0, 0, preview.width, preview.height);
            roles.forEach(async role => {
                await addRole(role.Keyframes[0].url, role.x, role.y, role.w, role.h)
                console.log(role)
            });
            let code = e.data.code
            code = "const events = new Events();\n" + code
            code += "\n\n" + `events.emit("when_start");`
            code = "const parentWindow = parent || top;\n" + code
            eval(code)
            console.log(code)
        }
        if (e.type == "stop") {
            preview.dataset.operation = "edit"
            sendMessage({
                type: "reply",
                workId: workId,
                success: true,
                origin: "preview",
            })
            parentWindow.Csl.log("已收到停止指令")
            ctx.clearRect(0, 0, preview.width, preview.height);
        }
        if (e.type == "addRole") {
            addRole(e.url, e.x, e.y, e.w, e.h)
            sendMessage({
                type: "log",
                data: "addRole",
                origin: "preview",
            })
            sendMessage({
                type: "reply",
                success: true,
                origin: "preview",
            })
        }
    }
    function addRole(url, x, y, w, h) {
        var img = new Image();
        img.onload = function () {
            ctx.drawImage(img, x, y, w, h);
            console.log(img)
            parentWindow.document.body.appendChild(img)
            return Promise((resolve, reject) => {
                resolve(img)
            });
        };
        img.src = url;
    }
    let last = message;
    setInterval(() => {
        if (last != message) {
            last = message
            console.log("preview meassge changed")
            Processing(message)
        }
    })
})

addEventListener("resize", () => {
    preview.style.width = `${innerWidth}px`
    preview.style.height = `${(innerWidth / 16) * 9}px`
})