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
    const preEdit = document.querySelector("[data-type=\"edit\"]")
    const preRun = document.querySelector("[data-type=\"run\"]")
    events = new Events();
    preEdit.style.width = `${innerWidth}px`
    preEdit.style.height = `${(innerWidth / 16) * 9}px`
    preRun.style.width = `${innerWidth}px`
    preRun.style.height = `${(innerWidth / 16) * 9}px`
    events.on("editor", e => {
        console.log("editor", e)
        if (e.type == "init") {
            workId = e.workId
            var selectedRole = document.createElement("div");
            selectedRole.id = "selectedRole";
            selectedRole.classList.add("selectedRole");
            selectedRole.style.display = "none"
            selectedRole.dataset.selected = "BACKGROUND"
            preEdit.addEventListener("click", event => {
                if (!event.target.className.split(" ").includes("role")) {
                    selectedRole.style.display = "none"
                    selectedRole.dataset.selected = "BACKGROUND"
                }
            })
            var isDragging = false;
            var initialOffset = { x: 0, y: 0 };
            var dragStartPos = { x: 0, y: 0 };
            var newX = 0;
            var newY = 0;
            var CX = 0;
            var CY = 0;
            selectedRole.addEventListener('mousedown', function (_event) {
                _event.preventDefault();
                dragStartPos.x = _event.clientX;
                dragStartPos.y = _event.clientY;
                initialOffset.x = selectedRole.offsetLeft;
                initialOffset.y = selectedRole.offsetTop;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
            function onMouseMove(_event) {
                if (_event.target == selectedRole) {
                    isDragging = true;
                    CX = _event.clientX - dragStartPos.x;
                    CY = _event.clientY - dragStartPos.y;
                    newX = initialOffset.x + _event.clientX - dragStartPos.x;
                    newY = initialOffset.y + _event.clientY - dragStartPos.y;
                    newY = newY - 5;
                    selectedRole.style.left = newX + 'px';
                    selectedRole.style.top = newY + 'px';
                    var role = document.getElementById(`ROLE_${selectedRole.dataset.selected}`)
                    role.style.left = newX + 'px';
                    role.style.top = newY + 'px';
                    parentWindow.workdata.roleData.forEach((Role, index) => {
                        if (Role.id == selectedRole.dataset.selected) {
                            parentWindow.workdata.roleData[index].x = newX / (preEdit.clientWidth / 640)
                            parentWindow.workdata.roleData[index].y = newY / (preEdit.clientHeight / 360)
                        }
                    })
                }
            }
            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                isDragging = false;
            }
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
            leftDot.addEventListener("mousedown", function (_event) {
                _event.preventDefault();
            })
            rightDot.addEventListener("mousedown", function (_event) {
                _event.preventDefault();
            })
            topDot.addEventListener("mousedown", function (_event) {
                _event.preventDefault();
            })
            bottomDot.addEventListener("mousedown", function (_event) {
                _event.preventDefault();
            })
        } else if (e.type == "reply") {
            if (e.data.success) {
                console.log("editor", "success")
            } else {
                console.log("editor", "fail")
            }
        } else if (e.type == "run") {
            preEdit.click();
            preEdit.style.display = "none"
            preRun.style.display = "block"
            dispatchEvents({
                type: "reply",
                workId: workId,
                success: true,
                origin: "preview",
            })
            workdata = parentWindow.workdata;
            parentWindow.Csl.log("已收到运行指令")
            let code = e.data.code
            render(parentWindow.workdata.roleData, preRun)
            code = `const parentWindow = parent || top;
const actions = new Action();
const events = new Events();
const controller = new AbortController();
const signal = controller.signal;
function backgroundClick(event) {
    if (event.target.className == "preview") {
        const e = {
            x: event.offsetX,
            y: event.offsetY,
        }
        events.emit("on_role_-__background__-_click", e)
    }
}
function backgroundDown(event) {
    if (event.target.className == "preview") {
        const e = {
            x: event.offsetX,
            y: event.offsetY,
        }
        events.emit("on_role_-__background__-_down", e)
    }
}
function backgroundUp(event) {
    if (event.target.className == "preview") {
        const e = {
            x: event.offsetX,
            y: event.offsetY,
        }
        events.emit("on_role_-__background__-_up", e)
    }
}
preRun.addEventListener("click", backgroundClick)
preRun.addEventListener("mousedown", backgroundDown)
preRun.addEventListener("touchstart", backgroundDown)
preRun.addEventListener("mouseup", backgroundUp)
preRun.addEventListener("touchend", backgroundUp)
${code}
addEventListener("message", e => {
    if (e.data == "stop") {
        preRun.removeEventListener("click", backgroundClick)
        preRun.removeEventListener("mousedown", backgroundDown)
        preRun.removeEventListener("touchstart", backgroundDown)
        preRun.removeEventListener("mouseup", backgroundUp)
        preRun.removeEventListener("touchend", backgroundUp)
    }
})
function createTimeoutPromise(timeout) {
    return new Promise((resovle, reject) => {
        setTimeout(() => {
            reject(new Error('Operation timed out'));
        }, timeout);
    });
}
parentWindow.document.getElementById("previewBtn").addEventListener("click", () => {
    console.log("114514")
    controller.abort();
    events.emit("stop");
})
events.emit("when_start");`
            try {
                eval(code)
            } catch (e) {
                parentWindow.Csl.error("运行时发生错误")
                console.log(e)
            }
            console.log(code)
        } else if (e.type == "stop") {
            preEdit.style.display = "block"
            preRun.style.display = "none"
            dispatchEvents({
                type: "reply",
                workId: workId,
                success: true,
                origin: "preview",
            })
            postMessage("stop")
            const roles = parentWindow.workdata.roleData;
            render(roles, preEdit)
            parentWindow.Csl.log("已收到停止指令")
        } else if (e.type == "newWork") {
            const roles = e.data;
            render(roles, preEdit)
        }
    })
    function render(roles, pre) {
        pre.innerHTML = ""
        console.log(roles)
        var selectedRole = document.getElementById("selectedRole");
        roles.forEach(role => {
            var roleImg = document.createElement("img");
            roleImg.src = role.url;
            const W = (pre.clientWidth / 640) * role.width;
            const H = (pre.clientHeight / 360) * role.height;
            roleImg.style.width = `${W}px`
            roleImg.style.height = `${H}px`
            roleImg.classList.add("role");
            const X = (pre.clientWidth / 640) * role.x;
            const Y = (pre.clientHeight / 360) * role.y;
            roleImg.style.left = `${X}px`;
            roleImg.style.top = `${Y}px`;
            roleImg.addEventListener("dragstart", e => {
                e.preventDefault();
                return false;
            })
            roleImg.id = `ROLE_${role.id}`
            roleImg.dataset.name = role.name
            roleImg.dataset.type = role.type
            roleImg.addEventListener("click", e => {
                if (pre.dataset.type == "edit") {
                    selectedRole.style.display = "flex"
                    selectedRole.style.width = `${W - 6}px`
                    selectedRole.style.height = `${H - 6}px`
                    selectedRole.style.left = `${X}px`
                    selectedRole.style.top = `${Y}px`
                    selectedRole.dataset.selected = role.id;
                }
            })
            pre.appendChild(roleImg);
        });
    }
})

