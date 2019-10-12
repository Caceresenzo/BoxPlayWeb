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
        },
        results: function(val) {
            setTimeout(function() {
                i18n.applyOn(document);
            }, 100);
        }
    },
    data: {
        console: console,
        translate: function(key) {
            return i18n.get(key);
        },
        enums: {
            ClientSensibility: ClientSensibility
        },
        languages: [],
        selectedLanguage: null,
        providers: [],
        enabledProviders: BoxPlayWebSearch.getEnabledProvidersFromCookies(),
        results: [],
        extractedUrls: {
            title: "",
            subtitle: "",
            urls: [/*
                {
                    url: "https://gounlimited.to/embed-9x5xwp0muhs4.html",
                    extractor: null,
                },
                {
                    url: "https://www.freshstream.kiwi/embed/8r0Z7NklLjVOLR4",
                    extractor: {
                        class: "GenericVeryStreamVideoExtractor",
                        client_sensibility: "IP_MATCH"
                    },
                },
                {
                    url: "https://www.freshstream.kiwi/embed/8r0Z7NklLjVOLR4",
                    extractor: {
                        class: "GenericVeryStreamVideoExtractor",
                        client_sensibility: "pother"
                    },
                }*/
            ],
            qualities: [
                {
                    "resolution": "600x455",
                    "url": "https://lh3.googleusercontent.com/Fj_re2WtewANSZyQ6aS06jzs8_jRAu6ldhZRanAvTXuGiAOlC6YbvpldQhekT9UxHaQpcWIxF7Bg8AntMQMZ2VHKFVm8lxL1iZ1afu5H6JCT2f4C7qGp6oAShTY2KRGJVmBVpIf10A=w600-h315-k-no-m37?Signature=2cad2f543c5d59f6bcec48f5e4f18d7b&Expires=1570739796&AccessKeyId=AAMF48SDFZ8987IOPH"
                }
            ]
        }
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
