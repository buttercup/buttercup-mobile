import React from "react";
import { connect } from "react-redux";
import { Router, Scene } from "react-native-router-flux";
import Archives from "./components/Archives.js";
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
                <Scene key="archives" component={Archives} initial={true} hideNavBar={true} />
                <Scene key="addArchive" component={AddArchivePage} hideNavBar={false} title="Add Archive" />
                <Scene key="remoteConnect" component={RemoteConnectPage} hideNavBar={false} title="Remote Connection" />
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
