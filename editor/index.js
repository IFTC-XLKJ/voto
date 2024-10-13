const pathToMedia = "/blockly/package/media/";
window.workdata = {
    title: "新的Voto作品",
    x: 0,
    y: 0,
    blockData: [],
    screenData: [],
    roleData: [],
}
addEventListener("load", () => {
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
            console.log("x", CanvasX, "y", CanvasY)
            blocklyBlockCanvas.transform.baseVal.getItem(0).setTranslate(CanvasX, CanvasY)
        } catch (err) {
            console.log(err)
        }
        workspace.registerButtonCallback("createVar", function (ws) {
            Blockly.Variables.createVariableButtonHandler(workspace, null, 'any')
        })
        workspace.addChangeListener(function (event) {
            console.log(event)
            if (event.type == "var_create") {
                console.log(`Variable "${event.varName}" ID: "${event.varId}"`);
            }
            if (event.type == "finished_loading") {
                console.log("加载")
                isLoaded = true
            }
            if (event.type == "create" || event.type == "change" || event.type == "delete" || event.type == "move" || event.type == "comment_change" || event.type == "comment_create" || event.type == "comment_delete") {
                if (Blockly.serialization.workspaces.save(workspace).blocks && isLoaded) {
                    console.log("保存")
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
            console.log(CanvasX, CanvasY)
            const code = javascriptGenerator.workspaceToCode(workspace);
            console.log(code)
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
            const blocklyText = document.querySelector(".blocklyFlyoutButton>.blocklyText")
            if (blocklyText) {
                blocklyText.setAttribute("y", 21)
                blocklyText.setAttribute("x", 100)
            }
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
})

addEventListener("resize", () => {
    preview.style.width = `${previewBody.offetWidth}px`
    preview.style.height = (window.innerHeight - 60) + "px"
})