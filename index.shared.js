import "./shim.js";
import React, { Component, Fragment } from "react";
import { I18nextProvider } from "react-i18next";
import { AppRegistry } from "react-native";
import { Provider } from "react-redux";
import DropdownAlert from "react-native-dropdownalert";
import { patchCrypto } from "./source/library/crypto.js";
import { getSharedArchiveManager } from "./source/library/buttercup.js";
import store from "./source/store.js";
import ButtercupApp from "./source/routing.js";
import AutoFillApp from "./source/autofill/routing.js";
import { setNotificationFunction } from "./source/global/notify.js";
import { migrateStorage } from "./source/library/storage.js";
import i18n from "./source/shared/i18n";

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
                <I18nextProvider i18n={i18n}>
                    {/* Show the main app stack when NOT in autofill mode */}
                    {!this.props.isContextAutoFill && <ButtercupApp />}

                    {/* Show the AutoFill app stack when IN autofill mode */}
                    {!!this.props.isContextAutoFill && <AutoFillApp screenProps={this.props} />}
                    <DropdownAlert ref={ref => (this.dropdown = ref)} closeInterval={8000} />
                </I18nextProvider>
            </Provider>
        );
    }
}

AppRegistry.registerComponent("Buttercup", () => ButtercupShared);
