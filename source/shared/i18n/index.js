import i18n from "i18next";
import DeviceInfo from "react-native-device-info";
import localesConfig from "../../../locales/config";

const languageDetector = {
    init: Function.prototype,
    type: "languageDetector",
    detect: () => DeviceInfo.getDeviceLocale(),
    cacheUserLanguage: Function.prototype
};

// get all configurated languages
const languages = {};
Object.keys(localesConfig.languages).forEach(key => {
    languages[key] = {};
    languages[key].name = localesConfig.languages[key].name;

    console.log(languages[key]);
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
    debug: true,
    saveMissingTo: "all",
    saveMissing: false,
    returnEmptyString: false
});

export default i18n;
