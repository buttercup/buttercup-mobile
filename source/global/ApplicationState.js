import { AppState } from "react-native";
import EventEmitter from "events";

export default class ApplicationState extends EventEmitter {
    constructor() {
        super();
        this._applicationState = "active";
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
        AppState.addEventListener("change", this.handleAppStateChange);
    }

    get state() {
        return this._applicationState;
    }

    destroy() {
        AppState.removeEventListener("change", this.handleAppStateChange);
    }

    handleAppStateChange(nextAppState) {
        const resolvedState = /^(inactive|background)$/.test(nextAppState) ? "inactive" : "active";
        if (this.state !== resolvedState) {
            this._applicationState = resolvedState;
            this.emit("stateChange", resolvedState);
            if (resolvedState === "active") {
                this.emit("applicationActive");
            } else {
                this.emit("applicationInactive");
            }
            console.log(`Application state changed: ${resolvedState}`);
        }
    }
}
