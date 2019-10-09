class BoxPlayWebVideo {

    static initialize() {
        BoxPlayWebVideo.elementId = "video-player";

        BoxPlayWebVideo.player = document.getElementById(BoxPlayWebVideo.elementId);
        BoxPlayWebVideo.playerjs = videojs(BoxPlayWebVideo.elementId);
        BoxPlayWebVideo.modal = new BoxPlayWebModal("modal-video-player");
    }

    static play(url) {
        if (url == null) {
            BoxPlayWebVideo.playerjs.pause();
            BoxPlayWebVideo.playerjs.reset();
            BoxPlayWebVideo.modal.close();
        } else {
            BoxPlayWebVideo.playerjs.src({type: 'video/mp4', src: url});
            BoxPlayWebVideo.modal.open();
        }

        //BoxPlayWebVideo.player.src = url;
    }

    static onCancelVideoModal() {
        BoxPlayWebVideo.play(null);
    }

}
