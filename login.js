onload = () => {
    const Submit = document.querySelector(".submit>button");
    var vvzh = new pgdbs(dbs_a6b2a4d6c02022e831626d31ab805a468a151b90d5161660485a73cc6e1ea902);
    if (localStorage.getItem("token") && localStorage.getItem("UID") && localStorage.getItem("PWD")) {
        window.location.href = "editor";
    }
    Submit.onclick = (e) => {
        e.preventDefault();
        vvzh.getTableData({
            limit: 1,
            page: 1,
            filter: `ID="${document.querySelector("#ID").value}" AND 密码="${CryptoJS.MD5(document.querySelector("#PWD").value)}"`
        }).then(data => {
            if (data.fields.length == 0) {
                alert("账号不存在");
            }
        })
    }
    console.log(vvzh);
}