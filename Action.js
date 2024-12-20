class Action {
    #getPer(role) {
        return Number(role.style.left.slice(0, -1));
    }
    constructor() {
        this.rolesId = workdata.roleData.map(role => role.id);
        this.roles = {};
        this.rolesId.forEach(id => {
            const preRun = document.querySelector("[data-type=\"run\"]")
            this.roles[id] = preRun.querySelector(`#ROLE_${id}`)
        })
        console.log("Action角色", this)
    }
    move(role, direction, distance) {
        if (role != "__background__") {
            console.log(this.#getPer(this.roles[role]) + distance)
            if (direction == "forward") {
                this.roles[role].style.left = `${this.#getPer(this.roles[role]) + distance}%`
            } else if (direction == "backward") {
                this.roles[role].style.left = `${this.#getPer(this.roles[role]) - distance}%`
            } else if (direction == "upward") {
                this.roles[role].style.top = `${(this.roles[role].offsetTop - distance) / (preRun.clientHeight / 360)}px`
            } else if (direction == "downward") {
                this.roles[role].style.top = `${(this.roles[role].offsetTop + distance) / (preRun.clientHeight / 360)}px`
            }
        } else {
            parentWindow.Csl.error("背景不是角色\n背景不能移动")
        }
    }
}