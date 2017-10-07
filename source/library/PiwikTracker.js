import querystring from "querystring-es3";

const DEFAULT_TRACK_URL = "buttercup://mobile/beta";
const PIWIK_CVAR_ID_LOOKUP = {
    version: "1"
};

function generateCVarString(properties) {
    const keys = Object.keys(properties);
    const cvarObj = keys.reduce((obj, key) => {
        const thisID = PIWIK_CVAR_ID_LOOKUP[key];
        obj[thisID] = [key, properties[key]];
        return obj;
    }, {});
    return JSON.stringify(cvarObj);
}

function sendPayload(fetchFn, trackerURL, payload) {
    const url = `${trackerURL}?${querystring.stringify(payload)}`;
    return fetch(url).then(response => {
        if (/^(200|30[12478])$/.test(response.status) !== true) {
            throw new Error(`Tracking failed: Bad response code: ${response.status} ${response.statusText}`);
        }
    });
}

export default class PiwikTracker {

    constructor(piwikID, piwikURL) {
        this._id = piwikID;
        this._url = piwikURL;
        this._fetchMethod = fetch;
    }

    get fetchMethod() {
        return this._fetchMethod;
    }

    get id() {
        return this._id;
    }

    get url() {
        return this._url;
    }

    set fetchMethod(fn) {
        this._fetchMethod = fn || fetch;
    }

    track(action, properties) {
        const availableKeys = Object.keys(PIWIK_CVAR_ID_LOOKUP);
        const providedKeys = Object.keys(properties);
        providedKeys.forEach(key => {
            if (availableKeys.indexOf(key) < 0) {
                throw new Error(`Tracking property not recognised: ${key}`);
            }
        });
        const cvarJSON = generateCVarString(properties);
        const payload = {
            url: DEFAULT_TRACK_URL,
            action_name: action,
            cvar: cvarJSON,
            idsite: this.id,
            rec: 1
        };
        return sendPayload(this.fetchMethod, this.url, payload)
            .then(() => {
                console.log("Tracking sent:", action, payload);
            });
    }

}
