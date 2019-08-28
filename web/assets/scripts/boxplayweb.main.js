class BoxPlayWeb {

    static initialize() {
        BoxPlayWeb.token = undefined;
        BoxPlayWeb.providers = [];
        BoxPlayWeb.results = [];

        BoxPlayWebSocket.subscribe(["handshake"], function(name, content) {
            BoxPlayWeb.token = content.token;
            console.log("BoxPlayWeb: Got new token: " + content.token);

            BoxPlayWeb.requestProviders();
        });

        BoxPlayWebSocket.subscribe(["provider_list"], function(name, content) {
            BoxPlayWeb.providers = content;

            for (let provider of content) {
                Object.assign(provider, {
                    "enabled": true,
                });
            }

            console.log("BoxPlayWeb: Got provider list (" + content.length + " item(s))");

            setTimeout(function() {
                BoxPlayWeb.updateProviderList();
            }, 500);
        });

        BoxPlayWebSocket.subscribe(["search_result"], function(name, content) {
            let results = [];

            for (let result of content.results) {
                let newResult = Object.assign({}, result);

                newResult.item = newResult.item.item;
                newResult["unique_md5"] = md5(newResult.unique);
                newResult["additional_data"] = {
                    "informations": [],
                    "content": []
                };

                results.push(newResult);
            }

            BoxPlayWeb.results = results;
            console.log("BoxPlayWeb: Got result list (" + content.results.length + " item(s))");

            setTimeout(function() {
                BoxPlayWeb.updateResultList();
            }, 500);
        });
    }

    static reset() {
        BoxPlayWeb.token = undefined;

        clearVueJsField(mainVue.providers);
        clearVueJsField(mainVue.results);

        BoxPlayWeb.providers.length = 0;
        BoxPlayWeb.results.length = 0;
    }

    static handshake() {
        BoxPlayWebSocket.request("handshake", {});
    }

    static requestProviders() {
        BoxPlayWebSocket.request("provider_list", {});
    }

    static updateProviderList() {
        clearVueJsField(mainVue.providers);

        for (let provider of BoxPlayWeb.providers) {
            mainVue.providers.push(provider);
        }
    }

    static updateResultList() {
        clearVueJsField(mainVue.results);

        for (let result of BoxPlayWeb.results) {
            mainVue.results.push(result);
        }

        setTimeout(function() {
            refreshGallery();
        }, 100);
    }
}
