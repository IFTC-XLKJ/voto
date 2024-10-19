window.workId = ""
const isNew = () => {
    return /^__.*__$/.test(workId)
}

addEventListener("load", () => {
    preview.style.width = `${innerWidth}px`
    preview.style.height = `${(innerWidth / 16) * 9}px`
    onmessage = (e) => {
        if (e.data.type) {
            console.log(e.data)
            if (e.data.type == "init") {
                workId = e.data.workId
                location.search = `?workId=${workId}`
                postMessage({
                    type: "reply",
                    success: true
                })
            }
            if (e.data.id == workId) {
                if (e.data.type === "reply") {
                    if (e.data.success) {
                        console.log("success")
                    } else {
                        console.log("fail")
                    }
                } else if (e.data.type === "run") {
                    preview.dataset.operation = "run"
                    postMessage({ type: "run", workId: workId })
                } else if (e.data.type === "stop") {
                    preview.dataset.operation = "edit"
                }
            }
        }
    }
})

addEventListener("resize", () => {
    preview.style.width = `${innerWidth}px`
    preview.style.height = `${(innerWidth / 16) * 9}px`
})