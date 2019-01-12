import "./shim.js";
import React, { Component, Fragment } from "react";
import { AppRegistry, View, Button, Text } from "react-native";
import { Provider } from "react-redux";
import DropdownAlert from "react-native-dropdownalert";
import { getSharedArchiveManager } from "./source/library/buttercup.js";
import { completeAutoFillWithEntry, cancelAutoFill } from "./source/shared/autofill";
import store from "./source/store.js";
import App from "./source/autofill/routing.js";
import { setNotificationFunction } from "./source/global/notify.js";
import { patchCrypto } from "./source/library/crypto";
import { unlockAllTouchEnabledArchives } from "./source/shared/archives";

export default class ButtercupAutoFill extends Component {
    constructor(...args) {
        super(...args);

        // Setup native crypto
        patchCrypto();

        // Initialise the manager
        getSharedArchiveManager()
            .rehydrate()
            .then(result => {
                // unlockAllTouchEnabledArchives()
            });

        // Setup notifications
        setNotificationFunction((type, title, message) => {
            if (this.dropdown) {
                this.dropdown.alertWithType(type, title, message);
            }
        });
    }

    componentDidMount() {
        // console.log("PROPS: Mount", this.props);

        if (this.props.credentialIdentity) {
            // AutoFill UI Started due to failure to find match from QuickBar suggestion
            // console.log("Start with Credential Identity", this.props.credentialIdentity);
        } else if (this.props.serviceIdentifiers) {
            // AutoFill UI Started with a list of URLs to prioritize potential credentials with
            // console.log("Start with Service Identifiers", this.props.serviceIdentifiers);
        }
    }

    onPressTestAutoFillComplete() {
        const entry = {};
        completeAutoFillWithEntry(entry);
    }

    onPressTestCancelAutoFill() {
        cancelAutoFill();
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
