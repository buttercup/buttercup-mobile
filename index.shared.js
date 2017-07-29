import "./shim.js";
import React, { Component } from "react";
import { Provider } from "react-redux";
import { createWebDAVAdapter } from "@buttercup/mobile-compat";
import { getRouter } from "./source/routing.js";
import { patchKeyDerivation } from "./source/library/buttercup.js";
import { getSharedArchiveManager } from "./source/library/buttercup.js";
import * as Buttercup from "buttercup-web";

import store from "./source/store.js";

export default class ButtercupShared extends Component {

    constructor(...args) {
        super(...args);
        // Setup native key derivation immediately
        patchKeyDerivation();
        // Use native `fetch` for requests
        createWebDAVAdapter.setFetchMethod(fetch);
        Buttercup.vendor.webdavFS.setFetchMethod(fetch);
        // Initialise the manager
        getSharedArchiveManager().rehydrate();
    }

    render() {
        return (
            <Provider store={store}>
                {getRouter()}
            </Provider>
        );
    }

}
