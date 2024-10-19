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
                    type: "controls_output",
                },
                {
                    kind: "block",
                    type: "controls_clear-output",
                },
            ]
        },
        {
            kind: "category",
            name: "动作",
            contents: [
                {
                    kind: "block",
                    type: "actions_move_forward",
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
                    type: "variables_get",
                },
            ]
        },
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
    ["角色-8", ""],
    ["角色-9", ""],
    ["角色-10", ""],
    ["角色-11", ""],
]