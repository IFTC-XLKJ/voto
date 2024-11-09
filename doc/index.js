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
            })
            .catch(error => {
                docContent = "Error: " + error;
            });
    } else {
        docContent = doc.Error;
    }
}