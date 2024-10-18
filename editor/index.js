const pathToMedia = "/blockly/package/media/";
const generatorWorkId = () => {
    return Math.random().toString(36).slice(2)
}
window.workdata = {
    title: "鏂扮殑Voto浣滃搧",
    workId: generatorWorkId(),
    x: 0,
    y: 0,
    blockData: [],
    screenData: [],
    roleData: [],
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
addEventListener("load", () => {
    const preview = document.getElementById("preview");
    if (urlParams.workId) {
        workdata.workId = urlParams.workId
        workId = urlParams.workId
        console.log(workdata.workId)
        preview.src = `/preview?workId=${workdata.workId}`
    } else {
        workdata.workId = `__${workdata.workId}__`
        workId = workdata.workId
        location.search = `?workId=${workdata.workId}`
        console.log(workdata.workId)
        preview.src = `/preview?workId=${workdata.workId}`
    }
    document.addEventListener("blockLoad", e => {
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
        let blocksBoxes = []
        var blockly0 = document.getElementById("blockly-0")
        blocksBoxes.push({ blockly: blockly0, color: "#608FEEFF" })
        var blockly1 = document.getElementById("blockly-1")
        blocksBoxes.push({ blockly: blockly1, color: "#68CDFFFF" })
        var blockly2 = document.getElementById("blockly-2")
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
                    blockly.blockly.style.backgroundColor = blockly.color
                    blocklyTreeLabel.style.color = "white"
                }
            })
        })
        let isLoaded = false
        const javascriptGenerator = Blockly.JavaScript;
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
            console.log(event)
            if (event.type == "var_create") {
                console.log(`Variable "${event.varName}" ID: "${event.varId}"`);
            }
            if (event.type == "finished_loading") {
                blocklyMainBackground.dispatchEvent(clickEvent);
                console.log("加载完成")
                isLoaded = true
            }
            if (event.type == "create" || event.type == "change" || event.type == "delete" || event.type == "move" || event.type == "comment_change" || event.type == "comment_create" || event.type == "comment_delete" || event.type == "viewport_change") {
                if (Blockly.serialization.workspaces.save(workspace).blocks && isLoaded) {
                    console.log("改变")
                    localStorage.setItem("blocklyData", JSON.stringify(Blockly.serialization.workspaces.save(workspace)))
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
        }, 1)
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
        }, 0)
    })
    postMessage({
        type: "init",
        workId: workdata.workId
    })
    onmessage = (e) => {
        if (e.data.type) {
            console.log(e.data)
            if (e.data.type === "init") {
                console.log(e.data.workId)
                postMessage({
                    type: "reply",
                    success: true,
                    id: workId
                })
            }
            if (e.data.id == workId) {
                if (e.data.type === "reply") {
                    if (e.data.success) {
                        console.log("success")
                    } else {
                        console.log("fail")
                    }
                }
            }
        }
    }
    preview.style.width = `${previewBody.offsetWidth}px`
    preview.style.height = `${(previewBody.offsetWidth / 16) * 9}px`
})
addEventListener("load", () => {
    const Csl = new Console(csl)
    Csl.log("加载完成 <a href='https://github.com/Sky-Eye-Team/Sky-Eye-IDE")
})
addEventListener("resize", () => {
    preview.style.width = `${previewBody.offsetWidth}px`
    preview.style.height = `${(previewBody.offsetWidth / 16) * 9}px`
})