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