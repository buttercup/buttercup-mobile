import i18n from "i18next";
import localesConfig from "../../../locales/config";
import * as RNLocalize from "react-native-localize";

const languageDetector = {
    init: Function.prototype,
    type: "languageDetector",
    detect: () =>
        RNLocalize.getLocales().find(locale => locale.countryCode === RNLocalize.getCountry())
            .languageCode || localesConfig.fallbackLng,
    cacheUserLanguage: Function.prototype
};

// get all configurated languages
const languages = {};
Object.keys(localesConfig.languages).forEach(key => {
    languages[key] = {};
    languages[key].name = localesConfig.languages[key].name;

    localesConfig.types.forEach(type => {
        languages[key][type] = localesConfig.languages[key].data;
    });
});

i18n.use(languageDetector).init({
    fallbackLng: localesConfig.fallbackLng,
    resources: languages,
    react: {
        wait: false
    },
    ns: ["base"],
    defaultNS: "base",
    nsSeparator: ":",
    keySeparator: ".",
    pluralSeparator: "_",
    contextSeparator: "-",
    debug: false,
    saveMissingTo: "all",
    saveMissing: false,
    returnEmptyString: false
});

export default i18n;
