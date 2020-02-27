class PlayerModel {
    constructor() {
        this.x = 5; //startvärden
        this.y = 5;
        
        this.home = positions[1]; //testvärden
        this.key = positions[12];
        this.goal = positions[13];

        this.hasKey = false;
        this.hasGoal = false;
    }

    updateCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }

    isOnTarget(target) {
        return target.x === this.x && target.y === this.y;
    }

    achiveKey() {
        this.hasKey = true;
    }

    achiveGoal() {
        this.hasGoal = true;
    }

    loseGoal() {
        this.hasGoal = false;
    }
}

class PlayerView {
    constructor() {
        this._playerDiv = document.createElement('div');
        this._playerDiv.className = 'player';
        document.querySelector('.board-wrapper').appendChild(this._playerDiv);
    }

    updatePlayerPosition(x, y) {
        this._playerDiv.style.top = `${y}px`;
        this._playerDiv.style.left = `${x}px`;
    }
}

class PlayerController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.updatePlayerPosition(this.getX(), this.getY());
    }

    movePlayer = (x, y) => {
        this.model.updateCoordinates(x, y);
        this.view.updatePlayerPosition(x, y);
    }

    getX = () => {
        return this.model.x;
    }

    getY = () => {
        return this.model.y;
    }

    isOnTarget = (target) => {
        return this.model.isOnTarget(target);
    }

    checkKey = () => {
        return this.model.hasKey;
    }

    checkGoal = () => {
        return this.model.hasGoal;
    }

    achieveKey = () => {
        this.model.achiveKey();
    }

    achieveGoal = () => {
        this.model.achiveGoal();
    }

    loseGoal = () => {
        this.model.loseGoal();
    }

    getKey = () => {
        return this.model.key;
    }

    getGoal = () => {
        return this.model.goal;
    }

    getHome = () => {
        return this.model.home;
    }
}