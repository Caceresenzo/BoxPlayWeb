class BoxPlayWebModal {

    constructor(id, dismissible=false) {
        this.id = id;
        this.opened = false;
        this.modal = $("#" + id).modal({
            "dismissible": dismissible,
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
