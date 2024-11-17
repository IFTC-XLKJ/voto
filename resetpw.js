let Email = ""
let isVerify = false

onload = () => {
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
            ajax(json, "customize_sand", data => {
                if (data.status == "1") {
                    Email = email.value
                    alert("验证码已发送，请查看邮箱")
                } else {
                    alert(data.msg)
                }
            })
        } else {
            alert('邮箱格式不正确')
        }
    }
    verifyCode.oninput = () => {
        if (typeof Number(verifyCode.value) != "number") {
            verifyCode.value = ""
            alert("请输入正确的验证码格式")
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
                    alert("验证失败")
                }
            })
        }
    }
    Submit.onclick = e => {
        e.preventDefault()
        if (isVerify) {
            vvzh.setTableData({
                type: "UPDATE",
                filter: `邮箱="${Email}"`,
                fields: `密码="${CryptoJS.MD5(password.value)}"`
            }).then(data => {
                if (data.code == 200) {
                    alert("重置成功")
                    window.location.href = "login.html"
                } else {
                    alert("重置失败")
                }
            })
        } else {
            alert("请先验证邮箱")
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