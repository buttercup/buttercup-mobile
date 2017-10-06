import EventEmitter from "events";
import { lockAllArchives } from "../shared/archives.js";
import { backToRoot } from "../shared/nav.js";

export const ARCHIVE_SESSION_DEFAULT_TIMEOUT_MIN = 5;

function minutesToMilliseconds(min) {
    return min * 60 * 1000;
}

export default class ArchiveSession extends EventEmitter {

    constructor() {
        super();
        this._timer = null;
        this._timeout = minutesToMilliseconds(ARCHIVE_SESSION_DEFAULT_TIMEOUT_MIN);
    }

    get timeout() {
        return this._timeout;
    }

    set timeout(timeoutMs) {
        this._timeout = timeoutMs;
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
        this._timer = setTimeout(() => {
            this.handleTimeout();
        }, this.timeout);
    }

    stopTrackingInactivity() {
        console.log("Inactive session timer stopped");
        clearTimeout(this._timer);
    }

}
