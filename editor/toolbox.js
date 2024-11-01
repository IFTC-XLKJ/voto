window.toolbox = {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "category",
            name: "事件",
            contents: [
                {
                    kind: "block",
                    type: "events_when_start",
                },
                {
                    kind: "block",
                    type: "events_role_event",
                },
            ]
        },
        {
            kind: "category",
            name: "控制",
            contents: [
                {
                    kind: "block",
                    type: "controls_repeat",
                    colour: "#68CDFFFF",
                },
                {
                    kind: "block",
                    type: "controls_if",
                },
                {
                    kind: "block",
                    type: "controls_wait",
                },
                {
                    kind: "block",
                    type: "controls_output",
                },
                {
                    kind: "block",
                    type: "controls_clear-output",
                },
                {
                    kind: "block",
                    type: "controls_comment",
                },
            ]
        },
        {
            kind: "category",
            name: "动作",
            contents: [
                {
                    kind: "block",
                    type: "actions_move",
                },
            ]
        },
        {
            kind: "category",
            name: "外观",
            contents: [
                {
                    kind: "block",
                    type: "looks_set_background_img",
                },
            ]
        },
        {
            kind: "category",
            name: "运算",
            contents: [
                {
                    kind: "block",
                    type: "text",
                },
                {
                    kind: "block",
                    type: "math_number",
                },
                {
                    kind: "block",
                    type: "text_join",
                },
                {
                    kind: "block",
                    type: "math_simple_operator",
                },
            ]
        },
        {
            kind: "category",
            name: "变量",
            contents: [
                {
                    kind: "button",
                    text: "创建变量",
                    callbackKey: "createVar",
                    "web-class": "createVar"
                },
                {
                    kind: "block",
                    type: "variables_set",
                },
                {
                    kind: "block",
                    type: "variables_setter",
                },
                {
                    kind: "block",
                    type: "variables_get",
                },
            ]
        },
        {
            kind: "category",
            name: "列表",
            contents: [
                {
                    kind: "block",
                    type: "lists_create_with",
                },
            ]
        }
    ]
}

const defaultRoles = [
    ["角色-1", "https://static.codemao.cn/IFTC-Studio/B13WJr-gye.jpg"],
    ["角色-2", "https://static.codemao.cn/IFTC-Studio/HkfYJHZeJx.jpg"],
    ["角色-3", "https://static.codemao.cn/IFTC-Studio/SkO31rZxyl.jpg"],
    ["角色-4", "https://static.codemao.cn/IFTC-Studio/HJeNlH-gJl.jpg"],
    ["角色-5", "https://static.codemao.cn/IFTC-Studio/B1tBgHZgyx.jpg"],
    ["角色-6", "https://static.codemao.cn/IFTC-Studio/SyiUgBbeJl.jpg"],
    ["角色-7", "https://static.codemao.cn/IFTC-Studio/SJ9YxBbeye.jpg"],
    ["角色-8", "https://static.codemao.cn/IFTC-Studio/BJEhxBbxke.jpg"],
    ["角色-9", "https://static.codemao.cn/IFTC-Studio/HyNTxrWlyx.jpg"],
    ["角色-10", "https://static.codemao.cn/IFTC-Studio/Hkx1-Hbxke.jpg"],
    ["角色-11", "https://static.codemao.cn/IFTC-Studio/ryKb-H-lJl.jpg"],
    ["角色-12", "https://static.codemao.cn/IFTC-Studio/Hy6f-Hbgyl.jpg"],
    ["角色-13", "https://static.codemao.cn/IFTC-Studio/SJLN-BZlJl.jpg"],
    ["角色-14", "https://static.codemao.cn/IFTC-Studio/ryDHZBZxJe.jpg"],
    ["角色-15", "https://static.codemao.cn/IFTC-Studio/B1sUZHWgyl.jpg"],
    ["角色-16", "https://static.codemao.cn/IFTC-Studio/HkhvWB-xke.jpg"],
    ["角色-17", "https://static.codemao.cn/IFTC-Studio/By5uZSWg1l.jpg"],
    ["角色-18", "https://static.codemao.cn/IFTC-Studio/SyKKWrZxyx.jpg"],
    ["角色-19", "https://static.codemao.cn/IFTC-Studio/ryfiZHZeyg.jpg"],
    ["角色-20", "https://static.codemao.cn/IFTC-Studio/r1zhWrZxyl.jpg"],
    ["角色-21", "https://static.codemao.cn/IFTC-Studio/rJB6WrWgkg.jpg"],
    ["角色-22", "https://static.codemao.cn/IFTC-Studio/SyV0WrZekl.jpg"],
]