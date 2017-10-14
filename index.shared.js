import "./shim.js";
import React, { Component } from "react";
import { AppRegistry } from "react-native";
import { Provider } from "react-redux";
import * as Buttercup from "buttercup-web";
import { createWebDAVAdapter } from "@buttercup/mobile-compat";
import "./source/compat/DropboxDatasource.js";
import { patchCrypto, patchKeyDerivation } from "./source/library/crypto.js";
import { getSharedArchiveManager } from "./source/library/buttercup.js";
import { trackApplicationLaunch } from "./source/library/analytics.js";
import { initialiseSessionMonitoring } from "./source/global/session.js";
import { smartFetch } from "./source/library/network.js";
import store from "./source/store.js";
import App from "./source/routing.js";

export default class ButtercupShared extends Component {
    constructor(...args) {
        super(...args);
        // Setup native key derivation immediately
        patchKeyDerivation();
        // Setup native crypto
        patchCrypto();
        // Use native `fetch` for requests
        createWebDAVAdapter.setFetchMethod(smartFetch);
        Buttercup.vendor.webdavFS.setFetchMethod(smartFetch);
        // Initialise the manager
        getSharedArchiveManager().rehydrate();
        // Watch app activity
        // initialiseSessionMonitoring();
        // Deferred items
        setTimeout(() => {
            // trackApplicationLaunch();
        }, 250);
    }

    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
}

AppRegistry.registerComponent("Buttercup", () => ButtercupShared);
