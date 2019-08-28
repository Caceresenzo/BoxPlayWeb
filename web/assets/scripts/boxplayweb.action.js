class BoxPlayWebAction {

    static initialize() {

    }

    static requestServerCacheClearing() {
        BoxPlayWebSocket.request("clear_cache", {});
    }

    static clearSearchResults() {
        clearVueJsField(mainVue.results);

        BoxPlayWeb.results.length = 0;
    }

}
