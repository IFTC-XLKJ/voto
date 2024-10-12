const blockLoad = new Event('blockLoad', { isTrust: true })
window.roles = [
    ["背景", "#background"]
]
addEventListener('load', function () {
    const block = new Block()
    const events = new Events()
    block.add("events_when_start", function () {
        console.log(this)
        this.appendDummyInput()
            .appendField('当 开始运行 时')
        this.appendStatementInput('blocks')
            .appendField('');
        this.setOutput(false, "String");
        this.svgGroup_.classList.add('EventsBlocks');
    }, [null])
    block.code("events_when_start", function (block) {
        var blocks = Blockly.JavaScript.statementToCode(block, 'blocks')
        var code = `events.on("when_start",funtion() {\n${blocks}\n})`
        return code
    })
    block.add("events_role_event", function () {
        console.log(this)
        this.appendDummyInput()
            .appendField('当')
            .appendField(new Blockly.FieldDropdown(roles), "role")
            .appendField('被')
            .appendField(new Blockly.FieldDropdown([
                ["点击", "click"],
                ["按下", "down"],
                ["抬起", "up"]
            ]), "role")
        this.appendStatementInput('blocks')
            .appendField('');
        this.setOutput(false, "String");
        this.svgGroup_.classList.add('EventsBlocks');
    }, [null])
    block.code("events_role_event", function (block) {
        var blocks = Blockly.JavaScript.statementToCode(block, 'blocks')
        var code = `events.on("when_start",funtion() {\n${blocks}\n})`
        return code
    })
    console.log("blockLoad")
    document.dispatchEvent(blockLoad)
})