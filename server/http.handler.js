import {guid} from "../perimeterx/utils";
import {store} from "./analytics/store";
import atob from "atob";
import btoa from "btoa";

export const init = (req, res) => {
    try {
        console.log('SESSIONID', atob(req.get('SESSIONID')));
        const userAgentIp = req.ip + req.get('User-Agent');
        const sessionId = atob(req.get('SESSIONID'));

        let clientId = req.get('CLIENTID') || store.clients[userAgentIp] || guid();
        console.log('CLIENTID', clientId);

        store.clients[userAgentIp] = clientId;
        let sessionList = store.sessions[clientId] || {};

        if (!sessionList[sessionId]) {
            sessionList[sessionId] = {}
        }

        res.send(btoa(JSON.stringify({clientId, success: true})));
    } catch (e) {
        res.send(btoa(JSON.stringify({success: false})));
    }
}