import { NavigationActions } from "react-navigation";
import { AppNavigator } from "../routing.js";
import {
    NAVIGATE_ARCHIVE_CONTENTS
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
        // focus action is dispatched when a new screen comes into focus
        // case ActionConst.FOCUS:
        //     return {
        //         ...state,
        //         scene: action.scene,
        //     };
        case NAVIGATE_ARCHIVE_CONTENTS:
            const { title } = action.payload;
            return AppNavigator.router.getStateForAction(
                NavigationActions.navigate({ routeName: "ArchiveContents", params: { title } }),
                state
            );

        default:
            return AppNavigator.router.getStateForAction(action, state);
    }
}
