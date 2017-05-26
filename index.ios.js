import React, { Component } from "react";
import { AppRegistry } from "react-native";
import { Provider } from "react-redux";
import { getRouter } from "./source/routing.js";
import { patchKeyDerivation } from "./source/library/buttercup.js";

import store from "./source/store.js";

export default class Buttercup extends Component {

    constructor(...args) {
        super(...args);
        // Setup native key derivation immediately
        patchKeyDerivation();
    }

    render() {
        return (
            <Provider store={store}>
                {getRouter()}
            </Provider>
        );
    }

}

AppRegistry.registerComponent('Buttercup', () => Buttercup);
