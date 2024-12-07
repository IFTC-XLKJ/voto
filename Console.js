/**
 * Console.js
 * @author IFTC
 * @description 输出控制台
 * @version 1.0.0
 * @license MIT
 * @copyright 2023 IFTC
 */

/**
 * 日志输出
 * @param {string} text 内容
 * @param {boolean} system 是否为系统消息
 */

class Console {
    constructor(preview, isDrag) {
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
                position: sticky;
                top: 0;
                left: 0;
            }
            .csl {
                width: 100%;
                height: calc(100% - 10px);
                padding: 5px;
                margin: 5px;
                background-color: #eee;
                position: fixed;
                top: 65px;
                right: 5px;
                z-index: 9999999999;
            }
            .csl-ul {
                height: calc(100% - 10px);
                list-style: none;
                padding: 0;
                margin: 0;
                overflow-y: scroll;
            }
            .console-log {
                padding: 5px;
                color: #ccc;
            }
            .console-print {
                padding: 5px;
                color: #50d750;
            }
            .console-error {
                padding: 5px;
                color: #d70909;
            }
            .console-warn {
                padding: 5px;
                color: #fac310;
            }
            .line:hover {
                background-color: #76cdff60;
                border-radius: 5px;
                cursor: pointer;
            }
            `;
            CslStyle.dataset.name = "Console-Style";
            document.head.appendChild(CslStyle);
            this.preview.className = "csl";
            if (isDrag) {
                var CslDrag = document.createElement("div");
                CslDrag.className = "csl-drag";
                this.preview.appendChild(CslDrag);
                var CslUL = document.createElement("ul");
                CslUL.className = "csl-ul";
                this.preview.appendChild(CslUL);
            }
            this.console = document.querySelector("ul.csl-ul");
            if (isDrag) {
                var isDragging = false;
                var initialOffset = { x: 0, y: 0 };
                var dragStartPos = { x: 0, y: 0 };
                var newX = 0;
                var newY = 0;
                var CX = 0;
                var CY = 0;
                CslDrag.addEventListener("touchstart", function (e) {
                    e.preventDefault();
                    dragStartPos.x = e.clientX;
                    dragStartPos.y = e.clientY;
                    initialOffset.x = preview.offsetLeft;
                    initialOffset.y = preview.offsetTop;
                    document.addEventListener('touchmove', onMouseMove);
                    document.addEventListener('touchend', onMouseUp);
                })
                CslDrag.addEventListener('mousedown', function (e) {
                    e.preventDefault();
                    dragStartPos.x = e.clientX;
                    dragStartPos.y = e.clientY;
                    initialOffset.x = preview.offsetLeft;
                    initialOffset.y = preview.offsetTop;
                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                });
                function onMouseMove(e) {
                    isDragging = true;
                    CX = e.clientX - dragStartPos.x;
                    CY = e.clientY - dragStartPos.y;
                    newX = initialOffset.x + e.clientX - dragStartPos.x;
                    newY = initialOffset.y + e.clientY - dragStartPos.y;
                    newY = newY - 5;
                    preview.style.left = newX + 'px';
                    preview.style.top = newY + 'px';
                }

                function onMouseUp() {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    document.removeEventListener('touchmove', onMouseMove);
                    document.removeEventListener('touchend', onMouseUp);
                    isDragging = false;
                }
            }
            this.#emit("onload", { Element: CslUL });
        }
    }
    log(text, system) {
        var log = document.createElement("li");
        log.className = "console-log line";
        log.innerHTML = `<p style="display: inline;user-select: none;margin: 0;">[日志] </p>${system ? String(text) : String(text).replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\n", "<br>")}`;
        this.console.appendChild(log);
        log.scrollIntoView({
            behavior: 'smooth'
        })
        log.oncontextmenu = function (e) {
            e.preventDefault();
            navigator.clipboard.writeText(text)
                .then(() => {
                    const toast = new Toast();
                    toast.success("复制成功", 2000);
                })
                .catch((err) => {
                    console.error('Failed to copy text: ', err);
                });
        }
        this.#check();
    }
    print(text) {
        var print = document.createElement("li");
        print.className = "console-print line";
        print.innerHTML = `<p style="display: inline;user-select: none;margin: 0;">[打印] </p>${String(text).replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\n", "<br>")}`;
        this.console.appendChild(print);
        print.scrollIntoView({
            behavior: 'smooth'
        })
        print.oncontextmenu = function (e) {
            e.preventDefault();
            navigator.clipboard.writeText(text)
                .then(() => {
                    const toast = new Toast();
                    toast.success("复制成功", 2000);
                })
                .catch((err) => {
                    console.error('Failed to copy text: ', err);
                });
        }
        this.#check();
    }
    warn(text) {
        var warn = document.createElement("li");
        warn.className = "console-warn line";
        warn.innerHTML = `<p style="display: inline;user-select: none;margin: 0;">[警告] </p>${String(text).replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\n", "<br>")}`;
        this.console.appendChild(warn);
        warn.scrollIntoView({
            behavior: 'smooth'
        })
        warn.oncontextmenu = function (e) {
            e.preventDefault();
            navigator.clipboard.writeText(text)
                .then(() => {
                    const toast = new Toast();
                    toast.success("复制成功", 2000);
                })
                .catch((err) => {
                    console.error('Failed to copy text: ', err);
                });
        }
        this.#check();
    }
    error(text, line) {
        var error = document.createElement("li");
        error.className = "console-error line";
        if (line) {
            error.title = line;
        }
        error.innerHTML = `<p style="display: inline;user-select: none;margin: 0;">[错误] </p>${String(text).replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\n", "<br>")}`;
        this.console.appendChild(error);
        error.scrollIntoView({
            behavior: 'smooth'
        })
        error.oncontextmenu = function (e) {
            e.preventDefault();
            navigator.clipboard.writeText(text)
                .then(() => {
                    const toast = new Toast();
                    toast.success("复制成功", 2000);
                })
                .catch((err) => {
                    console.error('Failed to copy text: ', err);
                });
        }
        this.#check();
    }
    clear() {
        this.console.innerHTML = "";
        this.log("<em>控制台已清空</em>", true)
    }
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
    #check() {
        const num = this.console.querySelectorAll("li").length;
        if (num == 99) {
            this.warn(`注意：控制台输出100条记录`)
        } else if (num == 199) {
            this.warn(`注意：控制台输出200条记录`)
        } else if (num == 199) {
            this.warn(`注意：控制台输出300条记录`)
        } else if (num == 299) {
            this.warn(`注意：控制台输出400条记录`)
        } else if (num == 399) {
            this.warn(`注意：控制台输出500条记录`)
        } else if (num == 499) {
            this.warn(`注意：控制台输出600条记录`)
        } else if (num == 599) {
            this.warn(`注意：控制台输出700条记录`)
        } else if (num == 699) {
            this.warn(`注意：控制台输出800条记录`)
        } else if (num == 799) {
            this.warn(`注意：控制台输出900条记录`)
        } else if (num == 899) {
            this.warn(`注意：控制台输出1000条记录`)
        } else if (num == 999) {
            this.warn(`注意：控制台输出1100条记录`)
        } else if (num == 1999) {
            this.warn(`注意：控制台输出1200条记录`)
        } else if (num == 2999) {
            this.warn(`注意：控制台输出1300条记录`)
        } else if (num == 3999) {
            this.warn(`注意：控制台输出1400条记录`)
        } else if (num == 4999) {
            this.warn(`注意：控制台输出1500条记录`)
        } else if (num == 5999) {
            this.warn(`注意：控制台输出1600条记录`)
        } else if (num == 6999) {
            this.warn(`注意：控制台输出1700条记录`)
        } else if (num == 7999) {
            this.warn(`注意：控制台输出1800条记录`)
        } else if (num == 8999) {
            this.warn(`注意：控制台输出1900条记录`)
        } else if (num == 9999) {
            this.warn(`注意：控制台输出2000条记录`)
        } else if (num > 10000) {
            this.clear();
            this.warn(`记录超过10000条，已自动清理`)
        }
    }
}