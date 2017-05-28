import React from "react";
import { connect } from "react-redux";
import { Router, Scene } from "react-native-router-flux";
import Archives from "./components/Archives.js";
import AddArchivePage from "./containers/AddArchivePage.js";

const RouterWithRedux = connect()(Router);

export function getRouter() {
    return (
        <RouterWithRedux>
            <Scene key="root">
                <Scene key="archives" component={Archives} initial={true} hideNavBar={true} />
                <Scene key="addArchive" component={AddArchivePage} hideNavBar={false} title="Add Archive" />
            </Scene>
        </RouterWithRedux>
    );
}
