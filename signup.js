let Email = ""
let isVerify = false
let Avatar = "https://static.codemao.cn/IFTC-Studio/Syl_QricR.png"
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
    const avatarUpload = document.querySelector(".avatarUpload")
    const url = 'https://api.pgaot.com/user/up_cat_file';
    avatarUpload.onclick = () => {
        avatar.click()
        avatar.onchange = () => {
            const file = avatar.files[0]
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                alert("正在上传头像，请稍等")
                var data = new FormData();
                data.append('path', "IFTC/avatar");
                data.append('file', file);
                $.ajax({
                    type: 'post',
                    url: url,
                    cache: false,
                    processData: false,
                    contentType: false,
                    data: data,
                    success: data => {
                        const json = JSON.parse(data);
                        console.log('success', json)
                        if (json.code == 200) {
                            avatarPreview.src = json.url
                            Avatar = json.url
                            alert('上传成功')
                        } else {
                            alert('上传失败')
                        }
                    },
                    error: data => {
                        alert('上传失败')
                    }
                })
            }
        }
    }
    Submit.onclick = async e => {
        e.preventDefault();
        if (!isVerify) {
            alert("请先验证邮箱")
            return
        }
        if (username.value.trim() == "" && password.value.trim() == "") {
            alert("请输入账号和密码");
        } else {
            vvzh.getTableData({
                limit: 1,
                page: 10000,
                filter: `昵称="${username.value}" OR 邮箱="${username.value}"`
            }).then(async json => {
                if (json.code == 200) {
                    if (json.fields.length == 0) {
                        alert("该邮箱已注册或昵称已存在");
                    } else {
                        const count = data.count
                        await new Promise(resolve => setTimeout(resolve, 200))
                        vvzh.setTableData({
                            type: "INSERT",
                            filter: "ID,昵称,头像,V币,邮箱,密码",
                            fields: `(${count},"${username.value.trim()}}","${Avatar}",0,"${email.value}","${crypto.MD5(password.value)}")`
                        }).then(data => {

                        })
                    }
                } else {
                    alert("发生错误，请稍后再试");
                }
            })
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