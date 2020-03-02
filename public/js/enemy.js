class EnemyModel {
    constructor() {
        this.path = enemyPaths[0]; //startvärde
        this.stepInPath = 0;
        this.x = this.path[this.stepInPath].x;
        this.y = this.path[this.stepInPath].y;

        this.winCounter = 0;
    }

    _updateCoordinates(x, y) {
        this.x = x;
        this.y = y;
    }

    moveStandardPath() {
        if (this.stepInPath != this.path.length - 1) {
            this.stepInPath++;
            this.x = this.path[this.stepInPath].x;
            this.y = this.path[this.stepInPath].y;
        } else {
            this._chooseNewPath();
            this._updateCoordinates(this.path[this.stepInPath].x, this.path[this.stepInPath].y);
        }
    }

    _chooseNewPath() {
        let shuffledPaths = enemyPaths.concat().sort(() => .5 - Math.random());
        for (let path of shuffledPaths) {
            if (path[0] === this.path[this.path.length - 1] && path != this.path) {
                this.stepInPath = 1;
                this.path = path;
                return;
            }
        }
    }

    catchPlayer() {
        this.winCounter++;
    }
}

class EnemyView {
    constructor() {
        this._enemyDiv = document.createElement('div');
        this._enemyDiv.className = 'enemy';
        document.querySelector('.board-wrapper').appendChild(this._enemyDiv);
    }

    updatePosition(x, y) {
        this._enemyDiv.style.top = `${y}px`;
        this._enemyDiv.style.left = `${x}px`;
    }
}

class EnemyController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.view.updatePosition(this.getX(), this.getY());
    }

    getX = () => {
        return this.model.x;
    }

    getY = () => {
        return this.model.y;
    }

    getWinCounter = () => {
        return this.model.winCounter;
    }

    catchPlayer = () => {
        this.model.catchPlayer();
        console.log('gotcha!');
    }

    moveStandardPath = () => {
        this.model.moveStandardPath();
        this.view.updatePosition(this.getX(), this.getY());
    }

    getCurrentPath = () => {
        return this.model.path;
    }
}