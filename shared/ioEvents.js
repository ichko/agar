class IOEvents {

    constructor() {
        this.downKeysBindings = {};
        this.upKeysBindings = {};
        this.downAnyHandler = undefined;
        this.setupListeners();
    }

    downAny(handler) {
        this.downAnyHandler = handler;
    }

    down(key, handler) {
        this.downKeysBindings[key] = { down: false, handler };
        return this;
    }

    up(key, handler) {
        this.upKeysBindings[key] = { down: true, handler };
        return this;
    }

    trigger() {
        let down = false;
        for (let name in this.downKeysBindings) {
            if (this.downKeysBindings[name].down) {
                this.downKeysBindings[name].handler();
                down = true;
            }

            if (this.upKeysBindings[name].down) {
                this.upKeysBindings[name].handler();
            }
        }

        if (this.downAnyHandler && down) {
            this.downAnyHandler();
        }
    }

    setupListeners() {
        window.addEventListener('keydown', ({ key }) => {
            if(this.downKeysBindings[key]) {
                this.downKeysBindings[key].down = true;
            }
            if(this.upKeysBindings[key]) {
                this.upKeysBindings[key].down = false;
            }
        });

        window.addEventListener('keyup', ({ key }) => {
            if(this.downKeysBindings[key]) {
                this.downKeysBindings[key].down = false;
            }
            if(this.upKeysBindings[key]) {
                this.upKeysBindings[key].down = true;
            }
        });
    }

}