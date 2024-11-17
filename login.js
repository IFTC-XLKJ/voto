window.isLogin = false
onload = () => {
    const toast = new Toast();
    const Submit = document.querySelector(".submit>button");
    var vvzh = new pgdbs(dbs_a6b2a4d6c02022e831626d31ab805a468a151b90d5161660485a73cc6e1ea902);
    setInterval(async () => {
        if (localStorage.getItem("token") && localStorage.getItem("UID") && localStorage.getItem("PWD") && isLogin != 10 && !isLogin) {
            isLogin = true
            toast.warn("你已登录过了，无法重复登录", 500)
            await new Promise(resolve => setTimeout(resolve, 500))
            if (location.hash) {
                window.location.href = location.hash.slice(1);
            } else {
                window.location.href = "home";
            }
        }
    }, 200)
    Submit.onclick = (e) => {
        e.preventDefault();
        vvzh.getTableData({
            limit: 1,
            page: 1,
            filter: `ID="${username.value}" OR 昵称="${username.value}" OR 邮箱="${username.value}" AND 密码="${CryptoJS.MD5(password.value)}"`
        }).then(async data => {
            if (data.code == 200) {
                if (data.fields.length == 0) {
                    toast.error("ID/邮箱/ID或密码错误或者该账号不存在", 2000);
                } else {
                    localStorage.setItem("token", data.fields[0].token);
                    localStorage.setItem("UNM", data.fields[0].昵称);
                    localStorage.setItem("UID", data.fields[0].ID);
                    localStorage.setItem("PWD", password.value);
                    toast.success("登录成功", 2000);
                    await new Promise(resolve => setTimeout(resolve, 2000))
                    if (location.hash) {
                        window.location.href = location.hash.slice(1);
                    } else {
                        window.location.href = "home";
                    }
                    isLogin = 10;
                }
            } else {
                toast.error("登录失败，原因" + data.msg);
                console.error(data);
            }
        })
    }
    console.log(vvzh);
}