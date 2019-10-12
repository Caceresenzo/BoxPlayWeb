class BoxPlayWebConnectPanel {

    static initialize() {
        const modal = new BoxPlayWebSteppedModal("modal-initialization");
        modal
            .withPrefix("initialization")
            .withSteps([
                new BoxPlayWebModalStep("initialization-step-connect"),
                new BoxPlayWebModalStep("initialization-step-handshake"),
                new BoxPlayWebModalStep("initialization-step-retrieve", 1, modal),
            ])
            .open(false)

        BoxPlayWebSocket.listen("onerror", function(error) {
            BoxPlayWeb.reset();

            modal.open();
        });

        BoxPlayWebSocket.listen("onopen", function() {
            modal.findStep("step-connect").complete();

            BoxPlayWeb.handshake();
        });

        BoxPlayWebSocket.subscribe(["handshake"], function() {
            if (BoxPlayWeb.token != undefined) {
                modal.findStep("step-handshake").complete();
            }
        });

        BoxPlayWebSocket.subscribe(["provider_list"], function() {
            if (BoxPlayWeb.providers.length != 0) {
                modal.findStep("step-retrieve").complete();
            }
        });

        BoxPlayWebConnectPanel.modal = modal;
    }

}
