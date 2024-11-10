window.isLogin = false
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
    if (localStorage.getItem("token")) {
        isLogin = true
    } else {
        var loginBtn = document.createElement("button")
        loginBtn.innerText = "你还未登录，点击登录"
        loginBtn.style.cssText = "width:280px;height:40px;margin:20px auto;background-color: #007BFF;color: #fff;border: none;border-radius: 4px;cursor: pointer;font-size: 16px;display: flex;justify-content: center;align-items: center;"
        loginBtn.onclick = () => {
            location.href = "/login.html#home"
        }
        works.appendChild(loginBtn)
    }
})