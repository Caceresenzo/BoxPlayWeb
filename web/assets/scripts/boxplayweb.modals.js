class BoxPlayWebModal {

    constructor(id) {
        this.id = id;
        this.opened = false;
        this.modal = $("#" + id).modal({
            "dismissible": false,
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
