import {ajax, guid} from './utils';
import { store } from './store';

(function() {
    async function getClientId() {
        let sessionId = window.sessionStorage.getItem("sessionId");
        if (!sessionId) {
            let sessionId = guid();
            console.log("created a session for Tab", sessionId)
            window.sessionStorage.setItem("sessionId", sessionId);
        }
        return await ajax('POST', "/init");
    }

    getClientId().then(resp => {
        if(resp.success) {
            store.clientId = resp.clientId;
        }
        console.log(resp);
    });

})()