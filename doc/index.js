import * as markdownIt from '../node_modules/markdown-it/dist/markdown-it.min.js';
const docs = [
    {
        name: "目录",
        url: "目录.md"
    },
    {
        name: "介绍",
        url: "介绍.md"
    },
]
function getURLParameters() {
    const queryString = window.location.search.substring(1);
    const params = {};

    if (queryString) {
        queryString.split('&').forEach(param => {
            const [key, value] = param.split('=');
            params[key] = decodeURIComponent(value);
        });
    }

    return params;
}
const urlParams = getURLParameters();
console.log(urlParams.doc)
const doc = docs.filter(doc => doc.name == urlParams.doc)[0] || {
    Error: "No such document\n未找到该文档"
};
var docContent = "";
onload = () => {
    console.log(markdownit)
    const md = markdownit({
        html: true,
        linkify: true,
        typographer: true,
    });

    if (!doc.Error) {
        fetch(doc.url)
            .then(response => response.text())
            .then(text => {
                docContent = text;
                document.body.innerHTML = md.render(docContent);
                var back = document.createElement("a")
                back.className = "back"
                back.innerText = "返回目录"
                back.href = "?doc=目录"
                document.body.appendChild(back)
                if (docs.indexOf(doc) != 0) {
                    var prev = document.createElement("a")
                    prev.className = "prev"
                    prev.innerText = "上一页 " + docs[docs.indexOf(doc) - 1].name
                    prev.href = "?doc=" + docs[docs.indexOf(doc) - 1].name
                    document.body.appendChild(prev)
                }
                if (docs.indexOf(doc) != docs.length - 1) {
                    var next = document.createElement("a")
                    next.className = "next"
                    next.innerText = "下一页 " + docs[docs.indexOf(doc) + 1].name
                    next.href = "?doc=" + docs[docs.indexOf(doc) + 1].name
                    document.body.appendChild(next)
                }
                var h1s = document.querySelectorAll("h1");
                h1s.forEach(h1 => {
                    h1.setAttribute("iftc-h1", `{ "text": "${h1.innerText.replace(/"/g, '\\"')}" }`)
                });
                var h2s = document.querySelectorAll("h2");
                h2s.forEach(h2 => {
                    h2.setAttribute("iftc-h2", `{ "text": "${h2.innerText.replace(/"/g, '\\"')}" }`)
                });
                var h3s = document.querySelectorAll("h3");
                h3s.forEach(h3 => {
                    h3.setAttribute("iftc-h3", `{ "text": "${h3.innerText.replace(/"/g, '\\"')}" }`)
                });
                var h4s = document.querySelectorAll("h4");
                h4s.forEach(h4 => {
                    h4.setAttribute("iftc-h4", `{ "text": "${h4.innerText.replace(/"/g, '\\"')}" }`)
                });
                var h5s = document.querySelectorAll("h5");
                h5s.forEach(h5 => {
                    h5.setAttribute("iftc-h5", `{ "text": "${h5.innerText.replace(/"/g, '\\"')}" }`)
                });
                var h6s = document.querySelectorAll("h6");
                h6s.forEach(h6 => {
                    h6.setAttribute("iftc-h6", `{ "text": "${h6.innerText.replace(/"/g, '\\"')}" }`)
                });
                var ps = document.querySelectorAll("p");
                ps.forEach(p => {
                    p.setAttribute("iftc-p", `{ "text": "${p.innerText.replace(/"/g, '\\"')}" }`)
                });
                var imgs = document.querySelectorAll("img");
                imgs.forEach(img => {
                    img.setAttribute("iftc-img", `{ "src": "${img.src}" }`)
                });
                var links = document.querySelectorAll("a");
                links.forEach(link => {
                    link.setAttribute("iftc-a", `{ "href": "${link.href}", "text": "${link.innerText.replace(/"/g, '\\"')}" }`)
                });
                var tables = document.querySelectorAll("table");
                tables.forEach(table => {
                    var rows = table.querySelectorAll("tr");
                    var rowData = [];
                    rows.forEach(row => {
                        var cells = row.querySelectorAll("td");
                        var cellData = [];
                        cells.forEach(cell => {
                            cellData.push(cell.innerText.replace(/"/g, '\\"'));
                        });
                        rowData.push(cellData);
                    })
                })
            })
            .catch(error => {
                docContent = "Error: " + error;
            });
    } else {
        docContent = doc.Error;
    }
    document.oncontextmenu = function (e) {
        e.preventDefault();
        document.querySelectorAll(".menu").forEach(menu => {
            menu.remove();
        });
        var menuDiv = document.createElement("div");
        menuDiv.className = "menu";
        document.body.appendChild(menuDiv);
        if (e.target.tagName == "IMG") {
            var imgSrc = e.target.src;
            var imgMenu = document.createElement("div");
            imgMenu.className = "imgMenu";
            imgMenu.innerText = "查看图片"
            imgMenu.onclick = () => {
                window.open(imgSrc);
            }
            menuDiv.appendChild(imgMenu);
            addHr();
            var imgCopyMenu = document.createElement("div");
            imgCopyMenu.className = "imgCopyMenu";
            imgCopyMenu.innerText = "复制图片"
            imgCopyMenu.onclick = () => {
                async function copyImage() {
                    const image = document.getElementById('imageToCopy');
                    try {
                        const response = await fetch(imgSrc);
                        const blob = await response.blob();
                        const objectUrl = URL.createObjectURL(blob);
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(new Blob([blob], { type: 'image/jpeg' }));
                        navigator.clipboard.write([new ClipboardItem(dataTransfer.items)]);
                        console.log('Image copied to clipboard!');
                    } catch (error) {
                        console.error('Failed to copy image:', error);
                    }
                }
            }
            menuDiv.appendChild(imgCopyMenu);
        }
        if (menuDiv.offsetLeft + menuDiv.offsetWidth > document.body.offsetWidth) {
            menuDiv.style.left = (document.body.offsetWidth - menuDiv.offsetWidth) + "px";
        }
        menuDiv.style.left = e.clientX + "px";
        menuDiv.style.top = e.clientY + "px";
        document.onclick = () => {
            menuDiv.remove();
        }
        function addHr() {
            var hr = document.createElement("hr");
            hr.className = "menuHr";
            menuDiv.appendChild(hr);
        }
        return false;
    };
}