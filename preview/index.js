window.workId = ""
const isNew = () => {
    return /^__.*__$/.test(workId)
}
window.message = {
    time: Date.now(),
}
window.parentWindow = parent || top
window.events = {};
window.workdata = {};
const dispatchEvents = e => {
    parentWindow.events.emit("preview", e)
}
addEventListener("load", () => {
    events = new Events();
    preview.style.width = `${innerWidth}px`
    preview.style.height = `${(innerWidth / 16) * 9}px`
    events.on("editor", e => {
        console.log("editor", e)
        if (e.type == "init") {
            workId = e.workId
            dispatchEvents({
                type: "reply",
                success: true,
                origin: "preview",
            })
        } else if (e.type == "reply") {
            if (e.data.success) {
                console.log("editor", "success")
            } else {
                console.log("editor", "fail")
            }
        } else if (e.type == "run") {
            preview.dataset.type = "run"
            dispatchEvents({
                type: "reply",
                workId: workId,
                success: true,
                origin: "preview",
            })
            workdata = parentWindow.workdata;
            parentWindow.Csl.log("已收到运行指令")
            let code = e.data.code
            let renderCode = e.data.renderCode
            code = `const parentWindow = parent || top;
const events = new Events();
function backgroundClick(event) {
    if (preview.dataset.type == "run") {
        const e = {
            x: event.offsetX,
            y: event.offsetY,
        }
        events.emit("on_role_-__background__-_click", e)
    }
}
function backgroundDown(event) {
    if (preview.dataset.type == "run") {
        const e = {
            x: event.offsetX,
            y: event.offsetY,
        }
        events.emit("on_role_-__background__-_down", e)
    }
}
function backgroundUp(event) {
    if (preview.dataset.type == "run") {
        const e = {
            x: event.offsetX,
            y: event.offsetY,
        }
        events.emit("on_role_-__background__-_up", e)
    }
}
preview.addEventListener("click", backgroundClick)
preview.addEventListener("mousedown", backgroundDown)
preview.addEventListener("touchstart", backgroundDown)
preview.addEventListener("mouseup", backgroundUp)
preview.addEventListener("touchend", backgroundUp)
${code}
addEventListener("message", e => {
    if (e.data == "stop") {
        preview.removeEventListener("click", backgroundClick)
        preview.removeEventListener("mousedown", backgroundDown)
        preview.removeEventListener("touchstart", backgroundDown)
        preview.removeEventListener("mouseup", backgroundUp)
        preview.removeEventListener("touchend", backgroundUp)
    }
})
${renderCode}
events.emit("when_start");`
            eval(code)
            console.log(code)
        } else if (e.type == "stop") {
            preview.dataset.type = "edit"
            dispatchEvents({
                type: "reply",
                workId: workId,
                success: true,
                origin: "preview",
            })
            postMessage("stop")
            parentWindow.Csl.log("已收到停止指令")
        } else if (e.type == "newWork") {
            const roles = e.data.roleData;
            roles.forEach(role => {
                
            });
        }
    })
})

addEventListener("resize", () => {
    preview.style.width = `${innerWidth}px`
    preview.style.height = `${(innerWidth / 16) * 9}px`
})