addEventListener("resize", () => {
    const preEdit = document.querySelector("[data-type=\"edit\"]")
    const preRun = document.querySelector("[data-type=\"run\"]")
    preEdit.style.width = `${innerWidth}px`
    preEdit.style.height = `${(innerWidth / 16) * 9}px`
    preRun.style.width = `${innerWidth}px`
    preRun.style.height = `${(innerWidth / 16) * 9}px`
    const X = role => {
        let w = parentWindow.workdata.roleData.filter(r => `ROLE_${r.id}` == role.id)[0].width
        return (preEdit.clientWidth / 640) * w
    };
    const Y = role => {
        let h = parentWindow.workdata.roleData.filter(r => `ROLE_${r.id}` == role.id)[0].height
        return (preEdit.clientHeight / 360) * h;
    }
    const W = role => {
        let w = parentWindow.workdata.roleData.filter(r => `ROLE_${r.id}` == role.id)[0].width
        return (preEdit.clientWidth / 640) * w
    };
    const H = role => {
        let h = parentWindow.workdata.roleData.filter(r => `ROLE_${r.id}` == role.id)[0].height
        return (preEdit.clientHeight / 360) * h
    };
    const roles = document.querySelectorAll(".role")
    roles.forEach(role => {
        role.style.left = `${X(role)}px`
        role.style.top = `${Y(role)}px`
        role.style.width = `${W(role)}px`
        role.style.height = `${H(role)}px`
    })
})