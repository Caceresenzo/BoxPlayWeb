class BoxPlayWebModal {

    constructor(id, dismissible = false) {
        this.id = id;
        this.opened = false;
        this.modal = $("#" + id).modal({
            "dismissible": dismissible,
            "preventScrolling": true,
        });
    }

    open() {
        this.opened = true;

        this.modal.modal("open");
    }

    close() {
        this.opened = false;

        this.modal.modal("close");
    }

    isOpen() {
        return this.opened;
    }

}

class BoxPlayWebModalStep {
    constructor(elementId, elementOffset = 1, modalToClose) {
        this.elementId = elementId;
        this.elementOffset = elementOffset;
        this.modalToClose = modalToClose;

        this.element = document.getElementById(elementId);
        this.visible = true;
        this.icons = {
            "current": "sync",
            "done": "check",
            "error": "close",
        }
    }

    getCheckmarkElement() {
        return this.element.children[0].children[this.elementOffset];
    }

    hide() {
        this.visible = false;

        this.getCheckmarkElement().style.display = "none";
    }

    changeIcon(icon) {
        if (!this.visible) {
            this.show();
        }

        this.getCheckmarkElement().innerText = this.icons[icon];
    }

    show() {
        this.visible = true;

        this.getCheckmarkElement().style.display = "";
    }

    complete(delay = 0) {
        let instance = this;

        setTimeout(function() {
            instance.changeIcon("done");

            /* Auto-Close if this step is the last */
            if (instance.modalToClose) {
                instance.modalToClose.close();
            }
        }, delay);
    }
}

class BoxPlayWebSteppedModal extends BoxPlayWebModal {

    constructor(id) {
        super(id, false);

        this.prefix = null;
        this.steps = [];
    }

    withPrefix(prefix) {
        this.prefix = prefix;

        return this;
    }

    withStep(step) {
        this.steps.push(step);

        return this;
    }

    withSteps(steps) {
        steps.forEach((step) => this.withStep(step));

        return this;
    }

    withDefaultSteps(inBetween = []) {
        this.withSteps([
                new BoxPlayWebModalStep(this.prefix + "-step-request"),
                new BoxPlayWebModalStep(this.prefix + "-step-queue"),
                new BoxPlayWebModalStep(this.prefix + "-step-started"),
            ])
            .withSteps(inBetween)
            .withStep(new BoxPlayWebModalStep(this.prefix + "-step-finished", 1, this));

        return this;
    }

    clearSteps() {
        this.steps.length = 0;

        return this;
    }

    getSafePrefix(after) {
        return this.prefix ? (this.prefix + after) : "";
    }

    open(completeFirst = false) {
        if (!this.opened) {
            this.hideAllSteps();

            if (completeFirst && this.steps.length > 0) {
                this.steps[0].complete();
            }
        }

        super.open();
    }

    hideAllSteps() {
        this.steps.forEach((step) => step.hide());
    }

    findStep(elementId) {
        let prefix = this.getSafePrefix("-");

        for (let step of this.steps) {
            if (prefix + elementId == step.elementId) {
                return step;
            }
        }

        return undefined;
    }

    handle(progressHandler = null) {
        let instance = this;

        BoxPlayWebSocket.subscribe(["task_progression_notification", "task_enqueued"], function(name, content) {
            if (!instance.isOpen()) {
                return;
            }

            switch (name) {
                case "task_enqueued":
                    {
                        instance.findStep("step-queue").complete();
                        return;
                    }

                case "task_progression_notification":
                    {
                        let task = content.task;
                        let progression = content.progression;
                        let message = content.message;

                        switch (progression) {
                            case "START":
                                {
                                    instance.findStep("step-started").complete();
                                    break;
                                }

                                case "WORKING":
                                    {
                                        if (progressHandler != null) {
                                            progressHandler(instance, name, content, task, progression, message);
                                        }
                                        break;
                                    }

                            case "FINISHED":
                                {
                                    instance.findStep("step-finished").complete(100);
                                    break;
                                }
                        }

                        return;
                    }
            }
        });

        return this;
    }



}
