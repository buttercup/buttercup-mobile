import { NavigationActions } from "react-navigation";
import { AppNavigator } from "../routing.js";
import {
    NAVIGATE_ADD_ARCHIVE,
    NAVIGATE_ARCHIVE_CONTENTS,
    NAVIGATE_BACK,
    NAVIGATE_ENTRY,
    NAVIGATE_NEW_ENTRY,
    NAVIGATE_NEW_META,
    NAVIGATE_REMOTE_CONNECT
} from "../actions/types.js";

function getInitialState() {
    const firstAction = AppNavigator.router.getActionForPathAndParams("Home");
    const initialNavState = AppNavigator.router.getStateForAction(firstAction);
    return initialNavState;
    // return AppNavigator.router.getStateForAction(
    //     firstAction,
    //     tempNavState
    // );
}

export default function routesReducer(state = getInitialState(), action = {}) {
    switch (action.type) {
        case NAVIGATE_ARCHIVE_CONTENTS: {
            const { title } = action.payload;
            return AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: "ArchiveContents", params: { title } }),
                state
            );
        }
        case NAVIGATE_ENTRY: {
            const { title } = action.payload;
            return AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: "Entry", params: { title } }),
                state
            );
        }
        case NAVIGATE_NEW_ENTRY: {
            return AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: "NewEntry" }),
                state
            );
        }
        case NAVIGATE_NEW_META: {
            return AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: "AddMeta" }),
                state
            );
        }
        case NAVIGATE_ADD_ARCHIVE: {
            return AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: "AddArchive" }),
                state
            );
        }
        case NAVIGATE_REMOTE_CONNECT: {
            const { title } = action.payload;
            return AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: "RemoteConnect", params: { title } }),
                state
            );
        }
        case NAVIGATE_BACK: {
            return AppNavigator.router.getStateForAction(
                NavigationActions.back(),
                state
            );
        }

        default:
            return AppNavigator.router.getStateForAction(action, state);
    }
}
