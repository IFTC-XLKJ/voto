let Email = ""
let isVerify = false

onload = () => {
    const toast = new Toast()
    const Submit = document.querySelector(".submit>button");
    var vvzh = new pgdbs(dbs_a6b2a4d6c02022e831626d31ab805a468a151b90d5161660485a73cc6e1ea902);
    email.oninput = e => {
        if (e.target.value.trim().length > 0) {
            sendCode.disabled = false
        } else {
            sendCode.disabled = true
        }
    }
    sendCode.onclick = () => {
        if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g.test(email.value)) {
            let t = Math.round(new Date().getTime() / 1000);
            let json = {
                key: "f7115d5ac87aedd4d42cf510ed064449",
                main: window.btoa(encodeURIComponent(`验证码为 {captcha} ，请在 <div style="display: inline;color: red;">2分钟</div> 内填写`)),
                to: email.value,
                count: 6,
                expired: 120,
                title: "VV账号注册验证码",
                t: t,
            }
            const id = toast.loading("发送中")
            ajax(json, "customize_sand", data => {
                if (data.status == "1") {
                    Email = email.value
                    toast.loadend(id)
                    toast.success("验证码已发送，请查看邮箱", 2000)
                } else {
                    toast.loadend(id)
                    toast.error(data.msg, 2000)
                }
            })
        } else {
            toast.warn('邮箱格式不正确', 2000)
        }
    }
    verifyCode.oninput = () => {
        if (typeof Number(verifyCode.value) != "number") {
            verifyCode.value = ""
            toast.warn("请输入正确的验证码格式", 2000)
        } else {
            let t = Math.round(new Date().getTime() / 1000);
            let json = {
                "identity": Email,
                "code": verifyCode.value,
            }
            ajax(json, "customize", data => {
                if (data.code == 200) {
                    sendCode.disabled = true
                    verifyCode.disabled = true
                    isVerify = true
                } else {
                    toast.error("验证失败", 2000)
                }
            })
        }
    }
    Submit.onclick = e => {
        e.preventDefault()
        if (isVerify) {
            const id = toast.loading("重置中")
            vvzh.setTableData({
                type: "UPDATE",
                filter: `邮箱="${Email}"`,
                fields: `密码="${CryptoJS.MD5(password.value)}"`
            }).then(data => {
                if (data.code == 200) {
                    toast.loadend(id)
                    toast.success("重置成功", 2000)
                    window.location.href = "login.html"
                } else {
                    toast.loadend(id)
                    toast.error("重置失败", 2000)
                }
            })
        } else {
            toast.warn("请先验证邮箱", 2000)
        }
    }
}
function ajax(json, path, callback) {
    let pgjson = {};
    Object.keys(json).sort().forEach((value) => {
        pgjson[value] = json[value];
    });
    $.ajax("https://coco.codemao.cn/http-widget-proxy/https@SEP@api.pgaot.com/email/" + path, {
        method: "POST",
        data: JSON.stringify(json),
        headers: { "X-Pgaot-Token": SHA256(JSON.stringify(pgjson)).toUpperCase(), "Content-Type": "application/json;charset=UTF-8" },
        crossDomain: true,
        contentType: "application/json",
        success: (result) => {
            callback(JSON.parse(result))
        }
    }
    )
}