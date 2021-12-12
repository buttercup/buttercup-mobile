import { AppState, AppStateStatus } from "react-native";

type ActivityCallback = (inactivity: number) => void;

const __activityCallbacks: Array<ActivityCallback> = [];

function handleActivity(duration: number) {
    __activityCallbacks.forEach(cb => {
        cb(duration);
    });
}

export function initialise() {
    let currentState: AppStateStatus = AppState.currentState,
        lastChangeTime: number = Date.now();
    AppState.addEventListener("change", nextAppState => {
        if (
            (currentState === "inactive" || currentState === "background") &&
            nextAppState === "active"
        ) {
            handleActivity(Date.now() - lastChangeTime);
        }
        currentState = nextAppState;
        lastChangeTime = Date.now();
    });
}

export function registerActivityCallback(callback: ActivityCallback): () => void {
    __activityCallbacks.push(callback);
    return () => {
        const ind = __activityCallbacks.indexOf(callback);
        if (ind >= 0) {
            __activityCallbacks.splice(ind, 1);
        }
    };
}
