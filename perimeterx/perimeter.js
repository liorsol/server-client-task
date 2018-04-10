import {ajax, guid} from './utils';
import { store } from './store';
import Listeners from './listeners';

(function() {
    const listeners = new Listeners();

    const getClientId = async () => {
        let sessionId = window.sessionStorage.getItem("sessionId");
        if (!sessionId) {
            let sessionId = guid();
            console.log("created a session for Tab", sessionId)
            window.sessionStorage.setItem("sessionId", sessionId);
        }
        return await ajax('POST', "/init");
    }

    // const registerListeners = () => {
    //     store.moveTimer = {}
    //     store.moveTimer.counter = 1;
    //     store.moveTimer.lastCount = 1;
    //     store.moveTimer.timer = setInterval((store => () => store.moveTimer.counter++)(store), 1000);
    //     window.addEventListener("mousemove", (store => (e) => {
    //         const {counter, lastCount} = store.moveTimer;
    //         if (counter !== lastCount){
    //             console.log("move", e);
    //             store.moveTimer.lastCount = counter;
    //         }
    //
    //     })(store));
    //     window.addEventListener("click", (e) => console.log("click", e));
    //     window.addEventListener("keydown", (e) => console.log("keydown", e));
    //     window.addEventListener("keyup", (e) => console.log("keyup", e));
    // }

    getClientId().then(resp => {
        if(resp.success) {
            store.clientId = resp.clientId;
        }
        console.log(resp);
    }).finally(() => listeners.start());

})()