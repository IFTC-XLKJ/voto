class Console {
    constructor(preview) {
        this.preview = preview
        this.events = {};
        function isElement(obj) {
            return obj instanceof HTMLElement;
        }
        if (!isElement(this.preview)) {
            throw new Error("第一个参数类型必须为元素");
        } else {
            var CslStyle = document.createElement("style");
            CslStyle.innerText = ``;
            CslStyle.dataset.name = "Console-Style";
            document.head.appendChild(CslStyle);
            var CslUL = document.createElement("ul");
            this.preview.appendChild(CslUL);
            this.console = CslUL;
            this.#emit("onload", { Element: CslUL })
        }
    }
    log(text) { }
    warn(text) { }
    error(text) { }
    on(type, callback) {
        if (!this.events[type]) {
            this.events[type] = [];
        }
        this.events[type].push(callback);
    }
    #emit(type, e) {
        if (!this.events[type]) {
            return 0;
        }
        const callbacks = this.events[type]
        for (const callback of callbacks) {
            try {
                callback.call(this, new EventObject(e));
            } catch (e) {
                console.error(String(e));
            }
        };
    }
}