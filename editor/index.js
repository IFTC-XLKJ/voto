const pathToMedia = "/blockly/package/media/";
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
        const json = JSON.parse(localStorage.getItem("blocklyData"))
        Blockly.serialization.workspaces.load(json, workspace);
        const javascriptGenerator = Blockly.JavaScript;
        workspace.addChangeListener(function (event) {
            if (Blockly.serialization.workspaces.save(workspace).blocks) {
                console.log("no emepty")
                localStorage.setItem("blocklyData", JSON.stringify(Blockly.serialization.workspaces.save(workspace)))
            }
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