class BoxPlayWebSearch {

    static initialize() {
        BoxPlayWebSearch.modal = undefined;
        BoxPlayWebSearch.inSearch = false;

        BoxPlayWebSearch.DIVS = {
            "FORM": document.getElementById("form-search"),
        }

        BoxPlayWebSearch.INPUTS = {
            "QUERY": document.getElementById("input-search"),
        }

        BoxPlayWebSearch.steps = {
            "head": [
                BoxPlayWebSearch.createStep("search-step-request"),
                BoxPlayWebSearch.createStep("search-step-queue"),
                BoxPlayWebSearch.createStep("search-step-started"),
            ],
            "providers": [],
            "tail": [
                BoxPlayWebSearch.createStep("search-step-finished", 1, true),
            ]
        }

        BoxPlayWebSearch.attachEvent();

        BoxPlayWebSocket.subscribe(["task_progression_notification", "task_enqueued"], function(name, content) {
            if (!BoxPlayWebSearch.inSearch) {
                return;
            }

            let findStep = function(from, id) {
                let array = BoxPlayWebSearch.steps[from];

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
                        step = findStep("head", "search-step-queue");
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
                                    step = findStep("head", "search-step-started");
                                    break;
                                }

                            case "WORKING":
                                {
                                    if (message != undefined && message.from == "PROVIDER") {
                                        let submessage = message.submessage;

                                        let localStep = findStep("providers", "search-step-provider-" + message.manager.toLowerCase());

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
                                    step = findStep("tail", "search-step-finished");
                                    delay = 1500;

                                    setTimeout(function() {
                                        i18n.applyOn(document);
                                    }, 500);
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

    static reset() {

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

        BoxPlayWebSearch.inSearch = true;

        if (BoxPlayWebSearch.modal == undefined) {
            BoxPlayWebSearch.modal = $("#modal-search").modal({
                "dismissible": false,
            });
        } else {
            BoxPlayWebSearch.reset();
        }
        BoxPlayWebSearch.modal.modal("open");

        BoxPlayWebSearch.createProviderSteps();

        let steps = [];
        for (let map in BoxPlayWebSearch.steps) {
            for (let step of BoxPlayWebSearch.steps[map]) {
                steps.push(step);
            }
        }

        steps.forEach((step) => step.hide());

        steps[0].complete();
        BoxPlayWebSocket.request("search", {
            "query": query,
            "providers": providers,
        });
        /*
         * let index = 0; for (let step of steps) { step.hide(); setTimeout(function() { step.complete(); }, 1000 * index) index++; }
         */
    }

    static createProviderSteps() {
        let steps = [];

        for (let provider of mainVue.providers) {
            if (mainVue.enabledProviders.indexOf(provider.manager) != -1) {
                steps.push(BoxPlayWebSearch.createStep("search-step-provider-" + provider.manager.toLowerCase(), 2));
            }
        }

        BoxPlayWebSearch.steps.providers = steps;
    }

    static createStep(elementId, elementOffset = 1, last = false) {
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
                setTimeout(function() {
                    if (last) {
                        BoxPlayWebSearch.modal.modal("close");
                        BoxPlayWebSearch.inSearch = false;
                    }
                }, 200);
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

        BoxPlayWebSocket.request("get_additional", {
            "object": corresponding.object,
        });
    }

}
