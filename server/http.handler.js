import {guid} from "../perimeterx/utils";
import {store} from "./analytics/store";
import atob from "atob";
import btoa from "btoa";

export const init = (req, res) => {
    try {

        console.log(req.body)
        let payload = JSON.parse(atob(req.body));
        console.log("data received", payload);

        //console.log('SESSIONID', atob(req.get('SESSIONID')));
        const userAgentIp = req.ip + req.get('User-Agent');
        const sessionId = payload.sessionId; //atob(req.get('SESSIONID'));

        //let clientId = (req.get('CLIENTID') && atob(req.get('CLIENTID'))) || store.clients[userAgentIp] || guid();

        let clientId = payload.clientId || store.clients[userAgentIp] || guid();
        console.log('CLIENTID', clientId);

        store.clients[userAgentIp] = clientId;
        if(!store.sessions[clientId]) {
            store.sessions[clientId] = {};
        }
        if (!store.sessions[clientId][sessionId]) {
            store.sessions[clientId][sessionId] = [];
        }

        res.send(btoa(JSON.stringify({clientId, status: "ok"})));
    } catch (e) {
        console.log(e);
        res.send(btoa(JSON.stringify({status: "fail"})));
    }
};

export const data = (req, res) => {
    try {

        let payload = JSON.parse(atob(req.body));

        const { clientId, sessionId, events } = payload;
        if (!clientId || !store.sessions[clientId] || !sessionId || !store.sessions[clientId][sessionId]) {
            res.status(400).send({ error: 'something blew up' });
            return;
        }
        store.sessions[clientId][sessionId].concat(events);

        res.send(btoa(JSON.stringify({status: "ok"})));
    } catch (e) {
        console.log(e);
        res.send(btoa(JSON.stringify({status: "fail"})));
    }
};

