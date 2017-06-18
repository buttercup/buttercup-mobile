import React from "react";
import { connect } from "react-redux";
import { Actions, Router, Scene } from "react-native-router-flux";
import ArchivesPage from "./components/ArchivesPage.js";
import AddArchivePage from "./containers/AddArchivePage.js";
import RemoteConnectPage from "./containers/RemoteConnectPage.js";
import RemoteExplorerPage from "./containers/RemoteExplorerPage.js";
import { showNewPrompt } from "./actions/RemoteExplorerPage.js";

import { dispatch } from "./store.js";

const RouterWithRedux = connect()(Router);

export function getRouter() {
    return (
        <RouterWithRedux>
            <Scene key="root">
                <Scene
                    key="archives"
                    component={ArchivesPage}
                    initial={true}
                    hideNavBar={false}
                    title="Buttercup"
                    rightTitle="🔐"
                    onRight={() => Actions.addArchive()}
                    leftTitle="⚙️"
                    onLeft={() => alert("Settings - WIP")}
                    />
                <Scene
                    key="addArchive"
                    component={AddArchivePage}
                    hideNavBar={false}
                    title="Add Archive"
                    />
                <Scene
                    key="remoteConnect"
                    component={RemoteConnectPage}
                    hideNavBar={false}
                    title="Remote Connection"
                    />
                <Scene
                    key="remoteExplorer"
                    component={RemoteExplorerPage}
                    hideNavBar={false}
                    rightTitle="New"
                    onRight={() => dispatch(showNewPrompt())}
                    title="Choose Archive"
                    />
            </Scene>
        </RouterWithRedux>
    );
}
