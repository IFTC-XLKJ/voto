import * as markdownit from '../node_modules/markdown-it/dist/markdown-it.min.js';
const docs = [
    {
        name: "介绍",
        url: "介绍.md"
    },
]
onload = () => {
    const md = markdownit({
        html: true,
        linkify: true,
        typographer: true,
    });

    document.body.innerHTML = md.render("# Hello World");
}