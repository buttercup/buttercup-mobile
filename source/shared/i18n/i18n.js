import i18n from "i18next";
import localesConfig from "../../../locales/config.json";

const langs = {
    en: require("../../../locales/en/base.json"),
    de: require("../../../locales/de/base.json")
};

// get all configurated languages
const languages = {};
Object.keys(localesConfig.languages).forEach(key => {
    languages[key] = {};
    languages[key].name = localesConfig.languages[key].name;

    console.log(languages[key]);
    localesConfig.types.forEach(type => {
        languages[key][type] = langs[key];
    });
});

const resources = Object.keys(languages).reduce((accumulator, key) => {
    accumulator[key] = {};

    localesConfig.types.forEach(type => {
        accumulator[key][type] = languages[key][type];
    });

    return accumulator;
}, {});

i18n.init({
    fallbackLng: localesConfig.fallbackLng,
    resources,
    react: {
        wait: false
    },
    ns: ["base"],
    defaultNS: "base",
    nsSeparator: ":",
    keySeparator: ".",
    pluralSeparator: "_",
    contextSeparator: "-",
    debug: true,
    saveMissingTo: "all",
    saveMissing: false,
    returnEmptyString: false
});

export default i18n;
