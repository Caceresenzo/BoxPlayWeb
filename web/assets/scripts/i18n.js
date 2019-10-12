class i18n {

    static initialize() {
        i18n.translation = {};
        i18n.language = null;

        i18n.COOKIES = {
            "LANGUAGE": {
                name: "language",
                default: LANGUAGE_DEFAULT,
            }
        }

        i18n.registerHardcodedLanguages();
        i18n.prepareSettingsSection();
        i18n.restoreLanguageFromCookies();
    }

    static registerHardcodedLanguages() {
        let english = i18n.registerLanguage("en", "English");
        english.set("date.at", "at");
        english.set("button.close", "Close");
        english.set("warning.header", "Warning");
        english.set("warning.message.not-complete", "This version is not complete and lack of feature.");
        english.set("search.label", "Search");
        english.set("settings.header", "Settings");
        english.set("settings.providers.header", "Providers");
        english.set("settings.language.header", "Language");
        english.set("settings.actions.header", "Actions");
        english.set("settings.actions.clear-server-cache", "CLEAR SERVER CACHE");
        english.set("settings.actions.clear-search-results", "CLEAR SEARCH RESULTS");
        english.set("result.empty", "Aucun résultat");
        english.set("result.tabs.informations.label", "INFORMATIONS");
        english.set("result.tabs.content.label", "CONTENT");
        english.set("result.type.thumbnail", "Thumbnail");
        english.set("result.type.name", "Name");
        english.set("result.type.original_name", "Original Name");
        english.set("result.type.alternative_name", "Alternative Name");
        english.set("result.type.other_name", "Other Name");
        english.set("result.type.type", "Type");
        english.set("result.type.quality", "Quality");
        english.set("result.type.version", "Version");
        english.set("result.type.rank", "Rank");
        english.set("result.type.traduction_team", "Traduction Team");
        english.set("result.type.genders", "Genders");
        english.set("result.type.last_chapter", "Last Chapter");
        english.set("result.type.status", "Status");
        english.set("result.type.country", "Country");
        english.set("result.type.director", "Director");
        english.set("result.type.authors", "Authors");
        english.set("result.type.actors", "Actors");
        english.set("result.type.artists", "Artists");
        english.set("result.type.studios", "Studios");
        english.set("result.type.channels", "Channels");
        english.set("result.type.last_updated", "Last Updated");
        english.set("result.type.release_date", "Release Date");
        english.set("result.type.animation_studio", "Animation Studio");
        english.set("result.type.publishers", "Publisher");
        english.set("result.type.views", "Views");
        english.set("result.type.duration", "Duration");
        english.set("result.type.under_license", "Under License");
        english.set("result.type.resume", "Resume");
        english.set("result.type.rating", "Rating");
        english.set("result.type.simple_html", "Unprocessed");
        english.set("result.type.item_video", "Video");
        english.set("result.type.item_chapter", "Chapter");
        english.set("result.type.null", "Unknown");
        english.set("result.button.watch", "Watch");
        english.set("result.button.read", "Read");
        english.set("initialization-step.please-wait", "please wait");
        english.set("initialization-step.connect.label", "Connecting");
        english.set("initialization-step.handshake.label", "Identifying");
        english.set("initialization-step.retrieve.label", "Getting base data");
        english.set("generic-step.request.label", "Request");
        english.set("generic-step.queue.label", "Queue");
        english.set("generic-step.started.label", "Started");
        english.set("generic-step.finished.label", "Finished");
        english.set("get-additional-step.informations.label", "Informations");
        english.set("get-additional-step.content.label", "Content");
        english.set("gallery.button.back", "Back");
        english.set("quality-selector.default", "Default quality");
        english.set("url.message.extractable", "Extractable");
        english.set("url.message.extractable-not-compatible", "Extractable, but incompatible");
        english.set("url.message.not-extractable", "Not extractable");

        let french = i18n.registerLanguage("fr", "Français");
        french.set("date.at", "à");
        french.set("button.close", "Fermer");
        french.set("warning.header", "Attention");
        french.set("warning.message.not-complete", "Cette version n'est pas complète et manque de fonctionnalité.");
        french.set("search.label", "Recherche");
        french.set("settings.header", "Paramètres");
        french.set("settings.providers.header", "Fournisseurs");
        french.set("settings.language.header", "Langage");
        french.set("settings.actions.header", "Actions");
        french.set("settings.actions.clear-server-cache", "VIDER LE CACHE DU SERV.");
        french.set("settings.actions.clear-search-results", "VIDER LES RéSULTATS".toUpperCase());
        french.set("result.empty", "Aucun résultat");
        french.set("result.tabs.informations.label", "INFORMATIONS");
        french.set("result.tabs.content.label", "CONTENU");
        french.set("result.type.thumbnail", "Mignature");
        french.set("result.type.name", "Nom");
        french.set("result.type.original_name", "Nom Original");
        french.set("result.type.alternative_name", "Nom Alternatif");
        french.set("result.type.other_name", "Autre Nom");
        french.set("result.type.type", "Type");
        french.set("result.type.quality", "Qualité");
        french.set("result.type.version", "Version");
        french.set("result.type.rank", "Rank");
        french.set("result.type.traduction_team", "é".toUpperCase() + "quipe de Traduction");
        french.set("result.type.genders", "Catégories");
        french.set("result.type.last_chapter", "Dernier Chapitre");
        french.set("result.type.status", "Status");
        french.set("result.type.country", "Pays");
        french.set("result.type.director", "Directeur");
        french.set("result.type.authors", "Auteurs");
        french.set("result.type.actors", "Acteurs");
        french.set("result.type.artists", "Artistes");
        french.set("result.type.studios", "Studios");
        french.set("result.type.channels", "Chaines");
        french.set("result.type.last_updated", "Dernière Mise à Jour");
        french.set("result.type.release_date", "Date de Sortie");
        french.set("result.type.animation_studio", "Studio d'Animation");
        french.set("result.type.publishers", "Publicateur");
        french.set("result.type.views", "Nombre de Vues");
        french.set("result.type.duration", "Durée");
        french.set("result.type.under_license", "Sous Licence");
        french.set("result.type.resume", "Synopsis");
        french.set("result.type.rating", "Note");
        french.set("result.type.simple_html", "Non Traité");
        french.set("result.type.item_video", "Vidéo");
        french.set("result.type.item_chapter", "Chapitre");
        french.set("result.type.null", "Inconnu");
        french.set("result.button.watch", "Regarder");
        french.set("result.button.read", "Lire");
        french.set("initialization-step.please-wait", "veuillez patienter");
        french.set("initialization-step.connect.label", "Connection");
        french.set("initialization-step.handshake.label", "Identification");
        french.set("initialization-step.retrieve.label", "Récupération de données de base");
        french.set("generic-step.request.label", "Requête");
        french.set("generic-step.queue.label", "File d'attente");
        french.set("generic-step.started.label", "Démarré");
        french.set("generic-step.finished.label", "Terminé");
        french.set("get-additional-step.informations.label", "Informations");
        french.set("get-additional-step.content.label", "Contenu");
        french.set("gallery.button.back", "Retour");
        french.set("quality-selector.default", "Qualité par defaut");
        french.set("url.message.extractable", "Extractible");
        french.set("url.message.extractable-not-compatible", "Extractible, mais incompatible");
        french.set("url.message.not-extractable", "Not extractible");
    }

    static prepareSettingsSection() {
        for (let language in i18n.translation) {
            let map = i18n.translation[language];

            mainVue.languages.push({
                "name": map.name,
                "code": map.code,
            });
        }
    }

    static restoreLanguageFromCookies() {
        let cookieLanguage = Cookies.get(i18n.COOKIES.LANGUAGE.name);
        let correspondingLanguage = i18n.translation[cookieLanguage];

        if (cookieLanguage == null || correspondingLanguage == null) {
            correspondingLanguage = i18n.translation[i18n.COOKIES.LANGUAGE.default];
        }

        i18n.selectLanguage(correspondingLanguage.code);
    }

    static registerLanguage(code, name) {
        return i18n.translation[code] = new LanguageMap(code, name);
    }

    static selectLanguage(code) {
        Cookies.set(i18n.COOKIES.LANGUAGE.name, code);
        i18n.language = i18n.translation[code];

        i18n.applyOn(document);

        mainVue.selectedLanguage = code;
    }

    static applyOn(container) {
        let elements = undefined;

        if (container.children.length == 0) {
            elements = [container];
        } else {
            elements = container.getElementsByClassName("translatable");
        }

        for (let element of elements) {
            let dataset = element.dataset;
            let key = dataset["i18n"];

            if (key == null) {
                console.warn("i18n: You are using a \"translatable\" class without adding the \"i18n\" dataset.", element);
            } else {
                element.innerHTML = i18n.get(key);
            }
        }
    }

    static get(key, defaultValue = null) {
        let value = i18n.language.map[key];

        if (value != null) {
            return value;
        }

        return defaultValue != null ? defaultValue : ("%" + key + "%");
    }

}

class LanguageMap {

    constructor(code, name) {
        this.code = code;
        this.name = name;
        this.map = {};

        this.set("language.name", name);
        this.set("language.name.upper", name.toUpperCase());
        this.set("language.code", code);
        this.set("language.code.upper", code.toUpperCase());
    }

    set(key, value) {
        this.map[key] = value;
    }

}
