import { AsyncStorage } from "react-native";
import querystring from "querystring-es3";
import { doAsyncWork } from "../global/async.js";
import { getUUID } from "./crypto.js";
import { smartFetch } from "./network.js";
import { isTest } from "../global/testing.js";

const DEFAULT_TRACK_URL = "buttercup://mobile/beta";
const PIWIK_CVAR_ID_LOOKUP = {
    version: "1",
    platform: "2",
    platformVersion: "3"
};
const PIWIK_SESSION_ID_KEY = "sessionID";

function generateCVarString(properties) {
    const keys = Object.keys(properties);
    const cvarObj = keys.reduce((obj, key) => {
        const thisID = PIWIK_CVAR_ID_LOOKUP[key];
        obj[thisID] = [key, properties[key]];
        return obj;
    }, {});
    return JSON.stringify(cvarObj);
}

function generateSessionID() {
    return doAsyncWork()
        .then(() => getUUID());
}

function sendPayload(fetchFn, trackerURL, payload) {
    const url = `${trackerURL}?${querystring.stringify(payload)}`;
    if (isTest() === true) {
        return Promise.resolve();
    }
    return fetchFn(url).then(response => {
        if (/^(200|30[12478])$/.test(response.status) !== true) {
            throw new Error(`Tracking failed: Bad response code: ${response.status} ${response.statusText}`);
        }
    });
}

export default class PiwikTracker {

    constructor(piwikID, piwikURL) {
        this._id = piwikID;
        this._url = piwikURL;
        this._fetchMethod = smartFetch;
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
        this._fetchMethod = fn || smartFetch;
    }

    getSessionID() {
        return AsyncStorage
            .getItem(PIWIK_SESSION_ID_KEY)
            .then(sessionID => {
                if (!sessionID) {
                    console.log("Generating new session ID");
                    return generateSessionID()
                        .then(sessionID => AsyncStorage
                            .setItem(PIWIK_SESSION_ID_KEY, sessionID)
                            .then(() => sessionID)
                        );
                }
                return sessionID;
            })
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
            rec: 1,
            apiv: 1
        };
        return this.getSessionID()
            .then(sessionID => {
                Object.assign(payload, {
                    _id: sessionID
                });
                return sendPayload(this.fetchMethod, this.url, payload);
            })
            .then(() => {
                console.log("Tracking sent:", action, payload);
            });
    }

}
