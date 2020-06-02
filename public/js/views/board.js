class BoardView {
    constructor() {
        this.activePlayer = {};
        this.players = [];
        this.soundTokens = [];
        this.sightTokens = [];
        this.e1Path = [];
        this.e2Path = [];
        this.reachablePositions = [];
    }

    renderBoard = () => {
        this._clearBoard();
        for (let position of Object.values(positions)) {
            let className = ['position'];
            let child = '';

            if (position.id === this.activePlayer.position.id) {
                child += this._renderPlayer(this.activePlayer.id);
            }
            for (let player of this.players) {
                if (player.position.id === position.id && player.id != this.activePlayer.id) {
                    child += this._renderPlayer(player.id);
                }
            }
            if (this.soundTokens.find(token => token.id === position.id)) {
                child += this._renderToken('sound');
            }
            if (this.sightTokens.find(token => token.id === position.id)) {
                child += this._renderToken('sight');
            }
            if (this.e1Path.find(enemyPos => enemyPos.id === position.id)) {
                className.push('enemy1-path');
            }
            if (this.e2Path.find(enemyPos => enemyPos.id === position.id)) {
                className.push('enemy2-path');
            }
            if (this.reachablePositions.find(pos => pos.id === position.id)) {
                className.push('reachable');
            }
            if (!this.activePlayer.isEvil) {
                if (this.activePlayer.key.id === position.id) {
                    className.push('key');
                }
                if (this.activePlayer.goal.id === position.id) {
                    className.push('goal');
                }
                if (this.activePlayer.home.id === position.id) {
                    className.push('home');
                }
            }
            document.querySelector('.board-wrapper').innerHTML += this._renderPosition(position, className.join(' '), child);
        }
    }

    addListener = (handler, ...params) => {
        for (let position of Object.values(positions)) {
            const node = document.querySelectorAll('.position')[position.id - 1];
            node.addEventListener('click', e => handler(position, ...params));
        }
    }

    _renderPosition = (position, className, child) => {
        return `
            <div class="${className}" style="top: ${position.y}px; left: ${position.x}px;">
                ${position.id}
                ${child}
            </div>
        `;
    }

    _renderPlayer = (playerId) => {
        return `
            <div class="player player-${playerId.toString()}"></div>
        `;
    }

    _renderToken = (type) => {
        return `
            <div class="${type}-token"></div>
        `;
    }

    _clearBoard = () => {
        document.querySelector('.board-wrapper').innerHTML = '';
    }
}