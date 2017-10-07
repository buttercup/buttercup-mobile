import PiwikTracker from "./PiwikTracker.js";
import packageInfo from "../../package.json";

const BUTTERCUP_MOBILE_PIWIK_ID = 3;

let __tracker;

export function getTracker() {
    if (!__tracker) {
        // Track Launches (anonymous)
        __tracker = new PiwikTracker(BUTTERCUP_MOBILE_PIWIK_ID, "https://analytics.buttercup.pw/piwik.php");
    }
    return __tracker;
}

export function trackApplicationLaunch() {
    const piwik = getTracker();
    piwik
        .track("Launch", {
            version: packageInfo.info
        })
        .catch(err => {
            console.log("Tracking failed");
            console.log(err);
        });
}
