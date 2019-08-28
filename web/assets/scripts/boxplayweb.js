class BoxPlayWeb {

    static initialize() {
        BoxPlayWeb.token = undefined;
        BoxPlayWeb.providers = [];
        BoxPlayWeb.results = [];

        BoxPlaySocket.subscribe(["handshake"], function(name, content) {
            BoxPlayWeb.token = content.token;
            console.log("BoxPlayWeb: Got new token: " + content.token);

            BoxPlayWeb.requestProviders();
        });

        BoxPlaySocket.subscribe(["provider_list"], function(name, content) {
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

        BoxPlaySocket.subscribe(["search_result"], function(name, content) {
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
        BoxPlaySocket.request("handshake", {});
    }

    static requestProviders() {
        BoxPlaySocket.request("provider_list", {});
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

class BoxPlayWebConnectPanel {

    static initialize() {
        BoxPlayWebConnectPanel.modal = undefined;

        BoxPlayWebConnectPanel.steps = [
            BoxPlayWebConnectPanel.createStep("initialization-step-connect"),
            BoxPlayWebConnectPanel.createStep("initialization-step-handshake"),
            BoxPlayWebConnectPanel.createStep("initialization-step-retrieve"),
        ];

        let openModal = function() {
            BoxPlayWebConnectPanel.steps.forEach((step) => {
                step.hide();
            });

            if (BoxPlayWebConnectPanel.modal == undefined) {
                BoxPlayWebConnectPanel.modal = $("#modal-initialization").modal({
                    "dismissible": false,
                });
            } else {
                BoxPlayWeb.reset();
            }
            BoxPlayWebConnectPanel.modal.modal("open");
        }
        BoxPlaySocket.listen("onerror", openModal);
        openModal();

        BoxPlaySocket.listen("onopen", function() {
            BoxPlayWebConnectPanel.steps[0].complete();

            BoxPlayWeb.handshake();
        });

        BoxPlaySocket.subscribe(["handshake"], function() {
            if (BoxPlayWeb.token != undefined) {
                BoxPlayWebConnectPanel.steps[1].complete();
            }
        });

        BoxPlaySocket.subscribe(["provider_list"], function() {
            if (BoxPlayWeb.providers.length != 0) {
                BoxPlayWebConnectPanel.steps[2].complete();
            }
        });
    }

    static createStep(elementId) {
        let element = document.getElementById(elementId);

        return {
            "element": element,
            "id": elementId,
            "getCheckmarkElement": function() {
                return this.element.children[0].children[1];
            },
            "hide": function() {
                this.getCheckmarkElement().style.display = "none";
            },
            "complete": function() {
                this.getCheckmarkElement().style.display = "";

                /* Auto-Close if this step is the last */
                if (BoxPlayWebConnectPanel.steps.lastIndexOf(this) == BoxPlayWebConnectPanel.steps.length - 1) {
                    BoxPlayWebConnectPanel.modal.modal("close");
                }
            }
        }
    }

}

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

        BoxPlaySocket.subscribe(["task_progression_notification", "search_starting_soon"], function(name, content) {
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
                case "search_starting_soon":
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
        BoxPlaySocket.request("search", {
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

}

class BoxPlayWebAction {

    static initialize() {

    }

    static requestServerCacheClearing() {
        BoxPlaySocket.request("clear_cache", {});
    }

    static clearSearchResults() {
        clearVueJsField(mainVue.results);

        BoxPlayWeb.results.length = 0;
    }

}
