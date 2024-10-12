addEventListener("load", () => {
    const New = document.getElementById("new")
    New.addEventListener("click", () => {
        location.href = "/editor"
    })
    const Navs = document.querySelectorAll(".nav")
    Navs.forEach(Nav => {
        Nav.addEventListener("click", () => {
            location.href = `/${Nav.dataset.nav}`
        })
    })
})