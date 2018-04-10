import { store } from './store';

export const guid = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export const ajax = (type, url, data) =>
    new Promise(function(resolve, reject) {
        try {
            let xhr = new (window.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
            xhr.open(type, url, 1);
            //xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            //xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('SESSIONID', window.sessionStorage.getItem("sessionId"));
            if (store.clientId) {
                xhr.setRequestHeader('CLIENTID', store.clientId);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log("xhr done successfully");
                        var resp = xhr.responseText;
                        //var respJson = JSON.parse(resp);
                        resolve(JSON.parse(atob(resp)));
                    } else {
                        reject(xhr.status);
                        console.log("xhr failed");
                    }
                } else {
                    console.log("xhr processing going on");
                }
            };
            xhr.send(btoa(JSON.stringify(data)));
            console.log("request sent succesfully");
        } catch (e) {
            window.console && console.log(e);
            reject(e);
        }
    });