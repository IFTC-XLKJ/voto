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
            blockly.addEventListener("click", () => {
                if (blockly.dataset.current == "1") {
                    blockly.style.backgroundColor = "#FFFFFF00"
                    blockly.dataset.current = "0"
                } else {
                    blockly.style.backgroundColor = "#608FEEFF"
                    blockly.dataset.current = "1"
                }
            })
        })
        const javascriptGenerator = Blockly.JavaScript;
        workspace.addChangeListener(function (event) {
            const code = javascriptGenerator.workspaceToCode(workspace);
            console.log(code)
        })
    })

})