function clearVueJsField(array) {
	let length = array.length;

	for (let index = 0; index < length; index++) {
		array.pop();
	}
}

var mainVue = new Vue({
    el : '#main',
    watch : {
	    selectedLanguage : function(val) {
		    i18n.selectLanguage(val);
	    },
	    enabledProviders : function(val) {
		    BoxPlayWebSearch.saveEnabledProvidersToCookies();
	    }
    },
    data : {
        languages : [],
        selectedLanguage : null,
        providers : [],
        enabledProviders : BoxPlayWebSearch.getEnabledProvidersFromCookies(),
        translations : {
            "THUMBNAIL" : "Thumbnail",
            "NAME" : "Name",
            "ORIGINAL_NAME" : "Original Name",
            "ALTERNATIVE_NAME" : "Alternative Name",
            "OTHER_NAME" : "Other Name",
            "TYPE" : "Type",
            "QUALITY" : "Quality",
            "VERSION" : "Version",
            "RANK" : "Rank",
            "TRADUCTION_TEAM" : "Traduction Team",
            "GENDERS" : "Genders",
            "LAST_CHAPTER" : "Last Chapter",
            "STATUS" : "Status",
            "COUNTRY" : "Country",
            "DIRECTOR" : "Director",
            "AUTHORS" : "Authors",
            "ACTORS" : "Actors",
            "ARTISTS" : "Artists",
            "STUDIOS" : "Studios",
            "CHANNELS" : "Channels",
            "LAST_UPDATED" : "Last Updated",
            "RELEASE_DATE" : "Release Date",
            "ANIMATION_STUDIO" : "Animation Studio",
            "PUBLISHERS" : "Publisher",
            "VIEWS" : "Views",
            "DURATION" : "Dutation",
            "UNDER_LICENSE" : "Under License",
            "RESUME" : "Resume",
            "RATING" : "Rating",
            "SIMPLE_HTML" : "Unprocessed",
            "ITEM_VIDEO" : "Video",
            "ITEM_CHAPTER" : "Chapter",
            "NULL" : "Unknown"
        },
        results : [
        // {
        // "uid" : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        // "title" : "Re:Zero Kara Hajimeru Isekai Seikatsu",
        // "description" : null,
        // "picture_url" : "https://www.jetanime.to/assets/imgs/rezero-kara-hajimeru-isekai-seikatsu.jpg",
        // "type" : "ANIME",
        // "provider" : {
        // "class" : "JetAnimeAnimeSearchAndGoProvider",
        // "name" : "JetAnime"
        // },
        // "additional_data" : {
        // "informations" : [ {
        // "type" : "NAME",
        // "value" : "Re:Zero Kara Hajimeru Isekai Seikatsu"
        // }, {
        // "type" : "ORIGINAL_NAME",
        // "value" : "Re:ゼロから始める異世界生活"
        // }, {
        // "type" : "ALTERNATIVE_NAME",
        // "value" : "Re:ZERO -Starting Life in Another World-, ReZero, Re : Zero kara Hajimeru Isekai Seikatsu, Re: Life in a Different World from Zero"
        // }, {
        // "type" : "GENDERS",
        // "value" : [ {
        // "url" : null,
        // "name" : "Autre Monde"
        // }, {
        // "url" : null,
        // "name" : "Combats"
        // }, {
        // "url" : null,
        // "name" : "Comédie"
        // }, {
        // "url" : null,
        // "name" : "Drame"
        // }, {
        // "url" : null,
        // "name" : "Fantasy"
        // }, {
        // "url" : null,
        // "name" : "Psychologique"
        // }, {
        // "url" : null,
        // "name" : "Romance"
        // }, {
        // "url" : null,
        // "name" : "Thriller"
        // }, {
        // "url" : null,
        // "name" : "Voyage temporel"
        // } ]
        // }, {
        // "type" : "STATUS",
        // "value" : "Terminé"
        // }, {
        // "type" : "AUTHORS",
        // "value" : "Nagatsuki Tappei"
        // }, {
        // "type" : "STUDIOS",
        // "value" : "WHITE FOX"
        // }, {
        // "type" : "RELEASE_DATE",
        // "value" : "2016"
        // }, {
        // "type" : "RESUME",
        // "value" : "Subaru Natsuki est un lycéen comme les autres qui se retrouve un jour perdu dans un monde alternatif. Alors qu'il se trouve en danger, une belle fille aux cheveux argentés fait son apparition pour le sauver. Il décide de rester avec elle afin de ne rien lui devoir. Tous deux se retrouvent malheureusement tués lors d'une attaque ennemie...\r\nIl se réveille un peu plus tard à l'endroit où il est arrivé dans ce monde
		// fantastique. Il comprend alors qu'il a le pouvoir de remonter le temps, mais lui seul se souviens de ce qu'il s'est passé avant sa mort. Notre héros réussira-t-il à changer le cours des événements ?"
        // } ],
        // "content" : [ {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-25-vostfr\/",
        // "name" : "Épisode 25"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-24-vostfr\/",
        // "name" : "Épisode 24"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-23-vostfr\/",
        // "name" : "Épisode 23"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-22-vostfr\/",
        // "name" : "Épisode 22"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-21-vostfr\/",
        // "name" : "Épisode 21"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-20-vostfr\/",
        // "name" : "Épisode 20"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-19-vostfr\/",
        // "name" : "Épisode 19"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-18-vostfr\/",
        // "name" : "Épisode 18"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-17-vostfr\/",
        // "name" : "Épisode 17"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-16-vostfr\/",
        // "name" : "Épisode 16"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-15-vostfr\/",
        // "name" : "Épisode 15"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-14-vostfr\/",
        // "name" : "Épisode 14"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-13-vostfr\/",
        // "name" : "Épisode 13"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-12-vostfr\/",
        // "name" : "Épisode 12"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-11-vostfr\/",
        // "name" : "Épisode 11"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-10-vostfr\/",
        // "name" : "Épisode 10"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-9-vostfr\/",
        // "name" : "Épisode 9"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-8-vostfr\/",
        // "name" : "Épisode 8"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-7-vostfr\/",
        // "name" : "Épisode 7"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-6-vostfr\/",
        // "name" : "Épisode 6"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-5-vostfr\/",
        // "name" : "Épisode 5"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-4-vostfr\/",
        // "name" : "Épisode 4"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-3-vostfr\/",
        // "name" : "Épisode 3"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-2-vostfr\/",
        // "name" : "Épisode 2"
        // }
        // }, {
        // "type" : "ITEM_VIDEO",
        // "value" : {
        // "url" : "https:\/\/www.jetanime.co\/rezero-kara-hajimeru-isekai-seikatsu-1-vostfr\/",
        // "name" : "Épisode 1"
        // }
        // } ]
        // }
        // }, {
        // "uid" : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        // "title" : "Bakemonogatari",
        // "description" : null,
        // "picture_url" : "https://www.jetanime.to/assets/imgs/bakemonogatari.jpg",
        // "type" : "ANIME",
        // "provider" : {
        // "class" : "JetAnimeAnimeSearchAndGoProvider",
        // "name" : "JetAnime"
        // },
        // "additional_data" : {
        // "informations" : [],
        // "content" : []
        // }
        // }, {
        // "uid" : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        // "title" : "Kobayashi-San Chi No Maid Dragon",
        // "description" : null,
        // "picture_url" : "https://www.jetanime.to/assets/imgs/kobayashi-san-chi-no-maid-dragon.jpg",
        // "type" : "ANIME",
        // "provider" : {
        // "class" : "JetAnimeAnimeSearchAndGoProvider",
        // "name" : "JetAnime"
        // },
        // "additional_data" : {
        // "informations" : [],
        // "content" : []
        // }
        // }
        	]
    }
});

function refreshGallery() {
    $('.gallery-expand').galleryExpand({
    	onShow: function() {
			$('ul.tabs').tabs();
    	}
    });
}
