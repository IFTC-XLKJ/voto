const blockLoad = new Event('blockLoad', { isTrust: true })
window.roles = [
    ["背景", "__background__"]
]
addEventListener('load', function () {
    const block = new Block()
    const events = new Events()
    // Events
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
                ["松开", "up"]
            ]), "eventName")
        this.appendStatementInput('blocks')
            .appendField('');
        this.setOutput(false, "String");
        this.svgGroup_.classList.add('EventsBlocks');
    }, {
        role: function (block) {
            return roles
        }
    })
    block.code("events_role_event", function (block) {
        var role = block.getFieldValue("role")
        var eventName = block.getFieldValue("eventName")
        var blocks = Blockly.JavaScript.statementToCode(block, 'blocks')
        var code = `events.on("on_role_-${role}-_${eventName}",funtion() {\n${blocks}\n})`
        return code
    })
    // Controls
    var ControlsRepeatJson = {
        type: 'controls_repeat',
        message0: '%{BKY_CONTROLS_REPEAT_TITLE}',
        args0: [
            {
                type: 'field_number',
                name: 'TIMES',
                value: 20,
                min: 0,
                precision: 1,
            },
        ],
        message1: '%{BKY_CONTROLS_REPEAT_INPUT_DO} %1',
        args1: [
            {
                type: 'input_statement',
                name: 'DO',
            },
        ],
        previousStatement: null,
        nextStatement: null,
        style: 'loop_blocks',
        tooltip: '%{BKY_CONTROLS_REPEAT_TOOLTIP}',
        helpUrl: '%{BKY_CONTROLS_REPEAT_HELPURL}',
    }
    Blockly.Blocks['controls_repeat'] = {
        init: function () {
            this.jsonInit(ControlsRepeatJson);
            this.svgGroup_.classList.add('ControlsBlocks');
        }
    };
    var ControlsIfJson = {
        type: 'controls_if',
        message0: '%{BKY_CONTROLS_IF_MSG_IF} %1',
        args0: [
            {
                type: 'input_value',
                name: 'IF0',
                check: 'Boolean',
            },
        ],
        message1: '%{BKY_CONTROLS_IF_MSG_THEN} %1',
        args1: [
            {
                type: 'input_statement',
                name: 'DO0',
            },
        ],
        previousStatement: null,
        nextStatement: null,
        style: 'logic_blocks',
        suppressPrefixSuffix: true,
        mutator: 'controls_if_mutator',
        extensions: ['controls_if_tooltip'],
    }
    Blockly.Blocks['controls_if'] = {
        init: function () {
            this.jsonInit(ControlsIfJson);
            this.svgGroup_.classList.add('ControlsBlocks');
        }
    };
    block.add("controls_output", function () {
        console.log(this)
        this.appendDummyInput()
            .appendField('在控制台')
            .appendField(new Blockly.FieldDropdown([
                ["打印", "print"],
                ["警告", "warn"],
                ["错误", "error"]
            ]), "type")
            .appendField(new Blockly.FieldTextInput("调试信息"), "text");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.svgGroup_.classList.add('ControlsBlocks');
    }, [null])
    block.code("controls_output", function (block) {
        var type = block.getFieldValue("type")
        var text = block.getFieldValue("text")
        var code = `Csl.${type}(${text})`
        return code
    })
    block.add("controls_clear-output", function () {
        console.log(this)
        this.appendDummyInput()
            .appendField('清空控制台');
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.svgGroup_.classList.add('ControlsBlocks');
    }, [null])
    block.code("controls_clear-output", function (block) {
        var code = `Csl.clear()`
        return code
    })
    // Variables
    var VariablesGetJson = {
        type: 'variables_get',
        message0: '%1',
        args0: [
            {
                type: 'field_variable',
                name: 'VAR',
                variable: '%{BKY_VARIABLES_DEFAULT_NAME}',
            },
        ],
        output: null,
        style: 'variable_blocks',
        helpUrl: '%{BKY_VARIABLES_GET_HELPURL}',
        tooltip: '%{BKY_VARIABLES_GET_TOOLTIP}',
        extensions: ['contextMenu_variableSetterGetter'],
    }
    Blockly.Blocks['variables_get'] = {
        init: function () {
            this.jsonInit(VariablesGetJson);
            this.svgGroup_.classList.add('VariablesBlocks');
        }
    };
    var VariablesSetJson = {
        type: 'variables_set',
        message0: '%{BKY_VARIABLES_SET}',
        args0: [
            {
                type: 'field_variable',
                name: 'VAR',
                variable: '%{BKY_VARIABLES_DEFAULT_NAME}',
            },
            {
                type: 'input_value',
                name: 'VALUE',
            },
        ],
        previousStatement: null,
        nextStatement: null,
        style: 'variable_blocks',
        tooltip: '%{BKY_VARIABLES_SET_TOOLTIP}',
        helpUrl: '%{BKY_VARIABLES_SET_HELPURL}',
        extensions: ['contextMenu_variableSetterGetter'],
    }
    Blockly.Blocks['variables_set'] = {
        init: function () {
            this.jsonInit(VariablesSetJson);
            this.svgGroup_.classList.add('VariablesBlocks');
        }
    };
    console.log("blockLoad")
    document.dispatchEvent(blockLoad)
})