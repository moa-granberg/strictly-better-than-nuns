class UserOptions {
    constructor() {
        this.wrapper = document.querySelector('.user-options-wrapper');
    }

    renderPaceBtns = (handler, types, selected, className) => {
        this.wrapper.innerHTML = '';
        for (let type of types) {
            if (selected && type.toLowerCase() != selected) {
                this.wrapper.innerHTML += this._renderBtn(type, className);
            } else {
                this.wrapper.innerHTML += this._renderBtn(type, '');
            }
        }
        this._addListeners(handler);
    }

    _renderBtn = (type, className) => {
        return `
        <button class="${type.toLowerCase()} ${className}">${type}</button>
        `;
    }

    _addListeners = (handler) => {
        const btns = this.wrapper.querySelectorAll('button');
        for (let btn of btns) {
            btn.addEventListener('click', e => handler(btn.innerText.toLowerCase()));
        }
    }

    disableBtns = () => {
        const btns = this.wrapper.querySelectorAll('button');
        btns.forEach(btn => btn.disabled = true);
    }

    enableBtns = () => {
        const btns = this.wrapper.querySelectorAll('button');
        btns.forEach(btn => btn.disabled = false);
    }

    renderConfirmDestinationBtn = (handlerConfirm, handlerBack) => {
        this.wrapper.innerHTML = this._renderBtn('Confirm');
        this.wrapper.innerHTML += this._renderBtn('Back');
        const confirmBtn = document.querySelector('button');
        const backBtn = document.querySelectorAll('button')[1];
        confirmBtn.addEventListener('click', e => handlerConfirm());
        backBtn.addEventListener('click', e => handlerBack());
    }

    renderTokenInstr = () => {
        this.wrapper.innerHTML = 'click on soundtoken to select sound-position'; //fillertext
    }

    clear = () => {
        this.wrapper.innerHTML = '';
    }

    renderChoosePlayer = (handler) => {
        this.wrapper.innerHTML = this._renderBtn('Good');
        this.wrapper.innerHTML += this._renderBtn('Evil');
        const goodBtn = document.querySelector('button');
        const evilBtn = document.querySelectorAll('button')[1];
        goodBtn.addEventListener('click', e => handler(true));
        evilBtn.addEventListener('click', e => handler(false));
    }

    renderStartGame = (handler) => {
        this.wrapper.innerHTML = this._renderBtn('Start');
        const start = document.querySelector('button');
        start.addEventListener('click', e => handler());
    }
}