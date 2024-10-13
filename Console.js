class Console {
    constructor(preview) {
        this.preview = preview;
        this.events = {};
        function isElement(obj) {
            return obj instanceof HTMLElement;
        }
        if (!isElement(this.preview)) {
            throw new Error(
                "缂備焦顨忛崗娑氱博鐎涙鈻旀い蹇撳濡﹢鏌℃担鐟邦棆閻炴凹鍋婂畷鍦偓锝庝簽缁犳垵顪冮妶鍫敽閻犳劗鍠栧畷妤呭礃椤忓棭妲?"
            );
        } else {
            var CslStyle = document.createElement("style");
            CslStyle.innerText = ``;
            CslStyle.dataset.name = "Console-Style";
            document.head.appendChild(CslStyle);
            var CslDrag = document.createElement("div");
            CslDrag.className = "csl-drag";
            this.preview.appendChild(CslDrag);
            var CslUL = document.createElement("ul");
            this.preview.appendChild(CslUL);
            this.console = CslUL;
            this.#emit("onload", { Element: CslUL });
        }
    }
    log(text) {
        var log = document.createElement("li");
        log.className = "console-log";
        this.preview.appendChild(log);
        this.preview.scrollTop = this.preview.scrollHeight;
    }
    print(text) {}
    warn(text) {}
    error(text) {}
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
        const callbacks = this.events[type];
        for (const callback of callbacks) {
            try {
                callback.call(this, new EventObject(e));
            } catch (e) {
                console.error(String(e));
            }
        }
    }
}
