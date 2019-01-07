import "./shim.js";
import React, { Component, Fragment } from "react";
import { AppRegistry, View, Button, Text } from "react-native";
import { Provider } from "react-redux";
import { completeAutoFillWithEntry, cancelAutoFill } from "./source/shared/autofill";

export default class ButtercupAutoFill extends Component {
    constructor(...args) {
        super(...args);
    }

    componentDidMount() {
        console.log("PROPS: Mount", this.props);

        if (this.props.credentialIdentity) {
            // AutoFill UI Started due to failure to find match from QuickBar suggestion
            console.log("Start with Credential Identity", this.props.credentialIdentity);
        } else if (this.props.serviceIdentifiers) {
            // AutoFill UI Started with a list of URLs to prioritize potential credentials with
            console.log("Start with Service Identifiers", this.props.serviceIdentifiers);
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
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Button onPress={this.onPressTestAutoFillComplete} title={"Test AutoFill Complete"}>
                    Test AutoFill Complete
                </Button>

                <Button onPress={this.onPressTestCancelAutoFill} title={"Test AutoFill Cancel"}>
                    Test AutoFill Cancel
                </Button>
            </View>
        );
    }
}

AppRegistry.registerComponent("ButtercupAutoFill", () => ButtercupAutoFill);
