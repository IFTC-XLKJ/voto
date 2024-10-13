class Console {
    constructor(preview) {
        this.preview = preview;
        this.events = {};
        function isElement(obj) {
            return obj instanceof HTMLElement;
        }
        if (!isElement(this.preview)) {
            throw new Error(
                "缂傚倷鐒﹂〃蹇涘礂濞戞氨鍗氶悗娑欘焽閳绘梹銇勮箛鎾愁仼婵☆偅锕㈤弻鈩冩媴閻熼偊妫嗛柣鐐村嚬閸嬪﹤鐣烽崷顓涘亾閿濆簼绨界紒鐘冲灥椤啴濡堕崼顐㈡暯闁荤姵鍔楅崰鏍х暦濡ゅ懎绀冩い蹇撴－濡??"
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
            this.preview.className = "csl-ul"
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
