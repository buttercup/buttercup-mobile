import React from "react";
import { connect } from "react-redux";
import { Router, Scene } from "react-native-router-flux";
import Archives from "./components/Archives.js";
import AddArchive from "./components/AddArchive.js";

const RouterWithRedux = connect()(Router);

export function getRouter() {
    return (
        <RouterWithRedux>
            <Scene key="root">
                <Scene key="archives" initial={true} hideNavBar={true} component={Archives} />
                <Scene key="addArchive" hideNavBar={false} component={AddArchive} />
            </Scene>
        </RouterWithRedux>
    );
}
