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
        BoxPlayWebSocket.listen("onerror", openModal);
        openModal();

        BoxPlayWebSocket.listen("onopen", function() {
            BoxPlayWebConnectPanel.steps[0].complete();

            BoxPlayWeb.handshake();
        });

        BoxPlayWebSocket.subscribe(["handshake"], function() {
            if (BoxPlayWeb.token != undefined) {
                BoxPlayWebConnectPanel.steps[1].complete();
            }
        });

        BoxPlayWebSocket.subscribe(["provider_list"], function() {
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
