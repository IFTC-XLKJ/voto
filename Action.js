class Action {
    constructor() {
        this.rolesId = workdata.roleData.map(role => role.id);
        this.roles = {};
        this.rolesId.forEach(id => {
            this.roles[id] = document.getElementById(`ROLE_${id}`)
        })
        console.log(this)
    }
    move(role, direction, distance) {
        if (direction == "forward") {
            this.roles[role].style.left = `${this.roles[role].offsetLeft + distance}px`
        } else if (direction == "backward") {
            this.roles[role].style.top = `${parseInt(this.roles[role].style.top) - distance}px`
        } else if (direction == "left") {
            this.roles[role].style.left = `${parseInt(this.roles[role].style.left)}`
        }
    }
}