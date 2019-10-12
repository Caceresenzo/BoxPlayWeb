class BoxPlayWebVideo {

    static initialize() {
        const videoPlayerElementId = "video-player";
        const iframeEmbedElementId = "iframe-embed";

        BoxPlayWebVideo.player = document.getElementById(videoPlayerElementId);
        BoxPlayWebVideo.playerjs = videojs(videoPlayerElementId);
        BoxPlayWebVideo.iframeEmbed = document.getElementById(iframeEmbedElementId);

        BoxPlayWebVideo.MODALS = {
            "VIDEO_PLAYER": new BoxPlayWebModal("modal-video-player"),
            "IFRAME_EMBED": new BoxPlayWebModal("modal-iframe-embed")
        }
    }

    static play(url) {
        if (url == null) {
            BoxPlayWebVideo.playerjs.pause();
            BoxPlayWebVideo.playerjs.reset();
            BoxPlayWebVideo.MODALS.VIDEO_PLAYER.close();
        } else {
            BoxPlayWebVideo.playerjs.src({type: 'video/mp4', src: url});
            BoxPlayWebVideo.MODALS.VIDEO_PLAYER.open();
        }
    }

    static iframe(url) {
        if (url == null) {
            BoxPlayWebVideo.iframeEmbed.src = "about:blank";
            BoxPlayWebVideo.MODALS.IFRAME_EMBED.close();
        } else {
            BoxPlayWebVideo.iframeEmbed.src = url;
            BoxPlayWebVideo.MODALS.IFRAME_EMBED.open();
        }
    }

    static onCancelVideoModal() {
        BoxPlayWebVideo.play(null);
    }

    static onCancelIFrameModal() {
        BoxPlayWebVideo.iframe(null);
    }

}
