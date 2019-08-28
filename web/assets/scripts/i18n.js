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
        english.set("warning.header", "Warning");
        english.set("warning.message.not-complete", "This version is not complete and has a serious lack of feature.");
        english.set("search.label", "Search");
        english.set("settings.header", "Settings");
        english.set("settings.providers.header", "Providers");
        english.set("settings.language.header", "Language");
        english.set("settings.actions.header", "Actions");
        english.set("settings.actions.clear-server-cache", "CLEAR SERVER CACHE");
        english.set("settings.actions.clear-search-results", "CLEAR SEARCH RESULTS");
        english.set("result.tabs.informations.label", "INFORMATIONS");
        english.set("result.tabs.content.label", "CONTENT");
        english.set("initialization-step.please-wait", "please wait");
        english.set("initialization-step.connect.label", "Connecting");
        english.set("initialization-step.handshake.label", "Identifying");
        english.set("initialization-step.retrieve.label", "Getting base data");
        english.set("search-step.request.label", "Request");
        english.set("search-step.queue.label", "Queue");
        english.set("search-step.started.label", "Started");
        english.set("search-step.finished.label", "Finished");
        english.set("gallery.button.back", "Back");

        let french = i18n.registerLanguage("fr", "Français");
        french.set("date.at", "à");
        french.set("warning.header", "Attention");
        french.set("warning.message.not-complete", "Cette version n'est pas complète et a un sérieux manque de fonctionnalité.");
        french.set("search.label", "Recherche");
        french.set("settings.header", "Paramètres");
        french.set("settings.providers.header", "Fournisseurs");
        french.set("settings.language.header", "Langage");
        french.set("settings.actions.header", "Actions");
        french.set("settings.actions.clear-server-cache", "VIDER LE CACHE DU SERV.");
        french.set("settings.actions.clear-search-results", "VIDER LES RéSULTATS".toUpperCase());
        french.set("result.tabs.informations.label", "INFORMATIONS");
        french.set("result.tabs.content.label", "CONTENU");
        french.set("initialization-step.please-wait", "veuillez patienter");
        french.set("initialization-step.connect.label", "Connection");
        french.set("initialization-step.handshake.label", "Identification");
        french.set("initialization-step.retrieve.label", "Récupération de données de base");
        french.set("search-step.request.label", "Requête");
        french.set("search-step.queue.label", "File d'attente");
        french.set("search-step.started.label", "Démarré");
        french.set("search-step.finished.label", "Terminé");
        french.set("gallery.button.back", "Retour");
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
