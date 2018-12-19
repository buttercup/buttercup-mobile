import { NavigationActions } from "react-navigation";
import { AppNavigator } from "../routing.js";
import {
    NAVIGATE_ADD_ARCHIVE,
    NAVIGATE_SEARCH_ARCHIVES,
    NAVIGATE_BACK,
    NAVIGATE_ENTRY,
    NAVIGATE_GROUPS,
    NAVIGATE_LOCK_PAGE,
    NAVIGATE_NEW_ENTRY,
    NAVIGATE_NEW_META,
    NAVIGATE_POPUP_BROWSER,
    NAVIGATE_REMOTE_CONNECT,
    NAVIGATE_REMOTE_EXPLORER,
    NAVIGATE_ROOT
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
        case NAVIGATE_SEARCH_ARCHIVES: {
            return AppNavigator.router.getStateForAction(
                NavigationActions.navigate({routeName: "SearchArchives"}),
                state
            )
        }
        case NAVIGATE_REMOTE_CONNECT: {
            const { title } = action.payload;
            return AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: "RemoteConnect", params: { title } }),
                state
            );
        }
        case NAVIGATE_REMOTE_EXPLORER: {
            const { title } = action.payload;
            return AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: "RemoteExplorer", params: { title } }),
                state
            );
        }
        case NAVIGATE_LOCK_PAGE: {
            return AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: "LockPage" }),
                state
            );
        }
        case NAVIGATE_POPUP_BROWSER: {
            const { title } = action.payload;
            return AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: "PopupBrowser", params: { title } }),
                state
            );
        }
        case NAVIGATE_GROUPS: {
            const { id: groupID, title, isTrash = false } = action.payload;
            return AppNavigator.router.getStateForAction(
                NavigationActions.navigate({
                    routeName: "GroupsPage",
                    params: { groupID, title, isTrash }
                }),
                state
            );
        }
        case NAVIGATE_BACK: {
            return AppNavigator.router.getStateForAction(NavigationActions.back(), state);
        }
        case NAVIGATE_ROOT: {
            return getInitialState();
        }

        default:
            return AppNavigator.router.getStateForAction(action, state);
    }
}
