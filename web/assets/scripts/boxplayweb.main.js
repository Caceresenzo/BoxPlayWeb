class BoxPlayWeb {

    static initialize() {
        BoxPlayWeb.token = undefined;
        BoxPlayWeb.providers = [];
        BoxPlayWeb.results = [];
        BoxPlayWeb.extractedUrls = [];
        BoxPlayWeb.extractedQualities = [];

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
            }, 100);
        });

        BoxPlayWebSocket.subscribe(["search_result"], function(name, content) {
            let results = [];

            for (let result of content.results) {
                let newResult = Object.assign({}, result);

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
            }, 100);
        });

        BoxPlayWebSocket.subscribe(["additional_data"], function(name, content) {
            let equal = function(a, b, field) {
                return a[field] == b[field];
            }
            let match = function(item, original) {
                if (item.kind != original.kind) {
                    return false;
                }

                let a = item.item,
                    b = original.item;

                if (equal(a, b, "parent_provider") && equal(a, b, "name") && equal(a, b, "image_url") && equal(a, b, "url") && equal(a, b, "type")) {
                    return true;
                }
                return false;
            }

            let original = content.original;
            let corresponding = undefined;
            for (let item of mainVue.results) {
                if (match(item.object, original)) {
                    corresponding = item;
                    break;
                }
            }

            if (!corresponding) {
                console.warn("BoxPlayWeb: No corresponding item found for original item with url: " + original.item.url);
                return;
            }

            let copy = function(from, to) {
                let length = to.length;
                for (let index = 0; index < length; index++) {
                    to.pop();
                }

                for (let item of from) {
                    to.push(item);
                }
            }

            let fields = ["informations", "content"];
            for (let field of fields) {
                copy(content[field], corresponding.additional_data[field]);
            }

            setTimeout(function() {
                i18n.applyOn(document);
                RatingStar.applyOnAll();
            }, 100);
        });

        BoxPlayWebSocket.subscribe(["extracted_urls"], function(name, content) {
            let urls = content.urls;

            BoxPlayWeb.extractedUrls = urls;
            console.log("BoxPlayWeb: Got extracted urls list (" + urls.length + " item(s))");

            setTimeout(function() {
                BoxPlayWeb.openUrlSelector();
            }, 100);
        });

        BoxPlayWebSocket.subscribe(["extracted_video_direct_urls"], function(name, content) {
            let qualities = content.qualities;

            BoxPlayWeb.extractedQualities = qualities;
            console.log("BoxPlayWeb: Got qualities list (" + qualities.length + " item(s))");

            setTimeout(function() {
                BoxPlayWeb.openQualitySelector();
            }, 100);
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

    static openUrlSelector() {
        clearVueJsField(mainVue.extractedUrls.urls);

        for (let url of BoxPlayWeb.extractedUrls) {
            mainVue.extractedUrls.urls.push(url);
        }

        BoxPlayWebSearch.MODALS.SELECT_PLAYER_URL.open();
    }

    static openQualitySelector() {
        clearVueJsField(mainVue.extractedUrls.qualities);

        for (let url of BoxPlayWeb.extractedQualities) {
            if (url.video_url == null) {
                continue;
            }

            mainVue.extractedUrls.qualities.push(url);
        }

        BoxPlayWebSearch.MODALS.SELECT_VIDEO_QUALITY.open();
    }

}
