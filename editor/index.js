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
    screenData: [
        {
            id: "0",
            background: "#FFFFFF"
        }
    ],
    roleData: [
        {
            name: "role",
            at: "0",
            Keyframes: [
                {
                    name: "default",
                    url: "/assets/role.svg"
                }
            ],
            x: 0,
            y: 0,
            width: 100,
            height: 100
        }
    ],
}
window.workId = ""
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
window.message = {
    time: Date.now(),
}
const sendMessage = data => {
    preview.contentWindow.message = data
}
window.Csl = {};
addEventListener("load", () => {
    Csl = new Console(csl, true)
    Csl.log("正在加载...")
    onerror = (msg, url, lineNo, columnNo, error) => {
        Csl.error("错误：" + msg + "在" + url + "的" + lineNo + "行" + columnNo + "列\n" + error)
    }
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
        if (urlParams.workId) {
            workdata.workId = urlParams.workId
            console.log(workdata.workId)
            workId = urlParams.workId
            console.log(workdata.workId)
            if (!isNew(workId)) {
                Csl.log("作品已加载中...")
                try {
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
                            workdata = JSON.parse(json.fields[0].workdata)
                            Blockly.serialization.workspaces.load(workdata.blockData, workspace);
                            preview.src = `/preview/?workId=${workdata.workId}`
                            Csl.log("作品已加载完成")
                        } catch (e) {
                            Csl.error("作品数据损坏")
                        }
                    }
                } catch (e) {
                    Csl.error("作品数据获取失败")
                }
            }
        } else {
            workdata.workId = `__${workdata.workId}__`
            workId = workdata.workId
            location.search = `?workId=${workdata.workId}`
            console.log(workdata.workId)
            preview.src = `/preview/?workId=${workdata.workId}`
        }
        let blocksBoxes = []
        var blockly0 = document.getElementById("blockly-0")
        blocksBoxes.push({ blockly: blockly0, color: "#608FEEFF" })
        var blockly1 = document.getElementById("blockly-1")
        blocksBoxes.push({ blockly: blockly1, color: "#68CDFFFF" })
        var blockly2 = document.getElementById("blockly-2")
        blocksBoxes.push({ blockly: blockly2, color: "#F46767FF" })
        var blockly2 = document.getElementById("blockly-3")
        blocksBoxes.push({ blockly: blockly2, color: "#E76CEAFF" })
        var blockly2 = document.getElementById("blockly-4")
        blocksBoxes.push({ blockly: blockly2, color: "#FFA500FF" })
        blocksBoxes.forEach(blockly => {
            blockly.blockly.style.borderLeft = "8px solid " + blockly.color
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
        /*
        try {
            const json = JSON.parse(localStorage.getItem("blocklyData"))
            Blockly.serialization.workspaces.load(json, workspace);
        } catch (err) {
            console.log(err)
        }
        try {
            const blocklyBlockCanvas = document.querySelector(".blocklyBlockCanvas")
            const CanvasX = JSON.parse(localStorage.getItem("blocklyCanvas")).x
            const CanvasY = JSON.parse(localStorage.getItem("blocklyCanvas")).y
            workspace.scrollX = CanvasX - 70;
            workspace.scrollY = CanvasY;
            workspace.oldLeft = 0 - (CanvasX - 70)
            workspace.oldTop = 0 - CanvasY;
            console.log("x", CanvasX, "y", CanvasY)
            blocklyBlockCanvas.transform.baseVal.getItem(0).setTranslate(CanvasX, CanvasY)
        } catch (err) {
            console.log(err)
        }
        */
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
        sendMessage({
            type: "init",
            workId: workdata.workId,
            origin: "editor"
        })
        preview.style.width = `${previewBody.offsetWidth}px`
        preview.style.height = `${(previewBody.offsetWidth / 16) * 9}px`
        previewBtn.addEventListener("click", () => {
            if (run) {
                const runBtn = document.querySelector(".run")
                const stopBtn = document.querySelector(".stop")
                runBtn.style.display = "block"
                stopBtn.style.display = "none"
                runMask.style.display = "none"
                run = false
                Csl.log("<em>已停止</em>", true)
                sendMessage({
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
                sendMessage({
                    type: "run",
                    workId: workdata.workId,
                    origin: "editor",
                    data: {
                        code: Blockly.JavaScript.workspaceToCode(workspace)
                    }
                })
            }
        })
        sendMessage({
            type: "addRole",
            url: "/assets/role.svg",
            id: "0",
            name: "role",
            w: 100,
            h: 100,
            x: 100,
            y: 100,
            origin: "editor"
        })
    })
    function Processing(e) {
        console.log("editor", e)
        if (e.type === "init") {
            console.log(e.workId)
            sendMessage({
                type: "reply",
                success: true,
                id: workId,
                origin: "editor"
            })
        }
        if (e.type === "reply") {
            if (e.success) {
                console.log("reply", "success")
            } else {
                console.log("reply", "fail")
            }
        }
        if (e.type == "log") {
            Csl.log(e.data)
        }
        if (e.type == "print") {
            Csl.print(e.data)
        }
        if (e.type == "warn") {
            Csl.warn(e.data)
        }
        if (e.type == "error") {
            Csl.error(e.data)
        }
        if (e.type == "clear") {
            Csl.clear()
        }
    }
    let last = message;
    setInterval(() => {
        if (last != message) {
            last = message
            Processing(message)
            console.log("editor meassge changed")
        }
    })
    runMask.addEventListener("click", () => {
        previewBtn.click()
    })
    preview.style.width = `${previewBody.offsetWidth}px`
    preview.style.height = `${(previewBody.offsetWidth / 16) * 9}px`
    Csl.log("加载完成")
    Csl.log("欢迎使用 Voto编辑器")
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
    })
    addEventListener("click", e => {
        console.log(e.target)
        if (e.target.id != "file" && isFile) {
            isFile = false
            fileList.dataset.file = "false"
        }
    })
})

addEventListener("resize", () => {
    preview.style.width = `${previewBody.offsetWidth}px`
    preview.style.height = `${(previewBody.offsetWidth / 16) * 9}px`
})
