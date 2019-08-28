class BoxPlayWebSocket {

    static initialize() {
        BoxPlayWebSocket.socket = null;
        BoxPlayWebSocket.connectedCount = 0;

        BoxPlayWebSocket.listeners = [];
        BoxPlayWebSocket.subscriptions = [];
    }

    static connect() {
        let socket = BoxPlayWebSocket.socket = new WebSocket("ws://" + WEB_SOCKET_HOST + ":" + WEB_SOCKET_PORT);

        socket.onopen = function() {
            console.info("WebSocket: Connected");

            BoxPlayWebSocket.connectedCount++;
            BoxPlayWebSocket.fire("onopen", null);
        };

        socket.onmessage = function(event) {
            let content = event.data;
            console.info("WebSocket: Received message:", content);

            let json = JSON.parse(content);

            /* Subscribed Callbacks */
            try {
                let name = json.name;
                let callbacks = BoxPlayWebSocket.subscriptions[name];

                if (callbacks != undefined) {
                    for (let callback of callbacks) {
                        try {
                            callback(name, json.content);
                        } catch (exception) {
                            console.error(exception);
                        }
                    }
                }
            } catch (exception) {
                console.error(exception);
            }

            /* Fire registered listeners */
            BoxPlayWebSocket.fire("onmessage", json);
        };

        socket.onclose = function(event) {
            console.warn("WebSocket: Closed. Reconnect will be attempted in 1 second.", event.reason);

            setTimeout(function() {
                BoxPlayWebSocket.connect();
            }, 1000);
        };

        socket.onerror = function(error) {
            console.error("WebSocket: Encountered error: ", error.message, "Closing socket.");
            socket.close();

            BoxPlayWebSocket.fire("onerror", error);
        };
    }

    static request(name, content) {
        let request = {
            "name": name,
            "content": content,
        };
        if (BoxPlayWeb.token != undefined) {
            request["token"] = BoxPlayWeb.token;
        }

        let stringify = JSON.stringify(request);

        BoxPlayWebSocket.socket.send(stringify);
        console.log("WebSocket: Send request: " + stringify);
    }

    static listen(event, listener) {
        let array = BoxPlayWebSocket.listeners[event];

        if (array == undefined) {
            array = [];
            BoxPlayWebSocket.listeners[event] = array;
        }

        array.push(listener);
        console.log("WebSocket: Registered listener on event: " + event);
    }

    static subscribe(names, callback) {
        if (typeof(names) == "string") {
            names = [names];
            console.warn("WebSocket: Trying to subscribe with a string parameter, please use an array next time.");
        }

        for (let name of names) {
            let array = BoxPlayWebSocket.subscriptions[name];

            if (array == undefined) {
                array = [];
                BoxPlayWebSocket.subscriptions[name] = array;
            }

            array.push(callback);
            console.log("WebSocket: Registered callback on identifier: " + name);
        }
    }

    /**
	 * Fire an event from added listeners.
	 * 
	 * @param {string}
	 *            event Event's name.
	 * @param {object}
	 *            data Event's data.
	 */
    static fire(event, data) {
        let array = BoxPlayWebSocket.listeners[event];

        if (array != undefined) {
            for (let listener of array) {
                try {
                    listener(data);
                } catch (exception) {
                    console.error(exception);
                }
            }
        }
    }
}
