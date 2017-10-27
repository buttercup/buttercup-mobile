import ButtercupShared from "./index.shared.js";
import React from "react";
import { AppRegistry } from "react-native";
import { initialiseSessionMonitoring } from "./source/global/session.js";

export default class Buttercup extends ButtercupShared {
    constructor(...args) {
        super(...args);
        // Watch app activity
        initialiseSessionMonitoring();
    }
}

AppRegistry.registerComponent("Buttercup", () => Buttercup);
