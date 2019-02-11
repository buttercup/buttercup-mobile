import "./shim.js";
import React, { Component, Fragment } from "react";
import { AppRegistry } from "react-native";
import { Provider } from "react-redux";
import DropdownAlert from "react-native-dropdownalert";
import { getSharedArchiveManager } from "./source/library/buttercup.js";
import store from "./source/store.js";
import App from "./source/autofill/routing.js";
import { setNotificationFunction } from "./source/global/notify.js";
import { patchCrypto } from "./source/library/crypto";
import { initialiseSessionMonitoring } from "./source/global/session.js";

export default class ButtercupAutoFill extends Component {
    constructor(...args) {
        super(...args);

        // Setup native crypto
        patchCrypto();

        // Initialise the manager
        getSharedArchiveManager().rehydrate();

        // Setup notifications
        setNotificationFunction((type, title, message) => {
            if (this.dropdown) {
                this.dropdown.alertWithType(type, title, message);
            }
        });

        // Watch app activity
        initialiseSessionMonitoring();
    }

    render() {
        return (
            <Provider store={store}>
                <Fragment>
                    <App screenProps={this.props} />
                    <DropdownAlert ref={ref => (this.dropdown = ref)} closeInterval={8000} />
                </Fragment>
            </Provider>
        );
    }
}

AppRegistry.registerComponent("ButtercupAutoFill", () => ButtercupAutoFill);
