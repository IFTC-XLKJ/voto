onload = () => {
    const Submit = document.querySelector(".submit>button");
    var vvzh = new pgdbs(dbs_a6b2a4d6c02022e831626d31ab805a468a151b90d5161660485a73cc6e1ea902);
    if (localStorage.getItem("token") && localStorage.getItem("UID") && localStorage.getItem("PWD")) {
        window.location.href = "home";
        alert("你已登录过了，无法重复登录")
    }
    console.log(CryptoJS.MD5("123456"));
    Submit.onclick = (e) => {
        e.preventDefault();
        vvzh.getTableData({
            limit: 1,
            page: 1,
            filter: `ID="${username.value}" OR 昵称="${username.value}" OR 邮箱="${username.value}" AND 密码="${CryptoJS.MD5(password.value)}"`
        }).then(data => {
            if (data.fields.length == 0) {
                alert("ID/邮箱/ID或密码错误或者该账号不存在");
            } else {
                localStorage.setItem("token", data.fields[0].token);
                localStorage.setItem("UNM", data.fields[0].昵称);
                localStorage.setItem("UID", data.fields[0].ID);
                localStorage.setItem("PWD", password.value);
                if (location.hash) {
                    window.location.href = location.hash.slice(1);
                } else {
                    window.location.href = "home";
                }
                alert("登录成功");
            }
        })
    }
    console.log(vvzh);
}