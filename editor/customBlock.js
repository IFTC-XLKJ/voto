class Block {
    constructor() { }
    add(type, init, other) {
        Blockly.Blocks[type] = {
            init: init
        }
        Object.keys(other).forEach(key => {
            Blockly.Blocks[type][key] = other[key]
        })
    }
    code(type, code) {
        Blockly.JavaScript.forBlock[type] = code
    }
}