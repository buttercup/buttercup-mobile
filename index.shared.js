import "./shim.js";
import "react-native-browser-polyfill";
import React, { Component } from "react";
import { AppRegistry } from "react-native";
import { Provider } from "react-redux";
import { createWebDAVAdapter } from "@buttercup/mobile-compat";
import { patchCrypto, patchKeyDerivation } from "./source/library/crypto.js";
import { getSharedArchiveManager } from "./source/library/buttercup.js";
import * as Buttercup from "buttercup-web";
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
        createWebDAVAdapter.setFetchMethod(fetch);
        Buttercup.vendor.webdavFS.setFetchMethod(fetch);
        // Initialise the manager
        getSharedArchiveManager().rehydrate();
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
