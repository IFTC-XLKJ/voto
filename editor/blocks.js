const blockLoad = new Event('blockLoad', { isTrust: true })
window.roles = [
    ["背景", "__background__", "BACKGROUND"],
    ["示例角色", "example", "角色-1"]
]
addEventListener('load', function () {
    const block = new Block()
    const events = new Events()
    /* 自定义字段 */
    // Roles
    Blockly.FieldRoles = class extends Blockly.FieldDropdown {
        constructor(opt_value, opt_validator) {
            super(roles, opt_validator);
            console.log(this)
            const options = this.getOptions();
            this.setValue(opt_value || options[0][1]);
        }
        getOptions() {
            return roles;
        }
        showEditor_() {
            super.showEditor_();
            this.doValueUpdate_(this.getOptions());
        }
    };
    Blockly.fieldRegistry.register("field_roles", Blockly.FieldRoles)
    /* 自定义字段 */
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
        var code = `events.on("when_start",function() {\nparentWindow.Csl.log("\\"当 开始运行 时\\"已被触发")\n${blocks}\n})`
        return code
    })
    block.add("events_role_event", function () {
        console.log(this)
        this.appendDummyInput()
            .appendField('当')
            .appendField(new Blockly.FieldRoles("__background__"), "role")
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
    }, {})
    block.code("events_role_event", function (block) {
        var role = block.getFieldValue("role")
        var eventName = block.getFieldValue("eventName")
        var blocks = Blockly.JavaScript.statementToCode(block, 'blocks')
        var code = `events.on("on_role_-${role}-_${eventName}",function() {\nparentWindow.Csl.log("\\"当 角色${role} 被 ${eventName} 时\\"被触发");\n${blocks}\n})`
        return code
    })
    // Controls
    var ControlsRepeatJson = {
        type: 'controls_repeat',
        message0: '%{BKY_CONTROLS_REPEAT_TITLE}',
        args0: [
            {
                type: 'input_value',
                name: 'TIMES',
                check: 'Number',
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
        tooltip: '重复执行指定次数，为空时不循环\n警告：此积木没有等待保护，设置过大值会导致卡顿甚至卡死',
    }
    Blockly.Blocks['controls_repeat'] = {
        init: function () {
            this.jsonInit(ControlsRepeatJson);
            this.svgGroup_.classList.add('ControlsBlocks');
        }
    };
    var ControlsIfJson = {
        type: 'controls_if',
        message0: '如果 %1',
        args0: [
            {
                type: 'input_value',
                name: 'IF0',
                check: 'Boolean',
            },
        ],
        message1: '%1',
        args1: [
            {
                type: 'input_statement',
                name: 'DO0',
            },
        ],
        previousStatement: null,
        nextStatement: null,
        suppressPrefixSuffix: true,
        mutator: 'controls_if_mutator',
    }
    Blockly.Blocks['controls_if'] = {
        init: function () {
            this.jsonInit(ControlsIfJson);
            this.svgGroup_.classList.add('ControlsBlocks');
        }
    };
    var ControlsOutputJson = {
        type: 'controls_output',
        message0: '在控制台 %1 %2',
        args0: [
            {
                type: 'field_dropdown',
                name: 'type',
                options: [
                    ["打印", "print"],
                    ["警告", "warn"],
                    ["错误", "error"],
                ]
            },
            {
                type: 'input_value',
                name: 'text',
            },
        ],
        previousStatement: null,
        nextStatement: null,
    }
    Blockly.Blocks['controls_output'] = {
        init: function () {
            this.jsonInit(ControlsOutputJson);
            this.svgGroup_.classList.add('ControlsBlocks');
        }
    };
    block.code("controls_output", function (block, generator) {
        var type = block.getFieldValue("type")
        const argument0 = generator.valueToCode(block, 'text', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
        var code = `parentWindow.Csl.${type}(${String(argument0)});\n`
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
        var code = `parentWindow.Csl.clear();\n`
        return code
    })
    // Actions
    var ActionsMoveJson = {
        type: 'actions_move',
        message0: '角色%1向%2移动%3步',
        args0: [
            {
                type: 'field_roles',
                name: 'role',
                value: "example",
                options: roles
            },
            {
                type: 'field_dropdown',
                name: 'direction',
                options: [
                    ["前", "forward"],
                    ["后", "backward"],
                    ["左", "left"],
                    ["右", "right"],
                ]
            },
            {
                type: 'input_value',
                name: 'distance',
                check: 'Number',
                value: 1
            }
        ],
        tooltip: '移动角色，1步=1px',
    }
    block.add("actions_move", function () {
        console.log(this)
        this.jsonInit(ActionsMoveJson);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.svgGroup_.classList.add('ActionsBlocks');
    }, {})
    block.code("actions_move", function (block, generator) {
        var role = block.getFieldValue("role")
        var direction = block.getFieldValue("direction")
        var distance = generator.valueToCode(block, 'distance', Blockly.JavaScript.ORDER_ASSIGNMENT) || '1';
        var code = "";
        if (role == "__background__") {
            const Csl = new Console(csl)
            Csl.error("背景不是角色\n背景不能移动", "积木:角色[背景]向前移动(" + distance + ")步")
            console.error("背景不是角色\n背景不能移动")
            code = `// actions.move_forward(${role}, ${direction}, ${distance})\n`
        } else {
            code = `actions.move_forward(${role}, ${direction}, ${distance})\n`
        }
        return code
    })
    // Looks
    var LooksSetBackgroundImgJson = {
        type: 'looks_set_background_img',
        message0: '设置背景为 %1',
        args0: [
            {
                type: 'input_value',
                name: 'img',
            }
        ],
        previousStatement: null,
        nextStatement: null,
    }
    Blockly.Blocks["looks_set_background_img"] = {
        init: function () {
            this.jsonInit(LooksSetBackgroundImgJson);
            this.svgGroup_.classList.add('LooksBlocks');
        }
    };
    block.code("looks_set_background_img", function (block) {
        var img = block.getFieldValue("img")
        var code = `looks.set_background("${img}")`
        return code
    })
    // Pen
    // Sound
    // Operators
    var OperatorsTextJson = {
        type: 'text',
        message0: '“%1”',
        args0: [
            {
                type: 'field_input',
                name: 'TEXT',
                text: '',
            },
        ],
        output: 'String',
        tooltip: '字符串',
    }
    block.add("text", function () {
        this.jsonInit(OperatorsTextJson);
        this.svgGroup_.classList.add('OperatorsBlocks');
    }, {})
    block.code("text", function (block) {
        var text = block.getFieldValue("TEXT")
        var code = `"${text}"`
        return [code, Blockly.JavaScript.ORDER_ATOMIC]
    })
    var OperatorsNumberJson = {
        type: 'math_number',
        message0: '%1',
        args0: [
            {
                type: 'field_number',
                name: 'NUM',
                value: 0,
            },
        ],
        output: 'Number',
        style: 'math_blocks',
        tooltip: '数值',
    }
    block.add("math_number", function () {
        this.jsonInit(OperatorsNumberJson);
        this.svgGroup_.classList.add('OperatorsBlocks');
    }, {})
    var OperatorsJoinJson =
    {
        type: 'text_join',
        message0: '%1',
        args0: [
            {
                type: 'input_value',
                name: 'ADD0',
            },
        ],
        message1: '+',
        message2: '%1',
        args2: [
            {
                type: 'input_value',
                name: 'ADD1',
            },
        ],
        output: 'String',
        tooltip: '字符串合并',
    }
    block.add("text_join", function () {
        this.jsonInit(OperatorsJoinJson);
        this.svgGroup_.classList.add('OperatorsBlocks');
    }, {})
    block.code("text_join", function (block, generator) {
        var add0 = generator.valueToCode(block, 'ADD0', Blockly.JavaScript.ORDER_ADDITION) || '""';
        var add1 = generator.valueToCode(block, 'ADD1', Blockly.JavaScript.ORDER_ADDITION) || '""';
        var code = `(${add0} + ${add1})`;
        return [code, Blockly.JavaScript.ORDER_ADDITION];
    })
    var OperatorsSimpleJson = {
        type: 'math_simple_operator',
        message0: '%1',
        args0: [
            {
                type: 'input_value',
                check: 'Number',
                name: 'NUM1',
            },
        ],
        message1: ' %1',
        args1: [
            {
                type: 'field_dropdown',
                name: 'OP',
                options: [
                    ['+', '+'],
                    ['-', '-'],
                    ['×', '*'],
                    ['÷', '/'],
                    ['%', '%'],
                ]
            },
        ],
        message2: ' %1',
        args2: [
            {
                type: 'input_value',
                check: 'Number',
                name: 'NUM2',
            },
        ],
        output: 'Number',
        style: 'math_blocks',
        tooltip: '简单运算(加法、减法、乘法、除法、取余)',
    }
    block.add("math_simple_operator", function () {
        this.jsonInit(OperatorsSimpleJson);
        this.svgGroup_.classList.add('OperatorsBlocks');
    }, {})
    block.code("math_simple_operator", function (block, generator) {
        var operator = block.getFieldValue('OP');
        var num = generator.valueToCode(block, 'NUM1', Blockly.JavaScript.ORDER_ADDITION) || '0';
        var num2 = generator.valueToCode(block, 'NUM2', Blockly.JavaScript.ORDER_ADDITION) || '0';
        var code = `(${num} ${operator} ${num2})`
        var Order = 0;
        if (operator == '+') {
            Order = Blockly.JavaScript.ORDER_UNARY_PLUS;
        } else if (operator == '-') {
            Order = Blockly.JavaScript.ORDER_UNARY_NEGATION;
        } else if (operator == '*') {
            Order = Blockly.JavaScript.ORDER_MULTIPLICATION;
        } else if (operator == '/') {
            Order = Blockly.JavaScript.ORDER_DIVISION;
        } else if (operator == '%') {
            Order = Blockly.JavaScript.ORDER_MODULUS;
        }
        return [code, Order];
    })
    // Variables
    var VariablesGetJson = {
        type: 'variables_get',
        message0: '%1',
        args0: [
            {
                type: 'field_variable',
                name: 'var',
                variable: '%{BKY_VARIABLES_DEFAULT_NAME}',
            },
        ],
        output: null,
        style: 'variable_blocks',
        tooltip: "获取变量的值"
    }
    Blockly.Blocks['variables_get'] = {
        init: function () {
            this.jsonInit(VariablesGetJson);
            this.svgGroup_.classList.add('VariablesBlocks');
        }
    };
    block.code("variables_get", function (block) {
        var code = Blockly.JavaScript.nameDB_.getName(
            block.getFieldValue('var'), Blockly.Variables.CATEGORY_NAME);
        console.log(code)
        return [code, Blockly.JavaScript.ORDER_ATOMIC];
    })
    var VariablesSetterJson = {
        type: "variables_setter",
        message0: "将%1自%2%3",
        args0: [
            {
                type: 'field_variable',
                name: 'var',
                variable: '%{BKY_VARIABLES_DEFAULT_NAME}',
            },
            {
                type: 'field_dropdown',
                name: 'type',
                options: [
                    ['增', '+='],
                    ['减', '-='],
                    ['乘', '*='],
                    ['除', '/='],
                ]
            },
            {
                type: 'input_value',
                name: 'num',
                check: 'Number',
            },
        ],
        previousStatement: true,
        nextStatement: true,
        tooltip: '变量自增、自减、自乘、自除',
    }
    block.add("variables_setter", function () {
        this.jsonInit(VariablesSetterJson);
        this.svgGroup_.classList.add('VariablesBlocks');
    }, {})
    block.code("variables_setter", function (block, generator) {
        var operator = block.getFieldValue('type');
        var varName = Blockly.JavaScript.nameDB_.getName(
            block.getFieldValue('var'), Blockly.Variables.CATEGORY_NAME);
        var num = generator.valueToCode(block, 'num', Blockly.JavaScript.ORDER_ADDITION) || '0';
        var code = `${varName} ${operator} ${num};\n`;
        return code;
    })
    var VariablesSetJson = {
        type: 'variables_set',
        message0: '设置%1为%2',
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
        tooltip: '给变量赋值，类型为任意',
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