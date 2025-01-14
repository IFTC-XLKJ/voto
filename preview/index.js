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
function calcPer(num, total) {
    return (num / total) * 100
}
window.cover;
addEventListener("load", () => {
    const preEdit = document.querySelector("[data-type=\"edit\"]")
    const preRun = document.querySelector("[data-type=\"run\"]")
    parentWindow.document.getElementById("roleX").value = null
    parentWindow.document.getElementById("roleY").value = null
    parentWindow.document.getElementById("roleWidth").value = null
    parentWindow.document.getElementById("roleHeight").value = null
    parentWindow.document.getElementById("roleName").readOnly = true
    parentWindow.document.getElementById("roleScale").value = null
    events = new Events();
    preEdit.style.width = `${innerWidth}px`
    preEdit.style.height = `${(innerWidth / 16) * 9}px`
    preRun.style.width = `${innerWidth}px`
    preRun.style.height = `${(innerWidth / 16) * 9}px`
    events.on("editor", async e => {
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
                    if (parentWindow.selectedRole != "") {
                        parentWindow.Csl.log("已取消选择角色")
                    }
                    parentWindow.selectedRole = ""
                    parentWindow.document.getElementById("roleX").value = null
                    parentWindow.document.getElementById("roleY").value = null
                    parentWindow.document.getElementById("roleWidth").value = null
                    parentWindow.document.getElementById("roleHeight").value = null
                    parentWindow.document.getElementById("roleName").value = "-未选中角色-"
                    parentWindow.document.getElementById("roleName").readOnly = true
                    parentWindow.document.getElementById("roleScale").value = null
                }
            })
            document.body.appendChild(selectedRole);
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
            code = `let isEnd = false
const NULL = null
const UNDEFINED = void 0
const NAN = NaN
const parentWindow = parent || top;
const actions = new Action();
const events = new Events();
const looks = new Looks();
const controller = new AbortController();
const signal = controller.signal;
${getFPSCode()}
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
console.time("run")
${code}
console.timeLog("run")
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
    console.timeEnd("run")
    isEnd = true
})
events.emit("when_start");`
            eval(code)
            try {
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
        } else if (e.type == "render") {
            const roles = e.data;
            render(roles, preEdit)
        } else if (e.type == "save") {
            cover = await captureScreen(innerWidth, innerHeight, 0, 0)
        }
    })
    function render(roles, pre) {
        pre.innerHTML = ""
        console.log(roles)
        var selectedRole = document.getElementById("selectedRole");
        roles.forEach(role => {
            var roleImg = document.createElement("img");
            roleImg.src = role.url;
            const W = role.width;
            const H = role.height;
            roleImg.style.width = `${W}%`
            roleImg.style.height = `${H}%`
            roleImg.classList.add("role");
            roleImg.style.left = `${role.x}%`;
            roleImg.style.top = `${role.y}%`;
            roleImg.style.transform = `scale(${role.rotate})`
            roleImg.addEventListener("dragstart", e => {
                e.preventDefault();
                return false;
            })
            roleImg.id = `ROLE_${role.id}`
            roleImg.dataset.name = role.name
            roleImg.dataset.type = role.type
            roleImg.dataset.x = role.x;
            roleImg.dataset.y = role.y;
            roleImg.addEventListener("click", e => {
                if (pre.dataset.type == "edit") {
                    selectedRole.style.display = "flex"
                    selectedRole.style.width = `${W - 0.9375}%`
                    selectedRole.style.height = `${H - 1.6666666666666667}%`
                    selectedRole.style.left = `${role.x}%`
                    selectedRole.style.top = `${role.y}%`
                    selectedRole.dataset.selected = role.id;
                    parentWindow.selectedRole = role.id
                    parentWindow.document.getElementById("roleName").value = role.name
                    parentWindow.document.getElementById("roleX").value = role.x
                    parentWindow.document.getElementById("roleY").value = role.y
                    parentWindow.document.getElementById("roleWidth").value = role.width
                    parentWindow.document.getElementById("roleHeight").value = role.height
                    parentWindow.document.getElementById("roleName").readOnly = false
                    parentWindow.document.getElementById("roleScale").value = role.scale
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
    render(parentWindow.workdata.roleData, preEdit)
    render(parentWindow.workdata.roleData, preRun)
})
async function captureScreen(w, h, x, y) {
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    try {
        const data = await html2canvas(document.body, {
            x: x,
            y: y,
            width: w,
            height: h
        })
        console.log(data)
        document.body.appendChild(data);
        return new Promise((resolve, reject) => {
            data.toBlob(async (blob) => {
                if (!blob) {
                    return reject(new Error('Canvas to Blob failed'));
                }
                const file = new File([blob], 'screenshot.png', { type: 'image/png' });
                const formData = new FormData();
                formData.append('file', file);
                formData.append('path', 'voto-cover');
                try {
                    const response = await fetch('https://api.pgaot.com/user/up_cat_file', {
                        method: 'POST',
                        body: formData,
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    const data = await response.json();
                    console.log("https://static.codemao.cn/" + data.key);
                    resolve("https://static.codemao.cn/" + data.key);
                } catch (error) {
                    reject(error);
                }
            }, 'image/png');
        });
    } catch (error) {
        return error
    }
}

function getFPSCode() {
    return `
    var fpsCounter = {
        startTime: 0,
        frameCount: 0,
        fps: 0,
        update: function (timestamp) {
            if (this.startTime === 0) {
                this.startTime = timestamp;
            } else {
                var elapsedTime = timestamp - this.startTime;
                if (elapsedTime >= 1000) {
                    this.fps = this.frameCount;
                    this.frameCount = 0;
                    this.startTime = timestamp;
                }
            }
            this.frameCount++;
            requestAnimationFrame(this.update.bind(this));
        }
    };
    requestAnimationFrame(fpsCounter.update.bind(fpsCounter));
    `
}