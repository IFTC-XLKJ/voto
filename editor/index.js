const pathToMedia = "/blockly/package/media/";
window.run = false
const generatorWorkId = () => {
    return Math.random().toString(36).slice(2)
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
            name: "role",
            id: "example",
            type: "角色-1",
            url: "/assets/role.svg",
            x: 10,
            y: 5,
            width: 100,
            height: 100,
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
            return false
        } else {
            Csl.log("登录成功")
            localStorage.setItem("token", user.fields[0].token)
            localStorage.setItem("UNM", user.fields[0].用户名)
            localStorage.setItem("UID", user.fields[0].ID)
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
                                filter: `ID="${localStorage.getItem("UID")}" AND WID="${workdata.workId}"`
                            })
                            if (json.fields.length == 0) {
                                Csl.error("作品不存在")
                            } else {
                                Csl.log("作品数据获取成功")
                                try {
                                    const data = JSON.parse(json.fields[0].workdata)
                                    workId = json.fields[0].workId
                                    workdata.workId = workId
                                    workdata = JSON.parse(json.fields[0].workdata)
                                    Blockly.serialization.workspaces.load(workdata.blockData, workspace);
                                    preview.src = `/preview/?workId=${workdata.workId}`
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
                    dispatchEvents({ type: "newWork", data: workdata.roleData })
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
                Csl.log("控制台")
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
                            const result = json.data.filter(data => {
                                return data.name.includes(search)
                            })
                            console.log(result)
                        }
                    })
                    data.sort((a, b) => {
                        return b.updatedAt - a.updatedAt
                    })
                    var projectViewBox = document.createElement("div")
                    projectViewBox.className = "projectViewBox"
                    projectView.appendChild(projectViewBox)
                    data.forEach(projectData => {
                        const projectItem = document.createElement("div")
                        projectItem.className = "projectItem"
                        var projectCover = document.createElement("img")
                        projectCover.className = "projectCover"
                        projectCover.src = projectData.cover
                        projectCover.title = projectData.name ? projectData.name : "未命名作品"
                        var projectName = document.createElement("div")
                        projectName.className = "projectName"
                        projectName.innerText = projectData.name ? projectData.name : "未命名作品";
                        projectName.title = projectData.name ? projectData.name : "未命名作品"
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
    roleX.onchange = e => {
        if (roleX.value.trim() == "") {
            roleX.value = preview.contentWindow.document.getElementById(`ROLE_${selectedRole}`).style.left.slice(0, -1)
        } else {
            preview.contentWindow.document.getElementById(`ROLE_${selectedRole}`).style.left = `${roleX.value}%`
            preview.contentWindow.document.getElementById(`selectedRole`).style.left = `${roleX.value}%`
        }
    }
    roleY.onchange = e => {
        if (roleY.value.trim() == "") {
            roleY.value = preview.contentWindow.document.getElementById(`ROLE_${selectedRole}`).style.top.slice(0, -1)
        } else {
            preview.contentWindow.document.getElementById(`ROLE_${selectedRole}`).style.top = `${roleY.value}%`
            preview.contentWindow.document.getElementById(`selectedRole`).style.top = `${roleY.value}%`
        }
    }
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
        }
    })
})

addEventListener("resize", () => {
    preview.style.width = `${previewBody.offsetWidth}px`
    preview.style.height = `${(previewBody.offsetWidth / 16) * 9}px`
})
