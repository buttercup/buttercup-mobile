import EventEmitter from "events";
import { lockAllArchives } from "../shared/archives.js";
import { backToRoot, hideLockPage, showLockPage } from "../shared/nav.js";

export const ARCHIVE_SESSION_DEFAULT_TIMEOUT_MIN = 5;

function minutesToMilliseconds(min) {
    return min * 60 * 1000;
}

export default class ArchiveSession extends EventEmitter {

    constructor() {
        super();
        this._timer = null;
        this._timeout = minutesToMilliseconds(ARCHIVE_SESSION_DEFAULT_TIMEOUT_MIN);
        this._modal = null;
    }

    get timeout() {
        return this._timeout;
    }

    set timeout(timeoutMs) {
        this._timeout = timeoutMs;
    }

    handleDeactivation() {
        console.log("App sent to background");
        // show lock modal
        showLockPage();
    }

    handleReactivation() {
        console.log("App sent to foreground");
        // hide lock modal
        hideLockPage();
    }

    handleTimeout() {
        this.emit("sessionTimeout");
        console.log("Session time-out");
        // lock all archives
        backToRoot();
        lockAllArchives();
    }

    startTrackingInactivity() {
        console.log("Inactive session timer started");
        clearTimeout(this._timer);
        this.handleDeactivation();
        this._timer = setTimeout(() => {
            this.handleTimeout();
        }, this.timeout);
    }

    stopTrackingInactivity() {
        console.log("Inactive session timer stopped");
        clearTimeout(this._timer);
        this.handleReactivation();
    }

}
