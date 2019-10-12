class BoxPlayWebSearch {

    static initialize() {
        BoxPlayWebSearch.MODALS = {
            "SEARCH": new BoxPlayWebSteppedModal("modal-search"),
            "GET_ADDITIONAL": new BoxPlayWebSteppedModal("modal-get-additional"),
            "EXTRACT_PLAYER_URLS": new BoxPlayWebSteppedModal("modal-extract-player-urls"),
            "EXTRACT_VIDEO_DIRECT_URL": new BoxPlayWebSteppedModal("modal-extract-video-direct-url"),

            "SELECT_PLAYER_URL": new BoxPlayWebModal("modal-select-player-url", true),
            "SELECT_VIDEO_QUALITY": new BoxPlayWebModal("modal-select-video-quality", true),
        };

        BoxPlayWebSearch.DIVS = {
            "FORM": document.getElementById("form-search"),
        }

        BoxPlayWebSearch.INPUTS = {
            "QUERY": document.getElementById("input-search"),
        }

        BoxPlayWebSearch.MODALS.SEARCH
            .withPrefix("search")
            .handle({
                "WORKING": function(modal, name, content, task, progression, message) {
                    if (message != undefined && message.from == "PROVIDER") {
                        let submessage = message.submessage;
                        let localStep = modal.findStep("step-provider-" + message.manager.toLowerCase());

                        if (submessage != undefined) {
                            let error = submessage.error;
                            let eta = submessage.eta;

                            if (error == undefined) {
                                switch (eta) {
                                    case "provider.search.finished":
                                        {
                                            localStep.changeIcon("done");
                                            break;
                                        }
                                    case "provider.search.start":
                                    case "provider.search.sorting":
                                        {
                                            localStep.changeIcon("current");
                                            break;
                                        }
                                }
                            } else {
                                localStep.changeIcon("error");
                            }
                        }
                    }
                }
            });

        BoxPlayWebSearch.MODALS.SEARCH.createProviderStep = function() {
            let steps = [];

            for (let provider of mainVue.providers) {
                if (mainVue.enabledProviders.indexOf(provider.manager) != -1) {
                    steps.push(new BoxPlayWebModalStep("search-step-provider-" + provider.manager.toLowerCase(), 2));
                }
            }

            this.clearSteps().withDefaultSteps(steps);
        }

        BoxPlayWebSearch.MODALS.GET_ADDITIONAL
            .withPrefix("get-additional")
            .withDefaultSteps([
                new BoxPlayWebModalStep("get-additional-step-informations"),
                new BoxPlayWebModalStep("get-additional-step-content"),
            ])
            .handle({
                "WORKING": function(modal, name, content, task, progression, message) {
                    if (message != null) {
                        let current = message.current;
                        let eta = message.eta;

                        if (current != null) {
                            let localStep = modal.findStep("step-" + current.toLowerCase());

                            if (localStep != null) {
                                let etaMap = {
                                    "STARTED": "current",
                                    "FINISHED": "done",
                                    "FAILED": "error",
                                }

                                localStep.changeIcon(etaMap[eta]);
                            }
                        }
                    }
                }
            });

        BoxPlayWebSearch.MODALS.EXTRACT_PLAYER_URLS
            .withPrefix("extract-player-urls")
            .withDefaultSteps()
            .handle();

        BoxPlayWebSearch.MODALS.EXTRACT_VIDEO_DIRECT_URL
            .withPrefix("extract-video-direct-url")
            .withDefaultSteps()
            .handle({
                "ERROR": function(modal, name, content, task, progression, message) {
                    if (message == ExtractVideoDirectUrlMessage.FILE_NOT_AVAILABLE) {
                        modal.close();

                        alert(i18n.get("task.error.url-not-available"));
                    }
                }
            });

        BoxPlayWebSearch.attachEvent();
    }

    static attachEvent() {
        let form = BoxPlayWebSearch.DIVS.FORM;

        let processForm = function(event) {
            if (event.preventDefault) {
                event.preventDefault();
            }

            BoxPlayWebSearch.doSearch();
            return false;
        }

        if (form.attachEvent) {
            form.attachEvent("submit", processForm);
        } else {
            form.addEventListener("submit", processForm);
        }
    }

    static getEnabledProvidersFromCookies() {
        let enabledProviders = [];
        let cookieEnabledProvider = Cookies.get("enabled-provider");

        if (cookieEnabledProvider != null) {
            let list = cookieEnabledProvider.split(",");

            for (let item of list) {
                enabledProviders.push(item);
            }
        }

        return enabledProviders;
    }

    static saveEnabledProvidersToCookies() {
        Cookies.set("enabled-provider", mainVue.enabledProviders.join(","));
    }

    static doSearch() {
        let query = BoxPlayWebSearch.INPUTS.QUERY.value;
        let providers = mainVue.enabledProviders;

        if (query == "" || query.length == 0 || providers.length == 0) {
            return;
        }

        BoxPlayWebSearch.MODALS.SEARCH.createProviderStep();
        BoxPlayWebSearch.MODALS.SEARCH.open();

        BoxPlayWebSocket.request("search", {
            "query": query,
            "providers": providers,
        });
    }

    static onResultOpen(md5) {
        let corresponding = undefined;

        for (let result of mainVue.results) {
            if (result.unique_md5 == md5) {
                corresponding = result;
                break;
            }
        }

        if (corresponding == undefined) {
            console.warn("BoxPlayWebSearch: No match for result with md5: " + md5);
            return;
        }

        BoxPlayWebSearch.MODALS.GET_ADDITIONAL.open();

        BoxPlayWebSocket.request("get_additional", {
            "object": corresponding.object,
        });
    }

    static onWantToWatch(md5, index) {
        let corresponding = undefined;

        for (let result of mainVue.results) {
            if (result.unique_md5 == md5) {
                corresponding = result;
                break;
            }
        }

        if (corresponding == undefined) {
            console.warn("BoxPlayWebSearch: No match for result with md5: " + md5);
            return;
        }

        let viewableContentItem = corresponding.additional_data.content[index];

        if (viewableContentItem == undefined) {
            console.warn("BoxPlayWebSearch: No viewable content item for result with md5: " + md5 + " at index: " + index);
            return;
        }

        let sourceResult = corresponding.object;
        let dataObject = viewableContentItem.value;

        mainVue.extractedUrls.title = sourceResult.item.name;
        mainVue.extractedUrls.subtitle = dataObject.object.name;

        BoxPlayWebSearch.MODALS.EXTRACT_PLAYER_URLS.open();

        BoxPlayWebSocket.request("extract_url", {
            "source_result": sourceResult,
            "data_object": dataObject,
        });
    }

    static onWantToPlay(playerUrl, extractionCompatible) {
        if (extractionCompatible) {
            BoxPlayWebSearch.MODALS.EXTRACT_VIDEO_DIRECT_URL.open();

            BoxPlayWebSocket.request("extract_video_direct_url", {
                "url": playerUrl,
            });
        } else {
            BoxPlayWebVideo.iframe(playerUrl);
        }
    }

}
