const blockLoad = new Event('blockLoad', { isTrust: true })
window.roles = []
console.log(roles)
/* 角色名 */ /* 角色ID */ /* 角色类型 */
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
        var code = `events.on("when_start",async function() {\nparentWindow.Csl.log("\\"当 开始运行 时\\"已被触发")\n${blocks}\n})`
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
        var code = `events.on("on_role_-${role}-_${eventName}",function() {\nparentWindow.Csl.log("\\"当 角色${role} 被 ${eventName} 时\\"被触发");\nif (!isEnd) {\n${blocks}\n}\n})`
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
                check: ['String', 'Number', 'Boolean'],
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
    var WaitJson = {
        type: 'controls_wait',
        message0: '等待 %1 秒',
        args0: [
            {
                type: 'input_value',
                name: 'WAIT',
                check: 'Number',
            },
        ],
        previousStatement: null,
        nextStatement: null,
    }
    block.add("controls_wait", function () {
        this.jsonInit(WaitJson);
        this.svgGroup_.classList.add('ControlsBlocks');
    }, {})
    block.code("controls_wait", function (block) {
        var times = Blockly.JavaScript.valueToCode(block, 'WAIT', Blockly.JavaScript.ORDER_ASSIGNMENT) || "1";
        var code = `await new Promise(resolve => {
    const id = setTimeout(resolve, ${times} * 1000)
    signal.addEventListener('abort', () => {
        clearTimeout(id);
    });
});\n`
        return code;
    })
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
        const argument0 = generator.valueToCode(block, 'text', Blockly.JavaScript.ORDER_ASSIGNMENT) || null;
        var code = `if (!isEnd) {parentWindow.Csl.${type}(${String(argument0)});console.log("${type}", ${argument0});}\n`
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
        var code = `if (!isEnd) {parentWindow.Csl.clear();}\n`
        return code
    })
    block.add("controls_comment", function () {
        this.appendDummyInput()
            .appendField("注释")
            .appendField(new Blockly.FieldTextInput(''), 'TEXT')
        this.svgGroup_.classList.add('ControlsBlocks')
    }, [null])
    block.code("controls_comment", function (block) {
        var text = block.getFieldValue('TEXT')
        return `// ${text.replaceAll("\n", "    ")}\n`

    })
    // Actions
    var ActionsMoveJson = {
        type: 'actions_move',
        message0: '角色%1向%2移动%3步',
        args0: [
            {
                type: 'field_roles',
                options: roles,
                name: 'role',
                value: "example",
            },
            {
                type: 'field_dropdown',
                name: 'direction',
                options: [
                    ["右", "forward"],
                    ["左", "backward"],
                    ["上", "upward"],
                    ["下", "downward"],
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
            code = `if (!isEnd) {actions.move("${role}", "${direction}", ${distance})\nparentWindow.Csl.log("角色${role} 向 ${direction} 移动")}\n`
        }
        return code
    })
    // Looks
    var LooksSetBackgroundImgJson = {
        type: 'looks_set_background_img',
        message0: '设置背景图片为 %1',
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
    block.code("looks_set_background_img", function (block, generator) {
        var img = generator.valueToCode(block, 'img', Blockly.JavaScript.ORDER_ASSIGNMENT) || '';
        var code = `if (!isEnd) {looks.set_background(${img})}\n`
        return code
    })
    // Sound
    // Operators
    var NullBlockJson = {
        type: 'null_block',
        message0: '空值',
        args0: [],
        output: null,
        tooltip: '返回空值',
    };
    Blockly.Blocks['null_block'] = {
        init: function () {
            this.jsonInit(NullBlockJson);
            this.svgGroup_.classList.add('OperatorsBlocks');
        }
    };
    block.code('null_block', function (block) {
        return ["NULL", Blockly.JavaScript.ORDER_ATOMIC];
    })
    var UndefinedBlockJson = {
        type: 'undefined_block',
        message0: '未定义',
        args0: [],
        output: null,
        tooltip: '返回未定义',
    };
    Blockly.Blocks['undefined_block'] = {
        init: function () {
            this.jsonInit(UndefinedBlockJson);
            this.svgGroup_.classList.add('OperatorsBlocks');
        }
    };
    block.code('undefined_block', function (block) {
        return ["UNDEFINED", Blockly.JavaScript.ORDER_ATOMIC];
    })
    var NaNBlockJson = {
        type: 'nan_block',
        message0: 'NaN',
        args0: [],
        output: null,
        tooltip: '返回NaN',
    };
    Blockly.Blocks['nan_block'] = {
        init: function () {
            this.jsonInit(NaNBlockJson);
            this.svgGroup_.classList.add('OperatorsBlocks');
        }
    };
    block.code('nan_block', function (block) {
        return ["NAN", Blockly.JavaScript.ORDER_ATOMIC];
    })
    var GetDataTypeJson = {
        type: 'data_get_type',
        message0: '获取 %1 的数据类型',
        args0: [
            {
                type: 'input_value',
                name: 'data',
            },
        ],
        output: 'String',
        tooltip: '获取变量的类型',
    }
    Blockly.Blocks['data_get_type'] = {
        init: function () {
            this.jsonInit(GetDataTypeJson);
            this.svgGroup_.classList.add('OperatorsBlocks');
        }
    };
    block.code("data_get_type", function (block, generator) {
        var data = generator.valueToCode(block, 'data', Blockly.JavaScript.ORDER_ASSIGNMENT) || '';
        var code = `(typeof ${data})`
        return [code, Blockly.JavaScript.ORDER_NONE];
    })
    var CompareJson = {
        type: 'logic_compare',
        message0: '%1 %2 %3',
        args0: [
            {
                type: 'input_value',
                name: 'A',
            },
            {
                type: 'field_dropdown',
                name: 'OP',
                options: [
                    ['=', 'EQ'],
                    ['\u2260', 'NEQ'],
                    ['\u200F<', 'LT'],
                    ['\u200F\u2264', 'LTE'],
                    ['\u200F>', 'GT'],
                    ['\u200F\u2265', 'GTE'],
                ],
            },
            {
                type: 'input_value',
                name: 'B',
            },
        ],
        inputsInline: true,
        output: 'Boolean',
        tooltip: '比较两个值',
    }
    Blockly.Blocks['logic_compare'] = {
        init: function () {
            this.jsonInit(CompareJson);
            this.svgGroup_.classList.add('OperatorsBlocks');
        }
    };
    var BooleanJson = {
        type: 'logic_boolean',
        message0: '%1',
        args0: [
            {
                type: 'field_dropdown',
                name: 'BOOL',
                options: [
                    ['成立', 'TRUE'],
                    ['不成立', 'FALSE'],
                ],
            },
        ],
        output: ['Boolean', 'Number'],
        style: 'logic_blocks',
        tooltip: '布尔值',
    }
    Blockly.Blocks['logic_boolean'] = {
        init: function () {
            this.jsonInit(BooleanJson);
            this.svgGroup_.classList.add('OperatorsBlocks');
        }
    };
    var OperatorsTextJson = {
        type: 'text',
        message0: '“%1”',
        args0: [
            {
                type: 'field_input',
                name: 'TEXT',
                text: 'Hello',
            },
        ],
        output: "String",
        tooltip: '字符串',
    }
    block.add("text", function () {
        this.jsonInit(OperatorsTextJson);
        this.svgGroup_.classList.add('OperatorsBlocks');
    }, {})
    block.code("text", function (block) {
        var text = block.getFieldValue("TEXT")
        var code = `("${text}")`
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
    block.code("math_number", function (block) {
        var num = block.getFieldValue("NUM")
        var code = `(${num})`
        return [code, Blockly.JavaScript.ORDER_ATOMIC]
    })
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
                check: ['String', 'Number'],
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
    // Array
    Blockly.Blocks['list_item'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("项目");
            this.setNextStatement(true, null);
            this.setPreviousStatement(true, null);
            this.setColour(260);
            this.setTooltip('');
            this.setHelpUrl('');
        }
    };
    Blockly.Extensions.registerMutator("array_craete_mutator", {
        itemCount_: 3,
        loadExtraState: function (state) {
            this.itemCount_ = state['itemCount'];
            this.updateShape_();
        },
        saveExtraState: function () {
            return {
                'itemCount': this.itemCount_,
            };
        },
        updateShape_: function () {
            console.log(this)
            if (this.itemCount_ && this.getInput('EMPTY')) {
                this.removeInput('EMPTY');
            } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
                this.appendDummyInput('EMPTY')
                    .appendField("空数组");
            }
            for (let i = 0; i < this.itemCount_; i++) {
                if (!this.getInput('ADD' + i)) {
                    const input = this.appendValueInput('ADD' + i)
                    if (i === 0) {
                        input.appendField("");
                    }
                }
            }
            for (let i = this.itemCount_; this.getInput('ADD' + i); i++) {
                this.removeInput('ADD' + i);
            }
        },
        mutationToDom: function () {
            const container = document.createElement('mutation');
            container.setAttribute('items', this.itemCount_);
            return container;
        },
        domToMutation: function (xmlElement) {
            const items = xmlElement.getAttribute('items');
            if (!items) throw new TypeError('element did not have items');
            this.itemCount_ = parseInt(items, 10);
            this.updateShape_();
        },
        decompose: function (workspace) {
            const containerBlock = workspace.newBlock('lists_create_with_container');
            containerBlock.initSvg();
            console.log(containerBlock.getInput('STACK'))
            let connection = containerBlock.getInput('STACK').connection;
            for (let i = 0; i < this.itemCount_; i++) {
                const itemBlock = workspace.newBlock('lists_create_with_item');
                itemBlock.initSvg();
                if (!itemBlock.previousConnection) {
                    throw new Error('itemBlock has no previousConnection');
                }
                connection.connect(itemBlock.previousConnection);
                connection = itemBlock.nextConnection;
            }
            return containerBlock;
        },
        compose: function (containerBlock) {
            let itemBlock = containerBlock.getInputTargetBlock('STACK');
            const connections = [];
            while (itemBlock) {
                if (itemBlock.isInsertionMarker()) {
                    itemBlock = itemBlock.getNextBlock();
                    continue;
                }
                connections.push(itemBlock.valueConnection_);
                itemBlock = itemBlock.getNextBlock();
            }
            for (let i = 0; i < this.itemCount_; i++) {
                const connection = this.getInput('ADD' + i).connection.targetConnection;
                if (connection && !connections.includes(connection)) {
                    connection.disconnect();
                }
            }
            this.itemCount_ = connections.length;
            this.updateShape_();
            for (let i = 0; i < this.itemCount_; i++) {
                connections[i]?.reconnect(this, 'ADD' + i);
            }
        },
        saveConnections: function (containerBlock) {
            let itemBlock = containerBlock.getInputTargetBlock('STACK');
            let i = 0;
            while (itemBlock) {
                if (itemBlock.isInsertionMarker()) {
                    itemBlock = itemBlock.getNextBlock();
                    continue;
                }
                const input = this.getInput('ADD' + i);
                itemBlock.valueConnection_ = input?.connection.targetConnection;
                itemBlock = itemBlock.getNextBlock();
                i++;
            }
        },
    }, null, ["list_item"]);
    var ArrayCreateJson = {
        type: 'array_create',
        message0: '数组',
        args0: [],
        output: 'Array',
        tooltip: '创建一个数组',
        mutator: 'array_craete_mutator',
    }
    block.add("array_create", function () {
        this.jsonInit(ArrayCreateJson);
        this.updateShape_();
        this.svgGroup_.classList.add('ArrayBlocks');
    }, {})
    block.code("array_create", function (block, generator) {
        var code;
        var inputs = "";
        for (var i = 0; i < block.itemCount_; i++) {
            var inputName = 'ADD' + i;
            var inputCode = Blockly.JavaScript.valueToCode(block, inputName, Blockly.JavaScript.ORDER_NONE) || null;
            inputs += inputCode + `${i == block.itemCount_ - 1 ? '' : ', '}`;
        }
        code = `[${inputs}]`;
        return code;
    })
    Blockly.Blocks["lists_create_with"] = {
        init: function () {
            this.jsonInit(ArrayCreateJson)
            this.svgGroup_.classList.add('ArrayBlocks');
        }
    };
    var ArrayGetJson = {
        type: 'array_get',
        message0: '获取数组 %1 第 %2 项',
        args0: [
            {
                type: 'input_value',
                name: 'LIST',
                check: 'Array'
            },
            {
                type: 'input_value',
                name: 'INDEX',
                value: 1
            },
        ],
        output: 'Number',
        tooltip: '获取数组指定位置的值',
        colour: 230,
        category: 'Array',
        inputsInline: true,
        tooltip: "获取数组指定位置的值，第1项的索引从0开始",
    }
    Blockly.Blocks["array_get"] = {
        init: function () {
            this.jsonInit(ArrayGetJson)
            this.svgGroup_.classList.add('ArrayBlocks');
        }
    };
    block.code("array_get", function (block, generator) {
        var list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_MEMBER) || null;
        var index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_NONE) || 0;
        return [`${list}[${index}]`, Blockly.JavaScript.ORDER_ATOMIC];
    })
    var ArraySetJson = {
        type: 'array_set',
        message0: '设置数组 %1 第 %2 项 为 %3',
        args0: [
            {
                type: 'input_value',
                name: 'LIST',
                check: 'Array'
            },
            {
                type: 'input_value',
                name: 'INDEX',
                check: 'Number',
                value: 1
            },
            {
                type: 'input_value',
                name: 'VALUE',
            },
        ],
        previousStatement: null,
        nextStatement: null,
        category: 'Array',
        inputsInline: true,
        tooltip: "设置数组指定位置的值，第1项的索引从0开始",
    }
    Blockly.Blocks["array_set"] = {
        init: function () {
            this.jsonInit(ArraySetJson)
            this.svgGroup_.classList.add('ArrayBlocks');
        }
    };
    block.code("array_set", function (block, generator) {
        var list = Blockly.JavaScript.valueToCode(block, 'LIST', Blockly.JavaScript.ORDER_MEMBER) || null;
        var index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_NONE) || 0;
        var value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_NONE) || 0;
        return `${list}[${index}] = ${value};`;
    })

    console.log("blockLoad")
    document.dispatchEvent(blockLoad)
})