import {ajax, guid} from './utils';
import { store } from './store';
import Listeners from './listeners';

(function() {
    const listeners = new Listeners();

    const init = async () => {

        // creating unique session on each tab - window session
        let sessionId = window.sessionStorage.getItem("sessionId");
        if (!sessionId) {
            let sessionId = guid();
            console.log("created a session for Tab", sessionId)
            window.sessionStorage.setItem("sessionId", sessionId);
        }

        return await ajax('POST', "/init");
    }

    // receiving client id, and storing it
    init().then(resp => {
        console.log("got client ID", resp);
        if(resp.status === "ok") {
            store.clientId = resp.clientId;
        }

    //real work starts here
    }).finally(() => {
        listeners.start();

        // send data if unload occur (forceing it makes call async=false)
        window.addEventListener("unload", () => listeners.stop(true));

        // call stop after 30 sec
        setTimeout(listeners.stop.bind(listeners), 30000);
    });

})()