class BoxPlayWebSearch {

    static initialize() {
        BoxPlayWebSearch.MODALS = {
            "SEARCH": new BoxPlayWebModal("modal-search"),
            "GET_ADDITIONAL": new BoxPlayWebModal("modal-get-additional"),
            "EXTRACT_PLAYER_URLS": new BoxPlayWebModal("modal-extract-player-urls"),
            "SELECT_PLAYER_URL": new BoxPlayWebModal("modal-select-player-url"),
        };

        BoxPlayWebSearch.DIVS = {
            "FORM": document.getElementById("form-search"),
        }

        BoxPlayWebSearch.INPUTS = {
            "QUERY": document.getElementById("input-search"),
        }

        BoxPlayWebSearch.STEPS = {
            "SEARCH": {
                "HEAD": [
                    BoxPlayWebSearch.createSearchStep("search-step-request"),
                    BoxPlayWebSearch.createSearchStep("search-step-queue"),
                    BoxPlayWebSearch.createSearchStep("search-step-started"),
                ],
                "PROVIDERS": [],
                "TAIL": [
                    BoxPlayWebSearch.createSearchStep("search-step-finished", 1, BoxPlayWebSearch.MODALS.SEARCH),
                ]
            },
            "GET_ADDITIONAL": [
                BoxPlayWebSearch.createSearchStep("get-additional-step-request"),
                BoxPlayWebSearch.createSearchStep("get-additional-step-queue"),
                BoxPlayWebSearch.createSearchStep("get-additional-step-started"),
                BoxPlayWebSearch.createSearchStep("get-additional-step-informations"),
                BoxPlayWebSearch.createSearchStep("get-additional-step-content"),
                BoxPlayWebSearch.createSearchStep("get-additional-step-finished", 1, BoxPlayWebSearch.MODALS.GET_ADDITIONAL),
            ],
            "EXTRACT_PLAYER_URLS": [
                BoxPlayWebSearch.createSearchStep("extract-player-urls-step-request"),
                BoxPlayWebSearch.createSearchStep("extract-player-urls-step-queue"),
                BoxPlayWebSearch.createSearchStep("extract-player-urls-step-started"),
                BoxPlayWebSearch.createSearchStep("extract-player-urls-step-finished", 1, BoxPlayWebSearch.MODALS.EXTRACT_PLAYER_URLS),
            ]
        }

        BoxPlayWebSearch.attachEvent();

        BoxPlayWebSocket.subscribe(["task_progression_notification", "task_enqueued"], function(name, content) {
            if (!BoxPlayWebSearch.MODALS.SEARCH.isOpen()) {
                return;
            }

            let findStep = function(from, id) {
                let array = BoxPlayWebSearch.STEPS.SEARCH[from];

                for (let step of array) {
                    if (id == step.id) {
                        return step;
                    }
                }

                return undefined;
            }

            let step = undefined;
            let delay = 0;
            switch (name) {
                case "task_enqueued":
                    {
                        step = findStep("HEAD", "search-step-queue");
                        break;
                    }

                case "task_progression_notification":
                    {
                        let task = content.task;
                        let progression = content.progression;
                        let message = content.message;

                        switch (progression) {
                            case "START":
                                {
                                    step = findStep("HEAD", "search-step-started");
                                    break;
                                }

                            case "WORKING":
                                {
                                    if (message != undefined && message.from == "PROVIDER") {
                                        let submessage = message.submessage;
                                        let localStep = findStep("PROVIDERS", "search-step-provider-" + message.manager.toLowerCase());

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
                                    break;
                                }

                            case "FINISHED":
                                {
                                    step = findStep("TAIL", "search-step-finished");
                                    delay = 100;

                                    setTimeout(function() {
                                        i18n.applyOn(document);
                                    }, 300);
                                    break;
                                }
                        }
                        break;
                    }
            }

            if (step != undefined) {
                setTimeout(function() {
                    step.complete();
                }, delay);
            }
        });

        BoxPlayWebSocket.subscribe(["task_progression_notification", "task_enqueued"], function(name, content) {
            if (!BoxPlayWebSearch.MODALS.GET_ADDITIONAL.isOpen()) {
                return;
            }

            let findStep = function(id) {
                let array = BoxPlayWebSearch.STEPS.GET_ADDITIONAL;

                for (let step of array) {
                    if (id == step.id) {
                        return step;
                    }
                }

                return undefined;
            }

            let step = undefined;
            let delay = 0;
            switch (name) {
                case "task_enqueued":
                    {
                        step = findStep("get-additional-step-queue");
                        break;
                    }

                case "task_progression_notification":
                    {
                        let task = content.task;
                        let progression = content.progression;
                        let message = content.message;

                        switch (progression) {
                            case "START":
                                {
                                    step = findStep("get-additional-step-started");
                                    break;
                                }

                            case "WORKING":
                                {
                                    if (message != null) {
                                        let current = message.current;
                                        let eta = message.eta;

                                        if (current != null) {
                                            let localStep = findStep("get-additional-step-" + current.toLowerCase());

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
                                    break;
                                }

                            case "FINISHED":
                                {
                                    step = findStep("get-additional-step-finished");
                                    delay = 100;

                                    setTimeout(function() {
                                        i18n.applyOn(document);
                                    }, 300);
                                    break;
                                }
                        }
                        break;
                    }
            }

            if (step != undefined) {
                setTimeout(function() {
                    step.complete();
                }, delay);
            }
        });

        BoxPlayWebSocket.subscribe(["task_progression_notification", "task_enqueued"], function(name, content) {
            if (!BoxPlayWebSearch.MODALS.EXTRACT_PLAYER_URLS.isOpen()) {
                return;
            }

            let findStep = function(id) {
                let array = BoxPlayWebSearch.STEPS.EXTRACT_PLAYER_URLS;

                for (let step of array) {
                    if (id == step.id) {
                        return step;
                    }
                }

                return undefined;
            }

            let step = undefined;
            let delay = 0;
            switch (name) {
                case "task_enqueued":
                    {
                        step = findStep("extract-player-urls-step-queue");
                        break;
                    }

                case "task_progression_notification":
                    {
                        let task = content.task;
                        let progression = content.progression;
                        let message = content.message;

                        switch (progression) {
                            case "START":
                                {
                                    step = findStep("extract-player-urls-step-started");
                                    break;
                                }

                            case "FINISHED":
                                {
                                    step = findStep("extract-player-urls-step-finished");
                                    delay = 100;
                                    break;
                                }
                        }
                        break;
                    }
            }

            if (step != undefined) {
                setTimeout(function() {
                    step.complete();
                }, delay);
            }
        });
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

        BoxPlayWebSearch.MODALS.SEARCH.open();

        BoxPlayWebSearch.createProviderSteps();

        let steps = [];
        for (let map in BoxPlayWebSearch.STEPS.SEARCH) {
            for (let step of BoxPlayWebSearch.STEPS.SEARCH[map]) {
                steps.push(step);
            }
        }

        steps.forEach((step) => step.hide());

        steps[0].complete();
        BoxPlayWebSocket.request("search", {
            "query": query,
            "providers": providers,
        });
    }

    static createProviderSteps() {
        let steps = [];

        for (let provider of mainVue.providers) {
            if (mainVue.enabledProviders.indexOf(provider.manager) != -1) {
                steps.push(BoxPlayWebSearch.createSearchStep("search-step-provider-" + provider.manager.toLowerCase(), 2));
            }
        }

        BoxPlayWebSearch.STEPS.SEARCH.PROVIDERS = steps;
    }

    static createSearchStep(elementId, elementOffset = 1, modal) {
        let element = document.getElementById(elementId);

        return {
            "element": element,
            "id": elementId,
            "visible": true,
            "getCheckmarkElement": function() {
                return this.element.children[0].children[elementOffset];
            },
            "icons": {
                "current": "sync",
                "done": "check",
                "error": "close",
            },
            "hide": function() {
                this.visible = false;

                this.getCheckmarkElement().style.display = "none";
            },
            "changeIcon": function(icon) {
                if (!this.visible) {
                    this.show();
                }

                this.getCheckmarkElement().innerText = this.icons[icon];
            },
            "show": function() {
                this.visible = true;

                this.getCheckmarkElement().style.display = "";
            },
            "complete": function() {
                this.changeIcon("done");

                /* Auto-Close if this step is the last */
                if (modal) {
                    modal.close();
                }
            }
        }
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

        let steps = BoxPlayWebSearch.STEPS.GET_ADDITIONAL;
        steps.forEach((step) => step.hide());
        steps[0].complete();

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

        BoxPlayWebSearch.MODALS.EXTRACT_PLAYER_URLS.open();

        let steps = BoxPlayWebSearch.STEPS.EXTRACT_PLAYER_URLS;
        steps.forEach((step) => step.hide());
        steps[0].complete();

        BoxPlayWebSocket.request("extract_url", {
            "source_result": sourceResult,
            "data_object": dataObject,
        });
    }

    static onCancelPlayerUrlSelection(event) {
        
    }

}
