import React from "react";
import {
    StackNavigator,
    addNavigationHelpers
} from "react-navigation";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ArchivesPage from "./components/ArchivesPage.js";
import ArchiveContentsPage from "./containers/ArchiveContentsPage.js";
import EntryPage from "./containers/EntryPage.js";
import NewEntryPage from "./containers/NewEntryPage.js";
import AddMetaPage from "./containers/AddMetaPage.js";
import AddArchivePage from "./containers/AddArchivePage.js";
import RemoteConnectPage from "./containers/RemoteConnectPage.js";
import RemoteExplorerPage from "./containers/RemoteExplorerPage.js";

export const AppNavigator = StackNavigator({
    Home: { screen: ArchivesPage },
    ArchiveContents: { screen: ArchiveContentsPage },
    Entry: { screen: EntryPage },
    NewEntry: { screen: NewEntryPage },
    AddMeta: { screen: AddMetaPage },
    AddArchive: { screen: AddArchivePage },
    RemoteConnect: { screen: RemoteConnectPage },
    RemoteExplorer: { screen: RemoteExplorerPage }
});

const AppWithNavigationState = ({ dispatch, nav }) => (
    <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
    dispatch:           PropTypes.func.isRequired,
    nav:                PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    nav:                state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);

// import React from "react";
// import { connect } from "react-redux";
// import {
//     Image,
//     StyleSheet,
//     Text,
//     View
// } from "react-native";
// import { Actions, Router, Scene } from "react-native-router-flux";
// import ArchivesPage from "./components/ArchivesPage.js";
// import AddArchivePage from "./containers/AddArchivePage.js";
// import RemoteConnectPage from "./containers/RemoteConnectPage.js";
// import RemoteExplorerPage from "./containers/RemoteExplorerPage.js";
// import ArchiveContentsPage from "./containers/ArchiveContentsPage.js";
// import AddMetaPage from "./containers/AddMetaPage.js";
// import EntryPage from "./containers/EntryPage.js";
// import NewEntryPage from "./containers/NewEntryPage.js";
// import { showNewPrompt } from "./actions/RemoteExplorerPage.js";
// import { showArchivesPageRightSheet } from "./shared/sheets.js";
// import { saveNewEntry, saveNewMeta } from "./shared/entry.js";
// import { EntryRouteNormalProps } from "./shared/dynamicRoutes.js";

// import { dispatch } from "./store.js";

// const BUTTERCUP_LOGO = require("../resources/images/buttercup-header.png");

// const styles = StyleSheet.create({
//     rootHeaderContainer: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         width: "100%",
//         height: 25
//     },
//     rooterHeaderLogo: {
//         flex: 1,
//         height: 25,
//         width: 129,
//         marginBottom: -12
//     }
// });

// export function getRouter() {
//     const RouterWithRedux = connect()(Router);
//     return (
//         <RouterWithRedux>
//             <Scene key="root">
//                 <Scene
//                     key="archives"
//                     component={ArchivesPage}
//                     initial={true}
//                     hideNavBar={false}
//                     title=""
//                     renderTitle={() => (
//                         <View style={styles.rootHeaderContainer}>
//                             <Image
//                                 source={BUTTERCUP_LOGO}
//                                 style={styles.rooterHeaderLogo}
//                                 resizeMode="contain"
//                                 />
//                         </View>
//                     )}
//                     rightTitle="🔐"
//                     onRight={showArchivesPageRightSheet}
//                     leftTitle="⚙️"
//                     onLeft={() => alert("Settings - WIP")}
//                     />
//                 <Scene
//                     key="addArchive"
//                     component={AddArchivePage}
//                     hideNavBar={false}
//                     title="Add Archive"
//                     backTitle=""
//                     />
//                 <Scene
//                     key="remoteConnect"
//                     component={RemoteConnectPage}
//                     hideNavBar={false}
//                     title="Remote Connection"
//                     />
//                 <Scene
//                     key="remoteExplorer"
//                     component={RemoteExplorerPage}
//                     hideNavBar={false}
//                     rightTitle="New"
//                     onRight={() => dispatch(showNewPrompt())}
//                     title="Choose Archive"
//                     />
//                 <Scene
//                     key="archiveContents"
//                     component={ArchiveContentsPage}
//                     hideNavBar={false}
//                     title=""
//                     backTitle=""
//                     />
//                 <Scene
//                     key="entry"
//                     component={EntryPage}
//                     hideNavBar={false}
//                     title=""
//                     {...EntryRouteNormalProps}
//                     />
//                 <Scene
//                     key="addMeta"
//                     component={AddMetaPage}
//                     hideNavBar={false}
//                     title="Add New Meta"
//                     backTitle="Cancel"
//                     rightTitle="Add"
//                     onRight={saveNewMeta}
//                     />
//                 <Scene
//                     key="newEntry"
//                     component={NewEntryPage}
//                     hideNavBar={false}
//                     title="New Entry"
//                     backTitle="Cancel"
//                     rightTitle="Create"
//                     onRight={saveNewEntry}
//                     />
//             </Scene>
//         </RouterWithRedux>
//     );
// }
