import { ajax } from './utils';

class Listeners {
    constructor() {
        this.listeners = [];
        this.tmpEvents = {
            mousemove: [],
            keydown: {},
        };
        this.analytics = [];
        this.isStarted = false;

        // to ingnore half of the move events
        this.moveIgnore = true;
    }

    addListener(event, method){
        this.listeners.push({
            event,
            method
        })
        window.addEventListener(event, method);
    }

    stop() {
        if (!this.isStarted) {
            console.log("listening is already stopped");
            return;
        }

        console.log("stop listening");
        this.isStarted = false;
        this.listeners.forEach( ({event, method}) => window.removeEventListener(event, method));
        this.sendAnalytics();
    }

    start() {
        console.log("start listening");
        this.isStarted = true;
        ["mousemove", "click", "keydown", "keyup"].forEach(t => this.addListener(t,this.logEvent.bind(this)));
    }

    logEvent(evt) {
        console.log(evt.type, evt);
        switch (evt.type) {
            case "keydown":
                this.logType(evt);
                break;
            case "keyup":
                this.logType(evt);
                break;
            case "click":
                this.logClick(evt);
                break;
            case "mousemove":
                this.logMouseMove(evt);
                break;
        }
    }

    sendAnalytics() {
        const data = {
            events: this.analytics
        }
        ajax('POST', "/data", data);
    }

    logType(evt) {
        if (evt.type === "keydown") {
            this.tmpEvents[evt.code] = evt;
            return;
        }

        const downEvt = this.tmpEvents[evt.code];
        delete this.tmpEvents[evt.code];
        let typeEvt = {
            type: "Typing",
            data: {
                down: {
                    timeStamp: downEvt.timeStamp,
                    shiftKey: downEvt.shiftKey,
                    altKey: downEvt.altKey,
                    ctrlKey: downEvt.ctrlKey,
                    type: downEvt.type,
                },
                up:{
                    timeStamp: evt.timeStamp,
                    shiftKey: evt.shiftKey,
                    altKey: evt.altKey,
                    ctrlKey: evt.ctrlKey,
                    type: evt.type,
                }
            }
        };
        this.analytics.push(typeEvt);
    }

    logMouseMove(evt){
        //ignore every second move
        if (this.moveIgnore) {
            this.moveIgnore = !this.moveIgnore;
            return;
        }
        this.moveIgnore = !this.moveIgnore;

        let moveEvt = {
            type: "Move",
            data: {
                x: evt.x,
                y: evt.y,
                timeStamp: evt.timeStamp,
                type: evt.type,
                shiftKey: evt.shiftKey,
                altKey: evt.altKey
            }
        };
        this.tmpEvents.mousemove.push(moveEvt);
        this.analytics.push(moveEvt);
    }

    logClick(evt){
        let clickEvt = {
            type: "Click",
            data: {
                x: evt.x,
                y: evt.y,
                timeStamp: evt.timeStamp,
                type: evt.type,
                shiftKey: evt.shiftKey,
                altKey: evt.altKey,

                movesBefore: this.tmpEvents.mousemove.slice(this.tmpEvents.mousemove.length - 6)
            }
        };
        this.analytics.push(clickEvt);
    }

}

export default Listeners;