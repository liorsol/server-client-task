import { store } from './store';

// method for creating uuid
export const guid = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export const ajax = (type, url, data, async = true) =>
    new Promise(function(resolve, reject) {
        try {
            let xhr = new (window.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
            xhr.open(type, url, async);
            let body = { sessionId: window.sessionStorage.getItem("sessionId") };
            xhr.setRequestHeader('SESSIONID', window.sessionStorage.getItem("sessionId"));
            if (store.clientId) {
                xhr.setRequestHeader('CLIENTID', store.clientId);
                Object.assign(body, { clientId: store.clientId });
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log("xhr done successfully");
                        var resp = xhr.responseText;
                        resolve(JSON.parse(atob(resp)));
                    } else {
                        reject(xhr.status);
                        console.log("xhr failed");
                    }
                } else {
                    console.log("xhr processing going on");
                }
            };
            console.log("ajax send", Object.assign(body, data));
            xhr.send(btoa(JSON.stringify(Object.assign(body, data))));
            console.log("request sent succesfully");
        } catch (e) {
            window.console && console.log(e);
            reject(e);
        }
    });