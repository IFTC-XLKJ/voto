onload = () => {
    const Submit = document.querySelector(".submit>button");
    var vvzh = new pgdbs(dbs_a6b2a4d6c02022e831626d31ab805a468a151b90d5161660485a73cc6e1ea902);
    if (localStorage.getItem("token") && localStorage.getItem("UID") && localStorage.getItem("PWD")) {
        window.location.href = "editor";
    }
    console.log(vvzh);
}