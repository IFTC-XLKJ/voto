class Console {
    constructor(preview) {
        this.preview = preview;
        this.events = {};
        function isElement(obj) {
            return obj instanceof HTMLElement;
        }
        if (!isElement(this.preview)) {
            throw new Error("第一个参数必须为元素");
        } else {
            var CslStyle = document.createElement("style");
            CslStyle.innerText = `.csl-drag {
                width: calc(100% - 10px);
                height: 7px;
                padding: 0;
                margin: 5px;
                border-radius: 5px;
                background-color: #ccc;
                cursor: move;
            }
            .csl-ul {
                width: 100%;
                height: calc(100% - 10px);
                padding: 5px;
                margin: 5px;
                background-color: #eee;
                overflow-y: scroll;
                position: fixed;
                top: 0;
                left: 0;
                z-index: 9999999999
            }
            `;
            CslStyle.dataset.name = "Console-Style";
            document.head.appendChild(CslStyle);
            var CslDrag = document.createElement("div");
            CslDrag.className = "csl-drag";
            this.preview.appendChild(CslDrag);
            var CslUL = document.createElement("ul");
            this.preview.className = "csl-ul";
            this.preview.appendChild(CslUL);
            this.console = CslUL;
            var isDragging = false;
            var initialOffset = { x: 0, y: 0 };
            var dragStartPos = { x: 0, y: 0 };
            var newX = 0;
            var newY = 0;
            var CX = 0;
            var CY = 0;
            CslDrag.addEventListener('mousedown', function (e) {
                console.log(isDragging)
                e.preventDefault();
                dragStartPos.x = e.clientX;
                dragStartPos.y = e.clientY;
                initialOffset.x = preview.offsetLeft;
                initialOffset.y = preview.offsetTop;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
            function onMouseMove(e) {
                console.log(isDragging);
                isDragging = true;
                CX = e.clientX - dragStartPos.x;
                CY = e.clientY - dragStartPos.y;
                newX = initialOffset.x + e.clientX - dragStartPos.x;
                newY = initialOffset.y + e.clientY - dragStartPos.y;
                console.log(newX, newY)
                preview.style.left = newX + 'px';
                preview.style.top = newY + 'px';
            }

            function onMouseUp() {
                console.log(isDragging)
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                isDragging = false;
            }
            this.#emit("onload", { Element: CslUL });
        }
    }
    log(text) {
        var log = document.createElement("li");
        log.className = "console-log";
        this.preview.appendChild(log);
        this.preview.scrollTop = this.preview.scrollHeight;
    }
    print(text) { }
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
