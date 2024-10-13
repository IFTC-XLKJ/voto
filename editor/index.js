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
        blocksBoxes.push(blockly0)
        blocksBoxes.forEach(blockly => {
            blockly.style.borderLeft = "8px solid #608FEEFF"
            blockly.style.backgroundColor = "#FFFFFF00"
            blockly.addEventListener("click", () => {
                if (blockly.style.backgroundColor == "#608FEEFF") {
                    blockly.style.backgroundColor = "#FFFFFF00"
                } else {
                    blockly.style.backgroundColor = "#608FEEFF"
                }
            })
        })
        /*const json = {
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "events_when_start",
                        id: "1UIPz@~Va%:ek#w]UT0=",
                        x: 135,
                        y: 151
                    }
                ]
            }
        }*/
        let isLoaded = false
        const javascriptGenerator = Blockly.JavaScript;
        setInterval(() => {
            if (isLoaded) {
            }
        }, 1)
        const json = JSON.parse(localStorage.getItem("blocklyData"))
        Blockly.serialization.workspaces.load(json, workspace);
        const blocklyBlockCanvas = document.querySelector(".blocklyBlockCanvas")
        const CanvasX = JSON.parse(localStorage.getItem("blocklyCanvas")).x
        const CanvasY = JSON.parse(localStorage.getItem("blocklyCanvas")).y
        workspace.scrollX = CanvasX - 70;
        workspace.scrollY = CanvasY;
        console.log("x", CanvasX, "y", CanvasY)
        blocklyBlockCanvas.transform.baseVal.getItem(0).setTranslate(CanvasX, CanvasY)
        workspace.addChangeListener(function (event) {
            console.log(event)
            if (event.type == "finished_loading") {
                console.log("加载")
                isLoaded = true
            }
            if (event.type == "create" || event.type == "change" || event.type == "delete" || event.type == "move" || event.type == "comment_change" || event.type == "comment_create" || event.type == "comment_delete") {
                if (Blockly.serialization.workspaces.save(workspace).blocks && isLoaded) {
                    console.log("保存")
                    localStorage.setItem("blocklyData", JSON.stringify(Blockly.serialization.workspaces.save(workspace)))
                }
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
        }, 1)
    })
})