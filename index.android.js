import React from "react";
import { AppRegistry, BackHandler } from "react-native";
import ButtercupShared from "./index.shared.js";
import { navigateBackIfPossible } from "./source/shared/nav.js";
import { resetAppState } from "./source/shared/app.js";

export default class Buttercup extends ButtercupShared {
    constructor(...args) {
        super(...args);
        // Android specific launch code
        this.prepareBackButtonHandlers();
    }

    prepareBackButtonHandlers() {
        let timer = null;
        // Listen for the hardware back button
        BackHandler.addEventListener("hardwareBackPress", () => {
            if (timer === null) {
                const willGoBack = navigateBackIfPossible();
                if (willGoBack) {
                    // We'll navigate back, so debounce this function
                    timer = setTimeout(() => {
                        timer = null;
                    }, 400);
                } else {
                    // wipe our state
                    resetAppState();
                    return false; // not handled, let the device do its thing
                }
            }
            return true; // handled
        });
    }
}

AppRegistry.registerComponent("Buttercup", () => Buttercup);
