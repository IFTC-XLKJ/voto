addEventListener("load", () => {
    const New = document.getElementById("new")
    New.addEventListener("click", () => {
        location.href = "/editor"
    })
    const Home = document.getElementById(`[data-nav="home"]`)
    Home.addEventListener("click", () => {
        location.reload();
    })
})