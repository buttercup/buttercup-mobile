import "./shim.js";
import React, { Component, Fragment } from "react";
import { AppRegistry } from "react-native";
import { Provider } from "react-redux";
import DropdownAlert from "react-native-dropdownalert";
import { patchCrypto } from "./source/library/crypto.js";
import { getSharedArchiveManager } from "./source/library/buttercup.js";
import store from "./source/store.js";
import App from "./source/routing.js";
import { setNotificationFunction } from "./source/global/notify.js";
import { migrateStorage } from "./source/library/storage.js";

export default class ButtercupShared extends Component {
    constructor(...args) {
        super(...args);
        // Setup native crypto
        patchCrypto();

        // Ensure that the users storage has migrated to Keychain
        migrateStorage().then(() => {
            // Initialise the manager
            getSharedArchiveManager().rehydrate();
        });

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
                    <DropdownAlert ref={ref => (this.dropdown = ref)} closeInterval={8000} />
                </Fragment>
            </Provider>
        );
    }
}

AppRegistry.registerComponent("Buttercup", () => ButtercupShared);
