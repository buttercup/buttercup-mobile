import "./shim.js";
import React, { Component, Fragment } from "react";
import { AppRegistry } from "react-native";
import { Provider } from "react-redux";
import DropdownAlert from "react-native-dropdownalert";
import { vendor as ButtercupVendor } from "./source/library/buttercupCore.js";
import { createWebDAVAdapter } from "@buttercup/mobile-compat";
import "./source/compat/DropboxDatasource.js";
import { patchCrypto } from "./source/library/crypto.js";
import { getSharedArchiveManager } from "./source/library/buttercup.js";
import { smartFetch } from "./source/library/network.js";
import store from "./source/store.js";
import App from "./source/routing.js";
import { setNotificationFunction } from "./source/global/notify.js";
import { initialisePermanentStorage } from "./source/library/storage.js";

export default class ButtercupShared extends Component {
    constructor(...args) {
        super(...args);
        // Setup native crypto
        patchCrypto();
        // Use native `fetch` for requests
        createWebDAVAdapter.setFetchMethod(smartFetch);
        ButtercupVendor.webdav.setFetchMethod(smartFetch);
        // Initialise storage
        initialisePermanentStorage();
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
