const pathToMedia = "/blockly/package/media/";
window.run = false
const generatorWorkId = () => {
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)
}
const isNew = workId => {
    return workId.includes("__")
}
window.workdata = {
    title: "新的Voto作品",
    workId: generatorWorkId(),
    x: 0,
    y: 0,
    blockData: [],
    roleData: [
        {
            name: "role1",
            id: "example1",
            type: "默认角色",
            url: "/assets/role.svg",
            x: 10,
            y: 5,
            width: 15.625,
            height: 27.777777777777777,
            scale: 1
        },
        {
            name: "role2",
            id: "example2",
            type: "默认角色",
            url: "/assets/role.svg",
            x: 30,
            y: 5,
            width: 15.625,
            height: 27.777777777777777,
            scale: 1
        }
    ],
}
window.workId = ""
window.events = {};
function getURLParameters() {
    const queryString = window.location.search.substring(1);
    const params = {};

    if (queryString) {
        queryString.split('&').forEach(param => {
            const [key, value] = param.split('=');
            params[key] = decodeURIComponent(value);
        });
    }

    return params;
}
const urlParams = getURLParameters();

function formatTimestamp(timestamp) {
    if (typeof timestamp !== 'number' || isNaN(timestamp)) {
        return 'Invalid Timestamp';
    }
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}年${month}月${day}日 ${hours}时${minutes}分${seconds}秒`;
}
const dispatchEvents = e => {
    preview.contentWindow.events.emit("editor", e)
}
window.Csl = {};
window.vvzh = {}
window.selectedRole = ""
async function login() {
    Csl.log("登录中...")
    try {
        const user = await vvzh.getTableData({
            limit: 1,
            page: 1,
            filter: `ID="${localStorage.getItem("UID")}" AND 密码="${CryptoJS.MD5(localStorage.getItem("PWD"))}"`
        })
        if (user.fields.length == 0) {
            Csl.error("无法登录，可能原因：未登录、密码被修改、账号已注销或账号不存在")
            localStorage.removeItem("UID")
            localStorage.removeItem("PWD")
            localStorage.removeItem("token")
            location.href = "/login.html#editor"
            return false
        } else {
            Csl.log("登录成功")
            localStorage.setItem("token", user.fields[0].token)
            localStorage.setItem("UNM", user.fields[0].用户名)
            localStorage.setItem("UID", user.fields[0].ID)
            localStorage.setItem("PWD", localStorage.getItem("PWD"))
            return true
        }
    } catch (e) {
        Csl.error("用户数据获取失败")
        console.error(e)
        return false
    }
}
addEventListener("load", () => {
    events = new Events();
    Csl = new Console(csl, true)
    Csl.log("正在加载...")
    roles = [];
    roles.push(["背景", "__background__", "BACKGROUND"])
    workdata.roleData.forEach(role => {
        roles.push([role.name, role.id, role.type])
    });
    onerror = (msg, url, lineNo, columnNo, error) => {
        if (error == "TypeError: Cannot read properties of undefined (reading 'null')") {
            Csl.error("积木中含有空值\n问题可能出现在“列表”积木中")
            return 0;
        }
        Csl.error("错误：" + msg + "在" + url + "的" + lineNo + "行" + columnNo + "列\n" + error)
    }
    vvzh = new pgdbs(dbs_a6b2a4d6c02022e831626d31ab805a468a151b90d5161660485a73cc6e1ea902)
    const Porject = new pgdbs(dbs_8efbb73cc76b58f1e97c0faac2289f9b5cbcfc8eda08d3801958ddb27943f14e)
    const runBtn = document.querySelector(".run")
    const stopBtn = document.querySelector(".stop")
    runBtn.style.display = "block"
    stopBtn.style.display = "none"
    const preview = document.getElementById("preview");
    document.addEventListener("blockLoad", async e => {
        console.log("blockLoad")
        window.workspace = Blockly.inject('blocklyDiv', {
            toolbox: toolbox,
            renderer: "Zelos",
            media: pathToMedia,
            grid:
            {
                spacing: 20,
                length: 3,
                colour: '#ccc',
            },
            trashcan: false,
            move: {
                scrollbars: {
                    horizontal: true,
                    vertical: true
                },
                drag: true,
                wheel: true
            },
            zoom: {
                controls: true,
                wheel: true,
                maxScale: 5,
                minScale: 0.1,
                scaleSpeed: 1.5
            }
        });
        if (urlParams.workUrl) {
            try {
                const workdata = await fetch(urlParams.workUrl)
                workdata = await workdata.json()
                workdata.workId = urlParams.workId
                workdata.blockData = JSON.parse(workdata.blockData)
                Blockly.serialization.workspaces.load(workdata.blockData, workspace);
                preview.src = `/preview/?workId=${workdata.workId}`
            } catch (e) {
                Csl.error("作品加载失败")
            }
        } else {
            if (urlParams.workId) {
                console.log(isNew(urlParams.workId))
                if (!isNew(urlParams.workId)) {
                    if (localStorage.getItem("UID").trim() == "") {
                        Csl.error("请先登录")
                    } else {
                        const isTrust = await login();
                        if (isTrust) {
                            Csl.log("作品已加载中...")
                            const json = await Porject.getTableData({
                                limit: 1,
                                page: 1,
                                filter: `ID="${localStorage.getItem("UID")}" AND WID="${urlParams.workId}"`
                            })
                            console.log(json)
                            if (json.fields.length == 0) {
                                Csl.error("作品不存在")
                            } else {
                                Csl.log("作品数据获取成功")
                                try {
                                    preview.src = `/preview/?workId=${workdata.workId}`
                                    const data = JSON.parse(json.fields[0].workdata)
                                    workId = json.fields[0].WID
                                    workdata.workId = workId
                                    workdata = JSON.parse(json.fields[0].workdata)
                                    Blockly.serialization.workspaces.load(workdata.blockData, workspace);
                                    workNameInput.value = workdata.title
                                    Csl.log("作品已加载完成")
                                } catch (e) {
                                    Csl.error("作品数据损坏")
                                }
                            }
                        }
                    }
                }
            } else {
                workdata.workId = `__${workdata.workId}__`
                workId = workdata.workId
                preview.src = `/preview`
                preview.onload = () => {
                    dispatchEvents({ type: "render", data: workdata.roleData })
                }
                console.log(workdata.workId)
            }
        }
        let blocksBoxes = []
        var blockly0 = document.getElementById("blockly-0")
        blocksBoxes.push({ blockly: blockly0, color: "#608FEEFF" })
        var blockly1 = document.getElementById("blockly-1")
        blocksBoxes.push({ blockly: blockly1, color: "#68CDFFFF" })
        var blockly2 = document.getElementById("blockly-2")
        blocksBoxes.push({ blockly: blockly2, color: "#F46767FF" })
        var blockly3 = document.getElementById("blockly-3")
        blocksBoxes.push({ blockly: blockly3, color: "#E76CEAFF" })
        var blockly4 = document.getElementById("blockly-4")
        blocksBoxes.push({ blockly: blockly4, color: "#FEAE8AFF" })
        var blockly5 = document.getElementById("blockly-5")
        blocksBoxes.push({ blockly: blockly5, color: "#FFA500FF" })
        var blockly6 = document.getElementById("blockly-6")
        blocksBoxes.push({ blockly: blockly6, color: "#F9CC37FF" })
        blocksBoxes.forEach(blockly => {
            console.log(blockly)
            blockly.blockly.style.borderLeft = "8px solid " + blockly.color;
            blockly.blockly.style.backgroundColor = "#FFFFFF00"
            blockly.blockly.addEventListener("click", () => {
                const blocklyTreeLabels = document.querySelectorAll(".blocklyTreeLabel")
                blocklyTreeLabels.forEach(blocklyTreeLabel => {
                    blocklyTreeLabel.style.color = "#333"
                })
                const blocklyTreeLabel = blockly.blockly.querySelector(".blocklyTreeLabel")
                if (blockly.blockly.style.backgroundColor == blockly.color) {
                    blockly.blockly.style.backgroundColor = "#FFFFFF00"
                    blocklyTreeLabel.style.color = "#333"
                } else {
                    blockly.blockly.style.backgroundColor = "#FFFFFF00"
                    blocklyTreeLabel.style.color = "#333"
                }
            })
        })
        let isLoaded = false
        const javascriptGenerator = Blockly.JavaScript;
        const blocklyMainBackground = document.querySelector(".blocklyMainBackground")
        console.log(blocklyMainBackground)
        const clickEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: false,
            view: window
        });
        blocklyMainBackground.dispatchEvent(clickEvent);
        workspace.registerButtonCallback("createVar", function (ws) {
            Blockly.Variables.createVariableButtonHandler(workspace, null, 'any')
        })
        workspace.addChangeListener(function (event) {
            if (event.type == "var_create") { }
            if (event.type == "finished_loading") {
                blocklyMainBackground.dispatchEvent(clickEvent);
                Blockly.JavaScript.init(workspace)
                console.log("加载完成")
                Csl.log("加载完成")
                isLoaded = true
            }
            if (event.type == "create" || event.type == "change" || event.type == "delete" || event.type == "move" || event.type == "comment_change" || event.type == "comment_create" || event.type == "comment_delete" || event.type == "viewport_change") {
                if (Blockly.serialization.workspaces.save(workspace).blocks) {
                    localStorage.setItem("blocklyData", JSON.stringify(Blockly.serialization.workspaces.save(workspace)))
                    workdata.blockData = Blockly.serialization.workspaces.save(workspace)
                }
                const blocklyTreeLabels = document.querySelectorAll(".blocklyTreeLabel")
                blocklyTreeLabels.forEach(blocklyTreeLabel => {
                    blocklyTreeLabel.style.color = "#333"
                })
            }
            if (event.type == "click") {
                const blocklyTreeLabels = document.querySelectorAll(".blocklyTreeLabel")
                blocklyTreeLabels.forEach(blocklyTreeLabel => {
                    blocklyTreeLabel.style.color = "#333"
                })
            }
            const blocklyBlockCanvas = document.querySelector(".blocklyBlockCanvas")
            const CanvasX = blocklyBlockCanvas.transform.animVal[0].matrix.e;
            const CanvasY = blocklyBlockCanvas.transform.animVal[0].matrix.f;
            localStorage.setItem("blocklyCanvas", JSON.stringify({ x: CanvasX, y: CanvasY }))
            const code = javascriptGenerator.workspaceToCode(workspace);
            localStorage.setItem("code", code)
        })
        setInterval(() => {
            const blocklyDropDownDiv = document.querySelector(".blocklyDropDownDiv")
            if (blocklyDropDownDiv) {
                blocklyDropDownDiv.style.backgroundColor = "white"
                blocklyDropDownDiv.style.borderColor = "white"
            }
            const blocklyMenuItemContents = document.querySelectorAll(".blocklyMenuItemContent")
            blocklyMenuItemContents.forEach(blocklyMenuItemContent => {
                blocklyMenuItemContent.style.color = "#333"
            })
            const blocklyFlyoutButtonShadow = document.querySelector(".blocklyFlyoutButtonShadow")
            if (blocklyFlyoutButtonShadow) {
                blocklyFlyoutButtonShadow.setAttribute("width", 200)
                blocklyFlyoutButtonShadow.setAttribute("height", 30)
            }
            const blocklyFlyoutBackground = document.querySelector(".blocklyFlyoutBackground")
            if (!blocklyFlyoutBackground) {
                const blocklyTreeLabels = document.querySelectorAll(".blocklyTreeLabel")
                blocklyTreeLabels.forEach(blocklyTreeLabel => {
                    blocklyTreeLabel.style.color = "#333"
                })
            }
            const blocklyFlyoutButtonBackground = document.querySelector(".blocklyFlyoutButtonBackground")
            if (blocklyFlyoutButtonBackground) {
                blocklyFlyoutButtonBackground.setAttribute("width", 200)
                blocklyFlyoutButtonBackground.setAttribute("height", 30)
            }
            const blocklyTexts = document.querySelectorAll(".blocklyFlyoutButton>.blocklyText")
            blocklyTexts.forEach(blocklyText => {
                blocklyText.setAttribute("y", 21)
                blocklyText.setAttribute("x", 100)
            })
            const createVar = document.querySelector(".createVar");
            if (createVar) {
                createVar.style.color = "#333"
            }
            const blocklyToolboxDiv = document.querySelector(".blocklyToolboxDiv")
            blocklyToolboxDiv.addEventListener("click", e => {
                if (e.target.className != "blocklyToolboxDiv blocklyNonSelectable") {
                    return
                }
                const blocklyTreeLabels = document.querySelectorAll(".blocklyTreeLabel")
                blocklyTreeLabels.forEach(blocklyTreeLabel => {
                    blocklyTreeLabel.style.color = "#333"
                })
            })
        }, 10)
        setInterval(() => {
            const blocklyPath2 = document.querySelectorAll(".blocklySelected>.blocklyPath")[1]
            if (blocklyPath2) {
                blocklyPath2.setAttribute("d", "")
                blocklyPath2.setAttribute("fill", "none")
            }
            const blocklyPath4 = document.querySelectorAll(".blocklySelected>.blocklyPath")[3]
            if (blocklyPath4) {
                blocklyPath4.setAttribute("d", "")
                blocklyPath4.setAttribute("fill", "none")
            }
            const blocklyToolboxCategorys = document.querySelectorAll(".blocklyToolboxCategory")
            blocklyToolboxCategorys.forEach(blocklyToolboxCategory => {
                blocklyToolboxCategory.style.backgroundColor = "white"
            })
        }, 1)
    })
    console.log("editor loaded")
    preview.addEventListener("load", () => {
        console.log("preview loaded")
        dispatchEvents({
            type: "init",
            workId: workdata.workId,
            origin: "editor"
        })
        preview.style.width = `${previewBody.offsetWidth}px`
        preview.style.height = `${(previewBody.offsetWidth / 16) * 9}px`
    })
    runMask.addEventListener("click", () => {
        previewBtn.click()
    })
    preview.style.width = `${previewBody.offsetWidth}px`
    preview.style.height = `${(previewBody.offsetWidth / 16) * 9}px`
    Csl.log("加载完成")
    Csl.log("欢迎使用 Voto编辑器")
    events.on("preview", e => {
        console.log("preview", e)
        if (e.type == "reply") {
            if (e.success) {
                console.log("reply", "success")
            } else {
                console.log("reply", "fail")
            }
        }
    })
})

addEventListener("load", () => {
    const Porject = new pgdbs(dbs_8efbb73cc76b58f1e97c0faac2289f9b5cbcfc8eda08d3801958ddb27943f14e)
    let isFile = false
    let isHelp = false
    file.addEventListener("click", () => {
        if (!isFile) {
            isFile = true
            fileList.dataset.file = "true"
        } else {
            isFile = false
            fileList.dataset.file = "false"
        }
        console.log("file click", isFile)
    })
    help.addEventListener("click", () => {
        if (!isHelp) {
            isHelp = true
            helpList.dataset.help = "true"
        } else {
            isHelp = false
            helpList.dataset.help = "false"
        }
        console.log("help click", isHelp)
    })
    addNew.addEventListener("click", () => {
        location.href = "/editor"
        isFile = false
        fileList.dataset.file = "false"
    })
    let projectPage = 1
    openProject.addEventListener("click", async () => {
        isFile = false
        fileList.dataset.file = "false"
        const isTrust = await login();
        if (isTrust) {
            dialogMask.style.display = "flex"
            var projectView = document.createElement("div")
            projectView.className = "projectView"
            document.body.appendChild(projectView)
            var projectSearch = document.createElement("input")
            projectSearch.type = "search"
            projectSearch.placeholder = "搜索作品"
            projectSearch.className = "projectSearch"
            var projectViewClose = document.createElement("div")
            projectViewClose.className = "projectViewClose"
            projectViewClose.innerHTML = `<svg t="1729361341224" class="icon" viewBox="0 0 1024 1024" version="1.1"
    xmlns="http://www.w3.org/2000/svg" p-id="4247" width="30" height="30">
    <path
        d="M597.795527 511.488347 813.564755 295.718095c23.833825-23.833825 23.833825-62.47489 0.001023-86.307691-23.832801-23.832801-62.47489-23.833825-86.307691 0L511.487835 425.180656 295.717583 209.410404c-23.833825-23.833825-62.475913-23.833825-86.307691 0-23.832801 23.832801-23.833825 62.47489 0 86.308715l215.769228 215.769228L209.410915 727.258599c-23.833825 23.833825-23.833825 62.47489 0 86.307691 23.832801 23.833825 62.473867 23.833825 86.307691 0l215.768205-215.768205 215.769228 215.769228c23.834848 23.833825 62.475913 23.832801 86.308715 0 23.833825-23.833825 23.833825-62.47489 0-86.307691L597.795527 511.488347z"
        fill="#272636" p-id="4248">
    </path>
