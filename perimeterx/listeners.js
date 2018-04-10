import {store} from "./store";

class Listeners {
    constructor() {
        this.listeners = [];
        this.moveTimer = {}
        this.moveTimer.counter = 1;
        this.moveTimer.lastCount = 1;
    }

    addListener(event, method){
        this.listeners.pop({
            event,
            method
        })
        window.addEventListener(event, method);
    }

    stop() {
        this.listeners.forEach( ({event, method}) => window.removeEventListener(event, method));
    }

    start() {
        this.moveTimer.timer = setInterval(() =>this.moveTimer.counter++, 1000);
        console.log("this.moveTimer.timer", this.moveTimer.timer);
        this.addListener("mousemove", (e) => {
            const {counter, lastCount} = this.moveTimer;
            if (counter !== lastCount){
                console.log("move", e);
                this.moveTimer.lastCount = counter;
            }

        });
        this.addListener("click", (e) => console.log("click", e));
        this.addListener("keydown", (e) => console.log("keydown", e));
        this.addListener("keyup", (e) => console.log("keyup", e));
    }

}

export default Listeners;