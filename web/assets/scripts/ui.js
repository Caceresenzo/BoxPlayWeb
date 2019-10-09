function clearVueJsField(array) {
    let length = array.length;

    for (let index = 0; index < length; index++) {
        array.pop();
    }
}

var mainVue = new Vue({
    el: '#main',
    watch: {
        selectedLanguage: function(val) {
            i18n.selectLanguage(val);
        },
        enabledProviders: function(val) {
            BoxPlayWebSearch.saveEnabledProvidersToCookies();
        }
    },
    data: {
        languages: [],
        selectedLanguage: null,
        providers: [],
        enabledProviders: BoxPlayWebSearch.getEnabledProvidersFromCookies(),
        results: [],
        extractedUrls: [
            "google.com",
            "youtube.com"
        ],
    }
});

function refreshGallery() {
    $('.gallery-expand').galleryExpand({
        onShow: function(elements) {
            let element = elements[0];
            
            $('ul.tabs').tabs();

            let type = element.dataset.type;
            if (type == "searchandgo.result") {
                let md5 = element.dataset.md5;

                BoxPlayWebSearch.onResultOpen(md5);
            }
        }
    });
}
