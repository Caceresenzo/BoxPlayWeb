class BoxPlaySocket {

    static initialize() {
        BoxPlaySocket.socket = null;
        BoxPlaySocket.connectedCount = 0;

        BoxPlaySocket.listeners = [];
        BoxPlaySocket.subscriptions = [];
    }

    static connect() {
        let socket = BoxPlaySocket.socket = new WebSocket("ws://" + WEB_SOCKET_HOST + ":" + WEB_SOCKET_PORT);

        socket.onopen = function() {
            console.info("WebSocket: Connected");

            BoxPlaySocket.connectedCount++;
            BoxPlaySocket.fire("onopen", null);
        };

        socket.onmessage = function(event) {
            let content = event.data;
            console.info("WebSocket: Received message:", content);

            let json = JSON.parse(content);

            /* Subscribed Callbacks */
            try {
                let name = json.name;
                let callbacks = BoxPlaySocket.subscriptions[name];

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
            BoxPlaySocket.fire("onmessage", json);
        };

        socket.onclose = function(event) {
            console.warn("WebSocket: Closed. Reconnect will be attempted in 1 second.", event.reason);

            setTimeout(function() {
                BoxPlaySocket.connect();
            }, 1000);
        };

        socket.onerror = function(error) {
            console.error("WebSocket: Encountered error: ", error.message, "Closing socket.");
            socket.close();

            BoxPlaySocket.fire("onerror", error);
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

        BoxPlaySocket.socket.send(stringify);
        console.log("WebSocket: Send request: " + stringify);
    }

    static listen(event, listener) {
        let array = BoxPlaySocket.listeners[event];

        if (array == undefined) {
            array = [];
            BoxPlaySocket.listeners[event] = array;
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
            let array = BoxPlaySocket.subscriptions[name];

            if (array == undefined) {
                array = [];
                BoxPlaySocket.subscriptions[name] = array;
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
        let array = BoxPlaySocket.listeners[event];

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