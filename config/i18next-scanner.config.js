const fs = require("fs");
const chalk = require("chalk");
const localesConfig = require("../locales/config");

module.exports = {
    options: {
        debug: false,
        func: {
            list: ["i18next.t", "i18n.t", "t"]
        },
        lngs: Object.keys(localesConfig.languages).map(key => key),
        ns: ["base"],
        defaultNs: "base",
        resource: {
            loadPath: "locales/{{lng}}/{{ns}}.json",
            savePath: "locales/{{lng}}/{{ns}}.json"
        },
        nsSeparator: ":",
        keySeparator: ".",
        pluralSeparator: "_",
        contextSeparator: "-"
    }
};
