import ApplicationState from "./ApplicationState.js";
import ArchiveSession from "./ArchiveSession.js";

let __sharedApplicationState,
    __sharedArchiveSession;

export function getSharedApplicationState() {
    if (!__sharedApplicationState) {
        __sharedApplicationState = new ApplicationState();
    }
    return __sharedApplicationState;
}

export function getSharedArchiveSession() {
    if (!__sharedArchiveSession) {
        __sharedArchiveSession = new ArchiveSession();
    }
    return __sharedArchiveSession;
}

export function initialiseSessionMonitoring() {
    const session = getSharedArchiveSession();
    const appState = getSharedApplicationState();
    appState.on("applicationInactive", () => {
        session.startTrackingInactivity();
    });
    appState.on("applicationActive", () => {
        session.stopTrackingInactivity();
    });
}