</svg>`
            projectViewClose.onclick = () => {
                dialogMask.style.display = "none"
                projectView.remove()
            }
            projectView.appendChild(projectSearch)
            projectView.appendChild(projectViewClose)
            Csl.log("正在获取作品列表")
            if (localStorage.getItem("UID")) {
                try {
                    const json = await Porject.getTableData({
                        limit: 100,
                        page: projectPage,
                        filter: `ID='${localStorage.getItem("UID")}'`
                    })
                    console.log(json)
                    if (json.code != 200) {
                        Csl.error("获取作品列表失败\n原因：" + json.msg)
                        return
                    }
                    const data = json.fields
                    projectSearch.addEventListener("keypress", e => {
                        if (e.key == "Enter") {
                            const search = projectSearch.value
                            const result = json.fields.filter(data => {
                                return data.name.includes(search)
                            })
                            console.log(result)
                            renderProjectItem(result)
                        }
                    })
                    data.sort((a, b) => {
                        return b.updatedAt - a.updatedAt
                    })
                    renderProjectItem(data)
                    function renderProjectItem(data) {
                        if (projectView.querySelector(".projectViewBox")) {
                            projectView.querySelector(".projectViewBox").remove()
                        }
                        var projectViewBox = document.createElement("div")
                        projectViewBox.className = "projectViewBox"
                        projectView.appendChild(projectViewBox)
                        data.forEach(projectData => {
                            console.log(projectData)
                            const projectItem = document.createElement("div")
                            projectItem.className = "projectItem"
                            var projectCover = document.createElement("img")
                            projectCover.className = "projectCover"
                            projectCover.src = projectData.cover
                            projectCover.title = projectData.name ? projectData.name : "未命名作品"
                            var projectName = document.createElement("div")
                            projectName.className = "projectName"
                            projectName.title = projectData.name ? projectData.name : "未命名作品"
                            projectName.innerText = projectData.name ? projectData.name : "未命名作品"
                            var projectTime = document.createElement("div")
                            const formattedDate = formatTimestamp(Number(String(projectData.updatedAt) + "000"));
                            requestAnimationFrame(() => {
                                projectTime.innerText = formattedDate;
                            });
                            projectTime.className = "projectTime"
                            projectViewBox.appendChild(projectItem)
                            projectItem.appendChild(projectCover)
                            projectItem.appendChild(projectName)
                            projectItem.appendChild(projectTime)
                            projectItem.addEventListener("click", e => {
                                console.log(`/editor/?workId=${projectData.WID}`)
                                location.href = `/editor/?workId=${projectData.WID}`
                            })
                        })
                    }
                    Csl.print("获取作品列表成功\n总数" + json.count + "个\n已获取" + data.length + "个")
                } catch (e) {
                    Csl.error("获取作品列表失败\n原因：" + e)
                }
            } else {
                Csl.warn("未登录，无法获取作品列表")
                return
            }
        }
    })
    docItem.addEventListener("click", e => {
        open("https://voto.fandom.com/zh")
    })
    workNameInput.value = workdata.title
    workNameInput.onchange = e => {
        if (workNameInput.value.trim() == "") {
            workNameInput.value = workdata.title
            Csl.warn("作品名称不能为空")
        } else {
            workdata.title = workNameInput.value
            Csl.log("作品名称已修改为“" + workNameInput.value + "”")
        }
    }
    saveBtn.addEventListener("click", async e => {
        const newToast = new Toast()
        const id = newToast.loading("作品保存中...")
        const url = await captureScreen(preview.offsetWidth, preview.offsetHeight, 0, 60)
        console.log(url)
        if (!url.includes("https://static.codemao.cn/")) {
            newToast.error("作品保存失败", 2000)
            newToast.loadend(id)
            return;
        }
        console.log("上传完成", url)
        try {
            workdata.workId = workId
            const check = await Porject.getTableData({
                limit: 1,
                page: 1,
                filter: `ID='${localStorage.getItem("UID")}' AND WID='${workdata.workId}'`
            });
            console.log(check)
            if (check.code == 200) {
                if (check.fields.length != 0) {
                    try {
                        setTimeout(async () => {
                            workdata.workId = workId
                            const json = await Porject.setTableData({
                                type: "UPDATE",
                                filter: `ID='${localStorage.getItem("UID")}' AND WID='${workdata.workId}'`,
                                fields: `name="${workdata.title}",cover="${url}",workdata='${JSON.stringify(workdata)}'`
                            })
                            console.log(workdata.workId)
                            console.log(json)
                            if (json.code == 200) {
                                newToast.success("作品保存成功", 2000)
                                newToast.loadend(id)
                            } else {
                                newToast.error("作品保存失败", 2000)
                                newToast.loadend(id)
                            }
                            return;
                        }, 200)
                    } catch (e) {
                        newToast.error("作品保存失败", 2000)
                        newToast.loadend(id)
                        return;
                    }
                } else {
                    setTimeout(async () => {
                        const WorkID = generatorWorkId().slice(2, -1)
                        const json = await Porject.setTableData({
                            type: "INSERT",
                            filter: "ID,name,WID,cover,workdata",
                            fields: `("${localStorage.getItem("UID")}","${workdata.title}","${WorkID}","${url}",'${JSON.stringify(workdata)}')`
                        })
                        if (json.code == 200) {
                            location.search = "?workId=" + WorkID;
                            newToast.success("作品保存成功", 2000)
                            newToast.loadend(id)
                        } else {
                            newToast.error("作品保存失败", 2000)
                            newToast.loadend(id)
                        }
                    }, 200)
                }
            } else {
                newToast.error("作品保存失败", 2000)
                newToast.loadend(id)
                return;
            }
        } catch (e) {
            newToast.error("作品保存失败", 2000)
            newToast.loadend(id)
            return;
        }
    })
    roleX.onchange = e => {
        if (selectedRole) {
            if (roleX.value.trim() == "") {
                roleX.value = preview.contentWindow.document.getElementById(`ROLE_${selectedRole}`).style.left.slice(0, -1)
            } else {
                const data = getRole(selectedRole)
                preview.contentWindow.document.getElementById(`ROLE_${selectedRole}`).style.left = `${roleX.value}%`
                preview.contentWindow.document.getElementById(`selectedRole`).style.left = `${roleX.value}%`
                data.x = Number(roleX.value)
            }
        } else {
            Csl.warn("未选择角色")
            roleX.value = null
        }
    }
    roleY.onchange = e => {
        if (selectedRole) {
            if (roleY.value.trim() == "") {
                roleY.value = preview.contentWindow.document.getElementById(`ROLE_${selectedRole}`).style.top.slice(0, -1)
            } else {
                const data = getRole(selectedRole)
                preview.contentWindow.document.getElementById(`ROLE_${selectedRole}`).style.top = `${roleY.value}%`
                preview.contentWindow.document.getElementById(`selectedRole`).style.top = `${roleY.value}%`
                data.y = Number(roleY.value)
            }
        } else {
            Csl.warn("未选择角色")
            roleY.value = null
        }
    }
    roleName.onchange = e => {
        if (selectedRole) {
            if (roleName.value.trim() == "") {
                roleName.value = preview.contentWindow.document.getElementById(`ROLE_${selectedRole}`).dataset.name
            } else {
                const data = getRole(selectedRole)
                preview.contentWindow.document.getElementById(`ROLE_${selectedRole}`).dataset.name = roleName.value
                preview.contentWindow.document.getElementById(`selectedRole`).dataset.name = roleName.value
                data.name = roleName.value
                const role = roles.find(r => r[1] == selectedRole)
                console.log(role)
                role[0] = roleName.value
            }
        } else {
            Csl.warn("未选择角色")
            roleName.value = "-未选中角色-"
        }
    }
    roleWidth.onchange = e => {
        if (selectedRole) {
            if (roleWidth.value.trim() == "") {
                roleWidth.value = preview.contentWindow.document.getElementById(`ROLE_${selectedRole}`).style.width.slice(0, -1)
            } else {
                const data = getRole(selectedRole)
                preview.contentWindow.document.getElementById(`ROLE_${selectedRole}`).style.width = `${roleWidth.value}%`
                preview.contentWindow.document.getElementById(`selectedRole`).style.width = `${roleWidth.value - 0.9375}%`
                data.width = Number(roleWidth.value)
            }
        } else {
            Csl.warn("未选择角色")
            roleWidth.value = null
        }
    }
    roleHeight.onchange = e => {
        if (selectedRole) {
            if (roleHeight.value.trim() == "") {
                roleHeight.value = preview.contentWindow.document.getElementById(`ROLE_${selectedRole}`).style.height.slice(0, -1)
            } else {
                const data = getRole(selectedRole)
                preview.contentWindow.document.getElementById(`ROLE_${selectedRole}`).style.height = `${roleHeight.value}%`
                preview.contentWindow.document.getElementById(`selectedRole`).style.height = `${roleHeight.value - 1.6666666666666667}%`
                data.height = Number(roleHeight.value)
            }
        } else {
            Csl.warn("未选择角色")
            roleHeight.value = null
        }
    }
    roleScale.onchange = e => {
        if (selectedRole) {
            if (roleScale.value.trim() == "") {
                roleScale.value = preview.contentWindow.document.getElementById(`ROLE_${selectedRole}`).style.transform.slice(6, -1)
            } else {
                const data = getRole(selectedRole)
                preview.contentWindow.document.getElementById(`ROLE_${selectedRole}`).style.transform = `scale(${roleScale.value / 100})`
                preview.contentWindow.document.getElementById(`selectedRole`).style.transform = `scale(${roleScale.value / 100})`
                data.scale = Number(roleScale.value / 100)
            }
        } else {
            Csl.warn("未选择角色")
            roleScale.value = null
        }
    }
    Import.addEventListener("click", e => {
        var fileChooser = document.createElement("input")
        fileChooser.type = "file"
        fileChooser.accept = ".voto"
        fileChooser.onchange = e => {
            const file = fileChooser.files[0]
            console.log(file)
            if (file) {
                const reader = new FileReader()
                reader.onload = e => {
                    const data = JSON.parse(e.target.result)
                    console.log(data)
                    workdata = data
                    console.log(workdata)
                    dispatchEvents({ type: "render", data: workdata.roleData })
                    Blockly.serialization.workspaces.load(workdata.blockData, workspace)
                    roles = [];
                    roles.push(["背景", "__background__", "BACKGROUND"])
                    data.roleData.forEach(role => {
                        roles.push([role.name, role.id, role.type])
                    });
                }
                reader.readAsText(file)
            }
        }
        fileChooser.click()
    })
    Export.addEventListener("click", e => {
        const dataURL = convertJsonToDataURL(JSON.stringify(workdata, null, 4))
        console.log(dataURL)
        var a = document.createElement("a")
        a.href = dataURL
        a.download = `${workdata.title}.voto`
        a.style.display = "none"
        document.body.appendChild(a)
        a.click()
    })
    document.addEventListener("click", e => {
        if (e.target.id != "file" && isFile) {
            isFile = false
            fileList.dataset.file = "false"
        } else if (e.target.id == "previewBtn" || e.target.dataset.icon == "run") {
            console.log("run")
            if (run) {
                const runBtn = document.querySelector(".run")
                const stopBtn = document.querySelector(".stop")
                runBtn.style.display = "block"
                stopBtn.style.display = "none"
                runMask.style.display = "none"
                run = false
                Csl.log("<em>已停止</em>", true)
                dispatchEvents({
                    type: "stop",
                    workId: workdata.workId,
                    origin: "editor"
                })
            } else {
                const runBtn = document.querySelector(".run")
                const stopBtn = document.querySelector(".stop")
                runBtn.style.display = "none"
                stopBtn.style.display = "block"
                runMask.style.display = "flex"
                run = true
                Csl.log("<em>已运行</em>", true)
                dispatchEvents({
                    type: "run",
                    workId: workdata.workId,
                    origin: "editor",
                    data: {
                        code: Blockly.JavaScript.workspaceToCode(workspace),
                    }
                })
            }
        } else if (e.target.id != "help" && isHelp) {
            isHelp = false
            helpList.dataset.help = "false"
        }
    })
})

addEventListener("resize", () => {
    preview.style.width = `${previewBody.offsetWidth}px`
    preview.style.height = `${(previewBody.offsetWidth / 16) * 9}px`
})
function getRole(id) {
    return workdata.roleData.filter(r => r.id == id)[0]
}

function convertJsonToDataURL(jsonString) {
    const mimeType = 'application/json;charset=utf-8;base64';
    const encodedJsonString = encodeURIComponent(jsonString);
    const base64JsonString = btoa(encodedJsonString.replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
    const dataURL = `data:${mimeType},${base64JsonString}`;
    return dataURL;
}
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
        document.body.appendChild(canvas);
        return new Promise((resolve, reject) => {
            canvas.toBlob(async (blob) => {
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

const beforeunloadHandler = (event) => {
    event.preventDefault();
    event.returnValue = true;
};
addEventListener("beforeunload", beforeunloadHandler);