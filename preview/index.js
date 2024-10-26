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
            var selectedRole = document.createElement("div");
            selectedRole.id = "selectedRole";
            selectedRole.classList.add("selectedRole");
            selectedRole.style.display = "none"
            selectedRole.dataset.selected = "BACKGROUND"
            preview.addEventListener("click", event => {
                if (preview.dataset.type == "edit") {
                    if (!event.target.className.split(" ").includes("role")) {
                        selectedRole.style.display = "none"
                        selectedRole.dataset.selected = "BACKGROUND"
                    }
                }
            })
            document.body.appendChild(selectedRole);
            var leftDot = document.createElement("div");
            leftDot.id = "leftDot";
            leftDot.classList.add("dot");
            leftDot.classList.add("leftDot");
            selectedRole.appendChild(leftDot);
            var rightDot = document.createElement("div");
            rightDot.id = "rightDot";
            rightDot.classList.add("dot");
            rightDot.classList.add("rightDot");
            selectedRole.appendChild(rightDot);
            var topDot = document.createElement("div");
            topDot.id = "topDot";
            topDot.classList.add("dot");
            topDot.classList.add("topDot");
            selectedRole.appendChild(topDot);
            var bottomDot = document.createElement("div");
            bottomDot.id = "bottomDot";
            bottomDot.classList.add("dot");
            bottomDot.classList.add("bottomDot");
            selectedRole.appendChild(bottomDot);
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
            preview.click();
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
const actions = new Action();
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
            const roles = parentWindow.workdata.roleData;
            render(roles)
            parentWindow.Csl.log("已收到停止指令")
        } else if (e.type == "newWork") {
            const roles = e.data;
            render(roles)
        }
    })
    function render(roles) {
        preview.innerHTML = ""
        console.log(roles)
        var selectedRole = document.getElementById("selectedRole");
        roles.forEach(role => {
            var roleImg = document.createElement("img");
            roleImg.src = role.url;
            roleImg.style.width = `${role.width}px`;
            roleImg.style.height = `${role.height}px`;
            roleImg.classList.add("role");
            roleImg.style.left = `${role.x}px`;
            roleImg.style.top = `${role.y}px`;
            roleImg.addEventListener("dragstart", e => {
                e.preventDefault();
                return false;
            })
            roleImg.id = `ROLE_${role.id}`
            roleImg.dataset.name = role.name
            roleImg.dataset.type = role.type
            roleImg.addEventListener("click", e => {
                if (preview.dataset.type == "edit") {
                    selectedRole.style.display = "flex"
                    selectedRole.style.width = `${roleImg.clientWidth - 6}px`
                    selectedRole.style.height = `${roleImg.clientHeight - 6}px`
                    selectedRole.style.left = `${roleImg.offsetLeft}px`
                    selectedRole.style.top = `${roleImg.offsetTop}px`
                    selectedRole.dataset.selected = role.id;
                }
            })
            preview.appendChild(roleImg);
        });
    }
})

addEventListener("resize", () => {
    preview.style.width = `${innerWidth}px`
    preview.style.height = `${(innerWidth / 16) * 9}px`
})