import {guid} from "../perimeterx/utils";
import {store} from "./analytics/store";
import atob from "atob";
import btoa from "btoa";

// Getting session ID and creating/returning client id
export const init = (req, res) => {
    try {
        let payload = JSON.parse(atob(req.body));
        console.log("data received", payload);

        const userAgentIp = req.ip + req.get('User-Agent');
        const sessionId = payload.sessionId;

        let clientId = payload.clientId || store.clients[userAgentIp] || guid();
        console.log('clientId created', clientId);

        store.clients[userAgentIp] = clientId;
        if(!store.analytics[clientId]) {
            store.analytics[clientId] = {};
        }
        if (!store.analytics[clientId][sessionId]) {
            store.analytics[clientId][sessionId] = [];
        }

        res.send(btoa(JSON.stringify({clientId, status: "ok"})));
    } catch (e) {
        console.log(e);
        res.send(btoa(JSON.stringify({status: "fail"})));
    }
};

// Storing data received from browser client
export const data = (req, res) => {
    try {

        let payload = JSON.parse(atob(req.body));
        console.log("data received", payload);

        const { clientId, sessionId, events } = payload;
        if (!clientId || !store.analytics[clientId] || !sessionId || !store.analytics[clientId][sessionId]) {
            res.status(400).send({ error: 'something blew up' });
            return;
        }
        store.analytics[clientId][sessionId].concat(events);

        res.send(btoa(JSON.stringify({status: "ok"})));
    } catch (e) {
        console.log(e);
        res.send(btoa(JSON.stringify({status: "fail"})));
    }
};

