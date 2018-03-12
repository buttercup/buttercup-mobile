import "./shim.js";
import React, { Component, Fragment } from "react";
import { AppRegistry } from "react-native";
import { Provider } from "react-redux";
import DropdownAlert from "react-native-dropdownalert";
import * as Buttercup from "buttercup-web";
import { createWebDAVAdapter } from "@buttercup/mobile-compat";
import "./source/compat/DropboxDatasource.js";
import { patchCrypto, patchKeyDerivation } from "./source/library/crypto.js";
import { getSharedArchiveManager } from "./source/library/buttercup.js";
import { smartFetch } from "./source/library/network.js";
import store from "./source/store.js";
import App from "./source/routing.js";
import { setNotificationFunction } from "./source/global/notify.js";

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
        // Setup notifications
        setNotificationFunction((type, title, message) => {
            if (this.dropdown) {
                this.dropdown.alertWithType(type, title, message);
            }
        });
    }

    render() {
        return (
            <Provider store={store}>
                <Fragment>
                    <App />
                    <DropdownAlert ref={ref => (this.dropdown = ref)} />
                </Fragment>
            </Provider>
        );
    }
}

AppRegistry.registerComponent("Buttercup", () => ButtercupShared);
