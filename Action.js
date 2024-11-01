class Action {
    #screenWidth() {
        return preview.clientWidth;
    };
    #screenHieght() {
        return preview.clientHeight;
    }
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
            this.roles[role].style.left = `${this.roles[role].offsetLeft - (distance / (preview.clientWidth / 640))}px`
        } else if (direction == "backward") {
            this.roles[role].style.left = `${this.roles[role].offsetLeft + (distance / (preview.clientWidth / 640))}px`
        } else if (direction == "upward") {
            this.roles[role].style.top = `${this.roles[role].offsetTop - (distance / (preview.clientHeight / 360))}px`
        } else if (direction == "downward") {
            this.roles[role].style.top = `${this.roles[role].offsetTop + (distance / (preview.clientHeight / 360))}px`
        }
    }
}