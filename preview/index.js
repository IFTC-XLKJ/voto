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
                }
            }
        }
    }
})

addEventListener("resize", () => {
    preview.style.width = `${innerWidth}px`
    preview.style.height = `${(innerWidth / 16) * 9}px`
})