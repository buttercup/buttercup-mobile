module.exports = {
    types: ["base"],
    fallbackLng: "en",
    languages: {
        en: {
            name: "English",
            data: require("./en/base.json")
        },
        de: {
            name: "Deutsch",
            data: require("./de/base.json")
        }
    }
};
