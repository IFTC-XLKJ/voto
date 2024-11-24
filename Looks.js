class Looks {
    constructor() { }
    set_background(img) {
        const preRun = document.querySelector("[data-type=\"run\"]")
        if (img && img.trim()) {
            preRun.style.backgroundImage = `url(${img})`;
        } else {
            preRun.style.backgroundImage = ``;
        }
    }
}